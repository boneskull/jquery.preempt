/**
 * TODO: Write tests against before/after/forcePropagate/data options as well
 * as multi-element jQuery objects
 */
'use strict';

var expect = chai.expect;

$.fn.simulateClick = function simulateClick() {
  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent("click", true, true, window);
  this[0].dispatchEvent(evt);
  return this;
};

describe('preempt plugin', function () {
  var $a;
  beforeEach(function () {
    $a =
      $('<a href="javascript:globalSpy()" onclick="return this.clickSpy(event)"></a>');
    $a[0].clickSpy = sinon.spy();
    window.globalSpy = sinon.spy();
  });

  describe('fixture', function () {
    it('should execute onclick spy upon click', function () {
      $a.simulateClick();
      expect($a[0].clickSpy).to.have.been.called;
    });
    it('should execute href spy upon click', function () {
      $a.simulateClick();
      expect(window.globalSpy).to.have.been.called;
    });
  });

  it('should remove the "onclick" attribute from the node', function () {
    $a.preempt({
      attr: 'onclick',
      event: 'click'
    });
    expect($a.attr('onclick')).to.be.undefined;
  });

  it('should execute the callback', function () {
    var handler = sinon.spy();
    $a.preempt({
      attr: 'onclick',
      event: 'click'
    }, handler)
      .simulateClick();
    expect(handler).to.have.been.calledOnce;
    expect($a[0].clickSpy).to.have.been.calledOnce;
  });

  it('should grok JS in href attributes', function () {
    var handler = sinon.spy();
    $a.preempt({
      attr: 'href',
      event: 'click'
    }, handler)
      .simulateClick();
    expect(handler).to.have.been.calledOnce;
    expect($a[0].clickSpy).to.have.been.calledOnce;
  });

  it('should die if evaluated JS is bad', function () {
    $a[0].clickSpy = sinon.stub().throws();
    $a.preempt({
      attr: 'onclick',
      event: 'click'
    });
    expect(function () {
      // must use trigger() here as simulateClick() does not throw
      $a.trigger('click');
    }).to.throw();
  });

  it('should die if no options passed', function () {
    expect(function () {
      $a.preempt();
    }).to.throw();
  });

  it('should die if no attr and/or no event passed', function () {
    expect(function () {
      $a.preempt({attr: 'onclick'});
    }).to.throw(Error);
    expect(function () {
      $a.preempt({event: 'click'});
    }).to.throw(Error);
  });

  it('should restore the original behavior', function () {
    var handler = sinon.spy();
    $a.preempt({
      attr: 'onclick',
      event: 'click'
    }, handler)
      .preempt({
        attr: 'onclick',
        event: 'click',
        restore: true
      })
      .simulateClick();
    expect(handler).not.to.have.been.called;
    expect($a[0].clickSpy).to.have.been.calledOnce;
  });

  it('should restore the original behavior for href attributes', function () {
    var handler = sinon.spy();
    $a.preempt({
      attr: 'href',
      event: 'click'
    }, handler)
      .preempt({
        attr: 'href',
        event: 'click',
        restore: true
      })
      .simulateClick();
    expect($a.attr('href')).to.equal('javascript:globalSpy()');
    expect(handler).not.to.have.been.called;
    expect($a[0].clickSpy).to.have.been.called;
  });

  it('should save information about itself to the jQuery object data',
    function () {
      $a.preempt({
        attr: 'onclick',
        event: 'click'
      });
      expect($a.data('plugin.preempt')).to.be.a('Object');
      expect($a.data('plugin.preempt.onclick.click.js')).to.equal('return this.clickSpy(event)');
    });

  it('should not leak memory than it has to after restoring', function () {
    $a.preempt({
      attr: 'onclick',
      event: 'click'
    })
      .preempt({
        attr: 'onclick',
        event: 'click',
        restore: true
      });
    expect($a.data('plugin.preempt.onclick.click.js')).to.be.undefined;
  });

  it('should prioritize "before" over passed callback', function () {
    var spy1 = sinon.spy(),
      spy2 = sinon.spy();
    $a.preempt({
      attr: 'onclick',
      event: 'click',
      before: spy1
    }, spy2)
      .simulateClick();
    expect(spy1).to.have.been.calledOnce;
    expect(spy2).not.to.have.been.called;
  });

  it('should do absolutely nothing if attempted to restore without an instance',
    function () {
      var spy = sinon.spy();
      $a.preempt({
        attr: 'onclick',
        event: 'click',
        restore: true
      }, spy)
        .simulateClick();
      expect(spy).not.to.have.been.called;
      expect($.isEmptyObject($a.data())).to.be.true;
    });

  it('should stop propagation if the before() function returns false',
    function () {
      var stub = sinon.stub().returns(false);
      $a.preempt({
        attr: 'onclick',
        event: 'click',
        before: stub
      })
        .simulateClick();
      expect(stub).to.have.been.called;
      expect($a[0].clickSpy).not.to.have.been.called;
      expect(window.globalSpy).not.to.have.been.called;
    });

  it('should stop immediate propagation (but not prevent default) if before() stops immediate propagation',
    function () {
      var handler = function handler(evt) {
          evt.stopImmediatePropagation();
        },
        spy = sinon.spy(handler);
      $a.preempt({
        attr: 'onclick',
        event: 'click',
        before: spy
      })
        .simulateClick();
      expect(spy).to.have.been.called;
      expect($a[0].clickSpy).not.to.have.been.called;
      expect(window.globalSpy).to.have.been.called;
    });

  it('should stop propagation if the inline function returns false',
    function () {
      var spy = sinon.spy();
      $a[0].clickSpy = sinon.spy(function () {
        return false;
      });
      $a.preempt({
        attr: 'onclick',
        event: 'click',
        after: spy
      })
        .simulateClick();
      expect(spy).not.to.have.been.called;
      expect($a[0].clickSpy).to.have.been.called;
    });

    it('should continue propagation if the inline function returns false and forcePropagation is true',
    function () {
      var spy = sinon.spy();
      $a[0].clickSpy = sinon.spy(function () {
        return false;
      });
      $a.preempt({
        attr: 'onclick',
        event: 'click',
        after: spy,
        forcePropagation: true
      })
        .simulateClick();
      expect(spy).to.have.been.called;
      expect($a[0].clickSpy).to.have.been.called;
    });

   it('should stop propagation if inline function stops immediate propagation',
    function () {
      var spy = sinon.spy();
      $a[0].clickSpy = sinon.spy(function (evt) {
        evt.stopImmediatePropagation();
      });
      $a.preempt({
        attr: 'onclick',
        event: 'click',
        after: spy
      })
        .simulateClick();
      expect(spy).not.to.have.been.called;
      expect($a[0].clickSpy).to.have.been.called;
    });

  it('should execute before and after even if no JS is present', function() {
    var before = sinon.spy(),
      after = sinon.spy(),
      $a = $('<a></a>');
    $a.preempt({
      attr: 'onclick',
      event: 'click',
      before: before,
      after: after
    })
      .simulateClick();
    expect(before).to.have.been.called;
    expect(after).to.have.been.called;
  });

  it('should not reinit if we call the function twice', function() {
    var spy = sinon.spy($a.preempt.Preempt.prototype, 'init');
    $a.preempt({
      attr: 'onclick',
      event: 'click'
    });
    expect(spy).to.have.been.called;
    $a.preempt({
      attr: 'onclick',
      event: 'click'
    });
    expect(spy).to.have.been.calledOnce;

  });
});


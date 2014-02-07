/*jshint -W030, -W107*/
(function () {
  'use strict';

  var expect = chai.expect;

  describe('preempt plugin', function () {
    var $test_btn;
    beforeEach(function () {
      window.global_spy = sinon.spy();
      $test_btn = $('<button onclick="global_spy()"></button>');
      $('body').append($test_btn);
    });

    it('should remove the "onclick" attribute from the node', function () {
      $test_btn.preempt({
        attr: 'onclick',
        event: 'click'
      });
      expect($test_btn.attr('onclick')).to.be.undefined;
    });

    it('should execute the callback', function () {
      var handler = sinon.spy();
      $test_btn.preempt({
        attr: 'onclick',
        event: 'click'
      }, handler);
      $test_btn.trigger('click');
      sinon.assert.calledOnce(handler);
      sinon.assert.calledOnce(window.global_spy);
    });

    it('should grok JS in href attributes', function () {
      var $test_a = $('<a href="javascript:global_spy()"></a>'),
        handler = sinon.spy();
      $('body').append($test_a);
      $test_a.preempt({
        attr: 'href',
        event: 'click'
      }, handler);
      $test_a.trigger('click');
      sinon.assert.calledOnce(handler);
      sinon.assert.calledOnce(window.global_spy);
      $test_a.remove();
    });

    it('should die if evaluated JS is bad', function () {
      window.global_spy = function () {
        throw new Error();
      };
      $test_btn.preempt({
        attr: 'onclick',
        event: 'click'
      });
      expect(function () {
        $test_btn.trigger('click');
      }).to.throw(Error);
    });

    it('should restore the original behavior', function () {
      var handler = sinon.spy();
      $test_btn.preempt({
        attr: 'onclick',
        event: 'click'
      }, handler);
      $test_btn.preempt({
        attr: 'onclick',
        event: 'click',
        restore: true
      });
      $test_btn.trigger('click');
      sinon.assert.notCalled(handler);
      sinon.assert.calledOnce(window.global_spy);
    });

    it('should restore the original behavior for href attributes', function () {
      var $test_a = $('<a href="javascript:global_spy()"></a>'),
        handler = sinon.spy();
      $('body').append($test_a);
      $test_a.preempt({
        attr: 'href',
        event: 'click'
      }, handler);
      $test_a.preempt({
        attr: 'href',
        event: 'click',
        restore: true
      });
      $test_a.trigger('click');
      expect($test_a.attr('href')).to.equal('javascript:global_spy()');
      sinon.assert.notCalled(handler);
      // this is not allowed; see http://goo.gl/AszBjs
      //sinon.assert.calledOnce(window.global_spy);
      $test_a.remove();
    });

    it('should save information about itself to the jQuery object data',
      function () {
        $test_btn.preempt({
          attr: 'onclick',
          event: 'click'
        });
        expect($test_btn.data('plugin.preempt')).to.be.a('Object');
        expect($test_btn.data('plugin.preempt.onclick.click.js')).to.equal('global_spy()');
      });

    it('should not leak memory than it has to after restoring', function () {
      $test_btn.preempt({
        attr: 'onclick',
        event: 'click'
      });
      $test_btn.preempt({
        attr: 'onclick',
        event: 'click',
        restore: true
      });
      expect($test_btn.data('plugin.preempt.onclick.click.js')).to.be.undefined;
    });

  });

})();

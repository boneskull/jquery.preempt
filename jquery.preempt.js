/*jshint -W107*/

/**
 * @namespace preempt
 */

(function ($) {
  'use strict';

  /**
   * @description plugin identifier
   * @type {string}
   * @private
   * @const
   */
  var PLUGIN_NAME = 'preempt',

    /**
     * @description instance_id
     * @type {string}
     * @private
     */
      instance_id = "plugin." + PLUGIN_NAME,

    /**
     * Script URL prefix.  JSHint hates this.
     * @type {string}
     * @private
     * @const
     */
      SCRIPT_URL = 'javascript:',

    /**
     * @description Class representing an instance of the Preempt plugin.
     * @param {jQuery} element jQuery element to preempt
     * @private
     * @constructor
     */
      Preempt = function Preempt(element) {

      /**
       * Name of this plugin
       * @type {string}
       * @protected
       */
      this._name = PLUGIN_NAME;

      /**
       * jQuery element to preempt
       * @type {jQuery}
       * @protected
       */
      this._element = element;

      /**
       * Whether or not to prepend "javascript:" to the attr string when restoring
       * @type {boolean}
       * @protected
       */
      this._prefix = false;
    };

  /**
   * @description Replaces the inlined JS with an event handler which also eval's the inlined JS.
   * @param attr
   * @param new_evt
   * @param callback
   * @param js_id
   * @method
   * @throws Error
   */
  Preempt.prototype.init = function init(attr, new_evt, js_id, callback) {
    var el = this._element,
      js = el.attr(attr) || '',
      preemptor = function preemptor(evt) {
        callback.call(el, evt);
        /*jshint -W061*/
        return eval('(function(){ ' + js + '}).call(window);');
      };
    callback = callback || $.noop;

    if (js.indexOf(SCRIPT_URL) === 0) {
      this._prefix = true;
      js = js.substring(11);
    }

    el.removeAttr(attr)
      .off(new_evt)
      .on(new_evt, preemptor);

    // store it so we can easily restore it
    el.data(js_id, js);

  };

  /**
   *
   * @param attr
   * @param new_evt
   * @method
   * @param js_id
   */
  Preempt.prototype.restore = function restore(attr, new_evt, js_id) {
    var el = this._element,
      js = el.data(js_id);
    el.attr(attr, this._prefix ? SCRIPT_URL + js : js)
      .off(new_evt);
    el.removeData(js_id);
  };

  /**
   * @description Takes legacy inline JS (i.e. `onclick` and `href="javascript:..."` and creates an event handler to be run before the inlined code.
   * @todo Document more thoroughly.
   * @example
   *
   * // given <button onclick="doSomething()">do something</button>
   * // or <a href="javascript:doSomethingElse()">do something else</a>
   * $('button').preempt({
   *   attr: 'onclick',
   *   event: 'click',
   * }, function doSomethingBeforeSomething() {
   *   // do something else
   * });
   *
   * // restores the "onclick" attribute of the element
   * $('button').preempt({
   *   attr: 'onclick',
   *   event: 'click',
   *   restore: true
   * });
   * @this jQuery
   * @param {Object} opts
   * - `attr` is the attribute you want to replace
   * - `event` is the new event to bind
   * - `restore` will restore the node's original behavior.
   * @param {Function=} callback Event handler callback function
   * @returns {jQuery} A jQuery obj
   * @memberOf preempt
   */
  jQuery.fn.preempt = function preempt(opts, callback) {
    var $this = $(this);
    return $this.each(function () {
      var instance = $this.data(instance_id),
        attr = opts.attr,
        new_evt = opts.event,
        restore = !!opts.restore,
        js_id;

      callback = callback || $.noop;

      if (!(attr && new_evt)) {
        throw new Error('jquery.preempt: options.attr and opts.event are required');
      }

      js_id = instance_id + '.' + attr + '.' + new_evt + '.js';

      if (!instance) {
        // if we don't have an instance, restore() does nothing.
        if (opts.restore) {
          return;
        }
        instance = new Preempt($this);
        $this.data(instance_id, instance);
      }
      if (!$this.data(js_id)) {
        instance.init(attr, new_evt, js_id, callback);
      } else if (restore) {
        instance.restore(attr, new_evt, js_id);
      }
    });
  };


})(jQuery);

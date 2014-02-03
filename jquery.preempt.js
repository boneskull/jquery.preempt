/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
 */

/**
 * @description Takes legacy inline JS (i.e. `onclick` and `href=\"javascript:...\"` and creates an event handler to be run before the inlined code.
 * @namespace preempt
 * @example
 *
 * // given <button onclick="doSomething()">do something</button>
 * // or <a href="javascript:doSomethingElse()">do something else</a>
 * $('button').preempt('onclick', 'click', function doSomethingBeforeSomething() {
 *   // do something else
 * });
 *
 * // restores the `onclick` attribute of the element
 * $('button').restore('onclick', 'click');
 */

(function ($, window, document, undefined) {
  'use strict';

  /**
   * @description plugin identifier
   * @type {string}
   * @memberOf preempt
   * @private
   * @const
   */
  var PLUGIN_NAME = 'preempt',

    /**
     * @description instance_id
     * @type {string}
     * @memberOf preempt
     * @private
     */
      instance_id = "plugin." + PLUGIN_NAME,

    /**
     * @memberOf preempt
     * @type {string}
     * @private
     */
      cfg_container_id = instance_id + '.preempted',

  /*jshint -W107*/
    /**
     * Script URL prefix.  JSHint hates this.
     * @type {string}
     * @memberOf preempt
     * @private
     * @const
     */
      SCRIPT_URL = 'javascript:',

    /**
     * @description Class representing an instance of the Preempt plugin.
     * @param {jQuery} element jQuery element to preempt
     * @memberOf preempt
     * @returns {Preempt}
     * @constructor
     */
      Preempt = function Preempt(element) {

      /**
       * Name of this plugin
       * @type {string}
       * @memberOf Preempt
       * @private
       */
      this._name = PLUGIN_NAME;

      /**
       * jQuery element to preempt
       * @memberOf Preempt
       * @type {jQuery}
       */
      this.element = element;

      /**
       * Whether or not to prepend "javascript:" to the attr string when restoring
       * @type {boolean}
       * @memberOf Preempt
       * @private
       */
      this._prefix = false;
    };

  /**
   * @description Replaces the inlined JS with an event handler which also eval's the inlined JS.
   * @param attr
   * @param new_evt
   * @param callback
   * @method
   * @memberOf Preempt
   */
  Preempt.prototype.init = function init(attr, new_evt, callback) {
    var el = this.element,
      js = el.attr(attr),
      preempt = this;
    callback = callback || $.noop;

    if (js.indexOf(SCRIPT_URL) === 0) {
      this._prefix = true;
      js = js.substring(11);
    }

    el.removeAttr(attr)
      .off(new_evt)
      .on(new_evt, function preemptor(evt) {
        var ret_val;
        try {
          /*jshint -W061*/
          ret_val = eval('+function(' + js + ')()');
        } catch (e) {
          //TODO: find a decent way to destroy the plugin if this happens
          window.alert('jquery-preempt: terrible error; expect the unexpected');
          //TODO: not sure of the easiest way to call this; investigate the object's prototype and see
          preempt.restore(attr, new_evt);
          return false;
        }
        callback.call(this, evt);
        return ret_val;
      });
    // store it so we can easily restore it
    el.data(PLUGIN_NAME + '.' + attr + '.' + new_evt + '.js', js);

  };

  /**
   *
   * @param attr
   * @param new_evt
   * @method
   * @memberOf Preempt
   */
  Preempt.prototype.restore = function restore(attr, new_evt) {
    var el = this.element,
      preempted = el.data(cfg_container_id),
      js = el.data(PLUGIN_NAME + '.' + attr + '.' + new_evt + '.js');
    el.attr(attr, this._prefix ? SCRIPT_URL + js : js)
      .off(new_evt);
    delete preempted[attr + new_evt];
  };

  /**
   * @function external:"jQuery.fn".preempt
   * @this jQuery
   * @param {string} attr Attribute to remove and interpret
   * @param {string} new_evt Event type to create
   * @param {function=} callback Callback to execute when event triggers
   * @memberOf preempt
   * @returns {jQuery} A jQuery element
   */
  $.fn.preempt = function preempt(attr, new_evt, callback) {
    return this.each(function () {
      var instance = this.data(instance_id),
        preempted;
      if (!instance) {
        instance = new Preempt(this);
        this.data(instance_id, instance);
      }
      if ($.type(attr) === 'string' && $.type(new_evt) === 'undefined') {
        return instance[attr].apply(instance, arguments);
      }
      preempted = this.data(cfg_container_id);
      if ($.type(preempted) === 'undefined') {
        preempted = this.data(cfg_container_id, {});
      }
      if (!preempted[attr + new_evt]) {
        instance.init(attr, new_evt, callback);
      }
    });
  };

})(jQuery, window, document);

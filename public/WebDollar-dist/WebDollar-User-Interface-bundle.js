(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'select'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});
},{"select":8}],2:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});
},{"./clipboard-action":1,"good-listener":6,"tiny-emitter":9}],3:[function(require,module,exports){
var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;

},{}],4:[function(require,module,exports){
var closest = require('./closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"./closest":3}],5:[function(require,module,exports){
/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};

},{}],6:[function(require,module,exports){
var is = require('./is');
var delegate = require('delegate');

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;

},{"./is":5,"delegate":4}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;

},{}],9:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],10:[function(require,module,exports){
var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

},{}],11:[function(require,module,exports){
(function (process,global){
/*!
 * Vue.js v2.5.13
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
'use strict';

/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(false && isObject(value) && ('@binding' in value))
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (process.env.NODE_ENV !== 'production') {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if (process.env.NODE_ENV !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm;
    vnode.fnOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.13';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */









// add a raw attr (use this in preTransforms)








// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (process.env.NODE_ENV !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (process.env.NODE_ENV !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

module.exports = Vue$3;

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":7}],12:[function(require,module,exports){
var inserted = exports.cache = {}

function noop () {}

exports.insert = function (css) {
  if (inserted[css]) return noop
  inserted[css] = true

  var elem = document.createElement('style')
  elem.setAttribute('type', 'text/css')

  if ('textContent' in elem) {
    elem.textContent = css
  } else {
    elem.styleSheet.cssText = css
  }

  document.getElementsByTagName('head')[0].appendChild(elem)
  return function () {
    document.getElementsByTagName('head')[0].removeChild(elem)
    inserted[css] = false
  }
}

},{}],13:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("#webDollar{\n    font-family: 'avenir',sans-serif;\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Wallet = require("./Wallet/Wallet.vue");

var _Wallet2 = _interopRequireDefault(_Wallet);

var _Mining = require("./Mining/Mining.vue");

var _Mining2 = _interopRequireDefault(_Mining);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    components: {
        "Wallet": _Wallet2.default,
        "Mining": _Mining2.default
    },

    data: function data() {
        return {};
    },

    methods: {}
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"webDollar"}},[_c('Mining'),_vm._v(" "),_c('Wallet')],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-78f88538", __vue__options__)
  } else {
    hotAPI.reload("data-v-78f88538", __vue__options__)
  }
})()}
},{"./Mining/Mining.vue":14,"./Wallet/Wallet.vue":27,"vue":11,"vue-hot-reload-api":10,"vueify/lib/insert-css":12}],14:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("#dashboardMining{\n    overflow: hidden;\n    position: fixed;\n    bottom: 0px;\n    height: 30px;\n    background-color: #262626;\n    display: block;\n    left: 0;\n    padding-bottom: 3px;\n    right: 0;\n    z-index: 95;\n    border-top: solid 1px #444444;\n}\n\n.miningPowerThreads{\n    font-size: 14px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 8px;\n    text-transform: uppercase;\n    padding-bottom: 5px;\n    color: #fff;\n    letter-spacing: 5px;\n    margin: 0;\n}\n\n\n.walletStartMining{\n    position: absolute;\n    display: block;\n    margin: 0 auto;\n    left: 0;\n    right: 0;\n    font-size: 20px;\n    color: #f20;\n    display: inline-block;\n    width: 230px;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n\n.walletStartMining a{\n    padding-top: 5px;\n    display: block;\n    color: #000;\n}\n\n.walletStartMining a:hover{\n    color: #ffc12c;\n}\n\n.walletStartMining:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n\n.minningController p{\n    font-size: 20px;\n    margin-right: -4px;\n}\n\n#miningDetails{\n    display: inline-block;\n    line-height: 32px;\n    margin-left: 10px;\n    margin-top: 0;\n}\n\n#miningDetails p{\n    margin-top: 0;\n    font-size: 12px;\n    color: #D5D5D5;\n}\n\n#threadsControll{\n    display: inline-block;\n    vertical-align: top;\n    width: 100%;\n    background-color: #1f1f1f;\n}\n\n#threadsControll .leftButton {\n    float: left;\n}\n\n#threadsControll .rightButton {\n    float: right;\n}\n\n#threadsControll .button p{\n    padding-top: 3px;\n    padding-bottom: 4px;\n    line-height: 27px;\n    margin: 0;\n}\n\n#allWalets{\n    /*border-top: solid 1px #7b7b7b;*/\n    display: block;\n    /*padding-top: 10px;*/\n}\n\n\n.miningPowerText{\n    font-size: 10px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 5px;\n    margin: 0;\n    color: #fff;\n}\n\n\n.miningPowerText .secondWord{\n    height: auto;\n    line-height: 10px;\n    margin: 0;\n    font-weight: bold;\n    color: #fff;\n    margin-right: -4px;\n}\n\n\n#threadsControll .button{\n    display: inline-block;\n    background-color: #1f1f1f;\n    color: #fff;\n    font-size: 26px;\n    border: solid 1px #565656;\n    width: 31px;\n    border-top: none;\n    border-bottom: none;\n    text-align: center;\n    cursor: pointer;\n    transition: all .3s linear;\n}\n\n#threadsControll .button:hover{\n    background-color: #000;\n    transition: all .3s linear;\n}\n\n#threadsControll .button:first-child{\n    margin-top: 0;\n}\n\n#threadsNumber{\n    font-size: 20px;\n    padding: 0 10px;\n    width: 20px;\n    text-align: center;\n    padding-bottom: 4px;\n    line-height: 25px;\n    display: inline-block;\n    color: #fff;\n    background-color: #d23c25;\n    vertical-align: top;\n    padding-top: 4px;\n    border-right: solid 1px #444;\n    margin-right: -4px;\n}\n\n.whiteText{\n    color: #c5c5c5;\n    margin-left: 10px;\n    font-weight: 100;\n}\n\n#minningController{\n    border-top:none;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n}\n\n#createWalletAdress{\n    border: solid 1px #7b7b7b;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n}\n\n#createWalletAdress p:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n\n#createWalletAdress p{\n    padding: 10px;\n    padding-top: 14px;\n    background-color: #353535;\n    color: #bbb;\n    display: inline-block;\n    width: 214px;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n\n.WEBD{\n    display: inline-block;\n    margin-left: 20px;\n    font-size: 20px;\n    color: #fec02c;\n    vertical-align: top;\n    padding-top: 3px;\n    float: right;\n    min-width: 300px;\n    text-align: center;\n    border-left: solid 1px #444444;\n\n    margin-top: 0;\n}\n\n@media only screen and (max-width : 831px) {\n    #dashboardMining{\n        height: 90px;\n        margin-bottom: 0;\n    }\n    #minningController, .walletStartMining, .WEBD{\n        display: block;\n        width: 100%;\n    }\n    #minningController{\n        background-color: #0000;\n        margin-bottom: 0;\n        height: 33px;\n        border-top: solid 1px #616161;\n        margin-top: 50px;\n    }\n    .walletStartMining{\n        margin-top: -86px;\n    }\n    #threadsControll .button p{\n        line-height: 43px;\n    }\n    #threadsControll .button{\n        width: 80px;\n    }\n    .miningPowerThreads{\n        line-height: 38px;\n        font-size: 16px;\n        margin-right: -4px;\n    }\n    #miningDetails{\n        display: none;\n    }\n    .miningPowerText{\n        display: none;\n    }\n    #threadsNumber{\n        margin: 0 auto;\n        text-align: center;\n        float:left;\n        position: relative;\n        display: block;\n        line-height: 34px;\n        width: 63px;\n    }\n    .WEBD{\n        margin-top: -35px;\n        text-align: right;\n        margin-right: 10px;\n    }\n    #threadsNumber{\n        width: 30px;\n    }\n    .miningPowerThreads{\n        display:none;\n    }\n    #threadsControll .button{\n        float:left;\n    }\n    .walletStartMining{\n        margin-top:-33px;\n        margin-left:50px;\n    }\n    #threadsControll{\n        background-color: #f200;\n    }\n    #threadsControll .button p {\n        line-height: 34px;\n    }\n    #minningController{\n        margin-top:0\n    }\n    #dashboardMining{\n        height:40px;\n    }\n    .walletStartMining:hover{\n        background-color: #f200;\n    }\n}\n\n@media only screen and (max-width : 451px) {\n\n    #threadsControll .button{\n        width: 50px;\n    }\n\n    .WEBD{\n        margin-top: -33px;\n        font-size:14px;\n    }\n\n}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {

    name: 'Mining',

    components: {},

    data: function data() {
        return {

            started: false,
            hashesPerSecond: 0,

            miningWorkersCount: 0
        };
    },

    computed: {},

    props: {},

    mounted: function mounted() {
        var _this = this;

        if (typeof window === 'undefined') return;

        WebDollar.Blockchain.Mining.emitter.on("mining/hash-rate", function (hashesPerSecond) {
            _this.hashesPerSecond = hashesPerSecond;
        });

        WebDollar.Blockchain.Mining.emitter.on("mining/status-changed", function (status) {

            _this.started = WebDollar.Blockchain.Mining.started;
        });

        WebDollar.Blockchain.Mining.emitter.on("mining/reset", function () {

            _this.started = WebDollar.Blockchain.Mining.started;
        });
    },


    methods: {
        startStopMining: function startStopMining() {

            if (!WebDollar.Blockchain.Mining.started) WebDollar.Blockchain.Mining.startMining();else WebDollar.Blockchain.Mining.stopMining();
        },
        destroyOneMiningWorker: function destroyOneMiningWorker() {},
        createOneMiningWorker: function createOneMiningWorker() {

            this.startStopMining();
        },
        mounted: function mounted() {}
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"walletSection",attrs:{"id":"dashboardMining"}},[_c('div',{attrs:{"id":"minningController"}},[_vm._m(0),_vm._v(" "),_c('strong',{style:({background: this.miningWorkersCount ? 0 : '#d23c25'}),attrs:{"id":"threadsNumber"}},[_vm._v(_vm._s(this.miningWorkersCount))]),_vm._v(" "),_c('div',{attrs:{"id":"miningDetails"}},[_c('p',{},[_vm._v(_vm._s(this.started ? this.hashesPerSecond : 0)+" hashes/sec")])])]),_vm._v(" "),_c('div',{staticClass:"walletStartMining",attrs:{"type":"button"}},[_c('div',{attrs:{"id":"threadsControll"}},[_c('div',{staticClass:"button leftButton",attrs:{"type":"button"},on:{"click":this.destroyOneMiningWorker}},[_c('p',[_vm._v("-")])]),_vm._v(" "),_c('p',{staticClass:"miningPowerThreads"},[_vm._v("Threads")]),_vm._v(" "),_c('div',{staticClass:"button rightButton",attrs:{"type":"button"},on:{"click":this.createOneMiningWorker}},[_c('p',[_vm._v("+")])])])]),_vm._v(" "),_vm._m(1)])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"miningPowerText"},[_vm._v("Mining "),_c('br'),_vm._v(" "),_c('span',{staticClass:"secondWord"},[_vm._v("Power")])])},function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"WEBD"},[_vm._v(" 0.0 "),_c('b',{staticClass:"whiteText"},[_vm._v("WBD MINED")])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-697b145f", __vue__options__)
  } else {
    hotAPI.reload("data-v-697b145f", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10,"vueify/lib/insert-css":12}],15:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".webdollarFont{\n    cursor: pointer;\n    color: #f6cd69;\n    transition: all .5s linear;\n    text-decoration: none;\n    width: 14px;\n}\n\n.webdollarFont path{\n    fill: #f6cd69;\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _svgChevronDown = require("./res/svg-chevron-down.vue");

var _svgChevronDown2 = _interopRequireDefault(_svgChevronDown);

var _svgChevronUp = require("./res/svg-chevron-up.vue");

var _svgChevronUp2 = _interopRequireDefault(_svgChevronUp);

var _svgKey = require("./res/svg-key.vue");

var _svgKey2 = _interopRequireDefault(_svgKey);

var _svgLockClosed = require("./res/svg-lock-closed.vue");

var _svgLockClosed2 = _interopRequireDefault(_svgLockClosed);

var _svgLockOpen = require("./res/svg-lock-open.vue");

var _svgLockOpen2 = _interopRequireDefault(_svgLockOpen);

var _svgPlus = require("./res/svg-plus.vue");

var _svgPlus2 = _interopRequireDefault(_svgPlus);

var _svgPlusSquare = require("./res/svg-plus-square.vue");

var _svgPlusSquare2 = _interopRequireDefault(_svgPlusSquare);

var _svgX = require("./res/svg-x.vue");

var _svgX2 = _interopRequireDefault(_svgX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    props: {
        icon: { default: '' }
    },

    components: {
        "svgKey": _svgKey2.default,
        "svgChevronDown": _svgChevronDown2.default,
        "svgChevronUp": _svgChevronUp2.default,
        "svgLockClosed": _svgLockClosed2.default,
        "svgLockOpen": _svgLockOpen2.default,
        "svgPlus": _svgPlus2.default,
        "svgPlusSquare": _svgPlusSquare2.default,
        "svgX": _svgX2.default
    },

    methods: {
        handleClick: function handleClick(e) {
            this.$emit('click', e);
        }
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{on:{"click":this.handleClick}},[(this.icon === 'chevron-up')?_c('svgChevronUp'):_vm._e(),_vm._v(" "),(this.icon === 'chevron-down')?_c('svgChevronDown'):_vm._e(),_vm._v(" "),(this.icon === 'key')?_c('svgKey'):_vm._e(),_vm._v(" "),(this.icon === 'lock-closed')?_c('svgLockClosed'):_vm._e(),_vm._v(" "),(this.icon === 'lock-open')?_c('svgLockOpen'):_vm._e(),_vm._v(" "),(this.icon === 'plus')?_c('svgPlus'):_vm._e(),_vm._v(" "),(this.icon === 'plus-square')?_c('svgPlusSquare'):_vm._e(),_vm._v(" "),(this.icon === 'x')?_c('svgX'):_vm._e()],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ab163dce", __vue__options__)
  } else {
    hotAPI.reload("data-v-ab163dce", __vue__options__)
  }
})()}
},{"./res/svg-chevron-down.vue":16,"./res/svg-chevron-up.vue":17,"./res/svg-key.vue":18,"./res/svg-lock-closed.vue":19,"./res/svg-lock-open.vue":20,"./res/svg-plus-square.vue":21,"./res/svg-plus.vue":22,"./res/svg-x.vue":23,"vue":11,"vue-hot-reload-api":10,"vueify/lib/insert-css":12}],16:[function(require,module,exports){
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"version":"1.1","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","width":"14","height":"14","viewBox":"0 0 14 14"}},[_c('path',{attrs:{"d":"M13.148 6.312l-5.797 5.789q-0.148 0.148-0.352 0.148t-0.352-0.148l-5.797-5.789q-0.148-0.148-0.148-0.355t0.148-0.355l1.297-1.289q0.148-0.148 0.352-0.148t0.352 0.148l4.148 4.148 4.148-4.148q0.148-0.148 0.352-0.148t0.352 0.148l1.297 1.289q0.148 0.148 0.148 0.355t-0.148 0.355z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0bd49e6c", __vue__options__)
  } else {
    hotAPI.reload("data-v-0bd49e6c", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],17:[function(require,module,exports){
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"version":"1.1","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","width":"14","height":"14","viewBox":"0 0 14 14"}},[_c('path',{attrs:{"d":"M13.148 10.398l-1.297 1.289q-0.148 0.148-0.352 0.148t-0.352-0.148l-4.148-4.148-4.148 4.148q-0.148 0.148-0.352 0.148t-0.352-0.148l-1.297-1.289q-0.148-0.148-0.148-0.355t0.148-0.355l5.797-5.789q0.148-0.148 0.352-0.148t0.352 0.148l5.797 5.789q0.148 0.148 0.148 0.355t-0.148 0.355z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-791e4865", __vue__options__)
  } else {
    hotAPI.reload("data-v-791e4865", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],18:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"width":"24","height":"24","xmlns":"http://www.w3.org/2000/svg","fill-rule":"evenodd","clip-rule":"evenodd"}},[_c('path',{attrs:{"d":"M12.804 9c1.038-1.793 2.977-3 5.196-3 3.311 0 6 2.689 6 6s-2.689 6-6 6c-2.219 0-4.158-1.207-5.196-3h-3.804l-1.506-1.503-1.494 1.503-1.48-1.503-1.52 1.503-3-3.032 2.53-2.968h10.274zm7.696 1.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-56386c97", __vue__options__)
  } else {
    hotAPI.reload("data-v-56386c97", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],19:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5f7f8f06", __vue__options__)
  } else {
    hotAPI.reload("data-v-5f7f8f06", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],20:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-07e88d64", __vue__options__)
  } else {
    hotAPI.reload("data-v-07e88d64", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],21:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-5v5h-4v-5h-5v-4h5v-5h4v5h5v4z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1b58b268", __vue__options__)
  } else {
    hotAPI.reload("data-v-1b58b268", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],22:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-314237dc", __vue__options__)
  } else {
    hotAPI.reload("data-v-314237dc", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],23:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3b946230", __vue__options__)
  } else {
    hotAPI.reload("data-v-3b946230", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10}],24:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".modal input:focus, .modal textarea:focus{\n    outline: none;\n}\n\n.modal{\n    width: 50%;\n    height: auto;\n    border-radius: 5px;\n    max-width: 550px;\n    min-width: 450px;\n    position: fixed;\n    margin: 0 auto;\n    border: solid 1px #313131;\n    left: 0;\n    right: 0;\n    text-align: center;\n    background-color: #1f1f1f;\n    z-index: 1600;\n    top: 50%;\n    transform: translateY(-50%);\n}\n\n.modal #walletID{\n    word-wrap: break-word;\n    display: block;\n    line-height: 12px;\n    margin: 10px 0;\n    font-weight: 100;\n}\n\n.modalBackground{\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    display: block;\n    z-index: 1000;\n    top:0;\n    left: 0;\n    background-color: rgba(0, 0, 0, 0.83);\n}\n\n.modal .close{\n    position: fixed;\n    top: -10px;\n    right: 10px!important;\n    font-size: 40px;\n    display: block;\n    color: #ffc12c;\n    cursor: pointer;\n}\n\n.modal .title{\n    background-color: #262626;\n    padding: 10px 0;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    line-height: 22px;\n    color: #ffc12c;\n}\n\n.modal .footer .button{\n    display: inline;\n    cursor: pointer;\n}\n\n.modal b{\n    margin-left: 0;\n}\n\n.modal .twoColums{\n    border-bottom: solid 1px #313131;\n    background-color: #151515;\n}\n\n.modal .ballance{\n    color: #ffc12c!important;\n    font-size: 24px;\n    margin-top: 20px;\n}\n\n.modal .transfer{\n    padding: 0 10px;\n}\n\n.modal .transfer input{\n    border: none;\n    background-color: #333333;\n    padding: 10px 0 10px 10px;\n    margin: 10px 0;\n    color: #fff\n}\n\n.modal .transfer .adress{\n    width: 100%;\n    display: block;\n}\n\n.modal .transfer .amount {\n    width: 100%;\n}\n\n.modal .transfer .title{\n    background-color: #1f1f1f;\n    padding-top: 30px;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    padding-bottom: 20px;\n    color: #d4d4d4;\n}\n\n.modal .transfer .button{\n    margin-top: 10px;\n    background-color: #ffc12c;\n    color: #1f1f1f;\n    margin-bottom: 15px;\n    width: 100%;\n    font-size: 14px;\n    border: none;\n    padding: 15px 0 15px 0;\n    border-radius: 5px;\n    transition: all 0.5s ease;\n}\n\n.modal .transfer .button:hover{\n    background-color: #fbdb8d;\n    color: #000000;\n    transition: all 0.5s ease\n}\n\n.twoColums{\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n}\n\n.adressActions{\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    border-bottom: solid 1px #313131;\n    border-top: solid 3px #000;\n}\n\n.adressActions .actionButton{\n    display: inline-block;\n    background-color: #333;\n    color: #ffc12c;\n    padding: 5px;\n    padding-top: 8px;\n    border-left: solid 1px #6d6d6d;\n    border-collapse: collapse;\n    transition: all 0.5s ease\n}\n\n.adressActions .actionButton:hover{\n    background-color: #232222;\n    color: #ffdd8c;\n    transition: all 0.5s ease\n}\n\n.adressActions .actionButton:first-child{\n    border-left:none;\n}\n\n.activeActionButton{\n    background-color: #ffc12c!important;\n    color: #000!important;\n}\n\n.twoColums .section{\n    overflow: hidden;\n    padding: 20px;\n    color: #D5D5D5;\n}\n\n.twoColums .section:first-child{\n    border-right: solid 1px #313131;\n}\n\n.copyToClipboard{\n    background-color: #353535;\n    border-radius: 5px;\n    padding: 7px 0 5px 0;\n    border: solid 1px #777;\n    font-size: 12px;\n    padding: 7px 0 5px 0;\n    width: 150px;\n    margin: 0 auto;\n    transition: all 0.5s ease\n}\n\n.copyToClipboard:hover{\n    background-color: #000;\n    transition: all 0.5s ease\n}\n\n.copyToClipboardSuccess{\n    color: #149008;\n    font-size: 14px;\n}\n\n@media (max-width:831px){\n\n    #walletID{\n        font-size: 12px!important;\n        line-height: 14px!important;\n    }\n\n}\n\n@media (max-width:600px)  {\n\n    .modal{\n        width: 100%;\n        max-width: none;\n        min-width: none;\n    }\n    .twoColums{\n        display: inline-block;\n    }\n    .twoColums .section:first-child {\n        border-bottom: solid 1px #313131;\n        border-right: none;\n    }\n    .modal .ballance{\n        margin-top: 0;\n    }\n    .adressActions .actionButton{\n        line-height: 50px;\n        font-size: 20px;\n    }\n    .modal .transfer input{\n        padding: 15px 0 15px 10px;\n        font-size: 16px;\n    }\n    .modal .transfer .button{\n        line-height: 26px;\n        font-size: 20px;\n    }\n    .modal .title{\n        padding: 20px 0;\n    }\n    .modal .close{\n        top:0;\n        right: 30px!important;\n    }\n    .modal .twoColums{\n        width: 100%;\n    }\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {

    name: "Modal",

    data: function data() {
        return {
            modalOpened: false
        };
    },

    props: {

        title: { default: 'Modal Title' },
        buttons: { default: function _default() {
                return [{ text: "cancel" }];
            } }

    },

    methods: {
        closeModal: function closeModal(e) {

            e.stopPropagation();

            this.modalOpened = false;
            console.log("closeModal2");
        },
        showModal: function showModal(e) {

            if (e !== undefined) e.stopPropagation();

            console.log("showModal");
            this.modalOpened = true;
        }
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (this.modalOpened)?_c('div',[_c('div',{staticClass:"modalBackground",on:{"click":this.closeModal}}),_vm._v(" "),_c('div',{ref:"refModal",staticClass:"modal"},[_c('div',{staticClass:"close",on:{"click":this.closeModal}},[_vm._v("\n            x\n        ")]),_vm._v(" "),_c('div',{staticClass:"header"},[_c('div',{staticClass:"title"},[_vm._v("\n                "+_vm._s(this.title)+"\n            ")])]),_vm._v(" "),_c('div',{staticClass:"content"},[_vm._t("content")],2)])]):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3a5a34f0", __vue__options__)
  } else {
    hotAPI.reload("data-v-3a5a34f0", __vue__options__)
  }
})()}
},{"vue":11,"vue-hot-reload-api":10,"vueify/lib/insert-css":12}],25:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".allWaletsContaier{\n\n}\n\n#allWalets .walletAdress{\n    padding: 0!important;\n    padding-right: 0;\n    background-color: #272626;\n    margin: 5px;\n    width: 100%;\n    cursor: pointer;\n}\n\n#allWalets .walletAdress:last-child{\n    margin-bottom: 1px;\n}\n\n#allWalets .walletAdress img{\n    height: 40px;\n    display: inline-block;\n    vertical-align: top;\n}\n\n#allWalets .walletAdress:hover{\n    background-color: #000;\n    transition: all .3s linear;\n}\n\n.walletAdress b{\n    text-align: center;\n    display: inline-block;\n    color: #fddb0c;\n    line-height: 40px;\n    padding-top: 1px;\n    margin-left: 10px;\n    font-size: 12px;\n    vertical-align: top;\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TransactionModal = require("./Transactions/Transaction.modal.vue");

var _TransactionModal2 = _interopRequireDefault(_TransactionModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    props: {
        address: { default: '' }
    },

    components: {
        "TransactionModal": _TransactionModal2.default
    },

    computed: {
        getAddressPic: function getAddressPic() {
            return WebDollar.Blockchain.Wallet.getAddressPic(this.address);
        }
    },

    methods: {
        handleTransferFunds: function handleTransferFunds(e) {

            this.$refs['refTransactionModal'].showModal(e);
        }
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"walletAdress",on:{"click":function($event){$event.stopPropagation();_vm.handleTransferFunds($event)}}},[_c('img',{staticClass:"walletAddressImage",attrs:{"src":this.getAddressPic}}),_vm._v(" "),_c('b',[_vm._v("0.0 WBD")]),_vm._v(" "),_c('TransactionModal',{ref:"refTransactionModal",attrs:{"address":this.address}})],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8a83cf3a", __vue__options__)
  } else {
    hotAPI.reload("data-v-8a83cf3a", __vue__options__)
  }
})()}
},{"./Transactions/Transaction.modal.vue":26,"vue":11,"vue-hot-reload-api":10,"vueify/lib/insert-css":12}],26:[function(require,module,exports){
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Modal = require("../../../UI/modal/Modal.vue");

var _Modal2 = _interopRequireDefault(_Modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Clipboard = require('clipboard');

exports.default = {

    props: {

        address: { default: null },
        toAddress: { default: null },
        toAmount: { default: 0.0 }
    },

    components: {
        "Modal": _Modal2.default
    },

    data: function data() {
        return {
            isTransfer: false,
            isSell: false,
            isBuy: false,
            clipboardText: 'Copy to Clipboard'
        };
    },

    methods: {
        showTransfer: function showTransfer() {
            this.isTransfer = true;
            this.isSell = false;
            this.isBuy = false;
        },
        showBuy: function showBuy() {
            this.isTransfer = false;
            this.isSell = false;
            this.isBuy = true;
        },
        showSell: function showSell() {
            this.isTransfer = false;
            this.isSell = true;
            this.isBuy = false;
        },
        closeModal: function closeModal() {
            this.$refs['refModal'].closeModal();
        },
        showModal: function showModal(e) {
            if (this.$refs['refModal'].modalOpened === false) this.$refs['refModal'].showModal();
        },
        addressClipboardCopiedSuccessfully: function addressClipboardCopiedSuccessfully(e) {
            this.clipboardText = 'Copied';
            console.log(e);
        },
        addressClipboardCopiedError: function addressClipboardCopiedError(e) {
            this.clipboardText = "Copy didn't work";
            console.log(e);
        }
    },

    mounted: function mounted() {
        var _this = this;

        this.clipboardText = 'Copy to Clipboard';

        if (typeof window === 'undefined') return;

        var clipboard = new Clipboard('#refClipboardCopyAddress', {
            text: function text() {
                return _this.address;
            }
        });

        clipboard.on('success', function (e) {
            _this.addressClipboardCopiedSuccessfully(e);
        });

        clipboard.on('error', function (e) {
            _this.addressClipboardCopiedError(e);
        });
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (this.address !== null && this.address !== undefined)?_c('div',[_c('Modal',{ref:"refModal",attrs:{"title":"Wallet Address"}},[_c('div',{attrs:{"slot":"content"},slot:"content"},[_c('div',{staticClass:"twoColums"},[_c('div',{staticClass:"section"},[_c('div',{staticStyle:{"font-size":"20px"}},[_vm._v("\n                        Address\n                    ")]),_vm._v(" "),_c('b',{staticStyle:{"color":"gray"},attrs:{"id":"walletID"}},[_vm._v(_vm._s(this.address.toString()))]),_vm._v(" "),_c('div',{ref:"refClipboardCopyAddress",class:this.clipboardText!='Copied' ? 'copyToClipboard' : 'copyToClipboardSuccess',attrs:{"id":"refClipboardCopyAddress"}},[_vm._v("\n                        "+_vm._s(this.clipboardText)+"\n                    ")])]),_vm._v(" "),_c('div',{staticClass:"section"},[_c('div',{staticStyle:{"font-size":"20px"}},[_vm._v("\n                        Balance\n                    ")]),_vm._v(" "),_c('b',{staticClass:"ballance",staticStyle:{"color":"gray"}},[_vm._v("0.0 WEBD")])])]),_vm._v(" "),_c('div',{staticClass:"adressActions"},[_c('div',{class:[ this.isTransfer ? 'actionButton activeActionButton' : 'actionButton' ],on:{"click":this.showTransfer}},[_vm._v("\n                    Transfer\n                ")]),_vm._v(" "),_c('div',{class:[ this.isBuy ? 'actionButton activeActionButton' : 'actionButton' ],on:{"click":this.showBuy}},[_vm._v("\n                    Buy\n                ")]),_vm._v(" "),_c('div',{class:[ this.isSell ? 'actionButton activeActionButton' : 'actionButton' ],on:{"click":this.showSell}},[_vm._v("\n                    Sell\n                ")])]),_vm._v(" "),_c('form',{staticClass:"transfer",style:({display: this.isTransfer ? 'block': 'none'})},[_c('p',{staticClass:"title"},[_vm._v("Transfer WBD")]),_vm._v(" "),_c('input',{staticClass:"adress",attrs:{"placeholder":"Recipient Adress"}}),_vm._v(" "),_c('input',{staticClass:"amount",attrs:{"placeholder":"WBD Amount"}}),_vm._v(" "),_c('button',{staticClass:"button",attrs:{"type":"submit"}},[_vm._v("\n                    SEND WBD\n                ")])]),_vm._v(" "),_c('form',{staticClass:"buy",style:({display: this.isBuy ? 'block': 'none'})},[_c('p',{staticClass:"title"},[_vm._v("Buy WBD")]),_vm._v(" "),_c('input',{staticClass:"adress",attrs:{"placeholder":"Recipient Adress"}}),_vm._v(" "),_c('input',{staticClass:"amount",attrs:{"placeholder":"WBD Amount"}}),_vm._v(" "),_c('button',{staticClass:"button",attrs:{"type":"submit"}},[_vm._v("\n                    SEND WBD\n                ")])]),_vm._v(" "),_c('form',{staticClass:"sell",style:({display: this.isSell ? 'block': 'none'})},[_c('p',{staticClass:"title"},[_vm._v("Sell WBD")]),_vm._v(" "),_c('input',{staticClass:"adress",attrs:{"placeholder":"Recipient Adress"}}),_vm._v(" "),_c('input',{staticClass:"amount",attrs:{"placeholder":"WBD Amount"}}),_vm._v(" "),_c('button',{staticClass:"button",attrs:{"type":"submit"}},[_vm._v("\n                    SEND WBD\n                ")])])])])],1):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c1f19eb8", __vue__options__)
  } else {
    hotAPI.reload("data-v-c1f19eb8", __vue__options__)
  }
})()}
},{"../../../UI/modal/Modal.vue":24,"clipboard":2,"vue":11,"vue-hot-reload-api":10}],27:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("#walletButton {\n    margin: 0 auto;\n    position: fixed;\n    z-index: 85;\n    bottom: 0;\n    width: 299px!important;\n    right: 0;\n    text-align: center;\n    height: 50px;\n    border-top-left-radius: 60px;\n    cursor: pointer;\n    background-color: #fec02c;\n    color: #1f1f1f;\n    margin-bottom: 20px;\n    border: solid 1px #444444;\n    border-right: solid 1px #fec02c;\n    transition: all .3s linear;\n}\n\n#walletButton:hover{\n    color: #fff;\n    transition: all .3s linear;\n}\n\n.walletSection{\n    display: inline-block;\n    vertical-align: top;\n    height: 315px;\n    overflow-y: auto;\n    overflow-x: hidden;\n    width: 100%;\n}\n\n.walletController{\n    position: relative;\n    width: 100%;\n    border-bottom: solid 1px #333333;\n    background-color: #313131;\n}\n\n.walletController .btn{\n    display: inline-block;\n    padding: 6px 12px 6px 12px;\n    background-color: #1f1f1f;\n}\n\n.walletController .btn:hover{\n    background-color: #000000;\n}\n\n.allWallets div{\n    border: solid 1px #545454;\n}\n\n#walletButton:hover{\n    background-color: #1f1f1f;\n    border-right: solid 1px #444444;\n    transition: all .3s linear;\n}\n\n#walletButton span{\n    width: 100%;\n    line-height: 50px;\n    font-size: 20px;\n    font-weight: bolder;\n    transition: all .3s linear;\n}\n\n#walletButton span:hover{\n    transition: all .3s linear;\n}\n\n#walletMenu{\n    margin: 0 auto;\n    position: fixed;\n    bottom: 0;\n    right: 0;\n    width: 300px;\n    background-color: #1f1f1f;\n    height: 358px;\n    margin-bottom:-100px;\n    z-index: 90;\n    transition: all .3s linear;\n    border-top: solid 1px #3d3d3d;\n    border-left: solid 1px #444;\n}\n\n.buttonIcon{\n    display: inline-block;\n    margin-right: 10px;\n}\n\n#walletButton .buttonIcon{\n    fill: #000;\n    transition: all .3s linear;\n}\n\n#walletButton:hover .buttonIcon{\n    fill: #fff;\n    transition: all .3s linear;\n}\n\n.walletAdress b{\n    font-weight:100;\n}\n\n/* Small Devices, Tablets */\n@media only screen and (max-width : 831px) {\n    #walletMenu{\n        width: 100%;\n        margin-bottom: 94px;\n    }\n    #walletButton{\n        width: 100%!important;\n        border-radius: 0;\n        margin-bottom: 93px;\n        margin-bottom: 90px;\n    }\n    .walletController .btn{\n        padding: 16px 22px 16px 22px!important;\n    }\n    .webdollarFont{\n        width: 24px!important;\n    }\n    #allWalets .walletAdress{\n        margin: 15px 0 0 5px!important;\n    }\n    #allWalets .walletAdress img{\n        height: 60px!important;\n    }\n    .walletAdress b{\n        font-size: 22px!important;\n        line-height: 60px!important;\n    }\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _icon = require("../UI/icons/icon.vue");

var _icon2 = _interopRequireDefault(_icon);

var _Address = require("./Address/Address.vue");

var _Address2 = _interopRequireDefault(_Address);

var _Browser = require("../../helpers/Browser.helpers");

var _Browser2 = _interopRequireDefault(_Browser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    components: {
        "icon": _icon2.default,
        "Address": _Address2.default
    },

    data: function data() {
        return {
            opened: false,
            addresses: [],
            walletButtonMarginOpened: 0,
            walletButtonMarginClosed: 0,
            buttonTopDistanceOpen: 0,
            buttonTopDistanceClose: 0,
            walletMarginOpened: 0,
            walletMarginClosed: 0,
            walletMenuMarginTopOpen: 0,
            walletMenuMarginTopClose: 0,
            walletMenuHeightOpen: 0,
            walletMenuHeightClosed: 0
        };
    },

    mounted: function mounted() {
        var _this = this;

        this.changeScreenBehavior();

        if (typeof window === "undefined") return false;

        WebDollar.Blockchain.Wallet.emitter.on("wallet/address-changes", function (address) {
            _this.addNewAddress(address);
        });

        WebDollar.Blockchain.Wallet.emitter.on("wallet/address-changes", function (address) {
            _this.addNewAddress(address);
        });

        WebDollar.Blockchain.Wallet.emitter.on("wallet/changes", function () {
            _this.loadAllAddresses();
        });

        _Browser2.default.addEvent(window, "load", function (event) {
            _this.changeScreenBehavoir();
        });

        _Browser2.default.addEvent(window, "resize", function (event) {
            _this.changeScreenBehavior();
        });
    },


    methods: {
        changeScreenBehavior: function changeScreenBehavior() {

            if (window.screenWidth < 831) {

                this.walletButtonMarginOpened = 452;
                this.walletButtonMarginClosed = 43;

                this.walletMarginOpened = 42;
                this.walletMarginClosed = -325;

                this.buttonTopDistanceOpen = '0';
                this.buttonTopDistanceClose = 'auto';

                this.walletMenuMarginTopOpen = this.$refs['walletMenuButton'].clientHeight;
                this.walletMenuMarginTopClose = '0';

                this.walletMenuHeightOpen = '100%';
                this.walletMenuHeightClosed = '358px';
            } else {

                this.walletButtonMarginOpened = 392;
                this.walletButtonMarginClosed = 30;

                this.walletMarginOpened = 34;
                this.walletMarginClosed = -325;

                this.buttonTopDistanceOpen = 'auto';
                this.buttonTopDistanceClose = 'auto';

                this.walletMenuMarginTopOpen = this.$refs['walletMenuButton'].clientHeight;
                this.walletMenuMarginTopClose = '0';

                this.walletMenuHeightOpen = '358px';
                this.walletMenuHeightClosed = '358px';
            }
        },
        toggleWallet: function toggleWallet() {

            this.opened = !this.opened;

            if (window.screenWidth < 831) {
                if (this.opened === true) {
                    document.getElementById('dashboardMining').setAttribute('style', 'display:none');
                } else {
                    document.getElementById('dashboardMining').setAttribute('style', 'display:block');
                }
            } else {
                document.getElementById('dashboardMining').setAttribute('style', 'display:block');
            }
        },
        handleAddNewAddress: function handleAddNewAddress() {
            WebDollar.Blockchain.Wallet.createNewAddress();
        },
        handleLockWallet: function handleLockWallet() {},
        addNewAddress: function addNewAddress(address) {

            if (address === null || address === undefined) return false;

            for (var i = 0; i < this.addresses.length; i++) {
                if (address.toString() === this.addresses[i].toString()) {
                    return false;
                }
            }this.addresses.push(address);
        },
        loadAllAddresses: function loadAllAddresses() {

            this.addresses = [];

            for (var i = 0; i < WebDollar.Blockchain.Wallet.addresses.length; i++) {
                this.addresses.push(WebDollar.Blockchain.Wallet.addresses[i].address);
            }
        },
        deleteAddress: function deleteAddress(address) {

            if (address === null || address === undefined) return false;

            for (var i = 0; i < this.addresses.length; i++) {
                if (address.toString() === this.addresses.toString()) {
                    this.addresses.splice(i, 1);
                    return true;
                }
            }return false;
        }
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dashboardWallet"},[_c('div',{ref:"walletMenuButton",style:({
                marginBottom: this.opened ? this.walletButtonMarginOpened+'px': this.walletButtonMarginClosed+'px',
                top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose}),attrs:{"id":"walletButton"},on:{"click":this.toggleWallet}},[_c('span',{attrs:{"id":"walletButtonText"}},[_c('icon',{staticClass:"buttonIcon",attrs:{"icon":this.opened ? 'chevron-down' : 'chevron-up'}}),_vm._v("\n            Wallet 0.0\n        ")],1)]),_vm._v(" "),_c('div',{ref:"walletMenu",style:({
                marginBottom: this.opened ? this.walletMarginOpened+'px': this.walletMarginClosed+'px',
                top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose,
                marginTop: this.opened ? this.walletMenuMarginTopOpen : this.walletMenuMarginTopClose,
                height: this.opened ? this.walletMenuHeightOpen : this.walletMenuHeightClosed}),attrs:{"id":"walletMenu"}},[_c('div',{attrs:{"id":"dashboardWallet"}},[_c('div',{staticClass:"walletController"},[_c('icon',{staticClass:"btn",attrs:{"icon":"plus"},on:{"click":this.handleAddNewAddress}}),_vm._v(" "),_c('icon',{staticClass:"btn",attrs:{"icon":"lock-open"},on:{"click":this.handleLockWallet}})],1),_vm._v(" "),_c('div',{staticClass:"walletSection walletsContainer"},[_c('div',{attrs:{"id":"allWalets"}},_vm._l((this.addresses),function(walletAddress){return _c('Address',{key:walletAddress,staticStyle:{"padding-right":"20px"},attrs:{"id":'address'+walletAddress,"address":walletAddress}})}))])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1fe2643f", __vue__options__)
  } else {
    hotAPI.reload("data-v-1fe2643f", __vue__options__)
  }
})()}
},{"../../helpers/Browser.helpers":28,"../UI/icons/icon.vue":15,"./Address/Address.vue":25,"vue":11,"vue-hot-reload-api":10,"vueify/lib/insert-css":12}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BrowserHelpers = function () {
    function BrowserHelpers() {
        _classCallCheck(this, BrowserHelpers);
    }

    _createClass(BrowserHelpers, null, [{
        key: "addEvent",
        value: function addEvent(object, type, callback) {
            if (object === null || typeof object === 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on" + type] = callback;
            }
        }
    }]);

    return BrowserHelpers;
}();

exports.default = BrowserHelpers;

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Browser = require("../helpers/Browser.helpers");

var _Browser2 = _interopRequireDefault(_Browser);

var _NetworkNativeMap = require("../maps/Native-Map/Network-Native-Map");

var _NetworkNativeMap2 = _interopRequireDefault(_NetworkNativeMap);

var _NetworkNativeMapDOM = require("../maps/Native-Map/Network-Native-Map-DOM");

var _NetworkNativeMapDOM2 = _interopRequireDefault(_NetworkNativeMapDOM);

var _NetworkGoogleMaps = require("../maps/Google-Maps/Network-Google-Maps.js");

var _NetworkGoogleMaps2 = _interopRequireDefault(_NetworkGoogleMaps);

var _GlobalInitialization = require("./global-initialize/Global-Initialization");

var _GlobalInitialization2 = _interopRequireDefault(_GlobalInitialization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InitializeParams = function () {
    function InitializeParams() {
        var _this = this;

        _classCallCheck(this, InitializeParams);

        this.maps = {
            activated: true,
            type: "NativeMap",
            style: "dark",
            id: "map"
        };

        this.mining = {
            activated: true,
            style: "dark",
            id: "webDollar"
        };

        this.wallet = {
            activated: true,
            style: "dark",
            id: "webDollar"
        };

        /**
         * On Window Load
         */
        _Browser2.default.addEvent(window, "load", function (event) {
            console.log("User-Interface-Loaded");
            _this.load();
        });
    }

    _createClass(InitializeParams, [{
        key: "load",
        value: function load() {
            _GlobalInitialization2.default.initializeGlobalSettings();
            this.loadMaps();
        }
    }, {
        key: "loadMaps",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(this.maps.activated === false)) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return", false);

                            case 2:
                                if (!(document.getElementById(this.maps.id) === null)) {
                                    _context.next = 5;
                                    break;
                                }

                                console.log("The element " + this.maps.id + " was not found in your document");
                                return _context.abrupt("return", false);

                            case 5:
                                if (!(this.maps.type === "NativeMap")) {
                                    _context.next = 12;
                                    break;
                                }

                                _NetworkNativeMapDOM2.default.addCSS(this.maps.style);
                                _NetworkNativeMapDOM2.default.addHTML(this.maps.id);

                                _NetworkNativeMap2.default.createMap(this.maps.id);
                                _context.next = 11;
                                return _NetworkNativeMap2.default.initialize();

                            case 11:

                                _NetworkNativeMap2.default.createTestConnections();

                            case 12:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function loadMaps() {
                return _ref.apply(this, arguments);
            }

            return loadMaps;
        }()
    }]);

    return InitializeParams;
}();

exports.default = new InitializeParams();

},{"../helpers/Browser.helpers":28,"../maps/Google-Maps/Network-Google-Maps.js":33,"../maps/Native-Map/Network-Native-Map":37,"../maps/Native-Map/Network-Native-Map-DOM":36,"./global-initialize/Global-Initialization":30}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Browser = require("../../helpers/Browser.helpers");

var _Browser2 = _interopRequireDefault(_Browser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GlobalInitialization = function () {
    function GlobalInitialization() {
        _classCallCheck(this, GlobalInitialization);
    }

    _createClass(GlobalInitialization, [{
        key: "initializeGlobalSettings",
        value: function initializeGlobalSettings() {

            //-----------------------
            // Int Script
            //-----------------------

            if (document.getElementById("WebdollarFont") === null) document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", "<link id=\"WebdollarFont\" href=\"http://192.168.1.2:8080/public/assets/fonts/avenir-light.woff\" rel=\"stylesheet\">");

            if (document.getElementById("WebdollarViewPort") === null) document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", "<meta id=\"WebdollarViewPort\" name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>");

            window.screenHeight = window.innerHeight;
            window.screenWidth = window.innerWidth;

            _Browser2.default.addEvent(window, "resize", function (event) {
                window.screenHeight = window.innerHeight;
                window.screenWidth = window.innerWidth;
            });
        }
    }]);

    return GlobalInitialization;
}();

exports.default = new GlobalInitialization();

},{"../../helpers/Browser.helpers":28}],31:[function(require,module,exports){
'use strict';

var _Dashboard = require('./components/Dashboard.vue');

var _Dashboard2 = _interopRequireDefault(_Dashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vue = require('vue');

window.onload = function () {

    new Vue({
        el: '#webDollar',
        render: function render(h) {
            return h(_Dashboard2.default);
        }
    });
};

},{"./components/Dashboard.vue":13,"vue":11}],32:[function(require,module,exports){
(function (global){
"use strict";

var _NetworkNativeMap = require("./maps/Native-Map/Network-Native-Map");

var _NetworkNativeMap2 = _interopRequireDefault(_NetworkNativeMap);

var _NetworkGoogleMaps = require("./maps/Google-Maps/Network-Google-Maps.js");

var _NetworkGoogleMaps2 = _interopRequireDefault(_NetworkGoogleMaps);

var _Browser = require("./helpers/Browser.helpers");

var _Browser2 = _interopRequireDefault(_Browser);

var _InitializeParams = require("./initialize-params/Initialize-Params");

var _InitializeParams2 = _interopRequireDefault(_InitializeParams);

var _Mining = require("./mining/Mining");

var _Mining2 = _interopRequireDefault(_Mining);

var _Wallet = require("./wallet/Wallet");

var _Wallet2 = _interopRequireDefault(_Wallet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./main-vue');

var exportObject = {
    Network: {
        NativeMap: _NetworkNativeMap2.default,
        GoogleMaps: _NetworkGoogleMaps2.default
    },

    Wallet: _Wallet2.default,
    Mining: _Mining2.default,

    Helpers: {
        BrowserHelpers: _Browser2.default
    },
    InitializeParams: _InitializeParams2.default
};

module.exports = exportObject;

//browser minimized script
if (typeof global.window !== 'undefined') global.window.WebDollarUserInterface = exportObject;

if (typeof window !== 'undefined') window.WebDollarUserInterface = exportObject;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./helpers/Browser.helpers":28,"./initialize-params/Initialize-Params":29,"./main-vue":31,"./maps/Google-Maps/Network-Google-Maps.js":33,"./maps/Native-Map/Network-Native-Map":37,"./mining/Mining":45,"./wallet/Wallet":46}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Maps = require("./../Maps.tester");

var _Maps2 = _interopRequireDefault(_Maps);

var _networkMapStyleLight = require("./styles/network-map-style-light");

var _networkMapStyleLight2 = _interopRequireDefault(_networkMapStyleLight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NetworkGoogleMaps = function () {

    /*
        markers = []
     */

    function NetworkGoogleMaps() {
        _classCallCheck(this, NetworkGoogleMaps);

        console.log("NetworkMap constructor");

        this._markers = [];

        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        this.icons = {

            general: {
                icon: 'http://maps.google.com/mapfiles/ms/micons/red.png'
            },
            myself: {
                icon: 'http://pic2.iranshao.com/emoji/qq/4.gif'
            },
            fullNodeServer: {
                icon: 'http://icons.iconarchive.com/icons/blackvariant/button-ui-system-apps/16/Terminal-icon.png'
            },
            webPeer: {
                icon: 'http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/16/Browser-icon.png'
            },
            clientSocket: {
                icon: 'http://icons.iconarchive.com/icons/simplefly/simple-green/16/plug-electricity-icon.png'
            }
        };
    }

    _createClass(NetworkGoogleMaps, [{
        key: "createMap",
        value: function createMap(id, style) {

            if (style === undefined) style = _networkMapStyleLight2.default.style;

            var map = new google.maps.Map(document.getElementById(id), {
                zoom: 2,
                center: { lat: 37.390487, lng: 29.308516 },
                mapTypeId: 'roadmap',
                styles: style
            });

            window.map = map;

            this._map = map;

            return map;
        }
    }, {
        key: "createTestConnections",
        value: function createTestConnections() {

            var mapsTester = new _Maps2.default(this);
            mapsTester.testConnections();
        }
    }, {
        key: "initialize",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(google === undefined || google.maps === undefined)) {
                                    _context3.next = 3;
                                    break;
                                }

                                alert('GOOGLE MAPS LIBRARY IS NOT REGISTERED');
                                return _context3.abrupt("return", false);

                            case 3:

                                WebDollar.Node.NodesList.emitter.on("nodes-list/connected", function () {
                                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(nodesListObject) {
                                        var geoLocation;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return nodesListObject.socket.node.sckAddress.getGeoLocation();

                                                    case 2:
                                                        geoLocation = _context.sent;


                                                        //console.log("geoLocation",geoLocation);

                                                        _this._addMarker(geoLocation, nodesListObject.socket);

                                                    case 4:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function (_x) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }());

                                WebDollar.Node.NodesList.emitter.on("nodes-list/disconnected", function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(nodesListObject) {
                                        var markerIndex;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:

                                                        //deleting the marker

                                                        markerIndex = _this._findMarkerIndexBySocket(nodesListObject.socket);


                                                        if (markerIndex !== -1) {

                                                            _this._markers[markerIndex].setMap(null);

                                                            if (_this._markers[markerIndex].curveMarker !== undefined) _this._markers[markerIndex].curveMarker.setMap(null);
                                                            if (_this._markers[markerIndex].linePoly !== undefined) _this._markers[markerIndex].linePoly.setMap(null);
                                                            if (_this._markers[markerIndex].infoWindow !== undefined) _this._markers[markerIndex].infoWindow.setMap(null);

                                                            _this._markers.splice(markerIndex, 1);
                                                        }

                                                    case 2:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this);
                                    }));

                                    return function (_x2) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());

                                _context3.next = 7;
                                return this._showMyself();

                            case 7:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function initialize() {
                return _ref.apply(this, arguments);
            }

            return initialize;
        }()
    }, {
        key: "_getInfoWindowContent",
        value: function _getInfoWindowContent(geoLocation, socket) {

            var address = '';
            if (socket === 'myself') address = 'YOU';else if (socket === 'fake') address = geoLocation.country;else address = socket.node.sckAddress.toString();

            return '<div id="content">' + '<div id="siteNotice">' + '</div>' + '<h1 class="firstHeading" style="padding-bottom: 0">' + address + '</h1>' + '<h2 class="secondHeading">' + (socket === 'myself' || socket === "fake" ? '' : socket.node.type + ' : ' + socket.node.index) + '</h2>' + '<div id="bodyContent">' + '<p>Connected to <b>' + (geoLocation.city || '') + ', ' + geoLocation.country || '' + '</b> <br/>' + geoLocation.isp || '' + '<br/> <br/>' + (geoLocation.lat || '0') + '    ' + (geoLocation.lng || '0') + '<br/>' + '</p>' + '</div>' + '</div>';
        }
    }, {
        key: "_findMarkerIndexBySocket",
        value: function _findMarkerIndexBySocket(socket) {

            for (var i = 0; i < this._markers.length; i++) {
                if (this._markers[i].socket === socket) return i;
            }return -1;
        }
    }, {
        key: "_addMarker",
        value: function _addMarker(geoLocation, socket) {

            if (google === undefined || google.maps === undefined) {
                alert('GOOGLE MAPS LIBRARY IS NOT REGISTERED');
                return false;
            }

            //console.log("marker ", google.maps.Marker, map)

            var position = { lat: geoLocation.lat || 0, lng: geoLocation.lng || 0 };

            var feature = '';

            if (socket === 'myself') feature = 'myself';else if (socket === 'fake') feature = 'webPeer';else if (socket !== null) switch (socket.node.type) {
                case 'client':
                    feature = 'fullNodeServer';break;
                case 'server':
                    feature = 'clientSocket';break;
                case 'webpeer':
                    feature = 'webPeer';break;
            }

            var marker = new google.maps.Marker({
                position: position,
                map: this._map,
                clickable: true,
                icon: this.icons.hasOwnProperty(feature) ? this.icons[feature].icon : this.icons['general']
            });

            var infoWindow = new google.maps.InfoWindow({
                content: this._getInfoWindowContent(geoLocation, socket)
            });

            marker.addListener('click', function () {
                infoWindow.open(this._map, marker);
            });

            marker.socket = socket;
            marker.infoWindow = infoWindow;

            this._markers.push(marker);

            this._createConnectionsArcs(false);
        }
    }, {
        key: "_showMyself",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var geoLocation;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return WebDollar.Applications.GeoHelper.getLocationFromAddress('', true);

                            case 2:
                                geoLocation = _context4.sent;


                                this._addMarker(geoLocation, 'myself');

                            case 4:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function _showMyself() {
                return _ref4.apply(this, arguments);
            }

            return _showMyself;
        }()
    }, {
        key: "initializePolylines",
        value: function initializePolylines() {
            var _this2 = this;

            this._createConnectionsArcs(false);
            google.maps.event.addListener(this._map, 'projection_changed', function () {
                _this2._createConnectionsArcs(true);
            });
            google.maps.event.addListener(this._map, 'zoom_changed', function () {
                _this2._createConnectionsArcs(true);
            });

            // google.maps.event.addListener(markerP1, 'position_changed', updateCurveMarker);
        }
    }, {
        key: "_createConnectionsArcs",
        value: function _createConnectionsArcs(update, showOldArcs) {

            if (showOldArcs === undefined) showOldArcs = false;

            /*
                TUTORIAL - BASED ON http://jsfiddle.net/medmunds/sd10up9t/
             */

            var markerMyself = null;
            for (var i = 0; i < this._markers.length; i++) {
                if (this._markers[i].socket === "myself") {
                    markerMyself = this._markers[i];
                    break;
                }
            }if (markerMyself === null) {
                console.log("NetworkMap: No Marker Myself");
                return false;
            }

            var projection = this._map.getProjection();

            if (!projection) {
                console.log("NetworkMap - PROJECT is not defined");
                return false;
            }

            var pos1 = markerMyself.getPosition(); // latlng
            var p1 = projection.fromLatLngToPoint(pos1); // xy

            var Point = google.maps.Point;

            var curvature = 0.2; // how curvy to make the arc

            for (var _i = 0; _i < this._markers.length; _i++) {
                if (this._markers[_i] !== markerMyself) {
                    var marker = this._markers[_i];

                    var pos2 = marker.getPosition();
                    var lineColor = 'black';

                    if (marker.socket === "fake") lineColor = "navy";else switch (marker.socket.node.type) {
                        case 'client':
                            lineColor = 'red';break;
                        case 'server':
                            lineColor = 'red';break;
                        case 'webpeer':
                            lineColor = 'blue';break;
                    }

                    if (showOldArcs) {

                        var p2 = projection.fromLatLngToPoint(pos2);

                        // Calculate the arc.
                        // To simplify the math, these points
                        // are all relative to p1:
                        var e = new Point(p2.x - p1.x, p2.y - p1.y),
                            // endpoint (p2 relative to p1)
                        m = new Point(e.x / 2, e.y / 2),
                            // midpoint
                        o = new Point(e.y, -e.x),
                            // orthogonal
                        c = new Point( // curve control point
                        m.x + curvature * o.x, m.y + curvature * o.y);

                        var pathDef = 'M 0,0 ' + 'q ' + c.x + ',' + c.y + ' ' + e.x + ',' + e.y;

                        var zoom = this._map.getZoom(),
                            scale = Math.max(1 / Math.pow(2, -zoom), 0.1);

                        var symbol = {
                            path: pathDef,
                            scale: scale,
                            strokeWeight: 2,
                            fillColor: 'none'
                        };

                        if (!marker.curveMarker) marker.curveMarker = new google.maps.Marker({
                            position: pos1,
                            clickable: false,
                            icon: symbol,
                            zIndex: 0, // behind the other markers
                            map: this._map
                        });else marker.curveMarker.setOptions({
                            position: pos1,
                            icon: symbol
                        });

                        //line polyline
                    } else if (update === false) {

                        var polyPath = [{ lat: pos1.lat(), lng: pos1.lng() }, { lat: pos2.lat(), lng: pos2.lng() }];

                        if (!marker.linePoly) {
                            //creating for the first time a linePoly

                            marker.linePoly = new google.maps.Polyline({
                                path: polyPath,
                                geodesic: true,
                                strokeColor: lineColor,
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                            });

                            marker.linePoly.setMap(this._map);
                        } else marker.linePoly.setOptions({
                            position: polyPath
                        });
                    }
                }
            }
        }
    }]);

    return NetworkGoogleMaps;
}();

exports.default = new NetworkGoogleMaps();

},{"./../Maps.tester":35,"./styles/network-map-style-light":34}],34:[function(require,module,exports){
"use strict";

exports.style = [{
    "featureType": "administrative.land_parcel",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "administrative.neighborhood",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#e0efef"
    }, {
        "visibility": "on"
    }]
}, {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#c0e8e8"
    }, {
        "hue": "#1900ff"
    }, {
        "visibility": "on"
    }]
}, {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "poi.business",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
        "lightness": 100
    }, {
        "visibility": "simplified"
    }]
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.arterial",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "road.local",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit",
    "stylers": [{
        "visibility": "off"
    }]
}, {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{
        "lightness": 700
    }, {
        "visibility": "on"
    }]
}, {
    "featureType": "water",
    "stylers": [{
        "color": "#7dcdcd"
    }]
}, {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [{
        "visibility": "off"
    }]
}];

},{}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapsTester = function () {
    function MapsTester(parent) {
        _classCallCheck(this, MapsTester);

        this.parent = parent;
    }

    _createClass(MapsTester, [{
        key: 'testConnections',
        value: function testConnections() {

            this._createFakeMarker({ country: 'USA', lat: 37.980388, lng: -92.539714 }, 2000);
            this._createFakeMarker({ country: 'USA', lat: 36.828015, lng: -119.458796 }, 3100);
            this._createFakeMarker({ country: 'Brazil', lat: -10.252334, lng: -55.143146 }, 4200);
            this._createFakeMarker({ country: 'Germany', lat: 51.809770, lng: 8.688927 }, 2000);
            this._createFakeMarker({ country: 'France', lat: 44.745281, lng: 2.080051 }, 1500);
            this._createFakeMarker({ country: 'Russia', lat: 56.875767, lng: 41.410924 }, 3500);
            this._createFakeMarker({ country: 'India', lat: 17.001243, lng: 78.807492 }, 2500);
            this._createFakeMarker({ country: 'UK', lat: 53.376271, lng: -0.660215 }, 1500);
            this._createFakeMarker({ country: 'China', lat: 29.832851, lng: 120.072671 }, 5000);
            this._createFakeMarker({ country: 'South Africa', lat: -29.256599, lng: 24.324561 }, 5000);
            this._createFakeMarker({ country: 'Portugal', lat: 38.989770, lng: -7.430283 }, 5100);
            this._createFakeMarker({ country: 'Australia', lat: -34.041968, lng: 150.994123 }, 5200);
            this._createFakeMarker({ country: 'Saint Petersburg', lat: 59.884495, lng: 30.434003 }, 5100);
            this._createFakeMarker({ country: 'Saudi', lat: 24.759399, lng: 46.640036 }, 4800);
            this._createFakeMarker({ country: 'Mexico', lat: 19.409722, lng: -98.991313 }, 2200);
            this._createFakeMarker({ country: 'USA', lat: 31.124374, lng: -97.531948 }, 2200);
            this._createFakeMarker({ country: 'South Korea', lat: 37.542154, lng: 126.988170 }, 3400);
            this._createFakeMarker({ country: 'Buenos Aires', lat: -34.534501, lng: -58.438049 }, 3400);
        }
    }, {
        key: '_createFakeMarker',
        value: function _createFakeMarker(coordinates, timeOut) {
            var _this = this;

            setTimeout(function () {

                //console.log("coordinates", coordinates);
                _this.parent._addMarker(coordinates, "fake");
            }, timeOut);
        }
    }]);

    return MapsTester;
}();

exports.default = MapsTester;

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CSSId = "css" + Math.floor(Math.random() * 100000);
var CSS = "<style id='" + CSSId + "'>" + require('./res/network-native.css') + "</style>";
var Html = require('./res/network-native-map.html');
var DialogHtml = require('./res/network-native-map-dialog.html');

var NetworkNativeMapDOM = function () {
    function NetworkNativeMapDOM() {
        _classCallCheck(this, NetworkNativeMapDOM);
    }

    _createClass(NetworkNativeMapDOM, [{
        key: "addCSS",
        value: function addCSS(type) {

            if (document.getElementById(CSSId) !== null) return false;

            var parent = document.getElementsByTagName("head")[0];

            parent.insertAdjacentHTML('beforeend', CSS);
        }
    }, {
        key: "addHTML",
        value: function addHTML(divId) {

            var parent = document.getElementById(divId);

            if (document.getElementsByClassName('map-dialog').length === 0) parent.insertAdjacentHTML('beforebegin', DialogHtml);

            //parent.classList.add("mystyle");

            parent.insertAdjacentHTML('afterbegin', Html);
        }
    }]);

    return NetworkNativeMapDOM;
}();

exports.default = new NetworkNativeMapDOM();

},{"./res/network-native-map-dialog.html":42,"./res/network-native-map.html":43,"./res/network-native.css":44}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// import NodesList from 'node/lists/nodes-list'
// import NodesWaitList from 'node/lists/waitlist/nodes-waitlist'
// import { NodesWaitListObject, NODES_WAITLIST_OBJECT_TYPE } from 'node/lists/waitlist/nodes-waitlist-object';


var _Maps = require("./../Maps.tester");

var _Maps2 = _interopRequireDefault(_Maps);

var _CircleMap = require("./helpers/Circle-Map");

var _CircleMap2 = _interopRequireDefault(_CircleMap);

var _MapModal = require("./helpers/Map-Modal");

var _MapModal2 = _interopRequireDefault(_MapModal);

var _CellCounter = require("./helpers/Cell-Counter");

var _CellCounter2 = _interopRequireDefault(_CellCounter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NetworkNativeMaps = function () {
    function NetworkNativeMaps() {
        _classCallCheck(this, NetworkNativeMaps);

        this._markers = [];
        this._markerMyself = null;
    }

    _createClass(NetworkNativeMaps, [{
        key: "createMap",
        value: function createMap(mapSelector) {
            var _this = this;

            if (mapSelector[0] !== '#') mapSelector = '#' + mapSelector;

            mapSelector = (mapSelector || '#map') + ' svg';

            this._mapElem = document.querySelector(mapSelector);
            if (this._mapElem === null) {
                throw "map is not specified. Invalid selector" + mapSelector + ". Try '#map svg'";
            }

            this._circleMap = new _CircleMap2.default(this._mapElem);

            this._mapModal = new _MapModal2.default();
            this._mapElem.onmousemove = function (e) {
                return _this._mapHighlight(e);
            };

            this._cellCounter = new _CellCounter2.default();
        }
    }, {
        key: "initialize",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var _this2 = this;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:

                                WebDollar.Node.NodesList.emitter.on("nodes-list/connected", function () {
                                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(nodesListObject) {
                                        var geoLocation;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return nodesListObject.socket.node.sckAddress.getGeoLocation();

                                                    case 2:
                                                        geoLocation = _context.sent;


                                                        _this2._addMarker(geoLocation, nodesListObject.socket);

                                                    case 4:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this2);
                                    }));

                                    return function (_x) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }());

                                WebDollar.Node.NodesList.emitter.on("nodes-list/disconnected", function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(nodesListObject) {
                                        var markerIndex;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:

                                                        //deleting the marker
                                                        markerIndex = _this2._findMarkerIndexBySocket(nodesListObject.socket);


                                                        if (markerIndex !== -1) _this2._removeMarker(_this2._markers[markerIndex]);

                                                    case 2:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this2);
                                    }));

                                    return function (_x2) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());

                                //Waitlist p2p
                                WebDollar.Node.NodesWaitlist.emitter.on("waitlist/new-node", function () {
                                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(nodesWaitlistObject) {
                                        var geoLocation;
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        _context3.next = 2;
                                                        return nodesWaitlistObject.sckAddresses[0].getGeoLocation();

                                                    case 2:
                                                        geoLocation = _context3.sent;


                                                        _this2._addMarker(geoLocation, nodesWaitlistObject);

                                                    case 4:
                                                    case "end":
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this2);
                                    }));

                                    return function (_x3) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }());

                                WebDollar.Node.NodesWaitlist.emitter.on("waitlist/delete-node", function () {
                                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(nodesWaitlistObject) {
                                        var markerIndex;
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:

                                                        //deleting the marker
                                                        markerIndex = _this2._findMarkerIndexBySocket(nodesWaitlistObject);


                                                        if (markerIndex !== -1) _this2._removeMarker(_this2._markers[markerIndex]);

                                                    case 2:
                                                    case "end":
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this2);
                                    }));

                                    return function (_x4) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }());

                                _context5.next = 6;
                                return this._showMyself();

                            case 6:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function initialize() {
                return _ref.apply(this, arguments);
            }

            return initialize;
        }()
    }, {
        key: "_showMyself",
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var geoLocation;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return WebDollar.Applications.GeoHelper.getLocationFromAddress('', true);

                            case 2:
                                geoLocation = _context6.sent;


                                this._addMarker(geoLocation, 'myself');

                            case 4:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function _showMyself() {
                return _ref6.apply(this, arguments);
            }

            return _showMyself;
        }()
    }, {
        key: "_addMarker",
        value: function _addMarker(geoLocation, socket) {

            var marker = {
                socket: socket,
                desc: this._getInfoWindowContent(geoLocation, socket)
            };

            this._markers.push(marker);

            if (socket === "myself") this.highlightMe(marker);else if (socket === "fake") this.highlightConnectedPeer(marker);else this.highlightConnectedPeer(marker);
        }
    }, {
        key: "highlightMe",
        value: function highlightMe(marker) {

            this._markerMyself = marker;

            var cell = this._circleMap.getCellByLocation(marker.desc.pos.lat, marker.desc.pos.lng);
            if (cell) {
                marker.cell = cell;

                this._circleMap.highlightCell(cell, 'peer-own', marker.desc);

                this._cellCounter.incCellCount(cell);

                //add links to current nodes
                for (var i = 0; i < this._markers.length; i++) {
                    if (this._markers[i] !== marker && this._markers[i].status === "connected") this._circleMap.addLink(cell, this._markers[i].cell);
                }
            }
        }
    }, {
        key: "highlightConnectedPeer",
        value: function highlightConnectedPeer(marker) {

            var cell = this._circleMap.getCellByLocation(marker.desc.pos.lat, marker.desc.pos.lng);
            if (cell) {

                marker.cell = cell;

                var cellClass = void 0;

                if (marker.desc.nodeType === "myself") cellClass = "peer-own";else if (marker.desc.nodeType === "browser") cellClass = "peer-connected-browser";
                if (marker.desc.nodeType === "terminal") cellClass = "peer-connected-terminal";

                this._circleMap.highlightCell(cell, cellClass, marker.desc);

                this._cellCounter.incCellCount(cell);

                //add links to the myselfMarker
                if (marker.desc.status === "connected") if (this._markerMyself !== null && this._markerMyself !== undefined && this._markerMyself !== marker) this._circleMap.addLink(cell, this._markerMyself.cell);
            }
        }
    }, {
        key: "_getInfoWindowContent",
        value: function _getInfoWindowContent(geoLocation, socket) {

            var address = '',
                nodeType = '',
                status = "node",
                nodeProtocol = '',
                nodeIndex = 0;

            if (socket === 'myself') {
                status = "connected";
                address = geoLocation.address;
                nodeType = "myself";
            } else if (socket === 'fake') {
                address = geoLocation.country;

                if (Math.floor(Math.random() * 2) === 0) status = "connected";else status = "not connected";

                if (Math.floor(Math.random() * 2) === 0) nodeType = "browser";else nodeType = "terminal";
            } else if ((typeof socket === "undefined" ? "undefined" : _typeof(socket)) === "object" && socket.node !== undefined && socket.node.protocol !== undefined && socket.node.protocol.helloValidated) {
                address = socket.node.sckAddress.toString();
                status = "connected";

                switch (socket.node.type) {
                    case 'client':
                        nodeType = 'terminal';break;
                    case 'server':
                        nodeType = 'terminal';break;
                    case 'webpeer':
                        nodeType = 'browser';break;
                }

                nodeProtocol = socket.node.type;
                nodeIndex = socket.node.index;
            } else if (socket instanceof WebDollar.Node.NodesWaitlist.NodesWaitlistObject) {
                //its a waitlist

                address = socket;

                switch (socket.type) {
                    case WebDollar.Node.NodesWaitlist.NODES_WAITLIST_OBJECT_TYPE.WEB_RTC_PEER:
                        nodeType = 'browser';break;
                    case WebDollar.Node.NodesWaitlist.NODES_WAITLIST_OBJECT_TYPE.NODE_PEER_TERMINAL_SERVER:
                        nodeType = 'terminal';break;
                }

                status = "not connected";
                nodeProtocol = nodeType;
                nodeIndex = -1;
            }

            var position = { lat: geoLocation.lat || 0, lng: geoLocation.lng || 0 };

            return {
                status: status,
                city: geoLocation.city || '',
                country: geoLocation.country || '',
                address: address,
                protocol: nodeProtocol,
                index: nodeIndex,
                isp: geoLocation.isp || '',
                pos: position,
                nodeType: nodeType
            };
        }
    }, {
        key: "_mapHighlight",
        value: function _mapHighlight(e) {

            if (e.target.data) {
                var data = e.target.data;
                this._mapModal.show(data);
            } else this._mapModal.hide();
        }
    }, {
        key: "_removeMarker",
        value: function _removeMarker(marker) {

            if (marker.cell !== undefined && marker.cell !== null) {

                // Only remove highlight if there are no more peers on this cell.
                if (this._cellCounter.decCellCount(marker.cell) === 0) {
                    // Either change class if there are still known peers there.
                    if (this._cellCounter.getCellCount(marker.cell) > 0) {
                        this._circleMap.highlightCell(marker.cell, 'peer-connected-browser', undefined);
                    }
                    // Or remove class at all.
                    else this._circleMap.unhighlightCell(marker.cell);

                    if (this._markerMyself !== marker && this._markerMyself !== null) this._circleMap.removeLink(this._markerMyself.cell, marker.cell);
                }
            }

            //delete marker from the list
            for (var i = 0; i < this._markers.length; i++) {
                if (this._markers[i] === marker) {
                    this._markers.splice(i, 1);
                    break;
                }
            }
        }
    }, {
        key: "createTestConnections",
        value: function createTestConnections() {

            var mapsTester = new _Maps2.default(this);
            mapsTester.testConnections();
        }
    }, {
        key: "_createTestConnectionsManual",
        value: function _createTestConnectionsManual() {
            var cell1 = this._circleMap.getCellByLocation(66.160507, -153.369141);
            var cell2 = this._circleMap.getCellByLocation(73.500823, -21.755973);
            var cell3 = this._circleMap.getCellByLocation(-28.083, 23.044);
            var cell4 = this._circleMap.getCellByLocation(-20.72, 127.10);

            var data = {
                status: status,
                city: "Bucharest",
                country: "RO",
                protocol: "peer",
                addr: "76.44.22.11"
            };

            this._circleMap.addLink(cell1, cell2);
            this._circleMap.addLink(cell2, cell3);
            this._circleMap.addLink(cell3, cell4);

            this._circleMap.highlightCell(cell1, 'known-peer', data);
            this._circleMap.highlightCell(cell2, 'own-peer', data);
            this._circleMap.highlightCell(cell3, 'own-peer', data);
            this._circleMap.highlightCell(cell4, 'own-peer', data);
        }
    }, {
        key: "_findMarkerIndexBySocket",
        value: function _findMarkerIndexBySocket(socket) {

            for (var i = 0; i < this._markers.length; i++) {
                if (this._markers[i].socket === socket) return i;
            }return -1;
        }
    }]);

    return NetworkNativeMaps;
}();

exports.default = new NetworkNativeMaps();

},{"./../Maps.tester":35,"./helpers/Cell-Counter":38,"./helpers/Circle-Map":39,"./helpers/Map-Modal":40}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CellCounter = function () {
    function CellCounter() {
        _classCallCheck(this, CellCounter);

        this._cellCount = {};
    }

    _createClass(CellCounter, [{
        key: "incCellCount",
        value: function incCellCount(cell) {
            if (!this._cellCount[cell.cellId]) {
                this._cellCount[cell.cellId] = 0;
            }
            this._cellCount[cell.cellId]++;
        }
    }, {
        key: "decCellCount",
        value: function decCellCount(cell) {
            if (!this._cellCount[cell.cellId]) {
                this._cellCount[cell.cellId] = 0;
            }
            if (this._cellCount[cell.cellId] > 0) {
                return --this._cellCount[cell.cellId];
            }
            return 0;
        }
    }, {
        key: "getCellCount",
        value: function getCellCount(cell) {
            return this._cellCount[cell.cellId] || 0;
        }
    }]);

    return CellCounter;
}();

exports.default = CellCounter;

},{}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RobinsonProjection = require('./RobinsonProjection');

var _RobinsonProjection2 = _interopRequireDefault(_RobinsonProjection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CircleMap = function () {
    function CircleMap(svgElement) {
        _classCallCheck(this, CircleMap);

        this._svg = svgElement;
        // temporarily unhide all the circlesto get the bounding rects

        svgElement.classList.remove('hide-circles');

        var mapDimensions = this.getDimensions(); // also enforces a style update
        this._circleDiameter = 0;
        var circles = svgElement.querySelectorAll('circle');

        for (var i = 0; i < circles.length; ++i) {
            circles[i].cellId = i;
            var boundingBox = circles[i].getBoundingClientRect();
            // values relative to map width / height such that they work also when we resize the map
            circles[i].centerX = (boundingBox.left + boundingBox.width / 2 - mapDimensions.left) / mapDimensions.width;
            circles[i].centerY = (boundingBox.top + boundingBox.height / 2 - mapDimensions.top) / mapDimensions.height;
            // the circles differ very slightly in size, so we take the biggest
            this._circleDiameter = Math.max(this._circleDiameter, boundingBox.width / mapDimensions.width);
        }
        this._cells = circles;
        this._links = [];
        // after we got the circle bounding rects, we can hide them again
        svgElement.classList.add('hide-circles');
    }

    _createClass(CircleMap, [{
        key: 'getDimensions',
        value: function getDimensions() {
            return this._svg.getBoundingClientRect();
        }
    }, {
        key: 'unhighlightCell',
        value: function unhighlightCell(cell) {
            cell.setAttribute('class', '');
            cell.data = null;
        }
    }, {
        key: 'highlightCell',
        value: function highlightCell(cell, className, data) {
            cell.setAttribute('class', className);

            if (className === 'own-peer') {
                // put my own cell on top of everything else. In svg the stacking is not affected by z-index, but
                // only by document order. So we make the cell the last child
                cell.parentElement.appendChild(cell);
            }

            // XXX another hack
            if (data) {
                cell.data = data;
            }
        }
    }, {
        key: '_convertCoordinates',
        value: function _convertCoordinates(latitude, longitude) {
            var mapDimensions = this.getDimensions();
            // the map that we have is cropped out from the full robinson projected map. We have to make
            // the computation on the full/original map, so we calculate the full size.
            var fullMapWidth = 1.0946808510638297 * mapDimensions.width;
            var fullMapHeight = fullMapWidth / 1.97165551906973; // RobinsonProjection maps have a fixed aspect ratio
            var projection = new _RobinsonProjection2.default(fullMapWidth, fullMapHeight);
            var point = projection.project(latitude, longitude);
            // the origin is centered in the middle of the map, so we translate it
            // to the top left corner
            point.x = fullMapWidth / 2 + point.x;
            point.y = fullMapHeight / 2 - point.y;
            // the map that we have is robinson projected and then cropped out and scaled
            point.x = Math.max(0, point.x - 0.07045675413022352 * fullMapWidth);
            point.y = Math.max(0, point.y - 0.012380952380952381 * fullMapHeight);
            return point;
        }
    }, {
        key: '_testCoordinateConversion',
        value: function _testCoordinateConversion(latitude, longitude) {
            var testDot = window.testDot;
            if (!testDot) {
                testDot = document.createElement('div');
                testDot.style.background = 'red';
                testDot.style.width = '5px';
                testDot.style.height = '5px';
                testDot.style.position = 'absolute';
                document.body.appendChild(testDot);
                window.testDot = testDot;
            }
            var convertedCoordinates = this._convertCoordinates(latitude, longitude);
            console.log(convertedCoordinates);
            testDot.style.left = convertedCoordinates.x - 2 + 'px';
            testDot.style.top = convertedCoordinates.y - 2 + 'px';
        }
    }, {
        key: '_getClosestCell',
        value: function _getClosestCell(x, y) {
            var mapDimensions = this.getDimensions();
            var bestDistance = 0;
            var bestCell = null;

            for (var i = 0; i < this._cells.length; ++i) {
                // Calculate position from bounding box.
                var cell = this._cells[i];
                var centerX = cell.centerX * mapDimensions.width;
                var centerY = cell.centerY * mapDimensions.height;
                var xDist = centerX - x;
                var yDist = centerY - y;
                var distance = xDist * xDist + yDist * yDist;

                // Update best cell accordingly.
                if (!bestCell || distance < bestDistance) {
                    bestDistance = distance;
                    bestCell = cell;
                }
            }

            // Return best cell only if its distance in terms of cells is not too far.
            var circleDiameter = this._circleDiameter * mapDimensions.width;
            return bestDistance > CircleMap.MAX_CELL_DISTANCE * circleDiameter ? null : bestCell;
        }
    }, {
        key: 'getCellByLocation',
        value: function getCellByLocation(latitude, longitude) {
            var convertedCoordinates = this._convertCoordinates(latitude, longitude);
            var closestCell = this._getClosestCell(convertedCoordinates.x, convertedCoordinates.y);
            return closestCell;
        }
    }, {
        key: 'addLink',
        value: function addLink(startCell, endCell) {

            if (!startCell || !endCell) {
                return;
            }

            // search whether we already drew that link
            for (var i = 0, link; link = this._links[i]; ++i) {
                if (link.start === startCell && link.end === endCell || link.end === startCell && link.start === endCell) {
                    return;
                }
            }

            // draw the link
            var svgBoundingRect = this.getDimensions();
            var viewBox = this._svg.viewBox;
            var viewBoxWidth = viewBox.baseVal.width;
            var viewBoxHeight = viewBox.baseVal.height;
            var pathEl = document.createElementNS(this._svg.namespaceURI, 'path');

            var path = 'M' + startCell.centerX * viewBoxWidth + ' ' + startCell.centerY * viewBoxHeight + 'L' + endCell.centerX * viewBoxWidth + ' ' + endCell.centerY * viewBoxHeight;

            pathEl.setAttributeNS(null, 'd', path);
            pathEl.classList.add('link');

            this._links.push({
                start: startCell,
                end: endCell,
                path: pathEl
            });

            // insert the path before the startCell such that it will not be drawn over the startCell
            startCell.parentElement.append(pathEl);
            //startCell.parentElement.insertBefore(pathEl, startCell);
        }
    }, {
        key: 'removeLink',
        value: function removeLink(startCell, endCell) {
            for (var i = 0, link; link = this._links[i]; ++i) {
                if (link.start === startCell && link.end === endCell || link.end === startCell && link.start === endCell) {
                    // we found the link
                    startCell.parentElement.removeChild(link.path);
                    this._links.splice(i, 1);
                    return;
                }
            }
        }
    }]);

    return CircleMap;
}();

CircleMap.MAX_CELL_DISTANCE = 12; // in terms of cells


exports.default = CircleMap;

},{"./RobinsonProjection":41}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapModal = function () {
    function MapModal() {
        _classCallCheck(this, MapModal);

        this._container = document.querySelector('.map-dialog-description');

        this._iconMyself = document.querySelector('.map-dialog-description .icon-myself');
        this._iconBrowser = document.querySelector('.map-dialog-description .icon-browser');
        this._iconTerminal = document.querySelector('.map-dialog-description .icon-terminal');

        this._text = document.querySelector('.map-dialog-description .map-dialog-description-text');
    }

    _createClass(MapModal, [{
        key: '_hideAllIcons',
        value: function _hideAllIcons(exclude) {
            if (exclude !== this._iconMyself) this._iconMyself.style.display = 'none';
            if (exclude !== this._iconBrowser) this._iconBrowser.style.display = 'none';
            if (exclude !== this._iconTerminal) this._iconTerminal.style.display = 'none';
        }
    }, {
        key: '_setNodeType',
        value: function _setNodeType(nodeType) {

            var icon = void 0;

            if (nodeType === 'myself') icon = this._iconMyself;else if (nodeType === 'browser') icon = this._iconBrowser;else if (nodeType === 'terminal') icon = this._iconTerminal;else icon = this._iconTerminal;

            icon.style.display = 'inline-block';
            this._hideAllIcons(icon);
        }
    }, {
        key: 'show',
        value: function show(desc) {
            this._setNodeType(desc.nodeType);

            this._text.innerHTML = '<b>' + desc.status + ' </b><br>' + desc.country + ', ' + desc.city + '<br><small>' + (desc.address || '&nbsp;') + '</small>';
            this._container.style.opacity = 1;
        }
    }, {
        key: 'hide',
        value: function hide() {
            this._container.style.opacity = 0;
        }
    }]);

    return MapModal;
}();

exports.default = MapModal;

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RobinsonProjection = function () {
    function RobinsonProjection(width) {
        _classCallCheck(this, RobinsonProjection);

        this._width = width;
        this._r = this._width / 5.332539516;
    }

    _createClass(RobinsonProjection, [{
        key: "project",
        value: function project(lat, lng) {
            var p = RobinsonProjection._project(lat, lng);
            return {
                x: p.x * this._r,
                y: p.y * this._r
            };
        }
    }], [{
        key: "_project",
        value: function _project(lat, lng) {
            // 5 degree intervals, so find right indices
            var lI = Math.floor((Math.abs(lat) - RobinsonProjection.EPS) / RobinsonProjection.INTERVAL);
            lI = Math.max(lI, 0);
            var hI = lI + 1;
            var ratio = (Math.abs(lat) - lI * RobinsonProjection.INTERVAL) / RobinsonProjection.INTERVAL;

            // interpolate x and y
            var xDist = RobinsonProjection.X[hI] - RobinsonProjection.X[lI];
            var yDist = RobinsonProjection.Y[hI] - RobinsonProjection.Y[lI];
            var x = (xDist * ratio + RobinsonProjection.X[lI]) * (Math.abs(lng) * RobinsonProjection.radians);
            x = lng < 0 ? -x : x;
            var y = yDist * ratio + RobinsonProjection.Y[lI];
            y = lat < 0 ? -y : y;

            return {
                x: x,
                y: y
            };
        }
    }]);

    return RobinsonProjection;
}();

RobinsonProjection.X = [0.8487, 0.84751182, 0.84479598, 0.840213, 0.83359314, 0.8257851, 0.814752, 0.80006949, 0.78216192, 0.76060494, 0.73658673, 0.7086645, 0.67777182, 0.64475739, 0.60987582, 0.57134484, 0.52729731, 0.48562614, 0.45167814];

RobinsonProjection.Y = [0, 0.0838426, 0.1676852, 0.2515278, 0.3353704, 0.419213, 0.5030556, 0.5868982, 0.67182264, 0.75336633, 0.83518048, 0.91537187, 0.99339958, 1.06872269, 1.14066505, 1.20841528, 1.27035062, 1.31998003, 1.3523];

RobinsonProjection.EPS = 1e-8;
RobinsonProjection.INTERVAL = 5;
RobinsonProjection.pi = Math.PI;
RobinsonProjection.radians = RobinsonProjection.pi / 180;
RobinsonProjection.degrees = 180 / RobinsonProjection.pi;

exports.default = RobinsonProjection;

},{}],42:[function(require,module,exports){
module.exports = "<!-- Popup Description -->\n<div class=\"map-dialog \">\n    <div class=\"map-dialog-description\">\n        <div>\n            <img class=\"icon-myself\" src=\"https://forum.noxiousnet.com/plugins/nodebb-plugin-emoji-one/static/images/1f60e.png\">\n            <img class=\"icon-browser\" src=\"http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/48/Browser-icon.png\">\n            <img class=\"icon-terminal\" src=\"http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/terminal-icon.png\">\n        </div>\n        <div class=\"map-dialog-description-text\"></div>\n    </div>\n</div>";

},{}],43:[function(require,module,exports){
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1082 502\" preserveAspectRatio=\"xMinYMin meet\" xml:space=\"preserve\" class=\"hide-circles\">\n    <circle cx=\"909.4049999999999\" cy=\"270.32666666666665\" r=\"3.6\" />\n    <circle cx=\"942.5949999999999\" cy=\"309.0416666666667\" r=\"3.6\" />\n    <circle cx=\"950.9049999999999\" cy=\"304.16833333333335\" r=\"3.6\" />\n    <circle cx=\"13.805\" cy=\"222.02166666666668\" r=\"3.6\" />\n    <circle cx=\"5.45\" cy=\"217.17833333333337\" r=\"3.6\" />\n    <circle cx=\"46.903333333333336\" cy=\"105.98666666666666\" r=\"3.6\" />\n    <circle cx=\"55.245000000000005\" cy=\"101.14333333333332\" r=\"3.6\" />\n    <circle cx=\"271.06166666666667\" cy=\"23.80666666666667\" r=\"3.6\" />\n    <circle cx=\"279.38500000000005\" cy=\"18.933333333333334\" r=\"3.6\" />\n    <circle cx=\"262.75499999999994\" cy=\"18.93666666666667\" r=\"3.6\" />\n    <circle cx=\"246.21833333333333\" cy=\"212.3283333333333\" r=\"3.6\" />\n    <circle cx=\"254.57500000000002\" cy=\"217.1716666666667\" r=\"3.6\" />\n    <circle cx=\"279.49999999999994\" cy=\"221.98333333333332\" r=\"3.6\" />\n    <circle cx=\"271.14500000000004\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"304.39\" cy=\"236.50333333333333\" r=\"3.6\" />\n    <circle cx=\"345.76666666666665\" cy=\"9.238333333333332\" r=\"3.6\" />\n    <circle cx=\"337.4366666666666\" cy=\"14.103333333333332\" r=\"3.6\" />\n    <circle cx=\"345.7616666666667\" cy=\"18.965\" r=\"3.6\" />\n    <circle cx=\"370.66\" cy=\"14.141666666666667\" r=\"3.6\" />\n    <circle cx=\"378.97499999999997\" cy=\"9.268333333333333\" r=\"3.6\" />\n    <circle cx=\"387.32500000000005\" cy=\"4.428333333333333\" r=\"3.6\" />\n    <circle cx=\"362.365\" cy=\"9.261666666666665\" r=\"3.6\" />\n    <circle cx=\"354.0783333333333\" cy=\"14.121666666666668\" r=\"3.6\" />\n    <circle cx=\"345.98499999999996\" cy=\"483.0466666666667\" r=\"3.6\" />\n    <circle cx=\"279.53\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"204.725\" cy=\"188.17500000000004\" r=\"3.6\" />\n    <circle cx=\"204.71\" cy=\"178.50333333333333\" r=\"3.6\" />\n    <circle cx=\"279.4983333333334\" cy=\"270.33666666666664\" r=\"3.6\" />\n    <circle cx=\"296.09333333333336\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"287.77\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"287.79333333333335\" cy=\"304.17499999999995\" r=\"3.6\" />\n    <circle cx=\"287.77\" cy=\"275.16333333333336\" r=\"3.6\" />\n    <circle cx=\"204.71\" cy=\"168.83333333333331\" r=\"3.6\" />\n    <circle cx=\"287.77\" cy=\"284.8333333333333\" r=\"3.6\" />\n    <circle cx=\"196.41666666666666\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"120.49333333333334\" r=\"3.6\" />\n    <circle cx=\"179.76\" cy=\"134.98666666666665\" r=\"3.6\" />\n    <circle cx=\"163.135\" cy=\"115.65666666666665\" r=\"3.6\" />\n    <circle cx=\"179.76\" cy=\"125.31666666666666\" r=\"3.6\" />\n    <circle cx=\"188.1\" cy=\"159.15333333333334\" r=\"3.6\" />\n    <circle cx=\"179.76\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"179.77999999999997\" cy=\"154.32\" r=\"3.6\" />\n    <circle cx=\"296.11333333333334\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"320.93\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"320.97499999999997\" cy=\"304.18833333333333\" r=\"3.6\" />\n    <circle cx=\"321.00666666666666\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"337.595\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"329.3\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"329.27000000000004\" cy=\"279.9916666666667\" r=\"3.6\" />\n    <circle cx=\"320.965\" cy=\"294.5133333333333\" r=\"3.6\" />\n    <circle cx=\"320.94\" cy=\"110.81\" r=\"3.6\" />\n    <circle cx=\"320.965\" cy=\"284.8433333333333\" r=\"3.6\" />\n    <circle cx=\"312.66666666666663\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"163.14\" cy=\"105.99\" r=\"3.6\" />\n    <circle cx=\"321.00666666666666\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"304.4083333333333\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"337.605\" cy=\"342.84499999999997\" r=\"3.6\" />\n    <circle cx=\"329.3\" cy=\"338.01666666666665\" r=\"3.6\" />\n    <circle cx=\"329.31\" cy=\"347.68333333333334\" r=\"3.6\" />\n    <circle cx=\"321.0133333333334\" cy=\"342.8633333333333\" r=\"3.6\" />\n    <circle cx=\"321.0233333333333\" cy=\"352.52666666666664\" r=\"3.6\" />\n    <circle cx=\"320.99666666666667\" cy=\"313.84666666666664\" r=\"3.6\" />\n    <circle cx=\"312.645\" cy=\"309.02500000000003\" r=\"3.6\" />\n    <circle cx=\"312.66666666666663\" cy=\"318.69\" r=\"3.6\" />\n    <circle cx=\"304.3983333333333\" cy=\"313.8583333333333\" r=\"3.6\" />\n    <circle cx=\"296.0733333333333\" cy=\"299.3383333333333\" r=\"3.6\" />\n    <circle cx=\"304.37833333333333\" cy=\"304.17833333333334\" r=\"3.6\" />\n    <circle cx=\"312.625\" cy=\"299.3533333333333\" r=\"3.6\" />\n    <circle cx=\"312.625\" cy=\"280.0133333333334\" r=\"3.6\" />\n    <circle cx=\"320.9833333333333\" cy=\"275.18333333333334\" r=\"3.6\" />\n    <circle cx=\"312.625\" cy=\"289.68333333333334\" r=\"3.6\" />\n    <circle cx=\"287.85\" cy=\"255.8016666666667\" r=\"3.6\" />\n    <circle cx=\"254.55333333333337\" cy=\"188.165\" r=\"3.6\" />\n    <circle cx=\"246.21833333333333\" cy=\"183.34333333333336\" r=\"3.6\" />\n    <circle cx=\"254.56499999999997\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"237.905\" cy=\"178.49833333333333\" r=\"3.6\" />\n    <circle cx=\"320.9266666666667\" cy=\"120.47166666666668\" r=\"3.6\" />\n    <circle cx=\"296.07166666666666\" cy=\"289.66833333333335\" r=\"3.6\" />\n    <circle cx=\"296.07166666666666\" cy=\"279.99833333333333\" r=\"3.6\" />\n    <circle cx=\"296.10166666666663\" cy=\"270.33333333333337\" r=\"3.6\" />\n    <circle cx=\"254.50333333333333\" cy=\"81.81\" r=\"3.6\" />\n    <circle cx=\"237.885\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"212.955\" cy=\"96.32333333333332\" r=\"3.6\" />\n    <circle cx=\"229.58833333333334\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"204.67999999999998\" cy=\"91.48333333333333\" r=\"3.6\" />\n    <circle cx=\"221.29333333333332\" cy=\"91.48333333333333\" r=\"3.6\" />\n    <circle cx=\"312.58500000000004\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"196.38666666666668\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"179.76999999999998\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"188.06999999999996\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"171.48000000000002\" cy=\"91.48333333333333\" r=\"3.6\" />\n    <circle cx=\"312.58000000000004\" cy=\"86.63\" r=\"3.6\" />\n    <circle cx=\"312.59000000000003\" cy=\"96.30666666666666\" r=\"3.6\" />\n    <circle cx=\"312.59000000000003\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"312.54\" cy=\"76.97166666666666\" r=\"3.6\" />\n    <circle cx=\"320.875\" cy=\"72.11666666666667\" r=\"3.6\" />\n    <circle cx=\"163.14\" cy=\"96.32333333333332\" r=\"3.6\" />\n    <circle cx=\"262.835\" cy=\"86.61833333333333\" r=\"3.6\" />\n    <circle cx=\"246.21666666666667\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"171.47833333333335\" cy=\"149.50666666666666\" r=\"3.6\" />\n    <circle cx=\"329.3\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"337.595\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"329.28000000000003\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"345.91333333333324\" cy=\"338.0166666666667\" r=\"3.6\" />\n    <circle cx=\"345.91333333333324\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"337.615\" cy=\"284.8333333333333\" r=\"3.6\" />\n    <circle cx=\"329.22166666666664\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"329.23\" cy=\"105.96333333333332\" r=\"3.6\" />\n    <circle cx=\"329.26\" cy=\"289.66833333333335\" r=\"3.6\" />\n    <circle cx=\"329.26\" cy=\"299.3383333333333\" r=\"3.6\" />\n    <circle cx=\"312.67833333333334\" cy=\"347.695\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"357.3666666666666\" r=\"3.6\" />\n    <circle cx=\"321.02833333333336\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"312.66666666666663\" cy=\"338.02666666666664\" r=\"3.6\" />\n    <circle cx=\"329.32\" cy=\"357.34999999999997\" r=\"3.6\" />\n    <circle cx=\"329.32\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"337.6166666666667\" cy=\"352.5133333333333\" r=\"3.6\" />\n    <circle cx=\"320.93\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"337.52\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"212.93500000000003\" cy=\"76.985\" r=\"3.6\" />\n    <circle cx=\"229.56666666666663\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"221.26\" cy=\"72.15\" r=\"3.6\" />\n    <circle cx=\"196.365\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"204.64666666666665\" cy=\"72.13833333333334\" r=\"3.6\" />\n    <circle cx=\"171.4483333333333\" cy=\"72.15\" r=\"3.6\" />\n    <circle cx=\"163.12\" cy=\"76.985\" r=\"3.6\" />\n    <circle cx=\"179.75\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"188.04833333333332\" cy=\"72.135\" r=\"3.6\" />\n    <circle cx=\"345.845\" cy=\"76.93666666666668\" r=\"3.6\" />\n    <circle cx=\"329.22166666666664\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"337.5\" cy=\"62.468333333333334\" r=\"3.6\" />\n    <circle cx=\"329.16499999999996\" cy=\"57.613333333333344\" r=\"3.6\" />\n    <circle cx=\"304.4083333333333\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"67.31333333333332\" r=\"3.6\" />\n    <circle cx=\"237.865\" cy=\"72.135\" r=\"3.6\" />\n    <circle cx=\"246.17666666666665\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"254.47000000000003\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"345.92333333333335\" cy=\"347.6816666666667\" r=\"3.6\" />\n    <circle cx=\"188.06999999999996\" cy=\"81.80333333333333\" r=\"3.6\" />\n    <circle cx=\"196.38666666666668\" cy=\"86.63833333333332\" r=\"3.6\" />\n    <circle cx=\"154.815\" cy=\"81.82166666666667\" r=\"3.6\" />\n    <circle cx=\"179.76999999999998\" cy=\"86.63833333333332\" r=\"3.6\" />\n    <circle cx=\"212.955\" cy=\"86.65333333333335\" r=\"3.6\" />\n    <circle cx=\"154.85166666666666\" cy=\"101.17\" r=\"3.6\" />\n    <circle cx=\"154.81833333333333\" cy=\"120.49333333333334\" r=\"3.6\" />\n    <circle cx=\"171.47000000000003\" cy=\"81.80666666666667\" r=\"3.6\" />\n    <circle cx=\"163.14\" cy=\"86.65333333333335\" r=\"3.6\" />\n    <circle cx=\"320.91999999999996\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"329.21999999999997\" cy=\"76.94500000000001\" r=\"3.6\" />\n    <circle cx=\"296.11333333333334\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"221.28166666666667\" cy=\"81.80666666666667\" r=\"3.6\" />\n    <circle cx=\"163.13\" cy=\"125.32666666666667\" r=\"3.6\" />\n    <circle cx=\"254.48166666666665\" cy=\"72.12833333333333\" r=\"3.6\" />\n    <circle cx=\"246.1966666666667\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"229.58833333333334\" cy=\"86.63833333333332\" r=\"3.6\" />\n    <circle cx=\"237.885\" cy=\"81.80333333333333\" r=\"3.6\" />\n    <circle cx=\"262.835\" cy=\"76.96\" r=\"3.6\" />\n    <circle cx=\"271.215\" cy=\"255.8216666666667\" r=\"3.6\" />\n    <circle cx=\"271.195\" cy=\"275.185\" r=\"3.6\" />\n    <circle cx=\"271.22499999999997\" cy=\"265.5033333333334\" r=\"3.6\" />\n    <circle cx=\"171.46833333333333\" cy=\"130.16166666666666\" r=\"3.6\" />\n    <circle cx=\"279.4733333333333\" cy=\"279.99833333333333\" r=\"3.6\" />\n    <circle cx=\"279.4733333333333\" cy=\"299.33833333333337\" r=\"3.6\" />\n    <circle cx=\"287.815\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"287.815\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"279.49499999999995\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"279.4733333333333\" cy=\"289.66833333333335\" r=\"3.6\" />\n    <circle cx=\"179.80166666666665\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"229.61833333333334\" cy=\"173.6583333333333\" r=\"3.6\" />\n    <circle cx=\"171.5\" cy=\"159.16\" r=\"3.6\" />\n    <circle cx=\"171.46833333333333\" cy=\"139.83166666666668\" r=\"3.6\" />\n    <circle cx=\"196.41666666666666\" cy=\"173.6583333333333\" r=\"3.6\" />\n    <circle cx=\"196.41666666666666\" cy=\"183.32833333333335\" r=\"3.6\" />\n    <circle cx=\"196.4433333333333\" cy=\"193.00666666666666\" r=\"3.6\" />\n    <circle cx=\"188.1\" cy=\"168.82333333333332\" r=\"3.6\" />\n    <circle cx=\"204.66833333333332\" cy=\"81.81833333333334\" r=\"3.6\" />\n    <circle cx=\"221.28333333333333\" cy=\"130.16166666666666\" r=\"3.6\" />\n    <circle cx=\"229.57500000000002\" cy=\"134.98666666666665\" r=\"3.6\" />\n    <circle cx=\"254.50666666666666\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"246.20666666666668\" cy=\"125.31333333333335\" r=\"3.6\" />\n    <circle cx=\"237.875\" cy=\"130.14666666666668\" r=\"3.6\" />\n    <circle cx=\"229.57499999999996\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"237.89499999999998\" cy=\"149.48499999999999\" r=\"3.6\" />\n    <circle cx=\"212.94500000000002\" cy=\"134.99666666666667\" r=\"3.6\" />\n    <circle cx=\"221.28333333333333\" cy=\"139.83166666666668\" r=\"3.6\" />\n    <circle cx=\"254.50333333333333\" cy=\"139.81666666666666\" r=\"3.6\" />\n    <circle cx=\"271.135\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"254.50333333333333\" cy=\"130.14666666666668\" r=\"3.6\" />\n    <circle cx=\"246.20666666666668\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"279.43\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"125.31333333333335\" r=\"3.6\" />\n    <circle cx=\"246.22833333333332\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"246.20666666666668\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"237.875\" cy=\"139.81666666666663\" r=\"3.6\" />\n    <circle cx=\"237.875\" cy=\"120.47666666666667\" r=\"3.6\" />\n    <circle cx=\"246.21\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"262.8\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"229.57500000000002\" cy=\"125.31666666666668\" r=\"3.6\" />\n    <circle cx=\"254.51166666666668\" cy=\"110.80833333333334\" r=\"3.6\" />\n    <circle cx=\"204.67166666666665\" cy=\"120.49166666666666\" r=\"3.6\" />\n    <circle cx=\"204.67\" cy=\"130.16166666666666\" r=\"3.6\" />\n    <circle cx=\"221.28666666666666\" cy=\"120.49333333333333\" r=\"3.6\" />\n    <circle cx=\"212.94500000000002\" cy=\"125.32666666666667\" r=\"3.6\" />\n    <circle cx=\"287.72499999999997\" cy=\"130.13\" r=\"3.6\" />\n    <circle cx=\"287.755\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"271.135\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"279.44\" cy=\"144.64333333333335\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"279.43\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"296.0516666666667\" cy=\"134.98\" r=\"3.6\" />\n    <circle cx=\"271.1383333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"254.51333333333332\" cy=\"149.47833333333332\" r=\"3.6\" />\n    <circle cx=\"121.65333333333332\" cy=\"62.47666666666666\" r=\"3.6\" />\n    <circle cx=\"246.13500000000002\" cy=\"28.60166666666667\" r=\"3.6\" />\n    <circle cx=\"204.63\" cy=\"43.126666666666665\" r=\"3.6\" />\n    <circle cx=\"171.41333333333333\" cy=\"43.12166666666667\" r=\"3.6\" />\n    <circle cx=\"188.04666666666665\" cy=\"43.10166666666667\" r=\"3.6\" />\n    <circle cx=\"129.945\" cy=\"57.633333333333326\" r=\"3.6\" />\n    <circle cx=\"370.76500000000004\" cy=\"304.1683333333333\" r=\"3.6\" />\n    <circle cx=\"154.91\" cy=\"178.50333333333333\" r=\"3.6\" />\n    <circle cx=\"295.99499999999995\" cy=\"28.588333333333335\" r=\"3.6\" />\n    <circle cx=\"312.53999999999996\" cy=\"18.93666666666667\" r=\"3.6\" />\n    <circle cx=\"221.225\" cy=\"43.12166666666667\" r=\"3.6\" />\n    <circle cx=\"105.07333333333334\" cy=\"81.82166666666667\" r=\"3.6\" />\n    <circle cx=\"121.63166666666666\" cy=\"72.16833333333334\" r=\"3.6\" />\n    <circle cx=\"146.54333333333332\" cy=\"38.263333333333335\" r=\"3.6\" />\n    <circle cx=\"321.08\" cy=\"497.58500000000004\" r=\"3.6\" />\n    <circle cx=\"154.92166666666665\" cy=\"197.86\" r=\"3.6\" />\n    <circle cx=\"105.01333333333334\" cy=\"52.80833333333333\" r=\"3.6\" />\n    <circle cx=\"80.14833333333333\" cy=\"86.63833333333334\" r=\"3.6\" />\n    <circle cx=\"71.80166666666666\" cy=\"91.49000000000001\" r=\"3.6\" />\n    <circle cx=\"312.725\" cy=\"425.0466666666667\" r=\"3.6\" />\n    <circle cx=\"154.85666666666665\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"204.67\" cy=\"139.83166666666668\" r=\"3.6\" />\n    <circle cx=\"287.805\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"154.82666666666665\" cy=\"110.82333333333332\" r=\"3.6\" />\n    <circle cx=\"304.3066666666667\" cy=\"91.45666666666666\" r=\"3.6\" />\n    <circle cx=\"304.375\" cy=\"275.1716666666667\" r=\"3.6\" />\n    <circle cx=\"304.365\" cy=\"284.8433333333333\" r=\"3.6\" />\n    <circle cx=\"196.38\" cy=\"115.64666666666666\" r=\"3.6\" />\n    <circle cx=\"304.3666666666667\" cy=\"294.5133333333334\" r=\"3.6\" />\n    <circle cx=\"221.335\" cy=\"178.51\" r=\"3.6\" />\n    <circle cx=\"154.83833333333334\" cy=\"62.47666666666667\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"197.84333333333333\" r=\"3.6\" />\n    <circle cx=\"321.02833333333336\" cy=\"371.8633333333333\" r=\"3.6\" />\n    <circle cx=\"146.545\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"320.84166666666664\" cy=\"33.43833333333333\" r=\"3.6\" />\n    <circle cx=\"312.72\" cy=\"434.7166666666667\" r=\"3.6\" />\n    <circle cx=\"321.03833333333336\" cy=\"381.53999999999996\" r=\"3.6\" />\n    <circle cx=\"188.06499999999997\" cy=\"110.80666666666667\" r=\"3.6\" />\n    <circle cx=\"204.67666666666665\" cy=\"110.82333333333334\" r=\"3.6\" />\n    <circle cx=\"237.885\" cy=\"101.13999999999999\" r=\"3.6\" />\n    <circle cx=\"279.45\" cy=\"105.95166666666667\" r=\"3.6\" />\n    <circle cx=\"287.72999999999996\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"296.0066666666667\" cy=\"105.94\" r=\"3.6\" />\n    <circle cx=\"295.97499999999997\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"246.21666666666667\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"254.51333333333332\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"262.805\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"271.15\" cy=\"91.46833333333335\" r=\"3.6\" />\n    <circle cx=\"279.46\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"320.9\" cy=\"130.165\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"270.325\" r=\"3.6\" />\n    <circle cx=\"329.22999999999996\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"304.4166666666667\" cy=\"265.5133333333333\" r=\"3.6\" />\n    <circle cx=\"304.33000000000004\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"304.3283333333334\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"304.32166666666666\" cy=\"120.47166666666665\" r=\"3.6\" />\n    <circle cx=\"312.58000000000004\" cy=\"125.31333333333335\" r=\"3.6\" />\n    <circle cx=\"221.29333333333332\" cy=\"101.15333333333332\" r=\"3.6\" />\n    <circle cx=\"188.06000000000003\" cy=\"130.14666666666668\" r=\"3.6\" />\n    <circle cx=\"229.58833333333334\" cy=\"105.97666666666667\" r=\"3.6\" />\n    <circle cx=\"188.06000000000003\" cy=\"139.8166666666667\" r=\"3.6\" />\n    <circle cx=\"188.06000000000003\" cy=\"120.47666666666665\" r=\"3.6\" />\n    <circle cx=\"212.98499999999999\" cy=\"173.67333333333332\" r=\"3.6\" />\n    <circle cx=\"212.98499999999999\" cy=\"164.00333333333333\" r=\"3.6\" />\n    <circle cx=\"196.39666666666665\" cy=\"154.31833333333333\" r=\"3.6\" />\n    <circle cx=\"179.765\" cy=\"115.64666666666666\" r=\"3.6\" />\n    <circle cx=\"204.69999999999996\" cy=\"159.17333333333335\" r=\"3.6\" />\n    <circle cx=\"188.08\" cy=\"149.48499999999999\" r=\"3.6\" />\n    <circle cx=\"204.67999999999998\" cy=\"101.15333333333335\" r=\"3.6\" />\n    <circle cx=\"196.38666666666668\" cy=\"105.97666666666667\" r=\"3.6\" />\n    <circle cx=\"212.955\" cy=\"105.99\" r=\"3.6\" />\n    <circle cx=\"296.13\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"171.4766666666667\" cy=\"110.82000000000001\" r=\"3.6\" />\n    <circle cx=\"171.48000000000002\" cy=\"101.15333333333332\" r=\"3.6\" />\n    <circle cx=\"179.76999999999998\" cy=\"105.97666666666667\" r=\"3.6\" />\n    <circle cx=\"188.06999999999996\" cy=\"101.13999999999999\" r=\"3.6\" />\n    <circle cx=\"296.02833333333336\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"287.72499999999997\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"279.43499999999995\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"296.035\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"304.33\" cy=\"130.1483333333333\" r=\"3.6\" />\n    <circle cx=\"212.94499999999996\" cy=\"144.66666666666666\" r=\"3.6\" />\n    <circle cx=\"254.51333333333332\" cy=\"101.13999999999999\" r=\"3.6\" />\n    <circle cx=\"271.14166666666665\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"262.805\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"271.145\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"229.59666666666666\" cy=\"154.31833333333333\" r=\"3.6\" />\n    <circle cx=\"246.21666666666667\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"237.915\" cy=\"159.15333333333334\" r=\"3.6\" />\n    <circle cx=\"246.25\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"221.29333333333332\" cy=\"149.50666666666666\" r=\"3.6\" />\n    <circle cx=\"254.5333333333334\" cy=\"159.16\" r=\"3.6\" />\n    <circle cx=\"271.145\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"262.81500000000005\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"304.41833333333335\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"254.5533333333333\" cy=\"168.83\" r=\"3.6\" />\n    <circle cx=\"221.32500000000002\" cy=\"168.83333333333334\" r=\"3.6\" />\n    <circle cx=\"212.965\" cy=\"154.33499999999998\" r=\"3.6\" />\n    <circle cx=\"229.61833333333334\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"221.31500000000003\" cy=\"159.16\" r=\"3.6\" />\n    <circle cx=\"237.915\" cy=\"168.82333333333332\" r=\"3.6\" />\n    <circle cx=\"262.8666666666667\" cy=\"164.00333333333333\" r=\"3.6\" />\n    <circle cx=\"271.18\" cy=\"159.14833333333334\" r=\"3.6\" />\n    <circle cx=\"237.88\" cy=\"110.80666666666667\" r=\"3.6\" />\n    <circle cx=\"254.56333333333336\" cy=\"178.49333333333334\" r=\"3.6\" />\n    <circle cx=\"246.25\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"221.29166666666666\" cy=\"110.82\" r=\"3.6\" />\n    <circle cx=\"213.01500000000001\" cy=\"183.36166666666665\" r=\"3.6\" />\n    <circle cx=\"212.95000000000002\" cy=\"115.65666666666668\" r=\"3.6\" />\n    <circle cx=\"229.58166666666668\" cy=\"115.64666666666669\" r=\"3.6\" />\n    <circle cx=\"196.37666666666667\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"196.37666666666667\" cy=\"125.31666666666668\" r=\"3.6\" />\n    <circle cx=\"204.67999999999998\" cy=\"149.49499999999998\" r=\"3.6\" />\n    <circle cx=\"196.37666666666667\" cy=\"134.98666666666665\" r=\"3.6\" />\n    <circle cx=\"154.81000000000003\" cy=\"72.16000000000001\" r=\"3.6\" />\n    <circle cx=\"296.1566666666667\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"287.82500000000005\" cy=\"362.19000000000005\" r=\"3.6\" />\n    <circle cx=\"296.135\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"287.81500000000005\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"287.855\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"304.46999999999997\" cy=\"458.87833333333333\" r=\"3.6\" />\n    <circle cx=\"304.46000000000004\" cy=\"449.21666666666664\" r=\"3.6\" />\n    <circle cx=\"296.16833333333335\" cy=\"434.70666666666665\" r=\"3.6\" />\n    <circle cx=\"287.845\" cy=\"429.8666666666666\" r=\"3.6\" />\n    <circle cx=\"254.55666666666664\" cy=\"304.18\" r=\"3.6\" />\n    <circle cx=\"262.885\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"287.83500000000004\" cy=\"352.5133333333333\" r=\"3.6\" />\n    <circle cx=\"254.5816666666667\" cy=\"323.53000000000003\" r=\"3.6\" />\n    <circle cx=\"246.225\" cy=\"309.03000000000003\" r=\"3.6\" />\n    <circle cx=\"254.57833333333338\" cy=\"313.8616666666667\" r=\"3.6\" />\n    <circle cx=\"279.52500000000003\" cy=\"347.68333333333334\" r=\"3.6\" />\n    <circle cx=\"271.22499999999997\" cy=\"342.8633333333333\" r=\"3.6\" />\n    <circle cx=\"262.875\" cy=\"338.0316666666667\" r=\"3.6\" />\n    <circle cx=\"296.13666666666666\" cy=\"444.39166666666665\" r=\"3.6\" />\n    <circle cx=\"354.24666666666667\" cy=\"381.53333333333336\" r=\"3.6\" />\n    <circle cx=\"362.50500000000005\" cy=\"367.0333333333333\" r=\"3.6\" />\n    <circle cx=\"354.2266666666667\" cy=\"371.8633333333333\" r=\"3.6\" />\n    <circle cx=\"345.9549999999999\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"379.115\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"379.125\" cy=\"338.02333333333337\" r=\"3.6\" />\n    <circle cx=\"370.82500000000005\" cy=\"342.8633333333333\" r=\"3.6\" />\n    <circle cx=\"370.83500000000004\" cy=\"352.52666666666664\" r=\"3.6\" />\n    <circle cx=\"370.84\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"337.69\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"337.65999999999997\" cy=\"400.86000000000007\" r=\"3.6\" />\n    <circle cx=\"329.36999999999995\" cy=\"434.70666666666665\" r=\"3.6\" />\n    <circle cx=\"304.47166666666664\" cy=\"478.23999999999995\" r=\"3.6\" />\n    <circle cx=\"304.49\" cy=\"468.55833333333334\" r=\"3.6\" />\n    <circle cx=\"312.8233333333333\" cy=\"483.06333333333333\" r=\"3.6\" />\n    <circle cx=\"329.36499999999995\" cy=\"425.0433333333333\" r=\"3.6\" />\n    <circle cx=\"296.13666666666666\" cy=\"463.715\" r=\"3.6\" />\n    <circle cx=\"329.36\" cy=\"415.36666666666673\" r=\"3.6\" />\n    <circle cx=\"345.9766666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"188.025\" cy=\"52.79666666666666\" r=\"3.6\" />\n    <circle cx=\"179.73\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"138.245\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"196.34333333333333\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"171.4383333333333\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"138.245\" cy=\"52.79666666666666\" r=\"3.6\" />\n    <circle cx=\"146.545\" cy=\"47.96666666666667\" r=\"3.6\" />\n    <circle cx=\"163.10000000000002\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"154.83833333333334\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"204.63666666666666\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"262.76500000000004\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"254.465\" cy=\"43.12833333333334\" r=\"3.6\" />\n    <circle cx=\"246.13666666666666\" cy=\"38.31166666666667\" r=\"3.6\" />\n    <circle cx=\"212.915\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"271.105\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"237.84333333333333\" cy=\"52.796666666666674\" r=\"3.6\" />\n    <circle cx=\"221.25\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"229.545\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"207.51166666666666\" r=\"3.6\" />\n    <circle cx=\"196.45833333333334\" cy=\"221.99499999999998\" r=\"3.6\" />\n    <circle cx=\"204.75\" cy=\"226.84\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"217.16666666666666\" r=\"3.6\" />\n    <circle cx=\"179.82166666666663\" cy=\"212.33666666666667\" r=\"3.6\" />\n    <circle cx=\"254.53833333333333\" cy=\"294.5116666666667\" r=\"3.6\" />\n    <circle cx=\"229.69000000000003\" cy=\"241.34500000000003\" r=\"3.6\" />\n    <circle cx=\"246.29000000000005\" cy=\"260.68833333333333\" r=\"3.6\" />\n    <circle cx=\"213.025\" cy=\"231.68500000000003\" r=\"3.6\" />\n    <circle cx=\"146.545\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"221.38\" cy=\"236.51166666666668\" r=\"3.6\" />\n    <circle cx=\"171.48499999999999\" cy=\"188.1933333333333\" r=\"3.6\" />\n    <circle cx=\"146.59833333333333\" cy=\"154.31833333333333\" r=\"3.6\" />\n    <circle cx=\"138.295\" cy=\"159.15333333333334\" r=\"3.6\" />\n    <circle cx=\"138.255\" cy=\"139.81666666666666\" r=\"3.6\" />\n    <circle cx=\"146.57833333333335\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"146.61833333333334\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"163.16\" cy=\"183.35\" r=\"3.6\" />\n    <circle cx=\"146.58666666666667\" cy=\"173.67499999999998\" r=\"3.6\" />\n    <circle cx=\"179.8166666666667\" cy=\"222.01\" r=\"3.6\" />\n    <circle cx=\"229.68500000000003\" cy=\"251.005\" r=\"3.6\" />\n    <circle cx=\"246.19333333333336\" cy=\"299.3533333333333\" r=\"3.6\" />\n    <circle cx=\"213.035\" cy=\"241.36166666666668\" r=\"3.6\" />\n    <circle cx=\"221.35500000000002\" cy=\"246.205\" r=\"3.6\" />\n    <circle cx=\"237.995\" cy=\"255.83333333333337\" r=\"3.6\" />\n    <circle cx=\"262.87\" cy=\"347.6983333333333\" r=\"3.6\" />\n    <circle cx=\"271.205\" cy=\"352.545\" r=\"3.6\" />\n    <circle cx=\"254.57333333333335\" cy=\"333.1933333333333\" r=\"3.6\" />\n    <circle cx=\"246.23499999999999\" cy=\"318.69\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"217.18166666666664\" r=\"3.6\" />\n    <circle cx=\"146.57833333333332\" cy=\"183.34166666666667\" r=\"3.6\" />\n    <circle cx=\"146.60666666666665\" cy=\"192.98\" r=\"3.6\" />\n    <circle cx=\"138.29500000000002\" cy=\"168.82333333333332\" r=\"3.6\" />\n    <circle cx=\"279.53\" cy=\"357.35166666666663\" r=\"3.6\" />\n    <circle cx=\"204.74\" cy=\"236.53999999999996\" r=\"3.6\" />\n    <circle cx=\"196.42666666666665\" cy=\"231.69000000000003\" r=\"3.6\" />\n    <circle cx=\"279.4083333333333\" cy=\"57.623333333333335\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"226.84666666666666\" r=\"3.6\" />\n    <circle cx=\"379.155\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"370.84999999999997\" cy=\"371.86999999999995\" r=\"3.6\" />\n    <circle cx=\"138.26500000000001\" cy=\"149.49\" r=\"3.6\" />\n    <circle cx=\"362.535\" cy=\"376.72166666666664\" r=\"3.6\" />\n    <circle cx=\"354.28999999999996\" cy=\"391.2033333333333\" r=\"3.6\" />\n    <circle cx=\"354.29\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"379.15500000000003\" cy=\"357.3500000000001\" r=\"3.6\" />\n    <circle cx=\"387.47333333333336\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"387.47333333333336\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"379.15000000000003\" cy=\"347.68\" r=\"3.6\" />\n    <circle cx=\"329.40000000000003\" cy=\"492.71166666666664\" r=\"3.6\" />\n    <circle cx=\"304.44666666666666\" cy=\"487.8966666666667\" r=\"3.6\" />\n    <circle cx=\"296.14666666666665\" cy=\"473.37833333333333\" r=\"3.6\" />\n    <circle cx=\"296.105\" cy=\"454.03833333333336\" r=\"3.6\" />\n    <circle cx=\"287.845\" cy=\"439.5366666666667\" r=\"3.6\" />\n    <circle cx=\"287.82500000000005\" cy=\"381.53000000000003\" r=\"3.6\" />\n    <circle cx=\"312.78166666666664\" cy=\"492.7183333333333\" r=\"3.6\" />\n    <circle cx=\"337.7183333333333\" cy=\"420.19833333333327\" r=\"3.6\" />\n    <circle cx=\"345.9933333333334\" cy=\"405.70666666666665\" r=\"3.6\" />\n    <circle cx=\"105.01833333333333\" cy=\"62.471666666666664\" r=\"3.6\" />\n    <circle cx=\"296.01000000000005\" cy=\"38.29\" r=\"3.6\" />\n    <circle cx=\"312.51500000000004\" cy=\"38.29666666666667\" r=\"3.6\" />\n    <circle cx=\"320.8433333333333\" cy=\"23.796666666666667\" r=\"3.6\" />\n    <circle cx=\"287.65999999999997\" cy=\"33.446666666666665\" r=\"3.6\" />\n    <circle cx=\"271.105\" cy=\"43.116666666666674\" r=\"3.6\" />\n    <circle cx=\"262.785\" cy=\"38.275\" r=\"3.6\" />\n    <circle cx=\"254.465\" cy=\"33.446666666666665\" r=\"3.6\" />\n    <circle cx=\"138.265\" cy=\"72.15833333333335\" r=\"3.6\" />\n    <circle cx=\"237.80833333333337\" cy=\"33.46\" r=\"3.6\" />\n    <circle cx=\"329.17\" cy=\"28.60166666666667\" r=\"3.6\" />\n    <circle cx=\"354.18666666666667\" cy=\"304.1716666666666\" r=\"3.6\" />\n    <circle cx=\"362.46166666666664\" cy=\"309.02500000000003\" r=\"3.6\" />\n    <circle cx=\"337.4983333333334\" cy=\"33.425000000000004\" r=\"3.6\" />\n    <circle cx=\"387.47333333333336\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"379.1133333333333\" cy=\"308.99666666666667\" r=\"3.6\" />\n    <circle cx=\"345.81333333333333\" cy=\"38.26333333333333\" r=\"3.6\" />\n    <circle cx=\"354.10666666666674\" cy=\"43.123333333333335\" r=\"3.6\" />\n    <circle cx=\"354.15000000000003\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"279.4083333333333\" cy=\"47.94166666666666\" r=\"3.6\" />\n    <circle cx=\"96.70166666666667\" cy=\"67.27999999999999\" r=\"3.6\" />\n    <circle cx=\"88.395\" cy=\"72.14\" r=\"3.6\" />\n    <circle cx=\"379.1133333333334\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"88.46499999999999\" cy=\"81.81666666666666\" r=\"3.6\" />\n    <circle cx=\"113.31500000000001\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"129.945\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"113.31500000000001\" cy=\"67.31333333333333\" r=\"3.6\" />\n    <circle cx=\"105.04833333333333\" cy=\"72.14333333333333\" r=\"3.6\" />\n    <circle cx=\"96.75333333333333\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"196.34333333333333\" cy=\"47.96666666666667\" r=\"3.6\" />\n    <circle cx=\"179.73\" cy=\"47.96666666666667\" r=\"3.6\" />\n    <circle cx=\"163.10000000000002\" cy=\"47.97666666666667\" r=\"3.6\" />\n    <circle cx=\"229.55499999999998\" cy=\"47.961666666666666\" r=\"3.6\" />\n    <circle cx=\"121.62166666666666\" cy=\"52.79500000000001\" r=\"3.6\" />\n    <circle cx=\"212.915\" cy=\"47.97666666666667\" r=\"3.6\" />\n    <circle cx=\"129.935\" cy=\"47.96000000000001\" r=\"3.6\" />\n    <circle cx=\"138.235\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"154.84833333333333\" cy=\"43.13666666666666\" r=\"3.6\" />\n    <circle cx=\"370.82\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"345.91333333333336\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"337.595\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"354.2066666666667\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"362.48499999999996\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"337.58500000000004\" cy=\"294.4866666666667\" r=\"3.6\" />\n    <circle cx=\"337.52\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"345.7833333333333\" cy=\"115.63666666666666\" r=\"3.6\" />\n    <circle cx=\"321.07\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"337.52\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"337.575\" cy=\"304.175\" r=\"3.6\" />\n    <circle cx=\"337.6166666666667\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"329.32\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"329.34000000000003\" cy=\"386.3583333333333\" r=\"3.6\" />\n    <circle cx=\"321.06\" cy=\"391.19666666666666\" r=\"3.6\" />\n    <circle cx=\"354.22166666666664\" cy=\"352.53333333333336\" r=\"3.6\" />\n    <circle cx=\"354.21166666666664\" cy=\"342.85833333333335\" r=\"3.6\" />\n    <circle cx=\"345.935\" cy=\"357.34999999999997\" r=\"3.6\" />\n    <circle cx=\"337.6166666666667\" cy=\"362.18333333333334\" r=\"3.6\" />\n    <circle cx=\"354.20666666666665\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"229.545\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"221.25\" cy=\"62.47666666666666\" r=\"3.6\" />\n    <circle cx=\"212.915\" cy=\"67.31333333333335\" r=\"3.6\" />\n    <circle cx=\"237.84333333333336\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"246.17666666666665\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"204.63666666666666\" cy=\"62.47666666666667\" r=\"3.6\" />\n    <circle cx=\"179.73\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"188.025\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"196.34333333333333\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"345.875\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"246.14666666666665\" cy=\"47.94666666666668\" r=\"3.6\" />\n    <circle cx=\"337.47\" cy=\"52.771666666666675\" r=\"3.6\" />\n    <circle cx=\"295.96666666666664\" cy=\"57.63499999999999\" r=\"3.6\" />\n    <circle cx=\"345.81333333333333\" cy=\"57.626666666666665\" r=\"3.6\" />\n    <circle cx=\"304.28000000000003\" cy=\"62.47833333333333\" r=\"3.6\" />\n    <circle cx=\"171.4383333333333\" cy=\"62.47666666666666\" r=\"3.6\" />\n    <circle cx=\"271.115\" cy=\"62.46666666666667\" r=\"3.6\" />\n    <circle cx=\"262.76500000000004\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"254.47000000000003\" cy=\"52.79666666666666\" r=\"3.6\" />\n    <circle cx=\"262.89\" cy=\"260.66999999999996\" r=\"3.6\" />\n    <circle cx=\"221.29666666666665\" cy=\"217.18333333333337\" r=\"3.6\" />\n    <circle cx=\"196.47500000000002\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"271.17999999999995\" cy=\"284.84333333333336\" r=\"3.6\" />\n    <circle cx=\"271.18\" cy=\"294.5133333333334\" r=\"3.6\" />\n    <circle cx=\"262.87666666666667\" cy=\"270.3433333333333\" r=\"3.6\" />\n    <circle cx=\"188.11\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"262.83500000000004\" cy=\"280.0083333333334\" r=\"3.6\" />\n    <circle cx=\"188.1\" cy=\"178.49333333333334\" r=\"3.6\" />\n    <circle cx=\"163.15\" cy=\"154.335\" r=\"3.6\" />\n    <circle cx=\"271.19\" cy=\"304.19\" r=\"3.6\" />\n    <circle cx=\"163.13\" cy=\"134.99666666666667\" r=\"3.6\" />\n    <circle cx=\"154.84666666666666\" cy=\"130.14666666666665\" r=\"3.6\" />\n    <circle cx=\"163.13\" cy=\"144.66666666666666\" r=\"3.6\" />\n    <circle cx=\"179.80166666666665\" cy=\"173.6583333333333\" r=\"3.6\" />\n    <circle cx=\"163.17\" cy=\"164.00333333333333\" r=\"3.6\" />\n    <circle cx=\"171.51\" cy=\"168.83333333333334\" r=\"3.6\" />\n    <circle cx=\"287.815\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"312.73\" cy=\"396.04333333333335\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"376.7033333333333\" r=\"3.6\" />\n    <circle cx=\"312.71\" cy=\"386.375\" r=\"3.6\" />\n    <circle cx=\"304.46999999999997\" cy=\"410.5433333333333\" r=\"3.6\" />\n    <circle cx=\"304.47\" cy=\"400.8733333333334\" r=\"3.6\" />\n    <circle cx=\"312.73\" cy=\"415.38000000000005\" r=\"3.6\" />\n    <circle cx=\"296.17833333333334\" cy=\"405.69666666666666\" r=\"3.6\" />\n    <circle cx=\"304.4683333333333\" cy=\"420.21333333333337\" r=\"3.6\" />\n    <circle cx=\"296.17833333333334\" cy=\"415.36666666666673\" r=\"3.6\" />\n    <circle cx=\"279.51500000000004\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"296.11333333333334\" cy=\"338.01666666666665\" r=\"3.6\" />\n    <circle cx=\"312.73\" cy=\"405.7133333333333\" r=\"3.6\" />\n    <circle cx=\"271.21\" cy=\"313.84666666666664\" r=\"3.6\" />\n    <circle cx=\"279.51499999999993\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"304.42333333333335\" cy=\"352.5333333333333\" r=\"3.6\" />\n    <circle cx=\"304.4133333333333\" cy=\"342.8583333333333\" r=\"3.6\" />\n    <circle cx=\"304.42833333333334\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"367.0333333333333\" r=\"3.6\" />\n    <circle cx=\"304.43833333333333\" cy=\"381.52833333333336\" r=\"3.6\" />\n    <circle cx=\"337.6383333333333\" cy=\"381.52500000000003\" r=\"3.6\" />\n    <circle cx=\"345.935\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"337.65999999999997\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"329.36\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"345.93499999999995\" cy=\"367.01833333333326\" r=\"3.6\" />\n    <circle cx=\"362.50500000000005\" cy=\"357.3666666666666\" r=\"3.6\" />\n    <circle cx=\"329.36\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"362.49499999999995\" cy=\"347.695\" r=\"3.6\" />\n    <circle cx=\"354.2266666666667\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"321.07000000000005\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"312.78\" cy=\"454.05333333333334\" r=\"3.6\" />\n    <circle cx=\"312.74999999999994\" cy=\"444.40333333333336\" r=\"3.6\" />\n    <circle cx=\"321.105\" cy=\"468.54999999999995\" r=\"3.6\" />\n    <circle cx=\"312.7916666666667\" cy=\"473.41166666666663\" r=\"3.6\" />\n    <circle cx=\"312.77\" cy=\"463.70666666666665\" r=\"3.6\" />\n    <circle cx=\"321.0683333333334\" cy=\"420.21000000000004\" r=\"3.6\" />\n    <circle cx=\"321.0683333333333\" cy=\"439.5566666666667\" r=\"3.6\" />\n    <circle cx=\"321.06\" cy=\"429.8833333333334\" r=\"3.6\" />\n    <circle cx=\"362.48499999999996\" cy=\"338.0266666666667\" r=\"3.6\" />\n    <circle cx=\"329.16999999999996\" cy=\"38.276666666666664\" r=\"3.6\" />\n    <circle cx=\"337.47\" cy=\"43.11500000000001\" r=\"3.6\" />\n    <circle cx=\"345.7966666666667\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"345.85833333333335\" cy=\"96.27666666666666\" r=\"3.6\" />\n    <circle cx=\"354.10666666666674\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"304.29833333333335\" cy=\"52.798333333333325\" r=\"3.6\" />\n    <circle cx=\"295.995\" cy=\"47.913333333333334\" r=\"3.6\" />\n    <circle cx=\"312.57\" cy=\"47.97666666666667\" r=\"3.6\" />\n    <circle cx=\"320.895\" cy=\"43.125\" r=\"3.6\" />\n    <circle cx=\"362.48499999999996\" cy=\"318.69\" r=\"3.6\" />\n    <circle cx=\"345.8066666666667\" cy=\"105.97500000000001\" r=\"3.6\" />\n    <circle cx=\"146.525\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"370.82\" cy=\"323.52166666666665\" r=\"3.6\" />\n    <circle cx=\"354.1966666666667\" cy=\"313.85833333333335\" r=\"3.6\" />\n    <circle cx=\"370.81\" cy=\"313.84666666666664\" r=\"3.6\" />\n    <circle cx=\"354.1466666666667\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"163.10000000000002\" cy=\"67.31333333333335\" r=\"3.6\" />\n    <circle cx=\"345.89333333333326\" cy=\"299.32666666666665\" r=\"3.6\" />\n    <circle cx=\"345.89333333333326\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"196.47500000000002\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"207.49666666666667\" r=\"3.6\" />\n    <circle cx=\"179.82166666666663\" cy=\"202.66666666666666\" r=\"3.6\" />\n    <circle cx=\"179.8116666666667\" cy=\"192.99666666666667\" r=\"3.6\" />\n    <circle cx=\"221.32833333333335\" cy=\"226.83666666666667\" r=\"3.6\" />\n    <circle cx=\"238.02666666666667\" cy=\"236.4983333333333\" r=\"3.6\" />\n    <circle cx=\"254.53\" cy=\"284.8466666666667\" r=\"3.6\" />\n    <circle cx=\"262.845\" cy=\"289.68333333333334\" r=\"3.6\" />\n    <circle cx=\"254.59500000000003\" cy=\"265.5183333333334\" r=\"3.6\" />\n    <circle cx=\"179.80166666666665\" cy=\"183.32833333333335\" r=\"3.6\" />\n    <circle cx=\"154.87\" cy=\"139.83166666666665\" r=\"3.6\" />\n    <circle cx=\"154.88\" cy=\"149.495\" r=\"3.6\" />\n    <circle cx=\"154.9\" cy=\"159.17333333333335\" r=\"3.6\" />\n    <circle cx=\"304.46\" cy=\"439.5516666666667\" r=\"3.6\" />\n    <circle cx=\"171.51\" cy=\"178.50333333333333\" r=\"3.6\" />\n    <circle cx=\"262.845\" cy=\"299.3533333333333\" r=\"3.6\" />\n    <circle cx=\"163.17\" cy=\"173.67333333333332\" r=\"3.6\" />\n    <circle cx=\"154.91\" cy=\"168.83333333333334\" r=\"3.6\" />\n    <circle cx=\"146.54666666666665\" cy=\"134.97\" r=\"3.6\" />\n    <circle cx=\"296.17833333333334\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"304.4283333333333\" cy=\"371.8633333333333\" r=\"3.6\" />\n    <circle cx=\"304.4583333333333\" cy=\"391.2083333333333\" r=\"3.6\" />\n    <circle cx=\"287.695\" cy=\"52.776666666666664\" r=\"3.6\" />\n    <circle cx=\"287.855\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"287.855\" cy=\"410.52666666666664\" r=\"3.6\" />\n    <circle cx=\"304.46166666666664\" cy=\"429.87999999999994\" r=\"3.6\" />\n    <circle cx=\"296.175\" cy=\"425.0366666666667\" r=\"3.6\" />\n    <circle cx=\"287.85333333333335\" cy=\"420.195\" r=\"3.6\" />\n    <circle cx=\"271.21999999999997\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"262.865\" cy=\"309.02500000000003\" r=\"3.6\" />\n    <circle cx=\"271.22\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"279.51499999999993\" cy=\"338.01666666666665\" r=\"3.6\" />\n    <circle cx=\"262.885\" cy=\"318.69000000000005\" r=\"3.6\" />\n    <circle cx=\"296.135\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"296.135\" cy=\"357.34999999999997\" r=\"3.6\" />\n    <circle cx=\"296.125\" cy=\"347.6816666666667\" r=\"3.6\" />\n    <circle cx=\"287.82500000000005\" cy=\"342.84499999999997\" r=\"3.6\" />\n    <circle cx=\"412.455\" cy=\"492.73\" r=\"3.6\" />\n    <circle cx=\"420.52500000000003\" cy=\"33.45666666666667\" r=\"3.6\" />\n    <circle cx=\"428.81500000000005\" cy=\"28.60833333333333\" r=\"3.6\" />\n    <circle cx=\"403.91499999999996\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"403.91\" cy=\"43.12499999999999\" r=\"3.6\" />\n    <circle cx=\"428.8149999999999\" cy=\"18.93833333333333\" r=\"3.6\" />\n    <circle cx=\"412.195\" cy=\"38.29333333333334\" r=\"3.6\" />\n    <circle cx=\"387.27500000000003\" cy=\"52.776666666666664\" r=\"3.6\" />\n    <circle cx=\"395.57\" cy=\"28.625\" r=\"3.6\" />\n    <circle cx=\"420.52\" cy=\"23.78333333333333\" r=\"3.6\" />\n    <circle cx=\"403.8933333333334\" cy=\"23.78333333333333\" r=\"3.6\" />\n    <circle cx=\"412.185\" cy=\"18.953333333333337\" r=\"3.6\" />\n    <circle cx=\"395.59\" cy=\"47.93000000000001\" r=\"3.6\" />\n    <circle cx=\"412.205\" cy=\"9.261666666666668\" r=\"3.6\" />\n    <circle cx=\"428.81333333333333\" cy=\"9.258333333333333\" r=\"3.6\" />\n    <circle cx=\"445.41166666666663\" cy=\"9.235\" r=\"3.6\" />\n    <circle cx=\"461.9866666666667\" cy=\"9.261666666666668\" r=\"3.6\" />\n    <circle cx=\"395.6000000000001\" cy=\"67.31\" r=\"3.6\" />\n    <circle cx=\"453.7033333333334\" cy=\"43.14833333333333\" r=\"3.6\" />\n    <circle cx=\"395.555\" cy=\"38.281666666666666\" r=\"3.6\" />\n    <circle cx=\"412.185\" cy=\"28.623333333333335\" r=\"3.6\" />\n    <circle cx=\"403.90000000000003\" cy=\"33.45\" r=\"3.6\" />\n    <circle cx=\"445.4116666666667\" cy=\"18.938333333333333\" r=\"3.6\" />\n    <circle cx=\"437.1133333333333\" cy=\"23.77333333333333\" r=\"3.6\" />\n    <circle cx=\"453.7050000000001\" cy=\"23.78333333333333\" r=\"3.6\" />\n    <circle cx=\"395.62000000000006\" cy=\"57.61666666666667\" r=\"3.6\" />\n    <circle cx=\"403.925\" cy=\"62.468333333333334\" r=\"3.6\" />\n    <circle cx=\"428.845\" cy=\"47.95333333333334\" r=\"3.6\" />\n    <circle cx=\"420.55\" cy=\"52.79833333333334\" r=\"3.6\" />\n    <circle cx=\"412.23499999999996\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"387.27500000000003\" cy=\"62.44666666666668\" r=\"3.6\" />\n    <circle cx=\"387.25500000000005\" cy=\"23.77333333333333\" r=\"3.6\" />\n    <circle cx=\"445.4216666666666\" cy=\"38.278333333333336\" r=\"3.6\" />\n    <circle cx=\"470.3200000000001\" cy=\"23.786666666666665\" r=\"3.6\" />\n    <circle cx=\"478.60999999999996\" cy=\"9.263333333333334\" r=\"3.6\" />\n    <circle cx=\"395.57\" cy=\"18.919999999999998\" r=\"3.6\" />\n    <circle cx=\"437.165\" cy=\"43.12833333333333\" r=\"3.6\" />\n    <circle cx=\"462.0316666666667\" cy=\"38.29\" r=\"3.6\" />\n    <circle cx=\"428.825\" cy=\"38.27666666666667\" r=\"3.6\" />\n    <circle cx=\"445.41166666666663\" cy=\"28.60833333333333\" r=\"3.6\" />\n    <circle cx=\"437.1233333333333\" cy=\"33.443333333333335\" r=\"3.6\" />\n    <circle cx=\"453.71166666666676\" cy=\"33.45\" r=\"3.6\" />\n    <circle cx=\"461.99666666666667\" cy=\"28.641666666666666\" r=\"3.6\" />\n    <circle cx=\"412.205\" cy=\"47.96333333333333\" r=\"3.6\" />\n    <circle cx=\"420.535\" cy=\"43.12\" r=\"3.6\" />\n    <circle cx=\"420.52\" cy=\"14.116666666666665\" r=\"3.6\" />\n    <circle cx=\"437.1133333333333\" cy=\"14.103333333333332\" r=\"3.6\" />\n    <circle cx=\"403.8833333333334\" cy=\"14.11166666666667\" r=\"3.6\" />\n    <circle cx=\"453.705\" cy=\"14.116666666666669\" r=\"3.6\" />\n    <circle cx=\"461.965\" cy=\"18.95333333333333\" r=\"3.6\" />\n    <circle cx=\"470.31500000000005\" cy=\"14.123333333333335\" r=\"3.6\" />\n    <circle cx=\"470.305\" cy=\"62.48500000000001\" r=\"3.6\" />\n    <circle cx=\"461.99666666666667\" cy=\"57.61166666666667\" r=\"3.6\" />\n    <circle cx=\"478.62999999999994\" cy=\"57.61166666666667\" r=\"3.6\" />\n    <circle cx=\"486.99999999999994\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"503.54999999999995\" cy=\"81.80333333333333\" r=\"3.6\" />\n    <circle cx=\"503.5416666666667\" cy=\"101.145\" r=\"3.6\" />\n    <circle cx=\"511.905\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"503.5416666666667\" cy=\"91.46833333333332\" r=\"3.6\" />\n    <circle cx=\"544.4785714285714\" cy=\"18.662857142857142\" r=\"3.6\" />\n    <circle cx=\"560.6916666666666\" cy=\"18.958333333333332\" r=\"3.6\" />\n    <circle cx=\"552.3666666666667\" cy=\"14.098333333333331\" r=\"3.6\" />\n    <circle cx=\"568.995\" cy=\"14.086666666666666\" r=\"3.6\" />\n    <circle cx=\"552.4699999999999\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"610.495\" cy=\"9.266666666666666\" r=\"3.6\" />\n    <circle cx=\"627.0899999999999\" cy=\"9.253333333333332\" r=\"3.6\" />\n    <circle cx=\"643.7216666666667\" cy=\"38.275\" r=\"3.6\" />\n    <circle cx=\"635.37\" cy=\"33.428333333333335\" r=\"3.6\" />\n    <circle cx=\"651.9716666666667\" cy=\"23.776666666666667\" r=\"3.6\" />\n    <circle cx=\"643.685\" cy=\"28.58666666666667\" r=\"3.6\" />\n    <circle cx=\"660.2633333333334\" cy=\"18.908333333333335\" r=\"3.6\" />\n    <circle cx=\"660.4133333333333\" cy=\"357.325\" r=\"3.6\" />\n    <circle cx=\"652.11\" cy=\"381.5383333333334\" r=\"3.6\" />\n    <circle cx=\"652.08\" cy=\"362.1816666666667\" r=\"3.6\" />\n    <circle cx=\"668.7133333333333\" cy=\"342.83\" r=\"3.6\" />\n    <circle cx=\"668.745\" cy=\"352.4916666666666\" r=\"3.6\" />\n    <circle cx=\"652.08\" cy=\"371.8516666666667\" r=\"3.6\" />\n    <circle cx=\"660.4533333333334\" cy=\"367.00666666666666\" r=\"3.6\" />\n    <circle cx=\"660.4533333333334\" cy=\"376.6766666666667\" r=\"3.6\" />\n    <circle cx=\"710.5749999999999\" cy=\"9.26\" r=\"3.6\" />\n    <circle cx=\"718.4266666666667\" cy=\"14.11\" r=\"3.6\" />\n    <circle cx=\"818.0166666666668\" cy=\"23.773333333333337\" r=\"3.6\" />\n    <circle cx=\"859.58\" cy=\"105.95833333333336\" r=\"3.6\" />\n    <circle cx=\"859.58\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"859.5749999999999\" cy=\"115.62833333333334\" r=\"3.6\" />\n    <circle cx=\"859.58\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"842.9350000000001\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"851.2783333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"834.6599999999999\" cy=\"149.475\" r=\"3.6\" />\n    <circle cx=\"851.275\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"851.275\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"851.2866666666667\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"793.11\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"801.4383333333334\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"809.7400000000001\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"528.5283333333334\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"834.66\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"818.0366666666667\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"842.9466666666666\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"826.3683333333333\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"784.8216666666667\" cy=\"81.80833333333334\" r=\"3.6\" />\n    <circle cx=\"751.6533333333333\" cy=\"159.14666666666668\" r=\"3.6\" />\n    <circle cx=\"743.305\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"735.035\" cy=\"149.475\" r=\"3.6\" />\n    <circle cx=\"759.9583333333334\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"726.7283333333334\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"768.255\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"709.7887499999999\" cy=\"134.96375\" r=\"3.6\" />\n    <circle cx=\"718.4266666666666\" cy=\"139.79666666666668\" r=\"3.6\" />\n    <circle cx=\"776.5499999999998\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"818.07\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"809.75\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"826.4\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"834.69\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"801.4466666666667\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"834.68\" cy=\"159.15833333333333\" r=\"3.6\" />\n    <circle cx=\"784.8333333333334\" cy=\"149.475\" r=\"3.6\" />\n    <circle cx=\"793.1183333333333\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"560.7333333333333\" cy=\"105.95666666666666\" r=\"3.6\" />\n    <circle cx=\"560.7283333333334\" cy=\"115.62666666666667\" r=\"3.6\" />\n    <circle cx=\"702.13875\" cy=\"139.7975\" r=\"3.6\" />\n    <circle cx=\"552.4266666666666\" cy=\"139.79666666666665\" r=\"3.6\" />\n    <circle cx=\"560.725\" cy=\"96.28166666666668\" r=\"3.6\" />\n    <circle cx=\"560.7133333333334\" cy=\"125.30166666666668\" r=\"3.6\" />\n    <circle cx=\"602.255\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"577.3516666666666\" cy=\"86.60166666666667\" r=\"3.6\" />\n    <circle cx=\"593.9633333333334\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"585.66\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"520.2133333333334\" cy=\"168.8216666666667\" r=\"3.6\" />\n    <circle cx=\"520.235\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"520.235\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"520.1883333333334\" cy=\"159.13166666666666\" r=\"3.6\" />\n    <circle cx=\"520.23\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"610.515\" cy=\"96.28666666666668\" r=\"3.6\" />\n    <circle cx=\"520.2133333333334\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"520.22\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"718.44\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"768.225\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"726.7199999999999\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"710.1442857142857\" cy=\"77.23285714285716\" r=\"3.6\" />\n    <circle cx=\"702.14125\" cy=\"81.78125\" r=\"3.6\" />\n    <circle cx=\"743.275\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"759.9050000000001\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"735.0016666666667\" cy=\"72.125\" r=\"3.6\" />\n    <circle cx=\"751.6\" cy=\"72.13666666666667\" r=\"3.6\" />\n    <circle cx=\"693.48\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"685.2033333333334\" cy=\"91.45166666666667\" r=\"3.6\" />\n    <circle cx=\"635.4449999999999\" cy=\"101.10666666666667\" r=\"3.6\" />\n    <circle cx=\"826.3566666666667\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"618.855\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"627.1483333333333\" cy=\"105.94666666666666\" r=\"3.6\" />\n    <circle cx=\"643.7633333333333\" cy=\"105.94666666666667\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"660.3383333333334\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"668.595\" cy=\"101.10666666666667\" r=\"3.6\" />\n    <circle cx=\"776.54\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"685.2033333333334\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"702.1487500000001\" cy=\"91.45375000000001\" r=\"3.6\" />\n    <circle cx=\"693.48\" cy=\"96.28666666666668\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"105.94666666666667\" r=\"3.6\" />\n    <circle cx=\"735.0233333333332\" cy=\"81.80833333333334\" r=\"3.6\" />\n    <circle cx=\"668.59\" cy=\"110.77500000000002\" r=\"3.6\" />\n    <circle cx=\"726.7416666666667\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"743.295\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"709.7987499999999\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"718.44\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"618.8516666666666\" cy=\"110.79\" r=\"3.6\" />\n    <circle cx=\"627.14\" cy=\"115.61833333333333\" r=\"3.6\" />\n    <circle cx=\"610.515\" cy=\"105.95666666666666\" r=\"3.6\" />\n    <circle cx=\"602.2516666666667\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"593.9616666666667\" cy=\"105.94666666666667\" r=\"3.6\" />\n    <circle cx=\"635.4399999999999\" cy=\"110.77666666666669\" r=\"3.6\" />\n    <circle cx=\"660.3383333333334\" cy=\"105.94666666666666\" r=\"3.6\" />\n    <circle cx=\"643.76\" cy=\"115.61666666666667\" r=\"3.6\" />\n    <circle cx=\"652.015\" cy=\"110.79\" r=\"3.6\" />\n    <circle cx=\"851.2866666666667\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"842.9466666666666\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"834.66\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"851.2816666666666\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"826.3683333333333\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"842.9350000000001\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"834.65\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"842.935\" cy=\"125.31333333333332\" r=\"3.6\" />\n    <circle cx=\"842.9416666666666\" cy=\"115.64333333333333\" r=\"3.6\" />\n    <circle cx=\"793.11\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"768.225\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"818.0366666666667\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"776.54\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"759.9250000000001\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"784.8316666666666\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"809.7400000000001\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"801.4483333333333\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"751.62\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"577.3616666666667\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"602.3483333333334\" cy=\"255.82333333333335\" r=\"3.6\" />\n    <circle cx=\"618.9499999999999\" cy=\"246.15333333333334\" r=\"3.6\" />\n    <circle cx=\"610.61\" cy=\"250.99333333333334\" r=\"3.6\" />\n    <circle cx=\"627.25\" cy=\"241.30166666666665\" r=\"3.6\" />\n    <circle cx=\"635.485\" cy=\"197.80166666666665\" r=\"3.6\" />\n    <circle cx=\"577.4583333333333\" cy=\"250.97833333333335\" r=\"3.6\" />\n    <circle cx=\"577.4583333333333\" cy=\"260.6466666666667\" r=\"3.6\" />\n    <circle cx=\"594.055\" cy=\"260.6466666666667\" r=\"3.6\" />\n    <circle cx=\"585.7299999999999\" cy=\"265.4733333333333\" r=\"3.6\" />\n    <circle cx=\"652.0516666666666\" cy=\"168.79999999999998\" r=\"3.6\" />\n    <circle cx=\"676.9200000000001\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"643.8033333333333\" cy=\"192.96666666666667\" r=\"3.6\" />\n    <circle cx=\"685.2033333333334\" cy=\"149.45833333333334\" r=\"3.6\" />\n    <circle cx=\"660.3683333333333\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"668.625\" cy=\"159.12333333333333\" r=\"3.6\" />\n    <circle cx=\"652.0616666666666\" cy=\"188.14\" r=\"3.6\" />\n    <circle cx=\"577.4583333333334\" cy=\"241.3083333333333\" r=\"3.6\" />\n    <circle cx=\"652.0516666666666\" cy=\"178.47\" r=\"3.6\" />\n    <circle cx=\"528.5083333333334\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"569.0616666666666\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"569.0683333333333\" cy=\"110.78999999999998\" r=\"3.6\" />\n    <circle cx=\"569.0300000000001\" cy=\"130.145\" r=\"3.6\" />\n    <circle cx=\"528.5083333333334\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"585.66\" cy=\"101.10666666666667\" r=\"3.6\" />\n    <circle cx=\"569.07\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"693.4699999999999\" cy=\"144.63333333333335\" r=\"3.6\" />\n    <circle cx=\"569.1533333333333\" cy=\"236.47666666666666\" r=\"3.6\" />\n    <circle cx=\"569.04\" cy=\"91.435\" r=\"3.6\" />\n    <circle cx=\"552.4833333333333\" cy=\"226.81333333333336\" r=\"3.6\" />\n    <circle cx=\"536.825\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"544.995\" cy=\"221.98625\" r=\"3.6\" />\n    <circle cx=\"560.8050000000001\" cy=\"231.655\" r=\"3.6\" />\n    <circle cx=\"528.5083333333334\" cy=\"183.30999999999997\" r=\"3.6\" />\n    <circle cx=\"528.5183333333333\" cy=\"192.98\" r=\"3.6\" />\n    <circle cx=\"528.5283333333334\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"528.5283333333334\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"652.0200000000001\" cy=\"101.12\" r=\"3.6\" />\n    <circle cx=\"552.4200000000001\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"577.3366666666667\" cy=\"76.94166666666666\" r=\"3.6\" />\n    <circle cx=\"552.4200000000001\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"585.66\" cy=\"81.77\" r=\"3.6\" />\n    <circle cx=\"610.515\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"618.855\" cy=\"91.45166666666667\" r=\"3.6\" />\n    <circle cx=\"593.9616666666667\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"551.9371428571429\" cy=\"120.73571428571428\" r=\"3.6\" />\n    <circle cx=\"602.255\" cy=\"91.45166666666667\" r=\"3.6\" />\n    <circle cx=\"627.1483333333333\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"544.5557142857143\" cy=\"135.25285714285715\" r=\"3.6\" />\n    <circle cx=\"511.88499999999993\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"503.61999999999995\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"503.62000000000006\" cy=\"207.49333333333337\" r=\"3.6\" />\n    <circle cx=\"511.875\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"511.86499999999995\" cy=\"163.98\" r=\"3.6\" />\n    <circle cx=\"511.875\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"660.3383333333334\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"734.9916666666667\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"743.255\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"726.6983333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"718.4183333333334\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"759.8833333333332\" cy=\"67.28666666666666\" r=\"3.6\" />\n    <circle cx=\"768.2049999999999\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"635.4449999999999\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"776.52\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"709.75875\" cy=\"67.28375000000001\" r=\"3.6\" />\n    <circle cx=\"751.5900000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"668.595\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"652.0200000000001\" cy=\"91.45\" r=\"3.6\" />\n    <circle cx=\"495.32666666666665\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"643.7633333333333\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"693.4583333333334\" cy=\"76.95500000000001\" r=\"3.6\" />\n    <circle cx=\"701.7585714285715\" cy=\"71.84285714285714\" r=\"3.6\" />\n    <circle cx=\"685.1916666666666\" cy=\"81.78833333333334\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"610.5533333333334\" cy=\"289.6666666666667\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"313.83\" r=\"3.6\" />\n    <circle cx=\"610.595\" cy=\"328.3433333333333\" r=\"3.6\" />\n    <circle cx=\"577.44\" cy=\"337.99833333333333\" r=\"3.6\" />\n    <circle cx=\"610.575\" cy=\"309.005\" r=\"3.6\" />\n    <circle cx=\"610.595\" cy=\"318.67333333333335\" r=\"3.6\" />\n    <circle cx=\"577.4499999999999\" cy=\"347.6666666666667\" r=\"3.6\" />\n    <circle cx=\"594.0516666666667\" cy=\"347.6683333333333\" r=\"3.6\" />\n    <circle cx=\"594.0416666666667\" cy=\"337.99833333333333\" r=\"3.6\" />\n    <circle cx=\"495.34666666666664\" cy=\"231.6583333333333\" r=\"3.6\" />\n    <circle cx=\"610.5533333333334\" cy=\"299.33666666666664\" r=\"3.6\" />\n    <circle cx=\"643.895\" cy=\"250.97666666666666\" r=\"3.6\" />\n    <circle cx=\"627.2399999999999\" cy=\"260.6466666666667\" r=\"3.6\" />\n    <circle cx=\"635.5366666666667\" cy=\"255.81000000000003\" r=\"3.6\" />\n    <circle cx=\"643.7833333333333\" cy=\"231.645\" r=\"3.6\" />\n    <circle cx=\"784.8016666666666\" cy=\"72.125\" r=\"3.6\" />\n    <circle cx=\"618.935\" cy=\"265.485\" r=\"3.6\" />\n    <circle cx=\"610.5533333333334\" cy=\"279.99666666666667\" r=\"3.6\" />\n    <circle cx=\"610.5866666666667\" cy=\"270.32666666666665\" r=\"3.6\" />\n    <circle cx=\"602.335\" cy=\"333.17333333333335\" r=\"3.6\" />\n    <circle cx=\"569.15\" cy=\"333.17333333333335\" r=\"3.6\" />\n    <circle cx=\"545.035\" cy=\"241.32375\" r=\"3.6\" />\n    <circle cx=\"536.865\" cy=\"236.48666666666665\" r=\"3.6\" />\n    <circle cx=\"552.5133333333334\" cy=\"246.15666666666667\" r=\"3.6\" />\n    <circle cx=\"511.915\" cy=\"231.67\" r=\"3.6\" />\n    <circle cx=\"503.6499999999999\" cy=\"236.50833333333333\" r=\"3.6\" />\n    <circle cx=\"520.245\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"560.825\" cy=\"250.99333333333334\" r=\"3.6\" />\n    <circle cx=\"528.5500000000001\" cy=\"231.65833333333333\" r=\"3.6\" />\n    <circle cx=\"536.845\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"577.4399999999999\" cy=\"318.65833333333336\" r=\"3.6\" />\n    <circle cx=\"577.4399999999999\" cy=\"328.3283333333333\" r=\"3.6\" />\n    <circle cx=\"560.825\" cy=\"260.66333333333336\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"299.3233333333333\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"289.6566666666667\" r=\"3.6\" />\n    <circle cx=\"569.1216666666668\" cy=\"275.17\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"577.42\" cy=\"308.9883333333333\" r=\"3.6\" />\n    <circle cx=\"643.8133333333334\" cy=\"202.63666666666666\" r=\"3.6\" />\n    <circle cx=\"793.0883333333335\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"627.2399999999999\" cy=\"250.97833333333332\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"207.46666666666667\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"217.13333333333335\" r=\"3.6\" />\n    <circle cx=\"602.3333333333334\" cy=\"265.50166666666667\" r=\"3.6\" />\n    <circle cx=\"618.9499999999999\" cy=\"255.82333333333335\" r=\"3.6\" />\n    <circle cx=\"602.3016666666666\" cy=\"275.1566666666667\" r=\"3.6\" />\n    <circle cx=\"602.2916666666666\" cy=\"284.83166666666665\" r=\"3.6\" />\n    <circle cx=\"610.61\" cy=\"260.66333333333336\" r=\"3.6\" />\n    <circle cx=\"668.625\" cy=\"168.79\" r=\"3.6\" />\n    <circle cx=\"676.94\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"685.2233333333334\" cy=\"159.13833333333335\" r=\"3.6\" />\n    <circle cx=\"652.0716666666667\" cy=\"197.81000000000003\" r=\"3.6\" />\n    <circle cx=\"693.4899999999999\" cy=\"154.305\" r=\"3.6\" />\n    <circle cx=\"660.4033333333333\" cy=\"192.96333333333334\" r=\"3.6\" />\n    <circle cx=\"660.3783333333334\" cy=\"183.3033333333333\" r=\"3.6\" />\n    <circle cx=\"660.3683333333333\" cy=\"173.6266666666667\" r=\"3.6\" />\n    <circle cx=\"569.165\" cy=\"246.15333333333334\" r=\"3.6\" />\n    <circle cx=\"585.6949999999999\" cy=\"284.81666666666666\" r=\"3.6\" />\n    <circle cx=\"569.1516666666665\" cy=\"265.485\" r=\"3.6\" />\n    <circle cx=\"577.425\" cy=\"270.32\" r=\"3.6\" />\n    <circle cx=\"585.6949999999999\" cy=\"275.1466666666667\" r=\"3.6\" />\n    <circle cx=\"569.1649999999998\" cy=\"255.82333333333335\" r=\"3.6\" />\n    <circle cx=\"544.6685714285715\" cy=\"231.9285714285714\" r=\"3.6\" />\n    <circle cx=\"701.7900000000001\" cy=\"149.19285714285715\" r=\"3.6\" />\n    <circle cx=\"552.5033333333334\" cy=\"236.49166666666667\" r=\"3.6\" />\n    <circle cx=\"560.825\" cy=\"241.32333333333335\" r=\"3.6\" />\n    <circle cx=\"602.3233333333334\" cy=\"313.8433333333333\" r=\"3.6\" />\n    <circle cx=\"602.335\" cy=\"323.50333333333333\" r=\"3.6\" />\n    <circle cx=\"594.0416666666666\" cy=\"328.3283333333333\" r=\"3.6\" />\n    <circle cx=\"602.2916666666666\" cy=\"294.50166666666667\" r=\"3.6\" />\n    <circle cx=\"602.3016666666666\" cy=\"304.165\" r=\"3.6\" />\n    <circle cx=\"585.6949999999999\" cy=\"294.4866666666666\" r=\"3.6\" />\n    <circle cx=\"585.7183333333334\" cy=\"304.155\" r=\"3.6\" />\n    <circle cx=\"585.74\" cy=\"323.49333333333334\" r=\"3.6\" />\n    <circle cx=\"585.74\" cy=\"313.8233333333333\" r=\"3.6\" />\n    <circle cx=\"635.5666666666667\" cy=\"246.12666666666664\" r=\"3.6\" />\n    <circle cx=\"867.875\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"709.7887499999999\" cy=\"144.63375000000002\" r=\"3.6\" />\n    <circle cx=\"867.87\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"876.1816666666667\" cy=\"76.97166666666668\" r=\"3.6\" />\n    <circle cx=\"867.8750000000001\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"859.57\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"851.2866666666667\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"859.57\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"842.9583333333334\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"867.8650000000001\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"818.0366666666667\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"826.3466666666667\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"809.7199999999999\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"801.4150000000001\" cy=\"72.13666666666667\" r=\"3.6\" />\n    <circle cx=\"834.6500000000001\" cy=\"81.80833333333334\" r=\"3.6\" />\n    <circle cx=\"851.2766666666668\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"859.56\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"842.9250000000001\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"876.2066666666666\" cy=\"96.27333333333333\" r=\"3.6\" />\n    <circle cx=\"751.6633333333333\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"776.5699999999998\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"842.98\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"768.255\" cy=\"168.80666666666667\" r=\"3.6\" />\n    <circle cx=\"759.9583333333334\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"718.4483333333333\" cy=\"149.465\" r=\"3.6\" />\n    <circle cx=\"726.7516666666667\" cy=\"154.30833333333334\" r=\"3.6\" />\n    <circle cx=\"735.055\" cy=\"159.15833333333333\" r=\"3.6\" />\n    <circle cx=\"743.3250000000002\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"834.69\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"826.4\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"842.98\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8533333333334\" cy=\"159.15833333333333\" r=\"3.6\" />\n    <circle cx=\"818.07\" cy=\"168.80666666666667\" r=\"3.6\" />\n    <circle cx=\"793.14\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"809.7700000000001\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"801.4699999999999\" cy=\"159.14666666666668\" r=\"3.6\" />\n    <circle cx=\"710.147142857143\" cy=\"115.89999999999999\" r=\"3.6\" />\n    <circle cx=\"743.295\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"735.035\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"726.7416666666667\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"718.4333333333333\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"759.9250000000001\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"776.5333333333333\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"768.2199999999999\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"709.7987499999999\" cy=\"105.9575\" r=\"3.6\" />\n    <circle cx=\"751.6300000000001\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"676.9\" cy=\"125.28333333333335\" r=\"3.6\" />\n    <circle cx=\"618.855\" cy=\"149.47\" r=\"3.6\" />\n    <circle cx=\"602.3083333333333\" cy=\"207.48166666666665\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"207.48333333333335\" r=\"3.6\" />\n    <circle cx=\"594.015\" cy=\"202.63666666666666\" r=\"3.6\" />\n    <circle cx=\"685.1966666666666\" cy=\"120.46\" r=\"3.6\" />\n    <circle cx=\"693.475\" cy=\"115.62666666666667\" r=\"3.6\" />\n    <circle cx=\"701.7971428571428\" cy=\"110.51857142857143\" r=\"3.6\" />\n    <circle cx=\"784.8299999999999\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"826.3800000000001\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"776.5299999999999\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"768.215\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"759.915\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8249999999999\" cy=\"120.47166666666665\" r=\"3.6\" />\n    <circle cx=\"751.6199999999999\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"726.735\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"793.1033333333334\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"735.0266666666666\" cy=\"120.47166666666665\" r=\"3.6\" />\n    <circle cx=\"743.285\" cy=\"125.31333333333333\" r=\"3.6\" />\n    <circle cx=\"793.0966666666667\" cy=\"125.31333333333333\" r=\"3.6\" />\n    <circle cx=\"818.025\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"809.735\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"801.445\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"826.3616666666667\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"801.44\" cy=\"120.47499999999998\" r=\"3.6\" />\n    <circle cx=\"809.73\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"826.3566666666666\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"818.0250000000001\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"569.105\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"602.2916666666666\" cy=\"188.13833333333332\" r=\"3.6\" />\n    <circle cx=\"602.3033333333333\" cy=\"197.81499999999997\" r=\"3.6\" />\n    <circle cx=\"602.2716666666666\" cy=\"178.45333333333335\" r=\"3.6\" />\n    <circle cx=\"618.8266666666667\" cy=\"168.80333333333334\" r=\"3.6\" />\n    <circle cx=\"585.7149999999999\" cy=\"207.46666666666667\" r=\"3.6\" />\n    <circle cx=\"602.3083333333333\" cy=\"217.14999999999998\" r=\"3.6\" />\n    <circle cx=\"594.015\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"610.5966666666667\" cy=\"202.62833333333333\" r=\"3.6\" />\n    <circle cx=\"610.5666666666667\" cy=\"212.3166666666667\" r=\"3.6\" />\n    <circle cx=\"593.9216666666666\" cy=\"154.295\" r=\"3.6\" />\n    <circle cx=\"552.4683333333334\" cy=\"197.8166666666667\" r=\"3.6\" />\n    <circle cx=\"552.4583333333334\" cy=\"188.14166666666665\" r=\"3.6\" />\n    <circle cx=\"627.13\" cy=\"144.61333333333334\" r=\"3.6\" />\n    <circle cx=\"560.765\" cy=\"183.30666666666664\" r=\"3.6\" />\n    <circle cx=\"560.785\" cy=\"202.64666666666665\" r=\"3.6\" />\n    <circle cx=\"635.4250000000001\" cy=\"139.77833333333334\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"154.28666666666666\" r=\"3.6\" />\n    <circle cx=\"569.07\" cy=\"178.455\" r=\"3.6\" />\n    <circle cx=\"618.8466666666667\" cy=\"159.145\" r=\"3.6\" />\n    <circle cx=\"585.705\" cy=\"188.12666666666667\" r=\"3.6\" />\n    <circle cx=\"577.4150000000001\" cy=\"202.63666666666666\" r=\"3.6\" />\n    <circle cx=\"585.7233333333332\" cy=\"178.4383333333333\" r=\"3.6\" />\n    <circle cx=\"577.4033333333334\" cy=\"192.9666666666667\" r=\"3.6\" />\n    <circle cx=\"602.2316666666667\" cy=\"149.44333333333336\" r=\"3.6\" />\n    <circle cx=\"602.2566666666667\" cy=\"159.16166666666666\" r=\"3.6\" />\n    <circle cx=\"585.7149999999999\" cy=\"197.7966666666667\" r=\"3.6\" />\n    <circle cx=\"602.2033333333334\" cy=\"139.79000000000002\" r=\"3.6\" />\n    <circle cx=\"610.535\" cy=\"144.61666666666667\" r=\"3.6\" />\n    <circle cx=\"560.775\" cy=\"192.9766666666667\" r=\"3.6\" />\n    <circle cx=\"735.0316666666666\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"569.115\" cy=\"197.80833333333337\" r=\"3.6\" />\n    <circle cx=\"577.3933333333334\" cy=\"183.29666666666665\" r=\"3.6\" />\n    <circle cx=\"610.525\" cy=\"154.305\" r=\"3.6\" />\n    <circle cx=\"593.9933333333332\" cy=\"183.29666666666665\" r=\"3.6\" />\n    <circle cx=\"594.005\" cy=\"192.96666666666667\" r=\"3.6\" />\n    <circle cx=\"577.3950000000001\" cy=\"173.61666666666667\" r=\"3.6\" />\n    <circle cx=\"594.0416666666667\" cy=\"318.65833333333336\" r=\"3.6\" />\n    <circle cx=\"901.005\" cy=\"43.10166666666666\" r=\"3.6\" />\n    <circle cx=\"917.64\" cy=\"43.086666666666666\" r=\"3.6\" />\n    <circle cx=\"876.1350000000001\" cy=\"38.24333333333333\" r=\"3.6\" />\n    <circle cx=\"934.225\" cy=\"43.10666666666666\" r=\"3.6\" />\n    <circle cx=\"826.3083333333334\" cy=\"38.251666666666665\" r=\"3.6\" />\n    <circle cx=\"784.77\" cy=\"33.435\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"38.266666666666666\" r=\"3.6\" />\n    <circle cx=\"959.1383333333333\" cy=\"47.93666666666667\" r=\"3.6\" />\n    <circle cx=\"842.9149999999998\" cy=\"38.27\" r=\"3.6\" />\n    <circle cx=\"801.3650000000001\" cy=\"33.434999999999995\" r=\"3.6\" />\n    <circle cx=\"743.29\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"917.62\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"934.23\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"909.3216666666667\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"942.5050000000001\" cy=\"57.629999999999995\" r=\"3.6\" />\n    <circle cx=\"942.5050000000001\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"934.23\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"950.8449999999999\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"901.0750000000002\" cy=\"159.165\" r=\"3.6\" />\n    <circle cx=\"751.5450000000001\" cy=\"23.76166666666667\" r=\"3.6\" />\n    <circle cx=\"503.60166666666674\" cy=\"275.19\" r=\"3.6\" />\n    <circle cx=\"793.1816666666665\" cy=\"212.35833333333335\" r=\"3.6\" />\n    <circle cx=\"569.16\" cy=\"420.2\" r=\"3.6\" />\n    <circle cx=\"768.3649999999999\" cy=\"265.5\" r=\"3.6\" />\n    <circle cx=\"950.8699999999999\" cy=\"101.15833333333335\" r=\"3.6\" />\n    <circle cx=\"975.7583333333332\" cy=\"57.63166666666667\" r=\"3.6\" />\n    <circle cx=\"842.995\" cy=\"309.0416666666667\" r=\"3.6\" />\n    <circle cx=\"892.7533333333332\" cy=\"135.00166666666667\" r=\"3.6\" />\n    <circle cx=\"585.8216666666666\" cy=\"420.20666666666665\" r=\"3.6\" />\n    <circle cx=\"660.2750000000001\" cy=\"47.905\" r=\"3.6\" />\n    <circle cx=\"710.1014285714285\" cy=\"28.874285714285715\" r=\"3.6\" />\n    <circle cx=\"487.01499999999993\" cy=\"275.18833333333333\" r=\"3.6\" />\n    <circle cx=\"734.9583333333334\" cy=\"23.763333333333335\" r=\"3.6\" />\n    <circle cx=\"676.8283333333334\" cy=\"38.25\" r=\"3.6\" />\n    <circle cx=\"577.3216666666666\" cy=\"38.25166666666667\" r=\"3.6\" />\n    <circle cx=\"635.425\" cy=\"52.741666666666674\" r=\"3.6\" />\n    <circle cx=\"610.495\" cy=\"47.92166666666666\" r=\"3.6\" />\n    <circle cx=\"925.9366666666666\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"594.0183333333333\" cy=\"308.9883333333333\" r=\"3.6\" />\n    <circle cx=\"569.12\" cy=\"207.48166666666665\" r=\"3.6\" />\n    <circle cx=\"593.9983333333333\" cy=\"299.3233333333333\" r=\"3.6\" />\n    <circle cx=\"585.75\" cy=\"342.83\" r=\"3.6\" />\n    <circle cx=\"593.9983333333333\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"503.62999999999994\" cy=\"226.82666666666663\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"222.0033333333333\" r=\"3.6\" />\n    <circle cx=\"876.23\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"867.8750000000001\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"593.9983333333333\" cy=\"289.6566666666667\" r=\"3.6\" />\n    <circle cx=\"751.6233333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"759.9200000000001\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"594.0266666666668\" cy=\"270.31666666666666\" r=\"3.6\" />\n    <circle cx=\"751.6283333333334\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"768.215\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"834.6566666666666\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"842.9466666666667\" cy=\"105.97333333333331\" r=\"3.6\" />\n    <circle cx=\"759.915\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"585.74\" cy=\"333.16333333333336\" r=\"3.6\" />\n    <circle cx=\"826.415\" cy=\"260.655\" r=\"3.6\" />\n    <circle cx=\"909.3666666666667\" cy=\"76.95333333333333\" r=\"3.6\" />\n    <circle cx=\"826.4000000000001\" cy=\"241.32666666666663\" r=\"3.6\" />\n    <circle cx=\"826.41\" cy=\"251.0016666666667\" r=\"3.6\" />\n    <circle cx=\"843.045\" cy=\"280.0133333333334\" r=\"3.6\" />\n    <circle cx=\"760.04\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"759.9783333333334\" cy=\"221.98833333333332\" r=\"3.6\" />\n    <circle cx=\"760.0099999999999\" cy=\"231.66166666666666\" r=\"3.6\" />\n    <circle cx=\"834.7516666666667\" cy=\"246.1716666666667\" r=\"3.6\" />\n    <circle cx=\"560.8000000000001\" cy=\"270.3266666666667\" r=\"3.6\" />\n    <circle cx=\"585.76\" cy=\"362.1666666666667\" r=\"3.6\" />\n    <circle cx=\"585.76\" cy=\"352.49666666666667\" r=\"3.6\" />\n    <circle cx=\"859.5799999999999\" cy=\"144.64333333333335\" r=\"3.6\" />\n    <circle cx=\"834.7416666666667\" cy=\"236.50833333333333\" r=\"3.6\" />\n    <circle cx=\"834.7216666666667\" cy=\"226.82666666666663\" r=\"3.6\" />\n    <circle cx=\"552.5133333333334\" cy=\"265.49666666666667\" r=\"3.6\" />\n    <circle cx=\"478.73333333333335\" cy=\"231.65833333333333\" r=\"3.6\" />\n    <circle cx=\"668.585\" cy=\"130.11333333333332\" r=\"3.6\" />\n    <circle cx=\"577.3583333333332\" cy=\"115.61666666666666\" r=\"3.6\" />\n    <circle cx=\"577.3533333333332\" cy=\"125.28333333333332\" r=\"3.6\" />\n    <circle cx=\"569\" cy=\"139.79333333333332\" r=\"3.6\" />\n    <circle cx=\"577.3616666666667\" cy=\"105.94666666666666\" r=\"3.6\" />\n    <circle cx=\"577.3533333333332\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"610.5416666666666\" cy=\"115.64499999999998\" r=\"3.6\" />\n    <circle cx=\"602.2483333333333\" cy=\"120.46\" r=\"3.6\" />\n    <circle cx=\"627.1233333333333\" cy=\"125.28000000000002\" r=\"3.6\" />\n    <circle cx=\"593.9549999999999\" cy=\"115.61666666666667\" r=\"3.6\" />\n    <circle cx=\"585.6566666666666\" cy=\"110.77666666666669\" r=\"3.6\" />\n    <circle cx=\"536.825\" cy=\"207.48333333333335\" r=\"3.6\" />\n    <circle cx=\"544.995\" cy=\"212.31625\" r=\"3.6\" />\n    <circle cx=\"536.825\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"552.4733333333334\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"536.855\" cy=\"159.13000000000002\" r=\"3.6\" />\n    <circle cx=\"536.835\" cy=\"168.78833333333333\" r=\"3.6\" />\n    <circle cx=\"536.815\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"536.8050000000001\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"709.7987499999999\" cy=\"96.2875\" r=\"3.6\" />\n    <circle cx=\"735.035\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"743.295\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"726.7416666666667\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"560.785\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"718.44\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"768.225\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"635.4350000000001\" cy=\"120.44666666666667\" r=\"3.6\" />\n    <circle cx=\"776.54\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"759.9250000000001\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"751.6300000000001\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"660.3316666666666\" cy=\"115.61666666666666\" r=\"3.6\" />\n    <circle cx=\"652.0083333333333\" cy=\"120.46\" r=\"3.6\" />\n    <circle cx=\"643.7533333333333\" cy=\"125.28333333333335\" r=\"3.6\" />\n    <circle cx=\"668.585\" cy=\"120.44666666666667\" r=\"3.6\" />\n    <circle cx=\"676.9066666666666\" cy=\"115.61666666666667\" r=\"3.6\" />\n    <circle cx=\"693.48\" cy=\"105.95666666666666\" r=\"3.6\" />\n    <circle cx=\"702.1487500000001\" cy=\"101.12375\" r=\"3.6\" />\n    <circle cx=\"685.2016666666667\" cy=\"110.79166666666667\" r=\"3.6\" />\n    <circle cx=\"660.3466666666667\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"726.7283333333334\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"735.025\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"743.285\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"718.4266666666666\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"709.7887499999999\" cy=\"125.29625\" r=\"3.6\" />\n    <circle cx=\"751.6300000000001\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"693.4699999999999\" cy=\"134.96333333333334\" r=\"3.6\" />\n    <circle cx=\"685.1933333333333\" cy=\"139.79333333333332\" r=\"3.6\" />\n    <circle cx=\"569.13\" cy=\"226.82333333333335\" r=\"3.6\" />\n    <circle cx=\"793.0966666666667\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"801.4366666666666\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"676.9000000000001\" cy=\"144.61833333333334\" r=\"3.6\" />\n    <circle cx=\"809.73\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"818.0483333333332\" cy=\"149.465\" r=\"3.6\" />\n    <circle cx=\"776.5299999999999\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"768.235\" cy=\"149.465\" r=\"3.6\" />\n    <circle cx=\"759.9366666666666\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8216666666667\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"702.13875\" cy=\"130.13\" r=\"3.6\" />\n    <circle cx=\"585.755\" cy=\"255.80999999999997\" r=\"3.6\" />\n    <circle cx=\"668.605\" cy=\"149.45499999999998\" r=\"3.6\" />\n    <circle cx=\"602.3483333333334\" cy=\"246.1533333333333\" r=\"3.6\" />\n    <circle cx=\"618.9399999999999\" cy=\"236.47666666666666\" r=\"3.6\" />\n    <circle cx=\"610.61\" cy=\"241.32333333333335\" r=\"3.6\" />\n    <circle cx=\"577.4366666666666\" cy=\"231.63833333333335\" r=\"3.6\" />\n    <circle cx=\"585.755\" cy=\"246.1433333333333\" r=\"3.6\" />\n    <circle cx=\"585.755\" cy=\"236.47333333333333\" r=\"3.6\" />\n    <circle cx=\"594.055\" cy=\"250.97833333333332\" r=\"3.6\" />\n    <circle cx=\"643.7933333333333\" cy=\"173.6266666666667\" r=\"3.6\" />\n    <circle cx=\"643.7933333333333\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"652.0516666666666\" cy=\"159.13000000000002\" r=\"3.6\" />\n    <circle cx=\"784.8316666666666\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"635.485\" cy=\"188.12666666666667\" r=\"3.6\" />\n    <circle cx=\"627.185\" cy=\"192.97\" r=\"3.6\" />\n    <circle cx=\"643.7933333333333\" cy=\"183.29666666666665\" r=\"3.6\" />\n    <circle cx=\"627.25\" cy=\"231.63333333333333\" r=\"3.6\" />\n    <circle cx=\"643.7533333333333\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"544.97125\" cy=\"183.30749999999998\" r=\"3.6\" />\n    <circle cx=\"577.3566666666667\" cy=\"144.62666666666664\" r=\"3.6\" />\n    <circle cx=\"544.6214285714285\" cy=\"173.91428571428574\" r=\"3.6\" />\n    <circle cx=\"585.7133333333333\" cy=\"139.78333333333333\" r=\"3.6\" />\n    <circle cx=\"552.4616666666666\" cy=\"178.46833333333333\" r=\"3.6\" />\n    <circle cx=\"610.5566666666667\" cy=\"125.30166666666666\" r=\"3.6\" />\n    <circle cx=\"594.055\" cy=\"241.3083333333333\" r=\"3.6\" />\n    <circle cx=\"585.6533333333333\" cy=\"120.44666666666667\" r=\"3.6\" />\n    <circle cx=\"585.6833333333333\" cy=\"130.13166666666666\" r=\"3.6\" />\n    <circle cx=\"569.12\" cy=\"217.15\" r=\"3.6\" />\n    <circle cx=\"585.735\" cy=\"226.80499999999998\" r=\"3.6\" />\n    <circle cx=\"635.425\" cy=\"130.11999999999998\" r=\"3.6\" />\n    <circle cx=\"577.4150000000001\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"544.6357142857142\" cy=\"193.25142857142856\" r=\"3.6\" />\n    <circle cx=\"594.035\" cy=\"231.63833333333332\" r=\"3.6\" />\n    <circle cx=\"544.9950000000001\" cy=\"202.64625\" r=\"3.6\" />\n    <circle cx=\"560.785\" cy=\"212.3166666666667\" r=\"3.6\" />\n    <circle cx=\"552.4733333333334\" cy=\"207.48333333333332\" r=\"3.6\" />\n    <circle cx=\"593.975\" cy=\"125.29666666666668\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"627.18\" cy=\"173.62666666666667\" r=\"3.6\" />\n    <circle cx=\"610.5466666666666\" cy=\"183.30666666666664\" r=\"3.6\" />\n    <circle cx=\"577.4150000000001\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"610.5816666666666\" cy=\"192.99\" r=\"3.6\" />\n    <circle cx=\"594.015\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"585.7149999999999\" cy=\"217.13333333333333\" r=\"3.6\" />\n    <circle cx=\"602.3183333333335\" cy=\"226.8116666666667\" r=\"3.6\" />\n    <circle cx=\"610.5666666666667\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"618.8566666666667\" cy=\"178.455\" r=\"3.6\" />\n    <circle cx=\"652.0083333333333\" cy=\"139.79\" r=\"3.6\" />\n    <circle cx=\"660.3249999999999\" cy=\"125.28333333333335\" r=\"3.6\" />\n    <circle cx=\"660.325\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"627.18\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"652.0083333333333\" cy=\"130.12333333333333\" r=\"3.6\" />\n    <circle cx=\"627.16\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"635.455\" cy=\"149.45499999999998\" r=\"3.6\" />\n    <circle cx=\"643.7533333333333\" cy=\"144.61833333333334\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"178.45666666666668\" r=\"3.6\" />\n    <circle cx=\"768.215\" cy=\"139.79666666666668\" r=\"3.6\" />\n    <circle cx=\"776.5299999999999\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8216666666667\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"793.0966666666667\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"726.7283333333334\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"743.285\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"735.025\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"751.6199999999999\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"759.915\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"801.4366666666666\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"818.0299999999999\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"602.3383333333335\" cy=\"236.48833333333332\" r=\"3.6\" />\n    <circle cx=\"826.3683333333333\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"801.4483333333333\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"826.3566666666666\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"834.65\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"818.0250000000001\" cy=\"139.79666666666668\" r=\"3.6\" />\n    <circle cx=\"809.73\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"834.6533333333333\" cy=\"120.47166666666668\" r=\"3.6\" />\n    <circle cx=\"718.4266666666666\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"627.18\" cy=\"183.2966666666667\" r=\"3.6\" />\n    <circle cx=\"793.11\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"159.12333333333333\" r=\"3.6\" />\n    <circle cx=\"610.5883333333334\" cy=\"231.655\" r=\"3.6\" />\n    <circle cx=\"643.7733333333333\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"618.8916666666667\" cy=\"188.145\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"168.79\" r=\"3.6\" />\n    <circle cx=\"693.4699999999999\" cy=\"125.29666666666667\" r=\"3.6\" />\n    <circle cx=\"652.0300000000001\" cy=\"149.46166666666667\" r=\"3.6\" />\n    <circle cx=\"643.7833333333333\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"685.1933333333333\" cy=\"130.1266666666667\" r=\"3.6\" />\n    <circle cx=\"702.14\" cy=\"120.46374999999999\" r=\"3.6\" />\n    <circle cx=\"676.9000000000001\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"660.325\" cy=\"144.61833333333334\" r=\"3.6\" />\n    <circle cx=\"668.585\" cy=\"139.78333333333333\" r=\"3.6\" />\n    <circle cx=\"809.7400000000001\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"544.9325\" cy=\"289.66625\" r=\"3.6\" />\n    <circle cx=\"544.9549999999999\" cy=\"280.01\" r=\"3.6\" />\n    <circle cx=\"552.455\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"552.465\" cy=\"304.1683333333333\" r=\"3.6\" />\n    <circle cx=\"544.6414285714287\" cy=\"270.6114285714286\" r=\"3.6\" />\n    <circle cx=\"552.0157142857142\" cy=\"313.57142857142856\" r=\"3.6\" />\n    <circle cx=\"520.275\" cy=\"255.84166666666667\" r=\"3.6\" />\n    <circle cx=\"528.57\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"536.84\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"511.9350000000001\" cy=\"260.6766666666667\" r=\"3.6\" />\n    <circle cx=\"569.2100000000002\" cy=\"400.8566666666666\" r=\"3.6\" />\n    <circle cx=\"569.1800000000002\" cy=\"381.5266666666667\" r=\"3.6\" />\n    <circle cx=\"569.1999999999999\" cy=\"391.185\" r=\"3.6\" />\n    <circle cx=\"560.8516666666668\" cy=\"396.02666666666664\" r=\"3.6\" />\n    <circle cx=\"560.83\" cy=\"367.01666666666665\" r=\"3.6\" />\n    <circle cx=\"544.6342857142856\" cy=\"347.95714285714286\" r=\"3.6\" />\n    <circle cx=\"552.0414285714287\" cy=\"352.79\" r=\"3.6\" />\n    <circle cx=\"503.5566666666667\" cy=\"139.81333333333336\" r=\"3.6\" />\n    <circle cx=\"560.82\" cy=\"376.6916666666666\" r=\"3.6\" />\n    <circle cx=\"478.71000000000004\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"503.6466666666667\" cy=\"265.5183333333334\" r=\"3.6\" />\n    <circle cx=\"487\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"470.42\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"495.2716666666666\" cy=\"154.33333333333334\" r=\"3.6\" />\n    <circle cx=\"495.2633333333333\" cy=\"144.63666666666666\" r=\"3.6\" />\n    <circle cx=\"470.42\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"486.98\" cy=\"178.46833333333333\" r=\"3.6\" />\n    <circle cx=\"487\" cy=\"168.78833333333333\" r=\"3.6\" />\n    <circle cx=\"478.695\" cy=\"192.9766666666667\" r=\"3.6\" />\n    <circle cx=\"478.75333333333333\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"487.0266666666667\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"495.36666666666673\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"470.43\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"470.43000000000006\" cy=\"255.86\" r=\"3.6\" />\n    <circle cx=\"462.09\" cy=\"231.665\" r=\"3.6\" />\n    <circle cx=\"462.11999999999995\" cy=\"241.33666666666662\" r=\"3.6\" />\n    <circle cx=\"470.46000000000004\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"552.5166666666668\" cy=\"362.18333333333334\" r=\"3.6\" />\n    <circle cx=\"718.48\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"660.4000000000001\" cy=\"260.63000000000005\" r=\"3.6\" />\n    <circle cx=\"685.2483333333333\" cy=\"207.46666666666667\" r=\"3.6\" />\n    <circle cx=\"709.8325\" cy=\"183.3075\" r=\"3.6\" />\n    <circle cx=\"693.505\" cy=\"192.98499999999999\" r=\"3.6\" />\n    <circle cx=\"668.715\" cy=\"236.49166666666665\" r=\"3.6\" />\n    <circle cx=\"685.265\" cy=\"217.155\" r=\"3.6\" />\n    <circle cx=\"668.665\" cy=\"226.80499999999998\" r=\"3.6\" />\n    <circle cx=\"676.9633333333334\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"701.83\" cy=\"187.87000000000003\" r=\"3.6\" />\n    <circle cx=\"751.685\" cy=\"236.51333333333332\" r=\"3.6\" />\n    <circle cx=\"743.335\" cy=\"222.01\" r=\"3.6\" />\n    <circle cx=\"751.695\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"751.6650000000001\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"726.7616666666667\" cy=\"202.665\" r=\"3.6\" />\n    <circle cx=\"743.3449999999999\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"726.7816666666668\" cy=\"192.97833333333335\" r=\"3.6\" />\n    <circle cx=\"735.085\" cy=\"207.4933333333333\" r=\"3.6\" />\n    <circle cx=\"660.4050000000001\" cy=\"270.32500000000005\" r=\"3.6\" />\n    <circle cx=\"610.655\" cy=\"386.3666666666666\" r=\"3.6\" />\n    <circle cx=\"610.615\" cy=\"376.68666666666667\" r=\"3.6\" />\n    <circle cx=\"610.615\" cy=\"367.01666666666665\" r=\"3.6\" />\n    <circle cx=\"602.3850000000001\" cy=\"391.1966666666667\" r=\"3.6\" />\n    <circle cx=\"577.5016666666667\" cy=\"405.6783333333333\" r=\"3.6\" />\n    <circle cx=\"618.9633333333334\" cy=\"362.18666666666667\" r=\"3.6\" />\n    <circle cx=\"585.8000000000001\" cy=\"410.5133333333333\" r=\"3.6\" />\n    <circle cx=\"594.1016666666667\" cy=\"396.0133333333333\" r=\"3.6\" />\n    <circle cx=\"569.18\" cy=\"410.54\" r=\"3.6\" />\n    <circle cx=\"594.125\" cy=\"405.6933333333333\" r=\"3.6\" />\n    <circle cx=\"635.4833333333332\" cy=\"284.81666666666666\" r=\"3.6\" />\n    <circle cx=\"643.7983333333333\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"635.5133333333332\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"652.0550000000001\" cy=\"275.16\" r=\"3.6\" />\n    <circle cx=\"635.59\" cy=\"342.82666666666665\" r=\"3.6\" />\n    <circle cx=\"635.5849999999999\" cy=\"333.16333333333336\" r=\"3.6\" />\n    <circle cx=\"627.2383333333333\" cy=\"347.6666666666667\" r=\"3.6\" />\n    <circle cx=\"618.9483333333334\" cy=\"352.51\" r=\"3.6\" />\n    <circle cx=\"826.42\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"892.6899999999999\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"884.4616666666666\" cy=\"139.8133333333333\" r=\"3.6\" />\n    <circle cx=\"901.0300000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"884.43\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"909.3316666666666\" cy=\"67.29333333333334\" r=\"3.6\" />\n    <circle cx=\"901.0750000000002\" cy=\"101.135\" r=\"3.6\" />\n    <circle cx=\"892.7233333333334\" cy=\"125.31333333333332\" r=\"3.6\" />\n    <circle cx=\"892.7283333333334\" cy=\"115.64333333333333\" r=\"3.6\" />\n    <circle cx=\"901.0683333333333\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"876.1383333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"826.3250000000002\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"867.8350000000002\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"834.62\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"809.6999999999999\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"817.995\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"842.9049999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"851.245\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"867.9166666666666\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"876.2599999999999\" cy=\"163.97333333333333\" r=\"3.6\" />\n    <circle cx=\"826.42\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"826.41\" cy=\"231.67499999999998\" r=\"3.6\" />\n    <circle cx=\"834.7566666666667\" cy=\"265.52\" r=\"3.6\" />\n    <circle cx=\"809.7800000000001\" cy=\"192.98000000000002\" r=\"3.6\" />\n    <circle cx=\"826.42\" cy=\"202.6483333333333\" r=\"3.6\" />\n    <circle cx=\"843.0300000000001\" cy=\"251.01166666666666\" r=\"3.6\" />\n    <circle cx=\"801.485\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"818.09\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"760.0400000000001\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"801.4000000000001\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"859.6199999999999\" cy=\"192.98000000000002\" r=\"3.6\" />\n    <circle cx=\"867.9066666666668\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"867.9066666666668\" cy=\"168.80666666666664\" r=\"3.6\" />\n    <circle cx=\"851.335\" cy=\"197.81999999999996\" r=\"3.6\" />\n    <circle cx=\"843.0500000000001\" cy=\"231.65166666666664\" r=\"3.6\" />\n    <circle cx=\"843.04\" cy=\"241.33666666666667\" r=\"3.6\" />\n    <circle cx=\"851.3400000000001\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"528.47\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"593.9216666666666\" cy=\"57.59833333333333\" r=\"3.6\" />\n    <circle cx=\"569.03\" cy=\"52.77333333333333\" r=\"3.6\" />\n    <circle cx=\"577.3216666666667\" cy=\"47.928333333333335\" r=\"3.6\" />\n    <circle cx=\"602.215\" cy=\"62.443333333333335\" r=\"3.6\" />\n    <circle cx=\"585.62\" cy=\"52.76333333333333\" r=\"3.6\" />\n    <circle cx=\"627.1083333333333\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"635.405\" cy=\"62.43333333333334\" r=\"3.6\" />\n    <circle cx=\"618.8149999999999\" cy=\"62.443333333333335\" r=\"3.6\" />\n    <circle cx=\"610.475\" cy=\"57.613333333333344\" r=\"3.6\" />\n    <circle cx=\"528.4599999999999\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"643.7233333333334\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"511.825\" cy=\"125.32000000000001\" r=\"3.6\" />\n    <circle cx=\"560.7233333333332\" cy=\"57.63166666666666\" r=\"3.6\" />\n    <circle cx=\"520.1733333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"528.465\" cy=\"105.95333333333333\" r=\"3.6\" />\n    <circle cx=\"552.3866666666667\" cy=\"62.451666666666675\" r=\"3.6\" />\n    <circle cx=\"536.7516666666667\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"544.9012500000001\" cy=\"67.28375\" r=\"3.6\" />\n    <circle cx=\"718.3949999999999\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"751.5749999999999\" cy=\"33.45666666666667\" r=\"3.6\" />\n    <circle cx=\"743.2433333333333\" cy=\"38.29333333333334\" r=\"3.6\" />\n    <circle cx=\"734.9766666666666\" cy=\"33.45\" r=\"3.6\" />\n    <circle cx=\"759.8733333333333\" cy=\"38.276666666666664\" r=\"3.6\" />\n    <circle cx=\"768.1833333333334\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"784.785\" cy=\"43.12500000000001\" r=\"3.6\" />\n    <circle cx=\"726.6883333333334\" cy=\"38.27833333333333\" r=\"3.6\" />\n    <circle cx=\"776.4983333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"702.10375\" cy=\"43.1075\" r=\"3.6\" />\n    <circle cx=\"676.8683333333332\" cy=\"57.59833333333333\" r=\"3.6\" />\n    <circle cx=\"668.5533333333334\" cy=\"62.43333333333334\" r=\"3.6\" />\n    <circle cx=\"660.295\" cy=\"57.598333333333336\" r=\"3.6\" />\n    <circle cx=\"793.0649999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"685.1616666666667\" cy=\"52.77333333333334\" r=\"3.6\" />\n    <circle cx=\"710.1085714285715\" cy=\"38.55142857142857\" r=\"3.6\" />\n    <circle cx=\"651.9783333333334\" cy=\"62.44\" r=\"3.6\" />\n    <circle cx=\"693.4366666666666\" cy=\"47.94333333333333\" r=\"3.6\" />\n    <circle cx=\"818.09\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"602.405\" cy=\"400.8616666666667\" r=\"3.6\" />\n    <circle cx=\"594.155\" cy=\"415.34666666666664\" r=\"3.6\" />\n    <circle cx=\"610.715\" cy=\"396.02666666666664\" r=\"3.6\" />\n    <circle cx=\"577.5016666666667\" cy=\"415.3483333333333\" r=\"3.6\" />\n    <circle cx=\"544.6385714285715\" cy=\"357.62142857142857\" r=\"3.6\" />\n    <circle cx=\"618.97\" cy=\"381.52333333333337\" r=\"3.6\" />\n    <circle cx=\"560.8516666666666\" cy=\"405.6933333333333\" r=\"3.6\" />\n    <circle cx=\"676.9983333333333\" cy=\"231.64833333333334\" r=\"3.6\" />\n    <circle cx=\"560.82\" cy=\"386.3616666666667\" r=\"3.6\" />\n    <circle cx=\"635.605\" cy=\"352.49666666666667\" r=\"3.6\" />\n    <circle cx=\"668.7366666666666\" cy=\"265.4816666666666\" r=\"3.6\" />\n    <circle cx=\"660.39\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"668.7366666666666\" cy=\"255.80499999999998\" r=\"3.6\" />\n    <circle cx=\"618.97\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"652.0849999999999\" cy=\"284.8466666666667\" r=\"3.6\" />\n    <circle cx=\"643.8149999999999\" cy=\"289.665\" r=\"3.6\" />\n    <circle cx=\"627.2566666666667\" cy=\"357.3433333333333\" r=\"3.6\" />\n    <circle cx=\"544.135\" cy=\"309.01166666666666\" r=\"3.6\" />\n    <circle cx=\"552.5166666666668\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"544.9325\" cy=\"299.33625\" r=\"3.6\" />\n    <circle cx=\"462.05999999999995\" cy=\"222.0033333333333\" r=\"3.6\" />\n    <circle cx=\"462.06\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"453.7966666666667\" cy=\"236.51\" r=\"3.6\" />\n    <circle cx=\"486.94000000000005\" cy=\"149.47166666666666\" r=\"3.6\" />\n    <circle cx=\"453.8066666666667\" cy=\"246.17333333333332\" r=\"3.6\" />\n    <circle cx=\"486.9283333333333\" cy=\"139.79666666666665\" r=\"3.6\" />\n    <circle cx=\"470.39000000000004\" cy=\"197.80499999999998\" r=\"3.6\" />\n    <circle cx=\"478.675\" cy=\"183.30666666666664\" r=\"3.6\" />\n    <circle cx=\"462.05999999999995\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"528.5300000000001\" cy=\"270.33833333333337\" r=\"3.6\" />\n    <circle cx=\"511.9550000000001\" cy=\"270.3683333333334\" r=\"3.6\" />\n    <circle cx=\"520.2616666666667\" cy=\"265.50333333333333\" r=\"3.6\" />\n    <circle cx=\"536.8\" cy=\"275.17\" r=\"3.6\" />\n    <circle cx=\"470.385\" cy=\"265.50333333333333\" r=\"3.6\" />\n    <circle cx=\"462.1116666666667\" cy=\"251.01166666666666\" r=\"3.6\" />\n    <circle cx=\"478.7166666666667\" cy=\"270.33833333333337\" r=\"3.6\" />\n    <circle cx=\"495.34\" cy=\"270.33333333333337\" r=\"3.6\" />\n    <circle cx=\"851.335\" cy=\"304.18666666666667\" r=\"3.6\" />\n    <circle cx=\"876.285\" cy=\"202.64666666666665\" r=\"3.6\" />\n    <circle cx=\"884.5266666666666\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"867.9566666666666\" cy=\"207.50166666666664\" r=\"3.6\" />\n    <circle cx=\"685.285\" cy=\"226.8116666666667\" r=\"3.6\" />\n    <circle cx=\"834.6733333333335\" cy=\"294.51666666666665\" r=\"3.6\" />\n    <circle cx=\"495.25499999999994\" cy=\"134.93833333333333\" r=\"3.6\" />\n    <circle cx=\"892.7433333333333\" cy=\"154.305\" r=\"3.6\" />\n    <circle cx=\"859.69\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"859.69\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"942.535\" cy=\"96.31166666666667\" r=\"3.6\" />\n    <circle cx=\"959.1483333333332\" cy=\"57.623333333333335\" r=\"3.6\" />\n    <circle cx=\"959.1583333333332\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"950.9000000000001\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"967.4650000000001\" cy=\"52.75833333333333\" r=\"3.6\" />\n    <circle cx=\"826.3716666666666\" cy=\"280.01500000000004\" r=\"3.6\" />\n    <circle cx=\"917.7216666666667\" cy=\"110.795\" r=\"3.6\" />\n    <circle cx=\"909.3716666666666\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"934.235\" cy=\"91.47333333333331\" r=\"3.6\" />\n    <circle cx=\"884.5216666666666\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"726.7316666666667\" cy=\"212.31833333333336\" r=\"3.6\" />\n    <circle cx=\"735.0566666666667\" cy=\"217.17999999999998\" r=\"3.6\" />\n    <circle cx=\"718.48\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"751.6650000000001\" cy=\"255.84166666666667\" r=\"3.6\" />\n    <circle cx=\"743.335\" cy=\"231.6766666666667\" r=\"3.6\" />\n    <circle cx=\"693.5933333333332\" cy=\"212.31666666666663\" r=\"3.6\" />\n    <circle cx=\"710.2014285714286\" cy=\"193.25428571428571\" r=\"3.6\" />\n    <circle cx=\"701.8199999999999\" cy=\"197.55285714285714\" r=\"3.6\" />\n    <circle cx=\"784.8850000000001\" cy=\"207.4933333333333\" r=\"3.6\" />\n    <circle cx=\"809.775\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"809.785\" cy=\"212.3216666666667\" r=\"3.6\" />\n    <circle cx=\"801.5\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"768.315\" cy=\"226.83166666666668\" r=\"3.6\" />\n    <circle cx=\"809.8166666666666\" cy=\"231.665\" r=\"3.6\" />\n    <circle cx=\"776.63\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"818.085\" cy=\"275.14666666666665\" r=\"3.6\" />\n    <circle cx=\"776.6083333333332\" cy=\"212.3283333333333\" r=\"3.6\" />\n    <circle cx=\"760.0233333333332\" cy=\"260.6616666666667\" r=\"3.6\" />\n    <circle cx=\"901.07\" cy=\"130.14833333333334\" r=\"3.6\" />\n    <circle cx=\"892.7733333333334\" cy=\"144.655\" r=\"3.6\" />\n    <circle cx=\"901.0616666666666\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"876.2366666666667\" cy=\"173.62666666666667\" r=\"3.6\" />\n    <circle cx=\"859.6300000000001\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"909.3666666666667\" cy=\"115.63333333333334\" r=\"3.6\" />\n    <circle cx=\"867.9266666666666\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"876.2433333333333\" cy=\"192.99166666666667\" r=\"3.6\" />\n    <circle cx=\"876.2083333333334\" cy=\"183.30999999999997\" r=\"3.6\" />\n    <circle cx=\"942.5766666666665\" cy=\"86.61833333333334\" r=\"3.6\" />\n    <circle cx=\"934.245\" cy=\"81.79833333333333\" r=\"3.6\" />\n    <circle cx=\"859.6349999999999\" cy=\"212.32666666666668\" r=\"3.6\" />\n    <circle cx=\"950.8233333333333\" cy=\"72.155\" r=\"3.6\" />\n    <circle cx=\"950.8449999999999\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"934.2199999999999\" cy=\"72.14999999999999\" r=\"3.6\" />\n    <circle cx=\"909.3716666666666\" cy=\"105.95166666666667\" r=\"3.6\" />\n    <circle cx=\"917.62\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"925.9066666666666\" cy=\"67.30499999999999\" r=\"3.6\" />\n    <circle cx=\"768.275\" cy=\"207.48333333333332\" r=\"3.6\" />\n    <circle cx=\"793.15\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"801.495\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"818.09\" cy=\"207.48333333333332\" r=\"3.6\" />\n    <circle cx=\"793.16\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"809.79\" cy=\"202.6483333333333\" r=\"3.6\" />\n    <circle cx=\"784.88\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"768.275\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"942.535\" cy=\"47.945\" r=\"3.6\" />\n    <circle cx=\"776.5933333333332\" cy=\"202.6483333333333\" r=\"3.6\" />\n    <circle cx=\"834.6833333333333\" cy=\"284.8516666666667\" r=\"3.6\" />\n    <circle cx=\"843.005\" cy=\"299.3433333333333\" r=\"3.6\" />\n    <circle cx=\"851.36\" cy=\"255.86499999999998\" r=\"3.6\" />\n    <circle cx=\"851.3800000000001\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"851.375\" cy=\"236.49333333333334\" r=\"3.6\" />\n    <circle cx=\"859.6350000000001\" cy=\"221.98666666666668\" r=\"3.6\" />\n    <circle cx=\"834.6983333333333\" cy=\"275.1666666666667\" r=\"3.6\" />\n    <circle cx=\"818.1100000000001\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"843.0450000000001\" cy=\"289.68333333333334\" r=\"3.6\" />\n    <circle cx=\"693.415\" cy=\"38.26833333333333\" r=\"3.6\" />\n    <circle cx=\"627.1083333333333\" cy=\"57.598333333333336\" r=\"3.6\" />\n    <circle cx=\"602.215\" cy=\"52.77333333333334\" r=\"3.6\" />\n    <circle cx=\"618.8199999999999\" cy=\"52.77\" r=\"3.6\" />\n    <circle cx=\"593.9499999999999\" cy=\"47.913333333333334\" r=\"3.6\" />\n    <circle cx=\"925.9366666666666\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"676.8383333333334\" cy=\"47.91\" r=\"3.6\" />\n    <circle cx=\"643.7233333333334\" cy=\"57.59833333333333\" r=\"3.6\" />\n    <circle cx=\"585.6516666666666\" cy=\"43.076666666666675\" r=\"3.6\" />\n    <circle cx=\"685.1566666666668\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"651.9616666666667\" cy=\"52.76166666666666\" r=\"3.6\" />\n    <circle cx=\"520.1483333333333\" cy=\"110.78333333333335\" r=\"3.6\" />\n    <circle cx=\"536.72\" cy=\"62.440000000000005\" r=\"3.6\" />\n    <circle cx=\"528.4166666666666\" cy=\"67.28333333333333\" r=\"3.6\" />\n    <circle cx=\"511.83\" cy=\"115.63833333333332\" r=\"3.6\" />\n    <circle cx=\"544.8787500000001\" cy=\"57.60125\" r=\"3.6\" />\n    <circle cx=\"560.6833333333333\" cy=\"47.93833333333333\" r=\"3.6\" />\n    <circle cx=\"568.9999999999999\" cy=\"43.089999999999996\" r=\"3.6\" />\n    <circle cx=\"552.3766666666667\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"668.5533333333334\" cy=\"52.76333333333333\" r=\"3.6\" />\n    <circle cx=\"867.8350000000002\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"851.2400000000001\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"503.5233333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"817.995\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"892.6899999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"884.4399999999999\" cy=\"43.116666666666674\" r=\"3.6\" />\n    <circle cx=\"909.3216666666667\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"809.7049999999999\" cy=\"38.26833333333334\" r=\"3.6\" />\n    <circle cx=\"834.6150000000001\" cy=\"43.12500000000001\" r=\"3.6\" />\n    <circle cx=\"726.6483333333332\" cy=\"28.59\" r=\"3.6\" />\n    <circle cx=\"743.2333333333332\" cy=\"28.623333333333335\" r=\"3.6\" />\n    <circle cx=\"718.3849999999999\" cy=\"33.443333333333335\" r=\"3.6\" />\n    <circle cx=\"793.055\" cy=\"38.29333333333334\" r=\"3.6\" />\n    <circle cx=\"701.71\" cy=\"33.15428571428571\" r=\"3.6\" />\n    <circle cx=\"759.8716666666666\" cy=\"28.60166666666667\" r=\"3.6\" />\n    <circle cx=\"776.4883333333333\" cy=\"38.27833333333333\" r=\"3.6\" />\n    <circle cx=\"768.2033333333333\" cy=\"33.425000000000004\" r=\"3.6\" />\n    <circle cx=\"801.48\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"577.4616666666667\" cy=\"367.00666666666666\" r=\"3.6\" />\n    <circle cx=\"569.1166666666667\" cy=\"304.1766666666667\" r=\"3.6\" />\n    <circle cx=\"569.1066666666667\" cy=\"284.83166666666665\" r=\"3.6\" />\n    <circle cx=\"569.1066666666667\" cy=\"294.50166666666667\" r=\"3.6\" />\n    <circle cx=\"560.7666666666668\" cy=\"279.99666666666667\" r=\"3.6\" />\n    <circle cx=\"528.57\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"759.9683333333332\" cy=\"192.98000000000002\" r=\"3.6\" />\n    <circle cx=\"545.035\" cy=\"250.9925\" r=\"3.6\" />\n    <circle cx=\"536.865\" cy=\"246.15666666666667\" r=\"3.6\" />\n    <circle cx=\"552.5133333333334\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"569.1650000000001\" cy=\"352.51000000000005\" r=\"3.6\" />\n    <circle cx=\"569.1550000000001\" cy=\"342.84666666666664\" r=\"3.6\" />\n    <circle cx=\"569.14\" cy=\"313.83\" r=\"3.6\" />\n    <circle cx=\"577.4616666666667\" cy=\"357.33666666666664\" r=\"3.6\" />\n    <circle cx=\"560.81\" cy=\"338.0133333333333\" r=\"3.6\" />\n    <circle cx=\"569.1500000000001\" cy=\"323.50333333333333\" r=\"3.6\" />\n    <circle cx=\"560.81\" cy=\"328.3433333333333\" r=\"3.6\" />\n    <circle cx=\"552.495\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"511.9350000000001\" cy=\"241.33666666666667\" r=\"3.6\" />\n    <circle cx=\"503.585\" cy=\"168.81166666666667\" r=\"3.6\" />\n    <circle cx=\"528.4699999999999\" cy=\"134.97666666666666\" r=\"3.6\" />\n    <circle cx=\"503.605\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"503.59999999999997\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"536.765\" cy=\"130.13\" r=\"3.6\" />\n    <circle cx=\"544.5914285714287\" cy=\"96.56142857142856\" r=\"3.6\" />\n    <circle cx=\"544.9412500000001\" cy=\"105.95750000000001\" r=\"3.6\" />\n    <circle cx=\"544.5828571428572\" cy=\"115.90142857142857\" r=\"3.6\" />\n    <circle cx=\"544.115\" cy=\"125.29666666666667\" r=\"3.6\" />\n    <circle cx=\"495.32666666666665\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"487.04999999999995\" cy=\"246.15666666666667\" r=\"3.6\" />\n    <circle cx=\"487.03\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"487.05\" cy=\"236.48666666666665\" r=\"3.6\" />\n    <circle cx=\"503.615\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"495.36666666666673\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"487.01\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"503.66\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"495.32666666666665\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"627.2083333333334\" cy=\"270.32\" r=\"3.6\" />\n    <circle cx=\"668.6750000000001\" cy=\"207.4483333333333\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"192.97833333333332\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"183.31500000000003\" r=\"3.6\" />\n    <circle cx=\"693.5099999999999\" cy=\"173.64\" r=\"3.6\" />\n    <circle cx=\"685.235\" cy=\"178.47166666666666\" r=\"3.6\" />\n    <circle cx=\"652.0916666666667\" cy=\"236.49166666666667\" r=\"3.6\" />\n    <circle cx=\"660.39\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"652.0916666666666\" cy=\"226.81499999999997\" r=\"3.6\" />\n    <circle cx=\"652.0716666666666\" cy=\"217.14666666666668\" r=\"3.6\" />\n    <circle cx=\"702.1787499999999\" cy=\"168.80625000000003\" r=\"3.6\" />\n    <circle cx=\"743.3250000000002\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"735.065\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"743.335\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"751.68\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"718.4699999999999\" cy=\"168.80666666666667\" r=\"3.6\" />\n    <circle cx=\"726.7716666666666\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"709.8325\" cy=\"163.97250000000003\" r=\"3.6\" />\n    <circle cx=\"643.8783333333332\" cy=\"260.635\" r=\"3.6\" />\n    <circle cx=\"585.76\" cy=\"371.83666666666664\" r=\"3.6\" />\n    <circle cx=\"602.35\" cy=\"352.51500000000004\" r=\"3.6\" />\n    <circle cx=\"602.34\" cy=\"342.84\" r=\"3.6\" />\n    <circle cx=\"594.0616666666667\" cy=\"357.33666666666664\" r=\"3.6\" />\n    <circle cx=\"618.93\" cy=\"333.17333333333335\" r=\"3.6\" />\n    <circle cx=\"610.595\" cy=\"338.0133333333333\" r=\"3.6\" />\n    <circle cx=\"585.78\" cy=\"381.50500000000005\" r=\"3.6\" />\n    <circle cx=\"594.0616666666667\" cy=\"367.00666666666666\" r=\"3.6\" />\n    <circle cx=\"594.0616666666666\" cy=\"376.6766666666667\" r=\"3.6\" />\n    <circle cx=\"618.89\" cy=\"284.83166666666665\" r=\"3.6\" />\n    <circle cx=\"618.93\" cy=\"323.50333333333333\" r=\"3.6\" />\n    <circle cx=\"618.9050000000001\" cy=\"275.17\" r=\"3.6\" />\n    <circle cx=\"618.89\" cy=\"294.50166666666667\" r=\"3.6\" />\n    <circle cx=\"536.785\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"635.515\" cy=\"265.4733333333333\" r=\"3.6\" />\n    <circle cx=\"627.245\" cy=\"318.65833333333336\" r=\"3.6\" />\n    <circle cx=\"618.9\" cy=\"304.1766666666667\" r=\"3.6\" />\n    <circle cx=\"626.8042857142857\" cy=\"308.6142857142857\" r=\"3.6\" />\n    <circle cx=\"520.265\" cy=\"236.49666666666664\" r=\"3.6\" />\n    <circle cx=\"834.695\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"851.3100000000001\" cy=\"159.14666666666668\" r=\"3.6\" />\n    <circle cx=\"842.98\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"851.32\" cy=\"168.8216666666667\" r=\"3.6\" />\n    <circle cx=\"793.14\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"643.8133333333334\" cy=\"212.3033333333333\" r=\"3.6\" />\n    <circle cx=\"826.4\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"876.1383333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"818.07\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"851.32\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"884.4716666666668\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"876.1783333333333\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"552.4399999999999\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"876.1750000000001\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"867.8649999999999\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"867.8649999999999\" cy=\"139.79666666666665\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"154.295\" r=\"3.6\" />\n    <circle cx=\"876.1683333333334\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"809.7700000000001\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"718.4699999999999\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"702.17125\" cy=\"159.13125\" r=\"3.6\" />\n    <circle cx=\"685.235\" cy=\"168.8033333333333\" r=\"3.6\" />\n    <circle cx=\"710.1757142857142\" cy=\"154.58285714285716\" r=\"3.6\" />\n    <circle cx=\"693.5099999999999\" cy=\"163.97333333333333\" r=\"3.6\" />\n    <circle cx=\"660.4\" cy=\"202.63166666666666\" r=\"3.6\" />\n    <circle cx=\"676.94\" cy=\"173.62666666666667\" r=\"3.6\" />\n    <circle cx=\"652.0716666666667\" cy=\"207.48\" r=\"3.6\" />\n    <circle cx=\"668.625\" cy=\"178.45666666666668\" r=\"3.6\" />\n    <circle cx=\"751.665\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"759.9583333333334\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"768.255\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"726.7716666666666\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"751.6700000000001\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"776.5699999999998\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"735.065\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"784.8633333333333\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"743.3250000000002\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"884.4516666666667\" cy=\"72.13166666666667\" r=\"3.6\" />\n    <circle cx=\"867.855\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"676.89\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"660.3166666666667\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"652.0200000000001\" cy=\"81.78\" r=\"3.6\" />\n    <circle cx=\"685.1716666666666\" cy=\"72.10833333333333\" r=\"3.6\" />\n    <circle cx=\"643.7633333333333\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"709.75875\" cy=\"57.613749999999996\" r=\"3.6\" />\n    <circle cx=\"702.1075000000001\" cy=\"62.447500000000005\" r=\"3.6\" />\n    <circle cx=\"693.4366666666666\" cy=\"67.28333333333333\" r=\"3.6\" />\n    <circle cx=\"668.595\" cy=\"81.77\" r=\"3.6\" />\n    <circle cx=\"602.245\" cy=\"81.78833333333334\" r=\"3.6\" />\n    <circle cx=\"593.9416666666667\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"585.64\" cy=\"72.10333333333332\" r=\"3.6\" />\n    <circle cx=\"577.3066666666667\" cy=\"67.26666666666667\" r=\"3.6\" />\n    <circle cx=\"618.8449999999999\" cy=\"81.77666666666666\" r=\"3.6\" />\n    <circle cx=\"627.1483333333333\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"610.495\" cy=\"76.95500000000001\" r=\"3.6\" />\n    <circle cx=\"635.4449999999999\" cy=\"81.77\" r=\"3.6\" />\n    <circle cx=\"718.3949999999999\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"818.015\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"826.3250000000002\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"809.6999999999999\" cy=\"67.28666666666666\" r=\"3.6\" />\n    <circle cx=\"834.63\" cy=\"72.125\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"67.28666666666666\" r=\"3.6\" />\n    <circle cx=\"801.4050000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"842.9049999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"851.2550000000001\" cy=\"72.13666666666667\" r=\"3.6\" />\n    <circle cx=\"743.255\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"751.5900000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"726.6983333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"793.0649999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"759.8833333333332\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"734.9916666666667\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"784.7916666666666\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"776.4983333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"768.1833333333334\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"536.765\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"560.7666666666668\" cy=\"299.33666666666664\" r=\"3.6\" />\n    <circle cx=\"560.7883333333333\" cy=\"309.00500000000005\" r=\"3.6\" />\n    <circle cx=\"560.81\" cy=\"318.67333333333335\" r=\"3.6\" />\n    <circle cx=\"552.495\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"536.865\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"552.465\" cy=\"275.15833333333336\" r=\"3.6\" />\n    <circle cx=\"560.7666666666668\" cy=\"289.6666666666667\" r=\"3.6\" />\n    <circle cx=\"545.035\" cy=\"260.6625\" r=\"3.6\" />\n    <circle cx=\"552.455\" cy=\"284.8333333333333\" r=\"3.6\" />\n    <circle cx=\"552.5\" cy=\"342.8433333333333\" r=\"3.6\" />\n    <circle cx=\"577.4816666666667\" cy=\"386.34666666666664\" r=\"3.6\" />\n    <circle cx=\"560.82\" cy=\"347.68\" r=\"3.6\" />\n    <circle cx=\"577.5016666666667\" cy=\"396.0133333333333\" r=\"3.6\" />\n    <circle cx=\"511.855\" cy=\"134.99666666666667\" r=\"3.6\" />\n    <circle cx=\"577.4616666666667\" cy=\"376.6766666666667\" r=\"3.6\" />\n    <circle cx=\"569.17\" cy=\"371.8516666666667\" r=\"3.6\" />\n    <circle cx=\"560.83\" cy=\"357.34666666666664\" r=\"3.6\" />\n    <circle cx=\"569.1700000000001\" cy=\"362.1816666666667\" r=\"3.6\" />\n    <circle cx=\"470.45\" cy=\"236.49666666666667\" r=\"3.6\" />\n    <circle cx=\"487.01\" cy=\"207.48333333333335\" r=\"3.6\" />\n    <circle cx=\"768.265\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"487.01\" cy=\"197.8133333333333\" r=\"3.6\" />\n    <circle cx=\"478.71\" cy=\"212.31833333333336\" r=\"3.6\" />\n    <circle cx=\"478.71000000000004\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"503.57666666666665\" cy=\"149.48166666666665\" r=\"3.6\" />\n    <circle cx=\"495.3066666666667\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"495.3066666666667\" cy=\"173.64333333333335\" r=\"3.6\" />\n    <circle cx=\"495.36666666666673\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"503.66\" cy=\"255.84166666666667\" r=\"3.6\" />\n    <circle cx=\"528.57\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"585.8\" cy=\"391.17333333333335\" r=\"3.6\" />\n    <circle cx=\"520.275\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"511.9350000000001\" cy=\"251.00666666666663\" r=\"3.6\" />\n    <circle cx=\"478.75333333333333\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"478.7533333333334\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"487.05\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"585.8000000000001\" cy=\"400.8433333333333\" r=\"3.6\" />\n    <circle cx=\"709.8325\" cy=\"173.64\" r=\"3.6\" />\n    <circle cx=\"718.4699999999999\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"726.7716666666666\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"702.1787499999999\" cy=\"178.47375\" r=\"3.6\" />\n    <circle cx=\"594.0816666666667\" cy=\"386.34499999999997\" r=\"3.6\" />\n    <circle cx=\"660.3899999999999\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"693.5099999999999\" cy=\"183.3066666666667\" r=\"3.6\" />\n    <circle cx=\"676.9633333333334\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"685.2399999999999\" cy=\"188.13833333333332\" r=\"3.6\" />\n    <circle cx=\"668.645\" cy=\"217.13333333333333\" r=\"3.6\" />\n    <circle cx=\"759.9783333333334\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"768.275\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"776.5816666666666\" cy=\"192.97833333333335\" r=\"3.6\" />\n    <circle cx=\"759.9783333333334\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"751.685\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"743.3449999999999\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"735.0799999999999\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"751.685\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"735.07\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"660.41\" cy=\"231.63833333333335\" r=\"3.6\" />\n    <circle cx=\"610.615\" cy=\"357.34666666666664\" r=\"3.6\" />\n    <circle cx=\"618.935\" cy=\"342.84666666666664\" r=\"3.6\" />\n    <circle cx=\"627.2283333333334\" cy=\"337.99833333333333\" r=\"3.6\" />\n    <circle cx=\"610.605\" cy=\"347.68\" r=\"3.6\" />\n    <circle cx=\"602.3649999999999\" cy=\"381.51500000000004\" r=\"3.6\" />\n    <circle cx=\"602.355\" cy=\"371.8516666666667\" r=\"3.6\" />\n    <circle cx=\"602.355\" cy=\"362.1816666666667\" r=\"3.6\" />\n    <circle cx=\"627.2366666666666\" cy=\"328.32166666666666\" r=\"3.6\" />\n    <circle cx=\"643.8266666666666\" cy=\"270.31666666666666\" r=\"3.6\" />\n    <circle cx=\"652.0833333333334\" cy=\"265.49\" r=\"3.6\" />\n    <circle cx=\"635.4833333333333\" cy=\"275.1466666666667\" r=\"3.6\" />\n    <circle cx=\"660.4150000000001\" cy=\"241.32833333333335\" r=\"3.6\" />\n    <circle cx=\"627.1850000000001\" cy=\"289.6566666666667\" r=\"3.6\" />\n    <circle cx=\"627.1850000000001\" cy=\"299.3233333333333\" r=\"3.6\" />\n    <circle cx=\"635.555\" cy=\"304.14833333333337\" r=\"3.6\" />\n    <circle cx=\"627.1850000000001\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"495.3166666666666\" cy=\"192.97833333333332\" r=\"3.6\" />\n    <circle cx=\"892.7550000000001\" cy=\"96.28166666666665\" r=\"3.6\" />\n    <circle cx=\"892.7333333333335\" cy=\"105.97333333333331\" r=\"3.6\" />\n    <circle cx=\"901.0099999999999\" cy=\"72.155\" r=\"3.6\" />\n    <circle cx=\"884.4683333333332\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"876.1616666666667\" cy=\"144.66833333333332\" r=\"3.6\" />\n    <circle cx=\"884.4633333333333\" cy=\"120.47166666666668\" r=\"3.6\" />\n    <circle cx=\"901.0300000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"876.1683333333334\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"884.4616666666666\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"892.6899999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"851.245\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"867.9366666666668\" cy=\"159.11833333333334\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"834.62\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"842.9049999999999\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"520.17\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"876.1383333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"867.8350000000002\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"809.7700000000001\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"818.08\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"826.3250000000002\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"834.7066666666666\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"784.8633333333333\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"801.48\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"776.5699999999998\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"834.7116666666666\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"793.14\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"826.41\" cy=\"192.97833333333335\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"851.3249999999999\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"834.7116666666666\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"173.64333333333335\" r=\"3.6\" />\n    <circle cx=\"842.9899999999999\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"843.06\" cy=\"222.0033333333333\" r=\"3.6\" />\n    <circle cx=\"843\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"843.0300000000001\" cy=\"212.35166666666666\" r=\"3.6\" />\n    <circle cx=\"884.43\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"618.8249999999999\" cy=\"72.12\" r=\"3.6\" />\n    <circle cx=\"627.1283333333333\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"610.475\" cy=\"67.28333333333333\" r=\"3.6\" />\n    <circle cx=\"593.9216666666666\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"602.225\" cy=\"72.10666666666667\" r=\"3.6\" />\n    <circle cx=\"635.425\" cy=\"72.10333333333332\" r=\"3.6\" />\n    <circle cx=\"651.9983333333333\" cy=\"72.11\" r=\"3.6\" />\n    <circle cx=\"660.295\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"643.7433333333333\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"536.7683333333333\" cy=\"110.79333333333331\" r=\"3.6\" />\n    <circle cx=\"668.575\" cy=\"72.10499999999999\" r=\"3.6\" />\n    <circle cx=\"784.8683333333333\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"536.765\" cy=\"101.11833333333334\" r=\"3.6\" />\n    <circle cx=\"585.62\" cy=\"62.43333333333334\" r=\"3.6\" />\n    <circle cx=\"528.465\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"577.3166666666666\" cy=\"57.60166666666667\" r=\"3.6\" />\n    <circle cx=\"817.995\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"544.5485714285713\" cy=\"77.24285714285715\" r=\"3.6\" />\n    <circle cx=\"552.4083333333334\" cy=\"72.11\" r=\"3.6\" />\n    <circle cx=\"676.8683333333332\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"768.1833333333334\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"751.585\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"759.8833333333332\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"784.7916666666666\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"793.0649999999999\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"809.6999999999999\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"801.4050000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"776.4983333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"743.255\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"702.1075000000001\" cy=\"52.7775\" r=\"3.6\" />\n    <circle cx=\"685.1616666666667\" cy=\"62.443333333333335\" r=\"3.6\" />\n    <circle cx=\"709.75875\" cy=\"47.94375\" r=\"3.6\" />\n    <circle cx=\"693.4366666666666\" cy=\"57.613333333333344\" r=\"3.6\" />\n    <circle cx=\"718.3949999999999\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"734.9866666666667\" cy=\"43.12500000000001\" r=\"3.6\" />\n    <circle cx=\"726.6983333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"876.1850000000001\" cy=\"289.65\" r=\"3.6\" />\n    <circle cx=\"876.1550000000001\" cy=\"279.99833333333333\" r=\"3.6\" />\n    <circle cx=\"884.5033333333334\" cy=\"275.16333333333336\" r=\"3.6\" />\n    <circle cx=\"884.4983333333333\" cy=\"304.2\" r=\"3.6\" />\n    <circle cx=\"867.9249999999998\" cy=\"304.19166666666666\" r=\"3.6\" />\n    <circle cx=\"884.5283333333333\" cy=\"284.84333333333336\" r=\"3.6\" />\n    <circle cx=\"867.895\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"884.5283333333333\" cy=\"294.5133333333334\" r=\"3.6\" />\n    <circle cx=\"876.215\" cy=\"299.3383333333333\" r=\"3.6\" />\n    <circle cx=\"859.6583333333333\" cy=\"318.6666666666667\" r=\"3.6\" />\n    <circle cx=\"868.0050000000001\" cy=\"323.51166666666666\" r=\"3.6\" />\n    <circle cx=\"851.3116666666666\" cy=\"323.52666666666664\" r=\"3.6\" />\n    <circle cx=\"892.8250000000002\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"892.8249999999999\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"892.805\" cy=\"231.65833333333333\" r=\"3.6\" />\n    <circle cx=\"909.4733333333334\" cy=\"251\" r=\"3.6\" />\n    <circle cx=\"901.1066666666666\" cy=\"246.16833333333332\" r=\"3.6\" />\n    <circle cx=\"901.1366666666667\" cy=\"236.51500000000001\" r=\"3.6\" />\n    <circle cx=\"892.8650000000001\" cy=\"260.6766666666667\" r=\"3.6\" />\n    <circle cx=\"901.0566666666667\" cy=\"294.52000000000004\" r=\"3.6\" />\n    <circle cx=\"901.0633333333334\" cy=\"304.18666666666667\" r=\"3.6\" />\n    <circle cx=\"909.41\" cy=\"289.66333333333336\" r=\"3.6\" />\n    <circle cx=\"892.8533333333334\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"925.9233333333333\" cy=\"134.97666666666666\" r=\"3.6\" />\n    <circle cx=\"934.2800000000001\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"925.9283333333333\" cy=\"125.28666666666665\" r=\"3.6\" />\n    <circle cx=\"917.7133333333335\" cy=\"168.81666666666666\" r=\"3.6\" />\n    <circle cx=\"909.39\" cy=\"173.645\" r=\"3.6\" />\n    <circle cx=\"925.9933333333335\" cy=\"163.96833333333333\" r=\"3.6\" />\n    <circle cx=\"934.2449999999999\" cy=\"149.48333333333332\" r=\"3.6\" />\n    <circle cx=\"934.305\" cy=\"159.14166666666668\" r=\"3.6\" />\n    <circle cx=\"917.7950000000001\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"917.7366666666667\" cy=\"304.17333333333335\" r=\"3.6\" />\n    <circle cx=\"909.4350000000001\" cy=\"328.34999999999997\" r=\"3.6\" />\n    <circle cx=\"917.79\" cy=\"323.5\" r=\"3.6\" />\n    <circle cx=\"934.2900000000001\" cy=\"294.51666666666665\" r=\"3.6\" />\n    <circle cx=\"942.685\" cy=\"454.07166666666666\" r=\"3.6\" />\n    <circle cx=\"950.9983333333333\" cy=\"449.2033333333333\" r=\"3.6\" />\n    <circle cx=\"967.5749999999999\" cy=\"323.52833333333336\" r=\"3.6\" />\n    <circle cx=\"959.2516666666667\" cy=\"309\" r=\"3.6\" />\n    <circle cx=\"992.5649999999999\" cy=\"328.34999999999997\" r=\"3.6\" />\n    <circle cx=\"976.3714285714285\" cy=\"318.94714285714286\" r=\"3.6\" />\n    <circle cx=\"983.7371428571429\" cy=\"323.2271428571429\" r=\"3.6\" />\n    <circle cx=\"967.585\" cy=\"313.82166666666666\" r=\"3.6\" />\n    <circle cx=\"959.2433333333333\" cy=\"318.67333333333335\" r=\"3.6\" />\n    <circle cx=\"1000.805\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"951.025\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"934.41\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"917.8000000000001\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"942.685\" cy=\"415.38000000000005\" r=\"3.6\" />\n    <circle cx=\"942.6850000000001\" cy=\"405.71333333333337\" r=\"3.6\" />\n    <circle cx=\"909.4816666666666\" cy=\"386.3583333333333\" r=\"3.6\" />\n    <circle cx=\"926.1166666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"892.85\" cy=\"386.375\" r=\"3.6\" />\n    <circle cx=\"909.46\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"884.6\" cy=\"391.2083333333333\" r=\"3.6\" />\n    <circle cx=\"892.8699999999999\" cy=\"396.04333333333335\" r=\"3.6\" />\n    <circle cx=\"884.61\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"901.1999999999999\" cy=\"391.19666666666666\" r=\"3.6\" />\n    <circle cx=\"901.1783333333333\" cy=\"381.53999999999996\" r=\"3.6\" />\n    <circle cx=\"959.2783333333333\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"967.5749999999999\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"950.985\" cy=\"371.8633333333334\" r=\"3.6\" />\n    <circle cx=\"942.6750000000001\" cy=\"357.34833333333336\" r=\"3.6\" />\n    <circle cx=\"975.9249999999998\" cy=\"367.01666666666665\" r=\"3.6\" />\n    <circle cx=\"942.69\" cy=\"347.6933333333333\" r=\"3.6\" />\n    <circle cx=\"967.6150000000001\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"976.3914285714287\" cy=\"376.96000000000004\" r=\"3.6\" />\n    <circle cx=\"959.3183333333333\" cy=\"415.3666666666666\" r=\"3.6\" />\n    <circle cx=\"959.3183333333335\" cy=\"405.69666666666666\" r=\"3.6\" />\n    <circle cx=\"967.6149999999999\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"976.4171428571428\" cy=\"386.62857142857143\" r=\"3.6\" />\n    <circle cx=\"884.5916666666666\" cy=\"420.23499999999996\" r=\"3.6\" />\n    <circle cx=\"959.3000000000001\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"867.9949999999999\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"967.5949999999999\" cy=\"381.52500000000003\" r=\"3.6\" />\n    <circle cx=\"951.015\" cy=\"391.19666666666666\" r=\"3.6\" />\n    <circle cx=\"942.665\" cy=\"386.375\" r=\"3.6\" />\n    <circle cx=\"876.3183333333333\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"967.5949999999999\" cy=\"342.84666666666664\" r=\"3.6\" />\n    <circle cx=\"917.7600000000001\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"934.3650000000001\" cy=\"352.5333333333333\" r=\"3.6\" />\n    <circle cx=\"934.38\" cy=\"381.52833333333325\" r=\"3.6\" />\n    <circle cx=\"959.3133333333334\" cy=\"434.715\" r=\"3.6\" />\n    <circle cx=\"868.025\" cy=\"420.21333333333337\" r=\"3.6\" />\n    <circle cx=\"942.6750000000001\" cy=\"338.02000000000004\" r=\"3.6\" />\n    <circle cx=\"942.695\" cy=\"434.7383333333334\" r=\"3.6\" />\n    <circle cx=\"934.3699999999999\" cy=\"371.8633333333334\" r=\"3.6\" />\n    <circle cx=\"942.6449999999999\" cy=\"376.7033333333333\" r=\"3.6\" />\n    <circle cx=\"950.995\" cy=\"381.53999999999996\" r=\"3.6\" />\n    <circle cx=\"926.0766666666667\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"959.3183333333333\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"934.3699999999999\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"917.7800000000001\" cy=\"381.52500000000003\" r=\"3.6\" />\n    <circle cx=\"951.025\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"926.0766666666667\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"926.0966666666667\" cy=\"386.3583333333333\" r=\"3.6\" />\n    <circle cx=\"934.4\" cy=\"391.2083333333333\" r=\"3.6\" />\n    <circle cx=\"942.6850000000001\" cy=\"396.04333333333335\" r=\"3.6\" />\n    <circle cx=\"942.6449999999999\" cy=\"367.0333333333333\" r=\"3.6\" />\n    <circle cx=\"917.75\" cy=\"352.5083333333334\" r=\"3.6\" />\n    <circle cx=\"901.1383333333333\" cy=\"362.17833333333334\" r=\"3.6\" />\n    <circle cx=\"975.9249999999998\" cy=\"357.34666666666664\" r=\"3.6\" />\n    <circle cx=\"892.82\" cy=\"367.02833333333336\" r=\"3.6\" />\n    <circle cx=\"867.9649999999998\" cy=\"381.53000000000003\" r=\"3.6\" />\n    <circle cx=\"876.2466666666666\" cy=\"376.67\" r=\"3.6\" />\n    <circle cx=\"884.5466666666667\" cy=\"371.8500000000001\" r=\"3.6\" />\n    <circle cx=\"926.0416666666666\" cy=\"347.66833333333335\" r=\"3.6\" />\n    <circle cx=\"967.585\" cy=\"352.49666666666667\" r=\"3.6\" />\n    <circle cx=\"959.2783333333333\" cy=\"367.01833333333326\" r=\"3.6\" />\n    <circle cx=\"967.5650000000002\" cy=\"362.17833333333334\" r=\"3.6\" />\n    <circle cx=\"950.9899999999999\" cy=\"362.195\" r=\"3.6\" />\n    <circle cx=\"934.3400000000001\" cy=\"342.84833333333336\" r=\"3.6\" />\n    <circle cx=\"909.4499999999999\" cy=\"357.3433333333334\" r=\"3.6\" />\n    <circle cx=\"976.4357142857143\" cy=\"415.09\" r=\"3.6\" />\n    <circle cx=\"967.6650000000001\" cy=\"429.8666666666666\" r=\"3.6\" />\n    <circle cx=\"951.0183333333333\" cy=\"429.8833333333334\" r=\"3.6\" />\n    <circle cx=\"983.4525\" cy=\"400.86\" r=\"3.6\" />\n    <circle cx=\"934.3666666666667\" cy=\"429.88166666666666\" r=\"3.6\" />\n    <circle cx=\"983.4525000000001\" cy=\"410.52750000000003\" r=\"3.6\" />\n    <circle cx=\"926.0866666666666\" cy=\"415.38499999999993\" r=\"3.6\" />\n    <circle cx=\"892.9016666666666\" cy=\"415.3983333333333\" r=\"3.6\" />\n    <circle cx=\"901.2199999999999\" cy=\"410.5483333333334\" r=\"3.6\" />\n    <circle cx=\"876.3183333333333\" cy=\"415.3666666666666\" r=\"3.6\" />\n    <circle cx=\"909.5016666666667\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"917.79\" cy=\"410.5316666666667\" r=\"3.6\" />\n    <circle cx=\"967.6416666666668\" cy=\"420.215\" r=\"3.6\" />\n    <circle cx=\"876.3183333333333\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"909.5016666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"884.61\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"867.995\" cy=\"410.5266666666667\" r=\"3.6\" />\n    <circle cx=\"892.8699999999999\" cy=\"405.71333333333337\" r=\"3.6\" />\n    <circle cx=\"901.21\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"867.9949999999999\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"909.46\" cy=\"367.01833333333326\" r=\"3.6\" />\n    <circle cx=\"876.2983333333333\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"917.7600000000001\" cy=\"362.18333333333334\" r=\"3.6\" />\n    <circle cx=\"901.1683333333334\" cy=\"371.8633333333334\" r=\"3.6\" />\n    <circle cx=\"884.58\" cy=\"381.52833333333325\" r=\"3.6\" />\n    <circle cx=\"892.83\" cy=\"376.7033333333333\" r=\"3.6\" />\n    <circle cx=\"959.3149999999999\" cy=\"425.03666666666663\" r=\"3.6\" />\n    <circle cx=\"967.6149999999999\" cy=\"410.52666666666664\" r=\"3.6\" />\n    <circle cx=\"926.0766666666667\" cy=\"357.3500000000001\" r=\"3.6\" />\n    <circle cx=\"976.785\" cy=\"405.69375\" r=\"3.6\" />\n    <circle cx=\"983.7742857142857\" cy=\"381.2442857142857\" r=\"3.6\" />\n    <circle cx=\"976.7850000000001\" cy=\"396.02625\" r=\"3.6\" />\n    <circle cx=\"983.4525000000001\" cy=\"391.19250000000005\" r=\"3.6\" />\n    <circle cx=\"917.8000000000001\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"934.41\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"926.1166666666667\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"934.39\" cy=\"420.22333333333336\" r=\"3.6\" />\n    <circle cx=\"951.0216666666666\" cy=\"420.21000000000004\" r=\"3.6\" />\n    <circle cx=\"942.68\" cy=\"425.0466666666667\" r=\"3.6\" />\n    <circle cx=\"1017.485\" cy=\"323.49333333333334\" r=\"3.6\" />\n    <circle cx=\"1009.2283333333334\" cy=\"463.70166666666665\" r=\"3.6\" />\n    <circle cx=\"1000.8916666666665\" cy=\"468.5466666666667\" r=\"3.6\" />\n    <circle cx=\"1017.525\" cy=\"458.8616666666667\" r=\"3.6\" />\n    <circle cx=\"1025.8149999999998\" cy=\"454.00666666666666\" r=\"3.6\" />\n    <circle cx=\"1034.0249999999999\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"1034.0449999999998\" cy=\"439.5416666666667\" r=\"3.6\" />\n    <circle cx=\"1042.4\" cy=\"434.6983333333333\" r=\"3.6\" />\n    <circle cx=\"1042.4\" cy=\"425.0333333333333\" r=\"3.6\" />\n    <circle cx=\"1075.54\" cy=\"357.3333333333333\" r=\"3.6\" />\n</svg>";

},{}],44:[function(require,module,exports){
module.exports = "\n/* map styling */\n\n.map-dialog-description {\n    color: #ffc107;\n    height: 100px;\n    width: 200px;\n    margin: 0;\n    background-color: rgba(38, 41, 43, 0.66);\n    border-radius: 3px;\n    display: block;\n    padding: 8px;\n    opacity: 0;\n    will-change: opacity;\n    transition: 0.3s opacity;\n    text-align: center;\n    pointer-events: none;\n    position: relative;\n    margin-left: -100px;\n    left: 50%;\n    top: 100px;\n    z-index: 100;\n}\n\n@media (max-height: 800px) {\n    .map-dialog-description {\n        top: 40px;\n    }\n}\n\n.map-dialog {\n    width: 100%;\n    /* padding-bottom: 32px; */\n    text-align: center;\n    /* height: 64px; */\n    pointer-events: none;\n}\n\n.map-dialog-description img {\n    width: 24px;\n    display: inline-block;\n}\n\n#map svg {\n\n    margin: auto;\n    opacity: 1;\n    transition: 1s opacity;\n\n    /* we have the map as background image such that we can display:none the hexagons\n    in the svg which greatly improves performance on firefox */\n    background-image: url(public/assets/map/map.svg);\n}\n\n\n#map svg.hide-circles circle {\n    fill: #26292b;\n}\n\n.peer-own {\n    display: block !important;\n    fill: white !important;\n    -webkit-animation: connected 1800ms ease 5;\n    animation: connected 1800ms ease 8;\n}\n\n.peer-connected-terminal {\n    display: block !important;\n    fill: #fec02c !important;\n    -webkit-animation: connected 1800ms ease 10;\n    animation: connected 1800ms ease 3;\n}\n\n.peer-connected-browser {\n    display: block !important;\n    fill: #12428c !important;\n    -webkit-animation: connected 1800ms ease 10;\n    animation: connected 1800ms ease 3;\n}\n\n.peer-own,\n.peer-connected-terminal,\n.peer-connected-browser {\n    will-change: opacity;\n}\n\n\n.link {\n    stroke: #dedede;\n    stroke-width: 1;\n    stroke-dasharray: 5 5;\n    opacity: 0.5;\n}\n\n\n@media  screen and  (max-width: 480px) {\n    #map svg{\n        box-sizing: border-box;\n        transform: scale(1.15);\n    }\n}\n\n@media   screen and  (max-width: 800px) {\n\n    /* disable map animations when map is in background */\n    .peer-own,  .peer-connected-browser, .peer-connected-terminal {\n        -webkit-animation: none;\n        animation: none;\n        will-change: initial;\n    }\n\n    #map svg{\n        box-sizing: border-box;\n        transform: scale(1.05);\n    }\n\n}\n\n\n/* Large Screen */\n\n@media screen and (min-width: 1080px) {\n    #map svg {\n        box-sizing: border-box;\n        transform: scale(0.9);\n    }\n}\n\n@media screen and (min-width: 1400px) {\n    #map svg {\n        box-sizing: border-box;\n        transform: scale(0.8);\n    }\n}\n";

},{}],45:[function(require,module,exports){
"use strict";

},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wallet = function Wallet() {
  _classCallCheck(this, Wallet);
};

exports.default = new Wallet();

},{}]},{},[32]);

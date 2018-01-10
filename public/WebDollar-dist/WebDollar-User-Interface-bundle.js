(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/fn/regexp/escape":3,"core-js/shim":326,"regenerator-runtime/runtime":2}],2:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;

},{"../../modules/_core":24,"../../modules/core.regexp.escape":129}],4:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],5:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":19}],6:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":43,"./_wks":127}],7:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],8:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":52}],9:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":112,"./_to-length":116,"./_to-object":117}],10:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":112,"./_to-length":116,"./_to-object":117}],11:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":40}],12:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":112,"./_to-iobject":115,"./_to-length":116}],13:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":16,"./_ctx":26,"./_iobject":48,"./_to-length":116,"./_to-object":117}],14:[function(require,module,exports){
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":4,"./_iobject":48,"./_to-length":116,"./_to-object":117}],15:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":50,"./_is-object":52,"./_wks":127}],16:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":15}],17:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":4,"./_invoke":47,"./_is-object":52}],18:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":19,"./_wks":127}],19:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],20:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":7,"./_ctx":26,"./_descriptors":30,"./_for-of":40,"./_iter-define":56,"./_iter-step":58,"./_meta":66,"./_object-create":71,"./_object-dp":72,"./_redefine-all":91,"./_set-species":98,"./_validate-collection":124}],21:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":11,"./_classof":18}],22:[function(require,module,exports){
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":7,"./_an-object":8,"./_array-methods":13,"./_for-of":40,"./_has":42,"./_is-object":52,"./_meta":66,"./_redefine-all":91,"./_validate-collection":124}],23:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":7,"./_export":34,"./_fails":36,"./_for-of":40,"./_global":41,"./_inherit-if-required":46,"./_is-object":52,"./_iter-detect":57,"./_meta":66,"./_redefine":92,"./_redefine-all":91,"./_set-to-string-tag":99}],24:[function(require,module,exports){
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],25:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":72,"./_property-desc":90}],26:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":4}],27:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = require('./_fails');
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

},{"./_fails":36}],28:[function(require,module,exports){
'use strict';
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":8,"./_to-primitive":118}],29:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],30:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":36}],31:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":41,"./_is-object":52}],32:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],33:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":78,"./_object-keys":81,"./_object-pie":82}],34:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":24,"./_ctx":26,"./_global":41,"./_hide":43,"./_redefine":92}],35:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":127}],36:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],37:[function(require,module,exports){
'use strict';
var hide = require('./_hide');
var redefine = require('./_redefine');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":29,"./_fails":36,"./_hide":43,"./_redefine":92,"./_wks":127}],38:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":8}],39:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = require('./_is-array');
var isObject = require('./_is-object');
var toLength = require('./_to-length');
var ctx = require('./_ctx');
var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

},{"./_ctx":26,"./_is-array":50,"./_is-object":52,"./_to-length":116,"./_wks":127}],40:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":8,"./_ctx":26,"./_is-array-iter":49,"./_iter-call":54,"./_to-length":116,"./core.get-iterator-method":128}],41:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],42:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],43:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":30,"./_object-dp":72,"./_property-desc":90}],44:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":41}],45:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":30,"./_dom-create":31,"./_fails":36}],46:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":52,"./_set-proto":97}],47:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],48:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":19}],49:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":59,"./_wks":127}],50:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":19}],51:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":52}],52:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],53:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":19,"./_is-object":52,"./_wks":127}],54:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":8}],55:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":43,"./_object-create":71,"./_property-desc":90,"./_set-to-string-tag":99,"./_wks":127}],56:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":34,"./_has":42,"./_hide":43,"./_iter-create":55,"./_iterators":59,"./_library":60,"./_object-gpo":79,"./_redefine":92,"./_set-to-string-tag":99,"./_wks":127}],57:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":127}],58:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],59:[function(require,module,exports){
module.exports = {};

},{}],60:[function(require,module,exports){
module.exports = false;

},{}],61:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],62:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":65}],63:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],64:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};

},{}],65:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],66:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":36,"./_has":42,"./_is-object":52,"./_object-dp":72,"./_uid":122}],67:[function(require,module,exports){
var Map = require('./es6.map');
var $export = require('./_export');
var shared = require('./_shared')('metadata');
var store = shared.store || (shared.store = new (require('./es6.weak-map'))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

},{"./_export":34,"./_shared":101,"./es6.map":159,"./es6.weak-map":265}],68:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":19,"./_global":41,"./_task":111}],69:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":4}],70:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":36,"./_iobject":48,"./_object-gops":78,"./_object-keys":81,"./_object-pie":82,"./_to-object":117}],71:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":8,"./_dom-create":31,"./_enum-bug-keys":32,"./_html":44,"./_object-dps":73,"./_shared-key":100}],72:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":8,"./_descriptors":30,"./_ie8-dom-define":45,"./_to-primitive":118}],73:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":8,"./_descriptors":30,"./_object-dp":72,"./_object-keys":81}],74:[function(require,module,exports){
'use strict';
// Forced replacement prototype accessors methods
module.exports = require('./_library') || !require('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete require('./_global')[K];
});

},{"./_fails":36,"./_global":41,"./_library":60}],75:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":30,"./_has":42,"./_ie8-dom-define":45,"./_object-pie":82,"./_property-desc":90,"./_to-iobject":115,"./_to-primitive":118}],76:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":77,"./_to-iobject":115}],77:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":32,"./_object-keys-internal":80}],78:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],79:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":42,"./_shared-key":100,"./_to-object":117}],80:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":12,"./_has":42,"./_shared-key":100,"./_to-iobject":115}],81:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":32,"./_object-keys-internal":80}],82:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],83:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":24,"./_export":34,"./_fails":36}],84:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":81,"./_object-pie":82,"./_to-iobject":115}],85:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":8,"./_global":41,"./_object-gopn":77,"./_object-gops":78}],86:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat;
var $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":41,"./_string-trim":109,"./_string-ws":110}],87:[function(require,module,exports){
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":41,"./_string-trim":109,"./_string-ws":110}],88:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],89:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":8,"./_is-object":52,"./_new-promise-capability":69}],90:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],91:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":92}],92:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":24,"./_global":41,"./_has":42,"./_hide":43,"./_uid":122}],93:[function(require,module,exports){
module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

},{}],94:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],95:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":4,"./_ctx":26,"./_export":34,"./_for-of":40}],96:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":34}],97:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":8,"./_ctx":26,"./_is-object":52,"./_object-gopd":75}],98:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":30,"./_global":41,"./_object-dp":72,"./_wks":127}],99:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":42,"./_object-dp":72,"./_wks":127}],100:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":101,"./_uid":122}],101:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":41}],102:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":4,"./_an-object":8,"./_wks":127}],103:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":36}],104:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":29,"./_to-integer":114}],105:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":29,"./_is-regexp":53}],106:[function(require,module,exports){
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":29,"./_export":34,"./_fails":36}],107:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":29,"./_string-repeat":108,"./_to-length":116}],108:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":29,"./_to-integer":114}],109:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":29,"./_export":34,"./_fails":36,"./_string-ws":110}],110:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],111:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":19,"./_ctx":26,"./_dom-create":31,"./_global":41,"./_html":44,"./_invoke":47}],112:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":114}],113:[function(require,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":114,"./_to-length":116}],114:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],115:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":29,"./_iobject":48}],116:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":114}],117:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":29}],118:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":52}],119:[function(require,module,exports){
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":7,"./_array-copy-within":9,"./_array-fill":10,"./_array-includes":12,"./_array-methods":13,"./_classof":18,"./_ctx":26,"./_descriptors":30,"./_export":34,"./_fails":36,"./_global":41,"./_has":42,"./_hide":43,"./_is-array-iter":49,"./_is-object":52,"./_iter-detect":57,"./_iterators":59,"./_library":60,"./_object-create":71,"./_object-dp":72,"./_object-gopd":75,"./_object-gopn":77,"./_object-gpo":79,"./_property-desc":90,"./_redefine-all":91,"./_set-species":98,"./_species-constructor":102,"./_to-absolute-index":112,"./_to-index":113,"./_to-integer":114,"./_to-length":116,"./_to-object":117,"./_to-primitive":118,"./_typed":121,"./_typed-buffer":120,"./_uid":122,"./_wks":127,"./core.get-iterator-method":128,"./es6.array.iterator":140}],120:[function(require,module,exports){
'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":7,"./_array-fill":10,"./_descriptors":30,"./_fails":36,"./_global":41,"./_hide":43,"./_library":60,"./_object-dp":72,"./_object-gopn":77,"./_redefine-all":91,"./_set-to-string-tag":99,"./_to-index":113,"./_to-integer":114,"./_to-length":116,"./_typed":121}],121:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":41,"./_hide":43,"./_uid":122}],122:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],123:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":41}],124:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":52}],125:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":24,"./_global":41,"./_library":60,"./_object-dp":72,"./_wks-ext":126}],126:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":127}],127:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":41,"./_shared":101,"./_uid":122}],128:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":18,"./_core":24,"./_iterators":59,"./_wks":127}],129:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export');
var $re = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });

},{"./_export":34,"./_replacer":93}],130:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":6,"./_array-copy-within":9,"./_export":34}],131:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":13,"./_export":34,"./_strict-method":103}],132:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":6,"./_array-fill":10,"./_export":34}],133:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":13,"./_export":34,"./_strict-method":103}],134:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":6,"./_array-methods":13,"./_export":34}],135:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":6,"./_array-methods":13,"./_export":34}],136:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":13,"./_export":34,"./_strict-method":103}],137:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":25,"./_ctx":26,"./_export":34,"./_is-array-iter":49,"./_iter-call":54,"./_iter-detect":57,"./_to-length":116,"./_to-object":117,"./core.get-iterator-method":128}],138:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":12,"./_export":34,"./_strict-method":103}],139:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":34,"./_is-array":50}],140:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":6,"./_iter-define":56,"./_iter-step":58,"./_iterators":59,"./_to-iobject":115}],141:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":34,"./_iobject":48,"./_strict-method":103,"./_to-iobject":115}],142:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

},{"./_export":34,"./_strict-method":103,"./_to-integer":114,"./_to-iobject":115,"./_to-length":116}],143:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":13,"./_export":34,"./_strict-method":103}],144:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":25,"./_export":34,"./_fails":36}],145:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_array-reduce":14,"./_export":34,"./_strict-method":103}],146:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":14,"./_export":34,"./_strict-method":103}],147:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var html = require('./_html');
var cof = require('./_cof');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

},{"./_cof":19,"./_export":34,"./_fails":36,"./_html":44,"./_to-absolute-index":112,"./_to-length":116}],148:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":13,"./_export":34,"./_strict-method":103}],149:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":4,"./_export":34,"./_fails":36,"./_strict-method":103,"./_to-object":117}],150:[function(require,module,exports){
require('./_set-species')('Array');

},{"./_set-species":98}],151:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

},{"./_export":34}],152:[function(require,module,exports){
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export');
var toISOString = require('./_date-to-iso-string');

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

},{"./_date-to-iso-string":27,"./_export":34}],153:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":34,"./_fails":36,"./_to-object":117,"./_to-primitive":118}],154:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));

},{"./_date-to-primitive":28,"./_hide":43,"./_wks":127}],155:[function(require,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":92}],156:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":17,"./_export":34}],157:[function(require,module,exports){
'use strict';
var isObject = require('./_is-object');
var getPrototypeOf = require('./_object-gpo');
var HAS_INSTANCE = require('./_wks')('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });

},{"./_is-object":52,"./_object-dp":72,"./_object-gpo":79,"./_wks":127}],158:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":30,"./_object-dp":72}],159:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":23,"./_collection-strong":20,"./_validate-collection":124}],160:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":34,"./_math-log1p":63}],161:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":34}],162:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":34}],163:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":34,"./_math-sign":65}],164:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":34}],165:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":34}],166:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":34,"./_math-expm1":61}],167:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":34,"./_math-fround":62}],168:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":34}],169:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":34,"./_fails":36}],170:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":34}],171:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":34,"./_math-log1p":63}],172:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":34}],173:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":34,"./_math-sign":65}],174:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":34,"./_fails":36,"./_math-expm1":61}],175:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":34,"./_math-expm1":61}],176:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":34}],177:[function(require,module,exports){
'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":19,"./_descriptors":30,"./_fails":36,"./_global":41,"./_has":42,"./_inherit-if-required":46,"./_object-create":71,"./_object-dp":72,"./_object-gopd":75,"./_object-gopn":77,"./_redefine":92,"./_string-trim":109,"./_to-primitive":118}],178:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":34}],179:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":34,"./_global":41}],180:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":34,"./_is-integer":51}],181:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":34}],182:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":34,"./_is-integer":51}],183:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":34}],184:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":34}],185:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":34,"./_parse-float":86}],186:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":34,"./_parse-int":87}],187:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toInteger = require('./_to-integer');
var aNumberValue = require('./_a-number-value');
var repeat = require('./_string-repeat');
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"./_a-number-value":5,"./_export":34,"./_fails":36,"./_string-repeat":108,"./_to-integer":114}],188:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $fails = require('./_fails');
var aNumberValue = require('./_a-number-value');
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_a-number-value":5,"./_export":34,"./_fails":36}],189:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":34,"./_object-assign":70}],190:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":34,"./_object-create":71}],191:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });

},{"./_descriptors":30,"./_export":34,"./_object-dps":73}],192:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":30,"./_export":34,"./_object-dp":72}],193:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":52,"./_meta":66,"./_object-sap":83}],194:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":75,"./_object-sap":83,"./_to-iobject":115}],195:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":76,"./_object-sap":83}],196:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":79,"./_object-sap":83,"./_to-object":117}],197:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":52,"./_object-sap":83}],198:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":52,"./_object-sap":83}],199:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":52,"./_object-sap":83}],200:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":34,"./_same-value":94}],201:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":81,"./_object-sap":83,"./_to-object":117}],202:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":52,"./_meta":66,"./_object-sap":83}],203:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":52,"./_meta":66,"./_object-sap":83}],204:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":34,"./_set-proto":97}],205:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":18,"./_redefine":92,"./_wks":127}],206:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":34,"./_parse-float":86}],207:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":34,"./_parse-int":87}],208:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":4,"./_an-instance":7,"./_classof":18,"./_core":24,"./_ctx":26,"./_export":34,"./_for-of":40,"./_global":41,"./_is-object":52,"./_iter-detect":57,"./_library":60,"./_microtask":68,"./_new-promise-capability":69,"./_perform":88,"./_promise-resolve":89,"./_redefine-all":91,"./_set-species":98,"./_set-to-string-tag":99,"./_species-constructor":102,"./_task":111,"./_wks":127}],209:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":4,"./_an-object":8,"./_export":34,"./_fails":36,"./_global":41}],210:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":4,"./_an-object":8,"./_bind":17,"./_export":34,"./_fails":36,"./_global":41,"./_is-object":52,"./_object-create":71}],211:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":8,"./_export":34,"./_fails":36,"./_object-dp":72,"./_to-primitive":118}],212:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":8,"./_export":34,"./_object-gopd":75}],213:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_an-object":8,"./_export":34,"./_iter-create":55}],214:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":8,"./_export":34,"./_object-gopd":75}],215:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":8,"./_export":34,"./_object-gpo":79}],216:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":8,"./_export":34,"./_has":42,"./_is-object":52,"./_object-gopd":75,"./_object-gpo":79}],217:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":34}],218:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":8,"./_export":34}],219:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":34,"./_own-keys":85}],220:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":8,"./_export":34}],221:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":34,"./_set-proto":97}],222:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":8,"./_export":34,"./_has":42,"./_is-object":52,"./_object-dp":72,"./_object-gopd":75,"./_object-gpo":79,"./_property-desc":90}],223:[function(require,module,exports){
var global = require('./_global');
var inheritIfRequired = require('./_inherit-if-required');
var dP = require('./_object-dp').f;
var gOPN = require('./_object-gopn').f;
var isRegExp = require('./_is-regexp');
var $flags = require('./_flags');
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');

},{"./_descriptors":30,"./_fails":36,"./_flags":38,"./_global":41,"./_inherit-if-required":46,"./_is-regexp":53,"./_object-dp":72,"./_object-gopn":77,"./_redefine":92,"./_set-species":98,"./_wks":127}],224:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":30,"./_flags":38,"./_object-dp":72}],225:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":37}],226:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":37}],227:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":37}],228:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = require('./_is-regexp');
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":37,"./_is-regexp":53}],229:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":8,"./_descriptors":30,"./_fails":36,"./_flags":38,"./_redefine":92,"./es6.regexp.flags":224}],230:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":23,"./_collection-strong":20,"./_validate-collection":124}],231:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":106}],232:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":106}],233:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":106}],234:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":106}],235:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":34,"./_string-at":104}],236:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":34,"./_fails-is-regexp":35,"./_string-context":105,"./_to-length":116}],237:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":106}],238:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":106}],239:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":106}],240:[function(require,module,exports){
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":34,"./_to-absolute-index":112}],241:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":34,"./_fails-is-regexp":35,"./_string-context":105}],242:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":106}],243:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":56,"./_string-at":104}],244:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":106}],245:[function(require,module,exports){
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":34,"./_to-iobject":115,"./_to-length":116}],246:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":34,"./_string-repeat":108}],247:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":106}],248:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":34,"./_fails-is-regexp":35,"./_string-context":105,"./_to-length":116}],249:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":106}],250:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":106}],251:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":106}],252:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":109}],253:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":8,"./_descriptors":30,"./_enum-keys":33,"./_export":34,"./_fails":36,"./_global":41,"./_has":42,"./_hide":43,"./_is-array":50,"./_is-object":52,"./_library":60,"./_meta":66,"./_object-create":71,"./_object-dp":72,"./_object-gopd":75,"./_object-gopn":77,"./_object-gopn-ext":76,"./_object-gops":78,"./_object-keys":81,"./_object-pie":82,"./_property-desc":90,"./_redefine":92,"./_set-to-string-tag":99,"./_shared":101,"./_to-iobject":115,"./_to-primitive":118,"./_uid":122,"./_wks":127,"./_wks-define":125,"./_wks-ext":126}],254:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":8,"./_export":34,"./_fails":36,"./_global":41,"./_is-object":52,"./_set-species":98,"./_species-constructor":102,"./_to-absolute-index":112,"./_to-length":116,"./_typed":121,"./_typed-buffer":120}],255:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":34,"./_typed":121,"./_typed-buffer":120}],256:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],257:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],258:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],259:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],260:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],261:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],262:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],263:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":119}],264:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":119}],265:[function(require,module,exports){
'use strict';
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var fails = require('./_fails');
var validate = require('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":13,"./_collection":23,"./_collection-weak":22,"./_fails":36,"./_is-object":52,"./_meta":66,"./_object-assign":70,"./_redefine":92,"./_validate-collection":124}],266:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":23,"./_collection-weak":22,"./_validate-collection":124}],267:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var aFunction = require('./_a-function');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

require('./_add-to-unscopables')('flatMap');

},{"./_a-function":4,"./_add-to-unscopables":6,"./_array-species-create":16,"./_export":34,"./_flatten-into-array":39,"./_to-length":116,"./_to-object":117}],268:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

require('./_add-to-unscopables')('flatten');

},{"./_add-to-unscopables":6,"./_array-species-create":16,"./_export":34,"./_flatten-into-array":39,"./_to-integer":114,"./_to-length":116,"./_to-object":117}],269:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":6,"./_array-includes":12,"./_export":34}],270:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = require('./_export');
var microtask = require('./_microtask')();
var process = require('./_global').process;
var isNode = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"./_cof":19,"./_export":34,"./_global":41,"./_microtask":68}],271:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export');
var cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

},{"./_cof":19,"./_export":34}],272:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.G, { global: require('./_global') });

},{"./_export":34,"./_global":41}],273:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
require('./_set-collection-from')('Map');

},{"./_set-collection-from":95}],274:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
require('./_set-collection-of')('Map');

},{"./_set-collection-of":96}],275:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_collection-to-json":21,"./_export":34}],276:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});

},{"./_export":34}],277:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });

},{"./_export":34}],278:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

},{"./_export":34}],279:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var scale = require('./_math-scale');
var fround = require('./_math-fround');

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});

},{"./_export":34,"./_math-fround":62,"./_math-scale":64}],280:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

},{"./_export":34}],281:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

},{"./_export":34}],282:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

},{"./_export":34}],283:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });

},{"./_export":34}],284:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

},{"./_export":34}],285:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { scale: require('./_math-scale') });

},{"./_export":34,"./_math-scale":64}],286:[function(require,module,exports){
// http://jfbastien.github.io/papers/Math.signbit.html
var $export = require('./_export');

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });

},{"./_export":34}],287:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

},{"./_export":34}],288:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":4,"./_descriptors":30,"./_export":34,"./_object-dp":72,"./_object-forced-pam":74,"./_to-object":117}],289:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":4,"./_descriptors":30,"./_export":34,"./_object-dp":72,"./_object-forced-pam":74,"./_to-object":117}],290:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":34,"./_object-to-array":84}],291:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_create-property":25,"./_export":34,"./_object-gopd":75,"./_own-keys":85,"./_to-iobject":115}],292:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":30,"./_export":34,"./_object-forced-pam":74,"./_object-gopd":75,"./_object-gpo":79,"./_to-object":117,"./_to-primitive":118}],293:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":30,"./_export":34,"./_object-forced-pam":74,"./_object-gopd":75,"./_object-gpo":79,"./_to-object":117,"./_to-primitive":118}],294:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":34,"./_object-to-array":84}],295:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export = require('./_export');
var global = require('./_global');
var core = require('./_core');
var microtask = require('./_microtask')();
var OBSERVABLE = require('./_wks')('observable');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var anInstance = require('./_an-instance');
var redefineAll = require('./_redefine-all');
var hide = require('./_hide');
var forOf = require('./_for-of');
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = new Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

require('./_set-species')('Observable');

},{"./_a-function":4,"./_an-instance":7,"./_an-object":8,"./_core":24,"./_export":34,"./_for-of":40,"./_global":41,"./_hide":43,"./_microtask":68,"./_redefine-all":91,"./_set-species":98,"./_wks":127}],296:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":24,"./_export":34,"./_global":41,"./_promise-resolve":89,"./_species-constructor":102}],297:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":34,"./_new-promise-capability":69,"./_perform":88}],298:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });

},{"./_an-object":8,"./_metadata":67}],299:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });

},{"./_an-object":8,"./_metadata":67}],300:[function(require,module,exports){
var Set = require('./es6.set');
var from = require('./_array-from-iterable');
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":8,"./_array-from-iterable":11,"./_metadata":67,"./_object-gpo":79,"./es6.set":230}],301:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":8,"./_metadata":67,"./_object-gpo":79}],302:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":8,"./_metadata":67}],303:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":8,"./_metadata":67}],304:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":8,"./_metadata":67,"./_object-gpo":79}],305:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":8,"./_metadata":67}],306:[function(require,module,exports){
var $metadata = require('./_metadata');
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });

},{"./_a-function":4,"./_an-object":8,"./_metadata":67}],307:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
require('./_set-collection-from')('Set');

},{"./_set-collection-from":95}],308:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
require('./_set-collection-of')('Set');

},{"./_set-collection-of":96}],309:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_collection-to-json":21,"./_export":34}],310:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export');
var $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":34,"./_string-at":104}],311:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export = require('./_export');
var defined = require('./_defined');
var toLength = require('./_to-length');
var isRegExp = require('./_is-regexp');
var getFlags = require('./_flags');
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

},{"./_defined":29,"./_export":34,"./_flags":38,"./_is-regexp":53,"./_iter-create":55,"./_to-length":116}],312:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":34,"./_string-pad":107,"./_user-agent":123}],313:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":34,"./_string-pad":107,"./_user-agent":123}],314:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":109}],315:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":109}],316:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":125}],317:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":125}],318:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.S, 'System', { global: require('./_global') });

},{"./_export":34,"./_global":41}],319:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
require('./_set-collection-from')('WeakMap');

},{"./_set-collection-from":95}],320:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
require('./_set-collection-of')('WeakMap');

},{"./_set-collection-of":96}],321:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
require('./_set-collection-from')('WeakSet');

},{"./_set-collection-from":95}],322:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
require('./_set-collection-of')('WeakSet');

},{"./_set-collection-of":96}],323:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":41,"./_hide":43,"./_iterators":59,"./_object-keys":81,"./_redefine":92,"./_wks":127,"./es6.array.iterator":140}],324:[function(require,module,exports){
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":34,"./_task":111}],325:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var userAgent = require('./_user-agent');
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":34,"./_global":41,"./_user-agent":123}],326:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.array.flat-map');
require('./modules/es7.array.flatten');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.map.of');
require('./modules/es7.set.of');
require('./modules/es7.weak-map.of');
require('./modules/es7.weak-set.of');
require('./modules/es7.map.from');
require('./modules/es7.set.from');
require('./modules/es7.weak-map.from');
require('./modules/es7.weak-set.from');
require('./modules/es7.global');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.clamp');
require('./modules/es7.math.deg-per-rad');
require('./modules/es7.math.degrees');
require('./modules/es7.math.fscale');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.rad-per-deg');
require('./modules/es7.math.radians');
require('./modules/es7.math.scale');
require('./modules/es7.math.umulh');
require('./modules/es7.math.signbit');
require('./modules/es7.promise.finally');
require('./modules/es7.promise.try');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');

},{"./modules/_core":24,"./modules/es6.array.copy-within":130,"./modules/es6.array.every":131,"./modules/es6.array.fill":132,"./modules/es6.array.filter":133,"./modules/es6.array.find":135,"./modules/es6.array.find-index":134,"./modules/es6.array.for-each":136,"./modules/es6.array.from":137,"./modules/es6.array.index-of":138,"./modules/es6.array.is-array":139,"./modules/es6.array.iterator":140,"./modules/es6.array.join":141,"./modules/es6.array.last-index-of":142,"./modules/es6.array.map":143,"./modules/es6.array.of":144,"./modules/es6.array.reduce":146,"./modules/es6.array.reduce-right":145,"./modules/es6.array.slice":147,"./modules/es6.array.some":148,"./modules/es6.array.sort":149,"./modules/es6.array.species":150,"./modules/es6.date.now":151,"./modules/es6.date.to-iso-string":152,"./modules/es6.date.to-json":153,"./modules/es6.date.to-primitive":154,"./modules/es6.date.to-string":155,"./modules/es6.function.bind":156,"./modules/es6.function.has-instance":157,"./modules/es6.function.name":158,"./modules/es6.map":159,"./modules/es6.math.acosh":160,"./modules/es6.math.asinh":161,"./modules/es6.math.atanh":162,"./modules/es6.math.cbrt":163,"./modules/es6.math.clz32":164,"./modules/es6.math.cosh":165,"./modules/es6.math.expm1":166,"./modules/es6.math.fround":167,"./modules/es6.math.hypot":168,"./modules/es6.math.imul":169,"./modules/es6.math.log10":170,"./modules/es6.math.log1p":171,"./modules/es6.math.log2":172,"./modules/es6.math.sign":173,"./modules/es6.math.sinh":174,"./modules/es6.math.tanh":175,"./modules/es6.math.trunc":176,"./modules/es6.number.constructor":177,"./modules/es6.number.epsilon":178,"./modules/es6.number.is-finite":179,"./modules/es6.number.is-integer":180,"./modules/es6.number.is-nan":181,"./modules/es6.number.is-safe-integer":182,"./modules/es6.number.max-safe-integer":183,"./modules/es6.number.min-safe-integer":184,"./modules/es6.number.parse-float":185,"./modules/es6.number.parse-int":186,"./modules/es6.number.to-fixed":187,"./modules/es6.number.to-precision":188,"./modules/es6.object.assign":189,"./modules/es6.object.create":190,"./modules/es6.object.define-properties":191,"./modules/es6.object.define-property":192,"./modules/es6.object.freeze":193,"./modules/es6.object.get-own-property-descriptor":194,"./modules/es6.object.get-own-property-names":195,"./modules/es6.object.get-prototype-of":196,"./modules/es6.object.is":200,"./modules/es6.object.is-extensible":197,"./modules/es6.object.is-frozen":198,"./modules/es6.object.is-sealed":199,"./modules/es6.object.keys":201,"./modules/es6.object.prevent-extensions":202,"./modules/es6.object.seal":203,"./modules/es6.object.set-prototype-of":204,"./modules/es6.object.to-string":205,"./modules/es6.parse-float":206,"./modules/es6.parse-int":207,"./modules/es6.promise":208,"./modules/es6.reflect.apply":209,"./modules/es6.reflect.construct":210,"./modules/es6.reflect.define-property":211,"./modules/es6.reflect.delete-property":212,"./modules/es6.reflect.enumerate":213,"./modules/es6.reflect.get":216,"./modules/es6.reflect.get-own-property-descriptor":214,"./modules/es6.reflect.get-prototype-of":215,"./modules/es6.reflect.has":217,"./modules/es6.reflect.is-extensible":218,"./modules/es6.reflect.own-keys":219,"./modules/es6.reflect.prevent-extensions":220,"./modules/es6.reflect.set":222,"./modules/es6.reflect.set-prototype-of":221,"./modules/es6.regexp.constructor":223,"./modules/es6.regexp.flags":224,"./modules/es6.regexp.match":225,"./modules/es6.regexp.replace":226,"./modules/es6.regexp.search":227,"./modules/es6.regexp.split":228,"./modules/es6.regexp.to-string":229,"./modules/es6.set":230,"./modules/es6.string.anchor":231,"./modules/es6.string.big":232,"./modules/es6.string.blink":233,"./modules/es6.string.bold":234,"./modules/es6.string.code-point-at":235,"./modules/es6.string.ends-with":236,"./modules/es6.string.fixed":237,"./modules/es6.string.fontcolor":238,"./modules/es6.string.fontsize":239,"./modules/es6.string.from-code-point":240,"./modules/es6.string.includes":241,"./modules/es6.string.italics":242,"./modules/es6.string.iterator":243,"./modules/es6.string.link":244,"./modules/es6.string.raw":245,"./modules/es6.string.repeat":246,"./modules/es6.string.small":247,"./modules/es6.string.starts-with":248,"./modules/es6.string.strike":249,"./modules/es6.string.sub":250,"./modules/es6.string.sup":251,"./modules/es6.string.trim":252,"./modules/es6.symbol":253,"./modules/es6.typed.array-buffer":254,"./modules/es6.typed.data-view":255,"./modules/es6.typed.float32-array":256,"./modules/es6.typed.float64-array":257,"./modules/es6.typed.int16-array":258,"./modules/es6.typed.int32-array":259,"./modules/es6.typed.int8-array":260,"./modules/es6.typed.uint16-array":261,"./modules/es6.typed.uint32-array":262,"./modules/es6.typed.uint8-array":263,"./modules/es6.typed.uint8-clamped-array":264,"./modules/es6.weak-map":265,"./modules/es6.weak-set":266,"./modules/es7.array.flat-map":267,"./modules/es7.array.flatten":268,"./modules/es7.array.includes":269,"./modules/es7.asap":270,"./modules/es7.error.is-error":271,"./modules/es7.global":272,"./modules/es7.map.from":273,"./modules/es7.map.of":274,"./modules/es7.map.to-json":275,"./modules/es7.math.clamp":276,"./modules/es7.math.deg-per-rad":277,"./modules/es7.math.degrees":278,"./modules/es7.math.fscale":279,"./modules/es7.math.iaddh":280,"./modules/es7.math.imulh":281,"./modules/es7.math.isubh":282,"./modules/es7.math.rad-per-deg":283,"./modules/es7.math.radians":284,"./modules/es7.math.scale":285,"./modules/es7.math.signbit":286,"./modules/es7.math.umulh":287,"./modules/es7.object.define-getter":288,"./modules/es7.object.define-setter":289,"./modules/es7.object.entries":290,"./modules/es7.object.get-own-property-descriptors":291,"./modules/es7.object.lookup-getter":292,"./modules/es7.object.lookup-setter":293,"./modules/es7.object.values":294,"./modules/es7.observable":295,"./modules/es7.promise.finally":296,"./modules/es7.promise.try":297,"./modules/es7.reflect.define-metadata":298,"./modules/es7.reflect.delete-metadata":299,"./modules/es7.reflect.get-metadata":301,"./modules/es7.reflect.get-metadata-keys":300,"./modules/es7.reflect.get-own-metadata":303,"./modules/es7.reflect.get-own-metadata-keys":302,"./modules/es7.reflect.has-metadata":304,"./modules/es7.reflect.has-own-metadata":305,"./modules/es7.reflect.metadata":306,"./modules/es7.set.from":307,"./modules/es7.set.of":308,"./modules/es7.set.to-json":309,"./modules/es7.string.at":310,"./modules/es7.string.match-all":311,"./modules/es7.string.pad-end":312,"./modules/es7.string.pad-start":313,"./modules/es7.string.trim-left":314,"./modules/es7.string.trim-right":315,"./modules/es7.symbol.async-iterator":316,"./modules/es7.symbol.observable":317,"./modules/es7.system.global":318,"./modules/es7.weak-map.from":319,"./modules/es7.weak-map.of":320,"./modules/es7.weak-set.from":321,"./modules/es7.weak-set.of":322,"./modules/web.dom.iterable":323,"./modules/web.immediate":324,"./modules/web.timers":325}],327:[function(require,module,exports){
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

},{}],328:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["v-clipboard"]=t():e["v-clipboard"]=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){var t=document.createElement("textarea"),n=!1;t.value=e,t.style.cssText="position:fixed;pointer-events:none;z-index:-9999;opacity:0;",document.body.appendChild(t),t.select();try{n=document.execCommand("copy")}catch(e){}return document.body.removeChild(t),n};t.default={install:function(e){e.prototype.$clipboard=o,e.directive("clipboard",{bind:function(e,t,n){e.addEventListener("click",function(e){if(t.hasOwnProperty("value")){var r=t.value,c={value:r,srcEvent:e},i=n.context;o(r)?i.$emit("copy",c):i.$emit("copyError",c)}})}})}}}])});

},{}],329:[function(require,module,exports){
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

},{}],330:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("vue-slider-component",[],e):"object"==typeof exports?exports["vue-slider-component"]=e():t["vue-slider-component"]=e()}(this,function(){return function(t){function e(s){if(i[s])return i[s].exports;var r=i[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var i={};return e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,i){i(7);var s=i(5)(i(1),i(6),null,null);t.exports=s.exports},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"VueSliderComponent",data:function(){return{flag:!1,size:0,currentValue:0,currentSlider:0}},props:{width:{type:[Number,String],default:"auto"},height:{type:[Number,String],default:6},data:{type:Array,default:null},dotSize:{type:Number,default:16},dotWidth:{type:Number,required:!1},dotHeight:{type:Number,required:!1},min:{type:Number,default:0},max:{type:Number,default:100},interval:{type:Number,default:1},show:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1},piecewise:{type:Boolean,default:!1},tooltip:{type:[String,Boolean],default:"always"},eventType:{type:String,default:"auto"},direction:{type:String,default:"horizontal"},reverse:{type:Boolean,default:!1},lazy:{type:Boolean,default:!1},clickable:{type:Boolean,default:!0},speed:{type:Number,default:.5},realTime:{type:Boolean,default:!1},stopPropagation:{type:Boolean,default:!1},value:{type:[String,Number,Array],default:0},piecewiseLabel:{type:Boolean,default:!1},sliderStyle:[Array,Object,Function],tooltipDir:[Array,String],formatter:[String,Function],piecewiseStyle:Object,piecewiseActiveStyle:Object,processStyle:Object,bgStyle:Object,tooltipStyle:[Array,Object,Function],labelStyle:Object,labelActiveStyle:Object},computed:{dotWidthVal:function(){return"number"==typeof this.dotWidth?this.dotWidth:this.dotSize},dotHeightVal:function(){return"number"==typeof this.dotHeight?this.dotHeight:this.dotSize},flowDirection:function(){return"vue-slider-"+this.direction+(this.reverse?"-reverse":"")},tooltipDirection:function(){var t=this.tooltipDir||("vertical"===this.direction?"left":"top");return Array.isArray(t)?this.isRange?t:t[1]:this.isRange?[t,t]:t},tooltipStatus:function(){return"hover"===this.tooltip&&this.flag?"vue-slider-always":this.tooltip?"vue-slider-"+this.tooltip:""},tooltipClass:function(){return["vue-slider-tooltip-"+this.tooltipDirection,"vue-slider-tooltip"]},isDisabled:function(){return"none"===this.eventType||this.disabled},disabledClass:function(){return this.disabled?"vue-slider-disabled":""},isRange:function(){return Array.isArray(this.value)},slider:function(){return this.isRange?[this.$refs.dot0,this.$refs.dot1]:this.$refs.dot},minimum:function(){return this.data?0:this.min},val:{get:function(){return this.data?this.isRange?[this.data[this.currentValue[0]],this.data[this.currentValue[1]]]:this.data[this.currentValue]:this.currentValue},set:function(t){if(this.data)if(this.isRange){var e=this.data.indexOf(t[0]),i=this.data.indexOf(t[1]);e>-1&&i>-1&&(this.currentValue=[e,i])}else{var s=this.data.indexOf(t);s>-1&&(this.currentValue=s)}else this.currentValue=t}},currentIndex:function(){return this.isRange?this.data?this.currentValue:[(this.currentValue[0]-this.minimum)/this.spacing,(this.currentValue[1]-this.minimum)/this.spacing]:(this.currentValue-this.minimum)/this.spacing},indexRange:function(){return this.isRange?this.currentIndex:[0,this.currentIndex]},maximum:function(){return this.data?this.data.length-1:this.max},multiple:function(){var t=(""+this.interval).split(".")[1];return t?Math.pow(10,t.length):1},spacing:function(){return this.data?1:this.interval},total:function(){return this.data?this.data.length-1:(~~((this.maximum-this.minimum)*this.multiple)%(this.interval*this.multiple)!=0&&console.error("[Vue-slider warn]: Prop[interval] is illegal, Please make sure that the interval can be divisible"),(this.maximum-this.minimum)/this.interval)},gap:function(){return this.size/this.total},position:function(){return this.isRange?[(this.currentValue[0]-this.minimum)/this.spacing*this.gap,(this.currentValue[1]-this.minimum)/this.spacing*this.gap]:(this.currentValue-this.minimum)/this.spacing*this.gap},limit:function(){return this.isRange?[[0,this.position[1]],[this.position[0],this.size]]:[0,this.size]},valueLimit:function(){return this.isRange?[[this.minimum,this.currentValue[1]],[this.currentValue[0],this.maximum]]:[this.minimum,this.maximum]},wrapStyles:function(){return"vertical"===this.direction?{height:"number"==typeof this.height?this.height+"px":this.height,padding:this.dotHeightVal/2+"px "+this.dotWidthVal/2+"px"}:{width:"number"==typeof this.width?this.width+"px":this.width,padding:this.dotHeightVal/2+"px "+this.dotWidthVal/2+"px"}},sliderStyles:function(){return Array.isArray(this.sliderStyle)?this.isRange?this.sliderStyle:this.sliderStyle[1]:"function"==typeof this.sliderStyle?this.sliderStyle(this.val,this.currentIndex):this.isRange?[this.sliderStyle,this.sliderStyle]:this.sliderStyle},tooltipStyles:function(){return Array.isArray(this.tooltipStyle)?this.isRange?this.tooltipStyle:this.tooltipStyle[1]:"function"==typeof this.tooltipStyle?this.tooltipStyle(this.val,this.currentIndex):this.isRange?[this.tooltipStyle,this.tooltipStyle]:this.tooltipStyle},elemStyles:function(){return"vertical"===this.direction?{width:this.width+"px",height:"100%"}:{height:this.height+"px"}},dotStyles:function(){return"vertical"===this.direction?{width:this.dotWidthVal+"px",height:this.dotHeightVal+"px",left:-(this.dotWidthVal-this.width)/2+"px"}:{width:this.dotWidthVal+"px",height:this.dotHeightVal+"px",top:-(this.dotHeightVal-this.height)/2+"px"}},piecewiseDotStyle:function(){return"vertical"===this.direction?{width:this.width+"px",height:this.width+"px"}:{width:this.height+"px",height:this.height+"px"}},piecewiseDotWrap:function(){if(!this.piecewise&&!this.piecewiseLabel)return!1;for(var t=[],e=0;e<=this.total;e++){var i="vertical"===this.direction?{bottom:this.gap*e-this.width/2+"px",left:0}:{left:this.gap*e-this.height/2+"px",top:0},s=this.reverse?this.total-e:e,r=this.data?this.data[s]:this.spacing*s+this.min;t.push({style:i,label:this.formatter?this.formatting(r):r,inRange:s>=this.indexRange[0]&&s<=this.indexRange[1]})}return t}},watch:{value:function(t){this.flag||this.setValue(t,!0)},max:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},min:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},show:function(t){var e=this;t&&!this.size&&this.$nextTick(function(){e.refresh()})}},methods:{bindEvents:function(){document.addEventListener("touchmove",this.moving,{passive:!1}),document.addEventListener("touchend",this.moveEnd,{passive:!1}),document.addEventListener("mousemove",this.moving),document.addEventListener("mouseup",this.moveEnd),document.addEventListener("mouseleave",this.moveEnd),window.addEventListener("resize",this.refresh)},unbindEvents:function(){window.removeEventListener("resize",this.refresh),document.removeEventListener("touchmove",this.moving),document.removeEventListener("touchend",this.moveEnd),document.removeEventListener("mousemove",this.moving),document.removeEventListener("mouseup",this.moveEnd),document.removeEventListener("mouseleave",this.moveEnd)},formatting:function(t){return"string"==typeof this.formatter?this.formatter.replace(/\{value\}/,t):this.formatter(t)},getPos:function(t){return this.realTime&&this.getStaticData(),"vertical"===this.direction?this.reverse?t.pageY-this.offset:this.size-(t.pageY-this.offset):this.reverse?this.size-(t.clientX-this.offset):t.clientX-this.offset},wrapClick:function(t){if(this.isDisabled||!this.clickable)return!1;var e=this.getPos(t);this.isRange&&(this.currentSlider=e>(this.position[1]-this.position[0])/2+this.position[0]?1:0),this.setValueOnPos(e)},moveStart:function(t,e){if(this.stopPropagation&&t.stopPropagation(),this.isDisabled)return!1;this.isRange&&(this.currentSlider=e),this.flag=!0,this.$emit("drag-start",this)},moving:function(t){if(this.stopPropagation&&t.stopPropagation(),!this.flag)return!1;t.preventDefault(),t.targetTouches&&t.targetTouches[0]&&(t=t.targetTouches[0]),this.setValueOnPos(this.getPos(t),!0)},moveEnd:function(t){if(this.stopPropagation&&t.stopPropagation(),!this.flag)return!1;this.$emit("drag-end",this),this.lazy&&this.isDiff(this.val,this.value)&&this.syncValue(),this.flag=!1,this.setPosition()},setValueOnPos:function(t,e){var i=this.isRange?this.limit[this.currentSlider]:this.limit,s=this.isRange?this.valueLimit[this.currentSlider]:this.valueLimit;if(t>=i[0]&&t<=i[1]){this.setTransform(t);var r=(Math.round(t/this.gap)*(this.spacing*this.multiple)+this.minimum*this.multiple)/this.multiple;this.setCurrentValue(r,e)}else t<i[0]?(this.setTransform(i[0]),this.setCurrentValue(s[0]),1===this.currentSlider&&(this.currentSlider=0)):(this.setTransform(i[1]),this.setCurrentValue(s[1]),0===this.currentSlider&&(this.currentSlider=1))},isDiff:function(t,e){return Object.prototype.toString.call(t)!==Object.prototype.toString.call(e)||(Array.isArray(t)&&t.length===e.length?t.some(function(t,i){return t!==e[i]}):t!==e)},setCurrentValue:function(t,e){if(t<this.minimum||t>this.maximum)return!1;this.isRange?this.isDiff(this.currentValue[this.currentSlider],t)&&(this.currentValue.splice(this.currentSlider,1,t),this.lazy&&this.flag||this.syncValue()):this.isDiff(this.currentValue,t)&&(this.currentValue=t,this.lazy&&this.flag||this.syncValue()),e||this.setPosition()},setIndex:function(t){if(Array.isArray(t)&&this.isRange){var e=void 0;e=this.data?[this.data[t[0]],this.data[t[1]]]:[this.spacing*t[0]+this.minimum,this.spacing*t[1]+this.minimum],this.setValue(e)}else t=this.spacing*t+this.minimum,this.isRange&&(this.currentSlider=t>(this.currentValue[1]-this.currentValue[0])/2+this.currentValue[0]?1:0),this.setCurrentValue(t)},setValue:function(t,e,i){var s=this;if(this.isDiff(this.val,t)){var r=this.limitValue(t);this.val=!1!==r?this.isRange?r.concat():r:this.isRange?t.concat():t,this.syncValue(e)}this.$nextTick(function(){return s.setPosition(i)})},setPosition:function(t){this.flag||this.setTransitionTime(void 0===t?this.speed:t),this.isRange?(this.currentSlider=0,this.setTransform(this.position[this.currentSlider]),this.currentSlider=1,this.setTransform(this.position[this.currentSlider])):this.setTransform(this.position),this.flag||this.setTransitionTime(0)},setTransform:function(t){var e=("vertical"===this.direction?this.dotHeightVal/2-t:t-this.dotWidthVal/2)*(this.reverse?-1:1),i="vertical"===this.direction?"translateY("+e+"px)":"translateX("+e+"px)",s=(0===this.currentSlider?this.position[1]-t:t-this.position[0])+"px",r=(0===this.currentSlider?t:this.position[0])+"px";this.isRange?(this.slider[this.currentSlider].style.transform=i,this.slider[this.currentSlider].style.WebkitTransform=i,this.slider[this.currentSlider].style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=s,this.$refs.process.style[this.reverse?"top":"bottom"]=r):(this.$refs.process.style.width=s,this.$refs.process.style[this.reverse?"right":"left"]=r)):(this.slider.style.transform=i,this.slider.style.WebkitTransform=i,this.slider.style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=t+"px",this.$refs.process.style[this.reverse?"top":"bottom"]=0):(this.$refs.process.style.width=t+"px",this.$refs.process.style[this.reverse?"right":"left"]=0))},setTransitionTime:function(t){if(t||this.$refs.process.offsetWidth,this.isRange){for(var e=0;e<this.slider.length;e++)this.slider[e].style.transitionDuration=t+"s",this.slider[e].style.WebkitTransitionDuration=t+"s";this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"}else this.slider.style.transitionDuration=t+"s",this.slider.style.WebkitTransitionDuration=t+"s",this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"},limitValue:function(t){var e=this;if(this.data)return t;var i=!1;return this.isRange?t=t.map(function(t){return t<e.min?(i=!0,e.min):t>e.max?(i=!0,e.max):t}):t>this.max?(i=!0,t=this.max):t<this.min&&(i=!0,t=this.min),i&&t},syncValue:function(t){t||this.$emit("callback",this.val),this.$emit("input",this.isRange?this.val.concat():this.val)},getValue:function(){return this.val},getIndex:function(){return this.currentIndex},getStaticData:function(){this.$refs.elem&&(this.size="vertical"===this.direction?this.$refs.elem.offsetHeight:this.$refs.elem.offsetWidth,this.offset="vertical"===this.direction?this.$refs.elem.getBoundingClientRect().top+window.pageYOffset||document.documentElement.scrollTop:this.$refs.elem.getBoundingClientRect().left)},refresh:function(){this.$refs.elem&&(this.getStaticData(),this.setPosition())}},mounted:function(){var t=this;"undefined"!=typeof window&&"undefined"!=typeof document&&this.$nextTick(function(){t.getStaticData(),t.setValue(t.value,!0,0),t.bindEvents()})},beforeDestroy:function(){this.unbindEvents()}}},function(t,e,i){"use strict";var s=i(0);t.exports=s},function(t,e,i){e=t.exports=i(4)(),e.push([t.i,'.vue-slider-component{position:relative;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.vue-slider-component.vue-slider-disabled{opacity:.5;cursor:not-allowed}.vue-slider-component.vue-slider-has-label{margin-bottom:15px}.vue-slider-component.vue-slider-disabled .vue-slider-dot{cursor:not-allowed}.vue-slider-component .vue-slider{position:relative;display:block;border-radius:15px;background-color:#ccc}.vue-slider-component .vue-slider:after{content:"";position:absolute;left:0;top:0;width:100%;height:100%;z-index:2}.vue-slider-component .vue-slider-process{position:absolute;border-radius:15px;background-color:#3498db;transition:all 0s;z-index:1}.vue-slider-component.vue-slider-horizontal .vue-slider-process{width:0;height:100%;top:0;left:0;will-change:width}.vue-slider-component.vue-slider-vertical .vue-slider-process{width:100%;height:0;bottom:0;left:0;will-change:height}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-process{width:0;height:100%;top:0;right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-process{width:100%;height:0;top:0;left:0}.vue-slider-component .vue-slider-dot{position:absolute;border-radius:50%;background-color:#fff;box-shadow:.5px .5px 2px 1px rgba(0,0,0,.32);transition:all 0s;will-change:transform;cursor:pointer;z-index:3}.vue-slider-component.vue-slider-horizontal .vue-slider-dot{left:0}.vue-slider-component.vue-slider-vertical .vue-slider-dot{bottom:0}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-dot{right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-dot{top:0}.vue-slider-component .vue-slider-tooltip-wrap{display:none;position:absolute;z-index:9}.vue-slider-component .vue-slider-tooltip{display:block;font-size:14px;white-space:nowrap;padding:2px 5px;min-width:20px;text-align:center;color:#fff;border-radius:5px;border:1px solid #3498db;background-color:#3498db}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top{top:-9px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom{bottom:-9px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left{top:50%;left:-9px;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right{top:50%;right:-9px;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top .vue-slider-tooltip:before{content:"";position:absolute;bottom:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-top-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip:before{content:"";position:absolute;top:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-bottom-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left .vue-slider-tooltip:before{content:"";position:absolute;top:50%;right:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-left-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right .vue-slider-tooltip:before{content:"";position:absolute;top:50%;left:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-right-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-dot.vue-slider-hover:hover .vue-slider-tooltip-wrap{display:block}.vue-slider-component .vue-slider-dot.vue-slider-always .vue-slider-tooltip-wrap{display:block!important}.vue-slider-component .vue-slider-piecewise{position:absolute;width:100%;padding:0;margin:0;left:0;top:0;height:100%;list-style:none}.vue-slider-component .vue-slider-piecewise-item{position:absolute;width:8px;height:8px}.vue-slider-component .vue-slider-piecewise-dot{position:absolute;left:50%;top:50%;width:100%;height:100%;display:inline-block;background-color:rgba(0,0,0,.16);border-radius:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:2;transition:all .3s}.vue-slider-component .vue-slider-piecewise-item:first-child .vue-slider-piecewise-dot,.vue-slider-component .vue-slider-piecewise-item:last-child .vue-slider-piecewise-dot{visibility:hidden}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-horizontal .vue-slider-piecewise-label{position:absolute;display:inline-block;top:100%;left:50%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(-50%,8px);transform:translate(-50%,8px);visibility:visible}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-vertical .vue-slider-piecewise-label{position:absolute;display:inline-block;top:50%;left:100%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(8px,-50%);transform:translate(8px,-50%);visibility:visible}.vue-slider-component .vue-slider-sr-only{clip:rect(1px,1px,1px,1px);height:1px;width:1px;overflow:hidden;position:absolute!important}',""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var i=this[e];i[2]?t.push("@media "+i[2]+"{"+i[1]+"}"):t.push(i[1])}return t.join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var s={},r=0;r<this.length;r++){var n=this[r][0];"number"==typeof n&&(s[n]=!0)}for(r=0;r<e.length;r++){var o=e[r];"number"==typeof o[0]&&s[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(t,e){t.exports=function(t,e,i,s){var r,n=t=t||{},o=typeof t.default;"object"!==o&&"function"!==o||(r=t,n=t.default);var l="function"==typeof n?n.options:n;if(e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns),i&&(l._scopeId=i),s){var a=Object.create(l.computed||null);Object.keys(s).forEach(function(t){var e=s[t];a[t]=function(){return e}}),l.computed=a}return{esModule:r,exports:n,options:l}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],ref:"wrap",class:["vue-slider-component",t.flowDirection,t.disabledClass,{"vue-slider-has-label":t.piecewiseLabel}],style:t.wrapStyles,on:{click:t.wrapClick}},[i("div",{ref:"elem",staticClass:"vue-slider",style:[t.elemStyles,t.bgStyle],attrs:{"aria-hidden":"true"}},[t.isRange?[i("div",{ref:"dot0",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[0]],on:{mousedown:function(e){t.moveStart(e,0)},touchstart:function(e){t.moveStart(e,0)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[0],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[0]},[t._v(t._s(t.formatter?t.formatting(t.val[0]):t.val[0]))])],{value:t.val[0],index:0})],2)]),t._v(" "),i("div",{ref:"dot1",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[1]],on:{mousedown:function(e){t.moveStart(e,1)},touchstart:function(e){t.moveStart(e,1)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[1],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[1]},[t._v(t._s(t.formatter?t.formatting(t.val[1]):t.val[1]))])],{value:t.val[1],index:1})],2)])]:[i("div",{ref:"dot",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles],on:{mousedown:t.moveStart,touchstart:t.moveStart}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection,"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles},[t._v(t._s(t.formatter?t.formatting(t.val):t.val))])],{value:t.val})],2)])],t._v(" "),i("ul",{staticClass:"vue-slider-piecewise"},t._l(t.piecewiseDotWrap,function(e,s){return i("li",{key:s,staticClass:"vue-slider-piecewise-item",style:[t.piecewiseDotStyle,e.style]},[t._t("piecewise",[t.piecewise?i("span",{staticClass:"vue-slider-piecewise-dot",style:[t.piecewiseStyle,e.inRange?t.piecewiseActiveStyle:null]}):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1,active:e.inRange}),t._v(" "),t._t("label",[t.piecewiseLabel?i("span",{staticClass:"vue-slider-piecewise-label",style:[t.labelStyle,e.inRange?t.labelActiveStyle:null]},[t._v("\n            "+t._s(e.label)+"\n          ")]):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1,active:e.inRange})],2)})),t._v(" "),i("div",{ref:"process",staticClass:"vue-slider-process",style:t.processStyle})],2),t._v(" "),t.isRange||t.data?t._e():i("input",{directives:[{name:"model",rawName:"v-model",value:t.val,expression:"val"}],staticClass:"vue-slider-sr-only",attrs:{type:"range",min:t.min,max:t.max},domProps:{value:t.val},on:{__r:function(e){t.val=e.target.value}}})])},staticRenderFns:[]}},function(t,e,i){var s=i(3);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);i(8)("743d98f5",s,!0)},function(t,e,i){function s(t){for(var e=0;e<t.length;e++){var i=t[e],s=h[i.id];if(s){s.refs++;for(var r=0;r<s.parts.length;r++)s.parts[r](i.parts[r]);for(;r<i.parts.length;r++)s.parts.push(n(i.parts[r]));s.parts.length>i.parts.length&&(s.parts.length=i.parts.length)}else{for(var o=[],r=0;r<i.parts.length;r++)o.push(n(i.parts[r]));h[i.id]={id:i.id,refs:1,parts:o}}}}function r(){var t=document.createElement("style");return t.type="text/css",d.appendChild(t),t}function n(t){var e,i,s=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(s){if(f)return v;s.parentNode.removeChild(s)}if(m){var n=c++;s=p||(p=r()),e=o.bind(null,s,n,!1),i=o.bind(null,s,n,!0)}else s=r(),e=l.bind(null,s),i=function(){s.parentNode.removeChild(s)};return e(t),function(s){if(s){if(s.css===t.css&&s.media===t.media&&s.sourceMap===t.sourceMap)return;e(t=s)}else i()}}function o(t,e,i,s){var r=i?"":s.css;if(t.styleSheet)t.styleSheet.cssText=g(e,r);else{var n=document.createTextNode(r),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(n,o[e]):t.appendChild(n)}}function l(t,e){var i=e.css,s=e.media,r=e.sourceMap;if(s&&t.setAttribute("media",s),r&&(i+="\n/*# sourceURL="+r.sources[0]+" */",i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}var a="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!a)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var u=i(9),h={},d=a&&(document.head||document.getElementsByTagName("head")[0]),p=null,c=0,f=!1,v=function(){},m="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());t.exports=function(t,e,i){f=i;var r=u(t,e);return s(r),function(e){for(var i=[],n=0;n<r.length;n++){var o=r[n],l=h[o.id];l.refs--,i.push(l)}e?(r=u(t,e),s(r)):r=[];for(var n=0;n<i.length;n++){var l=i[n];if(0===l.refs){for(var a=0;a<l.parts.length;a++)l.parts[a]();delete h[l.id]}}}};var g=function(){var t=[];return function(e,i){return t[e]=i,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t,e){for(var i=[],s={},r=0;r<e.length;r++){var n=e[r],o=n[0],l=n[1],a=n[2],u=n[3],h={id:t+":"+r,css:l,media:a,sourceMap:u};s[o]?s[o].parts.push(h):i.push(s[o]={id:o,parts:[h]})}return i}}])});
},{}],331:[function(require,module,exports){
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
},{"_process":327}],332:[function(require,module,exports){
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

},{}],333:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("::-webkit-scrollbar {\n    width: 0;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n    -webkit-border-radius: 10px;\n    border-radius: 10px;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n    opacity:0.1;\n    -webkit-border-radius: 10px;\n    border-radius: 10px;\n    background: rgba(0,0,0,0.5);\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);\n}\n\n#webDollar{\n    font-family: 'avenir',sans-serif;\n}")
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
    hotAPI.createRecord("data-v-0b73f08c", __vue__options__)
  } else {
    hotAPI.reload("data-v-0b73f08c", __vue__options__)
  }
})()}
},{"./Mining/Mining.vue":334,"./Wallet/Wallet.vue":350,"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],334:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("#miningLoader{\n    vertical-align: top;\n    width: 30px;\n    height: 30px;\n}\n\n#dashboardMining{\n    overflow: hidden;\n    position: fixed;\n    bottom: 0px;\n    height: 33px;\n    background-color: #262626;\n    display: block;\n    left: 0;\n    padding-bottom: 3px;\n    right: 0;\n    z-index: 95;\n    border-top: solid 1px #444444;\n}\n\n.miningPowerThreads{\n    font-size: 14px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 8px;\n    text-transform: uppercase;\n    padding-bottom: 5px;\n    color: #fff;\n    letter-spacing: 5px;\n    margin: 0;\n}\n\n\n.walletStartMining{\n    position: relative;\n    display: inline-block!important;\n    vertical-align: top;\n    left: 0;\n    right: 0;\n    font-size: 20px;\n    color: #f20;\n    display: inline-block;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n\n.walletStartMining a{\n    padding-top: 5px;\n    display: block;\n    color: #000;\n}\n\n.walletStartMining a:hover{\n    color: #ffc12c;\n}\n\n.walletStartMining:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n\n.minningController p{\n    font-size: 20px;\n    margin-right: -4px;\n}\n\n#miningDetails{\n    vertical-align: top;\n    display: inline-block;\n    line-height: 32px;\n    margin-top: 1;\n}\n\n#miningDetails p{\n    margin-top: 0;\n    font-size: 12px;\n    color: #D5D5D5;\n}\n\n#threadsControll{\n    display: inline-block;\n    vertical-align: top;\n    width: 100%;\n    background-color: #1f1f1f;\n}\n\n#threadsControll .leftButton {\n    float: left;\n}\n\n#threadsControll .rightButton {\n    float: right;\n}\n\n#threadsControll .button p{\n    padding-top: 3px;\n    padding-bottom: 4px;\n    line-height: 27px;\n    margin: 0;\n}\n\n#allWalets{\n    /*border-top: solid 1px #7b7b7b;*/\n    display: block;\n    /*padding-top: 10px;*/\n}\n\n\n.miningPowerText{\n    font-size: 10px;\n    display: inline-block;\n    padding: 0 10px;\n    vertical-align: top;\n    padding-top: 5px;\n    margin: 0;\n    color: #fff;\n}\n\n\n.miningPowerText .secondWord{\n    height: auto;\n    line-height: 10px;\n    margin: 0;\n    font-weight: bold;\n    color: #fff;\n    margin-right: -4px;\n}\n\n\n#threadsControll .button{\n    display: inline-block;\n    background-color: #1f1f1f;\n    color: #fff;\n    font-size: 26px;\n    border: solid 1px #565656;\n    width: 31px;\n    border-top: none;\n    border-bottom: none;\n    text-align: center;\n    cursor: pointer;\n    transition: all .3s linear;\n}\n\n#threadsControll .button:hover{\n    background-color: #000;\n    transition: all .3s linear;\n}\n\n#threadsControll .button:first-child{\n    margin-top: 0;\n}\n\n#threadsNumber{\n    font-size: 20px;\n    padding: 0 10px;\n    text-align: center;\n    padding-bottom: 8px;\n    line-height: 25px;\n    display: inline-block;\n    color: #fff;\n    background-color: #d23c25;\n    vertical-align: top;\n    padding-top: 6px;\n    border-right: solid 1px #444;\n    width: 40px;\n    padding-left: 0;\n    padding-right:0;\n}\n\n.whiteText{\n    color: #c5c5c5;\n    font-weight: 100;\n}\n\n#minningController{\n    border-top:none;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n    vertical-align: top;\n}\n\n#createWalletAddress{\n    border: solid 1px #7b7b7b;\n    padding-bottom: 0;\n    margin-bottom: 15px;\n    display: inline-block;\n}\n\n#createWalletAddress p:hover{\n    background-color: #191919;\n    transition: all .3s linear;\n}\n\n#createWalletAddress p{\n    padding: 10px;\n    padding-top: 14px;\n    background-color: #353535;\n    color: #bbb;\n    display: inline-block;\n    width: 214px;\n    cursor: pointer;\n    text-align: center;\n    transition: all .3s linear;\n}\n\n.WEBD{\n    display: inline-block;\n    margin-left: 20px;\n    font-size: 20px;\n    color: #fec02c;\n    vertical-align: top;\n    margin-top: 0;\n    float: right;\n    min-width: 300px;\n    text-align: center;\n    border-left: solid 1px #444444;\n    padding-top: 6px;\n}\n\n#miningDetails p{\n    display: inline-block;\n}\n\n@media only screen and (max-width : 831px) {\n\n    .show-balance-span{\n        font-size: 20px;\n    }\n\n    #dashboardMining{\n        margin-bottom: 0;\n    }\n    #minningController, .walletStartMining, .WEBD{\n        display: inline-block;\n        width: 100%;\n    }\n    #minningController{\n        background-color: #0000;\n        margin-bottom: 0;\n        height: 33px;\n        width: 400px;\n        border-top: none;\n        margin-top: 50px;\n    }\n    .walletStartMining{\n        margin-top: -86px;\n    }\n    #threadsControll .button p{\n        line-height: 43px;\n    }\n    #threadsControll .button{\n        width: 80px;\n    }\n    .miningPowerThreads{\n        line-height: 38px;\n        font-size: 16px;\n        margin-right: -4px;\n    }\n    #miningDetails{\n        display: none;\n    }\n    .miningPowerText{\n        display: none;\n    }\n    #threadsNumber{\n        margin: 0 auto;\n        text-align: center;\n        float:left;\n        position: relative;\n        display: block;\n        line-height: 34px;\n        width: 35px;\n        padding-top: 6px;\n        padding-left: 0;\n    }\n    .WEBD{\n        margin-top: -38px;\n        text-align: right;\n        margin-right: 10px;\n    }\n    .miningPowerThreads{\n        display:none;\n    }\n    #threadsControll .button{\n        float:left;\n    }\n    .walletStartMining{\n        margin-top:-29px;\n        margin-left:40px;\n    }\n    #threadsControll{\n        background-color: #f200;\n    }\n    #threadsControll .button p {\n        line-height: 35px;\n        font-size: 35px;\n        padding-top: 7px;\n    }\n    #threadsControll .button:first-child{\n        border:none;\n    }\n    #minningController{\n        margin-top:0\n    }\n    #dashboardMining{\n        height:40px;\n    }\n    .walletStartMining:hover{\n        background-color: #f200;\n    }\n\n}\n\n@media only screen and (max-width : 451px) {\n\n    .whiteText{\n        display: none;\n    }\n\n    #threadsControll .button{\n        width: 50px;\n    }\n\n    .WEBD{\n        margin-top: -38px;\n        font-size:14px;\n    }\n\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ShowBalance = require("../Wallet/Address/Balance/ShowBalance.vue");

var _ShowBalance2 = _interopRequireDefault(_ShowBalance);

var _slider = require("./slider.vue");

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {

    name: 'Mining',

    components: {
        "ShowBalance": _ShowBalance2.default,
        "slider": _slider2.default
    },

    data: function data() {
        return {

            started: false,
            hashesPerSecond: 0,
            workers: 0,
            minerAddress: ''
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

        WebDollar.Blockchain.Mining.emitter.on("mining/workers-changed", function (workers) {

            _this.workers = workers;
        });

        this.minerAddress = WebDollar.Blockchain.Mining.minerAddressBase;
        console.log("mining/miner-address-changed", this.minerAddress);
        WebDollar.Blockchain.Mining.emitter.on("mining/miner-address-changed", function (minerAddress) {
            console.log("mining/miner-address-changed", minerAddress);
            _this.minerAddress = minerAddress;
        });
    },


    methods: {
        startStopMining: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:

                                if (!WebDollar.Blockchain.Mining.started) WebDollar.Blockchain.Mining.startMining();else WebDollar.Blockchain.Mining.stopMining();

                                return _context.abrupt("return", true);

                            case 2:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function startStopMining() {
                return _ref.apply(this, arguments);
            }

            return startStopMining;
        }(),
        destroyOneMiningWorker: function destroyOneMiningWorker(number) {

            WebDollar.Blockchain.Mining.decreaseWorkers(number || 1);
        },
        createOneMiningWorker: function createOneMiningWorker(number) {

            WebDollar.Blockchain.Mining.increaseWorkers(number || 1);
        },
        changeWorkers: function changeWorkers(value) {

            WebDollar.Blockchain.Mining.setWorkers(value);
        }
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"walletSection",attrs:{"id":"dashboardMining"}},[_c('div',{attrs:{"id":"minningController"}},[_vm._m(0),_vm._v(" "),_c('strong',{style:({background: this.workers ? 0 : '#d23c25'}),attrs:{"id":"threadsNumber"}},[_vm._v(_vm._s(this.workers))])]),_vm._v(" "),_c('div',{staticClass:"walletStartMining",attrs:{"type":"button"}},[_c('slider',{on:{"sliderChanged":this.changeWorkers}})],1),_vm._v(" "),_c('div',{attrs:{"id":"miningDetails"}},[_c('p',{style:({display: this.hashesPerSecond==0 && this.started==true ? 'none' : 'inline-block'})},[_vm._v(_vm._s(this.started ? this.hashesPerSecond + ' hashes/sec' : 'not started')+" ")]),_vm._v(" "),_c('svg',{staticStyle:{"enable-background":"new 0 0 50 50"},style:({display: this.hashesPerSecond==0 && this.started==true ? 'inline-block' : 'none'}),attrs:{"version":"1.1","id":"miningLoader","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","x":"0px","y":"0px","width":"40px","height":"40px","viewBox":"0 0 50 50","xml:space":"preserve"}},[_c('path',{attrs:{"fill":"#fec02c","d":"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"}},[_c('animateTransform',{attrs:{"attributeType":"xml","attributeName":"transform","type":"rotate","from":"0 25 25","to":"360 25 25","dur":"0.6s","repeatCount":"indefinite"}})],1)])]),_vm._v(" "),_c('p',{staticClass:"WEBD"},[_c('ShowBalance',{attrs:{"address":this.minerAddress,"currency":"0x01"}}),_vm._v(" "),_c('b',{staticClass:"whiteText"},[_vm._v("WBD MINED")])],1)])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"miningPowerText"},[_vm._v("Mining "),_c('br'),_vm._v(" "),_c('span',{staticClass:"secondWord"},[_vm._v("Power")])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f2777896", __vue__options__)
  } else {
    hotAPI.reload("data-v-f2777896", __vue__options__)
  }
})()}
},{"../Wallet/Address/Balance/ShowBalance.vue":347,"./slider.vue":335,"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],335:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".miningSlider {\n    padding-top: 15px !important;\n    padding-bottom: 15px !important;\n    padding-left: 20px !important;\n    background-color: #262626;\n}\n\n.vue-slider-component .vue-slider-piecewise {\n    background-color: #424242 !important;\n}\n\n.vue-slider-component .vue-slider-process {\n    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fec02c+29,bc0505+100 */\n    background: #fec02c !important; /* Old browsers */\n    background: -moz-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* FF3.6-15 */\n    background: -webkit-linear-gradient(left, #fec02c 29%, #bc0505 100%) !important; /* Chrome10-25,Safari5.1-6 */\n    background: linear-gradient(to right, #fec02c 29%, #bc0505 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fec02c', endColorstr='#bc0505', GradientType=1) !important; /* IE6-9 */\n}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vueSliderComponent = require('./../../../node_modules/vue-slider-component');

var _vueSliderComponent2 = _interopRequireDefault(_vueSliderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: 'slider',

    components: {
        "vueSlider": _vueSliderComponent2.default
    },

    data: function data() {
        return {
            value: 0,
            screenWidth: window.innerWidth,
            logicalProcessors: 8
        };
    },


    methods: {
        change: function change(value) {

            console.log("value", value);

            if (value > (this.value || 1) * 3) {

                value = (this.value || 1) * 3;
                this.$refs['slider'].setValue(value);
                return;
            }

            this.$emit('sliderChanged', value);
        },
        addEvent: function addEvent(object, type, callback) {
            if (object === null || typeof object === 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on" + type] = callback;
            }
        }
    },

    mounted: function mounted() {
        var _this = this;

        if (typeof window === "undefined") return false;

        this.addEvent(window, "resize", function (event) {

            _this.screenWidth = window.innerWidth;
        });

        this.screenWidth = window.innerWidth;

        this.logicalProcessors = window.navigator.hardwareConcurrency === undefined ? 8 : 2 * window.navigator.hardwareConcurrency;
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('vue-slider',{ref:"slider",staticClass:"miningSlider",attrs:{"piecewise":true,"width":this.screenWidth < 750 ? 180 : 330,"tooltip":false,"min":0,"max":this.logicalProcessors},on:{"callback":this.change},model:{value:(_vm.value),callback:function ($$v) {_vm.value=$$v},expression:"value"}})],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-67d2b7a6", __vue__options__)
  } else {
    hotAPI.reload("data-v-67d2b7a6", __vue__options__)
  }
})()}
},{"./../../../node_modules/vue-slider-component":330,"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],336:[function(require,module,exports){
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
    hotAPI.createRecord("data-v-7083df22", __vue__options__)
  } else {
    hotAPI.reload("data-v-7083df22", __vue__options__)
  }
})()}
},{"./res/svg-chevron-down.vue":337,"./res/svg-chevron-up.vue":338,"./res/svg-key.vue":339,"./res/svg-lock-closed.vue":340,"./res/svg-lock-open.vue":341,"./res/svg-plus-square.vue":342,"./res/svg-plus.vue":343,"./res/svg-x.vue":344,"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],337:[function(require,module,exports){
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
    hotAPI.createRecord("data-v-801f3c7c", __vue__options__)
  } else {
    hotAPI.reload("data-v-801f3c7c", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],338:[function(require,module,exports){
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
    hotAPI.createRecord("data-v-ca422d8a", __vue__options__)
  } else {
    hotAPI.reload("data-v-ca422d8a", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],339:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"width":"24","height":"24","xmlns":"http://www.w3.org/2000/svg","fill-rule":"evenodd","clip-rule":"evenodd"}},[_c('path',{attrs:{"d":"M12.804 9c1.038-1.793 2.977-3 5.196-3 3.311 0 6 2.689 6 6s-2.689 6-6 6c-2.219 0-4.158-1.207-5.196-3h-3.804l-1.506-1.503-1.494 1.503-1.48-1.503-1.52 1.503-3-3.032 2.53-2.968h10.274zm7.696 1.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bc9d1efe", __vue__options__)
  } else {
    hotAPI.reload("data-v-bc9d1efe", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],340:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-75d308f0", __vue__options__)
  } else {
    hotAPI.reload("data-v-75d308f0", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],341:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-21c579ce", __vue__options__)
  } else {
    hotAPI.reload("data-v-21c579ce", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],342:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7 14h-5v5h-4v-5h-5v-4h5v-5h4v5h5v4z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-31ac2c52", __vue__options__)
  } else {
    hotAPI.reload("data-v-31ac2c52", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],343:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b065d68", __vue__options__)
  } else {
    hotAPI.reload("data-v-0b065d68", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],344:[function(require,module,exports){
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"webdollarFont",attrs:{"xmlns":"http://www.w3.org/2000/svg","width":"24","height":"24","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"}})])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6b1d4ecc", __vue__options__)
  } else {
    hotAPI.reload("data-v-6b1d4ecc", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329}],345:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".modal input:focus, .modal textarea:focus{\n    outline: none;\n}\n\n.modal{\n    width: 50%;\n    height: auto;\n    border-radius: 5px;\n    max-width: 550px;\n    min-width: 450px;\n    position: fixed;\n    margin: 0 auto;\n    border: solid 1px #313131;\n    left: 0;\n    right: 0;\n    text-align: center;\n    background-color: #1f1f1f;\n    z-index: 1600;\n    top: 50%;\n    transform: translateY(-50%);\n}\n\n.modal #walletID{\n    word-wrap: break-word;\n    display: block;\n    line-height: 12px;\n    margin: 10px 0;\n    font-weight: 100;\n}\n\n.modalBackground{\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    display: block;\n    z-index: 1000;\n    top:0;\n    left: 0;\n    background-color: rgba(0, 0, 0, 0.83);\n}\n\n.modal .close{\n    position: fixed;\n    top: -10px;\n    right: 10px!important;\n    font-size: 40px;\n    display: block;\n    color: #ffc12c;\n    cursor: pointer;\n}\n\n.modal .title{\n    background-color: #262626;\n    padding: 10px 0;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    line-height: 22px;\n    color: #ffc12c;\n}\n\n.modal .footer .button{\n    display: inline;\n    cursor: pointer;\n}\n\n.modal b{\n    margin-left: 0;\n}\n\n.modal .twoColums{\n    border-bottom: solid 1px #313131;\n    background-color: #151515;\n}\n\n.modal .ballance{\n    color: #ffc12c!important;\n    font-size: 24px;\n    margin-top: 20px;\n}\n\n.modal .transfer{\n    padding: 0 10px;\n}\n\n.modal .transfer input{\n    border: none;\n    background-color: #333333;\n    padding: 10px 0 10px 10px;\n    margin: 10px 0;\n    color: #fff\n}\n\n.modal .transfer .adress{\n    width: 100%;\n    display: block;\n}\n\n.modal .transfer .amount {\n    width: 100%;\n}\n\n.modal .transfer .title{\n    background-color: #1f1f1f;\n    padding-top: 30px;\n    text-transform: uppercase;\n    letter-spacing: 4px;\n    padding-bottom: 20px;\n    color: #d4d4d4;\n}\n\n.modal .transfer .button{\n    margin-top: 10px;\n    background-color: #ffc12c;\n    color: #1f1f1f;\n    margin-bottom: 15px;\n    width: 100%;\n    font-size: 14px;\n    border: none;\n    padding: 15px 0 15px 0;\n    border-radius: 5px;\n    transition: all 0.5s ease;\n}\n\n.modal .transfer .button:hover{\n    background-color: #fbdb8d;\n    color: #000000;\n    transition: all 0.5s ease\n}\n\n.twoColums{\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n}\n\n.adressActions{\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr 1fr;\n    border-bottom: solid 1px #313131;\n    border-top: solid 3px #000;\n}\n\n.adressActions .actionButton{\n    display: inline-block;\n    background-color: #333;\n    color: #ffc12c;\n    padding: 5px;\n    padding-top: 8px;\n    border-left: solid 1px #6d6d6d;\n    border-collapse: collapse;\n    transition: all 0.5s ease\n}\n\n.adressActions .actionButton:hover{\n    background-color: #232222;\n    color: #ffdd8c;\n    transition: all 0.5s ease\n}\n\n.adressActions .actionButton:first-child{\n    border-left:none;\n}\n\n.activeActionButton{\n    background-color: #ffc12c!important;\n    color: #000!important;\n}\n\n.twoColums .section{\n    overflow: hidden;\n    padding: 20px;\n    color: #D5D5D5;\n}\n\n.twoColums .section:first-child{\n    border-right: solid 1px #313131;\n}\n\n.copyToClipboard{\n    background-color: #353535;\n    border-radius: 5px;\n    padding: 7px 0 5px 0;\n    border: solid 1px #777;\n    font-size: 12px;\n    padding: 7px 0 5px 0;\n    width: 150px;\n    margin: 0 auto;\n    transition: all 0.5s ease\n}\n\n.copyToClipboard:hover{\n    background-color: #000;\n    transition: all 0.5s ease\n}\n\n.copyToClipboardSuccess{\n    color: #149008;\n    font-size: 14px;\n}\n\n.transferListContainer{\n    list-style: none;\n    padding: 0;\n    max-height: 200px;\n    overflow: scroll;\n}\n\n.transferListElement{\n    font-size: 12px;\n    color: #fff;\n    list-style: none;\n    display: grid;\n    grid-template-columns: 1fr 2fr;\n    grid-column-gap: 15px;\n    white-space: nowrap ;\n    text-align: left;\n    background-color: #151515;\n    padding: 5px 10px;\n}\n\n.destinations{\n    list-style: none;\n    padding: 0;\n}\n\n.money, .destinationAdress{\n    display: inline-block;\n}\n\n.destinationAdress{\n    width: 70%;\n    overflow: hidden;\n}\n\n.money{\n    width: 20%;\n    padding-left: 10px;\n    display: inline-block;\n    float: right;\n    text-align: right;\n}\n\n.currency{\n    margin-left: 5px;\n}\n\n.pairListElement{\n    background-color: #333333;\n}\n\n.transferListContainer .money{\n    color:#ffc12c;\n}\n\n.transferListContainer .source{\n    color: #c5c5c5;\n}\n\n.transferList .header{\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n}\n\n.headerElement{\n    display: inline-block;\n    text-align: center;\n    color: #d4d4d4;\n    margin-top: 15px;\n    font-size: 14px;\n}\n\n@media (max-width:831px){\n\n    #walletID{\n        font-size: 12px!important;\n        line-height: 14px!important;\n    }\n\n}\n\n@media (max-width:600px)  {\n\n    .modal{\n        width: 100%;\n        max-width: none;\n        min-width: none;\n        max-height: 100%;\n        overflow-y: auto;\n    }\n    .twoColums{\n        display: inline-block;\n    }\n    .twoColums .section:first-child {\n        border-bottom: solid 1px #313131;\n        border-right: none;\n    }\n    .modal .ballance{\n        margin-top: 0;\n    }\n    .adressActions .actionButton{\n        line-height: 50px;\n        font-size: 20px;\n    }\n    .modal .transfer input{\n        padding: 15px 0 15px 10px;\n        font-size: 16px;\n    }\n    .modal .transfer .button{\n        line-height: 26px;\n        font-size: 20px;\n        margin-bottom: 50px;\n    }\n    .modal .title{\n        padding: 20px 0;\n    }\n    .modal .close{\n        top:0;\n        right: 30px!important;\n    }\n    .modal .twoColums{\n        width: 100%;\n        grid-template-columns: 1fr;\n    }\n    .modal{\n        min-width: auto;\n    }\n}")
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
    hotAPI.createRecord("data-v-73921f4c", __vue__options__)
  } else {
    hotAPI.reload("data-v-73921f4c", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],346:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("#allWalets .walletAddress{\n    padding: 0!important;\n    padding-right: 0;\n    width: 100%;\n    cursor: pointer;\n    border-top-left-radius: 50px;\n    border-bottom-left-radius: 50px;\n    margin: 15px 10px;\n    transition: all .3s linear;\n}\n\n#allWalets .walletAddress:last-child{\n    margin-bottom: 1px;\n}\n\n#allWalets .walletAddress img{\n    height: 40px;\n    display: inline-block;\n    vertical-align: top;\n    border-radius: 100%;\n}\n\n#allWalets .walletAddress:hover{\n    margin: 15px 20px;\n    background-color: #313131;\n    transition: all .3s linear;\n}\n\n.walletAddress b{\n    text-align: center;\n    display: inline-block;\n    color: #fddb0c;\n    line-height: 40px;\n    padding-top: 1px;\n    margin-left: 7px;\n    font-size: 12px;\n    vertical-align: top;\n}")
;(function(){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _TransactionModal = require("./Transactions/Transaction.modal.vue");

var _TransactionModal2 = _interopRequireDefault(_TransactionModal);

var _ShowBalance = require("./Balance/ShowBalance.vue");

var _ShowBalance2 = _interopRequireDefault(_ShowBalance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    props: {
        address: { default: '' }
    },

    components: {
        "TransactionModal": _TransactionModal2.default,
        "ShowBalance": _ShowBalance2.default
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
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"walletAddress",on:{"click":function($event){$event.stopPropagation();_vm.handleTransferFunds($event)}}},[_c('img',{staticClass:"walletAddressImage",attrs:{"src":this.getAddressPic}}),_vm._v(" "),_c('b',[_c('ShowBalance',{attrs:{"address":this.address,"currency":"0x01"}}),_vm._v(" WBD")],1),_vm._v(" "),_c('TransactionModal',{ref:"refTransactionModal",attrs:{"address":this.address}})],1)}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0c05c9cd", __vue__options__)
  } else {
    hotAPI.reload("data-v-0c05c9cd", __vue__options__)
  }
})()}
},{"./Balance/ShowBalance.vue":347,"./Transactions/Transaction.modal.vue":349,"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],347:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".show-balance-span{\n    display: inline-block;\n    margin-right: 4px;\n    color: #fec02c;\n    vertical-align: top;\n    margin-top: 0;\n    text-align: center;\n}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = {

    name: "ShowBalance",

    props: ['address', 'currency'],

    data: function data() {
        return {
            balances: {},
            subscription: null
        };
    },
    mounted: function mounted() {
        var _this = this;

        if (typeof window === "undefined") return;

        this.currency = this.currency || '0x01';

        if (_typeof(this.address) === "object" && _typeof(this.address.hasOwnProperty("balances"))) {
            this.balances = this.address.balances;
            return;
        }

        var data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(this.address, function (data) {
            _this.balances = data.balances;
        });

        if (data !== null) {
            this.subscription = data.subscription;
            this.balances = data.balances;
        }
    },


    watch: {
        address: function address(newVal, oldVal) {
            var _this2 = this;

            if ((typeof newVal === 'undefined' ? 'undefined' : _typeof(newVal)) === "object" && _typeof(newVal.hasOwnProperty("balances"))) {
                this.balances = newVal.balances;
                return;
            }

            WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.subscription);

            var data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(newVal, function (data) {
                _this2.balances = data.balances;
            });

            if (data !== null) {
                this.subscription = data.subscription;
                this.balances = data.balances;
            }
        },

        currency: function currency(newVal, oldVal) {}
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"show-balance-span"},[_vm._v("\n    "+_vm._s((this.balances !== null && this.balances !== undefined && this.balances.hasOwnProperty(this.currency)) ? Math.round(this.balances[this.currency] * 100000)/100000 : 0)+"\n")])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cf6c92b6", __vue__options__)
  } else {
    hotAPI.reload("data-v-cf6c92b6", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],348:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".show-sum-balances{\n    display: inline;\n    color: #1f1f1f;\n}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {

    name: "ShowSumBalances",

    props: ['addresses', 'currency'],

    data: function data() {
        return {
            sum: 0
        };
    },
    mounted: function mounted() {},


    methods: {
        refreshSum: function refreshSum(addresses, currency) {

            var newSum = 0;

            if (addresses === undefined || addresses === null) return;

            for (var index in this.addresses) {

                if (addresses[index].balances !== undefined && addresses[index].balances !== null && addresses[index].balances[currency] !== undefined) newSum += parseFloat(addresses[index].balances[currency]);
            }

            this.sum = newSum;
        }
    },

    watch: {
        addresses: function addresses(newVal, oldVal) {

            console.log('changed to new', newVal);
            this.refreshSum(newVal, this.currency);
        },

        currency: function currency(newVal, oldVal) {

            this.refreshSum(this.addresses, newVal);
        }
    }

};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"show-sum-balances"},[_vm._v("\n    "+_vm._s(Math.round(this.sum * 100000)/100000)+"\n")])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c5b9ce6a", __vue__options__)
  } else {
    hotAPI.reload("data-v-c5b9ce6a", __vue__options__)
  }
})()}
},{"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],349:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Modal = require('../../../UI/modal/Modal.vue');

var _Modal2 = _interopRequireDefault(_Modal);

var _vClipboard = require('./../../../../../node_modules/v-clipboard');

var _vClipboard2 = _interopRequireDefault(_vClipboard);

var _ShowBalance = require('../Balance/ShowBalance.vue');

var _ShowBalance2 = _interopRequireDefault(_ShowBalance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vue = require('vue');

Vue.use(_vClipboard2.default);

exports.default = {

    props: {

        address: { default: null },
        toAddress: { default: null },
        toAmount: { default: 0.0 }
    },

    components: {
        "Modal": _Modal2.default,
        "ShowBalance": _ShowBalance2.default
    },

    data: function data() {
        return {
            isTransfer: false,
            isSell: false,
            isBuy: false,
            isTransactionList: false,
            clipboardText: 'Copy to Clipboard'
        };
    },

    methods: {
        showTransfer: function showTransfer() {
            this.isTransfer = true;
            this.isSell = false;
            this.isBuy = false;
            this.isTransactionList = false;
        },
        showBuy: function showBuy() {
            this.isTransfer = false;
            this.isSell = false;
            this.isBuy = true;
            this.isTransactionList = false;
        },
        showSell: function showSell() {
            this.isTransfer = false;
            this.isSell = true;
            this.isBuy = false;
            this.isTransactionList = false;
        },
        showTransactions: function showTransactions() {
            this.isTransfer = false;
            this.isSell = false;
            this.isBuy = false;
            this.isTransactionList = true;
        },
        closeModal: function closeModal() {
            this.$refs['refModal'].closeModal();
        },
        showModal: function showModal(e) {
            if (this.$refs['refModal'].modalOpened === false) {
                this.$refs['refModal'].showModal();
            }
        },
        copyToClipboard: function copyToClipboard() {
            this.clipboardText = 'Copied';
            this.$clipboard(this.address);
        }
    },

    mounted: function mounted() {

        this.clipboardText = 'Copy to Clipboard';

        if (typeof window === 'undefined') return;
    }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (this.address !== null && this.address !== undefined)?_c('div',[_c('Modal',{ref:"refModal",attrs:{"title":"Wallet Address"}},[_c('div',{attrs:{"slot":"content"},slot:"content"},[_c('div',{staticClass:"twoColums"},[_c('div',{staticClass:"section"},[_c('div',{staticStyle:{"font-size":"20px"}},[_vm._v("\n                        Address\n                    ")]),_vm._v(" "),_c('b',{staticStyle:{"color":"gray"},attrs:{"id":"walletID"}},[_vm._v(_vm._s(this.address.toString()))]),_vm._v(" "),_c('div',{class:this.clipboardText!='Copied' ? 'copyToClipboard' : 'copyToClipboardSuccess',on:{"click":_vm.copyToClipboard}},[_vm._v("\n                        "+_vm._s(this.clipboardText)+"\n                    ")])]),_vm._v(" "),_c('div',{staticClass:"section"},[_c('div',{staticStyle:{"font-size":"20px"}},[_vm._v("\n                        Balance\n                    ")]),_vm._v(" "),_c('b',{staticClass:"ballance",staticStyle:{"color":"gray"}},[_c('ShowBalance',{attrs:{"address":this.address,"currency":"0x01"}}),_vm._v("WEBD")],1)])]),_vm._v(" "),_c('div',{staticClass:"adressActions"},[_c('div',{class:[ this.isTransfer ? 'actionButton activeActionButton' : 'actionButton' ],on:{"click":this.showTransfer}},[_vm._v("\n                    Transfer\n                ")]),_vm._v(" "),_c('div',{class:[ this.isBuy ? 'actionButton activeActionButton' : 'actionButton' ],on:{"click":this.showBuy}},[_vm._v("\n                    Buy\n                ")]),_vm._v(" "),_c('div',{class:[ this.isSell ? 'actionButton activeActionButton' : 'actionButton' ],on:{"click":this.showSell}},[_vm._v("\n                    Sell\n                ")]),_vm._v(" "),_c('div',{class:[ this.isTransactionList ? 'actionButton activeActionButton' : 'actionButton' ],on:{"click":this.showTransactions}},[_vm._v("\n                    Transactions\n                ")])]),_vm._v(" "),_c('form',{staticClass:"transfer",style:({display: this.isTransfer ? 'block': 'none'})},[_c('p',{staticClass:"title"},[_vm._v("Transfer WBD")]),_vm._v(" "),_c('input',{staticClass:"adress",attrs:{"placeholder":"Recipient Adress"}}),_vm._v(" "),_c('input',{staticClass:"amount",attrs:{"placeholder":"WBD Amount"}}),_vm._v(" "),_c('button',{staticClass:"button",attrs:{"type":"submit"}},[_vm._v("\n                    SEND WBD\n                ")])]),_vm._v(" "),_c('div',{staticClass:"transferList",style:({display: this.isTransactionList ? 'block': 'none'})},[_c('ul',{staticClass:"transferListContainer"},[_c('li',{staticClass:"transferListElement"},[_c('span',{staticClass:"source",attrs:{"title":"Adress Source"}},[_vm._v(" dadsa dasdasdasdas das das")]),_vm._v(" "),_c('ul',{staticClass:"destinations"},[_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("dsad dsaas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])]),_vm._v(" "),_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("ds dsad a dasadas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])])])]),_vm._v(" "),_c('li',{staticClass:"transferListElement pairListElement"},[_c('span',{staticClass:"source",attrs:{"title":"Adress Source"}},[_vm._v(" dadsa dasdasdasdas das das")]),_vm._v(" "),_c('ul',{staticClass:"destinations"},[_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("dsad dsaas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])]),_vm._v(" "),_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("ds dsad a dasadas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])])])]),_vm._v(" "),_c('li',{staticClass:"transferListElement"},[_c('span',{staticClass:"source",attrs:{"title":"Adress Source"}},[_vm._v(" dadsa dasdasdasdas das das")]),_vm._v(" "),_c('ul',{staticClass:"destinations"},[_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("dsad dsaas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])]),_vm._v(" "),_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("ds dsad a dasadas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])])])]),_vm._v(" "),_c('li',{staticClass:"transferListElement pairListElement"},[_c('span',{staticClass:"source",attrs:{"title":"Adress Source"}},[_vm._v(" dadsa dasdasdasdas das das")]),_vm._v(" "),_c('ul',{staticClass:"destinations"},[_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("dsad dsaas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])]),_vm._v(" "),_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("ds dsad a dasadas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])])])]),_vm._v(" "),_c('li',{staticClass:"transferListElement"},[_c('span',{staticClass:"source",attrs:{"title":"Adress Source"}},[_vm._v(" dadsa dasdasdasdas das das")]),_vm._v(" "),_c('ul',{staticClass:"destinations"},[_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("dsad dsaas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])]),_vm._v(" "),_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("ds dsad a dasadas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])])])]),_vm._v(" "),_c('li',{staticClass:"transferListElement pairListElement"},[_c('span',{staticClass:"source",attrs:{"title":"Adress Source"}},[_vm._v(" dadsa dasdasdasdas das das")]),_vm._v(" "),_c('ul',{staticClass:"destinations"},[_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("dsad dsaas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])]),_vm._v(" "),_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("ds dsad a dasadas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])])])]),_vm._v(" "),_c('li',{staticClass:"transferListElement"},[_c('span',{staticClass:"source",attrs:{"title":"Adress Source"}},[_vm._v(" dadsa dasdasdasdas das das")]),_vm._v(" "),_c('ul',{staticClass:"destinations"},[_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("dsad dsaas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])]),_vm._v(" "),_c('li',{staticClass:"destinationElement"},[_c('span',{staticClass:"destinationAdress",attrs:{"title":"Adress Destination"}},[_vm._v("ds dsad a dasadas dasd as das dasd as")]),_vm._v(" "),_c('div',{staticClass:"money",attrs:{"title":"Ammount & Currency"}},[_c('span',{staticClass:"ammount"},[_vm._v("20")]),_c('span',{staticClass:"currency"},[_vm._v("WEBD")])])])])])])]),_vm._v(" "),_c('form',{staticClass:"buy",style:({display: this.isBuy ? 'block': 'none'})},[_c('p',{staticClass:"title"},[_vm._v("Temporary unavailable")])]),_vm._v(" "),_c('form',{staticClass:"sell",style:({display: this.isSell ? 'block': 'none'})},[_c('p',{staticClass:"title"},[_vm._v("Temporary unavailable")])])])])],1):_vm._e()}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3a4d87fa", __vue__options__)
  } else {
    hotAPI.reload("data-v-3a4d87fa", __vue__options__)
  }
})()}
},{"../../../UI/modal/Modal.vue":345,"../Balance/ShowBalance.vue":347,"./../../../../../node_modules/v-clipboard":328,"vue":331,"vue-hot-reload-api":329}],350:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert("#walletButtonText{\n    color: #1f1f1f;\n}\n\n#walletButton {\n    margin: 0 auto;\n    position: fixed;\n    z-index: 85;\n    bottom: 0;\n    width: 299px!important;\n    right: 0;\n    text-align: center;\n    height: 50px;\n    border-top-left-radius: 60px;\n    cursor: pointer;\n    background-color: #fec02c;\n    color: #1f1f1f;\n    margin-bottom: 20px;\n    border: solid 1px #444444;\n    border-right: solid 1px #fec02c;\n    transition: all .3s linear;\n}\n\n#walletButton:hover{\n    background-color: #fec02c;\n    transition: all .3s linear;\n}\n\n.walletSection{\n    display: inline-block;\n    vertical-align: top;\n    height: 315px;\n    overflow-y: auto;\n    overflow-x: hidden;\n    width: 100%;\n}\n\n.walletController{\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    position: relative;\n    width: 100%;\n    border-bottom: solid 1px #333333;\n    background-color: #313131;\n}\n\n.walletController .btn{\n    text-align: center;\n    color: #b5b5b5;\n    padding: 5px 0;\n    cursor: pointer;\n}\n\n.walletController .btn:hover{\n    background-color: #44403f;\n    transition: all .3s linear;\n}\n\n.walletController .btn:first-child{\n    border-right: solid 1px #3c3b3b;\n}\n\n.allWallets div{\n    border: solid 1px #545454;\n}\n\n#walletButton:hover{\n    transition: all .3s linear;\n}\n\n#walletButton span{\n    width: 100%;\n    line-height: 50px;\n    font-size: 20px;\n    font-weight: bolder;\n    transition: all .3s linear;\n}\n\n#walletButton span:hover{\n    transition: all .3s linear;\n}\n\n#walletMenu{\n    margin: 0 auto;\n    position: fixed;\n    bottom: 0;\n    right: 0;\n    width: 300px;\n    background-color: #1f1f1f;\n    height: 358px;\n    margin-bottom:-100px;\n    z-index: 90;\n    border-top: solid 1px #3d3d3d;\n    border-left: solid 1px #444;\n    transition: all .3s linear;\n}\n\n.buttonIcon{\n    display: inline-block;\n    margin-right: 10px;\n}\n\n#walletButton .buttonIcon{\n    fill: #000;\n    transition: all .3s linear;\n}\n\n.walletAddress b{\n    font-weight:100;\n}\n\n/* Small Devices, Tablets */\n@media only screen and (max-width : 831px) {\n    #walletMenu{\n        width: 100%;\n        margin-top: 64px!important;\n    }\n    #walletButton{\n        width: 100%!important;\n        border-radius: 0;\n        border:0;\n        height: 65px;\n        margin-bottom: 90px;\n    }\n    #walletButton span{\n        line-height: 65px;\n        font-size: 26px;\n    }\n    .walletController .btn{\n        padding: 16px 19px 16px 19px!important;\n        margin-left: 10px;\n    }\n    .webdollarFont{\n        width: 24px!important;\n    }\n    #allWalets .walletAddress{\n        margin: 15px 0 0 10px!important;\n    }\n    #allWalets .walletAddress img{\n        height: 60px!important;\n    }\n    .walletAddress b{\n        font-size: 22px!important;\n        line-height: 60px!important;\n    }\n    .walletController{\n        position: relative;\n        width: 100%;\n        border-bottom: solid 5px #333333;\n        background-color: #313131;\n        border-top: solid 5px #313131;\n    }\n}")
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

var _ShowSumBalances = require("./Address/Balance/ShowSumBalances.vue");

var _ShowSumBalances2 = _interopRequireDefault(_ShowSumBalances);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vue = require('vue');

exports.default = {

    components: {
        "icon": _icon2.default,
        "Address": _Address2.default,
        "ShowSumBalances": _ShowSumBalances2.default
    },

    data: function data() {
        return {
            opened: false,
            addresses: [],
            currency: "0x01",

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

        if (typeof window === "undefined") return false;

        this.changeScreenBehavior();

        WebDollar.Blockchain.Wallet.emitter.on("wallet/address-changes", function (address) {
            console.log("wallet/address-changes", address);
            _this.addNewAddress(address);
        });

        WebDollar.Blockchain.Wallet.emitter.on("wallet/changes", function () {
            _this.loadAllAddresses();
        });

        _Browser2.default.addEvent(window, "load", function (event) {
            _this.changeScreenBehavior();
        });

        _Browser2.default.addEvent(window, "resize", function (event) {
            _this.changeScreenBehavior();
        });

        this.loadAllAddresses();
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
                this.walletMenuHeightClosed = '0';
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

            for (var _i = 0; _i < this.addresses.length; _i++) {
                if (address.toString() === this.addresses[_i].address.toString()) {
                    return false;
                }
            }this.addAddressToWalletWatch(address);
        },
        loadAllAddresses: function loadAllAddresses() {

            for (var index in this.addresses) {
                WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[index].subscription);
            }

            this.addresses = [];

            for (var _i2 = 0; _i2 < WebDollar.Blockchain.Wallet.addresses.length; _i2++) {
                this.addAddressToWalletWatch(WebDollar.Blockchain.Wallet.addresses[_i2].address);
            }
        },
        addAddressToWalletWatch: function addAddressToWalletWatch(address) {
            var _this2 = this;

            var data = WebDollar.Blockchain.Balances.subscribeBalancesChanges(address, function (data) {

                for (var _i3 = 0; _i3 < _this2.addresses.length; _i3++) {
                    if (_this2.addresses[_i3].address === address) {

                        _this2.addresses[_i3].balances = data.balances;
                        _this2.addresses[_i3] = Object.assign({}, _this2.addresses[_i3], {});
                        _this2.$refs['showSumBalances'].refreshSum(_this2.addresses, _this2.currency);

                        break;
                    }
                }

                _this2.$forceUpdate();
            });

            if (data !== null) {

                var element = { address: address, balances: data.balances, subscription: data.subscription };
                this.addresses.push(element);
            }
        },
        deleteAddress: function deleteAddress(address) {

            if (address === null || address === undefined) return false;

            for (var keyAddress in this.addresses) {
                if (address.toString() === this.addresses[keyAddress].address.toString()) {

                    WebDollar.Blockchain.Balances.unsusbribeBalancesChanges(this.addresses[keyAddress].subscription);
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
                top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose}),attrs:{"id":"walletButton"},on:{"click":this.toggleWallet}},[_c('span',{attrs:{"id":"walletButtonText"}},[_c('icon',{staticClass:"buttonIcon",attrs:{"icon":this.opened ? 'chevron-down' : 'chevron-up'}}),_vm._v("\n            Wallet\n            "),_c('ShowSumBalances',{ref:"showSumBalances",attrs:{"addresses":this.addresses,"currency":this.currency}})],1)]),_vm._v(" "),_c('div',{ref:"walletMenu",style:({
                marginBottom: this.opened ? this.walletMarginOpened+'px': this.walletMarginClosed+'px',
                top: this.opened ? this.buttonTopDistanceOpen : this.buttonTopDistanceClose,
                marginTop: this.opened ? this.walletMenuMarginTopOpen : this.walletMenuMarginTopClose,
                height: this.opened ? this.walletMenuHeightOpen : this.walletMenuHeightClosed}),attrs:{"id":"walletMenu"}},[_c('div',{attrs:{"id":"dashboardWallet"}},[_c('div',{staticClass:"walletController"},[_c('div',{staticClass:"btn",on:{"click":this.handleAddNewAddress}},[_vm._v("\n                    Add Adress\n                ")]),_vm._v(" "),_c('div',{staticClass:"btn",on:{"click":this.handleLockWallet}},[_vm._v("\n                    Lock Wallet\n                ")])]),_vm._v(" "),_c('div',{staticClass:"walletSection walletsContainer"},[_c('div',{attrs:{"id":"allWalets"}},_vm._l((this.addresses),function(walletAddress){return _c('Address',{key:walletAddress.address,staticStyle:{"padding-right":"20px"},attrs:{"id":'address'+walletAddress.address,"address":walletAddress.address}})}))])])])])}
__vue__options__.staticRenderFns = []
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  module.hot.dispose(__vueify_style_dispose__)
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3d2b9395", __vue__options__)
  } else {
    hotAPI.reload("data-v-3d2b9395", __vue__options__)
  }
})()}
},{"../../helpers/Browser.helpers":351,"../UI/icons/icon.vue":336,"./Address/Address.vue":346,"./Address/Balance/ShowSumBalances.vue":348,"vue":331,"vue-hot-reload-api":329,"vueify/lib/insert-css":332}],351:[function(require,module,exports){
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

},{}],352:[function(require,module,exports){
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
            id: "WebDollarMap"
        };

        this.mining = {
            activated: true,
            style: "dark",
            id: "WebDollar"
        };

        this.wallet = {
            activated: true,
            style: "dark",
            id: "WebDollar"
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

},{"../helpers/Browser.helpers":351,"../maps/Google-Maps/Network-Google-Maps.js":356,"../maps/Native-Map/Network-Native-Map":360,"../maps/Native-Map/Network-Native-Map-DOM":359,"./global-initialize/Global-Initialization":353}],353:[function(require,module,exports){
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

            if (document.getElementById("WebdollarFont") === null) document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", "<link id=\"WebdollarFont\" href=\"public/assets/fonts/avenir-light.woff\" rel=\"stylesheet\">");

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

},{"../../helpers/Browser.helpers":351}],354:[function(require,module,exports){
(function (global){
'use strict';

var _Dashboard = require('./components/Dashboard.vue');

var _Dashboard2 = _interopRequireDefault(_Dashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof window !== 'undefined' && !window._babelPolyfill || typeof global !== 'undefined' && !global._babelPolyfill) {
    require('babel-polyfill');
}

var Vue = require('vue');

// window.onload = () => {
//
//     if (document.getElementById('WebDollar') === null)
//         document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", `<div id="WebDollar" > </div>`);
//
//     new Vue({
//         el: '#WebDollar',
//         render: h => h(Dashboard)
//     })
//
// };

//for safari workaround
document.addEventListener("DOMContentLoaded", function (event) {
    if (document.getElementById('WebDollar') === null) document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", '<div id="WebDollar" > </div>');

    new Vue({
        el: '#WebDollar',
        render: function render(h) {
            return h(_Dashboard2.default);
        }
    });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/Dashboard.vue":333,"babel-polyfill":1,"vue":331}],355:[function(require,module,exports){
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
},{"./helpers/Browser.helpers":351,"./initialize-params/Initialize-Params":352,"./main-vue":354,"./maps/Google-Maps/Network-Google-Maps.js":356,"./maps/Native-Map/Network-Native-Map":360,"./mining/Mining":368,"./wallet/Wallet":369}],356:[function(require,module,exports){
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

},{"./../Maps.tester":358,"./styles/network-map-style-light":357}],357:[function(require,module,exports){
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

},{}],358:[function(require,module,exports){
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

},{}],359:[function(require,module,exports){
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

},{"./res/network-native-map-dialog.html":365,"./res/network-native-map.html":366,"./res/network-native.css":367}],360:[function(require,module,exports){
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

            mapSelector = (mapSelector || '#WebDollarMap') + ' svg';

            this._mapElem = document.querySelector(mapSelector);
            if (this._mapElem === null) {
                throw "map is not specified. Invalid selector" + mapSelector + ". Try '#WebDollarMap svg'";
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

},{"./../Maps.tester":358,"./helpers/Cell-Counter":361,"./helpers/Circle-Map":362,"./helpers/Map-Modal":363}],361:[function(require,module,exports){
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

},{}],362:[function(require,module,exports){
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

},{"./RobinsonProjection":364}],363:[function(require,module,exports){
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

},{}],364:[function(require,module,exports){
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

},{}],365:[function(require,module,exports){
module.exports = "<!-- Popup Description -->\n<div class=\"map-dialog \">\n    <div class=\"map-dialog-description\">\n        <div>\n            <img class=\"icon-myself\" src=\"https://forum.noxiousnet.com/plugins/nodebb-plugin-emoji-one/static/images/1f60e.png\">\n            <img class=\"icon-browser\" src=\"http://icons.iconarchive.com/icons/dtafalonso/android-lollipop/48/Browser-icon.png\">\n            <img class=\"icon-terminal\" src=\"http://icons.iconarchive.com/icons/paomedia/small-n-flat/48/terminal-icon.png\">\n        </div>\n        <div class=\"map-dialog-description-text\"></div>\n    </div>\n</div>";

},{}],366:[function(require,module,exports){
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1082 502\" preserveAspectRatio=\"xMinYMin meet\" xml:space=\"preserve\" class=\"hide-circles\">\n    <circle cx=\"909.4049999999999\" cy=\"270.32666666666665\" r=\"3.6\" />\n    <circle cx=\"942.5949999999999\" cy=\"309.0416666666667\" r=\"3.6\" />\n    <circle cx=\"950.9049999999999\" cy=\"304.16833333333335\" r=\"3.6\" />\n    <circle cx=\"13.805\" cy=\"222.02166666666668\" r=\"3.6\" />\n    <circle cx=\"5.45\" cy=\"217.17833333333337\" r=\"3.6\" />\n    <circle cx=\"46.903333333333336\" cy=\"105.98666666666666\" r=\"3.6\" />\n    <circle cx=\"55.245000000000005\" cy=\"101.14333333333332\" r=\"3.6\" />\n    <circle cx=\"271.06166666666667\" cy=\"23.80666666666667\" r=\"3.6\" />\n    <circle cx=\"279.38500000000005\" cy=\"18.933333333333334\" r=\"3.6\" />\n    <circle cx=\"262.75499999999994\" cy=\"18.93666666666667\" r=\"3.6\" />\n    <circle cx=\"246.21833333333333\" cy=\"212.3283333333333\" r=\"3.6\" />\n    <circle cx=\"254.57500000000002\" cy=\"217.1716666666667\" r=\"3.6\" />\n    <circle cx=\"279.49999999999994\" cy=\"221.98333333333332\" r=\"3.6\" />\n    <circle cx=\"271.14500000000004\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"304.39\" cy=\"236.50333333333333\" r=\"3.6\" />\n    <circle cx=\"345.76666666666665\" cy=\"9.238333333333332\" r=\"3.6\" />\n    <circle cx=\"337.4366666666666\" cy=\"14.103333333333332\" r=\"3.6\" />\n    <circle cx=\"345.7616666666667\" cy=\"18.965\" r=\"3.6\" />\n    <circle cx=\"370.66\" cy=\"14.141666666666667\" r=\"3.6\" />\n    <circle cx=\"378.97499999999997\" cy=\"9.268333333333333\" r=\"3.6\" />\n    <circle cx=\"387.32500000000005\" cy=\"4.428333333333333\" r=\"3.6\" />\n    <circle cx=\"362.365\" cy=\"9.261666666666665\" r=\"3.6\" />\n    <circle cx=\"354.0783333333333\" cy=\"14.121666666666668\" r=\"3.6\" />\n    <circle cx=\"345.98499999999996\" cy=\"483.0466666666667\" r=\"3.6\" />\n    <circle cx=\"279.53\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"204.725\" cy=\"188.17500000000004\" r=\"3.6\" />\n    <circle cx=\"204.71\" cy=\"178.50333333333333\" r=\"3.6\" />\n    <circle cx=\"279.4983333333334\" cy=\"270.33666666666664\" r=\"3.6\" />\n    <circle cx=\"296.09333333333336\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"287.77\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"287.79333333333335\" cy=\"304.17499999999995\" r=\"3.6\" />\n    <circle cx=\"287.77\" cy=\"275.16333333333336\" r=\"3.6\" />\n    <circle cx=\"204.71\" cy=\"168.83333333333331\" r=\"3.6\" />\n    <circle cx=\"287.77\" cy=\"284.8333333333333\" r=\"3.6\" />\n    <circle cx=\"196.41666666666666\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"120.49333333333334\" r=\"3.6\" />\n    <circle cx=\"179.76\" cy=\"134.98666666666665\" r=\"3.6\" />\n    <circle cx=\"163.135\" cy=\"115.65666666666665\" r=\"3.6\" />\n    <circle cx=\"179.76\" cy=\"125.31666666666666\" r=\"3.6\" />\n    <circle cx=\"188.1\" cy=\"159.15333333333334\" r=\"3.6\" />\n    <circle cx=\"179.76\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"179.77999999999997\" cy=\"154.32\" r=\"3.6\" />\n    <circle cx=\"296.11333333333334\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"320.93\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"320.97499999999997\" cy=\"304.18833333333333\" r=\"3.6\" />\n    <circle cx=\"321.00666666666666\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"337.595\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"329.3\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"329.27000000000004\" cy=\"279.9916666666667\" r=\"3.6\" />\n    <circle cx=\"320.965\" cy=\"294.5133333333333\" r=\"3.6\" />\n    <circle cx=\"320.94\" cy=\"110.81\" r=\"3.6\" />\n    <circle cx=\"320.965\" cy=\"284.8433333333333\" r=\"3.6\" />\n    <circle cx=\"312.66666666666663\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"163.14\" cy=\"105.99\" r=\"3.6\" />\n    <circle cx=\"321.00666666666666\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"304.4083333333333\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"337.605\" cy=\"342.84499999999997\" r=\"3.6\" />\n    <circle cx=\"329.3\" cy=\"338.01666666666665\" r=\"3.6\" />\n    <circle cx=\"329.31\" cy=\"347.68333333333334\" r=\"3.6\" />\n    <circle cx=\"321.0133333333334\" cy=\"342.8633333333333\" r=\"3.6\" />\n    <circle cx=\"321.0233333333333\" cy=\"352.52666666666664\" r=\"3.6\" />\n    <circle cx=\"320.99666666666667\" cy=\"313.84666666666664\" r=\"3.6\" />\n    <circle cx=\"312.645\" cy=\"309.02500000000003\" r=\"3.6\" />\n    <circle cx=\"312.66666666666663\" cy=\"318.69\" r=\"3.6\" />\n    <circle cx=\"304.3983333333333\" cy=\"313.8583333333333\" r=\"3.6\" />\n    <circle cx=\"296.0733333333333\" cy=\"299.3383333333333\" r=\"3.6\" />\n    <circle cx=\"304.37833333333333\" cy=\"304.17833333333334\" r=\"3.6\" />\n    <circle cx=\"312.625\" cy=\"299.3533333333333\" r=\"3.6\" />\n    <circle cx=\"312.625\" cy=\"280.0133333333334\" r=\"3.6\" />\n    <circle cx=\"320.9833333333333\" cy=\"275.18333333333334\" r=\"3.6\" />\n    <circle cx=\"312.625\" cy=\"289.68333333333334\" r=\"3.6\" />\n    <circle cx=\"287.85\" cy=\"255.8016666666667\" r=\"3.6\" />\n    <circle cx=\"254.55333333333337\" cy=\"188.165\" r=\"3.6\" />\n    <circle cx=\"246.21833333333333\" cy=\"183.34333333333336\" r=\"3.6\" />\n    <circle cx=\"254.56499999999997\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"237.905\" cy=\"178.49833333333333\" r=\"3.6\" />\n    <circle cx=\"320.9266666666667\" cy=\"120.47166666666668\" r=\"3.6\" />\n    <circle cx=\"296.07166666666666\" cy=\"289.66833333333335\" r=\"3.6\" />\n    <circle cx=\"296.07166666666666\" cy=\"279.99833333333333\" r=\"3.6\" />\n    <circle cx=\"296.10166666666663\" cy=\"270.33333333333337\" r=\"3.6\" />\n    <circle cx=\"254.50333333333333\" cy=\"81.81\" r=\"3.6\" />\n    <circle cx=\"237.885\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"212.955\" cy=\"96.32333333333332\" r=\"3.6\" />\n    <circle cx=\"229.58833333333334\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"204.67999999999998\" cy=\"91.48333333333333\" r=\"3.6\" />\n    <circle cx=\"221.29333333333332\" cy=\"91.48333333333333\" r=\"3.6\" />\n    <circle cx=\"312.58500000000004\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"196.38666666666668\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"179.76999999999998\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"188.06999999999996\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"171.48000000000002\" cy=\"91.48333333333333\" r=\"3.6\" />\n    <circle cx=\"312.58000000000004\" cy=\"86.63\" r=\"3.6\" />\n    <circle cx=\"312.59000000000003\" cy=\"96.30666666666666\" r=\"3.6\" />\n    <circle cx=\"312.59000000000003\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"312.54\" cy=\"76.97166666666666\" r=\"3.6\" />\n    <circle cx=\"320.875\" cy=\"72.11666666666667\" r=\"3.6\" />\n    <circle cx=\"163.14\" cy=\"96.32333333333332\" r=\"3.6\" />\n    <circle cx=\"262.835\" cy=\"86.61833333333333\" r=\"3.6\" />\n    <circle cx=\"246.21666666666667\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"171.47833333333335\" cy=\"149.50666666666666\" r=\"3.6\" />\n    <circle cx=\"329.3\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"337.595\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"329.28000000000003\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"345.91333333333324\" cy=\"338.0166666666667\" r=\"3.6\" />\n    <circle cx=\"345.91333333333324\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"337.615\" cy=\"284.8333333333333\" r=\"3.6\" />\n    <circle cx=\"329.22166666666664\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"329.23\" cy=\"105.96333333333332\" r=\"3.6\" />\n    <circle cx=\"329.26\" cy=\"289.66833333333335\" r=\"3.6\" />\n    <circle cx=\"329.26\" cy=\"299.3383333333333\" r=\"3.6\" />\n    <circle cx=\"312.67833333333334\" cy=\"347.695\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"357.3666666666666\" r=\"3.6\" />\n    <circle cx=\"321.02833333333336\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"312.66666666666663\" cy=\"338.02666666666664\" r=\"3.6\" />\n    <circle cx=\"329.32\" cy=\"357.34999999999997\" r=\"3.6\" />\n    <circle cx=\"329.32\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"337.6166666666667\" cy=\"352.5133333333333\" r=\"3.6\" />\n    <circle cx=\"320.93\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"337.52\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"212.93500000000003\" cy=\"76.985\" r=\"3.6\" />\n    <circle cx=\"229.56666666666663\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"221.26\" cy=\"72.15\" r=\"3.6\" />\n    <circle cx=\"196.365\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"204.64666666666665\" cy=\"72.13833333333334\" r=\"3.6\" />\n    <circle cx=\"171.4483333333333\" cy=\"72.15\" r=\"3.6\" />\n    <circle cx=\"163.12\" cy=\"76.985\" r=\"3.6\" />\n    <circle cx=\"179.75\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"188.04833333333332\" cy=\"72.135\" r=\"3.6\" />\n    <circle cx=\"345.845\" cy=\"76.93666666666668\" r=\"3.6\" />\n    <circle cx=\"329.22166666666664\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"337.5\" cy=\"62.468333333333334\" r=\"3.6\" />\n    <circle cx=\"329.16499999999996\" cy=\"57.613333333333344\" r=\"3.6\" />\n    <circle cx=\"304.4083333333333\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"67.31333333333332\" r=\"3.6\" />\n    <circle cx=\"237.865\" cy=\"72.135\" r=\"3.6\" />\n    <circle cx=\"246.17666666666665\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"254.47000000000003\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"345.92333333333335\" cy=\"347.6816666666667\" r=\"3.6\" />\n    <circle cx=\"188.06999999999996\" cy=\"81.80333333333333\" r=\"3.6\" />\n    <circle cx=\"196.38666666666668\" cy=\"86.63833333333332\" r=\"3.6\" />\n    <circle cx=\"154.815\" cy=\"81.82166666666667\" r=\"3.6\" />\n    <circle cx=\"179.76999999999998\" cy=\"86.63833333333332\" r=\"3.6\" />\n    <circle cx=\"212.955\" cy=\"86.65333333333335\" r=\"3.6\" />\n    <circle cx=\"154.85166666666666\" cy=\"101.17\" r=\"3.6\" />\n    <circle cx=\"154.81833333333333\" cy=\"120.49333333333334\" r=\"3.6\" />\n    <circle cx=\"171.47000000000003\" cy=\"81.80666666666667\" r=\"3.6\" />\n    <circle cx=\"163.14\" cy=\"86.65333333333335\" r=\"3.6\" />\n    <circle cx=\"320.91999999999996\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"329.21999999999997\" cy=\"76.94500000000001\" r=\"3.6\" />\n    <circle cx=\"296.11333333333334\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"221.28166666666667\" cy=\"81.80666666666667\" r=\"3.6\" />\n    <circle cx=\"163.13\" cy=\"125.32666666666667\" r=\"3.6\" />\n    <circle cx=\"254.48166666666665\" cy=\"72.12833333333333\" r=\"3.6\" />\n    <circle cx=\"246.1966666666667\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"229.58833333333334\" cy=\"86.63833333333332\" r=\"3.6\" />\n    <circle cx=\"237.885\" cy=\"81.80333333333333\" r=\"3.6\" />\n    <circle cx=\"262.835\" cy=\"76.96\" r=\"3.6\" />\n    <circle cx=\"271.215\" cy=\"255.8216666666667\" r=\"3.6\" />\n    <circle cx=\"271.195\" cy=\"275.185\" r=\"3.6\" />\n    <circle cx=\"271.22499999999997\" cy=\"265.5033333333334\" r=\"3.6\" />\n    <circle cx=\"171.46833333333333\" cy=\"130.16166666666666\" r=\"3.6\" />\n    <circle cx=\"279.4733333333333\" cy=\"279.99833333333333\" r=\"3.6\" />\n    <circle cx=\"279.4733333333333\" cy=\"299.33833333333337\" r=\"3.6\" />\n    <circle cx=\"287.815\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"287.815\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"279.49499999999995\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"279.4733333333333\" cy=\"289.66833333333335\" r=\"3.6\" />\n    <circle cx=\"179.80166666666665\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"229.61833333333334\" cy=\"173.6583333333333\" r=\"3.6\" />\n    <circle cx=\"171.5\" cy=\"159.16\" r=\"3.6\" />\n    <circle cx=\"171.46833333333333\" cy=\"139.83166666666668\" r=\"3.6\" />\n    <circle cx=\"196.41666666666666\" cy=\"173.6583333333333\" r=\"3.6\" />\n    <circle cx=\"196.41666666666666\" cy=\"183.32833333333335\" r=\"3.6\" />\n    <circle cx=\"196.4433333333333\" cy=\"193.00666666666666\" r=\"3.6\" />\n    <circle cx=\"188.1\" cy=\"168.82333333333332\" r=\"3.6\" />\n    <circle cx=\"204.66833333333332\" cy=\"81.81833333333334\" r=\"3.6\" />\n    <circle cx=\"221.28333333333333\" cy=\"130.16166666666666\" r=\"3.6\" />\n    <circle cx=\"229.57500000000002\" cy=\"134.98666666666665\" r=\"3.6\" />\n    <circle cx=\"254.50666666666666\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"246.20666666666668\" cy=\"125.31333333333335\" r=\"3.6\" />\n    <circle cx=\"237.875\" cy=\"130.14666666666668\" r=\"3.6\" />\n    <circle cx=\"229.57499999999996\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"237.89499999999998\" cy=\"149.48499999999999\" r=\"3.6\" />\n    <circle cx=\"212.94500000000002\" cy=\"134.99666666666667\" r=\"3.6\" />\n    <circle cx=\"221.28333333333333\" cy=\"139.83166666666668\" r=\"3.6\" />\n    <circle cx=\"254.50333333333333\" cy=\"139.81666666666666\" r=\"3.6\" />\n    <circle cx=\"271.135\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"254.50333333333333\" cy=\"130.14666666666668\" r=\"3.6\" />\n    <circle cx=\"246.20666666666668\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"279.43\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"125.31333333333335\" r=\"3.6\" />\n    <circle cx=\"246.22833333333332\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"246.20666666666668\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"237.875\" cy=\"139.81666666666663\" r=\"3.6\" />\n    <circle cx=\"237.875\" cy=\"120.47666666666667\" r=\"3.6\" />\n    <circle cx=\"246.21\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"262.8\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"229.57500000000002\" cy=\"125.31666666666668\" r=\"3.6\" />\n    <circle cx=\"254.51166666666668\" cy=\"110.80833333333334\" r=\"3.6\" />\n    <circle cx=\"204.67166666666665\" cy=\"120.49166666666666\" r=\"3.6\" />\n    <circle cx=\"204.67\" cy=\"130.16166666666666\" r=\"3.6\" />\n    <circle cx=\"221.28666666666666\" cy=\"120.49333333333333\" r=\"3.6\" />\n    <circle cx=\"212.94500000000002\" cy=\"125.32666666666667\" r=\"3.6\" />\n    <circle cx=\"287.72499999999997\" cy=\"130.13\" r=\"3.6\" />\n    <circle cx=\"287.755\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"271.135\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"279.44\" cy=\"144.64333333333335\" r=\"3.6\" />\n    <circle cx=\"262.795\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"279.43\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"296.0516666666667\" cy=\"134.98\" r=\"3.6\" />\n    <circle cx=\"271.1383333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"254.51333333333332\" cy=\"149.47833333333332\" r=\"3.6\" />\n    <circle cx=\"121.65333333333332\" cy=\"62.47666666666666\" r=\"3.6\" />\n    <circle cx=\"246.13500000000002\" cy=\"28.60166666666667\" r=\"3.6\" />\n    <circle cx=\"204.63\" cy=\"43.126666666666665\" r=\"3.6\" />\n    <circle cx=\"171.41333333333333\" cy=\"43.12166666666667\" r=\"3.6\" />\n    <circle cx=\"188.04666666666665\" cy=\"43.10166666666667\" r=\"3.6\" />\n    <circle cx=\"129.945\" cy=\"57.633333333333326\" r=\"3.6\" />\n    <circle cx=\"370.76500000000004\" cy=\"304.1683333333333\" r=\"3.6\" />\n    <circle cx=\"154.91\" cy=\"178.50333333333333\" r=\"3.6\" />\n    <circle cx=\"295.99499999999995\" cy=\"28.588333333333335\" r=\"3.6\" />\n    <circle cx=\"312.53999999999996\" cy=\"18.93666666666667\" r=\"3.6\" />\n    <circle cx=\"221.225\" cy=\"43.12166666666667\" r=\"3.6\" />\n    <circle cx=\"105.07333333333334\" cy=\"81.82166666666667\" r=\"3.6\" />\n    <circle cx=\"121.63166666666666\" cy=\"72.16833333333334\" r=\"3.6\" />\n    <circle cx=\"146.54333333333332\" cy=\"38.263333333333335\" r=\"3.6\" />\n    <circle cx=\"321.08\" cy=\"497.58500000000004\" r=\"3.6\" />\n    <circle cx=\"154.92166666666665\" cy=\"197.86\" r=\"3.6\" />\n    <circle cx=\"105.01333333333334\" cy=\"52.80833333333333\" r=\"3.6\" />\n    <circle cx=\"80.14833333333333\" cy=\"86.63833333333334\" r=\"3.6\" />\n    <circle cx=\"71.80166666666666\" cy=\"91.49000000000001\" r=\"3.6\" />\n    <circle cx=\"312.725\" cy=\"425.0466666666667\" r=\"3.6\" />\n    <circle cx=\"154.85666666666665\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"204.67\" cy=\"139.83166666666668\" r=\"3.6\" />\n    <circle cx=\"287.805\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"154.82666666666665\" cy=\"110.82333333333332\" r=\"3.6\" />\n    <circle cx=\"304.3066666666667\" cy=\"91.45666666666666\" r=\"3.6\" />\n    <circle cx=\"304.375\" cy=\"275.1716666666667\" r=\"3.6\" />\n    <circle cx=\"304.365\" cy=\"284.8433333333333\" r=\"3.6\" />\n    <circle cx=\"196.38\" cy=\"115.64666666666666\" r=\"3.6\" />\n    <circle cx=\"304.3666666666667\" cy=\"294.5133333333334\" r=\"3.6\" />\n    <circle cx=\"221.335\" cy=\"178.51\" r=\"3.6\" />\n    <circle cx=\"154.83833333333334\" cy=\"62.47666666666667\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"197.84333333333333\" r=\"3.6\" />\n    <circle cx=\"321.02833333333336\" cy=\"371.8633333333333\" r=\"3.6\" />\n    <circle cx=\"146.545\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"320.84166666666664\" cy=\"33.43833333333333\" r=\"3.6\" />\n    <circle cx=\"312.72\" cy=\"434.7166666666667\" r=\"3.6\" />\n    <circle cx=\"321.03833333333336\" cy=\"381.53999999999996\" r=\"3.6\" />\n    <circle cx=\"188.06499999999997\" cy=\"110.80666666666667\" r=\"3.6\" />\n    <circle cx=\"204.67666666666665\" cy=\"110.82333333333334\" r=\"3.6\" />\n    <circle cx=\"237.885\" cy=\"101.13999999999999\" r=\"3.6\" />\n    <circle cx=\"279.45\" cy=\"105.95166666666667\" r=\"3.6\" />\n    <circle cx=\"287.72999999999996\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"296.0066666666667\" cy=\"105.94\" r=\"3.6\" />\n    <circle cx=\"295.97499999999997\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"246.21666666666667\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"254.51333333333332\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"262.805\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"271.15\" cy=\"91.46833333333335\" r=\"3.6\" />\n    <circle cx=\"279.46\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"320.9\" cy=\"130.165\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"270.325\" r=\"3.6\" />\n    <circle cx=\"329.22999999999996\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"304.4166666666667\" cy=\"265.5133333333333\" r=\"3.6\" />\n    <circle cx=\"304.33000000000004\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"304.3283333333334\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"304.32166666666666\" cy=\"120.47166666666665\" r=\"3.6\" />\n    <circle cx=\"312.58000000000004\" cy=\"125.31333333333335\" r=\"3.6\" />\n    <circle cx=\"221.29333333333332\" cy=\"101.15333333333332\" r=\"3.6\" />\n    <circle cx=\"188.06000000000003\" cy=\"130.14666666666668\" r=\"3.6\" />\n    <circle cx=\"229.58833333333334\" cy=\"105.97666666666667\" r=\"3.6\" />\n    <circle cx=\"188.06000000000003\" cy=\"139.8166666666667\" r=\"3.6\" />\n    <circle cx=\"188.06000000000003\" cy=\"120.47666666666665\" r=\"3.6\" />\n    <circle cx=\"212.98499999999999\" cy=\"173.67333333333332\" r=\"3.6\" />\n    <circle cx=\"212.98499999999999\" cy=\"164.00333333333333\" r=\"3.6\" />\n    <circle cx=\"196.39666666666665\" cy=\"154.31833333333333\" r=\"3.6\" />\n    <circle cx=\"179.765\" cy=\"115.64666666666666\" r=\"3.6\" />\n    <circle cx=\"204.69999999999996\" cy=\"159.17333333333335\" r=\"3.6\" />\n    <circle cx=\"188.08\" cy=\"149.48499999999999\" r=\"3.6\" />\n    <circle cx=\"204.67999999999998\" cy=\"101.15333333333335\" r=\"3.6\" />\n    <circle cx=\"196.38666666666668\" cy=\"105.97666666666667\" r=\"3.6\" />\n    <circle cx=\"212.955\" cy=\"105.99\" r=\"3.6\" />\n    <circle cx=\"296.13\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"171.4766666666667\" cy=\"110.82000000000001\" r=\"3.6\" />\n    <circle cx=\"171.48000000000002\" cy=\"101.15333333333332\" r=\"3.6\" />\n    <circle cx=\"179.76999999999998\" cy=\"105.97666666666667\" r=\"3.6\" />\n    <circle cx=\"188.06999999999996\" cy=\"101.13999999999999\" r=\"3.6\" />\n    <circle cx=\"296.02833333333336\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"287.72499999999997\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"279.43499999999995\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"296.035\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"304.33\" cy=\"130.1483333333333\" r=\"3.6\" />\n    <circle cx=\"212.94499999999996\" cy=\"144.66666666666666\" r=\"3.6\" />\n    <circle cx=\"254.51333333333332\" cy=\"101.13999999999999\" r=\"3.6\" />\n    <circle cx=\"271.14166666666665\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"262.805\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"271.145\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"229.59666666666666\" cy=\"154.31833333333333\" r=\"3.6\" />\n    <circle cx=\"246.21666666666667\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"237.915\" cy=\"159.15333333333334\" r=\"3.6\" />\n    <circle cx=\"246.25\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"221.29333333333332\" cy=\"149.50666666666666\" r=\"3.6\" />\n    <circle cx=\"254.5333333333334\" cy=\"159.16\" r=\"3.6\" />\n    <circle cx=\"271.145\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"262.81500000000005\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"304.41833333333335\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"254.5533333333333\" cy=\"168.83\" r=\"3.6\" />\n    <circle cx=\"221.32500000000002\" cy=\"168.83333333333334\" r=\"3.6\" />\n    <circle cx=\"212.965\" cy=\"154.33499999999998\" r=\"3.6\" />\n    <circle cx=\"229.61833333333334\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"221.31500000000003\" cy=\"159.16\" r=\"3.6\" />\n    <circle cx=\"237.915\" cy=\"168.82333333333332\" r=\"3.6\" />\n    <circle cx=\"262.8666666666667\" cy=\"164.00333333333333\" r=\"3.6\" />\n    <circle cx=\"271.18\" cy=\"159.14833333333334\" r=\"3.6\" />\n    <circle cx=\"237.88\" cy=\"110.80666666666667\" r=\"3.6\" />\n    <circle cx=\"254.56333333333336\" cy=\"178.49333333333334\" r=\"3.6\" />\n    <circle cx=\"246.25\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"221.29166666666666\" cy=\"110.82\" r=\"3.6\" />\n    <circle cx=\"213.01500000000001\" cy=\"183.36166666666665\" r=\"3.6\" />\n    <circle cx=\"212.95000000000002\" cy=\"115.65666666666668\" r=\"3.6\" />\n    <circle cx=\"229.58166666666668\" cy=\"115.64666666666669\" r=\"3.6\" />\n    <circle cx=\"196.37666666666667\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"196.37666666666667\" cy=\"125.31666666666668\" r=\"3.6\" />\n    <circle cx=\"204.67999999999998\" cy=\"149.49499999999998\" r=\"3.6\" />\n    <circle cx=\"196.37666666666667\" cy=\"134.98666666666665\" r=\"3.6\" />\n    <circle cx=\"154.81000000000003\" cy=\"72.16000000000001\" r=\"3.6\" />\n    <circle cx=\"296.1566666666667\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"287.82500000000005\" cy=\"362.19000000000005\" r=\"3.6\" />\n    <circle cx=\"296.135\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"287.81500000000005\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"287.855\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"304.46999999999997\" cy=\"458.87833333333333\" r=\"3.6\" />\n    <circle cx=\"304.46000000000004\" cy=\"449.21666666666664\" r=\"3.6\" />\n    <circle cx=\"296.16833333333335\" cy=\"434.70666666666665\" r=\"3.6\" />\n    <circle cx=\"287.845\" cy=\"429.8666666666666\" r=\"3.6\" />\n    <circle cx=\"254.55666666666664\" cy=\"304.18\" r=\"3.6\" />\n    <circle cx=\"262.885\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"287.83500000000004\" cy=\"352.5133333333333\" r=\"3.6\" />\n    <circle cx=\"254.5816666666667\" cy=\"323.53000000000003\" r=\"3.6\" />\n    <circle cx=\"246.225\" cy=\"309.03000000000003\" r=\"3.6\" />\n    <circle cx=\"254.57833333333338\" cy=\"313.8616666666667\" r=\"3.6\" />\n    <circle cx=\"279.52500000000003\" cy=\"347.68333333333334\" r=\"3.6\" />\n    <circle cx=\"271.22499999999997\" cy=\"342.8633333333333\" r=\"3.6\" />\n    <circle cx=\"262.875\" cy=\"338.0316666666667\" r=\"3.6\" />\n    <circle cx=\"296.13666666666666\" cy=\"444.39166666666665\" r=\"3.6\" />\n    <circle cx=\"354.24666666666667\" cy=\"381.53333333333336\" r=\"3.6\" />\n    <circle cx=\"362.50500000000005\" cy=\"367.0333333333333\" r=\"3.6\" />\n    <circle cx=\"354.2266666666667\" cy=\"371.8633333333333\" r=\"3.6\" />\n    <circle cx=\"345.9549999999999\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"379.115\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"379.125\" cy=\"338.02333333333337\" r=\"3.6\" />\n    <circle cx=\"370.82500000000005\" cy=\"342.8633333333333\" r=\"3.6\" />\n    <circle cx=\"370.83500000000004\" cy=\"352.52666666666664\" r=\"3.6\" />\n    <circle cx=\"370.84\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"337.69\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"337.65999999999997\" cy=\"400.86000000000007\" r=\"3.6\" />\n    <circle cx=\"329.36999999999995\" cy=\"434.70666666666665\" r=\"3.6\" />\n    <circle cx=\"304.47166666666664\" cy=\"478.23999999999995\" r=\"3.6\" />\n    <circle cx=\"304.49\" cy=\"468.55833333333334\" r=\"3.6\" />\n    <circle cx=\"312.8233333333333\" cy=\"483.06333333333333\" r=\"3.6\" />\n    <circle cx=\"329.36499999999995\" cy=\"425.0433333333333\" r=\"3.6\" />\n    <circle cx=\"296.13666666666666\" cy=\"463.715\" r=\"3.6\" />\n    <circle cx=\"329.36\" cy=\"415.36666666666673\" r=\"3.6\" />\n    <circle cx=\"345.9766666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"188.025\" cy=\"52.79666666666666\" r=\"3.6\" />\n    <circle cx=\"179.73\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"138.245\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"196.34333333333333\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"171.4383333333333\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"138.245\" cy=\"52.79666666666666\" r=\"3.6\" />\n    <circle cx=\"146.545\" cy=\"47.96666666666667\" r=\"3.6\" />\n    <circle cx=\"163.10000000000002\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"154.83833333333334\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"204.63666666666666\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"262.76500000000004\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"254.465\" cy=\"43.12833333333334\" r=\"3.6\" />\n    <circle cx=\"246.13666666666666\" cy=\"38.31166666666667\" r=\"3.6\" />\n    <circle cx=\"212.915\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"271.105\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"237.84333333333333\" cy=\"52.796666666666674\" r=\"3.6\" />\n    <circle cx=\"221.25\" cy=\"52.81166666666667\" r=\"3.6\" />\n    <circle cx=\"229.545\" cy=\"57.63333333333333\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"207.51166666666666\" r=\"3.6\" />\n    <circle cx=\"196.45833333333334\" cy=\"221.99499999999998\" r=\"3.6\" />\n    <circle cx=\"204.75\" cy=\"226.84\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"217.16666666666666\" r=\"3.6\" />\n    <circle cx=\"179.82166666666663\" cy=\"212.33666666666667\" r=\"3.6\" />\n    <circle cx=\"254.53833333333333\" cy=\"294.5116666666667\" r=\"3.6\" />\n    <circle cx=\"229.69000000000003\" cy=\"241.34500000000003\" r=\"3.6\" />\n    <circle cx=\"246.29000000000005\" cy=\"260.68833333333333\" r=\"3.6\" />\n    <circle cx=\"213.025\" cy=\"231.68500000000003\" r=\"3.6\" />\n    <circle cx=\"146.545\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"221.38\" cy=\"236.51166666666668\" r=\"3.6\" />\n    <circle cx=\"171.48499999999999\" cy=\"188.1933333333333\" r=\"3.6\" />\n    <circle cx=\"146.59833333333333\" cy=\"154.31833333333333\" r=\"3.6\" />\n    <circle cx=\"138.295\" cy=\"159.15333333333334\" r=\"3.6\" />\n    <circle cx=\"138.255\" cy=\"139.81666666666666\" r=\"3.6\" />\n    <circle cx=\"146.57833333333335\" cy=\"144.65333333333334\" r=\"3.6\" />\n    <circle cx=\"146.61833333333334\" cy=\"163.98833333333334\" r=\"3.6\" />\n    <circle cx=\"163.16\" cy=\"183.35\" r=\"3.6\" />\n    <circle cx=\"146.58666666666667\" cy=\"173.67499999999998\" r=\"3.6\" />\n    <circle cx=\"179.8166666666667\" cy=\"222.01\" r=\"3.6\" />\n    <circle cx=\"229.68500000000003\" cy=\"251.005\" r=\"3.6\" />\n    <circle cx=\"246.19333333333336\" cy=\"299.3533333333333\" r=\"3.6\" />\n    <circle cx=\"213.035\" cy=\"241.36166666666668\" r=\"3.6\" />\n    <circle cx=\"221.35500000000002\" cy=\"246.205\" r=\"3.6\" />\n    <circle cx=\"237.995\" cy=\"255.83333333333337\" r=\"3.6\" />\n    <circle cx=\"262.87\" cy=\"347.6983333333333\" r=\"3.6\" />\n    <circle cx=\"271.205\" cy=\"352.545\" r=\"3.6\" />\n    <circle cx=\"254.57333333333335\" cy=\"333.1933333333333\" r=\"3.6\" />\n    <circle cx=\"246.23499999999999\" cy=\"318.69\" r=\"3.6\" />\n    <circle cx=\"171.47\" cy=\"217.18166666666664\" r=\"3.6\" />\n    <circle cx=\"146.57833333333332\" cy=\"183.34166666666667\" r=\"3.6\" />\n    <circle cx=\"146.60666666666665\" cy=\"192.98\" r=\"3.6\" />\n    <circle cx=\"138.29500000000002\" cy=\"168.82333333333332\" r=\"3.6\" />\n    <circle cx=\"279.53\" cy=\"357.35166666666663\" r=\"3.6\" />\n    <circle cx=\"204.74\" cy=\"236.53999999999996\" r=\"3.6\" />\n    <circle cx=\"196.42666666666665\" cy=\"231.69000000000003\" r=\"3.6\" />\n    <circle cx=\"279.4083333333333\" cy=\"57.623333333333335\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"226.84666666666666\" r=\"3.6\" />\n    <circle cx=\"379.155\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"370.84999999999997\" cy=\"371.86999999999995\" r=\"3.6\" />\n    <circle cx=\"138.26500000000001\" cy=\"149.49\" r=\"3.6\" />\n    <circle cx=\"362.535\" cy=\"376.72166666666664\" r=\"3.6\" />\n    <circle cx=\"354.28999999999996\" cy=\"391.2033333333333\" r=\"3.6\" />\n    <circle cx=\"354.29\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"379.15500000000003\" cy=\"357.3500000000001\" r=\"3.6\" />\n    <circle cx=\"387.47333333333336\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"387.47333333333336\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"379.15000000000003\" cy=\"347.68\" r=\"3.6\" />\n    <circle cx=\"329.40000000000003\" cy=\"492.71166666666664\" r=\"3.6\" />\n    <circle cx=\"304.44666666666666\" cy=\"487.8966666666667\" r=\"3.6\" />\n    <circle cx=\"296.14666666666665\" cy=\"473.37833333333333\" r=\"3.6\" />\n    <circle cx=\"296.105\" cy=\"454.03833333333336\" r=\"3.6\" />\n    <circle cx=\"287.845\" cy=\"439.5366666666667\" r=\"3.6\" />\n    <circle cx=\"287.82500000000005\" cy=\"381.53000000000003\" r=\"3.6\" />\n    <circle cx=\"312.78166666666664\" cy=\"492.7183333333333\" r=\"3.6\" />\n    <circle cx=\"337.7183333333333\" cy=\"420.19833333333327\" r=\"3.6\" />\n    <circle cx=\"345.9933333333334\" cy=\"405.70666666666665\" r=\"3.6\" />\n    <circle cx=\"105.01833333333333\" cy=\"62.471666666666664\" r=\"3.6\" />\n    <circle cx=\"296.01000000000005\" cy=\"38.29\" r=\"3.6\" />\n    <circle cx=\"312.51500000000004\" cy=\"38.29666666666667\" r=\"3.6\" />\n    <circle cx=\"320.8433333333333\" cy=\"23.796666666666667\" r=\"3.6\" />\n    <circle cx=\"287.65999999999997\" cy=\"33.446666666666665\" r=\"3.6\" />\n    <circle cx=\"271.105\" cy=\"43.116666666666674\" r=\"3.6\" />\n    <circle cx=\"262.785\" cy=\"38.275\" r=\"3.6\" />\n    <circle cx=\"254.465\" cy=\"33.446666666666665\" r=\"3.6\" />\n    <circle cx=\"138.265\" cy=\"72.15833333333335\" r=\"3.6\" />\n    <circle cx=\"237.80833333333337\" cy=\"33.46\" r=\"3.6\" />\n    <circle cx=\"329.17\" cy=\"28.60166666666667\" r=\"3.6\" />\n    <circle cx=\"354.18666666666667\" cy=\"304.1716666666666\" r=\"3.6\" />\n    <circle cx=\"362.46166666666664\" cy=\"309.02500000000003\" r=\"3.6\" />\n    <circle cx=\"337.4983333333334\" cy=\"33.425000000000004\" r=\"3.6\" />\n    <circle cx=\"387.47333333333336\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"379.1133333333333\" cy=\"308.99666666666667\" r=\"3.6\" />\n    <circle cx=\"345.81333333333333\" cy=\"38.26333333333333\" r=\"3.6\" />\n    <circle cx=\"354.10666666666674\" cy=\"43.123333333333335\" r=\"3.6\" />\n    <circle cx=\"354.15000000000003\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"279.4083333333333\" cy=\"47.94166666666666\" r=\"3.6\" />\n    <circle cx=\"96.70166666666667\" cy=\"67.27999999999999\" r=\"3.6\" />\n    <circle cx=\"88.395\" cy=\"72.14\" r=\"3.6\" />\n    <circle cx=\"379.1133333333334\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"88.46499999999999\" cy=\"81.81666666666666\" r=\"3.6\" />\n    <circle cx=\"113.31500000000001\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"129.945\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"113.31500000000001\" cy=\"67.31333333333333\" r=\"3.6\" />\n    <circle cx=\"105.04833333333333\" cy=\"72.14333333333333\" r=\"3.6\" />\n    <circle cx=\"96.75333333333333\" cy=\"76.96833333333333\" r=\"3.6\" />\n    <circle cx=\"196.34333333333333\" cy=\"47.96666666666667\" r=\"3.6\" />\n    <circle cx=\"179.73\" cy=\"47.96666666666667\" r=\"3.6\" />\n    <circle cx=\"163.10000000000002\" cy=\"47.97666666666667\" r=\"3.6\" />\n    <circle cx=\"229.55499999999998\" cy=\"47.961666666666666\" r=\"3.6\" />\n    <circle cx=\"121.62166666666666\" cy=\"52.79500000000001\" r=\"3.6\" />\n    <circle cx=\"212.915\" cy=\"47.97666666666667\" r=\"3.6\" />\n    <circle cx=\"129.935\" cy=\"47.96000000000001\" r=\"3.6\" />\n    <circle cx=\"138.235\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"154.84833333333333\" cy=\"43.13666666666666\" r=\"3.6\" />\n    <circle cx=\"370.82\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"345.91333333333336\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"337.595\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"354.2066666666667\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"362.48499999999996\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"337.58500000000004\" cy=\"294.4866666666667\" r=\"3.6\" />\n    <circle cx=\"337.52\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"345.7833333333333\" cy=\"115.63666666666666\" r=\"3.6\" />\n    <circle cx=\"321.07\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"337.52\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"337.575\" cy=\"304.175\" r=\"3.6\" />\n    <circle cx=\"337.6166666666667\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"329.32\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"329.34000000000003\" cy=\"386.3583333333333\" r=\"3.6\" />\n    <circle cx=\"321.06\" cy=\"391.19666666666666\" r=\"3.6\" />\n    <circle cx=\"354.22166666666664\" cy=\"352.53333333333336\" r=\"3.6\" />\n    <circle cx=\"354.21166666666664\" cy=\"342.85833333333335\" r=\"3.6\" />\n    <circle cx=\"345.935\" cy=\"357.34999999999997\" r=\"3.6\" />\n    <circle cx=\"337.6166666666667\" cy=\"362.18333333333334\" r=\"3.6\" />\n    <circle cx=\"354.20666666666665\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"229.545\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"221.25\" cy=\"62.47666666666666\" r=\"3.6\" />\n    <circle cx=\"212.915\" cy=\"67.31333333333335\" r=\"3.6\" />\n    <circle cx=\"237.84333333333336\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"246.17666666666665\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"204.63666666666666\" cy=\"62.47666666666667\" r=\"3.6\" />\n    <circle cx=\"179.73\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"188.025\" cy=\"62.46333333333333\" r=\"3.6\" />\n    <circle cx=\"196.34333333333333\" cy=\"67.29833333333333\" r=\"3.6\" />\n    <circle cx=\"345.875\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"246.14666666666665\" cy=\"47.94666666666668\" r=\"3.6\" />\n    <circle cx=\"337.47\" cy=\"52.771666666666675\" r=\"3.6\" />\n    <circle cx=\"295.96666666666664\" cy=\"57.63499999999999\" r=\"3.6\" />\n    <circle cx=\"345.81333333333333\" cy=\"57.626666666666665\" r=\"3.6\" />\n    <circle cx=\"304.28000000000003\" cy=\"62.47833333333333\" r=\"3.6\" />\n    <circle cx=\"171.4383333333333\" cy=\"62.47666666666666\" r=\"3.6\" />\n    <circle cx=\"271.115\" cy=\"62.46666666666667\" r=\"3.6\" />\n    <circle cx=\"262.76500000000004\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"254.47000000000003\" cy=\"52.79666666666666\" r=\"3.6\" />\n    <circle cx=\"262.89\" cy=\"260.66999999999996\" r=\"3.6\" />\n    <circle cx=\"221.29666666666665\" cy=\"217.18333333333337\" r=\"3.6\" />\n    <circle cx=\"196.47500000000002\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"271.17999999999995\" cy=\"284.84333333333336\" r=\"3.6\" />\n    <circle cx=\"271.18\" cy=\"294.5133333333334\" r=\"3.6\" />\n    <circle cx=\"262.87666666666667\" cy=\"270.3433333333333\" r=\"3.6\" />\n    <circle cx=\"188.11\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"262.83500000000004\" cy=\"280.0083333333334\" r=\"3.6\" />\n    <circle cx=\"188.1\" cy=\"178.49333333333334\" r=\"3.6\" />\n    <circle cx=\"163.15\" cy=\"154.335\" r=\"3.6\" />\n    <circle cx=\"271.19\" cy=\"304.19\" r=\"3.6\" />\n    <circle cx=\"163.13\" cy=\"134.99666666666667\" r=\"3.6\" />\n    <circle cx=\"154.84666666666666\" cy=\"130.14666666666665\" r=\"3.6\" />\n    <circle cx=\"163.13\" cy=\"144.66666666666666\" r=\"3.6\" />\n    <circle cx=\"179.80166666666665\" cy=\"173.6583333333333\" r=\"3.6\" />\n    <circle cx=\"163.17\" cy=\"164.00333333333333\" r=\"3.6\" />\n    <circle cx=\"171.51\" cy=\"168.83333333333334\" r=\"3.6\" />\n    <circle cx=\"287.815\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"312.73\" cy=\"396.04333333333335\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"376.7033333333333\" r=\"3.6\" />\n    <circle cx=\"312.71\" cy=\"386.375\" r=\"3.6\" />\n    <circle cx=\"304.46999999999997\" cy=\"410.5433333333333\" r=\"3.6\" />\n    <circle cx=\"304.47\" cy=\"400.8733333333334\" r=\"3.6\" />\n    <circle cx=\"312.73\" cy=\"415.38000000000005\" r=\"3.6\" />\n    <circle cx=\"296.17833333333334\" cy=\"405.69666666666666\" r=\"3.6\" />\n    <circle cx=\"304.4683333333333\" cy=\"420.21333333333337\" r=\"3.6\" />\n    <circle cx=\"296.17833333333334\" cy=\"415.36666666666673\" r=\"3.6\" />\n    <circle cx=\"279.51500000000004\" cy=\"328.34666666666664\" r=\"3.6\" />\n    <circle cx=\"296.11333333333334\" cy=\"338.01666666666665\" r=\"3.6\" />\n    <circle cx=\"312.73\" cy=\"405.7133333333333\" r=\"3.6\" />\n    <circle cx=\"271.21\" cy=\"313.84666666666664\" r=\"3.6\" />\n    <circle cx=\"279.51499999999993\" cy=\"318.6766666666667\" r=\"3.6\" />\n    <circle cx=\"304.42333333333335\" cy=\"352.5333333333333\" r=\"3.6\" />\n    <circle cx=\"304.4133333333333\" cy=\"342.8583333333333\" r=\"3.6\" />\n    <circle cx=\"304.42833333333334\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"312.69\" cy=\"367.0333333333333\" r=\"3.6\" />\n    <circle cx=\"304.43833333333333\" cy=\"381.52833333333336\" r=\"3.6\" />\n    <circle cx=\"337.6383333333333\" cy=\"381.52500000000003\" r=\"3.6\" />\n    <circle cx=\"345.935\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"337.65999999999997\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"329.36\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"345.93499999999995\" cy=\"367.01833333333326\" r=\"3.6\" />\n    <circle cx=\"362.50500000000005\" cy=\"357.3666666666666\" r=\"3.6\" />\n    <circle cx=\"329.36\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"362.49499999999995\" cy=\"347.695\" r=\"3.6\" />\n    <circle cx=\"354.2266666666667\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"321.07000000000005\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"312.78\" cy=\"454.05333333333334\" r=\"3.6\" />\n    <circle cx=\"312.74999999999994\" cy=\"444.40333333333336\" r=\"3.6\" />\n    <circle cx=\"321.105\" cy=\"468.54999999999995\" r=\"3.6\" />\n    <circle cx=\"312.7916666666667\" cy=\"473.41166666666663\" r=\"3.6\" />\n    <circle cx=\"312.77\" cy=\"463.70666666666665\" r=\"3.6\" />\n    <circle cx=\"321.0683333333334\" cy=\"420.21000000000004\" r=\"3.6\" />\n    <circle cx=\"321.0683333333333\" cy=\"439.5566666666667\" r=\"3.6\" />\n    <circle cx=\"321.06\" cy=\"429.8833333333334\" r=\"3.6\" />\n    <circle cx=\"362.48499999999996\" cy=\"338.0266666666667\" r=\"3.6\" />\n    <circle cx=\"329.16999999999996\" cy=\"38.276666666666664\" r=\"3.6\" />\n    <circle cx=\"337.47\" cy=\"43.11500000000001\" r=\"3.6\" />\n    <circle cx=\"345.7966666666667\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"345.85833333333335\" cy=\"96.27666666666666\" r=\"3.6\" />\n    <circle cx=\"354.10666666666674\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"304.29833333333335\" cy=\"52.798333333333325\" r=\"3.6\" />\n    <circle cx=\"295.995\" cy=\"47.913333333333334\" r=\"3.6\" />\n    <circle cx=\"312.57\" cy=\"47.97666666666667\" r=\"3.6\" />\n    <circle cx=\"320.895\" cy=\"43.125\" r=\"3.6\" />\n    <circle cx=\"362.48499999999996\" cy=\"318.69\" r=\"3.6\" />\n    <circle cx=\"345.8066666666667\" cy=\"105.97500000000001\" r=\"3.6\" />\n    <circle cx=\"146.525\" cy=\"96.30833333333334\" r=\"3.6\" />\n    <circle cx=\"370.82\" cy=\"323.52166666666665\" r=\"3.6\" />\n    <circle cx=\"354.1966666666667\" cy=\"313.85833333333335\" r=\"3.6\" />\n    <circle cx=\"370.81\" cy=\"313.84666666666664\" r=\"3.6\" />\n    <circle cx=\"354.1466666666667\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"163.10000000000002\" cy=\"67.31333333333335\" r=\"3.6\" />\n    <circle cx=\"345.89333333333326\" cy=\"299.32666666666665\" r=\"3.6\" />\n    <circle cx=\"345.89333333333326\" cy=\"309.0083333333333\" r=\"3.6\" />\n    <circle cx=\"196.47500000000002\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"188.12\" cy=\"207.49666666666667\" r=\"3.6\" />\n    <circle cx=\"179.82166666666663\" cy=\"202.66666666666666\" r=\"3.6\" />\n    <circle cx=\"179.8116666666667\" cy=\"192.99666666666667\" r=\"3.6\" />\n    <circle cx=\"221.32833333333335\" cy=\"226.83666666666667\" r=\"3.6\" />\n    <circle cx=\"238.02666666666667\" cy=\"236.4983333333333\" r=\"3.6\" />\n    <circle cx=\"254.53\" cy=\"284.8466666666667\" r=\"3.6\" />\n    <circle cx=\"262.845\" cy=\"289.68333333333334\" r=\"3.6\" />\n    <circle cx=\"254.59500000000003\" cy=\"265.5183333333334\" r=\"3.6\" />\n    <circle cx=\"179.80166666666665\" cy=\"183.32833333333335\" r=\"3.6\" />\n    <circle cx=\"154.87\" cy=\"139.83166666666665\" r=\"3.6\" />\n    <circle cx=\"154.88\" cy=\"149.495\" r=\"3.6\" />\n    <circle cx=\"154.9\" cy=\"159.17333333333335\" r=\"3.6\" />\n    <circle cx=\"304.46\" cy=\"439.5516666666667\" r=\"3.6\" />\n    <circle cx=\"171.51\" cy=\"178.50333333333333\" r=\"3.6\" />\n    <circle cx=\"262.845\" cy=\"299.3533333333333\" r=\"3.6\" />\n    <circle cx=\"163.17\" cy=\"173.67333333333332\" r=\"3.6\" />\n    <circle cx=\"154.91\" cy=\"168.83333333333334\" r=\"3.6\" />\n    <circle cx=\"146.54666666666665\" cy=\"134.97\" r=\"3.6\" />\n    <circle cx=\"296.17833333333334\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"304.4283333333333\" cy=\"371.8633333333333\" r=\"3.6\" />\n    <circle cx=\"304.4583333333333\" cy=\"391.2083333333333\" r=\"3.6\" />\n    <circle cx=\"287.695\" cy=\"52.776666666666664\" r=\"3.6\" />\n    <circle cx=\"287.855\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"287.855\" cy=\"410.52666666666664\" r=\"3.6\" />\n    <circle cx=\"304.46166666666664\" cy=\"429.87999999999994\" r=\"3.6\" />\n    <circle cx=\"296.175\" cy=\"425.0366666666667\" r=\"3.6\" />\n    <circle cx=\"287.85333333333335\" cy=\"420.195\" r=\"3.6\" />\n    <circle cx=\"271.21999999999997\" cy=\"333.19166666666666\" r=\"3.6\" />\n    <circle cx=\"262.865\" cy=\"309.02500000000003\" r=\"3.6\" />\n    <circle cx=\"271.22\" cy=\"323.5216666666667\" r=\"3.6\" />\n    <circle cx=\"279.51499999999993\" cy=\"338.01666666666665\" r=\"3.6\" />\n    <circle cx=\"262.885\" cy=\"318.69000000000005\" r=\"3.6\" />\n    <circle cx=\"296.135\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"296.135\" cy=\"357.34999999999997\" r=\"3.6\" />\n    <circle cx=\"296.125\" cy=\"347.6816666666667\" r=\"3.6\" />\n    <circle cx=\"287.82500000000005\" cy=\"342.84499999999997\" r=\"3.6\" />\n    <circle cx=\"412.455\" cy=\"492.73\" r=\"3.6\" />\n    <circle cx=\"420.52500000000003\" cy=\"33.45666666666667\" r=\"3.6\" />\n    <circle cx=\"428.81500000000005\" cy=\"28.60833333333333\" r=\"3.6\" />\n    <circle cx=\"403.91499999999996\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"403.91\" cy=\"43.12499999999999\" r=\"3.6\" />\n    <circle cx=\"428.8149999999999\" cy=\"18.93833333333333\" r=\"3.6\" />\n    <circle cx=\"412.195\" cy=\"38.29333333333334\" r=\"3.6\" />\n    <circle cx=\"387.27500000000003\" cy=\"52.776666666666664\" r=\"3.6\" />\n    <circle cx=\"395.57\" cy=\"28.625\" r=\"3.6\" />\n    <circle cx=\"420.52\" cy=\"23.78333333333333\" r=\"3.6\" />\n    <circle cx=\"403.8933333333334\" cy=\"23.78333333333333\" r=\"3.6\" />\n    <circle cx=\"412.185\" cy=\"18.953333333333337\" r=\"3.6\" />\n    <circle cx=\"395.59\" cy=\"47.93000000000001\" r=\"3.6\" />\n    <circle cx=\"412.205\" cy=\"9.261666666666668\" r=\"3.6\" />\n    <circle cx=\"428.81333333333333\" cy=\"9.258333333333333\" r=\"3.6\" />\n    <circle cx=\"445.41166666666663\" cy=\"9.235\" r=\"3.6\" />\n    <circle cx=\"461.9866666666667\" cy=\"9.261666666666668\" r=\"3.6\" />\n    <circle cx=\"395.6000000000001\" cy=\"67.31\" r=\"3.6\" />\n    <circle cx=\"453.7033333333334\" cy=\"43.14833333333333\" r=\"3.6\" />\n    <circle cx=\"395.555\" cy=\"38.281666666666666\" r=\"3.6\" />\n    <circle cx=\"412.185\" cy=\"28.623333333333335\" r=\"3.6\" />\n    <circle cx=\"403.90000000000003\" cy=\"33.45\" r=\"3.6\" />\n    <circle cx=\"445.4116666666667\" cy=\"18.938333333333333\" r=\"3.6\" />\n    <circle cx=\"437.1133333333333\" cy=\"23.77333333333333\" r=\"3.6\" />\n    <circle cx=\"453.7050000000001\" cy=\"23.78333333333333\" r=\"3.6\" />\n    <circle cx=\"395.62000000000006\" cy=\"57.61666666666667\" r=\"3.6\" />\n    <circle cx=\"403.925\" cy=\"62.468333333333334\" r=\"3.6\" />\n    <circle cx=\"428.845\" cy=\"47.95333333333334\" r=\"3.6\" />\n    <circle cx=\"420.55\" cy=\"52.79833333333334\" r=\"3.6\" />\n    <circle cx=\"412.23499999999996\" cy=\"57.64666666666667\" r=\"3.6\" />\n    <circle cx=\"387.27500000000003\" cy=\"62.44666666666668\" r=\"3.6\" />\n    <circle cx=\"387.25500000000005\" cy=\"23.77333333333333\" r=\"3.6\" />\n    <circle cx=\"445.4216666666666\" cy=\"38.278333333333336\" r=\"3.6\" />\n    <circle cx=\"470.3200000000001\" cy=\"23.786666666666665\" r=\"3.6\" />\n    <circle cx=\"478.60999999999996\" cy=\"9.263333333333334\" r=\"3.6\" />\n    <circle cx=\"395.57\" cy=\"18.919999999999998\" r=\"3.6\" />\n    <circle cx=\"437.165\" cy=\"43.12833333333333\" r=\"3.6\" />\n    <circle cx=\"462.0316666666667\" cy=\"38.29\" r=\"3.6\" />\n    <circle cx=\"428.825\" cy=\"38.27666666666667\" r=\"3.6\" />\n    <circle cx=\"445.41166666666663\" cy=\"28.60833333333333\" r=\"3.6\" />\n    <circle cx=\"437.1233333333333\" cy=\"33.443333333333335\" r=\"3.6\" />\n    <circle cx=\"453.71166666666676\" cy=\"33.45\" r=\"3.6\" />\n    <circle cx=\"461.99666666666667\" cy=\"28.641666666666666\" r=\"3.6\" />\n    <circle cx=\"412.205\" cy=\"47.96333333333333\" r=\"3.6\" />\n    <circle cx=\"420.535\" cy=\"43.12\" r=\"3.6\" />\n    <circle cx=\"420.52\" cy=\"14.116666666666665\" r=\"3.6\" />\n    <circle cx=\"437.1133333333333\" cy=\"14.103333333333332\" r=\"3.6\" />\n    <circle cx=\"403.8833333333334\" cy=\"14.11166666666667\" r=\"3.6\" />\n    <circle cx=\"453.705\" cy=\"14.116666666666669\" r=\"3.6\" />\n    <circle cx=\"461.965\" cy=\"18.95333333333333\" r=\"3.6\" />\n    <circle cx=\"470.31500000000005\" cy=\"14.123333333333335\" r=\"3.6\" />\n    <circle cx=\"470.305\" cy=\"62.48500000000001\" r=\"3.6\" />\n    <circle cx=\"461.99666666666667\" cy=\"57.61166666666667\" r=\"3.6\" />\n    <circle cx=\"478.62999999999994\" cy=\"57.61166666666667\" r=\"3.6\" />\n    <circle cx=\"486.99999999999994\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"503.54999999999995\" cy=\"81.80333333333333\" r=\"3.6\" />\n    <circle cx=\"503.5416666666667\" cy=\"101.145\" r=\"3.6\" />\n    <circle cx=\"511.905\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"503.5416666666667\" cy=\"91.46833333333332\" r=\"3.6\" />\n    <circle cx=\"544.4785714285714\" cy=\"18.662857142857142\" r=\"3.6\" />\n    <circle cx=\"560.6916666666666\" cy=\"18.958333333333332\" r=\"3.6\" />\n    <circle cx=\"552.3666666666667\" cy=\"14.098333333333331\" r=\"3.6\" />\n    <circle cx=\"568.995\" cy=\"14.086666666666666\" r=\"3.6\" />\n    <circle cx=\"552.4699999999999\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"610.495\" cy=\"9.266666666666666\" r=\"3.6\" />\n    <circle cx=\"627.0899999999999\" cy=\"9.253333333333332\" r=\"3.6\" />\n    <circle cx=\"643.7216666666667\" cy=\"38.275\" r=\"3.6\" />\n    <circle cx=\"635.37\" cy=\"33.428333333333335\" r=\"3.6\" />\n    <circle cx=\"651.9716666666667\" cy=\"23.776666666666667\" r=\"3.6\" />\n    <circle cx=\"643.685\" cy=\"28.58666666666667\" r=\"3.6\" />\n    <circle cx=\"660.2633333333334\" cy=\"18.908333333333335\" r=\"3.6\" />\n    <circle cx=\"660.4133333333333\" cy=\"357.325\" r=\"3.6\" />\n    <circle cx=\"652.11\" cy=\"381.5383333333334\" r=\"3.6\" />\n    <circle cx=\"652.08\" cy=\"362.1816666666667\" r=\"3.6\" />\n    <circle cx=\"668.7133333333333\" cy=\"342.83\" r=\"3.6\" />\n    <circle cx=\"668.745\" cy=\"352.4916666666666\" r=\"3.6\" />\n    <circle cx=\"652.08\" cy=\"371.8516666666667\" r=\"3.6\" />\n    <circle cx=\"660.4533333333334\" cy=\"367.00666666666666\" r=\"3.6\" />\n    <circle cx=\"660.4533333333334\" cy=\"376.6766666666667\" r=\"3.6\" />\n    <circle cx=\"710.5749999999999\" cy=\"9.26\" r=\"3.6\" />\n    <circle cx=\"718.4266666666667\" cy=\"14.11\" r=\"3.6\" />\n    <circle cx=\"818.0166666666668\" cy=\"23.773333333333337\" r=\"3.6\" />\n    <circle cx=\"859.58\" cy=\"105.95833333333336\" r=\"3.6\" />\n    <circle cx=\"859.58\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"859.5749999999999\" cy=\"115.62833333333334\" r=\"3.6\" />\n    <circle cx=\"859.58\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"842.9350000000001\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"851.2783333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"834.6599999999999\" cy=\"149.475\" r=\"3.6\" />\n    <circle cx=\"851.275\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"851.275\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"851.2866666666667\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"793.11\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"801.4383333333334\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"809.7400000000001\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"528.5283333333334\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"834.66\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"818.0366666666667\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"842.9466666666666\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"826.3683333333333\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"784.8216666666667\" cy=\"81.80833333333334\" r=\"3.6\" />\n    <circle cx=\"751.6533333333333\" cy=\"159.14666666666668\" r=\"3.6\" />\n    <circle cx=\"743.305\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"735.035\" cy=\"149.475\" r=\"3.6\" />\n    <circle cx=\"759.9583333333334\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"726.7283333333334\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"768.255\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"709.7887499999999\" cy=\"134.96375\" r=\"3.6\" />\n    <circle cx=\"718.4266666666666\" cy=\"139.79666666666668\" r=\"3.6\" />\n    <circle cx=\"776.5499999999998\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"818.07\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"809.75\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"826.4\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"834.69\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"801.4466666666667\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"834.68\" cy=\"159.15833333333333\" r=\"3.6\" />\n    <circle cx=\"784.8333333333334\" cy=\"149.475\" r=\"3.6\" />\n    <circle cx=\"793.1183333333333\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"560.7333333333333\" cy=\"105.95666666666666\" r=\"3.6\" />\n    <circle cx=\"560.7283333333334\" cy=\"115.62666666666667\" r=\"3.6\" />\n    <circle cx=\"702.13875\" cy=\"139.7975\" r=\"3.6\" />\n    <circle cx=\"552.4266666666666\" cy=\"139.79666666666665\" r=\"3.6\" />\n    <circle cx=\"560.725\" cy=\"96.28166666666668\" r=\"3.6\" />\n    <circle cx=\"560.7133333333334\" cy=\"125.30166666666668\" r=\"3.6\" />\n    <circle cx=\"602.255\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"577.3516666666666\" cy=\"86.60166666666667\" r=\"3.6\" />\n    <circle cx=\"593.9633333333334\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"585.66\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"520.2133333333334\" cy=\"168.8216666666667\" r=\"3.6\" />\n    <circle cx=\"520.235\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"520.235\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"520.1883333333334\" cy=\"159.13166666666666\" r=\"3.6\" />\n    <circle cx=\"520.23\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"610.515\" cy=\"96.28666666666668\" r=\"3.6\" />\n    <circle cx=\"520.2133333333334\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"520.22\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"718.44\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"768.225\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"726.7199999999999\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"710.1442857142857\" cy=\"77.23285714285716\" r=\"3.6\" />\n    <circle cx=\"702.14125\" cy=\"81.78125\" r=\"3.6\" />\n    <circle cx=\"743.275\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"759.9050000000001\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"735.0016666666667\" cy=\"72.125\" r=\"3.6\" />\n    <circle cx=\"751.6\" cy=\"72.13666666666667\" r=\"3.6\" />\n    <circle cx=\"693.48\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"685.2033333333334\" cy=\"91.45166666666667\" r=\"3.6\" />\n    <circle cx=\"635.4449999999999\" cy=\"101.10666666666667\" r=\"3.6\" />\n    <circle cx=\"826.3566666666667\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"618.855\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"627.1483333333333\" cy=\"105.94666666666666\" r=\"3.6\" />\n    <circle cx=\"643.7633333333333\" cy=\"105.94666666666667\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"660.3383333333334\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"668.595\" cy=\"101.10666666666667\" r=\"3.6\" />\n    <circle cx=\"776.54\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"685.2033333333334\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"702.1487500000001\" cy=\"91.45375000000001\" r=\"3.6\" />\n    <circle cx=\"693.48\" cy=\"96.28666666666668\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"105.94666666666667\" r=\"3.6\" />\n    <circle cx=\"735.0233333333332\" cy=\"81.80833333333334\" r=\"3.6\" />\n    <circle cx=\"668.59\" cy=\"110.77500000000002\" r=\"3.6\" />\n    <circle cx=\"726.7416666666667\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"743.295\" cy=\"86.63666666666666\" r=\"3.6\" />\n    <circle cx=\"709.7987499999999\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"718.44\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"618.8516666666666\" cy=\"110.79\" r=\"3.6\" />\n    <circle cx=\"627.14\" cy=\"115.61833333333333\" r=\"3.6\" />\n    <circle cx=\"610.515\" cy=\"105.95666666666666\" r=\"3.6\" />\n    <circle cx=\"602.2516666666667\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"593.9616666666667\" cy=\"105.94666666666667\" r=\"3.6\" />\n    <circle cx=\"635.4399999999999\" cy=\"110.77666666666669\" r=\"3.6\" />\n    <circle cx=\"660.3383333333334\" cy=\"105.94666666666666\" r=\"3.6\" />\n    <circle cx=\"643.76\" cy=\"115.61666666666667\" r=\"3.6\" />\n    <circle cx=\"652.015\" cy=\"110.79\" r=\"3.6\" />\n    <circle cx=\"851.2866666666667\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"842.9466666666666\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"834.66\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"851.2816666666666\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"826.3683333333333\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"842.9350000000001\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"834.65\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"842.935\" cy=\"125.31333333333332\" r=\"3.6\" />\n    <circle cx=\"842.9416666666666\" cy=\"115.64333333333333\" r=\"3.6\" />\n    <circle cx=\"793.11\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"768.225\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"818.0366666666667\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"776.54\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"759.9250000000001\" cy=\"86.62333333333333\" r=\"3.6\" />\n    <circle cx=\"784.8316666666666\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"809.7400000000001\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"801.4483333333333\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"751.62\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"577.3616666666667\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"602.3483333333334\" cy=\"255.82333333333335\" r=\"3.6\" />\n    <circle cx=\"618.9499999999999\" cy=\"246.15333333333334\" r=\"3.6\" />\n    <circle cx=\"610.61\" cy=\"250.99333333333334\" r=\"3.6\" />\n    <circle cx=\"627.25\" cy=\"241.30166666666665\" r=\"3.6\" />\n    <circle cx=\"635.485\" cy=\"197.80166666666665\" r=\"3.6\" />\n    <circle cx=\"577.4583333333333\" cy=\"250.97833333333335\" r=\"3.6\" />\n    <circle cx=\"577.4583333333333\" cy=\"260.6466666666667\" r=\"3.6\" />\n    <circle cx=\"594.055\" cy=\"260.6466666666667\" r=\"3.6\" />\n    <circle cx=\"585.7299999999999\" cy=\"265.4733333333333\" r=\"3.6\" />\n    <circle cx=\"652.0516666666666\" cy=\"168.79999999999998\" r=\"3.6\" />\n    <circle cx=\"676.9200000000001\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"643.8033333333333\" cy=\"192.96666666666667\" r=\"3.6\" />\n    <circle cx=\"685.2033333333334\" cy=\"149.45833333333334\" r=\"3.6\" />\n    <circle cx=\"660.3683333333333\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"668.625\" cy=\"159.12333333333333\" r=\"3.6\" />\n    <circle cx=\"652.0616666666666\" cy=\"188.14\" r=\"3.6\" />\n    <circle cx=\"577.4583333333334\" cy=\"241.3083333333333\" r=\"3.6\" />\n    <circle cx=\"652.0516666666666\" cy=\"178.47\" r=\"3.6\" />\n    <circle cx=\"528.5083333333334\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"569.0616666666666\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"569.0683333333333\" cy=\"110.78999999999998\" r=\"3.6\" />\n    <circle cx=\"569.0300000000001\" cy=\"130.145\" r=\"3.6\" />\n    <circle cx=\"528.5083333333334\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"585.66\" cy=\"101.10666666666667\" r=\"3.6\" />\n    <circle cx=\"569.07\" cy=\"101.12166666666667\" r=\"3.6\" />\n    <circle cx=\"693.4699999999999\" cy=\"144.63333333333335\" r=\"3.6\" />\n    <circle cx=\"569.1533333333333\" cy=\"236.47666666666666\" r=\"3.6\" />\n    <circle cx=\"569.04\" cy=\"91.435\" r=\"3.6\" />\n    <circle cx=\"552.4833333333333\" cy=\"226.81333333333336\" r=\"3.6\" />\n    <circle cx=\"536.825\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"544.995\" cy=\"221.98625\" r=\"3.6\" />\n    <circle cx=\"560.8050000000001\" cy=\"231.655\" r=\"3.6\" />\n    <circle cx=\"528.5083333333334\" cy=\"183.30999999999997\" r=\"3.6\" />\n    <circle cx=\"528.5183333333333\" cy=\"192.98\" r=\"3.6\" />\n    <circle cx=\"528.5283333333334\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"528.5283333333334\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"652.0200000000001\" cy=\"101.12\" r=\"3.6\" />\n    <circle cx=\"552.4200000000001\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"577.3366666666667\" cy=\"76.94166666666666\" r=\"3.6\" />\n    <circle cx=\"552.4200000000001\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"585.66\" cy=\"81.77\" r=\"3.6\" />\n    <circle cx=\"610.515\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"618.855\" cy=\"91.45166666666667\" r=\"3.6\" />\n    <circle cx=\"593.9616666666667\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"551.9371428571429\" cy=\"120.73571428571428\" r=\"3.6\" />\n    <circle cx=\"602.255\" cy=\"91.45166666666667\" r=\"3.6\" />\n    <circle cx=\"627.1483333333333\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"544.5557142857143\" cy=\"135.25285714285715\" r=\"3.6\" />\n    <circle cx=\"511.88499999999993\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"503.61999999999995\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"503.62000000000006\" cy=\"207.49333333333337\" r=\"3.6\" />\n    <circle cx=\"511.875\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"511.86499999999995\" cy=\"163.98\" r=\"3.6\" />\n    <circle cx=\"511.875\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"660.3383333333334\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"734.9916666666667\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"743.255\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"726.6983333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"718.4183333333334\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"759.8833333333332\" cy=\"67.28666666666666\" r=\"3.6\" />\n    <circle cx=\"768.2049999999999\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"635.4449999999999\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"776.52\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"709.75875\" cy=\"67.28375000000001\" r=\"3.6\" />\n    <circle cx=\"751.5900000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"668.595\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"652.0200000000001\" cy=\"91.45\" r=\"3.6\" />\n    <circle cx=\"495.32666666666665\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"643.7633333333333\" cy=\"96.27666666666669\" r=\"3.6\" />\n    <circle cx=\"693.4583333333334\" cy=\"76.95500000000001\" r=\"3.6\" />\n    <circle cx=\"701.7585714285715\" cy=\"71.84285714285714\" r=\"3.6\" />\n    <circle cx=\"685.1916666666666\" cy=\"81.78833333333334\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"610.5533333333334\" cy=\"289.6666666666667\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"313.83\" r=\"3.6\" />\n    <circle cx=\"610.595\" cy=\"328.3433333333333\" r=\"3.6\" />\n    <circle cx=\"577.44\" cy=\"337.99833333333333\" r=\"3.6\" />\n    <circle cx=\"610.575\" cy=\"309.005\" r=\"3.6\" />\n    <circle cx=\"610.595\" cy=\"318.67333333333335\" r=\"3.6\" />\n    <circle cx=\"577.4499999999999\" cy=\"347.6666666666667\" r=\"3.6\" />\n    <circle cx=\"594.0516666666667\" cy=\"347.6683333333333\" r=\"3.6\" />\n    <circle cx=\"594.0416666666667\" cy=\"337.99833333333333\" r=\"3.6\" />\n    <circle cx=\"495.34666666666664\" cy=\"231.6583333333333\" r=\"3.6\" />\n    <circle cx=\"610.5533333333334\" cy=\"299.33666666666664\" r=\"3.6\" />\n    <circle cx=\"643.895\" cy=\"250.97666666666666\" r=\"3.6\" />\n    <circle cx=\"627.2399999999999\" cy=\"260.6466666666667\" r=\"3.6\" />\n    <circle cx=\"635.5366666666667\" cy=\"255.81000000000003\" r=\"3.6\" />\n    <circle cx=\"643.7833333333333\" cy=\"231.645\" r=\"3.6\" />\n    <circle cx=\"784.8016666666666\" cy=\"72.125\" r=\"3.6\" />\n    <circle cx=\"618.935\" cy=\"265.485\" r=\"3.6\" />\n    <circle cx=\"610.5533333333334\" cy=\"279.99666666666667\" r=\"3.6\" />\n    <circle cx=\"610.5866666666667\" cy=\"270.32666666666665\" r=\"3.6\" />\n    <circle cx=\"602.335\" cy=\"333.17333333333335\" r=\"3.6\" />\n    <circle cx=\"569.15\" cy=\"333.17333333333335\" r=\"3.6\" />\n    <circle cx=\"545.035\" cy=\"241.32375\" r=\"3.6\" />\n    <circle cx=\"536.865\" cy=\"236.48666666666665\" r=\"3.6\" />\n    <circle cx=\"552.5133333333334\" cy=\"246.15666666666667\" r=\"3.6\" />\n    <circle cx=\"511.915\" cy=\"231.67\" r=\"3.6\" />\n    <circle cx=\"503.6499999999999\" cy=\"236.50833333333333\" r=\"3.6\" />\n    <circle cx=\"520.245\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"560.825\" cy=\"250.99333333333334\" r=\"3.6\" />\n    <circle cx=\"528.5500000000001\" cy=\"231.65833333333333\" r=\"3.6\" />\n    <circle cx=\"536.845\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"577.4399999999999\" cy=\"318.65833333333336\" r=\"3.6\" />\n    <circle cx=\"577.4399999999999\" cy=\"328.3283333333333\" r=\"3.6\" />\n    <circle cx=\"560.825\" cy=\"260.66333333333336\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"299.3233333333333\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"289.6566666666667\" r=\"3.6\" />\n    <circle cx=\"569.1216666666668\" cy=\"275.17\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"577.42\" cy=\"308.9883333333333\" r=\"3.6\" />\n    <circle cx=\"643.8133333333334\" cy=\"202.63666666666666\" r=\"3.6\" />\n    <circle cx=\"793.0883333333335\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"627.2399999999999\" cy=\"250.97833333333332\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"207.46666666666667\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"217.13333333333335\" r=\"3.6\" />\n    <circle cx=\"602.3333333333334\" cy=\"265.50166666666667\" r=\"3.6\" />\n    <circle cx=\"618.9499999999999\" cy=\"255.82333333333335\" r=\"3.6\" />\n    <circle cx=\"602.3016666666666\" cy=\"275.1566666666667\" r=\"3.6\" />\n    <circle cx=\"602.2916666666666\" cy=\"284.83166666666665\" r=\"3.6\" />\n    <circle cx=\"610.61\" cy=\"260.66333333333336\" r=\"3.6\" />\n    <circle cx=\"668.625\" cy=\"168.79\" r=\"3.6\" />\n    <circle cx=\"676.94\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"685.2233333333334\" cy=\"159.13833333333335\" r=\"3.6\" />\n    <circle cx=\"652.0716666666667\" cy=\"197.81000000000003\" r=\"3.6\" />\n    <circle cx=\"693.4899999999999\" cy=\"154.305\" r=\"3.6\" />\n    <circle cx=\"660.4033333333333\" cy=\"192.96333333333334\" r=\"3.6\" />\n    <circle cx=\"660.3783333333334\" cy=\"183.3033333333333\" r=\"3.6\" />\n    <circle cx=\"660.3683333333333\" cy=\"173.6266666666667\" r=\"3.6\" />\n    <circle cx=\"569.165\" cy=\"246.15333333333334\" r=\"3.6\" />\n    <circle cx=\"585.6949999999999\" cy=\"284.81666666666666\" r=\"3.6\" />\n    <circle cx=\"569.1516666666665\" cy=\"265.485\" r=\"3.6\" />\n    <circle cx=\"577.425\" cy=\"270.32\" r=\"3.6\" />\n    <circle cx=\"585.6949999999999\" cy=\"275.1466666666667\" r=\"3.6\" />\n    <circle cx=\"569.1649999999998\" cy=\"255.82333333333335\" r=\"3.6\" />\n    <circle cx=\"544.6685714285715\" cy=\"231.9285714285714\" r=\"3.6\" />\n    <circle cx=\"701.7900000000001\" cy=\"149.19285714285715\" r=\"3.6\" />\n    <circle cx=\"552.5033333333334\" cy=\"236.49166666666667\" r=\"3.6\" />\n    <circle cx=\"560.825\" cy=\"241.32333333333335\" r=\"3.6\" />\n    <circle cx=\"602.3233333333334\" cy=\"313.8433333333333\" r=\"3.6\" />\n    <circle cx=\"602.335\" cy=\"323.50333333333333\" r=\"3.6\" />\n    <circle cx=\"594.0416666666666\" cy=\"328.3283333333333\" r=\"3.6\" />\n    <circle cx=\"602.2916666666666\" cy=\"294.50166666666667\" r=\"3.6\" />\n    <circle cx=\"602.3016666666666\" cy=\"304.165\" r=\"3.6\" />\n    <circle cx=\"585.6949999999999\" cy=\"294.4866666666666\" r=\"3.6\" />\n    <circle cx=\"585.7183333333334\" cy=\"304.155\" r=\"3.6\" />\n    <circle cx=\"585.74\" cy=\"323.49333333333334\" r=\"3.6\" />\n    <circle cx=\"585.74\" cy=\"313.8233333333333\" r=\"3.6\" />\n    <circle cx=\"635.5666666666667\" cy=\"246.12666666666664\" r=\"3.6\" />\n    <circle cx=\"867.875\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"709.7887499999999\" cy=\"144.63375000000002\" r=\"3.6\" />\n    <circle cx=\"867.87\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"876.1816666666667\" cy=\"76.97166666666668\" r=\"3.6\" />\n    <circle cx=\"867.8750000000001\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"859.57\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"851.2866666666667\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"859.57\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"842.9583333333334\" cy=\"154.315\" r=\"3.6\" />\n    <circle cx=\"867.8650000000001\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"818.0366666666667\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"826.3466666666667\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"809.7199999999999\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"801.4150000000001\" cy=\"72.13666666666667\" r=\"3.6\" />\n    <circle cx=\"834.6500000000001\" cy=\"81.80833333333334\" r=\"3.6\" />\n    <circle cx=\"851.2766666666668\" cy=\"81.79666666666667\" r=\"3.6\" />\n    <circle cx=\"859.56\" cy=\"76.95666666666668\" r=\"3.6\" />\n    <circle cx=\"842.9250000000001\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"876.2066666666666\" cy=\"96.27333333333333\" r=\"3.6\" />\n    <circle cx=\"751.6633333333333\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"776.5699999999998\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"842.98\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"768.255\" cy=\"168.80666666666667\" r=\"3.6\" />\n    <circle cx=\"759.9583333333334\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"718.4483333333333\" cy=\"149.465\" r=\"3.6\" />\n    <circle cx=\"726.7516666666667\" cy=\"154.30833333333334\" r=\"3.6\" />\n    <circle cx=\"735.055\" cy=\"159.15833333333333\" r=\"3.6\" />\n    <circle cx=\"743.3250000000002\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"834.69\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"826.4\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"842.98\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8533333333334\" cy=\"159.15833333333333\" r=\"3.6\" />\n    <circle cx=\"818.07\" cy=\"168.80666666666667\" r=\"3.6\" />\n    <circle cx=\"793.14\" cy=\"163.98666666666668\" r=\"3.6\" />\n    <circle cx=\"809.7700000000001\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"801.4699999999999\" cy=\"159.14666666666668\" r=\"3.6\" />\n    <circle cx=\"710.147142857143\" cy=\"115.89999999999999\" r=\"3.6\" />\n    <circle cx=\"743.295\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"735.035\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"726.7416666666667\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"718.4333333333333\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"759.9250000000001\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"776.5333333333333\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"768.2199999999999\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"709.7987499999999\" cy=\"105.9575\" r=\"3.6\" />\n    <circle cx=\"751.6300000000001\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"676.9\" cy=\"125.28333333333335\" r=\"3.6\" />\n    <circle cx=\"618.855\" cy=\"149.47\" r=\"3.6\" />\n    <circle cx=\"602.3083333333333\" cy=\"207.48166666666665\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"207.48333333333335\" r=\"3.6\" />\n    <circle cx=\"594.015\" cy=\"202.63666666666666\" r=\"3.6\" />\n    <circle cx=\"685.1966666666666\" cy=\"120.46\" r=\"3.6\" />\n    <circle cx=\"693.475\" cy=\"115.62666666666667\" r=\"3.6\" />\n    <circle cx=\"701.7971428571428\" cy=\"110.51857142857143\" r=\"3.6\" />\n    <circle cx=\"784.8299999999999\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"826.3800000000001\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"776.5299999999999\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"768.215\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"759.915\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8249999999999\" cy=\"120.47166666666665\" r=\"3.6\" />\n    <circle cx=\"751.6199999999999\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"726.735\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"793.1033333333334\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"735.0266666666666\" cy=\"120.47166666666665\" r=\"3.6\" />\n    <circle cx=\"743.285\" cy=\"125.31333333333333\" r=\"3.6\" />\n    <circle cx=\"793.0966666666667\" cy=\"125.31333333333333\" r=\"3.6\" />\n    <circle cx=\"818.025\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"809.735\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"801.445\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"826.3616666666667\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"801.44\" cy=\"120.47499999999998\" r=\"3.6\" />\n    <circle cx=\"809.73\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"826.3566666666666\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"818.0250000000001\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"569.105\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"602.2916666666666\" cy=\"188.13833333333332\" r=\"3.6\" />\n    <circle cx=\"602.3033333333333\" cy=\"197.81499999999997\" r=\"3.6\" />\n    <circle cx=\"602.2716666666666\" cy=\"178.45333333333335\" r=\"3.6\" />\n    <circle cx=\"618.8266666666667\" cy=\"168.80333333333334\" r=\"3.6\" />\n    <circle cx=\"585.7149999999999\" cy=\"207.46666666666667\" r=\"3.6\" />\n    <circle cx=\"602.3083333333333\" cy=\"217.14999999999998\" r=\"3.6\" />\n    <circle cx=\"594.015\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"610.5966666666667\" cy=\"202.62833333333333\" r=\"3.6\" />\n    <circle cx=\"610.5666666666667\" cy=\"212.3166666666667\" r=\"3.6\" />\n    <circle cx=\"593.9216666666666\" cy=\"154.295\" r=\"3.6\" />\n    <circle cx=\"552.4683333333334\" cy=\"197.8166666666667\" r=\"3.6\" />\n    <circle cx=\"552.4583333333334\" cy=\"188.14166666666665\" r=\"3.6\" />\n    <circle cx=\"627.13\" cy=\"144.61333333333334\" r=\"3.6\" />\n    <circle cx=\"560.765\" cy=\"183.30666666666664\" r=\"3.6\" />\n    <circle cx=\"560.785\" cy=\"202.64666666666665\" r=\"3.6\" />\n    <circle cx=\"635.4250000000001\" cy=\"139.77833333333334\" r=\"3.6\" />\n    <circle cx=\"577.4\" cy=\"154.28666666666666\" r=\"3.6\" />\n    <circle cx=\"569.07\" cy=\"178.455\" r=\"3.6\" />\n    <circle cx=\"618.8466666666667\" cy=\"159.145\" r=\"3.6\" />\n    <circle cx=\"585.705\" cy=\"188.12666666666667\" r=\"3.6\" />\n    <circle cx=\"577.4150000000001\" cy=\"202.63666666666666\" r=\"3.6\" />\n    <circle cx=\"585.7233333333332\" cy=\"178.4383333333333\" r=\"3.6\" />\n    <circle cx=\"577.4033333333334\" cy=\"192.9666666666667\" r=\"3.6\" />\n    <circle cx=\"602.2316666666667\" cy=\"149.44333333333336\" r=\"3.6\" />\n    <circle cx=\"602.2566666666667\" cy=\"159.16166666666666\" r=\"3.6\" />\n    <circle cx=\"585.7149999999999\" cy=\"197.7966666666667\" r=\"3.6\" />\n    <circle cx=\"602.2033333333334\" cy=\"139.79000000000002\" r=\"3.6\" />\n    <circle cx=\"610.535\" cy=\"144.61666666666667\" r=\"3.6\" />\n    <circle cx=\"560.775\" cy=\"192.9766666666667\" r=\"3.6\" />\n    <circle cx=\"735.0316666666666\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"569.115\" cy=\"197.80833333333337\" r=\"3.6\" />\n    <circle cx=\"577.3933333333334\" cy=\"183.29666666666665\" r=\"3.6\" />\n    <circle cx=\"610.525\" cy=\"154.305\" r=\"3.6\" />\n    <circle cx=\"593.9933333333332\" cy=\"183.29666666666665\" r=\"3.6\" />\n    <circle cx=\"594.005\" cy=\"192.96666666666667\" r=\"3.6\" />\n    <circle cx=\"577.3950000000001\" cy=\"173.61666666666667\" r=\"3.6\" />\n    <circle cx=\"594.0416666666667\" cy=\"318.65833333333336\" r=\"3.6\" />\n    <circle cx=\"901.005\" cy=\"43.10166666666666\" r=\"3.6\" />\n    <circle cx=\"917.64\" cy=\"43.086666666666666\" r=\"3.6\" />\n    <circle cx=\"876.1350000000001\" cy=\"38.24333333333333\" r=\"3.6\" />\n    <circle cx=\"934.225\" cy=\"43.10666666666666\" r=\"3.6\" />\n    <circle cx=\"826.3083333333334\" cy=\"38.251666666666665\" r=\"3.6\" />\n    <circle cx=\"784.77\" cy=\"33.435\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"38.266666666666666\" r=\"3.6\" />\n    <circle cx=\"959.1383333333333\" cy=\"47.93666666666667\" r=\"3.6\" />\n    <circle cx=\"842.9149999999998\" cy=\"38.27\" r=\"3.6\" />\n    <circle cx=\"801.3650000000001\" cy=\"33.434999999999995\" r=\"3.6\" />\n    <circle cx=\"743.29\" cy=\"115.64333333333332\" r=\"3.6\" />\n    <circle cx=\"917.62\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"934.23\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"909.3216666666667\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"942.5050000000001\" cy=\"57.629999999999995\" r=\"3.6\" />\n    <circle cx=\"942.5050000000001\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"934.23\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"950.8449999999999\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"901.0750000000002\" cy=\"159.165\" r=\"3.6\" />\n    <circle cx=\"751.5450000000001\" cy=\"23.76166666666667\" r=\"3.6\" />\n    <circle cx=\"503.60166666666674\" cy=\"275.19\" r=\"3.6\" />\n    <circle cx=\"793.1816666666665\" cy=\"212.35833333333335\" r=\"3.6\" />\n    <circle cx=\"569.16\" cy=\"420.2\" r=\"3.6\" />\n    <circle cx=\"768.3649999999999\" cy=\"265.5\" r=\"3.6\" />\n    <circle cx=\"950.8699999999999\" cy=\"101.15833333333335\" r=\"3.6\" />\n    <circle cx=\"975.7583333333332\" cy=\"57.63166666666667\" r=\"3.6\" />\n    <circle cx=\"842.995\" cy=\"309.0416666666667\" r=\"3.6\" />\n    <circle cx=\"892.7533333333332\" cy=\"135.00166666666667\" r=\"3.6\" />\n    <circle cx=\"585.8216666666666\" cy=\"420.20666666666665\" r=\"3.6\" />\n    <circle cx=\"660.2750000000001\" cy=\"47.905\" r=\"3.6\" />\n    <circle cx=\"710.1014285714285\" cy=\"28.874285714285715\" r=\"3.6\" />\n    <circle cx=\"487.01499999999993\" cy=\"275.18833333333333\" r=\"3.6\" />\n    <circle cx=\"734.9583333333334\" cy=\"23.763333333333335\" r=\"3.6\" />\n    <circle cx=\"676.8283333333334\" cy=\"38.25\" r=\"3.6\" />\n    <circle cx=\"577.3216666666666\" cy=\"38.25166666666667\" r=\"3.6\" />\n    <circle cx=\"635.425\" cy=\"52.741666666666674\" r=\"3.6\" />\n    <circle cx=\"610.495\" cy=\"47.92166666666666\" r=\"3.6\" />\n    <circle cx=\"925.9366666666666\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"594.0183333333333\" cy=\"308.9883333333333\" r=\"3.6\" />\n    <circle cx=\"569.12\" cy=\"207.48166666666665\" r=\"3.6\" />\n    <circle cx=\"593.9983333333333\" cy=\"299.3233333333333\" r=\"3.6\" />\n    <circle cx=\"585.75\" cy=\"342.83\" r=\"3.6\" />\n    <circle cx=\"593.9983333333333\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"503.62999999999994\" cy=\"226.82666666666663\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"222.0033333333333\" r=\"3.6\" />\n    <circle cx=\"876.23\" cy=\"86.62\" r=\"3.6\" />\n    <circle cx=\"867.8750000000001\" cy=\"91.45333333333333\" r=\"3.6\" />\n    <circle cx=\"593.9983333333333\" cy=\"289.6566666666667\" r=\"3.6\" />\n    <circle cx=\"751.6233333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"759.9200000000001\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"594.0266666666668\" cy=\"270.31666666666666\" r=\"3.6\" />\n    <circle cx=\"751.6283333333334\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"768.215\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"834.6566666666666\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"842.9466666666667\" cy=\"105.97333333333331\" r=\"3.6\" />\n    <circle cx=\"759.915\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"585.74\" cy=\"333.16333333333336\" r=\"3.6\" />\n    <circle cx=\"826.415\" cy=\"260.655\" r=\"3.6\" />\n    <circle cx=\"909.3666666666667\" cy=\"76.95333333333333\" r=\"3.6\" />\n    <circle cx=\"826.4000000000001\" cy=\"241.32666666666663\" r=\"3.6\" />\n    <circle cx=\"826.41\" cy=\"251.0016666666667\" r=\"3.6\" />\n    <circle cx=\"843.045\" cy=\"280.0133333333334\" r=\"3.6\" />\n    <circle cx=\"760.04\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"759.9783333333334\" cy=\"221.98833333333332\" r=\"3.6\" />\n    <circle cx=\"760.0099999999999\" cy=\"231.66166666666666\" r=\"3.6\" />\n    <circle cx=\"834.7516666666667\" cy=\"246.1716666666667\" r=\"3.6\" />\n    <circle cx=\"560.8000000000001\" cy=\"270.3266666666667\" r=\"3.6\" />\n    <circle cx=\"585.76\" cy=\"362.1666666666667\" r=\"3.6\" />\n    <circle cx=\"585.76\" cy=\"352.49666666666667\" r=\"3.6\" />\n    <circle cx=\"859.5799999999999\" cy=\"144.64333333333335\" r=\"3.6\" />\n    <circle cx=\"834.7416666666667\" cy=\"236.50833333333333\" r=\"3.6\" />\n    <circle cx=\"834.7216666666667\" cy=\"226.82666666666663\" r=\"3.6\" />\n    <circle cx=\"552.5133333333334\" cy=\"265.49666666666667\" r=\"3.6\" />\n    <circle cx=\"478.73333333333335\" cy=\"231.65833333333333\" r=\"3.6\" />\n    <circle cx=\"668.585\" cy=\"130.11333333333332\" r=\"3.6\" />\n    <circle cx=\"577.3583333333332\" cy=\"115.61666666666666\" r=\"3.6\" />\n    <circle cx=\"577.3533333333332\" cy=\"125.28333333333332\" r=\"3.6\" />\n    <circle cx=\"569\" cy=\"139.79333333333332\" r=\"3.6\" />\n    <circle cx=\"577.3616666666667\" cy=\"105.94666666666666\" r=\"3.6\" />\n    <circle cx=\"577.3533333333332\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"610.5416666666666\" cy=\"115.64499999999998\" r=\"3.6\" />\n    <circle cx=\"602.2483333333333\" cy=\"120.46\" r=\"3.6\" />\n    <circle cx=\"627.1233333333333\" cy=\"125.28000000000002\" r=\"3.6\" />\n    <circle cx=\"593.9549999999999\" cy=\"115.61666666666667\" r=\"3.6\" />\n    <circle cx=\"585.6566666666666\" cy=\"110.77666666666669\" r=\"3.6\" />\n    <circle cx=\"536.825\" cy=\"207.48333333333335\" r=\"3.6\" />\n    <circle cx=\"544.995\" cy=\"212.31625\" r=\"3.6\" />\n    <circle cx=\"536.825\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"552.4733333333334\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"536.855\" cy=\"159.13000000000002\" r=\"3.6\" />\n    <circle cx=\"536.835\" cy=\"168.78833333333333\" r=\"3.6\" />\n    <circle cx=\"536.815\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"536.8050000000001\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"709.7987499999999\" cy=\"96.2875\" r=\"3.6\" />\n    <circle cx=\"735.035\" cy=\"91.46999999999998\" r=\"3.6\" />\n    <circle cx=\"743.295\" cy=\"96.30666666666667\" r=\"3.6\" />\n    <circle cx=\"726.7416666666667\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"560.785\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"718.44\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"768.225\" cy=\"101.12333333333333\" r=\"3.6\" />\n    <circle cx=\"635.4350000000001\" cy=\"120.44666666666667\" r=\"3.6\" />\n    <circle cx=\"776.54\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"759.9250000000001\" cy=\"96.29\" r=\"3.6\" />\n    <circle cx=\"751.6300000000001\" cy=\"91.47000000000001\" r=\"3.6\" />\n    <circle cx=\"660.3316666666666\" cy=\"115.61666666666666\" r=\"3.6\" />\n    <circle cx=\"652.0083333333333\" cy=\"120.46\" r=\"3.6\" />\n    <circle cx=\"643.7533333333333\" cy=\"125.28333333333335\" r=\"3.6\" />\n    <circle cx=\"668.585\" cy=\"120.44666666666667\" r=\"3.6\" />\n    <circle cx=\"676.9066666666666\" cy=\"115.61666666666667\" r=\"3.6\" />\n    <circle cx=\"693.48\" cy=\"105.95666666666666\" r=\"3.6\" />\n    <circle cx=\"702.1487500000001\" cy=\"101.12375\" r=\"3.6\" />\n    <circle cx=\"685.2016666666667\" cy=\"110.79166666666667\" r=\"3.6\" />\n    <circle cx=\"660.3466666666667\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"726.7283333333334\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"735.025\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"743.285\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"718.4266666666666\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"709.7887499999999\" cy=\"125.29625\" r=\"3.6\" />\n    <circle cx=\"751.6300000000001\" cy=\"149.48666666666668\" r=\"3.6\" />\n    <circle cx=\"693.4699999999999\" cy=\"134.96333333333334\" r=\"3.6\" />\n    <circle cx=\"685.1933333333333\" cy=\"139.79333333333332\" r=\"3.6\" />\n    <circle cx=\"569.13\" cy=\"226.82333333333335\" r=\"3.6\" />\n    <circle cx=\"793.0966666666667\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"801.4366666666666\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"676.9000000000001\" cy=\"144.61833333333334\" r=\"3.6\" />\n    <circle cx=\"809.73\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"818.0483333333332\" cy=\"149.465\" r=\"3.6\" />\n    <circle cx=\"776.5299999999999\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"768.235\" cy=\"149.465\" r=\"3.6\" />\n    <circle cx=\"759.9366666666666\" cy=\"154.30666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8216666666667\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"702.13875\" cy=\"130.13\" r=\"3.6\" />\n    <circle cx=\"585.755\" cy=\"255.80999999999997\" r=\"3.6\" />\n    <circle cx=\"668.605\" cy=\"149.45499999999998\" r=\"3.6\" />\n    <circle cx=\"602.3483333333334\" cy=\"246.1533333333333\" r=\"3.6\" />\n    <circle cx=\"618.9399999999999\" cy=\"236.47666666666666\" r=\"3.6\" />\n    <circle cx=\"610.61\" cy=\"241.32333333333335\" r=\"3.6\" />\n    <circle cx=\"577.4366666666666\" cy=\"231.63833333333335\" r=\"3.6\" />\n    <circle cx=\"585.755\" cy=\"246.1433333333333\" r=\"3.6\" />\n    <circle cx=\"585.755\" cy=\"236.47333333333333\" r=\"3.6\" />\n    <circle cx=\"594.055\" cy=\"250.97833333333332\" r=\"3.6\" />\n    <circle cx=\"643.7933333333333\" cy=\"173.6266666666667\" r=\"3.6\" />\n    <circle cx=\"643.7933333333333\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"652.0516666666666\" cy=\"159.13000000000002\" r=\"3.6\" />\n    <circle cx=\"784.8316666666666\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"635.485\" cy=\"188.12666666666667\" r=\"3.6\" />\n    <circle cx=\"627.185\" cy=\"192.97\" r=\"3.6\" />\n    <circle cx=\"643.7933333333333\" cy=\"183.29666666666665\" r=\"3.6\" />\n    <circle cx=\"627.25\" cy=\"231.63333333333333\" r=\"3.6\" />\n    <circle cx=\"643.7533333333333\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"544.97125\" cy=\"183.30749999999998\" r=\"3.6\" />\n    <circle cx=\"577.3566666666667\" cy=\"144.62666666666664\" r=\"3.6\" />\n    <circle cx=\"544.6214285714285\" cy=\"173.91428571428574\" r=\"3.6\" />\n    <circle cx=\"585.7133333333333\" cy=\"139.78333333333333\" r=\"3.6\" />\n    <circle cx=\"552.4616666666666\" cy=\"178.46833333333333\" r=\"3.6\" />\n    <circle cx=\"610.5566666666667\" cy=\"125.30166666666666\" r=\"3.6\" />\n    <circle cx=\"594.055\" cy=\"241.3083333333333\" r=\"3.6\" />\n    <circle cx=\"585.6533333333333\" cy=\"120.44666666666667\" r=\"3.6\" />\n    <circle cx=\"585.6833333333333\" cy=\"130.13166666666666\" r=\"3.6\" />\n    <circle cx=\"569.12\" cy=\"217.15\" r=\"3.6\" />\n    <circle cx=\"585.735\" cy=\"226.80499999999998\" r=\"3.6\" />\n    <circle cx=\"635.425\" cy=\"130.11999999999998\" r=\"3.6\" />\n    <circle cx=\"577.4150000000001\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"544.6357142857142\" cy=\"193.25142857142856\" r=\"3.6\" />\n    <circle cx=\"594.035\" cy=\"231.63833333333332\" r=\"3.6\" />\n    <circle cx=\"544.9950000000001\" cy=\"202.64625\" r=\"3.6\" />\n    <circle cx=\"560.785\" cy=\"212.3166666666667\" r=\"3.6\" />\n    <circle cx=\"552.4733333333334\" cy=\"207.48333333333332\" r=\"3.6\" />\n    <circle cx=\"593.975\" cy=\"125.29666666666668\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"627.18\" cy=\"173.62666666666667\" r=\"3.6\" />\n    <circle cx=\"610.5466666666666\" cy=\"183.30666666666664\" r=\"3.6\" />\n    <circle cx=\"577.4150000000001\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"610.5816666666666\" cy=\"192.99\" r=\"3.6\" />\n    <circle cx=\"594.015\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"585.7149999999999\" cy=\"217.13333333333333\" r=\"3.6\" />\n    <circle cx=\"602.3183333333335\" cy=\"226.8116666666667\" r=\"3.6\" />\n    <circle cx=\"610.5666666666667\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"618.8566666666667\" cy=\"178.455\" r=\"3.6\" />\n    <circle cx=\"652.0083333333333\" cy=\"139.79\" r=\"3.6\" />\n    <circle cx=\"660.3249999999999\" cy=\"125.28333333333335\" r=\"3.6\" />\n    <circle cx=\"660.325\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"627.18\" cy=\"163.95833333333334\" r=\"3.6\" />\n    <circle cx=\"652.0083333333333\" cy=\"130.12333333333333\" r=\"3.6\" />\n    <circle cx=\"627.16\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"635.455\" cy=\"149.45499999999998\" r=\"3.6\" />\n    <circle cx=\"643.7533333333333\" cy=\"144.61833333333334\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"178.45666666666668\" r=\"3.6\" />\n    <circle cx=\"768.215\" cy=\"139.79666666666668\" r=\"3.6\" />\n    <circle cx=\"776.5299999999999\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"784.8216666666667\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"793.0966666666667\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"726.7283333333334\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"743.285\" cy=\"134.98333333333332\" r=\"3.6\" />\n    <circle cx=\"735.025\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"751.6199999999999\" cy=\"139.81333333333333\" r=\"3.6\" />\n    <circle cx=\"759.915\" cy=\"144.63666666666668\" r=\"3.6\" />\n    <circle cx=\"801.4366666666666\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"818.0299999999999\" cy=\"110.79333333333334\" r=\"3.6\" />\n    <circle cx=\"602.3383333333335\" cy=\"236.48833333333332\" r=\"3.6\" />\n    <circle cx=\"826.3683333333333\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"801.4483333333333\" cy=\"101.13666666666666\" r=\"3.6\" />\n    <circle cx=\"826.3566666666666\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"834.65\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"818.0250000000001\" cy=\"139.79666666666668\" r=\"3.6\" />\n    <circle cx=\"809.73\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"834.6533333333333\" cy=\"120.47166666666668\" r=\"3.6\" />\n    <circle cx=\"718.4266666666666\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"627.18\" cy=\"183.2966666666667\" r=\"3.6\" />\n    <circle cx=\"793.11\" cy=\"105.97333333333334\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"159.12333333333333\" r=\"3.6\" />\n    <circle cx=\"610.5883333333334\" cy=\"231.655\" r=\"3.6\" />\n    <circle cx=\"643.7733333333333\" cy=\"154.28833333333333\" r=\"3.6\" />\n    <circle cx=\"618.92\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"618.8916666666667\" cy=\"188.145\" r=\"3.6\" />\n    <circle cx=\"635.475\" cy=\"168.79\" r=\"3.6\" />\n    <circle cx=\"693.4699999999999\" cy=\"125.29666666666667\" r=\"3.6\" />\n    <circle cx=\"652.0300000000001\" cy=\"149.46166666666667\" r=\"3.6\" />\n    <circle cx=\"643.7833333333333\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"685.1933333333333\" cy=\"130.1266666666667\" r=\"3.6\" />\n    <circle cx=\"702.14\" cy=\"120.46374999999999\" r=\"3.6\" />\n    <circle cx=\"676.9000000000001\" cy=\"134.94833333333335\" r=\"3.6\" />\n    <circle cx=\"660.325\" cy=\"144.61833333333334\" r=\"3.6\" />\n    <circle cx=\"668.585\" cy=\"139.78333333333333\" r=\"3.6\" />\n    <circle cx=\"809.7400000000001\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"544.9325\" cy=\"289.66625\" r=\"3.6\" />\n    <circle cx=\"544.9549999999999\" cy=\"280.01\" r=\"3.6\" />\n    <circle cx=\"552.455\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"552.465\" cy=\"304.1683333333333\" r=\"3.6\" />\n    <circle cx=\"544.6414285714287\" cy=\"270.6114285714286\" r=\"3.6\" />\n    <circle cx=\"552.0157142857142\" cy=\"313.57142857142856\" r=\"3.6\" />\n    <circle cx=\"520.275\" cy=\"255.84166666666667\" r=\"3.6\" />\n    <circle cx=\"528.57\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"536.84\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"511.9350000000001\" cy=\"260.6766666666667\" r=\"3.6\" />\n    <circle cx=\"569.2100000000002\" cy=\"400.8566666666666\" r=\"3.6\" />\n    <circle cx=\"569.1800000000002\" cy=\"381.5266666666667\" r=\"3.6\" />\n    <circle cx=\"569.1999999999999\" cy=\"391.185\" r=\"3.6\" />\n    <circle cx=\"560.8516666666668\" cy=\"396.02666666666664\" r=\"3.6\" />\n    <circle cx=\"560.83\" cy=\"367.01666666666665\" r=\"3.6\" />\n    <circle cx=\"544.6342857142856\" cy=\"347.95714285714286\" r=\"3.6\" />\n    <circle cx=\"552.0414285714287\" cy=\"352.79\" r=\"3.6\" />\n    <circle cx=\"503.5566666666667\" cy=\"139.81333333333336\" r=\"3.6\" />\n    <circle cx=\"560.82\" cy=\"376.6916666666666\" r=\"3.6\" />\n    <circle cx=\"478.71000000000004\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"503.6466666666667\" cy=\"265.5183333333334\" r=\"3.6\" />\n    <circle cx=\"487\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"470.42\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"495.2716666666666\" cy=\"154.33333333333334\" r=\"3.6\" />\n    <circle cx=\"495.2633333333333\" cy=\"144.63666666666666\" r=\"3.6\" />\n    <circle cx=\"470.42\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"486.98\" cy=\"178.46833333333333\" r=\"3.6\" />\n    <circle cx=\"487\" cy=\"168.78833333333333\" r=\"3.6\" />\n    <circle cx=\"478.695\" cy=\"192.9766666666667\" r=\"3.6\" />\n    <circle cx=\"478.75333333333333\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"487.0266666666667\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"495.36666666666673\" cy=\"260.6666666666667\" r=\"3.6\" />\n    <circle cx=\"470.43\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"470.43000000000006\" cy=\"255.86\" r=\"3.6\" />\n    <circle cx=\"462.09\" cy=\"231.665\" r=\"3.6\" />\n    <circle cx=\"462.11999999999995\" cy=\"241.33666666666662\" r=\"3.6\" />\n    <circle cx=\"470.46000000000004\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"552.5166666666668\" cy=\"362.18333333333334\" r=\"3.6\" />\n    <circle cx=\"718.48\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"660.4000000000001\" cy=\"260.63000000000005\" r=\"3.6\" />\n    <circle cx=\"685.2483333333333\" cy=\"207.46666666666667\" r=\"3.6\" />\n    <circle cx=\"709.8325\" cy=\"183.3075\" r=\"3.6\" />\n    <circle cx=\"693.505\" cy=\"192.98499999999999\" r=\"3.6\" />\n    <circle cx=\"668.715\" cy=\"236.49166666666665\" r=\"3.6\" />\n    <circle cx=\"685.265\" cy=\"217.155\" r=\"3.6\" />\n    <circle cx=\"668.665\" cy=\"226.80499999999998\" r=\"3.6\" />\n    <circle cx=\"676.9633333333334\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"701.83\" cy=\"187.87000000000003\" r=\"3.6\" />\n    <circle cx=\"751.685\" cy=\"236.51333333333332\" r=\"3.6\" />\n    <circle cx=\"743.335\" cy=\"222.01\" r=\"3.6\" />\n    <circle cx=\"751.695\" cy=\"226.83833333333334\" r=\"3.6\" />\n    <circle cx=\"751.6650000000001\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"726.7616666666667\" cy=\"202.665\" r=\"3.6\" />\n    <circle cx=\"743.3449999999999\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"726.7816666666668\" cy=\"192.97833333333335\" r=\"3.6\" />\n    <circle cx=\"735.085\" cy=\"207.4933333333333\" r=\"3.6\" />\n    <circle cx=\"660.4050000000001\" cy=\"270.32500000000005\" r=\"3.6\" />\n    <circle cx=\"610.655\" cy=\"386.3666666666666\" r=\"3.6\" />\n    <circle cx=\"610.615\" cy=\"376.68666666666667\" r=\"3.6\" />\n    <circle cx=\"610.615\" cy=\"367.01666666666665\" r=\"3.6\" />\n    <circle cx=\"602.3850000000001\" cy=\"391.1966666666667\" r=\"3.6\" />\n    <circle cx=\"577.5016666666667\" cy=\"405.6783333333333\" r=\"3.6\" />\n    <circle cx=\"618.9633333333334\" cy=\"362.18666666666667\" r=\"3.6\" />\n    <circle cx=\"585.8000000000001\" cy=\"410.5133333333333\" r=\"3.6\" />\n    <circle cx=\"594.1016666666667\" cy=\"396.0133333333333\" r=\"3.6\" />\n    <circle cx=\"569.18\" cy=\"410.54\" r=\"3.6\" />\n    <circle cx=\"594.125\" cy=\"405.6933333333333\" r=\"3.6\" />\n    <circle cx=\"635.4833333333332\" cy=\"284.81666666666666\" r=\"3.6\" />\n    <circle cx=\"643.7983333333333\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"635.5133333333332\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"652.0550000000001\" cy=\"275.16\" r=\"3.6\" />\n    <circle cx=\"635.59\" cy=\"342.82666666666665\" r=\"3.6\" />\n    <circle cx=\"635.5849999999999\" cy=\"333.16333333333336\" r=\"3.6\" />\n    <circle cx=\"627.2383333333333\" cy=\"347.6666666666667\" r=\"3.6\" />\n    <circle cx=\"618.9483333333334\" cy=\"352.51\" r=\"3.6\" />\n    <circle cx=\"826.42\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"892.6899999999999\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"884.4616666666666\" cy=\"139.8133333333333\" r=\"3.6\" />\n    <circle cx=\"901.0300000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"884.43\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"909.3316666666666\" cy=\"67.29333333333334\" r=\"3.6\" />\n    <circle cx=\"901.0750000000002\" cy=\"101.135\" r=\"3.6\" />\n    <circle cx=\"892.7233333333334\" cy=\"125.31333333333332\" r=\"3.6\" />\n    <circle cx=\"892.7283333333334\" cy=\"115.64333333333333\" r=\"3.6\" />\n    <circle cx=\"901.0683333333333\" cy=\"110.80166666666668\" r=\"3.6\" />\n    <circle cx=\"876.1383333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"826.3250000000002\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"867.8350000000002\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"834.62\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"809.6999999999999\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"817.995\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"842.9049999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"851.245\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"867.9166666666666\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"876.2599999999999\" cy=\"163.97333333333333\" r=\"3.6\" />\n    <circle cx=\"826.42\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"826.41\" cy=\"231.67499999999998\" r=\"3.6\" />\n    <circle cx=\"834.7566666666667\" cy=\"265.52\" r=\"3.6\" />\n    <circle cx=\"809.7800000000001\" cy=\"192.98000000000002\" r=\"3.6\" />\n    <circle cx=\"826.42\" cy=\"202.6483333333333\" r=\"3.6\" />\n    <circle cx=\"843.0300000000001\" cy=\"251.01166666666666\" r=\"3.6\" />\n    <circle cx=\"801.485\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"818.09\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"760.0400000000001\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"801.4000000000001\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"859.6199999999999\" cy=\"192.98000000000002\" r=\"3.6\" />\n    <circle cx=\"867.9066666666668\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"867.9066666666668\" cy=\"168.80666666666664\" r=\"3.6\" />\n    <circle cx=\"851.335\" cy=\"197.81999999999996\" r=\"3.6\" />\n    <circle cx=\"843.0500000000001\" cy=\"231.65166666666664\" r=\"3.6\" />\n    <circle cx=\"843.04\" cy=\"241.33666666666667\" r=\"3.6\" />\n    <circle cx=\"851.3400000000001\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"528.47\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"593.9216666666666\" cy=\"57.59833333333333\" r=\"3.6\" />\n    <circle cx=\"569.03\" cy=\"52.77333333333333\" r=\"3.6\" />\n    <circle cx=\"577.3216666666667\" cy=\"47.928333333333335\" r=\"3.6\" />\n    <circle cx=\"602.215\" cy=\"62.443333333333335\" r=\"3.6\" />\n    <circle cx=\"585.62\" cy=\"52.76333333333333\" r=\"3.6\" />\n    <circle cx=\"627.1083333333333\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"635.405\" cy=\"62.43333333333334\" r=\"3.6\" />\n    <circle cx=\"618.8149999999999\" cy=\"62.443333333333335\" r=\"3.6\" />\n    <circle cx=\"610.475\" cy=\"57.613333333333344\" r=\"3.6\" />\n    <circle cx=\"528.4599999999999\" cy=\"76.965\" r=\"3.6\" />\n    <circle cx=\"643.7233333333334\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"511.825\" cy=\"125.32000000000001\" r=\"3.6\" />\n    <circle cx=\"560.7233333333332\" cy=\"57.63166666666666\" r=\"3.6\" />\n    <circle cx=\"520.1733333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"528.465\" cy=\"105.95333333333333\" r=\"3.6\" />\n    <circle cx=\"552.3866666666667\" cy=\"62.451666666666675\" r=\"3.6\" />\n    <circle cx=\"536.7516666666667\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"544.9012500000001\" cy=\"67.28375\" r=\"3.6\" />\n    <circle cx=\"718.3949999999999\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"751.5749999999999\" cy=\"33.45666666666667\" r=\"3.6\" />\n    <circle cx=\"743.2433333333333\" cy=\"38.29333333333334\" r=\"3.6\" />\n    <circle cx=\"734.9766666666666\" cy=\"33.45\" r=\"3.6\" />\n    <circle cx=\"759.8733333333333\" cy=\"38.276666666666664\" r=\"3.6\" />\n    <circle cx=\"768.1833333333334\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"784.785\" cy=\"43.12500000000001\" r=\"3.6\" />\n    <circle cx=\"726.6883333333334\" cy=\"38.27833333333333\" r=\"3.6\" />\n    <circle cx=\"776.4983333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"702.10375\" cy=\"43.1075\" r=\"3.6\" />\n    <circle cx=\"676.8683333333332\" cy=\"57.59833333333333\" r=\"3.6\" />\n    <circle cx=\"668.5533333333334\" cy=\"62.43333333333334\" r=\"3.6\" />\n    <circle cx=\"660.295\" cy=\"57.598333333333336\" r=\"3.6\" />\n    <circle cx=\"793.0649999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"685.1616666666667\" cy=\"52.77333333333334\" r=\"3.6\" />\n    <circle cx=\"710.1085714285715\" cy=\"38.55142857142857\" r=\"3.6\" />\n    <circle cx=\"651.9783333333334\" cy=\"62.44\" r=\"3.6\" />\n    <circle cx=\"693.4366666666666\" cy=\"47.94333333333333\" r=\"3.6\" />\n    <circle cx=\"818.09\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"602.405\" cy=\"400.8616666666667\" r=\"3.6\" />\n    <circle cx=\"594.155\" cy=\"415.34666666666664\" r=\"3.6\" />\n    <circle cx=\"610.715\" cy=\"396.02666666666664\" r=\"3.6\" />\n    <circle cx=\"577.5016666666667\" cy=\"415.3483333333333\" r=\"3.6\" />\n    <circle cx=\"544.6385714285715\" cy=\"357.62142857142857\" r=\"3.6\" />\n    <circle cx=\"618.97\" cy=\"381.52333333333337\" r=\"3.6\" />\n    <circle cx=\"560.8516666666666\" cy=\"405.6933333333333\" r=\"3.6\" />\n    <circle cx=\"676.9983333333333\" cy=\"231.64833333333334\" r=\"3.6\" />\n    <circle cx=\"560.82\" cy=\"386.3616666666667\" r=\"3.6\" />\n    <circle cx=\"635.605\" cy=\"352.49666666666667\" r=\"3.6\" />\n    <circle cx=\"668.7366666666666\" cy=\"265.4816666666666\" r=\"3.6\" />\n    <circle cx=\"660.39\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"668.7366666666666\" cy=\"255.80499999999998\" r=\"3.6\" />\n    <circle cx=\"618.97\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"652.0849999999999\" cy=\"284.8466666666667\" r=\"3.6\" />\n    <circle cx=\"643.8149999999999\" cy=\"289.665\" r=\"3.6\" />\n    <circle cx=\"627.2566666666667\" cy=\"357.3433333333333\" r=\"3.6\" />\n    <circle cx=\"544.135\" cy=\"309.01166666666666\" r=\"3.6\" />\n    <circle cx=\"552.5166666666668\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"544.9325\" cy=\"299.33625\" r=\"3.6\" />\n    <circle cx=\"462.05999999999995\" cy=\"222.0033333333333\" r=\"3.6\" />\n    <circle cx=\"462.06\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"453.7966666666667\" cy=\"236.51\" r=\"3.6\" />\n    <circle cx=\"486.94000000000005\" cy=\"149.47166666666666\" r=\"3.6\" />\n    <circle cx=\"453.8066666666667\" cy=\"246.17333333333332\" r=\"3.6\" />\n    <circle cx=\"486.9283333333333\" cy=\"139.79666666666665\" r=\"3.6\" />\n    <circle cx=\"470.39000000000004\" cy=\"197.80499999999998\" r=\"3.6\" />\n    <circle cx=\"478.675\" cy=\"183.30666666666664\" r=\"3.6\" />\n    <circle cx=\"462.05999999999995\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"528.5300000000001\" cy=\"270.33833333333337\" r=\"3.6\" />\n    <circle cx=\"511.9550000000001\" cy=\"270.3683333333334\" r=\"3.6\" />\n    <circle cx=\"520.2616666666667\" cy=\"265.50333333333333\" r=\"3.6\" />\n    <circle cx=\"536.8\" cy=\"275.17\" r=\"3.6\" />\n    <circle cx=\"470.385\" cy=\"265.50333333333333\" r=\"3.6\" />\n    <circle cx=\"462.1116666666667\" cy=\"251.01166666666666\" r=\"3.6\" />\n    <circle cx=\"478.7166666666667\" cy=\"270.33833333333337\" r=\"3.6\" />\n    <circle cx=\"495.34\" cy=\"270.33333333333337\" r=\"3.6\" />\n    <circle cx=\"851.335\" cy=\"304.18666666666667\" r=\"3.6\" />\n    <circle cx=\"876.285\" cy=\"202.64666666666665\" r=\"3.6\" />\n    <circle cx=\"884.5266666666666\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"867.9566666666666\" cy=\"207.50166666666664\" r=\"3.6\" />\n    <circle cx=\"685.285\" cy=\"226.8116666666667\" r=\"3.6\" />\n    <circle cx=\"834.6733333333335\" cy=\"294.51666666666665\" r=\"3.6\" />\n    <circle cx=\"495.25499999999994\" cy=\"134.93833333333333\" r=\"3.6\" />\n    <circle cx=\"892.7433333333333\" cy=\"154.305\" r=\"3.6\" />\n    <circle cx=\"859.69\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"859.69\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"942.535\" cy=\"96.31166666666667\" r=\"3.6\" />\n    <circle cx=\"959.1483333333332\" cy=\"57.623333333333335\" r=\"3.6\" />\n    <circle cx=\"959.1583333333332\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"950.9000000000001\" cy=\"91.47333333333334\" r=\"3.6\" />\n    <circle cx=\"967.4650000000001\" cy=\"52.75833333333333\" r=\"3.6\" />\n    <circle cx=\"826.3716666666666\" cy=\"280.01500000000004\" r=\"3.6\" />\n    <circle cx=\"917.7216666666667\" cy=\"110.795\" r=\"3.6\" />\n    <circle cx=\"909.3716666666666\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"934.235\" cy=\"91.47333333333331\" r=\"3.6\" />\n    <circle cx=\"884.5216666666666\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"726.7316666666667\" cy=\"212.31833333333336\" r=\"3.6\" />\n    <circle cx=\"735.0566666666667\" cy=\"217.17999999999998\" r=\"3.6\" />\n    <circle cx=\"718.48\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"751.6650000000001\" cy=\"255.84166666666667\" r=\"3.6\" />\n    <circle cx=\"743.335\" cy=\"231.6766666666667\" r=\"3.6\" />\n    <circle cx=\"693.5933333333332\" cy=\"212.31666666666663\" r=\"3.6\" />\n    <circle cx=\"710.2014285714286\" cy=\"193.25428571428571\" r=\"3.6\" />\n    <circle cx=\"701.8199999999999\" cy=\"197.55285714285714\" r=\"3.6\" />\n    <circle cx=\"784.8850000000001\" cy=\"207.4933333333333\" r=\"3.6\" />\n    <circle cx=\"809.775\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"809.785\" cy=\"212.3216666666667\" r=\"3.6\" />\n    <circle cx=\"801.5\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"768.315\" cy=\"226.83166666666668\" r=\"3.6\" />\n    <circle cx=\"809.8166666666666\" cy=\"231.665\" r=\"3.6\" />\n    <circle cx=\"776.63\" cy=\"221.98666666666665\" r=\"3.6\" />\n    <circle cx=\"818.085\" cy=\"275.14666666666665\" r=\"3.6\" />\n    <circle cx=\"776.6083333333332\" cy=\"212.3283333333333\" r=\"3.6\" />\n    <circle cx=\"760.0233333333332\" cy=\"260.6616666666667\" r=\"3.6\" />\n    <circle cx=\"901.07\" cy=\"130.14833333333334\" r=\"3.6\" />\n    <circle cx=\"892.7733333333334\" cy=\"144.655\" r=\"3.6\" />\n    <circle cx=\"901.0616666666666\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"876.2366666666667\" cy=\"173.62666666666667\" r=\"3.6\" />\n    <circle cx=\"859.6300000000001\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"909.3666666666667\" cy=\"115.63333333333334\" r=\"3.6\" />\n    <circle cx=\"867.9266666666666\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"876.2433333333333\" cy=\"192.99166666666667\" r=\"3.6\" />\n    <circle cx=\"876.2083333333334\" cy=\"183.30999999999997\" r=\"3.6\" />\n    <circle cx=\"942.5766666666665\" cy=\"86.61833333333334\" r=\"3.6\" />\n    <circle cx=\"934.245\" cy=\"81.79833333333333\" r=\"3.6\" />\n    <circle cx=\"859.6349999999999\" cy=\"212.32666666666668\" r=\"3.6\" />\n    <circle cx=\"950.8233333333333\" cy=\"72.155\" r=\"3.6\" />\n    <circle cx=\"950.8449999999999\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"934.2199999999999\" cy=\"72.14999999999999\" r=\"3.6\" />\n    <circle cx=\"909.3716666666666\" cy=\"105.95166666666667\" r=\"3.6\" />\n    <circle cx=\"917.62\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"925.9066666666666\" cy=\"67.30499999999999\" r=\"3.6\" />\n    <circle cx=\"768.275\" cy=\"207.48333333333332\" r=\"3.6\" />\n    <circle cx=\"793.15\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"801.495\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"818.09\" cy=\"207.48333333333332\" r=\"3.6\" />\n    <circle cx=\"793.16\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"809.79\" cy=\"202.6483333333333\" r=\"3.6\" />\n    <circle cx=\"784.88\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"768.275\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"942.535\" cy=\"47.945\" r=\"3.6\" />\n    <circle cx=\"776.5933333333332\" cy=\"202.6483333333333\" r=\"3.6\" />\n    <circle cx=\"834.6833333333333\" cy=\"284.8516666666667\" r=\"3.6\" />\n    <circle cx=\"843.005\" cy=\"299.3433333333333\" r=\"3.6\" />\n    <circle cx=\"851.36\" cy=\"255.86499999999998\" r=\"3.6\" />\n    <circle cx=\"851.3800000000001\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"851.375\" cy=\"236.49333333333334\" r=\"3.6\" />\n    <circle cx=\"859.6350000000001\" cy=\"221.98666666666668\" r=\"3.6\" />\n    <circle cx=\"834.6983333333333\" cy=\"275.1666666666667\" r=\"3.6\" />\n    <circle cx=\"818.1100000000001\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"843.0450000000001\" cy=\"289.68333333333334\" r=\"3.6\" />\n    <circle cx=\"693.415\" cy=\"38.26833333333333\" r=\"3.6\" />\n    <circle cx=\"627.1083333333333\" cy=\"57.598333333333336\" r=\"3.6\" />\n    <circle cx=\"602.215\" cy=\"52.77333333333334\" r=\"3.6\" />\n    <circle cx=\"618.8199999999999\" cy=\"52.77\" r=\"3.6\" />\n    <circle cx=\"593.9499999999999\" cy=\"47.913333333333334\" r=\"3.6\" />\n    <circle cx=\"925.9366666666666\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"676.8383333333334\" cy=\"47.91\" r=\"3.6\" />\n    <circle cx=\"643.7233333333334\" cy=\"57.59833333333333\" r=\"3.6\" />\n    <circle cx=\"585.6516666666666\" cy=\"43.076666666666675\" r=\"3.6\" />\n    <circle cx=\"685.1566666666668\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"651.9616666666667\" cy=\"52.76166666666666\" r=\"3.6\" />\n    <circle cx=\"520.1483333333333\" cy=\"110.78333333333335\" r=\"3.6\" />\n    <circle cx=\"536.72\" cy=\"62.440000000000005\" r=\"3.6\" />\n    <circle cx=\"528.4166666666666\" cy=\"67.28333333333333\" r=\"3.6\" />\n    <circle cx=\"511.83\" cy=\"115.63833333333332\" r=\"3.6\" />\n    <circle cx=\"544.8787500000001\" cy=\"57.60125\" r=\"3.6\" />\n    <circle cx=\"560.6833333333333\" cy=\"47.93833333333333\" r=\"3.6\" />\n    <circle cx=\"568.9999999999999\" cy=\"43.089999999999996\" r=\"3.6\" />\n    <circle cx=\"552.3766666666667\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"668.5533333333334\" cy=\"52.76333333333333\" r=\"3.6\" />\n    <circle cx=\"867.8350000000002\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"851.2400000000001\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"503.5233333333333\" cy=\"120.47500000000001\" r=\"3.6\" />\n    <circle cx=\"817.995\" cy=\"43.10999999999999\" r=\"3.6\" />\n    <circle cx=\"892.6899999999999\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"884.4399999999999\" cy=\"43.116666666666674\" r=\"3.6\" />\n    <circle cx=\"909.3216666666667\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"809.7049999999999\" cy=\"38.26833333333334\" r=\"3.6\" />\n    <circle cx=\"834.6150000000001\" cy=\"43.12500000000001\" r=\"3.6\" />\n    <circle cx=\"726.6483333333332\" cy=\"28.59\" r=\"3.6\" />\n    <circle cx=\"743.2333333333332\" cy=\"28.623333333333335\" r=\"3.6\" />\n    <circle cx=\"718.3849999999999\" cy=\"33.443333333333335\" r=\"3.6\" />\n    <circle cx=\"793.055\" cy=\"38.29333333333334\" r=\"3.6\" />\n    <circle cx=\"701.71\" cy=\"33.15428571428571\" r=\"3.6\" />\n    <circle cx=\"759.8716666666666\" cy=\"28.60166666666667\" r=\"3.6\" />\n    <circle cx=\"776.4883333333333\" cy=\"38.27833333333333\" r=\"3.6\" />\n    <circle cx=\"768.2033333333333\" cy=\"33.425000000000004\" r=\"3.6\" />\n    <circle cx=\"801.48\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"577.4616666666667\" cy=\"367.00666666666666\" r=\"3.6\" />\n    <circle cx=\"569.1166666666667\" cy=\"304.1766666666667\" r=\"3.6\" />\n    <circle cx=\"569.1066666666667\" cy=\"284.83166666666665\" r=\"3.6\" />\n    <circle cx=\"569.1066666666667\" cy=\"294.50166666666667\" r=\"3.6\" />\n    <circle cx=\"560.7666666666668\" cy=\"279.99666666666667\" r=\"3.6\" />\n    <circle cx=\"528.57\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"759.9683333333332\" cy=\"192.98000000000002\" r=\"3.6\" />\n    <circle cx=\"545.035\" cy=\"250.9925\" r=\"3.6\" />\n    <circle cx=\"536.865\" cy=\"246.15666666666667\" r=\"3.6\" />\n    <circle cx=\"552.5133333333334\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"569.1650000000001\" cy=\"352.51000000000005\" r=\"3.6\" />\n    <circle cx=\"569.1550000000001\" cy=\"342.84666666666664\" r=\"3.6\" />\n    <circle cx=\"569.14\" cy=\"313.83\" r=\"3.6\" />\n    <circle cx=\"577.4616666666667\" cy=\"357.33666666666664\" r=\"3.6\" />\n    <circle cx=\"560.81\" cy=\"338.0133333333333\" r=\"3.6\" />\n    <circle cx=\"569.1500000000001\" cy=\"323.50333333333333\" r=\"3.6\" />\n    <circle cx=\"560.81\" cy=\"328.3433333333333\" r=\"3.6\" />\n    <circle cx=\"552.495\" cy=\"333.1766666666667\" r=\"3.6\" />\n    <circle cx=\"511.9350000000001\" cy=\"241.33666666666667\" r=\"3.6\" />\n    <circle cx=\"503.585\" cy=\"168.81166666666667\" r=\"3.6\" />\n    <circle cx=\"528.4699999999999\" cy=\"134.97666666666666\" r=\"3.6\" />\n    <circle cx=\"503.605\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"503.59999999999997\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"536.765\" cy=\"130.13\" r=\"3.6\" />\n    <circle cx=\"544.5914285714287\" cy=\"96.56142857142856\" r=\"3.6\" />\n    <circle cx=\"544.9412500000001\" cy=\"105.95750000000001\" r=\"3.6\" />\n    <circle cx=\"544.5828571428572\" cy=\"115.90142857142857\" r=\"3.6\" />\n    <circle cx=\"544.115\" cy=\"125.29666666666667\" r=\"3.6\" />\n    <circle cx=\"495.32666666666665\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"487.04999999999995\" cy=\"246.15666666666667\" r=\"3.6\" />\n    <circle cx=\"487.03\" cy=\"226.82000000000002\" r=\"3.6\" />\n    <circle cx=\"487.05\" cy=\"236.48666666666665\" r=\"3.6\" />\n    <circle cx=\"503.615\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"495.36666666666673\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"487.01\" cy=\"217.15333333333334\" r=\"3.6\" />\n    <circle cx=\"503.66\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"495.32666666666665\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"627.2083333333334\" cy=\"270.32\" r=\"3.6\" />\n    <circle cx=\"668.6750000000001\" cy=\"207.4483333333333\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"192.97833333333332\" r=\"3.6\" />\n    <circle cx=\"676.91\" cy=\"183.31500000000003\" r=\"3.6\" />\n    <circle cx=\"693.5099999999999\" cy=\"173.64\" r=\"3.6\" />\n    <circle cx=\"685.235\" cy=\"178.47166666666666\" r=\"3.6\" />\n    <circle cx=\"652.0916666666667\" cy=\"236.49166666666667\" r=\"3.6\" />\n    <circle cx=\"660.39\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"652.0916666666666\" cy=\"226.81499999999997\" r=\"3.6\" />\n    <circle cx=\"652.0716666666666\" cy=\"217.14666666666668\" r=\"3.6\" />\n    <circle cx=\"702.1787499999999\" cy=\"168.80625000000003\" r=\"3.6\" />\n    <circle cx=\"743.3250000000002\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"735.065\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"743.335\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"751.68\" cy=\"197.82000000000002\" r=\"3.6\" />\n    <circle cx=\"718.4699999999999\" cy=\"168.80666666666667\" r=\"3.6\" />\n    <circle cx=\"726.7716666666666\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"709.8325\" cy=\"163.97250000000003\" r=\"3.6\" />\n    <circle cx=\"643.8783333333332\" cy=\"260.635\" r=\"3.6\" />\n    <circle cx=\"585.76\" cy=\"371.83666666666664\" r=\"3.6\" />\n    <circle cx=\"602.35\" cy=\"352.51500000000004\" r=\"3.6\" />\n    <circle cx=\"602.34\" cy=\"342.84\" r=\"3.6\" />\n    <circle cx=\"594.0616666666667\" cy=\"357.33666666666664\" r=\"3.6\" />\n    <circle cx=\"618.93\" cy=\"333.17333333333335\" r=\"3.6\" />\n    <circle cx=\"610.595\" cy=\"338.0133333333333\" r=\"3.6\" />\n    <circle cx=\"585.78\" cy=\"381.50500000000005\" r=\"3.6\" />\n    <circle cx=\"594.0616666666667\" cy=\"367.00666666666666\" r=\"3.6\" />\n    <circle cx=\"594.0616666666666\" cy=\"376.6766666666667\" r=\"3.6\" />\n    <circle cx=\"618.89\" cy=\"284.83166666666665\" r=\"3.6\" />\n    <circle cx=\"618.93\" cy=\"323.50333333333333\" r=\"3.6\" />\n    <circle cx=\"618.9050000000001\" cy=\"275.17\" r=\"3.6\" />\n    <circle cx=\"618.89\" cy=\"294.50166666666667\" r=\"3.6\" />\n    <circle cx=\"536.785\" cy=\"91.43666666666667\" r=\"3.6\" />\n    <circle cx=\"635.515\" cy=\"265.4733333333333\" r=\"3.6\" />\n    <circle cx=\"627.245\" cy=\"318.65833333333336\" r=\"3.6\" />\n    <circle cx=\"618.9\" cy=\"304.1766666666667\" r=\"3.6\" />\n    <circle cx=\"626.8042857142857\" cy=\"308.6142857142857\" r=\"3.6\" />\n    <circle cx=\"520.265\" cy=\"236.49666666666664\" r=\"3.6\" />\n    <circle cx=\"834.695\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"851.3100000000001\" cy=\"159.14666666666668\" r=\"3.6\" />\n    <circle cx=\"842.98\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"851.32\" cy=\"168.8216666666667\" r=\"3.6\" />\n    <circle cx=\"793.14\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"643.8133333333334\" cy=\"212.3033333333333\" r=\"3.6\" />\n    <circle cx=\"826.4\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"876.1383333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"818.07\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"851.32\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"884.4716666666668\" cy=\"101.13666666666667\" r=\"3.6\" />\n    <circle cx=\"876.1783333333333\" cy=\"105.95833333333333\" r=\"3.6\" />\n    <circle cx=\"552.4399999999999\" cy=\"81.78666666666668\" r=\"3.6\" />\n    <circle cx=\"876.1750000000001\" cy=\"115.62833333333333\" r=\"3.6\" />\n    <circle cx=\"867.8649999999999\" cy=\"130.13000000000002\" r=\"3.6\" />\n    <circle cx=\"867.8649999999999\" cy=\"139.79666666666665\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"154.295\" r=\"3.6\" />\n    <circle cx=\"876.1683333333334\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"809.7700000000001\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"718.4699999999999\" cy=\"159.13666666666668\" r=\"3.6\" />\n    <circle cx=\"702.17125\" cy=\"159.13125\" r=\"3.6\" />\n    <circle cx=\"685.235\" cy=\"168.8033333333333\" r=\"3.6\" />\n    <circle cx=\"710.1757142857142\" cy=\"154.58285714285716\" r=\"3.6\" />\n    <circle cx=\"693.5099999999999\" cy=\"163.97333333333333\" r=\"3.6\" />\n    <circle cx=\"660.4\" cy=\"202.63166666666666\" r=\"3.6\" />\n    <circle cx=\"676.94\" cy=\"173.62666666666667\" r=\"3.6\" />\n    <circle cx=\"652.0716666666667\" cy=\"207.48\" r=\"3.6\" />\n    <circle cx=\"668.625\" cy=\"178.45666666666668\" r=\"3.6\" />\n    <circle cx=\"751.665\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"759.9583333333334\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"768.255\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"726.7716666666666\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"751.6700000000001\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"776.5699999999998\" cy=\"173.64333333333332\" r=\"3.6\" />\n    <circle cx=\"735.065\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"784.8633333333333\" cy=\"168.82166666666666\" r=\"3.6\" />\n    <circle cx=\"743.3250000000002\" cy=\"173.65666666666667\" r=\"3.6\" />\n    <circle cx=\"884.4516666666667\" cy=\"72.13166666666667\" r=\"3.6\" />\n    <circle cx=\"867.855\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"676.89\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"660.3166666666667\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"652.0200000000001\" cy=\"81.78\" r=\"3.6\" />\n    <circle cx=\"685.1716666666666\" cy=\"72.10833333333333\" r=\"3.6\" />\n    <circle cx=\"643.7633333333333\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"709.75875\" cy=\"57.613749999999996\" r=\"3.6\" />\n    <circle cx=\"702.1075000000001\" cy=\"62.447500000000005\" r=\"3.6\" />\n    <circle cx=\"693.4366666666666\" cy=\"67.28333333333333\" r=\"3.6\" />\n    <circle cx=\"668.595\" cy=\"81.77\" r=\"3.6\" />\n    <circle cx=\"602.245\" cy=\"81.78833333333334\" r=\"3.6\" />\n    <circle cx=\"593.9416666666667\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"585.64\" cy=\"72.10333333333332\" r=\"3.6\" />\n    <circle cx=\"577.3066666666667\" cy=\"67.26666666666667\" r=\"3.6\" />\n    <circle cx=\"618.8449999999999\" cy=\"81.77666666666666\" r=\"3.6\" />\n    <circle cx=\"627.1483333333333\" cy=\"86.60666666666667\" r=\"3.6\" />\n    <circle cx=\"610.495\" cy=\"76.95500000000001\" r=\"3.6\" />\n    <circle cx=\"635.4449999999999\" cy=\"81.77\" r=\"3.6\" />\n    <circle cx=\"718.3949999999999\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"818.015\" cy=\"72.115\" r=\"3.6\" />\n    <circle cx=\"826.3250000000002\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"809.6999999999999\" cy=\"67.28666666666666\" r=\"3.6\" />\n    <circle cx=\"834.63\" cy=\"72.125\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"67.28666666666666\" r=\"3.6\" />\n    <circle cx=\"801.4050000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"842.9049999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"851.2550000000001\" cy=\"72.13666666666667\" r=\"3.6\" />\n    <circle cx=\"743.255\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"751.5900000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"726.6983333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"793.0649999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"759.8833333333332\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"734.9916666666667\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"784.7916666666666\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"776.4983333333333\" cy=\"67.28666666666668\" r=\"3.6\" />\n    <circle cx=\"768.1833333333334\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"536.765\" cy=\"120.46333333333332\" r=\"3.6\" />\n    <circle cx=\"560.7666666666668\" cy=\"299.33666666666664\" r=\"3.6\" />\n    <circle cx=\"560.7883333333333\" cy=\"309.00500000000005\" r=\"3.6\" />\n    <circle cx=\"560.81\" cy=\"318.67333333333335\" r=\"3.6\" />\n    <circle cx=\"552.495\" cy=\"323.50666666666666\" r=\"3.6\" />\n    <circle cx=\"536.865\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"552.465\" cy=\"275.15833333333336\" r=\"3.6\" />\n    <circle cx=\"560.7666666666668\" cy=\"289.6666666666667\" r=\"3.6\" />\n    <circle cx=\"545.035\" cy=\"260.6625\" r=\"3.6\" />\n    <circle cx=\"552.455\" cy=\"284.8333333333333\" r=\"3.6\" />\n    <circle cx=\"552.5\" cy=\"342.8433333333333\" r=\"3.6\" />\n    <circle cx=\"577.4816666666667\" cy=\"386.34666666666664\" r=\"3.6\" />\n    <circle cx=\"560.82\" cy=\"347.68\" r=\"3.6\" />\n    <circle cx=\"577.5016666666667\" cy=\"396.0133333333333\" r=\"3.6\" />\n    <circle cx=\"511.855\" cy=\"134.99666666666667\" r=\"3.6\" />\n    <circle cx=\"577.4616666666667\" cy=\"376.6766666666667\" r=\"3.6\" />\n    <circle cx=\"569.17\" cy=\"371.8516666666667\" r=\"3.6\" />\n    <circle cx=\"560.83\" cy=\"357.34666666666664\" r=\"3.6\" />\n    <circle cx=\"569.1700000000001\" cy=\"362.1816666666667\" r=\"3.6\" />\n    <circle cx=\"470.45\" cy=\"236.49666666666667\" r=\"3.6\" />\n    <circle cx=\"487.01\" cy=\"207.48333333333335\" r=\"3.6\" />\n    <circle cx=\"768.265\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"487.01\" cy=\"197.8133333333333\" r=\"3.6\" />\n    <circle cx=\"478.71\" cy=\"212.31833333333336\" r=\"3.6\" />\n    <circle cx=\"478.71000000000004\" cy=\"221.98833333333334\" r=\"3.6\" />\n    <circle cx=\"503.57666666666665\" cy=\"149.48166666666665\" r=\"3.6\" />\n    <circle cx=\"495.3066666666667\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"511.895\" cy=\"144.65\" r=\"3.6\" />\n    <circle cx=\"495.3066666666667\" cy=\"173.64333333333335\" r=\"3.6\" />\n    <circle cx=\"495.36666666666673\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"503.66\" cy=\"255.84166666666667\" r=\"3.6\" />\n    <circle cx=\"528.57\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"585.8\" cy=\"391.17333333333335\" r=\"3.6\" />\n    <circle cx=\"520.275\" cy=\"246.17166666666665\" r=\"3.6\" />\n    <circle cx=\"511.9350000000001\" cy=\"251.00666666666663\" r=\"3.6\" />\n    <circle cx=\"478.75333333333333\" cy=\"241.32666666666668\" r=\"3.6\" />\n    <circle cx=\"478.7533333333334\" cy=\"250.99666666666667\" r=\"3.6\" />\n    <circle cx=\"487.05\" cy=\"255.82666666666668\" r=\"3.6\" />\n    <circle cx=\"585.8000000000001\" cy=\"400.8433333333333\" r=\"3.6\" />\n    <circle cx=\"709.8325\" cy=\"173.64\" r=\"3.6\" />\n    <circle cx=\"718.4699999999999\" cy=\"178.47333333333333\" r=\"3.6\" />\n    <circle cx=\"726.7716666666666\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"702.1787499999999\" cy=\"178.47375\" r=\"3.6\" />\n    <circle cx=\"594.0816666666667\" cy=\"386.34499999999997\" r=\"3.6\" />\n    <circle cx=\"660.3899999999999\" cy=\"221.97\" r=\"3.6\" />\n    <circle cx=\"693.5099999999999\" cy=\"183.3066666666667\" r=\"3.6\" />\n    <circle cx=\"676.9633333333334\" cy=\"212.30333333333337\" r=\"3.6\" />\n    <circle cx=\"685.2399999999999\" cy=\"188.13833333333332\" r=\"3.6\" />\n    <circle cx=\"668.645\" cy=\"217.13333333333333\" r=\"3.6\" />\n    <circle cx=\"759.9783333333334\" cy=\"202.64833333333334\" r=\"3.6\" />\n    <circle cx=\"768.275\" cy=\"197.81333333333336\" r=\"3.6\" />\n    <circle cx=\"776.5816666666666\" cy=\"192.97833333333335\" r=\"3.6\" />\n    <circle cx=\"759.9783333333334\" cy=\"212.3183333333333\" r=\"3.6\" />\n    <circle cx=\"751.685\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"743.3449999999999\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"735.0799999999999\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"751.685\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"735.07\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"660.41\" cy=\"231.63833333333335\" r=\"3.6\" />\n    <circle cx=\"610.615\" cy=\"357.34666666666664\" r=\"3.6\" />\n    <circle cx=\"618.935\" cy=\"342.84666666666664\" r=\"3.6\" />\n    <circle cx=\"627.2283333333334\" cy=\"337.99833333333333\" r=\"3.6\" />\n    <circle cx=\"610.605\" cy=\"347.68\" r=\"3.6\" />\n    <circle cx=\"602.3649999999999\" cy=\"381.51500000000004\" r=\"3.6\" />\n    <circle cx=\"602.355\" cy=\"371.8516666666667\" r=\"3.6\" />\n    <circle cx=\"602.355\" cy=\"362.1816666666667\" r=\"3.6\" />\n    <circle cx=\"627.2366666666666\" cy=\"328.32166666666666\" r=\"3.6\" />\n    <circle cx=\"643.8266666666666\" cy=\"270.31666666666666\" r=\"3.6\" />\n    <circle cx=\"652.0833333333334\" cy=\"265.49\" r=\"3.6\" />\n    <circle cx=\"635.4833333333333\" cy=\"275.1466666666667\" r=\"3.6\" />\n    <circle cx=\"660.4150000000001\" cy=\"241.32833333333335\" r=\"3.6\" />\n    <circle cx=\"627.1850000000001\" cy=\"289.6566666666667\" r=\"3.6\" />\n    <circle cx=\"627.1850000000001\" cy=\"299.3233333333333\" r=\"3.6\" />\n    <circle cx=\"635.555\" cy=\"304.14833333333337\" r=\"3.6\" />\n    <circle cx=\"627.1850000000001\" cy=\"279.9866666666666\" r=\"3.6\" />\n    <circle cx=\"495.3166666666666\" cy=\"192.97833333333332\" r=\"3.6\" />\n    <circle cx=\"892.7550000000001\" cy=\"96.28166666666665\" r=\"3.6\" />\n    <circle cx=\"892.7333333333335\" cy=\"105.97333333333331\" r=\"3.6\" />\n    <circle cx=\"901.0099999999999\" cy=\"72.155\" r=\"3.6\" />\n    <circle cx=\"884.4683333333332\" cy=\"110.80499999999999\" r=\"3.6\" />\n    <circle cx=\"876.1616666666667\" cy=\"144.66833333333332\" r=\"3.6\" />\n    <circle cx=\"884.4633333333333\" cy=\"120.47166666666668\" r=\"3.6\" />\n    <circle cx=\"901.0300000000001\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"876.1683333333334\" cy=\"134.96666666666667\" r=\"3.6\" />\n    <circle cx=\"884.4616666666666\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"892.6899999999999\" cy=\"67.29666666666667\" r=\"3.6\" />\n    <circle cx=\"851.245\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"867.9366666666668\" cy=\"159.11833333333334\" r=\"3.6\" />\n    <circle cx=\"859.5400000000001\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"834.62\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"842.9049999999999\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"520.17\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"876.1383333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"867.8350000000002\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"809.7700000000001\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"818.08\" cy=\"188.14499999999998\" r=\"3.6\" />\n    <circle cx=\"826.3250000000002\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"163.97666666666666\" r=\"3.6\" />\n    <circle cx=\"834.7066666666666\" cy=\"197.82666666666668\" r=\"3.6\" />\n    <circle cx=\"784.8633333333333\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"801.48\" cy=\"178.49\" r=\"3.6\" />\n    <circle cx=\"776.5699999999998\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"834.7116666666666\" cy=\"207.49333333333334\" r=\"3.6\" />\n    <circle cx=\"793.14\" cy=\"183.32666666666668\" r=\"3.6\" />\n    <circle cx=\"826.41\" cy=\"192.97833333333335\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"183.31000000000003\" r=\"3.6\" />\n    <circle cx=\"851.3249999999999\" cy=\"188.16\" r=\"3.6\" />\n    <circle cx=\"834.7116666666666\" cy=\"217.16333333333333\" r=\"3.6\" />\n    <circle cx=\"859.61\" cy=\"173.64333333333335\" r=\"3.6\" />\n    <circle cx=\"842.9899999999999\" cy=\"192.995\" r=\"3.6\" />\n    <circle cx=\"843.06\" cy=\"222.0033333333333\" r=\"3.6\" />\n    <circle cx=\"843\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"843.0300000000001\" cy=\"212.35166666666666\" r=\"3.6\" />\n    <circle cx=\"884.43\" cy=\"62.461666666666666\" r=\"3.6\" />\n    <circle cx=\"618.8249999999999\" cy=\"72.12\" r=\"3.6\" />\n    <circle cx=\"627.1283333333333\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"610.475\" cy=\"67.28333333333333\" r=\"3.6\" />\n    <circle cx=\"593.9216666666666\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"602.225\" cy=\"72.10666666666667\" r=\"3.6\" />\n    <circle cx=\"635.425\" cy=\"72.10333333333332\" r=\"3.6\" />\n    <circle cx=\"651.9983333333333\" cy=\"72.11\" r=\"3.6\" />\n    <circle cx=\"660.295\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"643.7433333333333\" cy=\"76.93833333333333\" r=\"3.6\" />\n    <circle cx=\"536.7683333333333\" cy=\"110.79333333333331\" r=\"3.6\" />\n    <circle cx=\"668.575\" cy=\"72.10499999999999\" r=\"3.6\" />\n    <circle cx=\"784.8683333333333\" cy=\"188.155\" r=\"3.6\" />\n    <circle cx=\"536.765\" cy=\"101.11833333333334\" r=\"3.6\" />\n    <circle cx=\"585.62\" cy=\"62.43333333333334\" r=\"3.6\" />\n    <circle cx=\"528.465\" cy=\"125.29833333333333\" r=\"3.6\" />\n    <circle cx=\"577.3166666666666\" cy=\"57.60166666666667\" r=\"3.6\" />\n    <circle cx=\"817.995\" cy=\"62.446666666666665\" r=\"3.6\" />\n    <circle cx=\"544.5485714285713\" cy=\"77.24285714285715\" r=\"3.6\" />\n    <circle cx=\"552.4083333333334\" cy=\"72.11\" r=\"3.6\" />\n    <circle cx=\"676.8683333333332\" cy=\"67.26833333333333\" r=\"3.6\" />\n    <circle cx=\"768.1833333333334\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"751.585\" cy=\"43.120000000000005\" r=\"3.6\" />\n    <circle cx=\"759.8833333333332\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"784.7916666666666\" cy=\"52.79333333333333\" r=\"3.6\" />\n    <circle cx=\"793.0649999999999\" cy=\"57.63\" r=\"3.6\" />\n    <circle cx=\"809.6999999999999\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"801.4050000000001\" cy=\"52.79333333333332\" r=\"3.6\" />\n    <circle cx=\"776.4983333333333\" cy=\"57.616666666666674\" r=\"3.6\" />\n    <circle cx=\"743.255\" cy=\"47.96333333333334\" r=\"3.6\" />\n    <circle cx=\"702.1075000000001\" cy=\"52.7775\" r=\"3.6\" />\n    <circle cx=\"685.1616666666667\" cy=\"62.443333333333335\" r=\"3.6\" />\n    <circle cx=\"709.75875\" cy=\"47.94375\" r=\"3.6\" />\n    <circle cx=\"693.4366666666666\" cy=\"57.613333333333344\" r=\"3.6\" />\n    <circle cx=\"718.3949999999999\" cy=\"52.77666666666667\" r=\"3.6\" />\n    <circle cx=\"734.9866666666667\" cy=\"43.12500000000001\" r=\"3.6\" />\n    <circle cx=\"726.6983333333333\" cy=\"47.946666666666665\" r=\"3.6\" />\n    <circle cx=\"876.1850000000001\" cy=\"289.65\" r=\"3.6\" />\n    <circle cx=\"876.1550000000001\" cy=\"279.99833333333333\" r=\"3.6\" />\n    <circle cx=\"884.5033333333334\" cy=\"275.16333333333336\" r=\"3.6\" />\n    <circle cx=\"884.4983333333333\" cy=\"304.2\" r=\"3.6\" />\n    <circle cx=\"867.9249999999998\" cy=\"304.19166666666666\" r=\"3.6\" />\n    <circle cx=\"884.5283333333333\" cy=\"284.84333333333336\" r=\"3.6\" />\n    <circle cx=\"867.895\" cy=\"294.50333333333333\" r=\"3.6\" />\n    <circle cx=\"884.5283333333333\" cy=\"294.5133333333334\" r=\"3.6\" />\n    <circle cx=\"876.215\" cy=\"299.3383333333333\" r=\"3.6\" />\n    <circle cx=\"859.6583333333333\" cy=\"318.6666666666667\" r=\"3.6\" />\n    <circle cx=\"868.0050000000001\" cy=\"323.51166666666666\" r=\"3.6\" />\n    <circle cx=\"851.3116666666666\" cy=\"323.52666666666664\" r=\"3.6\" />\n    <circle cx=\"892.8250000000002\" cy=\"212.33333333333334\" r=\"3.6\" />\n    <circle cx=\"892.8249999999999\" cy=\"202.66333333333333\" r=\"3.6\" />\n    <circle cx=\"892.805\" cy=\"231.65833333333333\" r=\"3.6\" />\n    <circle cx=\"909.4733333333334\" cy=\"251\" r=\"3.6\" />\n    <circle cx=\"901.1066666666666\" cy=\"246.16833333333332\" r=\"3.6\" />\n    <circle cx=\"901.1366666666667\" cy=\"236.51500000000001\" r=\"3.6\" />\n    <circle cx=\"892.8650000000001\" cy=\"260.6766666666667\" r=\"3.6\" />\n    <circle cx=\"901.0566666666667\" cy=\"294.52000000000004\" r=\"3.6\" />\n    <circle cx=\"901.0633333333334\" cy=\"304.18666666666667\" r=\"3.6\" />\n    <circle cx=\"909.41\" cy=\"289.66333333333336\" r=\"3.6\" />\n    <circle cx=\"892.8533333333334\" cy=\"328.3566666666666\" r=\"3.6\" />\n    <circle cx=\"925.9233333333333\" cy=\"134.97666666666666\" r=\"3.6\" />\n    <circle cx=\"934.2800000000001\" cy=\"130.14333333333335\" r=\"3.6\" />\n    <circle cx=\"925.9283333333333\" cy=\"125.28666666666665\" r=\"3.6\" />\n    <circle cx=\"917.7133333333335\" cy=\"168.81666666666666\" r=\"3.6\" />\n    <circle cx=\"909.39\" cy=\"173.645\" r=\"3.6\" />\n    <circle cx=\"925.9933333333335\" cy=\"163.96833333333333\" r=\"3.6\" />\n    <circle cx=\"934.2449999999999\" cy=\"149.48333333333332\" r=\"3.6\" />\n    <circle cx=\"934.305\" cy=\"159.14166666666668\" r=\"3.6\" />\n    <circle cx=\"917.7950000000001\" cy=\"265.49333333333334\" r=\"3.6\" />\n    <circle cx=\"917.7366666666667\" cy=\"304.17333333333335\" r=\"3.6\" />\n    <circle cx=\"909.4350000000001\" cy=\"328.34999999999997\" r=\"3.6\" />\n    <circle cx=\"917.79\" cy=\"323.5\" r=\"3.6\" />\n    <circle cx=\"934.2900000000001\" cy=\"294.51666666666665\" r=\"3.6\" />\n    <circle cx=\"942.685\" cy=\"454.07166666666666\" r=\"3.6\" />\n    <circle cx=\"950.9983333333333\" cy=\"449.2033333333333\" r=\"3.6\" />\n    <circle cx=\"967.5749999999999\" cy=\"323.52833333333336\" r=\"3.6\" />\n    <circle cx=\"959.2516666666667\" cy=\"309\" r=\"3.6\" />\n    <circle cx=\"992.5649999999999\" cy=\"328.34999999999997\" r=\"3.6\" />\n    <circle cx=\"976.3714285714285\" cy=\"318.94714285714286\" r=\"3.6\" />\n    <circle cx=\"983.7371428571429\" cy=\"323.2271428571429\" r=\"3.6\" />\n    <circle cx=\"967.585\" cy=\"313.82166666666666\" r=\"3.6\" />\n    <circle cx=\"959.2433333333333\" cy=\"318.67333333333335\" r=\"3.6\" />\n    <circle cx=\"1000.805\" cy=\"313.84\" r=\"3.6\" />\n    <circle cx=\"951.025\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"934.41\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"917.8000000000001\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"942.685\" cy=\"415.38000000000005\" r=\"3.6\" />\n    <circle cx=\"942.6850000000001\" cy=\"405.71333333333337\" r=\"3.6\" />\n    <circle cx=\"909.4816666666666\" cy=\"386.3583333333333\" r=\"3.6\" />\n    <circle cx=\"926.1166666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"892.85\" cy=\"386.375\" r=\"3.6\" />\n    <circle cx=\"909.46\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"884.6\" cy=\"391.2083333333333\" r=\"3.6\" />\n    <circle cx=\"892.8699999999999\" cy=\"396.04333333333335\" r=\"3.6\" />\n    <circle cx=\"884.61\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"901.1999999999999\" cy=\"391.19666666666666\" r=\"3.6\" />\n    <circle cx=\"901.1783333333333\" cy=\"381.53999999999996\" r=\"3.6\" />\n    <circle cx=\"959.2783333333333\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"967.5749999999999\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"950.985\" cy=\"371.8633333333334\" r=\"3.6\" />\n    <circle cx=\"942.6750000000001\" cy=\"357.34833333333336\" r=\"3.6\" />\n    <circle cx=\"975.9249999999998\" cy=\"367.01666666666665\" r=\"3.6\" />\n    <circle cx=\"942.69\" cy=\"347.6933333333333\" r=\"3.6\" />\n    <circle cx=\"967.6150000000001\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"976.3914285714287\" cy=\"376.96000000000004\" r=\"3.6\" />\n    <circle cx=\"959.3183333333333\" cy=\"415.3666666666666\" r=\"3.6\" />\n    <circle cx=\"959.3183333333335\" cy=\"405.69666666666666\" r=\"3.6\" />\n    <circle cx=\"967.6149999999999\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"976.4171428571428\" cy=\"386.62857142857143\" r=\"3.6\" />\n    <circle cx=\"884.5916666666666\" cy=\"420.23499999999996\" r=\"3.6\" />\n    <circle cx=\"959.3000000000001\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"867.9949999999999\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"967.5949999999999\" cy=\"381.52500000000003\" r=\"3.6\" />\n    <circle cx=\"951.015\" cy=\"391.19666666666666\" r=\"3.6\" />\n    <circle cx=\"942.665\" cy=\"386.375\" r=\"3.6\" />\n    <circle cx=\"876.3183333333333\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"967.5949999999999\" cy=\"342.84666666666664\" r=\"3.6\" />\n    <circle cx=\"917.7600000000001\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"934.3650000000001\" cy=\"352.5333333333333\" r=\"3.6\" />\n    <circle cx=\"934.38\" cy=\"381.52833333333325\" r=\"3.6\" />\n    <circle cx=\"959.3133333333334\" cy=\"434.715\" r=\"3.6\" />\n    <circle cx=\"868.025\" cy=\"420.21333333333337\" r=\"3.6\" />\n    <circle cx=\"942.6750000000001\" cy=\"338.02000000000004\" r=\"3.6\" />\n    <circle cx=\"942.695\" cy=\"434.7383333333334\" r=\"3.6\" />\n    <circle cx=\"934.3699999999999\" cy=\"371.8633333333334\" r=\"3.6\" />\n    <circle cx=\"942.6449999999999\" cy=\"376.7033333333333\" r=\"3.6\" />\n    <circle cx=\"950.995\" cy=\"381.53999999999996\" r=\"3.6\" />\n    <circle cx=\"926.0766666666667\" cy=\"367.0183333333334\" r=\"3.6\" />\n    <circle cx=\"959.3183333333333\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"934.3699999999999\" cy=\"362.19666666666666\" r=\"3.6\" />\n    <circle cx=\"917.7800000000001\" cy=\"381.52500000000003\" r=\"3.6\" />\n    <circle cx=\"951.025\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"926.0766666666667\" cy=\"376.68833333333333\" r=\"3.6\" />\n    <circle cx=\"926.0966666666667\" cy=\"386.3583333333333\" r=\"3.6\" />\n    <circle cx=\"934.4\" cy=\"391.2083333333333\" r=\"3.6\" />\n    <circle cx=\"942.6850000000001\" cy=\"396.04333333333335\" r=\"3.6\" />\n    <circle cx=\"942.6449999999999\" cy=\"367.0333333333333\" r=\"3.6\" />\n    <circle cx=\"917.75\" cy=\"352.5083333333334\" r=\"3.6\" />\n    <circle cx=\"901.1383333333333\" cy=\"362.17833333333334\" r=\"3.6\" />\n    <circle cx=\"975.9249999999998\" cy=\"357.34666666666664\" r=\"3.6\" />\n    <circle cx=\"892.82\" cy=\"367.02833333333336\" r=\"3.6\" />\n    <circle cx=\"867.9649999999998\" cy=\"381.53000000000003\" r=\"3.6\" />\n    <circle cx=\"876.2466666666666\" cy=\"376.67\" r=\"3.6\" />\n    <circle cx=\"884.5466666666667\" cy=\"371.8500000000001\" r=\"3.6\" />\n    <circle cx=\"926.0416666666666\" cy=\"347.66833333333335\" r=\"3.6\" />\n    <circle cx=\"967.585\" cy=\"352.49666666666667\" r=\"3.6\" />\n    <circle cx=\"959.2783333333333\" cy=\"367.01833333333326\" r=\"3.6\" />\n    <circle cx=\"967.5650000000002\" cy=\"362.17833333333334\" r=\"3.6\" />\n    <circle cx=\"950.9899999999999\" cy=\"362.195\" r=\"3.6\" />\n    <circle cx=\"934.3400000000001\" cy=\"342.84833333333336\" r=\"3.6\" />\n    <circle cx=\"909.4499999999999\" cy=\"357.3433333333334\" r=\"3.6\" />\n    <circle cx=\"976.4357142857143\" cy=\"415.09\" r=\"3.6\" />\n    <circle cx=\"967.6650000000001\" cy=\"429.8666666666666\" r=\"3.6\" />\n    <circle cx=\"951.0183333333333\" cy=\"429.8833333333334\" r=\"3.6\" />\n    <circle cx=\"983.4525\" cy=\"400.86\" r=\"3.6\" />\n    <circle cx=\"934.3666666666667\" cy=\"429.88166666666666\" r=\"3.6\" />\n    <circle cx=\"983.4525000000001\" cy=\"410.52750000000003\" r=\"3.6\" />\n    <circle cx=\"926.0866666666666\" cy=\"415.38499999999993\" r=\"3.6\" />\n    <circle cx=\"892.9016666666666\" cy=\"415.3983333333333\" r=\"3.6\" />\n    <circle cx=\"901.2199999999999\" cy=\"410.5483333333334\" r=\"3.6\" />\n    <circle cx=\"876.3183333333333\" cy=\"415.3666666666666\" r=\"3.6\" />\n    <circle cx=\"909.5016666666667\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"917.79\" cy=\"410.5316666666667\" r=\"3.6\" />\n    <circle cx=\"967.6416666666668\" cy=\"420.215\" r=\"3.6\" />\n    <circle cx=\"876.3183333333333\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"909.5016666666667\" cy=\"396.02833333333336\" r=\"3.6\" />\n    <circle cx=\"884.61\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"867.995\" cy=\"410.5266666666667\" r=\"3.6\" />\n    <circle cx=\"892.8699999999999\" cy=\"405.71333333333337\" r=\"3.6\" />\n    <circle cx=\"901.21\" cy=\"400.8733333333333\" r=\"3.6\" />\n    <circle cx=\"867.9949999999999\" cy=\"391.1933333333333\" r=\"3.6\" />\n    <circle cx=\"909.46\" cy=\"367.01833333333326\" r=\"3.6\" />\n    <circle cx=\"876.2983333333333\" cy=\"386.35833333333335\" r=\"3.6\" />\n    <circle cx=\"917.7600000000001\" cy=\"362.18333333333334\" r=\"3.6\" />\n    <circle cx=\"901.1683333333334\" cy=\"371.8633333333334\" r=\"3.6\" />\n    <circle cx=\"884.58\" cy=\"381.52833333333325\" r=\"3.6\" />\n    <circle cx=\"892.83\" cy=\"376.7033333333333\" r=\"3.6\" />\n    <circle cx=\"959.3149999999999\" cy=\"425.03666666666663\" r=\"3.6\" />\n    <circle cx=\"967.6149999999999\" cy=\"410.52666666666664\" r=\"3.6\" />\n    <circle cx=\"926.0766666666667\" cy=\"357.3500000000001\" r=\"3.6\" />\n    <circle cx=\"976.785\" cy=\"405.69375\" r=\"3.6\" />\n    <circle cx=\"983.7742857142857\" cy=\"381.2442857142857\" r=\"3.6\" />\n    <circle cx=\"976.7850000000001\" cy=\"396.02625\" r=\"3.6\" />\n    <circle cx=\"983.4525000000001\" cy=\"391.19250000000005\" r=\"3.6\" />\n    <circle cx=\"917.8000000000001\" cy=\"400.85999999999996\" r=\"3.6\" />\n    <circle cx=\"934.41\" cy=\"410.54333333333335\" r=\"3.6\" />\n    <circle cx=\"926.1166666666667\" cy=\"405.6966666666667\" r=\"3.6\" />\n    <circle cx=\"934.39\" cy=\"420.22333333333336\" r=\"3.6\" />\n    <circle cx=\"951.0216666666666\" cy=\"420.21000000000004\" r=\"3.6\" />\n    <circle cx=\"942.68\" cy=\"425.0466666666667\" r=\"3.6\" />\n    <circle cx=\"1017.485\" cy=\"323.49333333333334\" r=\"3.6\" />\n    <circle cx=\"1009.2283333333334\" cy=\"463.70166666666665\" r=\"3.6\" />\n    <circle cx=\"1000.8916666666665\" cy=\"468.5466666666667\" r=\"3.6\" />\n    <circle cx=\"1017.525\" cy=\"458.8616666666667\" r=\"3.6\" />\n    <circle cx=\"1025.8149999999998\" cy=\"454.00666666666666\" r=\"3.6\" />\n    <circle cx=\"1034.0249999999999\" cy=\"371.8533333333333\" r=\"3.6\" />\n    <circle cx=\"1034.0449999999998\" cy=\"439.5416666666667\" r=\"3.6\" />\n    <circle cx=\"1042.4\" cy=\"434.6983333333333\" r=\"3.6\" />\n    <circle cx=\"1042.4\" cy=\"425.0333333333333\" r=\"3.6\" />\n    <circle cx=\"1075.54\" cy=\"357.3333333333333\" r=\"3.6\" />\n</svg>";

},{}],367:[function(require,module,exports){
module.exports = "\n/* map styling */\n\n.map-dialog-description {\n    color: #ffc107;\n    height: 100px;\n    width: 200px;\n    margin: 0;\n    background-color: rgba(38, 41, 43, 0.66);\n    border-radius: 3px;\n    display: block;\n    padding: 8px;\n    opacity: 0;\n    will-change: opacity;\n    transition: 0.3s opacity;\n    text-align: center;\n    pointer-events: none;\n    position: relative;\n    margin-left: -100px;\n    left: 50%;\n    top: 100px;\n    z-index: 100;\n}\n\n@media (max-height: 800px) {\n    .map-dialog-description {\n        top: 40px;\n    }\n}\n\n.map-dialog {\n    position: fixed;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 100%;\n    text-align: center;\n    pointer-events: none;\n}\n\n.map-dialog-description img {\n    width: 24px;\n    display: inline-block;\n}\n\n#WebDollarMap svg {\n\n    margin: auto;\n    opacity: 1;\n    transition: 1s opacity;\n\n    /* we have the map as background image such that we can display:none the hexagons\n    in the svg which greatly improves performance on firefox */\n    background-image: url(public/assets/map/map.svg);\n}\n\n\n#WebDollarMap svg.hide-circles circle {\n    fill: #26292b;\n}\n\n.peer-own {\n    display: block !important;\n    fill: white !important;\n    -webkit-animation: connected 1800ms ease 5;\n    animation: connected 1800ms ease 8;\n}\n\n.peer-connected-terminal {\n    display: block !important;\n    fill: #fec02c !important;\n    -webkit-animation: connected 1800ms ease 10;\n    animation: connected 1800ms ease 3;\n}\n\n.peer-connected-browser {\n    display: block !important;\n    fill: #12428c !important;\n    -webkit-animation: connected 1800ms ease 10;\n    animation: connected 1800ms ease 3;\n}\n\n.peer-own,\n.peer-connected-terminal,\n.peer-connected-browser {\n    will-change: opacity;\n}\n\n\n.link {\n    stroke: #dedede;\n    stroke-width: 1;\n    stroke-dasharray: 5 5;\n    opacity: 0.5;\n}\n\n\n@media  screen and  (max-width: 480px) {\n    #WebDollarMap svg{\n        box-sizing: border-box;\n        transform: scale(1.15);\n    }\n}\n\n@media   screen and  (max-width: 800px) {\n\n    /* disable map animations when map is in background */\n    .peer-own,  .peer-connected-browser, .peer-connected-terminal {\n        -webkit-animation: none;\n        animation: none;\n        will-change: initial;\n    }\n\n    #WebDollarMap svg{\n        box-sizing: border-box;\n        transform: scale(1.05);\n    }\n\n}\n\n\n/* Large Screen */\n\n@media screen and (min-width: 1080px) {\n    #WebDollarMap svg {\n        box-sizing: border-box;\n        transform: scale(0.9);\n    }\n}\n\n@media screen and (min-width: 1400px) {\n    #WebDollarMap svg {\n        box-sizing: border-box;\n        transform: scale(0.8);\n    }\n}\n";

},{}],368:[function(require,module,exports){
"use strict";

},{}],369:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wallet = function Wallet() {
  _classCallCheck(this, Wallet);
};

exports.default = new Wallet();

},{}]},{},[355]);

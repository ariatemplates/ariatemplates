/*
 * Copyright 2016 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {

var ariaUtilsJson = null;
var ariaUtilsArray = null;
var ariaUtilsString = null;
var subst = null;
var ariaUtilsType = null;
var ariaUtilsDom = null;

var ariaPopupsPopupManager = null;



////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

function createAsyncWrapper(fn) {
    function wrapper(callback) {
        var args = Array.prototype.slice.call(arguments, 1);
        var result = fn.apply(this, args);
        callback(result);
    }

    fn.async = wrapper;

    return wrapper;
}



////////////////////////////////////////////////////////////////////////////////
// Model: Test
////////////////////////////////////////////////////////////////////////////////

var prototype = {
    ////////////////////////////////////////////////////////////////////////////
    // Debug
    ////////////////////////////////////////////////////////////////////////////

    _log : function () {
        var console = Aria.$window.console;
        // IE < 9 compatible: http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9#comment8444540_5539378
        Function.prototype.apply.call(console.log, console, arguments);
    },

    _logLazy : function (next, getValues) {
        var values = getValues();

        var args = [];
        args.push(next);
        args.push.apply(args, values);

        this._log.async.apply(this, args);
    },

    _debugger : function () {
        /* jshint debug: true */
        debugger;
    },



    ////////////////////////////////////////////////////////////////////////////
    // DOM
    ////////////////////////////////////////////////////////////////////////////

    _ensureElementReference : function (element) {
        if (!ariaUtilsType.isHTMLElement(element)) {
            element = this.getElementById('' + element);
        }

        return element;
    },

    _getActiveElement : function () {
        return this.testDocument.activeElement;
    },

    _getWidgetDom : function (id) {
        var widgetInstance = this.getWidgetInstance(id);
        return widgetInstance.getDom();
    },



    ////////////////////////////////////////////////////////////////////////////
    // Template
    ////////////////////////////////////////////////////////////////////////////

    _refresh : function () {
        this.templateCtxt.$refresh();
    },



    ////////////////////////////////////////////////////////////////////////////
    // Widgets
    ////////////////////////////////////////////////////////////////////////////

    _getWidgetId : function (id) {
        var widgetDom = this._getWidgetDom(id);
        return widgetDom.id;
    },

    _createIsDialogOpenedPredicate : function (id) {
        return this._createPredicate(function () {
            var instance = this.getWidgetInstance(id);
            return instance._popup != null && (!instance._cfg.resizable || instance._resizable != null);
        }, function (shouldBeTrue) {
            return subst('Dialog with id "%1" should be %2.',
                id,
                shouldBeTrue ? 'opened' : 'closed'
            );
        }, this);
    },



    ////////////////////////////////////////////////////////////////////////////
    // Data
    ////////////////////////////////////////////////////////////////////////////

    _getData : function () {
        return this.templateCtxt.data;
    },

    _readBinding : function (binding) {
        return binding.inside[binding.to];
    },

    _setBindingValue : function (binding, value) {
        ariaUtilsJson.setValue(binding.inside, binding.to, value);
        return value;
    },



    ////////////////////////////////////////////////////////////////////////////
    // Asynchronous processing
    ////////////////////////////////////////////////////////////////////////////

    _asyncIterate : function (array, callback, onend, thisArg) {
        // ------------------------------------------ input arguments processing

        if (thisArg === undefined) {
            thisArg = this;
        }

        // ---------------------------------------------------------- processing

        var index = 0;
        iterate();

        function iterate () {
            var currentIndex = index;

            if (currentIndex >= array.length) {
                onend.call(thisArg, array);
            } else {
                index++;

                var item = array[currentIndex];
                callback.call(thisArg, iterate, item, currentIndex, array);
            }
        }
    },

    _asyncSequence : function (functions, callback, thisArg) {
        this._asyncIterate(functions, function (next, fn) {
            return fn.call(this, next);
        }, callback, thisArg);
    },

    _localAsyncSequence : function (creator, callback) {
        // ---------------------------------------------------------- processing

        var self = this;
        var sequence = [];

        creator.call(this, function (fnOrName) {
            var fn;
            if (ariaUtilsType.isString(fnOrName)) {
                fn = self[fnOrName];
            } else {
                fn = fnOrName;
            }

            if (fn == null) {
                throw new Error('The given value is not defined, cannot add any function.');
            }

            if (ariaUtilsType.isFunction(fn.async)) {
                fn = fn.async;
            }

            if (arguments.length > 1) {
                var boundArguments = Array.prototype.slice.call(arguments, 1);
                fn = self._partializeAsynchronousFunction(fn, boundArguments);
            }

            sequence.push(fn);
        });

        // ---------------------------------------------------------- delegation

        return this._asyncSequence(sequence, callback, this);

    },

    _partializeAsynchronousFunction : function (fn, boundArguments) {
        return function(next) {
            var additionalArguments = Array.prototype.slice.call(arguments, 1);

            var allArguments = [];
            allArguments.push(next);
            allArguments.push.apply(allArguments, boundArguments);
            allArguments.push.apply(allArguments, additionalArguments);

            return fn.apply(this, allArguments);
        };
    },

    _createAsyncWrapper : function () {
        return createAsyncWrapper.apply(null, arguments);
    },

    _delay : function (callback, delay) {
        if (delay == null) {
            delay = 500;
        }

        setTimeout(callback, delay);
    },



    ////////////////////////////////////////////////////////////////////////////
    // Robot: wait & check
    ////////////////////////////////////////////////////////////////////////////

    _waitForFocus : function (callback, element, strict, thisArg) {
        // ------------------------------------------ input arguments processing

        if (strict == null) {
            strict = true;
        }

        if (thisArg === undefined) {
            thisArg = this;
        }

        // ---------------------------------------------------------- processing

        var self = this;


        this.waitFor({
            scope: thisArg,
            condition: function () {
                return self._isFocused(element, strict);
            },
            callback: callback
        });
    },



    ////////////////////////////////////////////////////////////////////////////
    // Robot: User actions
    ////////////////////////////////////////////////////////////////////////////

    // mouse -------------------------------------------------------------------

    _click : function (callback, element) {
        this.synEvent.click(element, callback);
    },

    _drag : function (callback, options) {
        // ------------------------------------------ input arguments processing

        var from_ = options.from;

        var to = options.to;

        var duration = options.duration;
        if (duration == null) {
            duration = 500;
        }

        // ---------------------------------------------------------- processing

        this.synEvent.execute([[
            'drag',
            {
                duration: duration,
                to: to
            },
            from_
        ]], callback);
    },


    // keyboard ----------------------------------------------------------------

    _type : function (callback, sequence) {
        this.synEvent.type(null, sequence, callback);
    },

    // keyboard > keys ---------------------------------------------------------

    _pushKey : function (callback, key) {
        this._type(callback, '[<' + key + '>]');
    },

    _releaseKey : function (callback, key) {
        this._type(callback, '[>' + key + '<]');
    },

    _pressKey : function (callback, key) {
        this._type(callback, '[' + key + ']');
    },

    // keyboard > shift --------------------------------------------------------

    _pressWithShift : function (callback, key) {
        this._type(callback, '[<shift>]' + ('[' + key + ']') + '[>shift<]');
    },



    ////////////////////////////////////////////////////////////////////////////
    // Robot: navigation
    ////////////////////////////////////////////////////////////////////////////

    _focusElement : function (callback, element) {
        element = this._ensureElementReference(element);

        this._localAsyncSequence(function (add) {
            add('_delay');
            add('_click', element);
            add('_waitForElementFocus', element);
        }, callback);
    },

    _focusElementBefore : function (callback, id) {
        this._focusElement(callback, 'before_' + id);
    },

    _focusWidget : function (callback, id) {
        this._localAsyncSequence(function (add) {
            add('_focusElementBefore', id);
            add('_pressTab');
            add('_waitForWidgetFocus', id);
        }, callback);
    },

    _waitForElementFocus : function (callback, element) {
        element = this._ensureElementReference(element);
        this._waitForFocus(callback, element);
    },

    _waitForWidgetFocus : function (callback, id) {
        var widgetDom = this._getWidgetDom(id);
        this._waitForFocus(callback, widgetDom, false);
    },

    _waitForFocusChange : function (callback, previouslyActiveElement) {
        this.waitFor({
            scope: this,
            condition: function () {
                return this._getActiveElement() !== previouslyActiveElement;
            },
            callback: callback
        });
    },

    _navigate : function (callback, action) {
        var activeElement = this._getActiveElement();

        this._localAsyncSequence(function (add) {
            add(action);
            add('_waitForFocusChange', activeElement);
        }, callback);
    },

    _navigateForward : function (callback) {
        this._navigate(callback, this._pressTab);
    },

    _navigateBackward : function (callback) {
        this._navigate(callback, this._pressShiftTab);
    },



    ////////////////////////////////////////////////////////////////////////////
    // Assertions: DOM
    ////////////////////////////////////////////////////////////////////////////

    _checkAttribute : function (id, element, attributeName, expected, strict) {
        if (strict == null) {
            strict = true;
        }

        var attribute = element.getAttribute(attributeName);

        var condition;
        if (strict) {
            condition = attribute === expected;
        } else {
            condition = attribute == expected;
        }

        var message = 'Widget "%1" should have attribute "%2" set to "%3", it has value "%4" instead';
        message = subst(message,
            id,
            attributeName,
            expected,
            attribute
        );

        this.assertTrue(condition, message);
    },

    _checkWidgetAttribute : function (id, attributeName, expected, strict) {
        var element = this._getWidgetDom(id);
        this._checkAttribute(id, element, attributeName, expected, strict);
    },

    _checkElementAttribute : function (element, attributeName, expected, strict) {
        element = this._ensureElementReference(element);
        var id = element.id;
        this._checkAttribute(id, element, attributeName, expected, strict);
    },



    ////////////////////////////////////////////////////////////////////////////
    // Assertions: Focus
    ////////////////////////////////////////////////////////////////////////////

    _isFocused : function (element, strict) {
        // ---------------------------------------------------------- processing

        var activeElement = this._getActiveElement();

        var result;
        if (strict) {
            result = activeElement === element;
        } else {
            result = ariaUtilsDom.isAncestor(activeElement, element);
        }

        // -------------------------------------------------------------- return

        return result;
    },

    _isWidgetFocused : function (id) {
        var element = this._getWidgetDom(id);
        return this._isFocused(element, false);
    },

    _checkElementIsFocused : function (callback, element) {
        element = this._ensureElementReference(element);

        this.waitFor({
            callback: callback,
            condition: function () {
                return this._isFocused(element);
            },
            scope: this
        });
    },

    _checkWidgetIsFocused : function (callback, id) {
        this.waitFor({
            callback: callback,
            condition: function () {
                return this._isWidgetFocused(id);
            },
            scope: this
        });
    },



    ////////////////////////////////////////////////////////////////////////////
    // Advanced utilities
    ////////////////////////////////////////////////////////////////////////////

    _createPredicate : function (predicate, buildMessage, thisArg) {
        // ------------------------------------------ input arguments processing

        if (thisArg === undefined) {
            thisArg = this;
        }

        // ---------------------------------------------------------- processing

        var self = this;

        // ---------------------------------------------------------------------

        function isTrue() {
            var result = predicate.apply(thisArg, arguments);
            return result;
        }
        this._createAsyncWrapper(isTrue);

        function isFalse() {
            return !isTrue.apply(thisArg, arguments);
        }
        this._createAsyncWrapper(isFalse);

        // ---------------------------------------------------------------------

        function _waitFor(callback, predicate, args) {
            args = Array.prototype.slice.call(args, 1);

            self.waitFor({
                scope: thisArg,
                condition: {
                    fn: predicate,
                    args: args
                },
                callback: callback
            });
        }

        function waitForTrue(callback) {
            _waitFor(callback, isTrue, arguments);
        }

        function waitForFalse(callback) {
            _waitFor(callback, isFalse, arguments);
        }

        // ---------------------------------------------------------------------

        function assertTrue() {
            var result = isTrue.apply(thisArg, arguments);
            var message = buildMessage.call(thisArg, true, arguments);

            self.assertTrue(result, message);
        }
        this._createAsyncWrapper(assertTrue);

        function assertFalse() {
            var result = isFalse.apply(thisArg, arguments);
            var message = buildMessage.call(thisArg, false, arguments);

            self.assertTrue(result, message);
        }
        this._createAsyncWrapper(assertFalse);

        // -------------------------------------------------------------- return

        return {
            predicate: predicate,
            buildMessage: buildMessage,

            isTrue: isTrue,
            isFalse: isFalse,
            check: isTrue,

            waitForTrue: waitForTrue,
            waitForFalse: waitForFalse,
            wait: waitForTrue,

            assertTrue: assertTrue,
            assertFalse: assertFalse,
            assert: assertTrue
        };
    }
};



////////////////////////////////////////////////////////////////////////////////
// Sync to async
////////////////////////////////////////////////////////////////////////////////

createAsyncWrapper(prototype._log);
createAsyncWrapper(prototype._debugger);

createAsyncWrapper(prototype._refresh);

createAsyncWrapper(prototype._checkAttribute);
createAsyncWrapper(prototype._checkWidgetAttribute);
createAsyncWrapper(prototype._checkElementAttribute);



////////////////////////////////////////////////////////////////////////////////
// Robot: User actions | Keyboard > specific keys
////////////////////////////////////////////////////////////////////////////////

var commonKeys = [
    {name: 'shift', granular: true},

    {name: 'tab', shift: true},
    {name: 'F10', shift: true},

    'space',
    {name: 'enter', granular: true},
    'escape',
    'backspace',

    'down'
];

prototype.$init = function (prototype) {
    // -------------------------------------------------------------------------

    ariaUtilsJson = aria.utils.Json;
    ariaUtilsArray = aria.utils.Array;
    ariaUtilsString = aria.utils.String;
    subst = ariaUtilsString.substitute;
    ariaUtilsType = aria.utils.Type;
    ariaUtilsDom = aria.utils.Dom;

    ariaPopupsPopupManager = aria.popups.PopupManager;

    // -------------------------------------------------------------------------

    ariaUtilsArray.forEach(commonKeys, function (keySpec) {
        // ------------------------------------------ input arguments processing

        if (ariaUtilsType.isString(keySpec)) {
            keySpec = {name: keySpec};
        }

        var name = keySpec.name;

        var shift = keySpec.shift;
        if (shift == null) {
            shift = false;
        }

        var granular = keySpec.granular;
        if (granular == null) {
            granular = false;
        }

        // ---------------------------------------------------------- processing

        var capitalizedName = ariaUtilsString.capitalize(name);

        function addMethod(baseName, method) {
            var methodName = '_' + baseName + capitalizedName;
            prototype[methodName] = method;
        }

        // ---------------------------------------------------------------------

        addMethod('press', function (callback) {
            this._pressKey(callback, name);
        });

        if (granular) {
            addMethod('push', function (callback) {
                this._pushKey(callback, name);
            });

            addMethod('release', function (callback) {
                this._releaseKey(callback, name);
            });
        }

        if (shift) {
            addMethod('pressShift', function (callback) {
                this._pressWithShift(callback, name);
            });
        }
    });
};



////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

Aria.classDefinition({
    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $classpath : 'test.EnhancedRobotBase',
    $extends : 'aria.jsunit.RobotTestCase',

    $dependencies: [
        'aria.utils.Json',
        'aria.utils.Array',
        'aria.utils.String',
        'aria.utils.Type',
        'aria.utils.Dom',

        'aria.popups.PopupManager',

        'aria.jsunit.RobotTestCase'
    ],



    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $constructor : function () {
        // ------------------------------------------------------ initialization

        this.$RobotTestCase.constructor.call(this);

        // ------------------------------------------------- internal attributes

        var disposableObjects = [];
        this._disposableObjects = disposableObjects;
    },

    $destructor : function () {
        this.$RobotTestCase.$destructor.call(this);

        ariaUtilsArray.forEach(this._disposableObjects, function (object) {
            object.$dispose();
        });
    },

    $prototype : prototype
});

})();

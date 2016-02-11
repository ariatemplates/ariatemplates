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

var Aria = require('ariatemplates/Aria');

var ariaUtilsJson = require('ariatemplates/utils/Json');
var ariaUtilsArray = require('ariatemplates/utils/Array');
var ariaUtilsString = require('ariatemplates/utils/String');
var ariaUtilsType = require('ariatemplates/utils/Type');
var ariaUtilsDom = require('ariatemplates/utils/Dom');

var ariaPopupsPopupManager = require('ariatemplates/popups/PopupManager');

var ariaJsunitRobotTestCase = require('ariatemplates/jsunit/RobotTestCase');



////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

function _string_capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    // DOM
    ////////////////////////////////////////////////////////////////////////////

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
            return this.getWidgetInstance(id)._popup != null;
        }, function (shouldBeTrue) {
            return ariaUtilsString.substitute('Dialog with id "%1" should be %2.', [
                id,
                shouldBeTrue ? 'opened' : 'closed'
            ]);
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

        creator.call(this, function add(fnOrName) {
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
            condition: function condition() {
                return self._isFocused(element, strict);
            },
            callback: callback
        });
    },



    ////////////////////////////////////////////////////////////////////////////
    // Robot: User actions
    ////////////////////////////////////////////////////////////////////////////

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

    _focusElement : function (callback, id) {
        var element = this.getElementById(id);
        element.focus();
        this._waitForElementFocus(callback, id);
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

    _waitForElementFocus : function (callback, id) {
        var element = this.getElementById(id);
        this._waitForFocus(callback, element);
    },

    _waitForWidgetFocus : function (callback, id) {
        var widgetDom = this._getWidgetDom(id);
        this._waitForFocus(callback, widgetDom, false);
    },

    _waitForFocusChange : function (callback, previouslyActiveElement) {
        this.waitFor({
            scope: this,
            condition: function condition() {
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

    _checkAttribute : function (id, element, attributeName, expected) {
        var attribute = element.getAttribute(attributeName);

        var condition = attribute === expected;

        var message = 'Widget "%1" should have attribute "%2" set to "%3", it has value "%4" instead';
        message = ariaUtilsString.substitute(message, [
            id,
            attributeName,
            expected,
            attribute
        ]);

        this.assertTrue(condition, message);
    },

    _checkWidgetAttribute : function (id, attributeName, expected) {
        var element = this._getWidgetDom(id);
        this._checkAttribute(id, element, attributeName, expected);
    },

    _checkElementAttribute : function (id, attributeName, expected) {
        var element = this.getElementById(id);
        this._checkAttribute(id, element, attributeName, expected);
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

    _checkElementIsFocused : function (callback, id) {
        var element = this.getElementById(id);

        this.waitFor({
            callback: callback,
            condition: function condition() {
                return this._isFocused(element);
            },
            scope: this
        });
    },

    _checkWidgetIsFocused : function (callback, id) {
        this.waitFor({
            callback: callback,
            condition: function condition() {
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

ariaUtilsArray.forEach(commonKeys, function (keySpec) {
    // ---------------------------------------------- input arguments processing

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

    // -------------------------------------------------------------- processing

    var capitalizedName = _string_capitalize(name);

    function addMethod(baseName, method) {
        var methodName = '_' + baseName + capitalizedName;
        prototype[methodName] = method;
    }

    // -------------------------------------------------------------------------

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



////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = Aria.classDefinition({
    ////////////////////////////////////////////////////////////////////////////
    //
    ////////////////////////////////////////////////////////////////////////////

    $classpath : 'test.EnhancedRobotTestCase',
    $extends : ariaJsunitRobotTestCase,



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

/*
 * Copyright 2012 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.core.CallbackTest",
    $extends : "aria.jsunit.TestCase",
    $statics : {
        _lastCallback : null
    },
    $prototype : {
        _assertAgainst : function (expected) {
            var got = test.aria.core.CallbackTest._lastCallback;
            // reset it
            test.aria.core.CallbackTest._lastCallback = null;

            if (expected.fn) {
                this.assertEquals(expected.fn, got.fn, "Functions differ");
            }
            if (expected.scope) {
                this.assertEquals(expected.scope, got.scope, "Scopes differ");
            }
            if (expected.args) {
                this.assertEquals(expected.args.length, got.args.length, "Args length differ");

                for (var i = 0; i < expected.args.length; i += 1) {
                    this.assertEquals(expected.args[i], got.args[i], "Args differ in position " + i);
                }
            }
        },

        setUp : function () {
            this.workingObject = new aria.core.JsObject();
        },

        tearDown : function () {
            this.workingObject.$dispose();
            this.workingObject = null;
        },

        testEmpty : function () {
            this.workingObject.$callback();
            this.assertLogsEmpty();
        },

        /*
         * This set of tests verify that $callback is calling the correct function with the correct scope
         */
        testRealFunctionNoScope : function () {
            this.workingObject.$callback({
                fn : this._callbackWithScope
            });
            this._assertAgainst({
                fn : "_callbackWithScope",
                scope : this.workingObject
            });
        },

        testStringFunctionNoScope : function () {
            this.workingObject.rememberScope = this._callbackWithScope;

            this.workingObject.$callback({
                fn : "rememberScope"
            });
            this._assertAgainst({
                fn : "_callbackWithScope",
                scope : this.workingObject
            });
        },

        testRealFunctionWithScope : function () {
            var scope = {
                a : "b"
            };
            this.workingObject.$callback({
                fn : this._callbackWithScope,
                scope : scope
            });
            this._assertAgainst({
                fn : "_callbackWithScope",
                scope : scope
            });
        },

        testStringFunctionWithScope : function () {
            var scope = {
                b : this._callbackWithScope
            };
            this.workingObject.$callback({
                fn : "b",
                scope : scope
            });
            this._assertAgainst({
                fn : "_callbackWithScope",
                scope : scope
            });
        },

        _callbackWithScope : function () {
            test.aria.core.CallbackTest._lastCallback = {
                fn : "_callbackWithScope",
                scope : this
            };
        },

        /*
         * This set of tests verify that $callback is passing the correct arguments
         */
        testDefaultArgs : function () {
            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : "argument"
            });
            this._assertAgainst({
                args : [undefined, "argument"]
            });
        },

        testDefaultArgsWithResponse : function () {
            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : "argument"
            }, "res");
            this._assertAgainst({
                args : ["res", "argument"]
            });
        },

        testResIndexNegative : function () {
            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : "one",
                resIndex : -1
            }, "res");
            this._assertAgainst({
                args : ["one"]
            });
        },

        testResIndexZero : function () {
            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : "one",
                resIndex : 0
            }, "res");
            this._assertAgainst({
                args : ["res", "one"]
            });
        },

        testResIndexPositive : function () {
            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : "one",
                resIndex : 2
            }, "res");
            this._assertAgainst({
                args : ["one", "res"]
            });
        },

        /*
         * This set of tests verify the behavior of $callback with an array of arguments
         */
        testDefaultArgsArray : function () {
            var args = ["one", "two"];

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args
            }, "res");
            this._assertAgainst({
                args : ["res", args]
            });
        },

        testArgsApplyFalse : function () {
            var args = ["one", "two"];

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args,
                apply : false
            }, "res");
            this._assertAgainst({
                args : ["res", args]
            });
        },

        testArgsApplyTrue : function () {
            var args = ["one", "two"];

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args,
                apply : true
            }, "res");
            this._assertAgainst({
                args : ["res", "one", "two"]
            });
        },

        testArgsApplyNotApllicable : function () {
            var args = {
                "one" : "two"
            };

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args,
                apply : true
            }, "res");
            this._assertAgainst({
                args : ["res", args]
            });
        },

        /*
         * This set of tests combines resIndex and apply
         */
        testApplyResIndexNegative : function () {
            var args = ["one", "two"];

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args,
                apply : true,
                resIndex : -1
            }, "res");
            this._assertAgainst({
                args : ["one", "two"]
            });
        },

        testApplyResIndexZero : function () {
            var args = ["one", "two"];

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args,
                apply : true,
                resIndex : 0
            }, "res");
            this._assertAgainst({
                args : ["res", "one", "two"]
            });
        },

        testApplyResIndexPositive : function () {
            var args = ["one", "two"];

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args,
                apply : true,
                resIndex : 1
            }, "res");
            this._assertAgainst({
                args : ["one", "res", "two"]
            });
        },

        testApplyResIndexPositiveBiggerThanArray : function () {
            var args = ["one", "two"];

            this.workingObject.$callback({
                fn : this._rememberArgs,
                args : args,
                apply : true,
                resIndex : 4
            }, "res");
            this._assertAgainst({
                args : ["one", "two", "res"]
            });
        },

        _rememberArgs : function () {
            test.aria.core.CallbackTest._lastCallback = {
                args : Array.prototype.slice.call(arguments)
            };
        },

        /*
         * Test the presence of errors
         */
        testError : function () {
            var errorMsg = "This is my error message";

            this.workingObject.$callback({
                fn : "missingCallback"
            }, "useless", errorMsg);

            this.assertErrorInLogs(errorMsg);
        }
    }
});

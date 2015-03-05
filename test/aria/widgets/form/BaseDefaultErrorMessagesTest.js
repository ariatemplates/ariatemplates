/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.BaseDefaultErrorMessagesTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Array", "aria.utils.Json"],

    /**
     * @param {String} widgetName The name of the widget being tested, as present in the global default error messages configuration
     * @param {Array} messagesList Array of message name (<em>String</em>) to be tested (as those present in the widget's default error messages configuration)
     */
    $constructor : function (widgetName, messagesList) {
        // ---------------------------------------------------------------------

        this.$TemplateTestCase.constructor.apply(this, arguments);

        // ---------------------------------------------------------------------

        this.widgetName = widgetName;
        this.messagesList = messagesList;

        // ---------------------------------------------------------------------

        var data = this.data = {};

        data.instanceHardCoded = "instance hardcoded";
        data.defaultErrorMessages = {};

        this.setTestEnv({
            data: data,
            template: "test.aria.widgets.form." + widgetName.toLowerCase() + ".defaultErrorMessages.DefaultErrorMessagesTestTpl"
        });

        // ---------------------------------------------------------------------

        this.globalMessage = "global message";
        this.instanceMessage = "instance message";
    },
    $prototype : {
        runTemplateTest : function () {
            // -----------------------------------------------------------------

            this.boundWidget = this.getWidgetInstance("bound");
            this.hardcodedWidget = this.getWidgetInstance("hardcoded");

            // -----------------------------------------------------------------

            aria.utils.Array.forEach(this.messagesList, function(name) {
                this._testMessageConfiguration(name);
            }, this);

            // -----------------------------------------------------------------

            this.end();
        },



        _testMessageConfiguration : function (name) {
            // Order of steps is important
            aria.utils.Array.forEach([
                "HardCodedConfiguration",
                "BoundConfiguration",
                "GlobalConfiguration", // HardCodedConfiguration & BoundConfiguration will already check that instance configuration has precedence over global configuration
                "HardCodedDefault"
            ], function(step) {
                this["_test" + step](name);
                this._resetMessage(name);
            }, this);
        },

        _resetMessage : function (name) {
            this._setInstanceDefault(name, null);
            this._setGlobalDefault(name, null);
        },



        _testHardCodedConfiguration : function (name) {
            this._checkMessage(this.hardcodedWidget, name, this.data.instanceHardCoded);

            this._setGlobalDefault(name, this.globalMessage);
            this._checkMessage(this.hardcodedWidget, name, this.data.instanceHardCoded);
        },

        _testBoundConfiguration : function (name) {
            this._setInstanceDefault(name, this.instanceMessage);
            this._checkMessage(this.boundWidget, name, this.instanceMessage);

            this._setGlobalDefault(name, this.globalMessage);
            this._checkMessage(this.boundWidget, name, this.instanceMessage);
        },

        _testGlobalConfiguration : function (name) {
            this._setGlobalDefault(name, this.globalMessage);
            this._checkMessage(this.boundWidget, name, this.globalMessage);
        },

        _testHardCodedDefault : function (name) {
            this._checkMessage(this.boundWidget, name, this.boundWidget.controller.res.errors[this.widgetName][name]);
        },



        _checkMessage : function (widget, name, expectedValue) {
            var stringify = function (value) {
                return aria.utils.Json.convertToJsonString(value);
            };

            var actualValue = widget.controller.getErrorMessage(name);

            var message = "The message value is not the expected one. Expected one is: " + stringify(expectedValue) + ", while actual one is: " + stringify(actualValue) + ".";

            this.assertTrue(actualValue == expectedValue, message);
        },



        _setGlobalDefault : function (name, value) {
            var messages = {};
            messages[name] = value;

            var widgets = {};
            widgets[this.widgetName] = messages;

            aria.core.AppEnvironment.setEnvironment({
                "widgetSettings" : {
                    defaultErrorMessages : widgets
                }
            }, null, true);
        },

        _setInstanceDefault : function (name, value) {
            aria.utils.Json.setValue(this.data.defaultErrorMessages, name, value);
        }
    }
});

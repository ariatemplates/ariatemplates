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
    $resources : {
        res : "aria.widgets.WidgetsRes"
    },

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
        /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1428) */
        this.resourceMessageOldKey = "resource message (old key)";
        /* BACKWARD-COMPATIBILITY-END (GitHub #1428) */
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
            aria.utils.Array.forEach([
                "HardCodedConfiguration",
                "BoundConfiguration",
                "GlobalConfiguration",
                "HardCodedDefault"
                /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1428) */
                ,
                "HardCodedDefaultTweaking"
                /* BACKWARD-COMPATIBILITY-END (GitHub #1428) */
            ], function(step) {
                this["_test" + step](name);
                this._resetMessage(name);
            }, this);
        },

        /**
         * Resets the global and local (per instance) configurations of default error messages for the given message name.
         *
         * @param {String} messageName The name of the message to reset.
         */
        _resetMessage : function (messageName) {
            this._setInstanceDefault(messageName, null);
            this._setGlobalDefault(messageName, null);
        },


        /**
         * Tests that a widget for which the error message is set in its configuration, and without binding, will always use this error message.
         */
        _testHardCodedConfiguration : function (messageName) {
            // -----------------------------------------------------------------

            var widget = this.hardcodedWidget;
            var expectedValue = this.data.instanceHardCoded;

            // -----------------------------------------------------------------

            this._checkMessage(widget, messageName, expectedValue);

            // -----------------------------------------------------------------

            this._setGlobalDefault(messageName, this.globalMessage);
            this._checkMessage(widget, messageName, expectedValue);
        },

        /**
         * Tests that a widget for which the error message is set in its configuration, and using binding, will always use this error message and that it will reflect the one set in the bound part of the data model.
         */
        _testBoundConfiguration : function (messageName) {
            // -----------------------------------------------------------------

            var widget = this.boundWidget;
            var expectedValue;

            // -----------------------------------------------------------------

            expectedValue = this.instanceMessage;
            this._setInstanceDefault(messageName, expectedValue);
            this._checkMessage(widget, messageName, expectedValue);

            // -----------------------------------------------------------------

            expectedValue = this.instanceMessage;
            this._setGlobalDefault(messageName, this.globalMessage);
            this._checkMessage(widget, messageName, expectedValue);
        },

        /**
         * Tests that if a global configuration is specified it will be used as long as no specific configuration is set for a widget instance.
         */
        _testGlobalConfiguration : function (messageName) {
            // -----------------------------------------------------------------

            var widget = this.boundWidget;
            var expectedValue;

            // -----------------------------------------------------------------

            expectedValue = this.globalMessage;
            this._setGlobalDefault(messageName, expectedValue);
            this._checkMessage(widget, messageName, expectedValue);

            // -----------------------------------------------------------------

            expectedValue = this.instanceMessage;
            this._setInstanceDefault(messageName, expectedValue);
            this._checkMessage(widget, messageName, expectedValue);
        },

        /**
         * Tests that as long as there is no user configuration the hardcoded default value will be used instead.
         */
        _testHardCodedDefault : function (messageName) {
            // -----------------------------------------------------------------

            var widget = this.boundWidget;
            var expectedValue;

            // -----------------------------------------------------------------

            expectedValue = aria.widgets.WidgetsRes.errors[this.widgetName][messageName];
            this._checkMessage(widget, messageName, expectedValue);

            // -----------------------------------------------------------------

            this._resetMessage(messageName);

            expectedValue = this.instanceMessage;
            this._setInstanceDefault(messageName, expectedValue);
            this._checkMessage(widget, messageName, expectedValue);


            // -----------------------------------------------------------------

            this._resetMessage(messageName);

            expectedValue = this.globalMessage;
            this._setGlobalDefault(messageName, expectedValue);
            this._checkMessage(widget, messageName, expectedValue);
        },
        /* BACKWARD-COMPATIBILITY-BEGIN (GitHub #1428) */

        /**
         * Tests that the hardcoded default value can be modified since it is actually an accessible single object residing in memory.
         *
         * <p>
         * Note that this is a feature only available with the old keys, since now there is a preferred and supported way to do it.
         * </p>
         */
        _testHardCodedDefaultTweaking : function (messageName) {
            var widgetName = this.widgetName;

            // -----------------------------------------------------------------

            var widget = this.boundWidget;
            var expectedValue;

            var resourceErrors = aria.widgets.WidgetsRes.errors;
            var resourceWidgetErrors = resourceErrors[widgetName];

            // -----------------------------------------------------------------

            expectedValue = resourceWidgetErrors[messageName];
            this._checkMessage(widget, messageName, expectedValue);

            // -----------------------------------------------------------------

            var map = widget.controller._newKeysToOldKeysMap;

            expectedValue = this.resourceMessageOldKey;
            resourceErrors[map[widgetName][messageName]] = expectedValue;
            this._checkMessage(widget, messageName, expectedValue);
        },
        /* BACKWARD-COMPATIBILITY-END (GitHub #1428) */

        /**
         * Check that the queried error message (from its name) for the given widget is the expected one.
         *
         * @param widget The widget instance to check.
         * @param {String} messageName The name of the message to check.
         * @param {String} expectedValue The expected message value.
         */
        _checkMessage : function (widget, messageName, expectedValue) {
            var stringify = function (value) {
                return aria.utils.Json.convertToJsonString(value);
            };

            var actualValue = widget.controller.getErrorMessage(messageName);

            var message = "The message value is not the expected one. Expected one is: " + stringify(expectedValue) + ", while actual one is: " + stringify(actualValue) + ".";

            this.assertTrue(actualValue == expectedValue, message);
        },



        /**
         * Set the global default error message for the given message name and value.
         *
         * @param {String} messageName The name of the message to set.
         * @param {String} value The value to set for the message.
         */
        _setGlobalDefault : function (messageName, value) {
            var messages = {};
            messages[messageName] = value;

            var widgets = {};
            widgets[this.widgetName] = messages;

            aria.core.AppEnvironment.setEnvironment({
                "widgetSettings" : {
                    defaultErrorMessages : widgets
                }
            }, null, true);
        },

        /**
         * Set the instance default error message for the given message name and value.
         *
         * <p>
         * No need to specify any actual widget, since modifying the instance configuration actually implied modifying a property of the data model using binding.
         * </p>
         *
         * @param {String} messageName The name of the message to set.
         * @param {String} value The value to set for the message.
         */
        _setInstanceDefault : function (messageName, value) {
            aria.utils.Json.setValue(this.data.defaultErrorMessages, messageName, value);
        }
    }
});

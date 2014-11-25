/*
 * Copyright 2013 Amadeus s.a.s.
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

var Aria = require("ariatemplates/Aria");

var stringUtils = require("ariatemplates/utils/String");
var dataUtils = require("ariatemplates/utils/Data");

var TemplateTestCase = require("ariatemplates/jsunit/TemplateTestCase");

require("ariatemplates/widgets/errorlist/ErrorListTemplate.tpl"); // just to be sure the template is loaded when the test is run, since it depends on its (DOM) content

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.errorlist.ListErrorTestCase",
    $extends : TemplateTestCase,

    $constructor : function() {
        // ---------------------------------------------------------------------

        this.$TemplateTestCase.constructor.call(this);

        // ------------------------------------ template data & test environment

        var type = dataUtils.TYPE_CONFIRMATION;
        this.data = {
            errorMessages: [
                {
                    localizedMessage : "raw",
                    type : type
                },
                {
                    localizedMessage : "with <b><em>HTML</em></b>",
                    type : type
                },
                {
                    localizedMessage : "with <span class=\"bold italic\">HTML</span>",
                    escape : false,
                    type : type
                }
            ]
        };

        this.setTestEnv({
            data: this.data
        });

        // ------------------------------------------------ comparison functions

        var cleanText = function(text) {
            text = text.replace(/\n/g, '');
            text = text.replace(/^\s+|\s+$/g, '');

            return text;
        };

        var compareCaseInsensitive = function(a, b) {
            return a.toLowerCase() === b.toLowerCase();
        };

        var getElementText = function(element) {
            var textContent = element.textContent || element.innerText || element.nodeValue || "";
            return cleanText(textContent);
        };

        var getElementHTML = function(element) {
            var htmlContent = element.innerHTML;
            return cleanText(htmlContent);
        };

        var textComparator = function(errorMessage, domElement) {
            var expected = errorMessage.localizedMessage;
            expected = stringUtils.escapeForHTML(expected, errorMessage.escape);

            var actual = getElementHTML(domElement);
            return compareCaseInsensitive(actual, expected);
        };

        var elementComparator = function (errorMessage, domElement) {
            var expected = errorMessage.localizedMessage;
            var actual = getElementText(domElement);

            return compareCaseInsensitive(actual, expected) && domElement.children.length === 0;
        };

        this.messagesExtraData = [
            {comparator: textComparator},
            {comparator: elementComparator},
            {comparator: textComparator}
        ];
    },

    $prototype : {
        runTemplateTest : function () {
            var errorMessages = this.data.errorMessages;
            var messagesElements = this.templateCtxt.getContainerDiv().getElementsByTagName("ul").item(0).getElementsByTagName("li");
            var extraData = this.messagesExtraData;

            for (var index = 0, length = errorMessages.length; index < length; index++) {
                var errorMessage = errorMessages[index];
                var domElement = messagesElements.item(index);
                var comparator = extraData[index].comparator;

                this.assertTrue(
                    comparator(errorMessage, domElement),
                    "Message number " + (index + 1) + " content is different than expected."
                );
            }

            this.notifyTemplateTestEnd();
        }
    }
});

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
    $classpath : "test.aria.html.textinput.TextInputTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.TextInput"],
    $prototype : {
        /**
         * Make sure that errors are logged and using the widget doesn't break anything
         */
        testValidationError : function () {
            var cfg = {
                something : "here"
            };

            var widget = new aria.html.TextInput(cfg, {
                tplClasspath : "TextInput"
            });

            // the mandatory is always set, so no errors should be displayed

            var out = this.createMockMarkupWriter();
            widget.writeMarkupBegin(out);
            this.assertErrorInLogs(aria.html.InputElement.INVALID_USAGE);

            widget.writeMarkupEnd(out);
            widget.writeMarkup(out);

            widget.$dispose();
        },

        createMockMarkupWriter : function () {
            var buffer = [];
            return {
                write : function (markup) {
                    buffer.push(markup);
                },

                getMarkup : function () {
                    return buffer.join("");
                }
            };
        },

        /**
         * Verify that a correctly defined widget works fine
         */
        testMarkup : function () {
            // tag name should be ignored
            var cfg = {
                tagName : "div",
                attributes : {
                    name : "division",
                    classList : ["a", "b"]
                }
            };

            var widget = new aria.html.TextInput(cfg, {
                tplClasspath : "TextInput"
            });
            widget._id = "x";
            widget.__originalDelegateId = widget.__delegateId;
            widget.__delegateId = "y";

            // These two functions are called if the widget is used as a container
            this.checkMarkupBegin(widget);
            this.checkMarkupEnd(widget);

            // This one when we use it a closing tag
            this.checkMarkup(widget);

            widget.__delegateId = widget.__originalDelegateId;

            widget.$dispose();
        },

        /**
         * Markup begin
         */
        checkMarkupBegin : function (widget) {
            var out = this.createMockMarkupWriter();

            widget.writeMarkupBegin(out);

            var markup = out.getMarkup();

            this.assertErrorInLogs(aria.html.InputElement.INVALID_USAGE);
        },

        /**
         * Markup end
         */
        checkMarkupEnd : function (widget) {
            var out = this.createMockMarkupWriter();

            widget.writeMarkupEnd(out);

            var markup = out.getMarkup();

            // The logging is done by the markup begin
            this.assertLogsEmpty();
        },

        /**
         * Markup (self closing widget)
         */
        checkMarkup : function (widget) {
            var out = this.createMockMarkupWriter();

            widget.writeMarkup(out);

            var markup = out.getMarkup();
            this.assertEquals("<input id='x'  name=\"division\" class=\"a b\" type=\"text\" atdelegate='y' />", markup, "Markup: <xmp>"
                    + markup + "</xmp>");
        }
    }
});

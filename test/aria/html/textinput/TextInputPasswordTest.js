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
    $classpath : "test.aria.html.textinput.TextInputPasswordTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.TextInput"],
    $prototype : {

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
         * Verify that a correctly defined widget with password set to true works fine
         */
        testPasswordMarkup : function () {
            // tag name should be ignored
            var cfg = {
                password : true,
                attributes : {
                    name : "division",
                    classList : ["a", "b"],
                    type : "text"
                }
            };

            var widget = new aria.html.TextInput(cfg, {
                tplClasspath : "TextInput"
            });
            widget._id = "x";
            widget.__originalDelegateId = widget.__delegateId;
            widget.__delegateId = "y";

            // This one when we use it a closing tag
            this.checkMarkup(widget);

            widget.__delegateId = widget.__originalDelegateId;

            widget.$dispose();
        },

        /**
         * Markup
         */
        checkMarkup : function (widget) {
            var out = this.createMockMarkupWriter();

            widget.writeMarkup(out);

            var markup = out.getMarkup();
            this.assertEquals("<input id='x'  name=\"division\" class=\"a b\" type=\"password\" atdelegate='y' />", markup, "Markup: <xmp>"
                    + markup + "</xmp>");
        }
    }
});

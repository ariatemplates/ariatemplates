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
    $classpath : "test.aria.html.textarea.TextAreaTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.TextArea"],
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
         * Verify that a correctly defined widget works fine
         */
        testMarkup : function () {
            // tag name should be ignored
            var cfg = {
                attributes : {
                    name : "division",
                    classList : ["a", "b"]
                }
            };

            var widget = new aria.html.TextArea(cfg, {
                tplClasspath : "TextArea"
            });

            var out = this.createMockMarkupWriter();

            widget.writeMarkup(out);

            var markup = out.getMarkup();
            var expected = "<textarea id='w0'  name=\"division\" class=\"a b\" atdelegate='d0' ></textarea>";

            this.assertEquals(expected, markup, "Expected: " + expected + " but was: " + markup);

            widget.$dispose();
        }
    }
});

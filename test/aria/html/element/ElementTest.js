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
    $classpath : "test.aria.html.element.ElementTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.Element"],
    $prototype : {
        /**
         * Make sure that errors are logged and using the widget doesn't break anything
         */
        testValidationError : function () {
            var cfg = {
                something : "here"
            };

            var widget = new aria.html.Element(cfg, {
                tplClasspath : "Element"
            });

            this.assertErrorInLogs(aria.core.JsonValidator.MISSING_MANDATORY);

            var out = this.createMockMarkupWriter();
            widget.writeMarkupBegin(out);
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
            var cfg = {
                tagName : "div",
                attributes : {
                    name : "division",
                    classList : ["a", "b"]
                }
            };

            var widget = new aria.html.Element(cfg, {
                tplClasspath : "Element"
            });

            this.assertTrue(widget._id.match(/w\d+/) !== null, "The id is not the id expected");
            widget.$dispose();

            cfg.id = 'x';

            widget = new aria.html.Element(cfg, {
                tplClasspath : "Element",
                $getId : function (id) {
                    return "tpl0_" + id;
                }
            });

            this.assertEquals(widget._id, "tpl0_x", "The id is not the id expected");
            widget.$dispose();

            delete cfg.id;

            widget = new aria.html.Element(cfg, {
                tplClasspath : "Element"
            });

            widget._id = "x";

            // These two functions are called if the widget is used as a container
            this.checkMarkupBegin(widget);
            this.checkMarkupEnd(widget);

            // This one when we use it a closing tag
            this.checkMarkup(widget);

            widget.$dispose();
        },

        /**
         * Markup begin
         */
        checkMarkupBegin : function (widget) {
            var out = this.createMockMarkupWriter();

            widget.writeMarkupBegin(out);

            var markup = out.getMarkup();
            this.assertEquals("<div id='x'  name=\"division\" class=\"a b\" >", markup, "Markup Begin: <xmp>" + markup
                    + "</xmp>");
        },

        /**
         * Markup end
         */
        checkMarkupEnd : function (widget) {
            var out = this.createMockMarkupWriter();

            widget.writeMarkupEnd(out);

            var markup = out.getMarkup();
            this.assertEquals("</div>", markup, "Markup End: <xmp>" + markup + "</xmp>");
        },

        /**
         * Markup (self closing widget)
         */
        checkMarkup : function (widget) {
            var out = this.createMockMarkupWriter();

            widget.writeMarkup(out);

            var markup = out.getMarkup();
            this.assertEquals("<div id='x'  name=\"division\" class=\"a b\" />", markup, "Markup: <xmp>" + markup
                    + "</xmp>");
        },

        mockEvalCallback : function (transform, retVal) {
            return transform(retVal);
        },

        /**
         * This test check that validation doesn't complain when we use values that are not stricly defined in the bean
         */
        testValidationExtended : function () {
            var container = {};

            var cfg = {
                tagName : "div",
                attributes : {
                    name : "division",
                    classList : ["a", "b"]
                },
                bind : {
                    "apple" : {
                        inside : container,
                        to : "apple",
                        transform : Aria.empty
                    }
                },
                on : {
                    "pear" : {
                        fn : Aria.empty,
                        scope : this
                    }
                }
            };

            var widget = new aria.html.Element(cfg, {
                tplClasspath : "Element",
                evalCallback : this.mockEvalCallback
            });

            this.assertLogsEmpty();

            widget.$dispose();
        },

        /**
         * This test check that validation complains when we use wrong values inside properties that are not stricly
         * defined in the bean
         */
        testValidationExtendedWrong : function () {
            var container = {};

            var cfg = {
                tagName : "div",
                attributes : {
                    name : "division",
                    classList : ["a", "b"]
                },
                bind : {
                    "apple" : {
                        color : "yellow"
                    }
                },
                on : {
                    "pear" : 3
                }
            };

            var widget = new aria.html.Element(cfg, {
                tplClasspath : "Element"
            });

            this.assertErrorInLogs(aria.widgetLibs.BindableWidget.INVALID_BEAN);

            widget.$dispose();
        }
    }
});
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
    $classpath : "test.aria.templates.SectionOnTypeTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.Section", "aria.utils.FireDomEvent", "aria.html.TextInput"],
    $prototype : {
        tplCtxt : {
            $getId : function () {},
            _mouseOverWithoutScope : false
        },
        setUp : function () {
            this._mouseClickWithScope = false;
            this._checkForParams = null;
            var document = Aria.$window.document;
            var testArea = document.createElement("div");
            testArea.id = "testForSectionEvents";

            document.getElementById("TESTAREA").appendChild(testArea);
            this._typeEventTestArea = testArea;
        },

        tearDown : function () {
            this._typeEventTestArea.parentNode.removeChild(this._typeEventTestArea);
        },

        _mouseclick : function (a, b, c) {
            this._mouseClickWithScope = true;
            this._checkForParams = b.param;
        },
        _mouseover : function (a, b, c) {
            this.tplCtxt._mouseOverWithoutScope = true;
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

        testAsyncOnType : function () {
            var cfg = {
                id : "mySection",
                type : "DIV",
                on : {
                    click : {
                        fn : this._mouseclick,
                        args : {
                            param : "12"
                        },
                        scope : this
                    },
                    mouseover : this._mouseover
                }
            };

            var out = this.createMockMarkupWriter();
            var widget = new aria.templates.Section(this.tplCtxt, cfg);
            widget.writeBegin(out);

            this._typeEventTestArea.innerHTML = out.getMarkup();

            aria.utils.FireDomEvent.fireEvent("click", this._typeEventTestArea.firstChild);
            aria.utils.FireDomEvent.fireEvent("mouseover", this._typeEventTestArea.firstChild);

            aria.core.Timer.addCallback({
                fn : function () {
                    try {
                        this.assertTrue(this._mouseClickWithScope, "mouseclick failed!");
                        this.assertTrue(this._checkForParams == "12", "Failed to get the param value, Expected: 12, Found :"
                                + this._checkForParams);
                        this.assertTrue(this.tplCtxt._mouseOverWithoutScope, "mouseover failed!");
                        widget.$dispose();
                    } catch (ex) {}

                    this.notifyTestEnd("testAsyncOnType");
                },
                scope : this,
                delay : 1000
            });
        }

    }
});

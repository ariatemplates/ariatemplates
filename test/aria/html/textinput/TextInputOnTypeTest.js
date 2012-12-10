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
    $classpath : "test.aria.html.textinput.TextInputOnTypeTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.TextInput", "aria.utils.FireDomEvent"],
    $prototype : {
        setUp : function () {
            this._didAnyoneCallKeyDown = false;
            this._didAnyoneCallType = false;

            var document = Aria.$window.document;
            var testArea = document.createElement("div");
            testArea.id = "testForTextInputEvents";

            document.body.appendChild(testArea);
            this._typeEventTestArea = testArea;
        },

        tearDown : function () {
            this._typeEventTestArea.parentNode.removeChild(this._typeEventTestArea);
        },

        _keydown : function () {
            this._didAnyoneCallKeyDown = true;
        },

        _type : function () {
            this._didAnyoneCallType = true;
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
            }
        },

        testAsyncOnTypeWithKeyDown : function () {
            var cfg = {
                on : {
                    keydown : {
                        fn : this._keydown,
                        scope : this
                    },
                    type : {
                        fn : this._type,
                        scope : this
                    }
                }
            };

            var out = this.createMockMarkupWriter();
            var widget = new aria.html.TextInput(cfg, {
                tplClasspath : "TextInput"
            });
            widget.writeMarkup(out);

            this._typeEventTestArea.innerHTML = out.getMarkup();
            widget.initWidget();

            aria.utils.FireDomEvent.fireEvent("keydown", widget._domElt);

            aria.core.Timer.addCallback({
                fn : function () {
                    try {
                        this.assertTrue(this._didAnyoneCallKeyDown, "_keydown wasn't called");
                        this.assertTrue(this._didAnyoneCallType, "_type wasn't called");

                        widget.$dispose();
                    } catch (ex) {}

                    this.notifyTestEnd("testAsyncOnTypeWithKeyDown");
                },
                scope : this,
                delay : 100
            });
        },

        testAsyncOnTypeWhileRefresh : function () {
            // The difference is that disposed in the keydown callback

            var cfg = {
                on : {
                    keydown : {
                        fn : function () {
                            this._keydown(),
                            // this should emulate a refresh
                            widget.$dispose();
                        },
                        scope : this
                    },
                    type : {
                        fn : this._type,
                        scope : this
                    }
                }
            };

            var out = this.createMockMarkupWriter();
            var widget = new aria.html.TextInput(cfg, {
                tplClasspath : "TextInput"
            });
            widget.writeMarkup(out);

            this._typeEventTestArea.innerHTML = out.getMarkup();
            widget.initWidget();

            aria.utils.FireDomEvent.fireEvent("keydown", widget._domElt);

            aria.core.Timer.addCallback({
                fn : function () {
                    try {
                        this.assertTrue(this._didAnyoneCallKeyDown, "_keydown wasn't called");
                        this.assertFalse(this._didAnyoneCallType, "_type was called");
                    } catch (ex) {}

                    this.notifyTestEnd("testAsyncOnTypeWhileRefresh");
                },
                scope : this,
                delay : 100
            });
        }
    }
});
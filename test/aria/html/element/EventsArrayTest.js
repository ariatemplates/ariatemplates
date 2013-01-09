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
    $classpath : "test.aria.html.element.EventsArrayTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.html.Element", "aria.utils.FireDomEvent", "aria.core.Sequencer", "aria.utils.Array",
            "aria.utils.Dom"],
    $prototype : {
        testAsyncOnStatement : function () {
            this._eventsFired = [];

            var widgetOne = this.createFirstWidget();
            var widgetTwo = this.createSecondWidget();

            var targets = this.putInDom(widgetOne, widgetTwo);

            // Give it a bit of delay just in case
            var fireEvents = this.generateSequencer(targets);
            fireEvents.$on({
                "end" : {
                    fn : function () {
                        aria.core.Timer.addCallback({
                            fn : this.checkAssertions,
                            scope : this,
                            delay : 12
                        });
                    },
                    scope : this
                }
            });

            this._stuffToBeDisposedLater = [widgetOne, widgetTwo, fireEvents];

            fireEvents.start();
        },

        checkAssertions : function () {
            try {
                var events = this._eventsFired;

                this.assertEquals(events.length, 6, "Not all events have been raised, only " + events.length);

                var oneEvent = events[0];
                this.assertEquals(oneEvent.type, "mousedown", "First event should be a mousedown, got " + oneEvent.type);
                this.assertEquals(oneEvent.context, "kanto", "First event should have context kanto, got "
                        + oneEvent.context);
                this.assertEquals(oneEvent.tagName, "DIV", "First event should happen on a DIV, got "
                        + oneEvent.tagName);
                this.assertEquals(oneEvent.key, "tokyo-mousedown", "First callback should set key tokyo-mousedown, got "
                        + oneEvent.key);
                this.assertEquals(oneEvent.param, "honshu", "First param should be honsu, got " + oneEvent.param);
                this.assertTrue(oneEvent.isTargetWrapped, "First target should be wrapped");
                this.assertEquals(oneEvent.name, "tokyo", "First target name should be tokyo, got" + oneEvent.name);

                oneEvent = events[1];
                this.assertEquals(oneEvent.type, "mousedown", "First event should be a mousedown, got " + oneEvent.type);
                this.assertEquals(oneEvent.context, "kanto", "First event should have context kanto, got "
                        + oneEvent.context);
                this.assertEquals(oneEvent.tagName, "DIV", "First event should happen on a DIV, got "
                        + oneEvent.tagName);
                this.assertEquals(oneEvent.key, "tokyo-mousedown", "First callback should set key tokyo-mousedown, got "
                        + oneEvent.key);
                this.assertEquals(oneEvent.param, "honshu second", "First param should be honsu, got " + oneEvent.param);
                this.assertTrue(oneEvent.isTargetWrapped, "First target should be wrapped");
                this.assertEquals(oneEvent.name, "tokyo", "First target name should be tokyo, got" + oneEvent.name);

                oneEvent = events[2];
                this.assertEquals(oneEvent.type, "keydown", "Second event should be a keydown, got " + oneEvent.type);
                this.assertEquals(oneEvent.context, "TplContext", "Second event should have context Element, got "
                        + oneEvent.context);
                this.assertEquals(oneEvent.tagName, "DIV", "Second event should happen on a DIV, got "
                        + oneEvent.tagName);
                this.assertEquals(oneEvent.key, "tokyo-keydown", "Second callback should set key tokyo-keydown, got "
                        + oneEvent.key);
                this.assertEquals(oneEvent.param, "missing", "Second param should be missing, got " + oneEvent.param);
                this.assertTrue(oneEvent.isTargetWrapped, "Second target should be wrapped");
                this.assertEquals(oneEvent.name, "tokyo", "Second target name should be tokyo, got" + oneEvent.name);

                oneEvent = events[3];
                this.assertEquals(oneEvent.type, "mousedown", "Third event should be a mousedown, got " + oneEvent.type);
                this.assertEquals(oneEvent.context, "TplContext", "Third event should have context Element, got "
                        + oneEvent.context);
                this.assertEquals(oneEvent.tagName, "SPAN", "Third event should happen on a SPAN, got "
                        + oneEvent.tagName);
                this.assertEquals(oneEvent.key, "osaka-mousedown", "Third callback should set key osaka-mousedown, got "
                        + oneEvent.key);
                this.assertEquals(oneEvent.param, "missing", "Third param should be missing, got " + oneEvent.param);
                this.assertTrue(oneEvent.isTargetWrapped, "Third target should be wrapped");
                this.assertEquals(oneEvent.name, "osaka", "Third target name should be osaka, got" + oneEvent.name);

                oneEvent = events[4];
                this.assertEquals(oneEvent.type, "mousedown", "Third event should be a mousedown, got " + oneEvent.type);
                this.assertEquals(oneEvent.context, "TplContext", "Third event should have context Element, got "
                        + oneEvent.context);
                this.assertEquals(oneEvent.tagName, "SPAN", "Third event should happen on a SPAN, got "
                        + oneEvent.tagName);
                this.assertEquals(oneEvent.key, "osaka-mousedown", "Third callback should set key osaka-mousedown, got "
                        + oneEvent.key);
                this.assertEquals(oneEvent.param, "missing", "Third param should be missing, got " + oneEvent.param);
                this.assertTrue(oneEvent.isTargetWrapped, "Third target should be wrapped");
                this.assertEquals(oneEvent.name, "osaka", "Third target name should be osaka, got" + oneEvent.name);

                oneEvent = events[5];
                this.assertEquals(oneEvent.type, "keydown", "Fourth event should be a keydown, got " + oneEvent.type);
                this.assertEquals(oneEvent.context, "kansai", "Fourth event should have context kansai, got "
                        + oneEvent.context);
                this.assertEquals(oneEvent.tagName, "SPAN", "Fourth event should happen on a SPAN, got "
                        + oneEvent.tagName);
                this.assertEquals(oneEvent.key, "osaka-keydown", "Fourth callback should set key osaka-keydown, got "
                        + oneEvent.key);
                this.assertEquals(oneEvent.param, "honshu", "Fourth param should be honsu, got " + oneEvent.param);
                this.assertTrue(oneEvent.isTargetWrapped, "Fourth target should be wrapped");
                this.assertEquals(oneEvent.name, "osaka", "Fourth target name should be osaka, got" + oneEvent.name);

                aria.utils.Array.forEach(this._stuffToBeDisposedLater, function (object) {
                    object.$dispose();
                });

                this._stuffToBeDisposedLater = null;
            } catch (ex) {}

            var testArea = aria.utils.Dom.getElementById("testForWidgetEvents");
            testArea.parentNode.removeChild(testArea);

            this.notifyTestEnd("testAsyncOnStatement");
        },

        createFirstWidget : function () {
            var events = this._eventsFired;

            var first = {
                tagName : "div",
                attributes : {
                    name : "tokyo"
                },
                on : {
                    mousedown : [{
                                fn : function (evt, args) {
                                    events.push({
                                        type : evt.type,
                                        context : this.context,
                                        tagName : evt.target.tagName,
                                        key : "tokyo-mousedown",
                                        param : args.param,
                                        isTargetWrapped : !!evt.target.$DomElementWrapper,
                                        name : evt.target.getAttribute("name")
                                    });
                                },
                                scope : {
                                    context : "kanto"
                                },
                                args : {
                                    param : "honshu"
                                }
                            }, {
                                fn : function (evt, args) {
                                    events.push({
                                        type : evt.type,
                                        context : this.context,
                                        tagName : evt.target.tagName,
                                        key : "tokyo-mousedown",
                                        param : args.param,
                                        isTargetWrapped : !!evt.target.$DomElementWrapper,
                                        name : evt.target.getAttribute("name")
                                    });
                                },
                                scope : {
                                    context : "kanto"
                                },
                                args : {
                                    param : "honshu second"
                                }
                            }],
                    keydown : [function (evt) {
                                events.push({
                                    type : evt.type,
                                    context : this.context,
                                    tagName : evt.target.tagName,
                                    key : "tokyo-keydown",
                                    param : "missing",
                                    isTargetWrapped : !!evt.target.$DomElementWrapper,
                                    name : evt.target.getAttribute("name")
                                });
                            }]
                }
            };

            return new aria.html.Element(first, {
                tplClasspath : "Element",
                _tpl : {
                    context : "TplContext"
                }
            });
        },

        createSecondWidget : function () {
            var events = this._eventsFired;

            var second = {
                tagName : "span",
                attributes : {
                    name : "osaka"
                },
                on : {
                    mousedown : [{
                                fn : "functionOnTemplateContext"
                            }, {
                                fn : "functionOnTemplateContext"
                            }],
                    keydown : [{
                                fn : "functionOnScopeObject",
                                scope : {
                                    context : "kansai",
                                    functionOnScopeObject : function (evt, args) {
                                        events.push({
                                            type : evt.type,
                                            context : this.context,
                                            tagName : evt.target.tagName,
                                            key : "osaka-keydown",
                                            param : args.param,
                                            isTargetWrapped : !!evt.target.$DomElementWrapper,
                                            name : evt.target.getAttribute("name")
                                        });
                                        return false;
                                    }
                                },
                                args : {
                                    param : "honshu"
                                }
                            }, {
                                fn : "functionOnScopeObject",
                                scope : {
                                    context : "kansai",
                                    functionOnScopeObject : function (evt, args) {
                                        events.push({
                                            type : evt.type,
                                            context : this.context,
                                            tagName : evt.target.tagName,
                                            key : "osaka-keydown",
                                            param : args.param,
                                            isTargetWrapped : !!evt.target.$DomElementWrapper,
                                            name : evt.target.getAttribute("name")
                                        });
                                    }
                                },
                                args : {
                                    param : "honshu"
                                }
                            }]
                }
            };

            return new aria.html.Element(second, {
                tplClasspath : "Element",
                _tpl : {
                    functionOnTemplateContext : function (evt) {
                        events.push({
                            type : evt.type,
                            context : this.context,
                            tagName : evt.target.tagName,
                            key : "osaka-mousedown",
                            param : "missing",
                            isTargetWrapped : !!evt.target.$DomElementWrapper,
                            name : evt.target.getAttribute("name")
                        });
                    },
                    context : "TplContext"
                }
            });
        },

        putInDom : function (/* arguments */) {
            var out = this.createMockMarkupWriter();

            for (var i = 0, len = arguments.length; i < len; i += 1) {
                var widget = arguments[i];

                widget.writeMarkupBegin(out);
                out.write("&nbsp;");
                widget.writeMarkupEnd(out);
            }

            var document = Aria.$window.document;
            var testArea = document.createElement("div");
            testArea.id = "testForWidgetEvents";

            document.body.appendChild(testArea);

            testArea.innerHTML = out.getMarkup();

            return testArea.childNodes;
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

        generateSequencer : function (targets) {
            var sequencer = new aria.core.Sequencer();
            sequencer.addTask({
                name : "tokyo-mousedown",
                scope : this,
                asynchronous : true,
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : function () {
                            aria.utils.FireDomEvent.fireEvent("mousedown", targets[0]);

                            sequencer.notifyTaskEnd(0);
                        },
                        scope : this,
                        delay : 12
                    });
                }
            });
            sequencer.addTask({
                name : "tokyo-keydown",
                scope : this,
                asynchronous : true,
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : function () {
                            aria.utils.FireDomEvent.fireEvent("keydown", targets[0]);

                            sequencer.notifyTaskEnd(1);
                        },
                        scope : this,
                        delay : 12
                    });
                }
            });

            // fire also events that don't have a callback
            sequencer.addTask({
                name : "tokyo-click",
                scope : this,
                asynchronous : true,
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : function () {
                            aria.utils.FireDomEvent.fireEvent("click", targets[0]);

                            sequencer.notifyTaskEnd(2);
                        },
                        scope : this,
                        delay : 12
                    });
                }
            });

            sequencer.addTask({
                name : "osaka-mousedown",
                scope : this,
                asynchronous : true,
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : function () {
                            aria.utils.FireDomEvent.fireEvent("mousedown", targets[1]);

                            sequencer.notifyTaskEnd(3);
                        },
                        scope : this,
                        delay : 12
                    });
                }
            });
            sequencer.addTask({
                name : "osaka-keydown",
                scope : this,
                asynchronous : true,
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : function () {
                            aria.utils.FireDomEvent.fireEvent("keydown", targets[1]);

                            sequencer.notifyTaskEnd(4);
                        },
                        scope : this,
                        delay : 12
                    });
                }
            });

            return sequencer;
        }
    }
});
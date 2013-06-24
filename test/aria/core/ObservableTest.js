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

/**
 * Test case for the event properties of JsObject
 */
Aria.classDefinition({
    $classpath : "test.aria.core.ObservableTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.core.test.ClassA"],

    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.oo = null; // internal observable object used to test the base class
        this.startCount = 0;
        this.endCount = 0;
        this.countChangeCount = 0;
    },
    $prototype : {
        setUp : function () {
            this.oo = new test.aria.core.test.ClassA();
            this.startCount = 0;
            this.endCount = 0;
            this.countChangeCount = 0;
        },
        tearDown : function () {
            if (this.oo) {
                this.oo.$dispose();
                delete this.oo;
            }
        },
        /**
         * Test listener syntax 1
         */
        testListener1 : function () {
            // register as listener
            var o = this.oo;
            o.$on({
                'start' : {
                    fn : this.onStart,
                    scope : this
                },
                'end' : {
                    fn : this.onEnd,
                    args : {
                        description : "Sample Callback Argument"
                    }
                },
                'countChange' : this.onCountChange,
                scope : this
            });

            // internal map validation
            this.assertTrue(o._listeners["start"][0].fn == this.onStart);
            this.assertTrue(o._listeners["countChange"][0].scope == this);

            // test start and end events
            o.start();
            this.assertTrue(this.startCount === 1);
            this.assertTrue(this.endCount === 1);
            this.assertTrue(this.countChangeCount === 0);

            o.incrementCount(10);
            this.assertTrue(this.countChangeCount === 1);
        },
        /**
         * Test '*' listenere synatax and multiple listeners
         */
        testListener2 : function () {
            // register as listener: note we are registered twice
            var o = this.oo;
            o.$on({
                '*' : this.onEvent,
                'start' : this.onStart,
                scope : this
            });

            o.start();
            this.assertTrue(this.startCount === 2); // because we registered twice
            this.assertTrue(this.endCount === 0); // because onEvent is called instead of onStart
            this.assertTrue(this.countChangeCount === 0);

            o.incrementCount(5);
            this.assertTrue(this.countChangeCount === 1);

        },

        /**
         * Test error dispatch if invalid event is used
         */
        testInvalidEvents : function () {
            var o = this.oo;
            // registering a listener on an undeclared event:
            o.$on({
                'nonexistent' : {
                    fn : this.onEvent,
                    scope : this
                }
            });
            this.assertErrorInLogs(aria.core.JsObject.UNDECLARED_EVENT);

            // The following line is here to enable the check of the name of the event
            // when calling $raiseEvent (when there is no event listener, $raiseEvent does nothing,
            // even the check of the name of the event, to run faster)
            o.$on({
                '*' : {
                    fn : this.onEvent,
                    scope : this
                }
            });

            // raising an undeclared event:
            o.$raiseEvent('nonexistent');
            this.assertErrorInLogs(aria.core.JsObject.UNDECLARED_EVENT);
        },

        /**
         * Test removeListener with arg list
         */
        testRemoveListener1 : function () {
            var o = this.oo;
            o.$on({
                'start' : {
                    fn : this.onStart,
                    scope : this
                },
                'end' : {
                    fn : this.onEnd,
                    args : {
                        description : "Sample Callback Argument"
                    }
                },
                'countChange' : {
                    fn : this.onCountChange
                },
                scope : this
            });
            o.$on({
                'start' : this.onStart2,
                scope : this
            });

            this.assertTrue(o._listeners["start"][0].fn == this.onStart);
            this.assertTrue(o._listeners["countChange"][0].scope == this);

            o.$removeListeners({
                'start' : this.onStart2,
                scope : this
            });

            this.assertTrue(o._listeners["start"] != null);
            this.assertTrue(o._listeners["end"][0].scope == this);
            this.assertTrue(o._listeners["countChange"][0].scope == this);

            o.$removeListeners({
                'start' : {
                    scope : this
                }
            });
            this.assertTrue(o._listeners["start"] == null);

            o.$removeListeners({
                'end' : {
                    fn : this.onEnd
                },
                scope : this
            });
            this.assertTrue(o._listeners["end"] == null);
            this.assertTrue(o._listeners["countChange"][0].scope == this);

            o.$removeListeners({
                '*' : {
                    scope : this
                }
            });
            this.assertTrue(o._listeners["start"] == null);
            this.assertTrue(o._listeners["end"] == null);
            this.assertTrue(o._listeners["countChange"][0].scope == this);

            o.$unregisterListeners(this);
            this.assertTrue(o._listeners["start"] == null);
            this.assertTrue(o._listeners["end"] == null);
            this.assertTrue(o._listeners["countChange"] == null);
            this.assertTrue(o._listeners["*"] == null);
        },

        /**
         * Test removeListener with '*' syntax
         */
        testRemoveListener2 : function () {
            var o = this.oo;
            o.$on({
                '*' : this.onEvent,
                'start' : {
                    fn : this.onStart,
                    scope : o
                }, // for test purpose !
                scope : this
            });

            this.assertTrue(o._listeners["*"][0].scope == this);
            this.assertTrue(o._listeners["start"] != null);
            o.$unregisterListeners();
            this.assertTrue(o._listeners["*"] == null);
            this.assertTrue(o._listeners["start"] == null);
        },

        /**
         * Listener methods used to track test events
         */
        onStart : function (evt, cbArgs) {
            this.startCount++;

            this.assertTrue(evt.src == this.oo);
            this.assertTrue(evt.name == 'start');
            this.assertTrue(cbArgs == null);
        },
        onStart2 : function (evt) {
            // not called in this test
        },
        onEnd : function (evt, cbArgs) {
            this.endCount++;

            this.assertTrue(evt.name == 'end');
            // object arg
            this.assertTrue(cbArgs.description == "Sample Callback Argument", "onEnd arg validation");
        },
        onCountChange : function (evt, cbArgs) {
            this.countChangeCount++;
            this.assertTrue(evt.name == 'countChange');
            // test event args
            this.assertTrue(evt.oldCountValue === 0, "event args test 1");
            this.assertTrue(evt.newCountValue === 10, "event args test 2");
        },
        onEvent : function (evt, cbArgs) {
            this.assertTrue(evt.src == this.oo);
            if (evt.name == 'start') {
                this.startCount++;
            } else if (evt.name == 'countChange') {
                this.countChangeCount++;
                this.assertTrue(evt.oldCountValue === 0, "event args test 3");
                this.assertTrue(evt.newCountValue === 5, "event args test 4");
            } else {
                this.assertTrue(evt.name != 'nonexistent');
            }
        },

        /**
         * This method tests that unregistering a listener is possible even during the process of calling listeners (and
         * is taken into account immediately) and that calling dispose on an object in one of its event listeners is
         * handled correctly as well.
         */
        testDisposeInEventListener : function () {
            var oo = this.oo;
            this._callOnEventDisposeCount = 0;
            // add listeners twice
            oo.$on({
                '*' : this._onEventDispose,
                'start' : this._onEventDispose,
                scope : this
            });
            oo.$on({
                '*' : this._onEventDispose,
                'start' : this._onEventDispose,
                scope : this
            });
            this._disposeOO = false;
            oo.start();
            // check that without unregistering listeners, the listener is called 4 times:
            this.assertTrue(this._callOnEventDisposeCount == 4);
            this._callOnEventDisposeCount = 0;
            this._disposeOO = true;
            oo.start();
            // the listener is called once, then it unregisters itself and is no longer called:
            this.assertTrue(this._callOnEventDisposeCount == 1);
        },

        /**
         * Event listener which disposes this.oo if this._disposeOO is true.
         * @param {Object} evt
         */
        _onEventDispose : function (evt) {
            if (evt.name != "start") {
                return;
            }
            try {
                this._callOnEventDisposeCount++;
                if (this.oo && this._disposeOO) {
                    this.oo.$unregisterListeners(this);
                    this.oo.$dispose();
                    this.oo = null;
                }
            } catch (e) {
                this.handleAsyncTestError(e);
            }

        }
    }
});

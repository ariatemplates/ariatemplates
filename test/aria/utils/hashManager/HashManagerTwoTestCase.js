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
 * Test case for aria.utils.HashManager. In particular, it tests that the listeners of the hashChange event are called
 * after a DomOverlay is displayed
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.hashManager.HashManagerTestTwo",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.DomOverlay"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.__callbackCalled = false;
        this._hcCB = {
            fn : this._onHashChange,
            scope : this
        };
    },
    $destructor : function () {
        this.hm = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {
        setUp : function () {
            var window = Aria.$window;
            this.__initialHash = window.location.hash;
            window.location.hash = "init";
        },

        tearDown : function () {
            var window = Aria.$window;
            window.location.hash = this.__initialHash;
        },

        testAsyncStart : function () {
            Aria.load({
                classes : ["aria.utils.HashManager"],
                oncomplete : {
                    fn : this._testCallbackCalled,
                    scope : this
                }
            });
        },

        _testCallbackCalled : function () {
            this.hm = aria.utils.HashManager;
            this.hm.addCallback(this._hcCB);
            aria.utils.DomOverlay.create(Aria.$window.document.body);
            aria.utils.DomOverlay.detachFrom(Aria.$window.document.body);

            this.hm.setHash("somethingDifferent");
            aria.core.Timer.addCallback({
                fn : this._afterHashChange,
                scope : this,
                delay : 2 * this.hm.ie7PollDelay
            });
        },

        _afterHashChange : function () {
            this.assertEquals(this.__callbackCalled, true, "hashchange listener has not been called.");

            this.notifyTestEnd("testAsyncInitial");
        },

        _onHashChange : function (hashObject) {
            this.__callbackCalled = true;
        }

    }
});

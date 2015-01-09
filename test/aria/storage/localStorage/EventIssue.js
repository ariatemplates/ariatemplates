/*
 * Copyright 2014 Amadeus s.a.s.
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
 * This test makes sure storage events do not cause errors when the stored values are not JSON, or when events are not
 * listened to.
 */
Aria.classDefinition({
    $classpath : "test.aria.storage.localStorage.EventIssue",
    $dependencies : ["aria.storage.LocalStorage"],
    $extends : "test.aria.storage.base.BaseTests",
    $prototype : {
        storageLocation : "localStorage",

        EVENT_DELAY : 500,

        setUp : function () {
            var localStorageProto = aria.storage.LocalStorage.prototype;
            this._browserEventOriginal = localStorageProto._browserEvent;
            var self = this;
            self._browserEventCalled = 0;
            localStorageProto._browserEvent = function () {
                self._browserEventCalled++;
                return self._browserEventOriginal.apply(this, arguments);
            };
            this.$BaseTests.setUp.call(this);
        },

        tearDown : function () {
            this.$BaseTests.tearDown.call(this);
            aria.storage.LocalStorage.prototype._browserEvent = this._browserEventOriginal;
        },

        testAsyncUselessEvent : function () {
            var localStorage = Aria.$window.localStorage;
            if (!localStorage) {
                this.notifyTestEnd();
                return;
            }
            var self = this;
            setTimeout(function () {
                var storage = new aria.storage.LocalStorage();

                self.setLocalStorageItem("testAsyncUselessEvent", "{}", function () {
                    self.assertEquals(self._browserEventCalled, 0);
                    storage.$dispose();
                    self.notifyTestEnd();
                });
            }, self.EVENT_DELAY);
        },

        testAsyncUsefulEvent : function () {
            var localStorage = Aria.$window.localStorage;
            if (!localStorage) {
                this.notifyTestEnd();
                return;
            }

            var self = this;
            setTimeout(function () {
                var storage = new aria.storage.LocalStorage();
                var changeEventCalled = 0;

                storage.$on({
                    "change" : function () {
                        changeEventCalled++;
                    },
                    scope : self
                });

                self.setLocalStorageItem("testAsyncUsefulEvent", "{}", function () {
                    self.assertEquals(self._browserEventCalled, 1);
                    self.assertEquals(changeEventCalled, 1);
                    storage.$dispose();
                    self.notifyTestEnd();
                });
            }, self.EVENT_DELAY);
        },

        testAsyncJsonErrorInStorageEvent : function () {
            var localStorage = Aria.$window.localStorage;
            if (!localStorage) {
                this.notifyTestEnd();
                return;
            }
            localStorage.setItem("testAsyncJsonErrorInStorageEvent", "this/is-NOT*a.JSON-Object");

            var self = this;
            setTimeout(function () {
                var storage = new aria.storage.LocalStorage();
                var changeEventCalled = 0;

                storage.$on({
                    "change" : function (event) {
                        changeEventCalled++;
                        self.assertEquals(event.key, "testAsyncJsonErrorInStorageEvent");
                        self.assertEquals(event.oldValue, "this/is-NOT*a.JSON-Object");
                        self.assertJsonEquals(event.newValue, {});
                    },
                    scope : self
                });

                self.setLocalStorageItem("testAsyncJsonErrorInStorageEvent", "{}", function () {
                    self.assertEquals(self._browserEventCalled, 1);
                    self.assertEquals(changeEventCalled, 1);
                    storage.$dispose();
                    self.notifyTestEnd();
                });
            }, self.EVENT_DELAY);
        },

        setLocalStorageItem : function (item, value, cb) {
            var iframe;
            var self = this;

            function step0 () {
                var document = Aria.$window.document;
                iframe = document.createElement("iframe");
                document.body.appendChild(iframe);
                setTimeout(step1, 10);
            }

            function step1 () {
                var window = iframe.contentWindow;
                window.localStorage.setItem(item, value);
                setTimeout(step2, self.EVENT_DELAY);
            }

            function step2 () {
                iframe.parentNode.removeChild(iframe);
                cb();
            }

            step0();
        }

    }
});
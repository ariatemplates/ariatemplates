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
    $classpath : "test.aria.storage.base.BaseTests",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.Browser"],
    $prototype : {
        setUp : function () {
            if (Aria.$window[this.storageLocation]) {
                Aria.$window[this.storageLocation].clear();
            }

            this.clearUserData();
        },

        tearDown : function () {
            if (Aria.$window[this.storageLocation]) {
                Aria.$window[this.storageLocation].clear();
            }

            this.clearUserData();
        },

        /**
         * Whether or not this browser can run HTML 5 Storage tests
         * @param {Boolean} fail Should the test fail if the storage is missing
         * @return {Boolean}
         */
        canRunHTML5Tests : function (fail) {
            var storageName = this.storageLocation.substring(0, 1).toUpperCase() + this.storageLocation.substring(1);
            if (!Aria.$window[this.storageLocation] && fail !== false) {
                try {
                    // this line should give an error
                    new aria.storage[storageName]();

                    this.fail("Constructor should fail if " + this.storageLocation
                            + " is not available on window object");
                } catch (ex) {
                    this.assertErrorInLogs(aria.storage.HTML5Storage.UNAVAILABLE);
                }

                // No need to run other tests if the storage is not available
                return false;
            }

            this.storageClass = aria.storage[storageName];

            return true;
        },

        /**
         * Whether or not this browser can run User Data tests
         * @return {Boolean}
         */
        canRunUserDataTests : function () {
            if (aria.core.Browser.isOldIE) {
                this.storageClass = aria.storage.UserData;

                return true;
            }

            return false;
        },

        /**
         * Clean user data storage
         */
        clearUserData : function () {
            if (aria.core.Browser.isOldIE && aria.storage && aria.storage.UserData) {
                var cleaner = new aria.storage.UserData();
                cleaner.clear();
                cleaner.$dispose();
            }
        },

        /**
         * Check that a storage event correspond to the expected value
         * @param {Object} expected Expected event
         * @param {Object} got Received event
         * @param {String} where Meaningful information to understand what assert fails
         */
        checkEventArguments : function (expected, got, where) {
            this.assertEquals(expected.key, got.key, "key in " + where + " expecting " + expected.key + " got "
                    + got.key);
            this.assertEquals(expected.oldValue, got.oldValue, "oldValue in " + where + " expecting "
                    + expected.oldValue + " got " + got.oldValue);
            this.assertEquals(expected.newValue, got.newValue, "newValue in " + where + " expecting "
                    + expected.newValue + " got " + got.newValue);
            this.assertEquals(expected.url, got.url, "url in " + where + " expecting " + expected.url + " got "
                    + got.url);
        }
    }
});

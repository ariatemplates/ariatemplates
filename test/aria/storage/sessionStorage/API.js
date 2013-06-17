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
    $classpath : "test.aria.storage.sessionStorage.API",
    $dependencies : ["aria.storage.SessionStorage"],
    $extends : "test.aria.storage.base.GeneralAPI",
    $constructor : function () {
        this.storageLocation = "sessionStorage";

        this.$GeneralAPI.constructor.call(this);
    },
    $prototype : {
        /**
         * Test how the API work on a single instance
         */
        testOneInstanceStrings : function () {
            if (this.canRunHTML5Tests()) {
                this.$GeneralAPI.testOneInstanceStrings.call(this);
            }
        },

        /**
         * Test the API when using two different storage instances
         */
        testTwoInstancesStrings : function () {
            if (this.canRunHTML5Tests()) {
                this.$GeneralAPI.testTwoInstancesStrings.call(this);
            }
        }
    }
});

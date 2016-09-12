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
    $classpath : "test.aria.storage.localStorage.Events",
    $dependencies : ["aria.storage.LocalStorage"],
    $extends : "test.aria.storage.base.GeneralEvents",
    $constructor : function () {
        this.storageLocation = "localStorage";

        this.$GeneralEvents.constructor.call(this);
    },
    $prototype : {
        testEvents : function () {
            if (this.canRunHTML5Tests(false) || this.canRunUserDataTests()) {
                this.$GeneralEvents.testEvents.call(this);
            }
        },

        testSerializedEvent : function () {
            if (this.canRunHTML5Tests(false) || this.canRunUserDataTests()) {
                this.$GeneralEvents.testSerializedEvent.call(this);
            }
        }
    }
});

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
    $classpath : "test.aria.storage.sessionStorage.Serialize",
    $dependencies : ["aria.storage.SessionStorage"],
    $extends : "test.aria.storage.base.GeneralSerialize",
    $constructor : function () {
        this.storageLocation = "sessionStorage";

        this.$GeneralSerialize.constructor.call(this);
    },
    $prototype : {
        testDefaultCorrectSerialization : function () {
            if (this.canRunHTML5Tests()) {
                this.$GeneralSerialize.testDefaultCorrectSerialization.call(this);
            }
        },

        testCustomSerializer : function () {
            if (this.canRunHTML5Tests()) {
                this.$GeneralSerialize.testCustomSerializer.call(this);
            }
        },

        testErrorCondition : function () {
            if (this.canRunHTML5Tests()) {
                this.$GeneralSerialize.testErrorCondition.call(this);
            }
        }
    }
});

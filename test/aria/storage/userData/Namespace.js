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
    $classpath : "test.aria.storage.userData.Namespace",
    $dependencies : ["aria.storage.UserData"],
    $extends : "test.aria.storage.base.GeneralNamespace",
    $constructor : function () {
        this.$GeneralNamespace.constructor.call(this);
    },
    $prototype : {
        /**
         * Check what happens when you use namespaces, one namespaced shouldn't affect the others
         */
        testNamespaceAPI : function () {
            if (this.canRunUserDataTests()) {
                this.$GeneralNamespace.testNamespaceAPI.call(this);
            }
        },

        /**
         * Verify if the events are raised correctly
         */
        testNamespaceEvents : function () {
            if (this.canRunUserDataTests()) {
                this.$GeneralNamespace.testNamespaceEvents.call(this);
            }
        }
    }
});

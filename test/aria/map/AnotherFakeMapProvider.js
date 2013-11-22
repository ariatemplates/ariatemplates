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
 * Fake map provider for testing purposes
 */
Aria.classDefinition({
    $classpath : "test.aria.map.AnotherFakeMapProvider",
    $constructor : function () {

    },
    $destructor : function () {
        this._loadCallback = null;
    },
    $prototype : {

        /**
         * @param {aria.core.CgfBeans.Callback} cb
         */
        load : function (cb) {

            var delayedCallback = aria.utils.Json.copy(cb, false);
            delayedCallback.delay = 50;
            aria.core.Timer.addCallback(delayedCallback);
        },

        /**
         * @return {Boolean}
         */
        isLoaded : function () {
            return false;
        },

        /**
         * @param {aria.map.CfgBeans.MapCfg} cfg
         * @return {Object} Fake map
         */
        getMap : function (cfg) {
            return {
                fakeMapMethod : function () {},
                fakeMapProperty : "mapProperty"
            };
        },

        /**
         * @param {Object} map Fake map
         */
        disposeMap : function (map) {

        }
    }
});

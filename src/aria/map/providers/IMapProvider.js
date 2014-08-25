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
var Aria = require("../../Aria");


/**
 * Interface exposed from a map provider.
 * @class aria.map.providers.IMapProvider
 */
module.exports = Aria.interfaceDefinition({
    $classpath : 'aria.map.providers.IMapProvider',
    $interface : {
        /**
         * Load the map scripts
         * @param {aria.core.CgfBeans:Callback} cb
         */
        load : function (cb) {},

        /**
         * @param {aria.map.CfgBeans:MapCfg} cfg
         * @return {Object} Map instance. null if the dependencies are not loaded
         */
        getMap : function (cfg) {},

        /**
         * @param {Object} map previously created through the getMap method
         */
        disposeMap : function () {}
    }
});

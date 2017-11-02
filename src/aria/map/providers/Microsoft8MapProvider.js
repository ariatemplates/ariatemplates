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
var ariaUtilsScriptLoader = require("../../utils/ScriptLoader");
var ariaMapProvidersIMapProvider = require("./IMapProvider");
var ariaUtilsJson = require("../../utils/Json");

/**
 * Load the bing 8 dependencies and creates map instances
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.map.providers.Microsoft8MapProvider",
    $singleton : true,
    $implements : [ariaMapProvidersIMapProvider],
    $constructor : function () {

        /**
         * Credentials for bing8 maps
         * @type String
         */
        this.credentials = "";

        /**
         * @type aria.core.CfgBeans:Callback
         */
        this._loadCallback = null;

    },
    $destructor : function () {
        this._loadCallback = null;
    },
    $prototype : {

        /**
         * Load the Microsoft Bing 8 scripts
         * @param {aria.core.CgfBeans:Callback} cb
         */
        load : function (cb) {
            if (this.isLoaded()) {
                this.$callback(cb);
            } else {
                var that = this;
                this._loadCallback = cb;
                Aria.$window.__bing8MapLoadCallback = function () {
                    that._afterLoad.apply(that);
                    that = null;
                };
                var url = "://www.bing.com/api/maps/mapcontrol?mkt=en-US&callback=__bing8MapLoadCallback";
                var https = "https:" == Aria.$window.document.location.protocol;
                url = "http" + (https ? "s" : "") + url + (https ? "&s=1" : "");
                ariaUtilsScriptLoader.load([url]);
            }
        },

        /**
         * Load the 'Microsoft.Maps.Overlays.Style' module and calls the original callback
         * @private
         */
        _afterLoad : function () {
            this.$assert(35, this.isLoaded());
            Aria.$window.__bing8MapLoadCallback = null;
            var that = this;
            Aria.$window.Microsoft.Maps.loadModule('Microsoft.Maps.Overlays.Style', {
                callback : function () {
                    that.$callback(that._loadCallback);
                    that = null;
                }
            });

        },

        /**
         * Check if the Microsoft Bing 8 API is available
         * @return {Boolean}
         */
        isLoaded : function () {
            var microsoft = Aria.$window.Microsoft;
            return !!(microsoft &&
                microsoft.Maps &&
                microsoft.Maps.Map &&
                typeof(microsoft.Maps.Map) === "function" &&
                microsoft.Maps.loadModule);
        },

        /**
         * @param {aria.map.CfgBeans:MapCfg} cfg
         * @return {Object} Map instance. null if the dependencies are not loaded
         */
        getMap : function (cfg) {
            var initArgs = {
                credentials : this.credentials
            };

            ariaUtilsJson.inject(cfg.initArgs, initArgs);
            return (this.isLoaded()) ? new Aria.$window.Microsoft.Maps.Map(cfg.domElement, initArgs) : null;
        },

        /**
         * @param {Object} map previously created through the getMap method
         */
        disposeMap : function (map) {

            var node = map.getRootElement();
            map.dispose();

            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    }
});

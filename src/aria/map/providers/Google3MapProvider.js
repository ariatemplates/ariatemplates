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
 * Load the google map 3 dependencies and creates map instances
 */
Aria.classDefinition({
    $classpath : "aria.map.providers.Google3MapProvider",
    $singleton : true,
    $dependencies : ["aria.utils.ScriptLoader"],
    $implements : ["aria.map.providers.IMapProvider"],
    $statics : {
        MISSING_ARGS : "Missing map arguments",
        MISSING_LATLNG : "Missing latitude (lat) or longitude (lng) in the initArgs of the map cfg"
    },
    $constructor : function () {

        /**
         * Credentials for google maps
         * @type String
         */
        this.credentials = "";

    },
    $prototype : {

        /**
         * Load the Google map V3 scripts
         * @param {aria.core.CgfBeans.Callback} cb
         */
        load : function (cb) {
            if (this.isLoaded()) {
                this.$callback(cb);
            } else {
                var that = this;
                Aria.$window.__googleMapLoaded = function () {
                    Aria.$window.__googleMapLoaded = null;
                    that.$callback(cb);
                    that = null;
                };

                aria.utils.ScriptLoader.load([this._getFullUrl()]);

            }
        },

        /**
         * Check if the Google map 3 API is available
         * @return {Boolean}
         */
        isLoaded : function () {
            var google = Aria.$window.google;
            return !!(google && google.maps && google.maps.Map);
        },

        /**
         * @param {aria.map.CfgBeans.MapCfg} cfg
         * @return {Object} Map instance. null if the dependencies are not loaded
         */
        getMap : function (cfg) {
            if (this.isLoaded()) {

                if (!cfg.initArgs) {
                    this.$logError(this.MISSING_ARGS);
                    return;
                }

                var initArgs = cfg.initArgs;

                var lat = initArgs.lat;
                var lng = initArgs.lng;
                if (lat == null || lng == null) {
                    this.$logError(this.MISSING_LATLNG);
                    return;
                }

                var google = Aria.$window.google;
                var initArgsGoogle = {
                        center : new google.maps.LatLng(lat, lng),
                        zoom : initArgs.zoom || 10,
                        mapTypeId : initArgs.mapTypeId || google.maps.MapTypeId.ROADMAP,
                        overviewMapControl: initArgs.overviewMapControl !== false,
                        overviewMapControlOptions: {
                            opened: initArgs.overviewMapControlOpen !== false
                        }
                };

                // Inject other arguments given by the application
                aria.utils.Json.inject(cfg.initArgs, initArgsGoogle);

                // Check that domElement has an height, which is required for google map
                var domElement = cfg.domElement;
                if (!domElement.offsetHeight) {
                    var parentNode = domElement.parentNode;
                    if (parentNode) {
                        domElement.style.cssText = "padding:0;margin:0;height:" + parentNode.offsetHeight + "px;";
                    }
                }

                return new Aria.$window.google.maps.Map(domElement, initArgsGoogle);
            }
        },

        /**
         * @param {Object} map previously created through the getMap method
         */
        disposeMap : function (map) {
            /*
                No destroy method is available in google map V3,
                destroying the dom element is enough
                http://code.google.com/p/gmaps-api-issues/issues/detail?id=772#c18
            */
            var node = map.getDiv();
            var parentNode = node.parentNode;
            if (parentNode) {
                parentNode.removeChild(node);
            }
        },

        /**
         * @private
         */
        _getFullUrl : function () {
            var googleUrl = ["/maps/api/js?v=3&sensor=false&callback=__googleMapLoaded"];
            var httpsPremierCustomer = false;
            var key = this.credentials;
            if (key) {
                if (key.indexOf("gme-") === 0) {
                    //https is available only for premier clients
                    httpsPremierCustomer = "https:" == Aria.$window.document.location.protocol;
                    googleUrl.push("client=" + key);
                } else {
                    googleUrl.push("key=" + key);
                }
            }

            return (httpsPremierCustomer ? "https://maps-api-ssl.google.com" : "http://maps.googleapis.com") +
                googleUrl.join("&");
        }
    }
});

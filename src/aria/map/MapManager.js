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

(function () {
    /**
     * Contains all the map instances by id
     * @type Object
     * @private
     */
    var maps = {};

    /**
     * Contains all the map DOM Element by id
     * @type Object
     * @private
     */
    var mapDoms = {};

    /**
     * Contains all the map ids
     * @type Object
     * @private
     */
    var mapStatus = {};

    /**
     * Contains all the classpaths for Map providers by provider name
     * @type Object
     */
    var providers = {
        "microsoft7" : "aria.map.providers.Microsoft7MapProvider"
    };

    /**
     * Contains all the references to Map providers by provider name
     * @type Object
     * @private
     */
    var providerInstances = {};

    /**
     * Contains all the instances of providers that have to be disposed
     * @type Object
     * @private
     */
    var providerInstancesToDispose = {};

    /**
     * Manages the creation and destruction of maps
     */
    Aria.classDefinition({
        $classpath : "aria.map.MapManager",
        $singleton : true,
        $dependencies : ["aria.map.CfgBeans", "aria.templates.DomElementWrapper", "aria.utils.Type"],
        $constructor : function () {

            /**
             * Stores dom element wrappers in order to properly destroy them
             * @type {Array}
             * @private
             */
            this._createdDomWrappers = {};

        },
        $destructor : function () {
            this.destroyAllMaps();
            for (var prov in providerInstancesToDispose) {
                if (providerInstancesToDispose.hasOwnProperty(prov)) {
                    providerInstancesToDispose[prov].$dispose();
                }
            }
            mapDoms = null;
            mapStatus = null;
            this._createdDomWrappers = null;
            providerInstances = null;
            providerInstancesToDispose = null;
            maps = null;
            providers = null;

        },
        $events : {

            /**
             * @event mapReady
             */
            "mapReady" : {
                description : "Notifies that a certain map has been loaded",
                properties : {
                    mapId : "{String} id of the map"
                }
            },

            /**
             * @event mapDestroy
             */
            "mapDestroy" : {
                description : "Notifies that a certain map has been destroyed",
                properties : {
                    mapId : "{String} id of the map"
                }
            }
        },
        $statics : {

            INVALID_CONFIGURATION : "Invalid configuration for creating a map\n%1",
            INEXISTENT_PROVIDER : "Provider %1 cannot be found",
            INVALID_PROVIDER : "Provider %1 is not valid",
            DUPLICATED_PROVIDER : "Provider %1 exists already",
            DUPLICATED_MAP_ID : "A map with id %1 already exists.",
            LOADING : "loading",
            READY : "ready"

        },
        $prototype : {

            /**
             * @param {aria.map.CfgBeans.CreateMapCfg} cfg
             */
            createMap : function (cfg) {
                if (!this._checkCfg(cfg)) {
                    return;
                }
                if (mapStatus[cfg.id]) {
                    this.$logError(this.DUPLICATED_MAP_ID, cfg.id);
                    return;
                }
                mapStatus[cfg.id] = this.LOADING;
                var providerName = cfg.provider;
                if (!(providerName in providers)) {
                    this.addProvider(providerName, providerName);
                }
                this._getProviderInstance(providerName, {
                    fn : this._loadProviderDependencies,
                    scope : this,
                    args : cfg
                });

            },

            /**
             * @param {String} mapId
             * @return {Object} map instance or null if it is not found
             */
            getMap : function (mapId) {
                return (maps[mapId]) ? maps[mapId].instance : null;
            },

            /**
             * @param {String} mapId
             * @return {aria.templates.DomElementWrapper} wrapped dom element that contains the map
             */
            getMapDom : function (mapId) {
                var wrapper = this._createdDomWrappers[mapId];
                if (wrapper) {
                    return wrapper;
                }
                var dom = mapDoms[mapId];
                if (dom) {
                    wrapper = new aria.templates.DomElementWrapper(dom);
                    this._createdDomWrappers[mapId] = wrapper;
                    return wrapper;
                }
            },

            /**
             * @param {String} mapId
             */
            destroyMap : function (mapId) {
                var map = maps[mapId];
                if (map) {
                    providerInstances[map.providerName].disposeMap(map.instance);
                    map = null;
                    delete maps[mapId];
                    delete mapDoms[mapId];
                    var domWrapper = this._createdDomWrappers[mapId];
                    if (domWrapper) {
                        domWrapper.$dispose();
                        domWrapper = null;
                        delete this._createdDomWrappers[mapId];
                    }
                    delete mapStatus[mapId];
                    this.$raiseEvent({
                        name : "mapDestroy",
                        mapId : mapId
                    });
                }
            },

            /**
             * @param {String} name of the provider whose maps to destroy. If not provided, all maps from all providers
             * will be detroyed
             */
            destroyAllMaps : function (providerName) {
                var validProvider = providerName && (providerName in providers);
                var map;
                for (var mapId in maps) {
                    if (maps.hasOwnProperty(mapId)) {
                        map = maps[mapId];
                        if (!validProvider || map.providerName == providerName) {
                            this.destroyMap(mapId);
                        }
                    }
                }
            },

            /**
             * Add a provider by specifying the class that should be used to load dependencies and create maps instances
             * @param {String} providerName
             * @param {String|Object} provider classpath or Object with methods "load", "getMap" and "disposeMap"
             */
            addProvider : function (providerName, provider) {
                if (providers[providerName]) {
                    this.$logError(this.DUPLICATED_PROVIDER, providerName);
                } else {
                    if (aria.utils.Type.isObject(provider)) {
                        if (this._isValidProvider(provider)) {
                            providerInstances[providerName] = provider;
                            providers[providerName] = provider;
                        } else {
                            this.$logError(this.INVALID_PROVIDER, providerName);
                        }
                    } else {
                        providers[providerName] = provider;
                    }
                }
            },

            /**
             * Remove a provider by specifying the shortcut for the provider. It destroys all the maps created with that
             * provider
             * @param {String} provider
             */
            removeProvider : function (providerName) {
                this.destroyAllMaps(providerName);
                delete providers[providerName];
                if (providerInstancesToDispose[providerName]) {
                    providerInstancesToDispose[providerName].$dispose();
                    delete providerInstancesToDispose[providerName];
                }
                delete providerInstances[providerName];
            },

            /**
             * @param {String} providerName
             * @return {Boolean}
             */
            hasProvider : function (providerName) {
                return (providerName in providers);
            },

            /**
             * Checks the configuration for creating a map
             * @param {aria.map.CfgBeans.CreateMapCfg} cfg
             * @return {Boolean} configuration consistency against the bean
             * @private
             */
            _checkCfg : function (cfg) {
                try {
                    aria.core.JsonValidator.normalize({
                        json : cfg,
                        beanName : "aria.map.CfgBeans.CreateMapCfg"
                    }, true);
                } catch (e) {
                    var logs = aria.core.Log;
                    var message = [""];
                    if (logs) {
                        var error;
                        for (var index = 0, len = e.errors.length; index < len; index += 1) {
                            error = e.errors[index];
                            message.push(logs.prepareLoggedMessage(error.msgId, error.msgArgs));
                        }
                    }
                    this.$logError(this.INVALID_CONFIGURATION, message.join("\n"));
                    return false;
                }
                return true;
            },

            /**
             * @param {String} provider
             * @param {aria.core.CfgBeans.Callback} cb
             * @private
             */
            _getProviderInstance : function (providerName, cb) {
                if (providerInstances[providerName]) {
                    this.$callback(cb);
                } else {
                    Aria.load({
                        classes : [providers[providerName]],
                        oncomplete : {
                            fn : this._setProviderInstance,
                            scope : this,
                            args : {
                                providerName : providerName,
                                cb : cb
                            }
                        },
                        onerror : {
                            fn : this._raiseInexistentProviderError,
                            scope : this,
                            args : {
                                providerName : providerName,
                                cb : cb
                            }
                        }
                    });
                }
            },

            /**
             * @param {Object} args Contains the provider and a callback object
             * @private
             */
            _raiseInexistentProviderError : function (args) {
                this.$logError(this.INEXISTENT_PROVIDER, args.providerName);
                var cfg = args.cb.args;
                delete mapStatus[cfg.id];

                var afterCreateCb = cfg.afterCreate;
                if (afterCreateCb) {
                    this.$callback(afterCreateCb, null);
                }
            },

            /**
             * @param {Object} args Contains the provider name and a callback
             * @private
             */
            _setProviderInstance : function (args) {
                var providerName = args.providerName;
                var classRef = Aria.getClassRef(providers[providerName]);
                var isSingleton = !(aria.utils.Type.isFunction(classRef));
                var provInstance = (isSingleton) ? classRef : new classRef();

                var valid = this._isValidProvider(provInstance);
                if (valid) {
                    providerInstances[providerName] = provInstance;
                    if (!isSingleton) {
                        providerInstancesToDispose[providerName] = provInstance;
                    }
                    this.$callback(args.cb);
                } else {
                    var cfg = args.cb.args;
                    delete mapStatus[cfg.id];
                    provInstance.$dispose();
                    this.$logError(this.INVALID_PROVIDER, args.providerName);

                    var afterCreateCb = cfg.afterCreate;
                    if (afterCreateCb) {
                        this.$callback(afterCreateCb, null);
                    }
                }
            },

            /**
             * Check that the given provider has the right methods
             * @param {Object} provider
             * @return {Boolean}
             */
            _isValidProvider : function (provider) {
                var valid = true, methods = ["load", "getMap", "disposeMap"];
                for (var i = 0; i < methods.length; i++) {
                    valid = valid && provider[methods[i]] && aria.utils.Type.isFunction(provider[methods[i]]);
                }
                return valid;
            },

            /**
             * Load the provider dependencies. Called after loading the provider class
             * @param {Object} res
             * @param {aria.map.CfgBeans.CreateMapCfg} cfg
             * @private
             */
            _loadProviderDependencies : function (res, cfg) {
                var providerInstance = providerInstances[cfg.provider];
                providerInstance.load({
                    fn : this._retrieveMapInstance,
                    scope : this,
                    args : cfg
                });
            },

            /**
             * @param {aria.map.CfgBeans.CreateMapCfg} cfg
             * @private
             */
            _retrieveMapInstance : function (firstArg, secondArg) {
                // TODO: two parameters because when called by the aria.core.Timer (see test cases) the args are the
                // first argument
                var cfg = (firstArg && firstArg.id && firstArg.provider) ? firstArg : secondArg;
                var providerName = cfg.provider, mapId = cfg.id, afterCreateCb = cfg.afterCreate;
                var map = providerInstances[providerName].getMap(cfg);
                maps[mapId] = {
                    instance : map,
                    providerName : providerName
                };
                mapDoms[mapId] = cfg.domElement;
                mapStatus[mapId] = this.READY;

                if (afterCreateCb) {
                    this.$callback(afterCreateCb, map);
                }

                this.$raiseEvent({
                    name : "mapReady",
                    mapId : mapId
                });
            },

            /**
             * @param {String} mapId Identifier of the map
             * @retun {aria.map.MapManager.LOADING|aria.map.MapManager.READY} null if the mapId does not correspond to a
             * map whose creation has already been requested
             */
            getMapStatus : function (mapId) {
                return mapStatus[mapId] || null;
            }
        }
    });
})();

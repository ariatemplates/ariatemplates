/**
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
	 * @private
	 */
	var providers = {
		"microsoft7" : "aria.map.providers.Microsoft7MapProvider"
	};

	/**
	 * Contains all the instances for Map providers by provider name
	 * @type Object
	 * @private
	 */
	var providerInstances = {};

	/**
	 * Manages the creation and destruction of maps
	 */
	Aria.classDefinition({
		$classpath : "aria.map.MapManager",
		$singleton : true,
		$dependencies : ["aria.map.CfgBeans", "aria.templates.DomElementWrapper"],
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

			mapDoms = null;
			mapStatus = null;
			this._createdDomWrappers = null;
			providerInstances = null;
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
			INVALID_PROVIDER : "Provider %1 is not supported",
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
				var provider = cfg.provider;
				if (!(provider in providers)) {
					this.$logError(this.INVALID_PROVIDER, provider);
					delete mapStatus[cfg.id];
				} else {
					this._getProviderInstance(provider, {
						fn : this._loadProviderDependencies,
						scope : this,
						args : cfg
					});
				}
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
				} else {
					return null;
				}
			},

			/**
			 * @param {String} mapId
			 */
			destroyMap : function (mapId) {
				var map = maps[mapId];
				if (map) {
					providerInstances[map.provider].disposeMap(map.instance);
					map = null;
					delete maps[mapId];

					var mapDom = mapDoms[mapId];
					if (mapDom) {
						mapDom = null;
						delete mapDoms[mapId];

					}
					var domWrapper = this._createdDomWrappers[mapId];
					if (domWrapper) {
						domWrapper.$dispose();
						domWrapper = null;
						delete this._createdDomWrappers[mapId];
					}
					if (mapStatus[mapId]) {
						delete mapStatus[mapId];
					}
					this.$raiseEvent({
						name : "mapDestroy",
						mapId : mapId
					});
				}
			},

			destroyAllMaps : function (provider) {
				var validProvider = provider && this.hasMapProvider(provider);
				var map;
				for (var mapId in maps) {
					if (maps.hasOwnProperty(mapId)) {
						map = maps[mapId];
						if (!validProvider || map.provider == provider) {
							this.destroyMap(mapId);
						}
					}
				}
			},

			/**
			 * Add a provider by specifying the class that should be used to load dependencies and create maps instances
			 * @param {String} provider
			 * @param {String} classpath
			 */
			addMapProvider : function (provider, classpath) {
				if (providers[provider]) {
					this.$logError(this.DUPLICATED_PROVIDER, provider);
				} else {
					providers[provider] = classpath;
				}
			},

			/**
			 * Remove a provider by specifying the shortcut for the provider. It destroys all the maps created with that
			 * provider
			 * @param {String} provider
			 */
			removeMapProvider : function (provider) {
				this.destroyAllMaps(provider);
				delete providers[provider];
				delete providerInstances[provider];
			},

			/**
			 * @param {String} provider
			 * @return {Boolean}
			 */
			hasMapProvider : function (provider) {
				return (provider in providers);
			},

			/**
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
			_getProviderInstance : function (provider, cb) {
				if (providerInstances[provider]) {
					this.$callback(cb);
				} else {
					Aria.load({
						classes : [providers[provider]],
						oncomplete : {
							fn : this._setProviderInstance,
							scope : this,
							args : {
								provider : provider,
								cb : cb
							}
						}
					});
				}
			},

			/**
			 * @param {Object} args Contains the provider name and a callback
			 * @private
			 */
			_setProviderInstance : function (args) {
				var provider = args.provider;
				providerInstances[provider] = Aria.getClassRef(providers[provider]);
				this.$callback(args.cb);
			},

			/**
			 * @param {aria.map.CfgBeans.CreateMapCfg} cfg
			 * @private
			 */
			_loadProviderDependencies : function (_, cfg) {
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
				var cfg = (firstArg && firstArg.id && firstArg.provider) ? firstArg : secondArg;
				var provider = cfg.provider, mapId = cfg.id, afterCreateCb = cfg.afterCreate;
				var map = providerInstances[provider].getMap(cfg);
				maps[mapId] = {
					instance : map,
					provider : provider
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
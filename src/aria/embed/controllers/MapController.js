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
	 * Contains all the map DOM Element by id
	 * @type Object
	 * @private
	 */
	var mapDoms = {};

	/**
	 * Contains the useful properties that allow the controller to append a map after it has been loaded
	 * @type Object
	 * @private
	 */
	var mapReadyHandlerArgs = {};

	Aria.classDefinition({
		$classpath : "aria.embed.controllers.MapController",
		$singleton : true,
		$dependencies : ["aria.map.MapManager"],
		$constructor : function () {

			this.mapManager = aria.map.MapManager;
			this.mapManager.$addListeners({
				"mapDestroy" : {
					fn : this._nullifyMapDom,
					scope : this
				}
			});

			/**
			 * Counts the number of maps listening to the mapReady event
			 * @type Integer
			 * @private
			 */
			this._listeners = 0;

		},
		$destructor : function () {
			this.mapManager.$removeListeners({
				"mapDestroy" : {
					fn : this._nullifyMapDom,
					scope : this
				}
			});
			this.mapManager = null;
			mapDoms = null;
			mapReadyHandlerArgs = null;
		},
		$prototype : {

			/**
			 * Called by the Map embed widget at initialization
			 * @param {HTMLElement} container
			 * @param {Object} cfg
			 */
			onEmbededElementCreate : function (container, cfg) {
				var localMapStatus = this.mapManager.getMapStatus(cfg.id);
				if (localMapStatus == this.mapManager.READY) {
					this._appendMap(null, {
						container : container,
						cfg : cfg
					});

				} else {
					if (cfg.loadingIndicator) {
						this._triggerLoadingIndicator(container, true);
					}
					if (localMapStatus === null) {
						var createMapConfig = aria.utils.Json.copy(cfg);
						var provider = createMapConfig.provider;
						if (!this.mapManager.hasMapProvider(provider)) {
							this.mapManager.addMapProvider(provider, provider);
						}
						delete createMapConfig.loadingIndicator;
						var domElement = Aria.$window.document.createElement("DIV");
						createMapConfig.domElement = domElement;
						mapDoms[cfg.id] = domElement;
						createMapConfig.afterCreate = {
							fn : this._appendMap,
							scope : this,
							args : {
								container : container,
								cfg : cfg
							}
						};
						this.mapManager.createMap(createMapConfig);
					} else {
						mapReadyHandlerArgs[cfg.id] = {
							container : container,
							cfg : cfg
						};
						if (this._listeners === 0) {
							this.mapManager.$addListeners({
								"mapReady" : {
									fn : this._waitAndAppendMap,
									scope : this
								}
							});
						}
						this._listeners++;

					}
				}

			},

			/**
			 * "mapReady" event handler. Used in case the map is loading
			 * @param {Object} evt Event description
			 * @private
			 */
			_waitAndAppendMap : function (evt) {
				var args = mapReadyHandlerArgs[evt.mapId];
				if (args) {
					this._appendMap(null, args);
					delete mapReadyHandlerArgs[evt.mapId];
					this._listeners--;
					if (this._listeners === 0) {
						this.mapManager.$removeListeners({
							"mapReady" : {
								fn : this._waitAndAppendMap,
								scope : this
							}
						});
					}
				}
			},

			/**
			 * Appends the map element in the dom
			 * @param {Object} _ not used
			 * @param {Object} args Contains the map configuration and the container to which the map dom has to be
			 * appended
			 * @private
			 */
			_appendMap : function (_, args) {
				var container = args.container, cfg = args.cfg;
				container.appendChild(mapDoms[cfg.id]);
				if (cfg.loadingIndicator) {
					this._triggerLoadingIndicator(container, false);
				}

			},

			/**
			 * Called by the Map embed widget at disposal
			 * @param {HTMLElement} container
			 * @param {Object} cfg
			 */
			onEmbededElementDispose : function (container, cfg) {
				var id = cfg.id;
				if (cfg.loadingIndicator) {
					this._triggerLoadingIndicator(container, false);
				}
				var mapDom = mapDoms[id];
				if (mapDom) {
					var parent = mapDom.parentNode;
					if (parent) {
						parent.removeChild(mapDom);
					}
				}
			},

			/**
			 * Called when a map has been detroyed
			 * @param {Object} evt Event description
			 * @private
			 */
			_nullifyMapDom : function (evt) {
				delete mapDoms[evt.mapId];
			},

			/**
			 * @param {HTMLElement} element
			 * @param {Boolean} visible
			 */
			_triggerLoadingIndicator : function (element, visible) {
				if (element) {
					if (visible) {
						aria.utils.DomOverlay.create(element);
					} else {
						aria.utils.DomOverlay.detachFrom(element);
					}
				}
			}
		}
	});
})();
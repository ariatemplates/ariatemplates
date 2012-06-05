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
/**
 * This class contains utilities to show and hide a loading indicator above a DOM Element
 * @class aria.utils.DomOverlay
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
	$classpath : 'aria.utils.DomOverlay',
	$dependencies : ['aria.utils.overlay.LoadingOverlay', 'aria.utils.Type', 'aria.utils.Event',
			'aria.utils.AriaWindow'],
	$singleton : true,
	$statics : {
		UNIQUE_ID_GENERATOR : 12
	},
	$constructor : function () {
		/**
		 * List of overlays objects
		 * @type Object
		 * 
		 * <pre>
		 * {
		 * 	uinqueId : aria.utils.overlay.LoadingOverlay
		 * }
		 * </pre>
		 */
		this.overlays = null;

		/**
		 * Number of overlay objects in overlays.
		 * @type Number
		 */
		this._nbOverlays = 0;

		/**
		 * Keep the overlay above the body in a special place since there's no need to destroy it on refresh
		 * @type aria.utils.overlay.LoadingOverlay
		 */
		this.bodyOverlay = null;

		aria.utils.AriaWindow.$on({
			"unloadWindow" : this._reset,
			scope : this
		});
	},
	$destructor : function () {
		this._reset();
		aria.utils.AriaWindow.$unregisterListeners(this);
	},
	$prototype : {
		/**
		 * If it is not done already, notifies AriaWindow that we are starting to use Aria.$window, and registers the
		 * scroll event listener.
		 */
		_init : function () {
			if (this.overlays == null) {
				this.overlays = {};
				aria.utils.AriaWindow.attachWindow();
				// Listen for scroll event to update the position of the overlay
				aria.utils.Event.addListener(Aria.$window, "scroll", {
					fn : this.__onScroll,
					scope : this
				}, true);
			}
		},

		/**
		 * If it is not done already, unregisters the scroll event listener and notifies AriaWindow that we are no
		 * longer using Aria.$window.
		 */
		_reset : function () {
			if (this.overlays != null) {
				aria.utils.Event.removeListener(Aria.$window, "scroll", {
					fn : this.__onScroll
				});
				aria.utils.AriaWindow.detachWindow();
				this.overlays = null;
				this._nbOverlays = 0;
			}
		},

		/**
		 * Create a DomOverlay above a DOM Element. This function should only be used for elements outside a template or
		 * a section
		 * @param {HTMLElement} element The element that should be hidden by an overlay
		 * @param {String} message Optional text message to display in the overlay
		 */
		create : function (element, message) {
			// Check if there is already an overlay on this element
			var overlay = this.__getOverlay(element);
			if (overlay) {
				overlay.overlay.refresh();
				return overlay.id;
			}

			// Generate an id for that
			var id = ++this.UNIQUE_ID_GENERATOR;

			// Create the overlay
			overlay = new aria.utils.overlay.LoadingOverlay(element, id, message);

			this._init(); // check it is initialized
			// Store the overlay internally
			if (element !== Aria.$window.document.body) {
				this.overlays[id] = overlay;
				this._nbOverlays++;

				// Store the id on the element expando
				element.__overlay = id;
			} else {
				this.bodyOverlay = overlay;
			}

			return id;
		},

		/**
		 * Detach an overlay from a DOM Element
		 * @param {HTMLElement} element The element with an overlay to detach
		 */
		detachFrom : function (element) {
			var overlayInfo = this.__getOverlay(element);

			if (!overlayInfo) {
				return;
			}

			// Dispose the overlay
			overlayInfo.overlay.$dispose();
			var id = overlayInfo.id;

			// Remove any pointer
			if (element === Aria.$window.document.body) {
				this.bodyOverlay = null;
			} else {
				delete this.overlays[id];
				this._nbOverlays--;
			}

			overlayInfo = null;

			if (this._nbOverlays == 0 && this.bodyOverlay == null) {
				this._reset();
			}

			return id;
		},

		/**
		 * Get the information about an overlay
		 * @private
		 * @param {HTMLElement} element
		 * @return {Object}
		 * 
		 * <pre>
		 * {overlay: Overlay object, id : unique verlay id}
		 * </pre>
		 */
		__getOverlay : function (element) {
			if (element === Aria.$window.document.body) {
				return !this.bodyOverlay ? null : {
					overlay : this.bodyOverlay
				};
			} else {
				// Get the overlay object
				var id = element.__overlay;

				if (!id || this.overlays == null) {
					return;
				}

				var overlay = this.overlays[id];

				if (!overlay) {
					element.__overlay = null;
					return;
				}

				return {
					overlay : overlay,
					id : id
				};
			}
		},

		/**
		 * Refresh the position of the overlays after a scroll event
		 * @private
		 */
		__onScroll : function () {
			// Refresh any open overlay
			this.$assert(184, this.overlays != null);
			var overlays = this.overlays;
			for (var key in overlays) {
				if (overlays.hasOwnProperty(key)) {
					var overlay = overlays[key];

					overlay.refreshPosition();
				}
			};
		},

		/**
		 * Dispose a list of overlays specified by their unique identifier
		 * @param {Array} ids Array of overlay id
		 */
		disposeOverlays : function (ids) {
			if (!aria.utils.Type.isArray(ids) || this.overlays == null) {
				return;
			}
			for (var i = 0, len = ids.length; i < len; i += 1) {
				var overlay = this.overlays[ids[i]];

				if (overlay) {
					overlay.$dispose();
					delete this.overlays[ids[i]];
					this._nbOverlays--;
				}
			}
			if (this._nbOverlays == 0 && this.bodyOverlay == null) {
				this._reset();
			}
		}
	}
});

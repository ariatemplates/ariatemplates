/*
 * Copyright 2012 Amadeus s.a.s. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and limitations under the
 * License.
 */

(function () {
	var Boolean = Aria.$window.Boolean;
	var History = {};
	/**
	 * History.js Native Adapter
	 * @author Benjamin Arthur Lupton <contact@balupton.com>
	 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
	 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
	 */

	(function (window, undefined) {
		"use strict";
		// Add the Adapter
		History.Adapter = {
			/**
			 * History.Adapter.handlers[uid][eventName] = Array
			 */
			handlers : {},

			/**
			 * History.Adapter._uid The current element unique identifier
			 */
			_uid : 1,

			/**
			 * History.Adapter.uid(element)
			 * @param {Element} element
			 * @return {String} uid
			 */
			uid : function (element) {
				return element._uid || (element._uid = History.Adapter._uid++);
			},

			/**
			 * History.Adapter.bind(el,event,callback)
			 * @param {Element} element
			 * @param {String} eventName - custom and standard events
			 * @param {Function} callback
			 * @return
			 */
			bind : function (element, eventName, callback) {
				// Prepare
				var uid = History.Adapter.uid(element);

				// Apply Listener
				History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
				History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];
				History.Adapter.handlers[uid][eventName].push(callback);

				// Bind Global Listener
				element['on' + eventName] = (function (element, eventName) {
					return function (event) {
						History.Adapter.trigger(element, eventName, event);
					};
				})(element, eventName);
			},

			/**
			 * History.Adapter.trigger(el,event)
			 * @param {Element} element
			 * @param {String} eventName - custom and standard events
			 * @param {Object} event - a object of event data
			 * @return
			 */
			trigger : function (element, eventName, event) {
				// Prepare
				event = event || {};
				var uid = History.Adapter.uid(element), i, n;

				// Apply Listener
				History.Adapter.handlers[uid] = History.Adapter.handlers[uid] || {};
				History.Adapter.handlers[uid][eventName] = History.Adapter.handlers[uid][eventName] || [];

				// Fire Listeners
				for (i = 0, n = History.Adapter.handlers[uid][eventName].length; i < n; ++i) {
					History.Adapter.handlers[uid][eventName][i].apply(this, [event]);
				}
			},

			/**
			 * History.Adapter.extractEventData(key,event,extra)
			 * @param {String} key - key for the event data to extract
			 * @param {String} event - custom and standard events
			 * @return {mixed}
			 */
			extractEventData : function (key, event) {
				var result = (event && event[key]) || undefined;
				return result;
			},

			/**
			 * History.Adapter.onDomLoad(callback)
			 * @param {Function} callback
			 * @return
			 */
			onDomLoad : function (callback) {
				var timeout = window.setTimeout(function () {
					callback();
				}, 2000);
				window.onload = function () {
					clearTimeout(timeout);
					callback();
				};
			}
		};
	})(Aria.$window);

	/**
	 * History.js HTML4 Support Depends on the HTML5 Support
	 * @author Benjamin Arthur Lupton <contact@balupton.com>
	 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
	 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
	 */

	(function (window, undefined) {
		"use strict";

		// Localise Globals
		var document = window.document, // Make sure we are using the correct document
		setTimeout = window.setTimeout || setTimeout, clearTimeout = window.clearTimeout || clearTimeout, setInterval = window.setInterval
				|| setInterval;

		// ========================================================================
		// Initialise HTML4 Support
		History.initHtml4 = function () {
			if (typeof History.initHtml4.initialized !== 'undefined') {
				return false;
			} else {
				History.initHtml4.initialized = true;
			}

			// ====================================================================
			// Properties
			History.enabled = true;
			History.savedHashes = [];

			/**
			 * History.isLastHash(newHash) Checks if the hash is the last hash
			 * @param {string} newHash
			 * @return {boolean} true
			 */
			History.isLastHash = function (newHash) {
				var oldHash = History.getHashByIndex(), isLast;
				isLast = newHash === oldHash;
				return isLast;
			};

			/**
			 * History.saveHash(newHash) Push a Hash
			 * @param {string} newHash
			 * @return {boolean} true
			 */
			History.saveHash = function (newHash) {
				if (History.isLastHash(newHash)) {
					return false;
				}
				History.savedHashes.push(newHash);
				return true;
			};

			/**
			 * History.getHashByIndex() Gets a hash by the index
			 * @param {integer} index
			 * @return {string}
			 */
			History.getHashByIndex = function (index) {
				var hash = null;

				if (typeof index === 'undefined') {
					hash = History.savedHashes[History.savedHashes.length - 1];
				} else if (index < 0) {
					hash = History.savedHashes[History.savedHashes.length + index];
				} else {
					hash = History.savedHashes[index];
				}
				return hash;
			};

			// ====================================================================
			// Discarded States
			History.discardedStates = {};

			/**
			 * History.discardState(State) Discards the state by ignoring it through History
			 * @param {object} State
			 * @return {true}
			 */
			History.discardState = function (discardedState, forwardState, backState) {
				var discardedStateHash = History.getHashByState(discardedState), discardObject;

				discardObject = {
					'discardedState' : discardedState,
					'backState' : backState,
					'forwardState' : forwardState
				};

				History.discardedStates[discardedStateHash] = discardObject;
				return true;
			};

			/**
			 * History.discardState(State) Checks to see if the state is discarded
			 * @param {object} State
			 * @return {bool}
			 */
			History.discardedState = function (State) {
				var StateHash = History.getHashByState(State), discarded;

				discarded = History.discardedStates[StateHash] || false;
				return discarded;
			};

			/**
			 * History.recycleState(State) Allows a discarded state to be used again
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.recycleState = function (State) {
				var StateHash = History.getHashByState(State);

				if (History.discardedState(State)) {
					delete History.discardedStates[StateHash];
				}
				return true;
			};

			// ====================================================================
			// HTML5 State Support

			// Non-Native pushState Implementation
			if (History.emulated.pushState) {
				/**
				 * History.onHashChange(event) Trigger HTML5's window.onpopstate via HTML4 HashChange Support
				 */
				History.onHashChange = function (event) {
					var currentUrl = ((event && event.newURL) || document.location.href), currentHash = History.getHashByUrl(currentUrl), currentState = null, currentStateHash = null, currentStateHashExits = null, discardObject;

					if (History.isLastHash(currentHash)) {
						// There has been no change (just the page's hash has finally propagated)
						History.busy(false);
						return false;
					}

					// Reset the double check
					History.doubleCheckComplete();

					// Store our location for use in detecting back/forward direction
					History.saveHash(currentHash);

					// Expand Hash
					if (currentHash && History.isTraditionalAnchor(currentHash)) {
						History.Adapter.trigger(window, 'anchorchange');
						History.busy(false);
						return false;
					}

					// Create State
					currentState = History.extractState(History.getFullUrl(currentHash || document.location.href, false), true);

					// Check if we are the same state
					if (History.isLastSavedState(currentState)) {
						// There has been no change (just the page's hash has finally propagated)
						History.busy(false);
						return false;
					}

					// Create the state Hash
					currentStateHash = History.getHashByState(currentState);

					// Check if we are DiscardedState
					discardObject = History.discardedState(currentState);
					if (discardObject) {
						// Ignore this state as it has been discarded and go back to the state before it
						if (History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState)) {
							// We are going backwards
							History.back(false);
						} else {
							// We are going forwards
							History.forward(false);
						}
						return false;
					}

					// Push the new HTML5 State
					History.pushState(currentState.data, currentState.title, currentState.url, false);

					// End onHashChange closure
					return true;
				};
				History.onHashChangeCb = {
					fn : History.onHashChange
				};
				aria.utils.HashManager.addCallback(History.onHashChangeCb);

				/**
				 * History.pushState(data,title,url) Add a new State to the history object, become it, and trigger
				 * onpopstate We have to trigger for HTML4 compatibility
				 * @param {object} data
				 * @param {string} title
				 * @param {string} url
				 * @return {true}
				 */
				History.pushState = function (data, title, url, queue) {
					// Check the State
					if (History.getHashByUrl(url)) {
						throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
					}

					// Handle Queueing
					if (queue !== false && History.busy()) {
						History.pushQueue({
							scope : History,
							callback : History.pushState,
							args : arguments,
							queue : queue
						});
						return false;
					}

					// Make Busy
					History.busy(true);

					// Fetch the State Object
					var newState = History.createStateObject(data, title, url), newStateHash = History.getHashByState(newState), oldState = History.getState(false), oldStateHash = History.getHashByState(oldState), html4Hash = History.getHash();

					// Store the newState
					History.storeState(newState);
					History.expectedStateId = newState.id;

					// Recycle the State
					History.recycleState(newState);

					// Force update of the title
					History.setTitle(newState);

					// Check if we are the same State
					if (newStateHash === oldStateHash) {
						History.busy(false);
						return false;
					}

					// Update HTML4 Hash
					if (newStateHash !== html4Hash && newStateHash !== History.getShortUrl(document.location.href)) {
						History.setHash(newStateHash, false);
						return false;
					}

					// Update HTML5 State
					History.saveState(newState);

					// Fire HTML5 Event
					History.Adapter.trigger(window, 'statechange');
					History.busy(false);

					// End pushState closure
					return true;
				};

				/**
				 * History.replaceState(data,title,url) Replace the State and trigger onpopstate We have to trigger for
				 * HTML4 compatibility
				 * @param {object} data
				 * @param {string} title
				 * @param {string} url
				 * @return {true}
				 */
				History.replaceState = function (data, title, url, queue) {
					// Check the State
					if (History.getHashByUrl(url)) {
						throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
					}

					// Handle Queueing
					if (queue !== false && History.busy()) {
						History.pushQueue({
							scope : History,
							callback : History.replaceState,
							args : arguments,
							queue : queue
						});
						return false;
					}

					// Make Busy
					History.busy(true);

					// Fetch the State Objects
					var newState = History.createStateObject(data, title, url), oldState = History.getState(false), previousState = History.getStateByIndex(-2);

					// Discard Old State
					History.discardState(oldState, newState, previousState);

					// Alias to PushState
					History.pushState(newState.data, newState.title, newState.url, false);

					// End replaceState closure
					return true;
				};

			} // History.emulated.pushState

			// ====================================================================
			// Initialise

			// Non-Native pushState Implementation
			if (History.emulated.pushState) {
				/**
				 * Ensure initial state is handled correctly
				 */
				if (History.getHash() && !History.emulated.hashChange) {
					History.Adapter.onDomLoad(function () {
						History.Adapter.trigger(window, 'hashchange');
					});
				}
			} // History.emulated.pushState
		}; // History.initHtml4
	})(Aria.$window);

	/**
	 * History.js Core
	 * @author Benjamin Arthur Lupton <contact@balupton.com>
	 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
	 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
	 */

	(function (window, undefined) {
		"use strict";

		// Localise Globals
		var console = window.console || undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		sessionStorage = window.sessionStorage || false, // sessionStorage
		setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, setInterval = window.setInterval, clearInterval = window.clearInterval, JSON, alert = window.alert;

		var history = window.history; // Old History Object

		JSON = new aria.utils.json.JsonSerializer();
		JSON.stringify = JSON.serialize;

		// Initialise History
		History.init = function () {
			// Check Load Status of Core
			if (typeof History.initCore !== 'undefined') {
				History.initCore();
			}

			// Check Load Status of HTML4 Support
			if (typeof History.initHtml4 !== 'undefined') {
				History.initHtml4();
			}

			// Return true
			return true;
		};

		// ========================================================================
		// Initialise Core
		History.initCore = function () {
			if (typeof History.initCore.initialized !== 'undefined') {
				return false;
			} else {
				History.initCore.initialized = true;
			}

			// ====================================================================
			// Options

			/**
			 * History.options Configurable options
			 */
			History.options = History.options || {};

			/**
			 * History.options.hashChangeInterval How long should the interval be before hashchange checks
			 */
			History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

			/**
			 * History.options.safariPollInterval How long should the interval be before safari poll checks
			 */
			History.options.safariPollInterval = History.options.safariPollInterval || 500;

			/**
			 * History.options.doubleCheckInterval How long should the interval be before we perform a double check
			 */
			History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

			/**
			 * History.options.storeInterval How long should we wait between store calls
			 */
			History.options.storeInterval = History.options.storeInterval || 1000;

			/**
			 * History.options.busyDelay How long should we wait between busy events
			 */
			History.options.busyDelay = History.options.busyDelay || 250;

			/**
			 * History.options.initialTitle What is the title of the initial state
			 */
			History.options.initialTitle = History.options.initialTitle || document.title;

			// ====================================================================
			// Interval record

			/**
			 * History.intervalList List of intervals set, to be cleared when document is unloaded.
			 */
			History.intervalList = [];

			/**
			 * History.clearAllIntervals Clears all setInterval instances.
			 */
			History.clearAllIntervals = function () {
				var i, il = History.intervalList;
				if (typeof il !== "undefined" && il !== null) {
					for (i = 0; i < il.length; i++) {
						clearInterval(il[i]);
					}
					History.intervalList = null;
				}
			};

			// ====================================================================
			// Emulated Status

			/**
			 * History.emulated Which features require emulating?
			 */
			History.emulated = {
				pushState : !Boolean(window.history && window.history.pushState && window.history.replaceState
						&& !((/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent)
						|| (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent)
						)),
				hashChange : Boolean(!(('onhashchange' in window) || ('onhashchange' in document))
						|| (aria.core.Browser.isIE && (aria.core.Browser.isIE7 || aria.core.Browser.isIE6)))
			};

			/**
			 * History.enabled Is History enabled?
			 */
			History.enabled = !History.emulated.pushState;

			/**
			 * History.bugs Which bugs are present
			 */
			History.bugs = {
				/**
				 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a
				 * `replaceState` call https://bugs.webkit.org/show_bug.cgi?id=56249
				 */
				setHash : Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.'
						&& /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

				/**
				 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
				 * https://bugs.webkit.org/show_bug.cgi?id=42940
				 */
				safariPoll : Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.'
						&& /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),

				/**
				 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply
				 * function)
				 */
				ieDoubleCheck : Boolean(aria.core.Browser.isIE && aria.core.Browser.isIE7),

				/**
				 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
				 */
				hashEscape : Boolean(aria.core.Browser.isIE && aria.core.Browser.isIE6)
			};

			/**
			 * History.cloneObject(obj) Clones a object and eliminate all references to the original contexts
			 * @param {Object} obj
			 * @return {Object}
			 */
			History.cloneObject = function (obj) {
				var hash, newObj;
				if (obj) {
					hash = JSON.stringify(obj);
					newObj = JSON.parse(hash);
				} else {
					newObj = {};
				}
				return newObj;
			};

			// ====================================================================
			// URL Helpers

			/**
			 * History.getRootUrl() Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
			 * @return {String} rootUrl
			 */
			History.getRootUrl = function () {
				var rootUrl = document.location.protocol + '//'
						+ (document.location.hostname || document.location.host);
				if (document.location.port || false) {
					rootUrl += ':' + document.location.port;
				}
				rootUrl += '/';
				return rootUrl;
			};

			/**
			 * History.getBaseHref() Fetches the `href` attribute of the `<base href="...">` element if it exists
			 * @return {String} baseHref
			 */
			History.getBaseHref = function () {
				var baseElements = document.getElementsByTagName('base'), baseElement = null, baseHref = '';

				if (baseElements.length === 1) {
					baseElement = baseElements[0];
					baseHref = baseElement.href.replace(/[^\/]+$/, '');
				}

				// Adjust trailing slash
				baseHref = baseHref.replace(/\/+$/, '');
				if (baseHref)
					baseHref += '/';

				return baseHref;
			};

			/**
			 * History.getBaseUrl() Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
			 * @return {String} baseUrl
			 */
			History.getBaseUrl = function () {
				var baseUrl = History.getBaseHref() || History.getBasePageUrl() || History.getRootUrl();
				return baseUrl;
			};

			/**
			 * History.getPageUrl() Fetches the URL of the current page
			 * @return {String} pageUrl
			 */
			History.getPageUrl = function () {
				var State = History.getState(false, false), stateUrl = (State || {}).url || document.location.href, pageUrl;
				pageUrl = stateUrl.replace(/\/+$/, '').replace(/[^\/]+$/, function (part, index, string) {
					return (/\./).test(part) ? part : part + '/';
				});

				return pageUrl;
			};

			/**
			 * History.getBasePageUrl() Fetches the Url of the directory of the current page
			 * @return {String} basePageUrl
			 */
			History.getBasePageUrl = function () {
				var basePageUrl = document.location.href.replace(/[#\?].*/, '').replace(/[^\/]+$/, function (part,
						index, string) {
					return (/[^\/]$/).test(part) ? '' : part;
				}).replace(/\/+$/, '')
						+ '/';

				return basePageUrl;
			};

			/**
			 * History.getFullUrl(url) Ensures that we have an absolute URL and not a relative URL
			 * @param {string} url
			 * @param {Boolean} allowBaseHref
			 * @return {string} fullUrl
			 */
			History.getFullUrl = function (url, allowBaseHref) {
				var fullUrl = url, firstChar = url.substring(0, 1);
				allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

				if (/[a-z]+\:\/\//.test(url)) {} else if (firstChar === '/') {
					fullUrl = History.getRootUrl() + url.replace(/^\/+/, '');
				} else if (firstChar === '#') {
					fullUrl = History.getPageUrl().replace(/#.*/, '') + url;
				} else if (firstChar === '?') {
					fullUrl = History.getPageUrl().replace(/[\?#].*/, '') + url;
				} else {
					if (allowBaseHref) {
						fullUrl = History.getBaseUrl() + url.replace(/^(\.\/)+/, '');
					} else {
						fullUrl = History.getBasePageUrl() + url.replace(/^(\.\/)+/, '');
					}
				}

				return fullUrl.replace(/\#$/, '');
			};

			/**
			 * History.getShortUrl(url) Ensures that we have a relative URL and not a absolute URL
			 * @param {string} url
			 * @return {string} url
			 */
			History.getShortUrl = function (url) {
				var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

				// Trim baseUrl
				if (History.emulated.pushState) {
					// We are in a if statement as when pushState is not emulated
					// The actual url these short urls are relative to can change
					// So within the same session, we the url may end up somewhere different
					shortUrl = shortUrl.replace(baseUrl, '');
				}

				// Trim rootUrl
				shortUrl = shortUrl.replace(rootUrl, '/');

				// Ensure we can still detect it as a state
				if (History.isTraditionalAnchor(shortUrl)) {
					shortUrl = './' + shortUrl;
				}

				// Clean It
				shortUrl = shortUrl.replace(/^(\.\/)+/g, './').replace(/\#$/, '');

				return shortUrl;
			};

			// ====================================================================
			// State Storage

			/**
			 * History.store The store for all session specific data
			 */
			History.store = {};

			/**
			 * History.idToState 1-1: State ID to State Object
			 */
			History.idToState = History.idToState || {};

			/**
			 * History.stateToId 1-1: State String to State ID
			 */
			History.stateToId = History.stateToId || {};

			/**
			 * History.urlToId 1-1: State URL to State ID
			 */
			History.urlToId = History.urlToId || {};

			/**
			 * History.storedStates Store the states in an array
			 */
			History.storedStates = History.storedStates || [];

			/**
			 * History.savedStates Saved the states in an array
			 */
			History.savedStates = History.savedStates || [];

			/**
			 * History.noramlizeStore() Noramlize the store by adding necessary values
			 */
			History.normalizeStore = function () {
				History.store.idToState = History.store.idToState || {};
				History.store.urlToId = History.store.urlToId || {};
				History.store.stateToId = History.store.stateToId || {};
			};

			/**
			 * History.getState() Get an object containing the data, title and url of the current state
			 * @param {Boolean} friendly
			 * @param {Boolean} create
			 * @return {Object} State
			 */
			History.getState = function (friendly, create) {
				if (typeof friendly === 'undefined') {
					friendly = true;
				}
				if (typeof create === 'undefined') {
					create = true;
				}

				var State = History.getLastSavedState();

				if (!State && create) {
					State = History.createStateObject();
				}

				if (friendly) {
					State = History.cloneObject(State);
					State.url = State.cleanUrl || State.url;
				}
				return State;
			};

			/**
			 * History.getIdByState(State) Gets a ID for a State
			 * @param {State} newState
			 * @return {String} id
			 */
			History.getIdByState = function (newState) {
				var id = History.extractId(newState.url), str;

				if (!id) {
					str = History.getStateString(newState);
					if (typeof History.stateToId[str] !== 'undefined') {
						id = History.stateToId[str];
					} else if (typeof History.store.stateToId[str] !== 'undefined') {
						id = History.store.stateToId[str];
					} else {
						while (true) {
							id = (new Date()).getTime() + String(Math.random()).replace(/\D/g, '');
							if (typeof History.idToState[id] === 'undefined'
									&& typeof History.store.idToState[id] === 'undefined') {
								break;
							}
						}
						History.stateToId[str] = id;
						History.idToState[id] = newState;
					}
				}
				return id;
			};

			/**
			 * History.normalizeState(State) Expands a State Object
			 * @param {object} State
			 * @return {object}
			 */
			History.normalizeState = function (oldState) {
				var newState, dataNotEmpty;

				if (!oldState || (typeof oldState !== 'object')) {
					oldState = {};
				}
				if (typeof oldState.normalized !== 'undefined') {
					return oldState;
				}
				if (!oldState.data || (typeof oldState.data !== 'object')) {
					oldState.data = {};
				}

				newState = {};
				newState.normalized = true;
				newState.title = oldState.title || '';
				newState.url = History.getFullUrl(History.unescapeString(oldState.url || document.location.href));
				newState.hash = History.getShortUrl(newState.url);
				newState.data = History.cloneObject(oldState.data);

				newState.id = History.getIdByState(newState);

				newState.cleanUrl = newState.url.replace(/\??\&_suid.*/, '');
				newState.url = newState.cleanUrl;

				dataNotEmpty = !aria.utils.Object.isEmpty(newState.data);

				if (newState.title || dataNotEmpty) {
					newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/, '');
					if (!/\?/.test(newState.hash)) {
						newState.hash += '?';
					}
					newState.hash += '&_suid=' + newState.id;
				}

				newState.hashedUrl = History.getFullUrl(newState.hash);

				if ((History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState)) {
					newState.url = newState.hashedUrl;
				}

				return newState;
			};

			/**
			 * History.createStateObject(data,title,url) Creates a object based on the data, title and url state params
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {object}
			 */
			History.createStateObject = function (data, title, url) {
				var State = {
					'data' : data,
					'title' : title,
					'url' : url
				};

				State = History.normalizeState(State);
				return State;
			};

			/**
			 * History.getStateById(id) Get a state by it's UID
			 * @param {String} id
			 */
			History.getStateById = function (id) {
				id = String(id);
				var State = History.idToState[id] || History.store.idToState[id] || undefined;
				return State;
			};

			/**
			 * Get a State's String
			 * @param {State} passedState
			 */
			History.getStateString = function (passedState) {
				var State, cleanedState, str;

				State = History.normalizeState(passedState);

				cleanedState = {
					data : State.data,
					title : passedState.title,
					url : passedState.url
				};

				str = JSON.stringify(cleanedState);
				return str;
			};

			/**
			 * History.getHashByState(State) Creates a Hash for the State Object
			 * @param {State} passedState
			 * @return {String} hash
			 */
			History.getHashByState = function (passedState) {
				var State, hash;
				State = History.normalizeState(passedState);
				hash = State.hash;
				return hash;
			};

			/**
			 * History.extractId(url_or_hash) Get a State ID by it's URL or Hash
			 * @param {string} url_or_hash
			 * @return {string} id
			 */
			History.extractId = function (url_or_hash) {
				var id, parts, url;

				parts = /(.*)\&_suid=([0-9]+)$/.exec(url_or_hash);
				url = parts ? (parts[1] || url_or_hash) : url_or_hash;
				id = parts ? String(parts[2] || '') : '';
				return id || false;
			};

			/**
			 * History.isTraditionalAnchor Checks to see if the url is a traditional anchor or not
			 * @param {String} url_or_hash
			 * @return {Boolean}
			 */
			History.isTraditionalAnchor = function (url_or_hash) {
				var isTraditional = !(/[\/\?\.]/.test(url_or_hash));
				return isTraditional;
			};

			/**
			 * History.extractState Get a State by it's URL or Hash
			 * @param {String} url_or_hash
			 * @return {State|null}
			 */
			History.extractState = function (url_or_hash, create) {
				var State = null, id, url;
				create = create || false;

				// Fetch SUID
				id = History.extractId(url_or_hash);
				if (id) {
					State = History.getStateById(id);
				}

				// Fetch SUID returned no State
				if (!State) {
					url = History.getFullUrl(url_or_hash);
					id = History.getIdByUrl(url) || false;
					if (id) {
						State = History.getStateById(id);
					}
					if (!State && create && !History.isTraditionalAnchor(url_or_hash)) {
						State = History.createStateObject(null, null, url);
					}
				}
				return State;
			};

			/**
			 * History.getIdByUrl() Get a State ID by a State URL
			 */
			History.getIdByUrl = function (url) {
				var id = History.urlToId[url] || History.store.urlToId[url] || undefined;
				return id;
			};

			/**
			 * History.getLastSavedState() Get an object containing the data, title and url of the current state
			 * @return {Object} State
			 */
			History.getLastSavedState = function () {
				return History.savedStates[History.savedStates.length - 1] || undefined;
			};

			/**
			 * History.hasUrlDuplicate Checks if a Url will have a url conflict
			 * @param {Object} newState
			 * @return {Boolean} hasDuplicate
			 */
			History.hasUrlDuplicate = function (newState) {
				var hasDuplicate = false, oldState;
				oldState = History.extractState(newState.url);
				hasDuplicate = oldState && oldState.id !== newState.id;
				return hasDuplicate;
			};

			/**
			 * History.storeState Store a State
			 * @param {Object} newState
			 * @return {Object} newState
			 */
			History.storeState = function (newState) {
				History.urlToId[newState.url] = newState.id;
				History.storedStates.push(History.cloneObject(newState));
				return newState;
			};

			/**
			 * History.isLastSavedState(newState) Tests to see if the state is the last state
			 * @param {Object} newState
			 * @return {boolean} isLast
			 */
			History.isLastSavedState = function (newState) {
				var isLast = false, newId, oldState, oldId;
				if (History.savedStates.length) {
					newId = newState.id;
					oldState = History.getLastSavedState();
					oldId = oldState.id;
					isLast = (newId === oldId);
				}
				return isLast;
			};

			/**
			 * History.saveState Push a State
			 * @param {Object} newState
			 * @return {boolean} changed
			 */
			History.saveState = function (newState) {
				if (History.isLastSavedState(newState)) {
					return false;
				}
				History.savedStates.push(History.cloneObject(newState));
				return true;
			};

			/**
			 * History.getStateByIndex() Gets a state by the index
			 * @param {integer} index
			 * @return {Object}
			 */
			History.getStateByIndex = function (index) {
				var State = null;
				if (typeof index === 'undefined') {
					State = History.savedStates[History.savedStates.length - 1];
				} else if (index < 0) {
					State = History.savedStates[History.savedStates.length + index];
				} else {
					State = History.savedStates[index];
				}
				return State;
			};

			// ====================================================================
			// Hash Helpers

			/**
			 * History.getHash() Gets the current document hash
			 * @return {string}
			 */
			History.getHash = function () {
				var hash = History.unescapeHash(document.location.hash);
				return hash;
			};

			/**
			 * History.unescapeString() Unescape a string
			 * @param {String} str
			 * @return {string}
			 */
			History.unescapeString = function (str) {
				var result = str, tmp;
				while (true) {
					tmp = window.unescape(result);
					if (tmp === result) {
						break;
					}
					result = tmp;
				}
				return result;
			};

			/**
			 * History.unescapeHash() normalize and Unescape a Hash
			 * @param {String} hash
			 * @return {string}
			 */
			History.unescapeHash = function (hash) {
				var result = History.normalizeHash(hash);
				result = History.unescapeString(result);
				return result;
			};

			/**
			 * History.normalizeHash() normalize a hash across browsers
			 * @return {string}
			 */
			History.normalizeHash = function (hash) {
				var result = hash.replace(/[^#]*#/, '').replace(/#.*/, '');
				return result;
			};

			/**
			 * History.setHash(hash) Sets the document hash
			 * @param {string} hash
			 * @return {History}
			 */
			History.setHash = function (hash, queue) {
				var adjustedHash, State, pageUrl;
				if (queue !== false && History.busy()) {
					History.pushQueue({
						scope : History,
						callback : History.setHash,
						args : arguments,
						queue : queue
					});
					return false;
				}
				adjustedHash = History.escapeHash(hash);
				History.busy(true);
				State = History.extractState(hash, true);
				if (State && !History.emulated.pushState) {
					History.pushState(State.data, State.title, State.url, false);
				} else if (document.location.hash !== adjustedHash) {
					if (History.bugs.setHash) {
						// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

						// Fetch the base page
						pageUrl = History.getPageUrl();

						// Safari hash apply
						History.pushState(null, null, pageUrl + '#' + adjustedHash, false);
					} else {
						// Normal hash apply
						document.location.hash = adjustedHash;
					}
				}
				return History;
			};

			/**
			 * History.escape() normalize and Escape a Hash
			 * @return {string}
			 */
			History.escapeHash = function (hash) {
				var result = History.normalizeHash(hash);
				result = window.escape(result);

				// IE6 Escape Bug
				if (!History.bugs.hashEscape) {
					// Restore common parts
					result = result.replace(/\%21/g, '!').replace(/\%26/g, '&').replace(/\%3D/g, '=').replace(/\%3F/g, '?');
				}
				return result;
			};

			/**
			 * History.getHashByUrl(url) Extracts the Hash from a URL
			 * @param {string} url
			 * @return {string} url
			 */
			History.getHashByUrl = function (url) {
				var hash = String(url).replace(/([^#]*)#?([^#]*)#?(.*)/, '$2');
				hash = History.unescapeHash(hash);
				return hash;
			};

			/**
			 * History.setTitle(title) Applies the title to the document
			 * @param {State} newState
			 * @return {Boolean}
			 */
			History.setTitle = function (newState) {
				var title = newState.title, firstState;
				if (!title) {
					firstState = History.getStateByIndex(0);
					if (firstState && firstState.url === newState.url) {
						title = firstState.title || History.options.initialTitle;
					}
				}
				try {
					document.getElementsByTagName('title')[0].innerHTML = title.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
				} catch (Exception) {}
				document.title = title;
				return History;
			};

			// ====================================================================
			// Queueing
			History.queues = [];

			/**
			 * History.busy(value)
			 * @param {boolean} value [optional]
			 * @return {boolean} busy
			 */
			History.busy = function (value) {
				if (typeof value !== 'undefined') {
					History.busy.flag = value;
				} else if (typeof History.busy.flag === 'undefined') {
					History.busy.flag = false;
				}

				// Queue
				if (!History.busy.flag) {
					// Execute the next item in the queue
					clearTimeout(History.busy.timeout);
					var fireNext = function () {
						var i, queue, item;
						if (History.busy.flag)
							return;
						for (i = History.queues.length - 1; i >= 0; --i) {
							queue = History.queues[i];
							if (queue.length === 0)
								continue;
							item = queue.shift();
							History.fireQueueItem(item);
							History.busy.timeout = setTimeout(fireNext, History.options.busyDelay);
						}
					};
					History.busy.timeout = setTimeout(fireNext, History.options.busyDelay);
				}
				return History.busy.flag;
			};

			History.busy.flag = false;

			/**
			 * History.fireQueueItem(item) Fire a Queue Item
			 * @param {Object} item
			 * @return {Mixed} result
			 */
			History.fireQueueItem = function (item) {
				return item.callback.apply(item.scope || History, item.args || []);
			};

			/**
			 * History.pushQueue(callback,args) Add an item to the queue
			 * @param {Object} item [scope,callback,args,queue]
			 */
			History.pushQueue = function (item) {
				History.queues[item.queue || 0] = History.queues[item.queue || 0] || [];
				History.queues[item.queue || 0].push(item);
				return History;
			};

			/**
			 * History.queue (item,queue), (func,queue), (func), (item) Either firs the item now if not busy, or adds it
			 * to the queue
			 */
			History.queue = function (item, queue) {
				if (typeof item === 'function') {
					item = {
						callback : item
					};
				}
				if (typeof queue !== 'undefined') {
					item.queue = queue;
				}
				if (History.busy()) {
					History.pushQueue(item);
				} else {
					History.fireQueueItem(item);
				}
				return History;
			};

			// ====================================================================
			// IE Bug Fix

			/**
			 * History.stateChanged States whether or not the state has changed since the last double check was
			 * initialised
			 */
			History.stateChanged = false;

			/**
			 * History.doubleChecker Contains the timeout used for the double checks
			 */
			History.doubleChecker = false;

			/**
			 * History.doubleCheckComplete() Complete a double check
			 * @return {History}
			 */
			History.doubleCheckComplete = function () {
				History.stateChanged = true;
				History.doubleCheckClear();
				return History;
			};

			/**
			 * History.doubleCheckClear() Clear a double check
			 * @return {History}
			 */
			History.doubleCheckClear = function () {
				// Clear
				if (History.doubleChecker) {
					clearTimeout(History.doubleChecker);
					History.doubleChecker = false;
				}
				return History;
			};

			/**
			 * History.doubleCheck() Create a double check
			 * @return {History}
			 */
			History.doubleCheck = function (tryAgain) {
				// Reset
				History.stateChanged = false;
				History.doubleCheckClear();

				// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash
				// (whereas doing it manually does)
				// Fix Safari 5 bug where sometimes the state does not change:
				// https://bugs.webkit.org/show_bug.cgi?id=42940
				if (History.bugs.ieDoubleCheck) {
					// Apply Check
					History.doubleChecker = setTimeout(function () {
						History.doubleCheckClear();
						if (!History.stateChanged) {
							// Re-Attempt
							tryAgain();
						}
						return true;
					}, History.options.doubleCheckInterval);
				}
				return History;
			};

			// ====================================================================
			// Safari Bug Fix

			/**
			 * History.safariStatePoll() Poll the current state
			 * @return {History}
			 */
			History.safariStatePoll = function () {
				// Poll the URL

				// Get the Last State which has the new URL
				var urlState = History.extractState(document.location.href), newState;

				// Check for a difference
				if (!History.isLastSavedState(urlState)) {
					newState = urlState;
				} else {
					return;
				}

				// Check if we have a state with that url
				// If not create it
				if (!newState) {
					newState = History.createStateObject();
				}

				// Apply the New State
				History.Adapter.trigger(window, 'popstate');

				// Chain
				return History;
			};

			// ====================================================================
			// State Aliases

			/**
			 * History.back(queue) Send the browser history back one item
			 * @param {Integer} queue [optional]
			 */
			History.back = function (queue) {
				if (queue !== false && History.busy()) {
					History.pushQueue({
						scope : History,
						callback : History.back,
						args : arguments,
						queue : queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Fix certain browser bugs that prevent the state from changing
				History.doubleCheck(function () {
					History.back(false);
				});
				history.go(-1);
				return true;
			};

			/**
			 * History.forward(queue) Send the browser history forward one item
			 * @param {Integer} queue [optional]
			 */
			History.forward = function (queue) {
				if (queue !== false && History.busy()) {
					History.pushQueue({
						scope : History,
						callback : History.forward,
						args : arguments,
						queue : queue
					});
					return false;
				}

				// Make Busy + Continue
				History.busy(true);

				// Fix certain browser bugs that prevent the state from changing
				History.doubleCheck(function () {
					History.forward(false);
				});
				history.go(1);
				return true;
			};

			/**
			 * History.go(index,queue) Send the browser history back or forward index times
			 * @param {Integer} queue [optional]
			 */
			History.go = function (index, queue) {
				var i;
				if (index > 0) {
					// Forward
					for (i = 1; i <= index; ++i) {
						History.forward(queue);
					}
				} else if (index < 0) {
					// Backward
					for (i = -1; i >= index; --i) {
						History.back(queue);
					}
				} else {
					throw new Error('History.go: History.go requires a positive or negative integer passed.');
				}
				return History;
			};

			// ====================================================================
			// HTML5 State Support

			// Non-Native pushState Implementation
			if (History.emulated.pushState) {
				/*
				 * Provide Skeleton for HTML4 Browsers
				 */

				// Prepare
				var emptyFunction = function () {};
				History.pushState = History.pushState || emptyFunction;
				History.replaceState = History.replaceState || emptyFunction;
			} // History.emulated.pushState

			// Native pushState Implementation
			else {
				/*
				 * Use native HTML5 History API Implementation
				 */

				/**
				 * History.onPopState(event,extra) Refresh the Current State
				 */
				History.onPopState = function (event, extra) {
					var stateId = false, newState = false, currentHash, currentState;
					History.doubleCheckComplete();
					currentHash = History.getHash();
					if (currentHash) {
						currentState = History.extractState(currentHash || document.location.href, true);
						if (currentState) {
							// We were able to parse it, it must be a State!
							// Let's forward to replaceState
							History.replaceState(currentState.data, currentState.title, currentState.url, false);
						} else {
							// Traditional Anchor
							History.Adapter.trigger(window, 'anchorchange');
							History.busy(false);
						}

						History.expectedStateId = false;
						return false;
					}

					// Ensure
					stateId = History.Adapter.extractEventData('state', event, extra) || false;

					// Fetch State
					if (stateId) {
						// Vanilla: Back/forward button was used
						newState = History.getStateById(stateId);
					} else if (History.expectedStateId) {
						// Vanilla: A new state was pushed, and popstate was called manually
						newState = History.getStateById(History.expectedStateId);
					} else {
						// Initial State
						newState = History.extractState(document.location.href);
					}

					// The State did not exist in our store
					if (!newState) {
						// Regenerate the State
						newState = History.createStateObject(null, null, document.location.href);
					}

					// Clean
					History.expectedStateId = false;

					// Check if we are the same state
					if (History.isLastSavedState(newState)) {
						// There has been no change (just the page's hash has finally propagated)
						History.busy(false);
						return false;
					}

					// Store the State
					History.storeState(newState);
					History.saveState(newState);

					// Force update of the title
					History.setTitle(newState);

					// Fire Our Event
					History.Adapter.trigger(window, 'statechange');
					History.busy(false);
					return true;
				};
				History.Adapter.bind(window, 'popstate', History.onPopState);

				/**
				 * History.pushState(data,title,url) Add a new State to the history object, become it, and trigger
				 * onpopstate We have to trigger for HTML4 compatibility
				 * @param {object} data
				 * @param {string} title
				 * @param {string} url
				 * @return {true}
				 */
				History.pushState = function (data, title, url, queue) {
					if (History.getHashByUrl(url) && History.emulated.pushState) {
						throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
					}
					if (queue !== false && History.busy()) {
						History.pushQueue({
							scope : History,
							callback : History.pushState,
							args : arguments,
							queue : queue
						});
						return false;
					}

					// Make Busy + Continue
					History.busy(true);

					// Create the newState
					var newState = History.createStateObject(data, title, url);

					// Check it
					if (History.isLastSavedState(newState)) {
						// Won't be a change
						History.busy(false);
					} else {
						// Store the newState
						History.storeState(newState);
						History.expectedStateId = newState.id;

						// Push the newState
						history.pushState(newState.id, newState.title, newState.url);

						// Fire HTML5 Event
						History.Adapter.trigger(window, 'popstate');
					}
					return true;
				};

				/**
				 * History.replaceState(data,title,url) Replace the State and trigger onpopstate We have to trigger for
				 * HTML4 compatibility
				 * @param {object} data
				 * @param {string} title
				 * @param {string} url
				 * @return {true}
				 */
				History.replaceState = function (data, title, url, queue) {
					if (History.getHashByUrl(url) && History.emulated.pushState) {
						throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
					}
					if (queue !== false && History.busy()) {
						History.pushQueue({
							scope : History,
							callback : History.replaceState,
							args : arguments,
							queue : queue
						});
						return false;
					}

					// Make Busy + Continue
					History.busy(true);

					// Create the newState
					var newState = History.createStateObject(data, title, url);

					// Check it
					if (History.isLastSavedState(newState)) {
						// Won't be a change
						History.busy(false);
					} else {
						// Store the newState
						History.storeState(newState);
						History.expectedStateId = newState.id;

						// Push the newState
						history.replaceState(newState.id, newState.title, newState.url);

						// Fire HTML5 Event
						History.Adapter.trigger(window, 'popstate');
					}
					return true;
				};

			} // !History.emulated.pushState

			// ====================================================================
			// Initialise

			/**
			 * Load the Store
			 */
			if (sessionStorage) {
				// Fetch
				try {
					History.store = JSON.parse(sessionStorage.getItem('History.store')) || {};
				} catch (err) {
					History.store = {};
				}

				// Normalize
				History.normalizeStore();
			} else {
				// Default Load
				History.store = {};
				History.normalizeStore();
			}

			/**
			 * Clear Intervals on exit to prevent memory leaks
			 */
			History.Adapter.bind(window, "beforeunload", History.clearAllIntervals);
			History.Adapter.bind(window, "unload", History.clearAllIntervals);

			/**
			 * Create the initial State
			 */
			History.saveState(History.storeState(History.extractState(document.location.href, true)));

			/**
			 * Bind for Saving Store
			 */
			if (sessionStorage) {
				// When the page is closed
				History.onUnload = function () {
					var currentStore, item;
					try {
						currentStore = JSON.parse(sessionStorage.getItem('History.store')) || {};
					} catch (err) {
						currentStore = {};
					}

					// Ensure
					currentStore.idToState = currentStore.idToState || {};
					currentStore.urlToId = currentStore.urlToId || {};
					currentStore.stateToId = currentStore.stateToId || {};

					// Sync
					for (item in History.idToState) {
						if (!History.idToState.hasOwnProperty(item)) {
							continue;
						}
						currentStore.idToState[item] = History.idToState[item];
					}
					for (item in History.urlToId) {
						if (!History.urlToId.hasOwnProperty(item)) {
							continue;
						}
						currentStore.urlToId[item] = History.urlToId[item];
					}
					for (item in History.stateToId) {
						if (!History.stateToId.hasOwnProperty(item)) {
							continue;
						}
						currentStore.stateToId[item] = History.stateToId[item];
					}

					// Update
					History.store = currentStore;
					History.normalizeStore();

					// Store
					sessionStorage.setItem('History.store', JSON.stringify(currentStore));
					JSON.$dispose();
					if (History.onPopStateCb !== undefined) {
						aria.utils.HashManager.removeCallback(History.onPopStateCb);
					}
					if (History.onHashChangeCb !== undefined) {
						aria.utils.HashManager.removeCallback(History.onHashChangeCb);
					}
				};
			}

			// Non-Native pushState Implementation
			if (!History.emulated.pushState) {
				// Be aware, the following is only for native pushState implementations
				// If you are wanting to include something for all browsers
				// Then include it above this if block

				/**
				 * Setup Safari Fix
				 */
				if (History.bugs.safariPoll) {
					History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
				}

				/**
				 * Ensure Cross Browser Compatibility
				 */
				if (navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName || '') === 'Mozilla') {
					/**
					 * Fix Safari HashChange Issue
					 */
					History.onPopStateCb = {
						fn : function () {
							History.Adapter.trigger(window, 'popstate');
						}
					};
					aria.utils.HashManager.addCallback(History.onPopStateCb);

					// Initialise Alias
					if (History.getHash()) {
						History.Adapter.onDomLoad(function () {
							History.Adapter.trigger(window, 'hashchange');
						});
					}
				}
			} // !History.emulated.pushState
		}; // History.initCore
	})(Aria.$window);

	/**
	 * Class to manage the History for HTML4/HTML5 Browsers
	 * @singleton
	 */

	Aria.classDefinition({
		$classpath : "aria.utils.History",
		$singleton : true,
		$dependencies : ["aria.core.Browser", "aria.utils.Object", "aria.utils.HashManager"],
		$constructor : function () {
			// Initialise History
			History.init();
			History.Adapter.bind(Aria.$window, 'statechange', function () {
				aria.utils.History.$raiseEvent({
					name : "onpopstate",
					state : History.getState()
				});
			});
		},
		$destructor : function () {
			History.onUnload();
		},
		$events : {
			"onpopstate" : {
				description : "Notify window when a state is popped and rise is event",
				properties : {
					state : "The state that has been popped."
				}
			}
		},
		$prototype : {
			/**
			 * Gets the current state of the browser
			 * @return {object} with data, title and url
			 */
			getState : function () {
				return History.getState();
			},

			/**
			 * Go back once through the history (same as hitting the browser's back button)
			 */
			back : function () {
				History.back();
			},

			/**
			 * Go forward once through the history (same as hitting the browser's forward button)
			 */
			forward : function () {
				History.forward();
			},

			/**
			 * Go back or forward through the history x times
			 * @param {Number} x positive to go forward, negative to go back
			 */
			go : function (x) {
				History.go(x);
			},

			/**
			 * Pushes a new state to the browser
			 * @param {null|Object} data
			 * @param {null|String} title
			 * @param {String} url
			 */
			pushState : function (data, title, url) {
				History.pushState(data, title, url);
			},

			/**
			 * Replaces the existing state with a new state to the browser
			 * @param {null|Object} data
			 * @param {null|String} title
			 * @param {String} url
			 */
			replaceState : function (data, title, url) {
				History.replaceState(data, title, url);
			}
		}
	});
})();

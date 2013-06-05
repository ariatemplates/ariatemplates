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
 * Base class that is extended in order to provide page navigation, whether it is based on hash or on history API.
 * Classes extending it have to implement a getUrl method in their prototype.
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.BaseNavigationManager",
    $dependencies : ["aria.storage.LocalStorage", "aria.utils.Event", "aria.utils.Type"],
    $statics : {

        /**
         * Key prefix that is used in order to save cached information in the local storage
         * @type String
         */
        STORAGE_KEY_PREFIX : "at_pe_navigation_cache",

        /**
         * Represents the default number of seconds after which the items in the cache retrieved from the local storage
         * are considered expired. It is used if nothing else is specified in the options of the constructor.
         * @type Number
         */
        EXPIRATION_TIME : 86400
    },

    /**
     * @param {aria.core.CfgBeans.Callback} cb Callback called on pop state. It corresponds to a navigate method
     * @param {aria.core.CfgBeans.Site.$properties.storage} options Options for local storage
     */
    $constructor : function (cb, options) {

        options = options || {};

        /**
         * Callback called on url change. It corresponds to a navigate method
         * @type aria.core.CfgBeans.Callback
         * @private
         */
        this._navigate = cb || null;

        if (options.active) {

            /**
             * Key that is used in order to save cached information in the local storage
             * @type String
             * @protected
             */
            this._storageKey = this.STORAGE_KEY_PREFIX + options.suffix;

            /**
             * Number of seconds after which the items in the cache retrieved from the local storage are considered
             * expired
             * @type Integer
             * @protected
             */
            this._expiresAfter = aria.utils.Type.isNumber(options.expiresAfter)
                    ? options.expiresAfter
                    : this.EXPIRATION_TIME;

            /**
             * Used to store state information for page refresh and external navigation
             * @type aria.storage.LocalStorage
             * @private
             */
            this._storage = new aria.storage.LocalStorage();

            /**
             * Called on window unload.
             * @type aria.core.CfgBeans.Callback
             * @private
             */
            this._saveCacheCB = {
                fn : this._saveCache,
                scope : this
            };

            aria.utils.Event.addListener(Aria.$window, "unload", this._saveCacheCB);

            /**
             * Contains the association between hashes and pageIds for already visited pages
             * @type Object
             * @private
             */
            this._cache = this._storage.getItem(this._storageKey) || {};

            this._removeOldCache();

        } else {

            this._storage = null;
            this._cache = {};
        }

    },
    $destructor : function () {
        this._navigate = null;
        if (this._storage) {
            this._saveCache();
        }
        this._cache = null;
    },
    $prototype : {

        /**
         * @return {String} Id of current page. If yet unknown, null will be returned
         */
        getPageId : function () {
            var cached = this._cache[this.getUrl()];
            return cached ? cached.id : null;
        },

        /**
         * Save the states that are still valid and needed in order to support page refresh and external navigation.
         * Called on window unload.
         * @protected
         */
        _saveCache : function () {
            if (this._storage) {
                this._removeOldCache();
                this._storage.setItem(this._storageKey, this._cache);
                this._storage.$dispose();
                this._storage = null;
            }
            aria.utils.Event.removeListener(Aria.$window, "unload", this._saveCacheCB);
        },

        /**
         * Remove old cache items. An item considered old if has been stored more than EXPIRATION_TIME seconds before
         * @protected
         */
        _removeOldCache : function () {
            var cache = this._cache;
            var expirationTime = ((new Date()).getTime() - this._expiresAfter * 1000);

            for (var url in cache) {
                if (cache.hasOwnProperty(url) && cache[url].age < expirationTime) {
                    delete cache[url];
                }
            }
        },

        /**
         * Add an entry in the cache by decorationg it with a timestamp
         * @param {String} url
         * @param {String} pageId
         * @protected
         */
        _addInCache : function (url, pageId) {
            this._cache[url] = {
                id : pageId,
                age : (new Date()).getTime()
            };
        },

        /**
         * Return the cache object
         * @return {Object}
         */
        getCache : function () {
            return this._cache;
        }
    }
});

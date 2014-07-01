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
 * Utility class that manages the change of url by only changing the hash
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.HashManager",
    $extends : "aria.pageEngine.utils.BaseNavigationManager",
    $dependencies : ["aria.utils.HashManager", "aria.utils.Type"],
    /**
     * @param {aria.core.CfgBeans:Callback} cb Callback called on hash change. It corresponds to a navigate method
     * @param {aria.core.CfgBeans:Site.storage} options Options for local storage
     */
    $constructor : function (cb, options) {

        this.$BaseNavigationManager.constructor.apply(this, arguments);

        /**
         * Shortcut to the hash manager
         * @type aria.utils.HashManager
         * @protected
         */
        this._hashManager = aria.utils.HashManager;

        /**
         * Listener of the hashchange
         * @type aria.core.CfgBeans:Callback
         * @protected
         */
        this._onHashChangeCallback = {
            fn : this._onHashChange,
            scope : this
        };

        /**
         * @type String
         * @protected
         */
        this._lastPageId = null;

        this._hashManager.addCallback(this._onHashChangeCallback);
    },
    $destructor : function () {
        this._hashManager.removeCallback(this._onHashChangeCallback);
        this._onHashChangeCallback = null;
        this._hashManager = null;
        this.$BaseNavigationManager.$destructor.call(this);
    },
    $prototype : {

        /**
         * Retrieves the pageId from the cache and navigates to it
         * @protected
         */
        _onHashChange : function () {
            var url = this.getUrl();
            var pageId = this._cache[url] ? this._cache[url].id : null;
            if (pageId) {
                if (this._navigate) {
                    this.$callback(this._navigate, {
                        pageId : pageId,
                        url : url
                    });
                }
            } else {
                this._addInCache(url, this._lastPageId);
            }
        },

        /**
         * Updates the history according to the specified page parameters
         * @param {aria.pageEngine.CfgBeans:PageRequest} pageRequest
         */
        update : function (pageRequest) {
            var url = pageRequest.url, title = pageRequest.title, pageId = pageRequest.pageId, typeUtil = aria.utils.Type;
            this._lastPageId = pageId;
            if (typeUtil.isString(url)) {
                this._addInCache(url, pageId);
                if (this.getUrl() != url) {
                    this._hashManager.setHash(url);
                }
            }
            if (typeUtil.isString(title)) {
                Aria.$window.document.title = title;
            }

        },

        /**
         * @return {String} pathname or hash, according to the browser
         */
        getUrl : function () {
            return this._hashManager.getHashString();
        }
    }
});

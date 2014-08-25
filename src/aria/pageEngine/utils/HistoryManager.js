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
var ariaUtilsHistory = require("../../utils/History");
var ariaUtilsType = require("../../utils/Type");
var ariaPageEngineUtilsBaseNavigationManager = require("./BaseNavigationManager");


/**
 * Utility class that manages the history of the application
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.HistoryManager",
    $extends : ariaPageEngineUtilsBaseNavigationManager,
    /**
     * @param {aria.core.CfgBeans:Callback} cb Callback called on pop state. It corresponds to a navigate method
     * @param {aria.core.CfgBeans:Site.storage} options Options for local storage
     */
    $constructor : function (cb, options) {

        this.$BaseNavigationManager.constructor.apply(this, arguments);

        /**
         * Shortcut to the History utility
         * @type aria.utils.History
         * @private
         */
        this._history = ariaUtilsHistory;

        /**
         * Listener of the popstate event raised by the History
         * @type aria.core.CfgBeans:Callback
         * @private
         */
        this._onPopStateCallback = {
            fn : this._onPopState,
            scope : this
        };

        this._history.$addListeners({
            "popstate" : this._onPopStateCallback
        });

        /**
         * Whether a popstate event has just been raised. Useful in order to know if the update of the history
         * information has to be done
         * @type Boolean
         * @protected
         */
        this._poppedState = false;

    },
    $destructor : function () {
        this._history.$removeListeners({
            "popstate" : this._onPopStateCallback
        });
        this._onPopStateCallback = null;
        this._history = null;
        this.$BaseNavigationManager.$destructor.call(this);
    },
    $prototype : {

        /**
         * Retrieves the pageId from the cache and navigates to it
         * @private
         */
        _onPopState : function () {
            var url = this.getUrl();
            var pageId = this._cache[url] ? this._cache[url].id : null;
            if (pageId && this._navigate) {
                this._poppedState = true;
                this.$callback(this._navigate, {
                    pageId : pageId,
                    url : url,
                    title : this.getTitle()
                });
            }
        },

        /**
         * Updates the history according to the specified page parameters
         * @param {aria.pageEngine.CfgBeans:PageNavigationInformation} pageRequest
         */
        update : function (pageRequest) {
            var url = pageRequest.url;
            if (ariaUtilsType.isString(url)) {
                this._addInCache(url, pageRequest.pageId);
                if (!this._poppedState) {
                    if (pageRequest.replace) {
                        this._history.replaceState(pageRequest.data, pageRequest.title, url);
                    } else {
                        this._history.pushState(pageRequest.data, pageRequest.title, url);
                    }
                }
                this._poppedState = false;
            }
        },

        /**
         * @return {String} pathname or hash, according to the browser
         */
        getUrl : function () {
            var url = this._history.getUrl();
            return (url == Aria.$window.location.href) ? "" : url;
        },

        /**
         * @return {String} current title
         */
        getTitle : function () {
            return this._history.getTitle();
        }
    }
});

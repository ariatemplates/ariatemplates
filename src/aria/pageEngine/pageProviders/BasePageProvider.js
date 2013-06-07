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
 * Base Page provider for static site configuration and page definitions
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.pageProviders.BasePageProvider",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $dependencies : ["aria.core.DownloadMgr"],

    /**
     * @param {aria.pageEngine.pageProviders.BasePageProviderBeans.Config} config
     */
    $constructor : function (config) {

        /**
         * Configuration for the base provider
         * @type aria.pageEngine.pageProviders.BasePageProviderBeans.Config
         * @private
         */
        this._config = config;

        if (!("cache" in config)) {
            config.cache = true;
        }

        /**
         * Contains the pageDefinitions by url or pageId
         * @type Object
         * @private
         */
        this._cache = {};

        /**
         * Map pageIds to urls and viceversa
         * @type Object
         * @private
         */
        this._urlMap = {
            pageIdToUrl : {},
            urlToPageId : {}
        };

    },
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            this._sendRequest(aria.core.DownloadMgr.resolveURL(this._config.siteConfigLocation), {
                callback : callback
            }, "site");
        },

        /**
         * @param {aria.pageEngine.CfgBeans.PageRequest} pageRequest
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {
            pageRequest = pageRequest || {};
            var pageId = this._getPageId(pageRequest);
            pageRequest.pageId = pageId;
            this._updateUrlMap(pageRequest);
            var pageDefinition = this._config.cache ? this._retrieveFromCache(pageRequest) : null;
            if (pageDefinition) {
                this.$callback(callback.onsuccess, this.processPageDefinition(pageDefinition));
                return;
            }
            var pageUrl = aria.core.DownloadMgr.resolveURL(this._config.pageBaseLocation + pageId + ".json");
            this._sendRequest(pageUrl, {
                pageRequest : pageRequest,
                callback : callback
            }, "page");
        },

        /**
         * Process the site configuration before sending it back to the page engine
         * @param {Object} siteConf Site configuration retrieved from .json file
         * @return {aria.pageEngine.CfgBeans.Site}
         */
        processSiteConfig : function (siteConf) {
            return siteConf;
        },

        /**
         * Process the page definition before sending it back to the page engine
         * @param {Object} pageDef Page definition retrieved from .json file
         * @return {aria.pageEngine.CfgBeans.PageDefinition}
         */
        processPageDefinition : function (pageDef) {
            return pageDef;
        },

        /**
         * Send a request for the site or page json
         * @param {String} url location of the json
         * @param {Object} args passed to the callback
         *
         * <pre>
         * {
         *     callback : object of type aria.pageEngine.CfgBeans.ExtendedCallback,
         *     pageRequest : object of type aria.pageEngine.CfgBeans.PageRequest
         * }
         * </pre>
         *
         * @param {String} type either "site" or "page"
         * @private
         */
        _sendRequest : function (url, args, type) {
            aria.core.IO.asyncRequest({
                url : url,
                expectedResponseType : "json",
                callback : {
                    fn : (type == "page") ? this._onPageSuccess : this._onSiteSuccess,
                    scope : this,
                    args : args,
                    onerror : this._onFailure
                }
            });
        },

        /**
         * Call the success callback by providing the site configuration as argument
         * @param {Object} res response
         * @param {Object} args
         *
         * <pre>
         * {
         *     callback : object of type aria.pageEngine.CfgBeans.ExtendedCallback,
         *     pageRequest : object of type aria.pageEngine.CfgBeans.PageRequest
         * }
         * </pre>
         *
         * @private
         */
        _onSiteSuccess : function (res, args) {
            var siteConfig = this.processSiteConfig(res.responseJSON);
            this.$callback(args.callback.onsuccess, siteConfig);
        },

        /**
         * Call the success callback by providing the page definition as argument. If it does not contain a url, the
         * pageId is aused as url. If the cache is enbled, it is filled with the response
         * @param {Object} res response
         * @param {Object} args
         *
         * <pre>
         * {
         *     callback : object of type aria.pageEngine.CfgBeans.ExtendedCallback,
         *     pageRequest : object of type aria.pageEngine.CfgBeans.PageRequest
         * }
         * </pre>
         *
         * @private
         */
        _onPageSuccess : function (res, args) {
            var callback = args.callback, pageRequest = args.pageRequest;

            var pageDefinition = res.responseJSON;
            this._updateUrlMap(pageDefinition);

            var url = this._getUrl(pageRequest);
            if (this._config.cache) {
                this._updateCache(pageDefinition, {
                    url : url
                });
            }
            pageDefinition.url = url;
            this._updateUrlMap(pageDefinition);
            this.$callback(callback.onsuccess, this.processPageDefinition(pageDefinition));
        },

        /**
         * Call the failure callback
         * @param {Object} res response
         * @param {Object} callback
         *
         * <pre>
         * {
         *     callback : object of type aria.pageEngine.CfgBeans.ExtendedCallback,
         *     pageRequest : object of type aria.pageEngine.CfgBeans.PageRequest
         * }
         * </pre>
         *
         * @private
         */
        _onFailure : function (res, args) {
            this.$callback(args.callback.onfailure);
        },

        /**
         * Update the pageId <-> url associations
         * @param {aria.pageEngine.CfgBeans.PageRequest} pageRequest
         * @private
         */
        _updateUrlMap : function (pageRequest) {
            var pageId = pageRequest.pageId, url = pageRequest.url, urlMap = this._urlMap;
            if (pageId && url) {
                urlMap.pageIdToUrl[pageId] = url;
                urlMap.urlToPageId[url] = pageId;
                var alternativeUrl = url.replace(/\/$/, "");
                urlMap.urlToPageId[alternativeUrl] = pageId;
            }
        },

        /**
         * Get a page definition from the cache by updating also its url
         * @param {aria.pageEngine.CfgBeans.PageRequest} pageRequest
         * @return {aria.pageEngine.CfgBeans.PageDefinition}
         * @private
         */
        _retrieveFromCache : function (pageRequest) {
            var pageId = this._getPageId(pageRequest);
            if (pageId && this._cache[pageId]) {
                var pageDef = this._cache[pageId];
                pageDef.url = this._getUrl(pageRequest);
                return pageDef;
            }
            return null;
        },

        /**
         * Retrieve the pageId based on the pageRequest information, as well as the url map. As a default, the
         * homePageId is returned
         * @param {aria.pageEngine.CfgBeans.PageRequest} pageRequest
         * @return {String} the pageId
         */
        _getPageId : function (pageRequest) {
            var map = this._urlMap.urlToPageId, pageId = pageRequest.pageId, url = pageRequest.url;
            if (pageId) {
                return pageId;
            }
            if (url) {
                var returnUrl = map[url] || map[url + "/"] || map[url.replace(/\/$/, "")];
                if (returnUrl) {
                    return returnUrl;
                }
            }
            return this._config.homePageId;
        },

        /**
         * Retrieve the url based on the pageRequest information, as well as the url map. As a default, the "/[pageId]"
         * is returned
         * @param {aria.pageEngine.CfgBeans.PageRequest} pageRequest
         * @return {String} the pageId
         * @private
         */
        _getUrl : function (pageRequest) {
            var map = this._urlMap.pageIdToUrl, pageId = pageRequest.pageId, url = pageRequest.url;
            if (url) {
                return url;
            }
            if (pageId && map[pageId]) {
                return map[pageId];
            }
            return "/" + pageId;
        },

        /**
         * Update the cache
         * @param {aria.pageEngine.CfgBeans.PageDefinition} pageDef
         * @param {aria.pageEngine.CfgBeans.PageRequest} pageRequest
         * @private
         */
        _updateCache : function (pageDef, pageRequest) {
            var url = pageRequest.url;
            var pageDefUrl = pageDef.url;
            if (pageDefUrl) {
                this._cache[pageDefUrl] = pageDef;
            }
            this._cache[pageDef.pageId] = pageDef;
            this._cache[url] = pageDef;
        }

    }
});

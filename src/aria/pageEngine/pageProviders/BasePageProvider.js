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
     * @param {aria.pageEngine.pageProviders.BasePageProviderBeans:Config} config
     */
    $constructor : function (config) {

        /**
         * Configuration for the base provider
         * @type aria.pageEngine.pageProviders.BasePageProviderBeans:Config
         * @private
         */
        this.__config = config;

        /**
         * Base location of pages
         * @type String
         * @private
         */
        this.__basePageUrl = null;

        if (!("cache" in config)) {
            config.cache = true;
        }

        /**
         * Map pageIds to urls and viceversa
         * @type Object
         * @private
         */
        this.__urlMap = {
            pageIdToUrl : {},
            urlToPageId : {}
        };

    },
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans:ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            this.__sendRequest(this.__config.siteConfigLocation, {
                callback : callback
            }, "site");
        },

        /**
         * @param {aria.pageEngine.CfgBeans:PageRequest} pageRequest
         * @param {aria.pageEngine.CfgBeans:ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {
            pageRequest = pageRequest || {};
            var pageId = this.__getPageId(pageRequest);
            pageRequest.pageId = pageId;
            this.__updateUrlMap(pageRequest);

            this.__basePageUrl = this.__basePageUrl
                    || (this.__config.pageBaseLocation + "fake.json").replace(/fake\.json$/, "");
            var pageUrl = this.__basePageUrl + pageId + ".json";

            if (!this.__config.cache) {
                aria.core.DownloadMgr.clearFile(pageUrl);
            }

            this.__sendRequest(pageUrl, {
                pageRequest : pageRequest,
                callback : callback
            }, "page");
        },

        /**
         * Process the site configuration before sending it back to the page engine
         * @param {Object} siteConf Site configuration retrieved from .json file
         * @return {aria.pageEngine.CfgBeans:Site}
         */
        processSiteConfig : function (siteConf) {
            return siteConf;
        },

        /**
         * Process the page definition before sending it back to the page engine
         * @param {Object} pageDef Page definition retrieved from .json file
         * @return {aria.pageEngine.CfgBeans:PageDefinition}
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
         *     callback : object of type aria.pageEngine.CfgBeans:ExtendedCallback,
         *     pageRequest : object of type aria.pageEngine.CfgBeans:PageRequest
         * }
         * </pre>
         *
         * @param {String} type either "site" or "page"
         * @private
         */
        __sendRequest : function (url, args, type) {
            aria.core.DownloadMgr.loadFile(url, {
                fn : this.__onRawFileReceive,
                scope : this,
                args : {
                    fn : (type == "page") ? this.__onPageSuccess : this.__onSiteSuccess,
                    scope : this,
                    args : args
                }
            });
        },

        /**
         * Retrieve the file content after it has been downloaded and parses it to turn it into a JSON object
         * @param {Object} res Response received from the loadFile method of aria.core.DownloadManager
         * @param {aria.core.CfgBeans:Callback} cb Callback to be called after the response has been parsed
         */
        __onRawFileReceive : function (res, cb) {
            if (res.downloadFailed) {
                this.__onFailure(res, cb.args);
            } else {
                var fileContent = aria.core.DownloadMgr.getFileContent(res.logicalPaths[0]);
                var responseJSON = aria.utils.Json.load(fileContent);
                if (responseJSON) {
                    this.$callback(cb, responseJSON);
                } else {
                    this.__onFailure(res, cb.args);
                }
            }
        },

        /**
         * Call the success callback by providing the site configuration as argument
         * @param {Object} res Site configuration retrieved from .json file
         * @param {Object} args
         *
         * <pre>
         * {
         *     callback : object of type aria.pageEngine.CfgBeans:ExtendedCallback,
         *     pageRequest : object of type aria.pageEngine.CfgBeans:PageRequest
         * }
         * </pre>
         *
         * @private
         */
        __onSiteSuccess : function (res, args) {
            var siteConfig = this.processSiteConfig(res);
            this.$callback(args.callback.onsuccess, siteConfig);
        },

        /**
         * Call the success callback by providing the page definition as argument. If it does not contain a url, the
         * pageId is aused as url. If the cache is enbled, it is filled with the response
         * @param {Object} pageDefinition Page definition retrieved from .json file
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
        __onPageSuccess : function (pageDefinition, args) {
            var callback = args.callback, pageRequest = args.pageRequest;
            this.__updateUrlMap(pageDefinition);
            var url = this.__getUrl(pageRequest);
            pageDefinition.url = url;
            this.__updateUrlMap(pageDefinition);
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
        __onFailure : function (res, args) {
            this.$callback(args.callback.onfailure);
        },

        /**
         * Update the pageId <-> url associations
         * @param {aria.pageEngine.CfgBeans:PageRequest} pageRequest
         * @private
         */
        __updateUrlMap : function (pageRequest) {
            var pageId = pageRequest.pageId, url = pageRequest.url, urlMap = this.__urlMap;
            if (pageId && url) {
                urlMap.pageIdToUrl[pageId] = url;
                urlMap.urlToPageId[url] = pageId;
                var alternativeUrl = url.replace(/\/$/, "");
                urlMap.urlToPageId[alternativeUrl] = pageId;
            }
        },

        /**
         * Retrieve the pageId based on the pageRequest information, as well as the url map. As a default, the
         * homePageId is returned
         * @param {aria.pageEngine.CfgBeans:PageRequest} pageRequest
         * @return {String} the pageId
         * @private
         */
        __getPageId : function (pageRequest) {
            var map = this.__urlMap.urlToPageId, pageId = pageRequest.pageId, url = pageRequest.url;
            if (pageId) {
                return pageId;
            }
            if (url) {
                var returnUrl = map[url] || map[url + "/"] || map[url.replace(/\/$/, "")];
                if (returnUrl) {
                    return returnUrl;
                }
            }
            return this.__config.homePageId;
        },

        /**
         * Retrieve the url based on the pageRequest information, as well as the url map. As a default, the "/[pageId]"
         * is returned
         * @param {aria.pageEngine.CfgBeans:PageRequest} pageRequest
         * @return {String} the pageId
         * @private
         */
        __getUrl : function (pageRequest) {
            var map = this.__urlMap.pageIdToUrl, pageId = pageRequest.pageId, url = pageRequest.url;
            if (url) {
                return url;
            }
            if (pageId && map[pageId]) {
                return map[pageId];
            }
            return "/" + pageId;
        }
    }
});

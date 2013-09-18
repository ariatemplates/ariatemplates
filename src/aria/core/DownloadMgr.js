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
var Aria = require("../Aria");
var ariaCoreCache = require("./Cache");
var ariaCoreFileLoader = require("./FileLoader");

/**
 * Download Manager manages file download synchronization thanks to the FileLoader and Cache. When multiple files are
 * associated to the same physical URL, makes sure listeneres are associated to the same loader Manage logical path /
 * physical URL mapping (the same physical URL can be used for multiple logical paths in case of multipart (packaged)
 * files) thanks to the Url Map.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.DownloadMgr",
    $singleton : true,
    $constructor : function () {

        /**
         * Download Manager Cache
         * @protected
         * @type aria.core.Cache
         */
        this._cache = null;

        /**
         * Map between path/packages and a given file to load. <br />
         * '*' as a key will allow to match any class of a package <br />
         * '**' as a key will allow to match any class and subpackages in a package
         * @protected
         * @type Object
         */
        this._urlMap = {};

        /**
         * Map between a package and a rootUrl where to find this package '*' as a key will allow to match any
         * subPackage of a package
         * @protected
         * @type Object
         */
        this._rootMap = {};

        /**
         * Json utils shortcut
         * @protected
         * @type aria.utils.Json
         */
        this._jsonUtils = (require("../utils/Json"));

        /**
         * Type utils shortcut
         * @protected
         * @type aria.utils.Type
         */
        this._typeUtils = (require("../utils/Type"));

        /**
         * Map of URLs for which it is desired to bypass the browser cache.
         * @protected
         * @type Object
         */
        this._timestampURL = {};
    },
    $destructor : function () {
        this._cache = null;
        this._urlMap = null;
        this._rootMap = null;
        this._jsonUtils = null;
        this._timestampURL = null;
    },
    $prototype : {

        /**
         * Update the url map with the given structure
         * @param {Object} map
         */
        updateUrlMap : function (map) {
            this._jsonUtils.inject(map, this._urlMap, true);
        },

        /**
         * Update the url map with the given structure
         * @param {Object} map
         */
        updateRootMap : function (map) {
            this._jsonUtils.inject(map, this._rootMap, true);
        },

        /**
         * Mark the url as needing (or not) a timestamp when loading it next time (to bypass browser and server cache)
         * @param {String} url URL for which the timestamp setting will change
         * @param {Boolean} activate [optional, default true] if false, the timestamp will be disabled for the url,
         * otherwise it will be enabled
         */
        enableURLTimestamp : function (url, activate) {
            if (activate !== false) {
                this._timestampURL[url] = true;
            } else {
                delete this._timestampURL[url];
            }
        },

        /**
         * Add a timestamp to the given URL if it should bypass browser cache.
         * @param {String} url URL for which a timestamp should be added if necessary
         * @param {Boolean} force if true, the timestamp will always be added
         * @return {String} URL with the added timestamp if this is required
         */
        getURLWithTimestamp : function (url, force) {
            if (force || this._timestampURL[url]) {
                var timestamp = (new Date()).getTime();
                if (url.indexOf("?") != -1) {
                    return url + "&timestamp=" + timestamp;
                } else {
                    return url + "?timestamp=" + timestamp;
                }
            } else {
                return url;
            }
        },

        /**
         * Return an url list from an array containing the starting url, this function is usefull to retrieve package
         * name with md5 from the name without it
         * @param {String|Array} urls starting url string
         * @return {Array} array of full url
         */
        getPackages : function (urls) {

            if (this._typeUtils.isString(urls)) {
                urls = [urls];
            }

            var _getPackages = function (urls, urlMap, packages) {
                if (urls.length === 0) {
                    // everything has been found, leave back the recursive loop
                    return;
                }
                for (var key in urlMap) {
                    var value = urlMap[key];
                    if (typeof(value) == 'string') {
                        value = "/" + value;
                        // Check if something match
                        for (var i = 0, ii = urls.length; i < ii; i++) {
                            var file = urls[i];
                            if (value.substr(0, file.length) == file) {
                                packages[value] = true;
                                // remove found item from the url list, for performance reason
                                urls.slice(i, i);
                                break;
                            }
                        }
                    } else {
                        _getPackages(urls, urlMap[key], packages);
                    }
                }
            };

            // Clone urls array
            var urlClone = [];
            for (var i = 0, ii = urls.length; i < ii; i++) {
                urlClone.push(urls[i]);
            }

            var packages = {};
            _getPackages(urls, this._urlMap, packages);

            // return the keys only
            var keys = [];
            for (var key in packages) {
                keys.push(key);
            }
            return keys;
        },

        /**
         * Get a file from its logical path
         * @param {String} logicalPath file logical path e.g. aria/core/Sequencer.js
         * @param {aria.core.CfgBeans:Callback} cb callback description - warning callback may be called synchronously
         * if the file is already available
         *
         * <pre>
         *     {
         *         fn: // {Function} callback function
         *         scope: // {Object} object context associated to the callback function (i.e. 'this' object)
         *         args: // {Object} optional argument object passed to the callback function when called
         *     }
         * </pre>
         *
         * When called the callback will be called with the following arguments: fn(evt,args) where evt corresponds to
         * aria.core.FileLoader.$events.fileReady
         * @param {Object} args Additional arguments for the file loader
         *
         * <pre>
         *     {
         *         fullLogicalPath: // {String} Full logical path of the file to be loaded.
         *                       // If not specified the root url will be resolved to the framework root
         *  }
         * </pre>
         */
        loadFile : function (logicalPath, cb, args) {
            // get the file item in the cache
            if (!this._cache) {
                this._cache = ariaCoreCache;
            }
            this.$assert(34, this._cache);
            this.$assert(35, cb.scope);
            this.$assert(36, cb.fn);

            var cache = this._cache, itm = cache.getItem("files", logicalPath, true), status = itm.status;

            // if file already loaded, directly call callback
            if (status == cache.STATUS_AVAILABLE || status == cache.STATUS_ERROR) {
                var evt = {
                    name : "fileReady",
                    src : this,
                    logicalPaths : [logicalPath],
                    url : null
                };
                return this.$callback(cb, evt);
            }

            // file is not loaded: create a file loader if not already done
            var loader = itm.loader;
            if (!loader) {
                this.$assert(63, ariaCoreFileLoader);

                var url;
                if (args && args.fullLogicalPath) {
                    url = args.fullLogicalPath;
                } else {
                    url = this.resolveURL(logicalPath);
                }

                // register the loader in a Cache 'urls' category
                // we do so as multiple logical path can be associated to the same url
                // (packaged files served as multipart responses)
                var urlItm = cache.getItem("urls", url, true);

                if (urlItm.status == this._cache.STATUS_AVAILABLE) {
                    // this url has already been fetch, but file was not retrieved in it
                    var evt = {
                        name : "fileReady",
                        src : this,
                        logicalPaths : [logicalPath],
                        url : url,
                        downloadFailed : true
                    };
                    return this.$callback(cb, evt);
                }

                if (urlItm.loader) {
                    // this loader should be processing as 'files' entry in cache is empty
                    this.$assert(72, urlItm.status == cache.STATUS_LOADING);
                } else {
                    urlItm.loader = new ariaCoreFileLoader(url);
                    urlItm.status = cache.STATUS_LOADING;

                    // register on complete to delete the object when not necessary anymore
                    urlItm.loader.$on({
                        'complete' : this._onFileLoaderComplete,
                        scope : this
                    });
                }
                loader = urlItm.loader;
                // double-reference loader in the 'files' category
                itm.loader = loader;
                url = urlItm = null;
            }

            // add caller as listener to the FileLoader
            loader.addLogicalPath(logicalPath);
            var cbArgs = (cb.args) ? cb.args : null;
            loader.$on({
                'fileReady' : {
                    fn : cb.fn,
                    args : cbArgs,
                    scope : cb.scope
                }
            });
            loader.loadFile();
            cbArgs = loader = null;
        },

        /**
         * Find node associated to a path in a map. May be a string, an object, a function or a instance of callback, or
         * null.
         * @protected
         * @param {Object} map
         * @param {Array} pathparts
         * @param {Boolean} doubleStar support double star ** notation
         * @return {Object} node and index in path
         */
        _extractTarget : function (map, pathparts, doubleStar) {
            for (var i = 0, l = pathparts.length; i < l; i++) {
                var part = pathparts[i];
                if (!this._typeUtils.isObject(map) || this._typeUtils.isInstanceOf(map, 'aria.core.JsObject')) {
                    break;
                }
                if (!map[part]) {
                    if (doubleStar) {
                        if (map['*'] && i == l - 1) {
                            map = map['*'];
                        } else {
                            map = map['**'];
                        }
                    } else {
                        map = map['*'];
                    }
                    break;
                }

                map = map[part];
            }
            return {
                node : map,
                index : i
            };
        },

        /**
         * Method transforming a logical path into a physical url (uses the _urlMap generated by the packager to
         * determine packaged files and MD5 extensions)
         * @param {String} filePath the file logical path or full URL.
         * @param {Boolean} rootOnly Only apply the root map, if true it won't consider packaging and md5. Default false
         * @return {String} the absolute URL - e.g. http://host:port/yy/aria/jsunit/Package-123456789.txt
         */
        resolveURL : function (filePath, rootOnly) {
            if (/^\w+:\/\/.+/.test(filePath)) {
                return filePath;
            }
            var logicalPath = filePath;
            var res = logicalPath, // default response: logical path
            rootPath = Aria.rootFolderPath, // default root path
            // Some files have multiple extensions, .tpl.txt, .tpl.css, strip only the last one
            lastIndex = logicalPath.lastIndexOf("."), extensionFreePath = logicalPath.substring(0, lastIndex), //
            urlMap = this._urlMap, rootMap = this._rootMap, pathparts = extensionFreePath.split('/'), extract;

            // extract target from urlMap
            if (rootOnly !== true) {
                extract = this._extractTarget(urlMap, pathparts, true);
                urlMap = extract.node;

                if (this._typeUtils.isString(urlMap)) {
                    res = urlMap;
                } else if (this._typeUtils.isInstanceOf(urlMap, 'aria.utils.Callback')) {
                    res = urlMap.call(logicalPath);
                } else if (this._typeUtils.isFunction(urlMap)) {
                    res = urlMap.call(null, logicalPath);
                }
            }

            // extract target from rootMap
            rootMap = this._extractTarget(rootMap, pathparts).node;

            if (this._typeUtils.isString(rootMap)) {
                rootPath = rootMap;
            } else if (this._typeUtils.isInstanceOf(rootMap, 'aria.utils.Callback')) {
                rootPath = rootMap.call(logicalPath);
            } else if (this._typeUtils.isFunction(rootMap)) {
                rootPath = rootMap.call(null, logicalPath);
            }

            return rootPath + res;
        },

        /**
         * Internal method called when a file loader can be disposed
         * @param {aria.core.FileLoader:complete:event} evt
         * @private
         */
        _onFileLoaderComplete : function (evt) {
            var loader = evt.src, cache = this._cache, itm, lps = loader.getLogicalPaths();
            if (lps) {
                // remove loader ref from all 'files' entries
                var sz = lps.length;
                for (var i = 0; sz > i; i++) {
                    itm = cache.getItem("files", lps[i], false);
                    if (itm) {
                        this.$assert(120, itm.loader == loader);
                        itm.loader = null;
                    }
                }
            }
            // remove entry from "urls" category
            itm = cache.getItem("urls", loader.getURL(), false);
            if (itm) {
                this.$assert(128, itm.loader == loader);
                itm.loader = null;
                itm.status = this._cache.STATUS_AVAILABLE;
            }
            // dispose
            loader.$dispose();
            loader = cache = itm = lps = null;
        },

        /**
         * Function called by a file loader when a file content has been retrieved
         * @param {String} logicalPath the logical path of the file
         * @param {String} content the file content
         */
        loadFileContent : function (logicalPath, content, hasErrors) {
            if (!this._cache) {
                this._cache = ariaCoreCache;
            }
            var itm = this._cache.getItem("files", logicalPath, true);
            if (hasErrors) {
                itm.status = this._cache.STATUS_ERROR;
            } else {
                itm.value = content;
                itm.status = this._cache.STATUS_AVAILABLE;
            }
            itm = null;
        },

        /**
         * Get the file content from its logical path Return null if file is in error
         * @param {String} logicalPath
         * @return {String}
         */
        getFileContent : function (logicalPath) {
            var itm = this._cache.getItem("files", logicalPath, false);
            if (itm && itm.status == this._cache.STATUS_AVAILABLE) {
                return itm.value;
            }
            return null;
        },

        /**
         * Gets tpl file content based on its classpath or retrieves it from the cache if it has been already loaded
         * @param {String} classpath Classpath of the template
         * @param {aria.core.CfgBeans:Callback} cb Callback to be called after tpl content is downloaded
         */
        loadTplFileContent : function (classpath, cb) {
            var logicalPath = (require("./ClassMgr")).getBaseLogicalPath(classpath) + ".tpl";
            this.loadFile(logicalPath, {
                fn : this._onTplFileContentReceive,
                scope : this,
                args : {
                    origCb : cb
                }
            }, null);
        },

        /**
         * Internal method called when tpl content is loaded
         * @param {aria.core.FileLoader:complete:event} evt
         * @param {Object} args Additonal arguments for the callback {origCb: {JSON callback} orignal callback to be
         * called after file load is complete}
         * @protected
         */
        _onTplFileContentReceive : function (evt, args) {
            var res = {
                content : null
            };
            if (evt.downloadFailed) {
                res.downloadFailed = evt.downloadFailed;
            }
            if (evt.logicalPaths.length > 0) {
                res.content = this.getFileContent(evt.logicalPaths[0]);
            }
            this.$callback(args.origCb, res);
        },

        /**
         * Remove the file content associated with logical path
         * @param {String} classpath
         * @param {Boolean} timestampNextTime if true, the next time the logical path is loaded, browser and server
         * cache will be bypassed by adding a timestamp to the url
         */
        clearFile : function (logicalPath, timestampNextTime) {
            var content = this._cache.content;
            delete content.files[logicalPath];
            var url = this.resolveURL(logicalPath);
            delete content.urls[url];
            if (timestampNextTime) {
                this.enableURLTimestamp(url, true); // browser cache will be bypassed next time the file is loaded
            }
        }
    }
});

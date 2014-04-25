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

module.exports = Aria.classDefinition({
    $classpath : "aria.core.FileLoader",

    $events : {
        "fileReady" : {
            description : "notifies that the file associated to the loader is ready for use or that an error occured",
            properties : {
                logicalPaths : "{Array} expected logical paths associated to the file (a multipart file may contain extra files, which were not asked for)",
                url : "{String} URL used to retrieve the file (may be the URL of a multipart file)",
                downloadFailed : "{boolean} if true, no path in logicalPaths could be retrieved successfully (maybe other logical paths)"
            }
        },
        "complete" : {
            description : "notifies that the file loader process is done and that it can be disposed (i.e. fileReady listeners have already been called when this event is raised)"
        }
    },

    $constructor : function (fileURL) {
        /**
         * Loader url
         * @type String
         */
        this._url = fileURL;

        /**
         * Loader url item in cache
         * @type Object
         */
        this._urlItm = ariaCoreCache.getItem("urls", fileURL, true);

        this._logicalPaths = [];
        this._isProcessing = false;

        /**
         * Status of the file loader. Value are available in aria.core.Cache
         * @type Number
         */
        this.status = ariaCoreCache.STATUS_NEW;

    },
    $statics : {
        // ERROR MESSAGES:
        INVALID_MULTIPART : "Error in multipart structure of %1, part %2",
        LPNOTFOUND_MULTIPART : "The expected logical path %1 was not found in multipart %2",
        EXPECTED_MULTIPART : "The expected multipart structure was not found in %1."
    },
    $prototype : {

        _multiPartHeader : /^(\/\*[\s\S]*?\*\/\s*\r?\n)?\/\/\*\*\*MULTI-PART(\r?\n[^\n]+\n)/,
        _logicalPathHeader : /^\/\/LOGICAL-PATH:([^\s]+)$/,

        /**
         * Start the download of the file associated to the loader url
         */
        loadFile : function () {
            if (this._isProcessing) {
                return;
            }
            this.$assert(33, this._logicalPaths.length > 0);
            this._isProcessing = true;
            (require("./IO")).asyncRequest({
                sender : {
                    classpath : this.$classpath,
                    logicalPaths : this._logicalPaths
                },
                url : require("./DownloadMgr").getURLWithTimestamp(this._url), // add a timestamp to the URL if
                // required
                callback : {
                    fn : this._onFileReceive,
                    onerror : this._onFileReceive,
                    scope : this
                },
                expectedResponseType : "text"
            });
        },

        /**
         * Associate a new logical path to the loader Note: as multiple files can be packaged into a same file, a loader
         * can be associated to multiple logical paths. Return true if the logicalPath was not already registered.
         * @param {String} lp
         * @return {Boolean}
         */
        addLogicalPath : function (lp) {
            var logicalPaths = this._logicalPaths;
            for (var index = 0, l = logicalPaths.length; index < l; index++) {
                if (logicalPaths[index] === lp) {
                    return false;
                }
            }
            this._logicalPaths.push(lp);
            return true;
        },

        /**
         * Get the list of logical paths associated to the loader
         * @return {Array}
         */
        getLogicalPaths : function () {
            return this._logicalPaths;
        },

        /**
         * Get the url associated to this loader
         * @return {String}
         */
        getURL : function () {
            return this._url;
        },

        /**
         * Internal callback called by the IO object when the file has been successfully received
         * @param {Object} ioRes IO result object
         * @private
         */
        _onFileReceive : function (ioRes) {
            var ariaCoreDownloadMgr = require("./DownloadMgr");
            var multipart;
            // store file in cache
            var downloadFailed = (ioRes.status != '200');
            this.$assert(79, this._logicalPaths.length > 0);

            if (!downloadFailed) {
                // check if the file received is multipart
                multipart = this._multiPartHeader.exec(ioRes.responseText);
                if (multipart != null) {
                    // it is multipart, we split it; separator is multipart[2]
                    var parts = ioRes.responseText.split(multipart[2]), partsLength = parts.length;
                    var lpReceived = {}; // hash table to know which logical paths were received
                    var logicalpath; // current logical path
                    for (var i = 1; i < partsLength; i += 2) {
                        logicalpath = this._logicalPathHeader.exec(parts[i]);
                        if (logicalpath != null) {
                            logicalpath = logicalpath[1];
                        }
                        var content = parts[i + 1];
                        if (logicalpath == null || content == null) {
                            this.$logError(this.INVALID_MULTIPART, [ioRes.url, (i + 1) / 2]);
                            continue;
                        }
                        // for last element, set this loader as finished (available status)
                        if (i + 3 > partsLength) {
                            this._urlItm.status = ariaCoreCache.STATUS_AVAILABLE;
                        }
                        lpReceived[logicalpath] = 1;
                        ariaCoreDownloadMgr.loadFileContent(logicalpath, content, content == null);
                    }
                    var nbFilesMissing = 0;
                    // check that all expected logical paths were returned, or otherwise report an error for that
                    // logical path:
                    for (var i = 0; i < this._logicalPaths.length; i++) {
                        logicalpath = this._logicalPaths[i];
                        if (lpReceived[logicalpath] != 1) {
                            this.$logError(this.LPNOTFOUND_MULTIPART, [logicalpath, ioRes.url]);
                            ariaCoreDownloadMgr.loadFileContent(logicalpath, null, true);
                            nbFilesMissing++;
                        }
                    }
                    if (nbFilesMissing == this._logicalPaths.length) {
                        downloadFailed = true;
                    }
                } else {
                    this._urlItm.status = ariaCoreCache.STATUS_AVAILABLE;
                    // we did not receive a multipart, we should have only one logical path
                    if (this._logicalPaths.length == 1) {
                        ariaCoreDownloadMgr.loadFileContent(this._logicalPaths[0], ioRes.responseText, false);
                    } else {
                        this.$logError(this.EXPECTED_MULTIPART, ioRes.url);
                        downloadFailed = true;
                    }
                }
            }

            if (downloadFailed && multipart == null) {
                // if an error occurred, and we have not yet done it,
                // we put the error in the cache for every expected logical path
                for (var i = 0; i < this._logicalPaths.length; i++) {
                    ariaCoreDownloadMgr.loadFileContent(this._logicalPaths[i], ioRes.responseText, true);
                }
            }

            // notify listeners
            this.$raiseEvent({
                name : "fileReady",
                logicalPaths : this._logicalPaths,
                url : this._url,
                downloadFailed : downloadFailed
            });

            this._isProcessing = false;

            // send complete (ready for dispose)
            this.$raiseEvent({
                name : "complete"
            });
        }
    }
});

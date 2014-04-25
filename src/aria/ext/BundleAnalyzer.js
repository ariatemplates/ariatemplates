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
var ariaCoreCache = require("../core/Cache");
var ariaCoreResMgr = require("../core/ResMgr");

/**
 * Creates a report on the classes' usage inside bundles.<br />
 * Packaging the framework in multipart files means grouping different classes in a single file (bundle) in order to
 * reduce the network requests. For the first load of an application it's important to keep the size of the bundle as
 * small as possible, including only the classes needed to load the page.<br />
 * This class analyses the bundle composition giving information on the number of downloaded files and the classes that
 * are not needed inside each bundle.
 *
 * <pre>
 * Aria.load({
 *     classes : ['aria.ext.BundleAnalyzer'],
 *     oncomplete : function () {
 *         console.log(aria.ext.BundleAnalyzer.getReport());
 *     }
 * });
 * </pre>
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.ext.BundleAnalyzer",
    $singleton : true,
    $prototype : {
        /**
         * Generate the report.
         * @return {Object}
         *
         * <pre>
         * {
         *      downloaded : {Array} List of downloaded files
         *      useless : {Array} List of classes that are present in a bundle but not used by the framework.
         *          These classes can be safely removed from the bundle
         *      error : {Array} List of classes that failed to be downloaded
         * }
         * </pre>
         */
        getReport : function () {
            var cache = ariaCoreCache.content;

            var downloadedBundles = [];
            for (var name in cache.urls) {
                if (cache.urls.hasOwnProperty(name)) {
                    downloadedBundles.push(name);
                }
            }

            var loadedFiles = {}, uselessFiles = [], errorFiles = [];
            var classes = require.cache, resources = ariaCoreResMgr.resources;
            for (name in classes) {
                if (classes.hasOwnProperty(name)) {
                    loadedFiles[name] = true;
                }
            }
            for (name in resources) {
                if (resources.hasOwnProperty(name)) {
                    var res = resources[name];
                    var file = (res.loaded || res.loading || {}).logicalPath;
                    if (file) {
                        loadedFiles[file] = true;
                    }
                }
            }
            for (name in cache.files) {
                if (cache.files.hasOwnProperty(name)) {
                    if (cache.files[name].status !== ariaCoreCache.STATUS_AVAILABLE) {
                        errorFiles.push(name);
                    } else if (!loadedFiles[name]) {
                        uselessFiles.push(name);
                    }
                }
            }

            return {
                downloaded : downloadedBundles,
                useless : uselessFiles,
                error : errorFiles
            };
        }
    }
});

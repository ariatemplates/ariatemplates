var Aria = require("../Aria");
var ariaCoreCache = require("../core/Cache");

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
    /**
     * Create the singleton instance
     */
    $constructor : function () {
        /**
         * Code used inside a closure to evaluate again every class definition. It is used to extract useful information
         * from the resources definition
         * @protected
         */
        this._evalContext = "var Aria={},p;Aria.resourcesDefinition=function(c){p={type:'res',path:c.$classpath}};";

        for (var fn in Aria) {
            if (Aria.hasOwnProperty(fn) && Aria[fn] && Aria[fn].call) {
                if (fn !== "resourcesDefinition") {
                    this._evalContext += "Aria." + fn + "=function(){};";
                }
            }
        }
    },
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
            for (name in cache.classes) {
                if (cache.classes.hasOwnProperty(name)) {
                    loadedFiles[ariaCoreCache.getFilename(name)] = true;
                }
            }
            for (name in cache.files) {
                if (cache.files.hasOwnProperty(name)) {
                    if (cache.files[name].status !== ariaCoreCache.STATUS_AVAILABLE) {
                        errorFiles.push(name);
                    } else {
                        var description = this._getClassDescription(cache.files[name].value);
                        if (description) {
                            if (description.type === "res" && !cache.classes[description.path]) {
                                uselessFiles.push(name);
                            }
                        } else if (!loadedFiles[name]) {
                            uselessFiles.push(name);
                        }
                    }

                }
            }

            return {
                downloaded : downloadedBundles,
                useless : uselessFiles,
                error : errorFiles
            };
        },

        /**
         * Return more information on the class definition
         * @private
         * @param {String} classContent Content to be evaluated
         * @return {Object}
         *
         * <pre>
         * {
         *      type : {String} Class type, e.g. 'res'
         *      path : {String} Classpath
         * }
         * </pre>
         */
        _getClassDescription : function (classContent) {
            // The try is needed because for TPL files classContent is the template, not the class definition
            try {
                return eval("(function(){" + this._evalContext + classContent + ";return p})()");
            } catch (ex) {}
        }
    }
});

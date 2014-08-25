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
var ariaCoreDownloadMgr = require("../core/DownloadMgr");
var ariaCoreIO = require("../core/IO");


/**
 * Utility class used to load Aria Templates in an iframe or in a new window. This is used by aria.jsunit.TestWrapper to
 * isolate tests, but it can be used for any purpose. It is still experimental for now.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.FrameATLoader",
    $singleton : true,
    $events : {
        "bootstrapLoaded" : "Raised when the bootstrap is loaded."
    },
    $statics : {
        // Loading failed because the bootstrap couldn't be loaded
        BOOTSTRAP : -1,
        // Loading failed because the iframe didn't load the framework quick enough
        WAIT : -2
    },
    $constructor : function () {
        /**
         * Pattern used to find the script tag corresponding to the framework js file.
         * @type RegExp
         */
        this.frameworkHrefPattern = /(aria-?templates-([^\/]+)\.js|aria\/bootstrap\.js)/;

        /**
         * Address of the framework JS file.
         * @type String
         */
        this.frameworkHref = null;

        /**
         * Content of Aria Templates bootstrap js file.
         * @type String
         */
        this.frameworkJS = null;

        /**
         * rootFolderPath to be used when loading the framework.
         * @type String
         */
        this.bootRootFolderPath = null;

        /**
         * Whether it is currently downloading the Aria Templates bootstrap JS file.
         * @type Boolean
         */
        this._loadingFrameworkJs = false;

        /**
         * Callback objects to be called from the iframe.
         */
        this._callbacks = {};

        /**
         * Counter used as index in this._callbacks.
         */
        this._counter = 0;
    },
    $prototype : {

        /**
         * Load Aria Templates in the given frame and call the callback. This replaces the content of the frame.
         * @param {HTMLElement} frame frame
         * @param {aria.core.CfgBeans:Callback} cb callback. The first argument is an object containing success
         * information.
         * @param {Object} options So far one option supported: iframePageCss:String which injects CSS text to the
         * iframe. E.g. {iframePageCss : "body {font-family:Arial}"}
         */
        loadAriaTemplatesInFrame : function (frame, cb, options) {
            this.loadBootstrap({
                fn : this._loadATInFrameCb1,
                scope : this,
                args : {
                    options : options || {},
                    frame : frame,
                    cb : cb
                }
            });
        },

        /**
         * First part of the load of Aria Templates in the iframe: replace the document inside the iframe.
         * @param {Boolean|Object} evt True if there was an error or event raised from 'bootstrapLoaded'
         * @param {Object} args object containing the frame and callback
         */
        _loadATInFrameCb1 : function (evt, args) {
            if (evt === true) {
                this.$callback(args.cb, {
                    success : false,
                    reason : this.BOOTSTRAP
                });
                return;
            }
            var callbackId = this._createCallbackId({
                fn : this._loadATInFrameCb2,
                scope : this,
                args : args
            });

            var href = Aria.$frameworkWindow.location.href.replace(/(\?|\#).*$/, "").replace(/[^\/.]+\.[^\/.]+$/, "").replace(/\/$/, "")
                    + "/";
            var docUrl = [ariaCoreDownloadMgr.resolveURL("aria/utils/FrameATLoaderHTML.html"), '?',
                    encodeURIComponent(href), '#', callbackId].join('');
            // args.frame.contentWindow is defined only if the framework is loaded in an iframe. In the case of a new
            // window, args.frame is already the correct window object

            var window = args.frame.contentWindow || args.frame;
            window.location = docUrl;
        },

        /**
         * Second part of the load of Aria Templates in the iframe: evaluate the bootstrap JS file of Aria Templates.
         * @param {Object} res unused
         * @param {Object} args object containing the frame and callback
         */
        _loadATInFrameCb2 : function (res, args) {
            var window = args.frame.contentWindow || args.frame;
            var document = window.document;
            var iFrameAria = window.Aria;
            iFrameAria.rootFolderPath = this.bootRootFolderPath;
            iFrameAria.debug = Aria.debug;
            iFrameAria.memCheckMode = Aria.memCheckMode;
            window.Aria["eval"](this.frameworkJS); // note that using window.eval leads to strange errors in FF
            // If the framework is loaded inside a new window, opener has to be used instead of parent
            document.write('<script type="text/javascript">(opener || parent).aria.utils.FrameATLoader.callFromFrame('
                    + this._createCallbackId({
                        fn : this._loadATInFrameCb3,
                        scope : this,
                        args : args
                    }) + ');</script>');
        },

        /**
         * Third part of the load of Aria Templates in the iframe: wait for aria to be loaded.
         * @param {Object} res unused
         * @param {Object} args object containing the frame and callback
         */
        _loadATInFrameCb3 : function (res, args) {
            // In IE7 the callback might get called before Aria is available in the frame, poll
            var window = args.frame.contentWindow || args.frame;
            var maxTimes = 5;

            var self = this;
            var waitFunction = function () {
                maxTimes -= 1;
                if (maxTimes >= 0) {
                    if (window.aria == null) {
                        setTimeout(waitFunction, 30);
                    } else {
                        self._loadATInFrameCb4(res, args);
                    }
                } else {
                    return self.$callback(args.cb, {
                        success : false,
                        reason : this.WAIT
                    });
                }
            };

            setTimeout(waitFunction, 30);
        },

        /**
         * Fourth part of the load of Aria Templates in the iframe: copy the skin, rootmap and cache.
         * @param {Object} res unused
         * @param {Object} args object containing the frame and callback
         */
        _loadATInFrameCb4 : function (res, args) {
            var window = args.frame.contentWindow || args.frame;
            if (args.options.iframePageCss) {
                this._injectGlobalCss(window, args.options.iframePageCss);
            }

            window.Aria.rootFolderPath = Aria.rootFolderPath;
            var rootMap = window.aria.utils.Json.copy(ariaCoreDownloadMgr._rootMap);
            window.aria.core.DownloadMgr.updateRootMap(rootMap);
            if (aria.widgets && aria.widgets.AriaSkin) {
                var skin = aria.widgets.AriaSkin.classDefinition;
                window.Aria['classDefinition']({
                    $classpath : 'aria.widgets.AriaSkin',
                    $singleton : true,
                    $prototype : window.aria.utils.Json.copy(skin.$prototype)
                });
            }
            // fill the cache with already loaded classes

            var newDownloadMgr = window.aria.core.DownloadMgr;
            var newCache = window.aria.core.Cache;
            var cache = ariaCoreCache;
            var filesCache = cache.content.files;
            var urlsCache = cache.content.urls;
            var loadedStatus = cache.STATUS_AVAILABLE;
            var errorStatus = cache.STATUS_ERROR;
            for (var file in filesCache) {
                if (filesCache.hasOwnProperty(file)) {
                    var item = filesCache[file];
                    if (item.status == loadedStatus) {
                        newDownloadMgr.loadFileContent(file, item.value, false);
                    } else if (item.status == errorStatus) {
                        newDownloadMgr.loadFileContent(file, null, true);
                    }
                }
            }
            for (var url in urlsCache) {
                if (urlsCache.hasOwnProperty(url)) {
                    var item = urlsCache[url];
                    var newItem = newCache.getItem("urls", url, true);
                    if (item.status == loadedStatus) {
                        newItem.status = loadedStatus;
                    } else if (item.status == errorStatus) {
                        newItem.status = errorStatus;
                    }
                }
            }
            this.$callback(args.cb, {
                success : true
            });
        },

        /**
         * Create <style> tag and append to the head of the window, with the content as in cssText param
         * @param {Window} window
         * @param {String} cssText
         */
        _injectGlobalCss : function (window, cssText) {
            var document = window.document;
            var head = document.head || document.getElementsByTagName("head")[0];
            var style = document.createElement("style");

            style.type = "text/css";
            if (style.styleSheet) {
                style.styleSheet.cssText = cssText;
            } else {
                style.appendChild(document.createTextNode(cssText));
            }
            head.appendChild(style);
        },

        /**
         * Return a javascript id which can be used from the iframe to call the corresponding callback.
         * @param {aria.core.CfgBeans:Callback} cb callback
         * @return {String}
         */
        _createCallbackId : function (cb) {
            this._counter++;
            this._callbacks[this._counter] = cb;
            return this._counter;
        },

        /**
         * This method is called from the iframe to call a callback specified by its id.
         * @param {Number} id Callback number to call.
         */
        callFromFrame : function (id) {
            var cb = this._callbacks[id];
            delete this._callbacks[id];
            this.$callback(cb);
        },

        /**
         * Loop over script tags in the current document and return the address of the script which matches the pattern.
         * @param {RegExp} pattern
         * @return {String}
         */
        _findScriptPattern : function (pattern) {
            var scripts = Aria.$frameworkWindow.document.getElementsByTagName("script");
            for (var i = 0, l = scripts.length; i < l; i++) {
                var script = scripts[i];
                if (script.attributes && script.attributes["src"]) {
                    var src = script.attributes["src"].nodeValue;
                    if (pattern.exec(src)) {
                        return src;
                    }
                }
            }
            this.$logError("Could not find the script corresponding to pattern: %1. Please set the aria.jsunit.FrameATLoader.frameworkHref property manually.");
            return null;
        },

        /**
         * Set the following property if they are not defined already: bootRootFolderPath, frameworkHref, frameworkJS
         * @param {aria.core.CfgBeans:Callback} cb callback called when the properties are set.
         */
        loadBootstrap : function (cb) {
            if (this.bootRootFolderPath == null) {
                var bootRootFolderPath = ariaCoreDownloadMgr.resolveURL("aria/Aria.js", true);
                this.bootRootFolderPath = bootRootFolderPath.replace(/aria\/Aria\.js$/, "");
            }
            if (this.frameworkJS) {
                this.$callback(cb);
                return;
            }
            if (this.frameworkHref == null) {
                this.frameworkHref = this._findScriptPattern(this.frameworkHrefPattern);
                if (this.frameworkHref == null) {
                    this.$callback(cb, true);
                    return;
                }
            }
            this.$onOnce({
                bootstrapLoaded : cb
            });
            if (this._loadingFrameworkJs) {
                return;
            }
            this._loadingFrameworkJs = true;
            ariaCoreIO.asyncRequest({
                url : this.frameworkHref,
                callback : {
                    fn : this._frameworkLoaded,
                    scope : this
                }
            });
        },

        /**
         * Called when the framework bootstrap js file is loaded.
         * @param {aria.core.CfgBeans:IOAsyncRequestResponseCfg} res
         */
        _frameworkLoaded : function (res) {
            this._loadingFrameworkJs = false;
            this.frameworkJS = res.responseText;
            this.$raiseEvent('bootstrapLoaded');
        }
    }
});

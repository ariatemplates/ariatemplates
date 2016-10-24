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
var ariaUtilsAriaWindow = require("./AriaWindow");
var ariaCoreDownloadMgr = require("../core/DownloadMgr");
var ariaUtilsFrameATLoader = require("./FrameATLoader");

/**
 * Creates a subwindow and load a module inside
 * @class aria.utils.Bridge
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Bridge',
    $events : {
        "forwardEvent" : {
            description : "Wrapper for an event to forward",
            properties : {
                event : "The forwarded event"
            }
        }
    },
    $constructor : function () {

        /**
         * Child window used to display analysers and controls
         * @protected
         * @type Window
         */
        this._subWindow = null;

        /**
         * Is bridge open, and subwindow created ?
         * @type Boolean
         */
        this.isOpen = false;

        /**
         * Classpath of the module controller to load in subwindow and classpath of root display. Also title
         *
         * <pre>
         *     {
         *         moduleCtrlClasspath : ...
         *         displayClasspath : ...
         *         skinPath : ...
         *         title : ...
         *     }
         * </pre>
         *
         * @protected
         * @type Object
         */
        this._config = null;

        /**
         * Reference to the main module in subwindow
         * @protected
         * @type aria.templates.ModuleCtrl
         */
        this._moduleCtrlRef = null;

        /**
         * Reference to the root template context in subwindow
         * @protected
         * @type aria.templates.TemplateCtxt
         */
        this._rootTplCtxtRef = null;
    },
    $destructor : function () {
        this.close();
    },
    $prototype : {

        /**
         * Create external display with given module controller classpath
         * @param {Object} config moduleControllerClasspath, displayClasspath, skinPath and title
         * @param {String} options for opening the subwindow. Default is "width=1024, height=800"
         */
        open : function (config, options) {
            if (this._subWindow) {
                if (this._subWindow.closed) {
                    // we probably did not catch correctly the unload event
                    this.close();
                } else {
                    // TODO: log error
                    return;
                }
            }

            var skinPath = config.skinPath;
            if (!skinPath && !(aria.widgets && aria.widgets.AriaSkin)) {
                var frameworkHref = ariaUtilsFrameATLoader.getFrameworkHref();
                var urlMatch = /aria\/aria-?templates-([^\/]+)\.js/.exec(frameworkHref);
                if (urlMatch && urlMatch.length > 1) {
                    skinPath = ariaCoreDownloadMgr.resolveURL("aria/css/atskin-" + urlMatch[1] + ".js", true);
                } else if (/aria\/bootstrap.js/.test(frameworkHref)) {
                    skinPath = ariaCoreDownloadMgr.resolveURL("aria/css/atskin.js", true);
                } else {
                    return;
                }
            }

            // default options
            if (!options) {
                options = "width=1024, height=800";
            }

            // create sub window. Use date to create a new one each time
            this._subWindow = Aria.$frameworkWindow.open("", config.title + ("" + (new Date()).getTime()), options);
            // this is for creating the same window (usefull for debugging)
            //this._subWindow = Aria.$frameworkWindow.open("", config.title, options);

            // The _subWindow can be null if the popup blocker is enabled in the browser
            if (this._subWindow == null) {
                return;
            }

            this._config = config;
            ariaUtilsAriaWindow.attachWindow();
            ariaUtilsAriaWindow.$on({
                "unloadWindow" : this._onMainWindowUnload,
                scope : this
            });

            ariaUtilsFrameATLoader.loadAriaTemplatesInFrame(this._subWindow, {
                fn: this._onFrameLoaded,
                scope: this
            }, {
                crossDomain: true,
                skipSkinCopy: !!skinPath,
                extraScripts: skinPath ? [skinPath] : [],
                keepLoadingIndicator: true,
                onBeforeLoadingAria: {
                    fn: this._registerOnPopupUnload,
                    scope: this
                }
            });
        },

        _registerOnPopupUnload: function () {
            var self = this;
            this._subWindow.onunload = function () {
                self.close();
                self = null;
            };
        },

        _onFrameLoaded: function (result) {
            if (!result.success) {
                this.close();
                return;
            }
            var window = this._subWindow;
            var document = window.document;
            document.title = this._config.title;
            var bodyStyle = document.body.style;
            bodyStyle.overflow = "hidden";
            bodyStyle.margin = "0px";
            var mainDiv = document.createElement("div");
            mainDiv.setAttribute("id", "main");
            document.body.appendChild(mainDiv);
            mainDiv.appendChild(document.getElementById("loadingIndicator"));
            this.moduleStart();
        },

        /**
         * Called from the main window when it is being unloaded.
         * @param {Object} e event object
         */
        _onMainWindowUnload : function (e) {
            // automatically close the associated window
            this.close();
        },

        /**
         * Function called from the sub window to start the module
         */
        moduleStart : function () {
            // start working in subwindow
            var Aria = this._subWindow.Aria, aria = this._subWindow.aria;
            // link the url map and the root map in the sub-window
            // to the corresponding maps in the main window:
            Aria.rootFolderPath = this.getAria().rootFolderPath;
            aria.core.DownloadMgr._urlMap = ariaCoreDownloadMgr._urlMap;
            aria.core.DownloadMgr._rootMap = ariaCoreDownloadMgr._rootMap;
            Aria.setRootDim({
                width : {
                    min : 16
                },
                height : {
                    min : 16
                }
            });
            Aria.load({
                classes : ['aria.templates.ModuleCtrlFactory'],
                oncomplete : {
                    fn : this._templatesReady,
                    scope : this
                }
            });
        },

        /**
         * Called when templates package is ready. It will create associated module.
         * @protected
         */
        _templatesReady : function () {
            // continue working in subwindow
            // var Aria = this._subWindow.Aria;
            var aria = this._subWindow.aria;
            // creates module instance first to be able to dispose it when window close
            var self = this;
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : this._config.moduleCtrlClasspath,
                autoDispose : false,
                initArgs : {
                    bridge : this
                }
            }, {
                fn : function (res) {
                    // For some obscure reason on IE 9 only, it is needed to put
                    // this closure here in order to call _moduleLoaded with
                    // the right scope:
                    self._moduleLoaded(res);
                },
                scope : this
            }, false);
        },

        /**
         * Callback when module source is loaded
         * @param {Object} moduleCtrl and moduleCtrlPrivate
         * @protected
         */
        _moduleLoaded : function (moduleCtrlObject) {
            // finish working in subwindow
            var Aria = this._subWindow.Aria; // , aria = this._subWindow.aria;
            var moduleCtrl = moduleCtrlObject.moduleCtrlPrivate;
            Aria.loadTemplate({
                classpath : this._config.displayClasspath,
                div : 'main',
                moduleCtrl : moduleCtrl,
                width : {
                    min : 16
                },
                height : {
                    min : 16
                }
            }, {
                fn : this._displayLoaded,
                scope : this
            });
            this._moduleCtrlRef = moduleCtrl;
            this.isOpen = true;
        },

        /**
         * Callback when root display is loaded
         * @protected
         */
        _displayLoaded : function (status) {
            this._rootTplCtxtRef = status.tplCtxt;
        },

        /**
         * Close subwindow and restore environment
         */
        close : function () {
            var subWindow = this._subWindow;
            if (subWindow) {
                this._subWindow = null;
                if (!subWindow.closed) {
                    if (this._rootTplCtxtRef) {
                        this._rootTplCtxtRef.$dispose();
                    }
                    if (this._moduleCtrlRef) {
                        this._moduleCtrlRef.$dispose();
                    }
                    subWindow.close();
                }
                this._moduleCtrlRef = null;
                this._rootTplCtxtRef = null;

                ariaUtilsAriaWindow.$unregisterListeners(this);
                ariaUtilsAriaWindow.detachWindow();

                this.isOpen = false;
            }
        },

        /**
         * Returns main window document
         * @return {HTMLElement}
         */
        getDocument : function () {
            return Aria.$window.document;
        },

        /**
         * Returns aria in the main window
         * @return {Object}
         */
        getAriaPackage : function () {
            return aria;
        },

        /**
         * Returns the Aria object in the main window
         * @return {Object}
         */
        getAria : function () {
            return Aria;
        }
    }
});

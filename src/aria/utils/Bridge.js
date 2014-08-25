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
var ariaUtilsJson = require("./Json");


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

        /**
         * setInterval id for attaching bridge into subwindow
         * @type Number
         */
        this._bridgeAttachedInterval = false;

    },
    $destructor : function () {
        this.close();
        this._subWindow = null;
    },
    $prototype : {

        /**
         * Create external display with given module controller classpath
         * @param {Object} config moduleControllerClasspath & displayClasspath
         * @param {String} options for opening the subwindow. Default is "width=1024, height=800"
         */
        open : function (config, options) {

            if (this._subWindow) {
                // TODO: log error
                return;
            }

            // default options
            if (!options) {
                options = "width=1024, height=800";
            }

            // create sub window. Use date to create a new one each time
            this._subWindow = Aria.$frameworkWindow.open("", config.title + ("" + (new Date()).getTime()), options);

            // The _subWindow can be null if the popup blocker is enabled in the browser
            if (this._subWindow == null) {
                return;
            }
            // this is for creating the same window (usefull for debugging)
            // this._subWindow = window.open("", config.title, options);

            // retrieve current AT version to load the same on the subwindow
            var scripts = Aria.$frameworkWindow.document.getElementsByTagName("script"), root = Aria.rootFolderPath, script, src, urlMatch, atJsName, atSkinName;
            for (var i = 0, l = scripts.length; i < l; i++) {
                script = scripts[i];
                if (script.attributes && script.attributes["src"]) {
                    src = script.attributes["src"].nodeValue;
                    urlMatch = /aria\/(aria-?templates-([^\/]+)\.js)/.exec(src);
                    if (urlMatch && urlMatch.length > 1) {
                        atJsName = urlMatch[1]; // retrieve something like "aria-templates-1.0-SNAPSHOT.js"
                        atSkinName = "atskin-" + urlMatch[2] + ".js";
                        break;
                    }
                    if (/aria\/bootstrap.js/.test(src)) {
                        // not packaged
                        atJsName = "bootstrap.js";
                        atSkinName = "atskin.js";
                        break;
                    }
                }
            }

            // case dev mode : rootFolderPath might be wrong
            if (root.match(/dev\/$/)) {
                root = root.substring(0, root.length - 4);
            }

            if (!atJsName) {
                // FIXME log Error
                return false;
            }

            // create subwindow content
            var pullTimeout = 500; // ms to wait between each check of Aria.loadTemplate
            var devPart = "";

            // This is use for debugging -> won't work with IE (scripts get injected after the body)
            // var devPart = "dev/";

            var sourceCode = [
                    '<!DOCTYPE html>\n',
                    "<html><head><title>" + config.title + "</title>", // HEAD

                    "<script type='text/javascript'>Aria = { _xxDebug: true, rootFolderPath : '" + root + devPart
                            + "' };</script>",
                    "<script language='JavaScript' src='", // AT script
                    root + devPart + "aria/" + atJsName, // AT script
                    "'></script>", // AT script

                    (aria.widgets && aria.widgets.AriaSkin) ? ["<script type='text/javascript'>",
                            "Aria['classDefinition']({$classpath : 'aria.widgets.AriaSkin',", "$singleton : true,",
                            "$prototype : window.aria.utils.Json.copy(",
                            ariaUtilsJson.convertToJsonString(aria.widgets.AriaSkin.classDefinition.$prototype), ")",
                            "});</script>"].join("") : ["<script language='JavaScript' src='", // AT Skin script
                            root + "aria/css/" + atSkinName, // AT Skin script
                            "'></script>" // AT Skin script
                    ].join(""),

                    "</head>", // END HEAD
                    "<body onUnload='window.__atBridge&&__atBridge.close()' style='overflow:hidden;'>", // used to
                    // restore environment
                    "<div id='main'><h3 id='main_title' style='text-align:center;margin-top:200px;'>Starting.</h3></div>",
                    "<script type='text/javascript'>var appStart = function () {", // START ToolsModule
                    "if (window.Aria && window.Aria.loadTemplate && window.__atBridge) { window.__atBridge.moduleStart.call(window.__atBridge);}",
                    "else { document.getElementById('main_title').innerHTML += '.'; setTimeout(appStart, "
                            + pullTimeout + ");}}; appStart();", "</script>", // START ToolsModule
                    "</body></html>"].join(""); // BODY

            this._subWindow.document.write(sourceCode);
            this._subWindow.document.close();

            // double pulling mandatory for IE
            var oSelf = this;
            this._bridgeAttachedInterval = setInterval(function () {
                // add bridge to subwindow
                if (oSelf._subWindow) {
                    oSelf._subWindow.__atBridge = oSelf;
                } else {
                    clearInterval(oSelf._bridgeAttachedInterval);
                }
            }, 2000);

            this._config = config;
            ariaUtilsAriaWindow.attachWindow();
            ariaUtilsAriaWindow.$on({
                "unloadWindow" : this._onMainWindowUnload,
                scope : this
            });
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
            var Aria = this._subWindow.Aria; // , aria = this._subWindow.aria;

            clearInterval(this._bridgeAttachedInterval);

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
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : this._config.moduleCtrlClasspath,
                autoDispose : false,
                initArgs : {
                    bridge : this
                }
            }, {
                fn : this._moduleLoaded,
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
            this._rootTplCtxtRef = status.templateCtxt;
        },

        /**
         * Close subwindow and restaure environment
         */
        close : function () {

            if (this.isOpen) {
                if (this._moduleCtrlRef) {
                    this._moduleCtrlRef.$dispose();
                    this._moduleCtrlRef = null;
                }
                if (this._rootTplCtxtRef) {
                    this._rootTplCtxtRef.$dispose();
                    this._rootTplCtxtRef = null;
                }

                this._subWindow.close();
                this._subWindow = null;

                ariaUtilsAriaWindow.$unregisterListeners(this);
                ariaUtilsAriaWindow.detachWindow();

                // restaure hijacked function
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

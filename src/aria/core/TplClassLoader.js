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
var ariaCoreJsObject = require("./JsObject");
var ariaCoreBrowser = require("./Browser");
var ariaCoreJsonValidator = require("./JsonValidator");

(function () {

    /**
     * Display an error in the template container and call the callback notifying the error.
     * @param {Object} args
     * @private
     */
    var errorInTemplateDiv = function (args) {
        var div = args.cfg.tplDiv;

        if (div) {
            aria.utils.Dom.replaceHTML(div, "#TEMPLATE ERROR#");
        }
        this.$callback(args.cb, {
            success : false
        });
    };

    var __loadTemplate4 = function (evt, args) {
        var tplCtxt = args.tplCtxt, cfg = args.cfg;
        tplCtxt.viewReady(); // view successfully rendered: signal to template through TemplateContext

        this.$callback(args.cb, {
            success : true,
            tplCtxt : cfg.provideContext ? tplCtxt : null
        }); // TODO: add an error ID
    };

    var __loadTemplate3 = function (res, args) {
        // Step 3: init the template context and show the template
        var cfg = args.cfg;

        var tplCtxt = new aria.templates.TemplateCtxt();
        if (res.moduleCtrlPrivate && cfg.moduleCtrl.autoDispose) {
            // the module controller has just been initialized and needs to be disposed when the template is unloaded
            if (!cfg.toDispose) {
                cfg.toDispose = [res.moduleCtrlPrivate];
            } else {
                cfg.toDispose.push(res.moduleCtrlPrivate);
            }
        }

        cfg.moduleCtrl = res.moduleCtrl;
        cfg.isRootTemplate = true;

        // note that there is no need to clean cfg, this will be done by the template context
        var result = tplCtxt.initTemplate(cfg);

        if (result) {
            // Fire data ready before we start working with the view
            tplCtxt.dataReady();
        }

        var tplDiv = cfg.tplDiv;

        // On IE, the CSS engine keeps rendering and calculating the position of the background image
        if (ariaCoreBrowser.isOldIE) {
            tplDiv.style.background = "";
        }

        // Load the CSS dependencies, the style should be added before the html
        tplDiv.className = tplCtxt.getCSSClassNames(); // remove the loading indicator
        if (result) {
            args.tplCtxt = tplCtxt;
            tplCtxt.$onOnce({
                "SectionRefreshed" : {
                    fn : __loadTemplate4,
                    scope : this,
                    args : args
                }
            });
            tplCtxt.$refresh();
        } else {
            tplCtxt.$dispose();
            errorInTemplateDiv.call(this, args);
        }
    };

    var __loadTemplate2 = function (args) {
        // Step 2: initialize the module controller if needed
        var cfg = args.cfg;
        var moduleCtrl = cfg.moduleCtrl;
        if (moduleCtrl && !moduleCtrl.getData) {
            // simply call the ModuleCtrlFactory to do that for us
            aria.templates.ModuleCtrlFactory.createModuleCtrl(moduleCtrl, {
                fn : __loadTemplate3,
                args : args,
                scope : this
            });
        } else {
            // case where an existing module controller is provided "the old way"
            if (moduleCtrl && !cfg.moduleCtrlPrivate && moduleCtrl.$publicInterface) {
                cfg.moduleCtrl = moduleCtrl.$publicInterface();
            }
            // no module controller to initialize, directly load the template:
            __loadTemplate3.call(this, {
                moduleCtrl : cfg.moduleCtrl
            }, args);
        }
    };

    var __loadTemplate1 = function (args) {
        // Step 1: Check config, show the loading indicator and load needed classes

        var cfg = args.cfg;
        var cb = args.cb;
        // Check cfg:
        if (!ariaCoreJsonValidator.normalize({
            json : cfg,
            beanName : "aria.templates.CfgBeans.LoadTemplateCfg"
        })) {
            // error should have already been reported
            this.$callback(cb, {
                success : false
            }); // TODO: add an error ID
            return;
        }
        var classes = ['aria.templates.TemplateCtxt', 'aria.templates.CSSMgr']; // classes to load in addition to the
        // template
        var moduleCtrl = cfg.moduleCtrl;
        if (moduleCtrl && !moduleCtrl.getData) {
            // the module controller is not yet initialized (description of how to create it is present in a json
            // object)
            if (!ariaCoreJsonValidator.normalize({
                json : moduleCtrl,
                beanName : "aria.templates.CfgBeans.InitModuleCtrl"
            })) {
                // error should have already been reported
                this.$callback(cb, {
                    success : false
                }); // TODO: add an error ID
                return;
            }
            classes.push("aria.templates.ModuleCtrlFactory", moduleCtrl.classpath);
        }

        var cssToReload = ['aria.templates.GlobalStyle'];
        if (aria.widgets && aria.widgets.AriaSkin) {
            cssToReload.push('aria.templates.LegacyGeneralStyle');
        }
        if (cfg.reload) {
            aria.templates.TemplateManager.unloadTemplate(cfg.classpath, cfg.reloadByPassCache);
            if (aria.templates.CSSMgr) {
                cssToReload = cssToReload.concat(aria.templates.CSSMgr.getInvalidClasspaths(true));
            }
        }

        // Set the correct size for the div:
        var layout = aria.templates.Layout;
        if (cfg.rootDim) {
            layout.setRootDim(cfg.rootDim);
        }
        var div = cfg.div;
        div = aria.utils.Dom.replaceHTML(div, "");
        if (!div) {
            // error should have already been reported
            this.$callback(cb, {
                success : false
            }); // TODO: add an error ID
            return;
        }
        if (Aria.minSizeMode) {
            div.style.border = "2px solid red";
        }
        cfg.div = div; // keep the DOM object instead of the id for the rest of the process
        div.className = this.addPrintOptions(div.className, cfg.printOptions);
        if (cfg.width != null || cfg.height != null) {
            layout.setDivSize(div, cfg.width, cfg.height);
            if (typeof(cfg.width) == "object" || typeof(cfg.height) == "object") {
                layout.registerAutoresize(div, cfg.width, cfg.height);
            }
        }

        // Because of css-related positioning problems, it is safer to set a relative positioning on the div here
        // This is actually an IE6/7 only problem that can cause scrolling problems
        if (ariaCoreBrowser.isIE6 || ariaCoreBrowser.isIE7) {
            var curPosition = div.style.position;
            if (curPosition != "absolute" && curPosition != "relative") {
                div.style.position = "relative";
            }
        }

        // Creates the div for the template content and show the loading indicator
        var tplDiv = Aria.$window.document.createElement('div');
        tplDiv.className = "xLDI";
        div.appendChild(tplDiv);
        cfg.tplDiv = tplDiv;
        Aria.load({
            classes : classes,
            templates : [cfg.classpath],
            css : cssToReload,
            oncomplete : {
                scope : this,
                args : args,
                fn : __loadTemplate2
            },
            onerror : {
                scope : this,
                args : args,
                fn : errorInTemplateDiv
            }
        });
        div = null;
        tplDiv = null;
    };

    /**
     * ClassLoader for .tpl files.
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.core.TplClassLoader",
        $extends : (require("./ClassLoader")),
        $onload : function () {
            var cstr = aria.core.TplClassLoader;
            // TODO: think to something more elegant here:
            // To be able to call the $callback function from a static method
            cstr.$callback = ariaCoreJsObject.prototype.$callback;
            cstr.$logError = ariaCoreJsObject.prototype.$logError;
            cstr.$normCallback = ariaCoreJsObject.prototype.$normCallback;
            cstr.$classpath = 'aria.core.TplClassLoader';// in case of error in the $callback method
        },
        $statics : {
            // ERROR MESSAGES:
            TEMPLATE_EVAL_ERROR : "Error while evaluating the class generated from template '%1'",
            TEMPLATE_DEBUG_EVAL_ERROR : "Error while evaluating the class generated from template '%1'",
            MISSING_TPLSCRIPTDEFINITION : "The template script associated to template %1 must be defined using Aria.tplScriptDefinition.",

            /**
             * Method called from templates to import their template script prototype. This method should not be called
             * from anywhere else than the $init method in the generated templates.
             * @param {Object} scriptClass script class (e.g.: x.y.MyTemplateScript)
             * @param {Object} tplPrototype template prototype (parameter given to the $init method)
             * @private
             */
            _importScriptPrototype : function (scriptClass, tplPrototype) {
                var scriptDef = scriptClass.tplScriptDefinition;
                if (!scriptDef) {
                    return this.$logError(this.MISSING_TPLSCRIPTDEFINITION, [tplPrototype.$classpath]);
                }
                var classpathParts = scriptDef.$classpath.split('.');
                var className = classpathParts[classpathParts.length - 1];
                var refScriptProto = '$' + className;
                var proto = {};
                if (tplPrototype[refScriptProto]) {
                    return this.$logError(Aria.DUPLICATE_CLASSNAME, [scriptDef.$classpath]);
                }
                Aria.copyObject(scriptDef.$prototype, proto);
                Aria.copyObject(scriptDef.$statics, proto);

                var scriptResources = scriptClass.classDefinition.$resources;
                if (scriptResources) {
                    if (!tplPrototype.$resources) {
                        tplPrototype.$resources = {};
                    }
                    var scriptTransformedProto = scriptClass.prototype;
                    for (var member in scriptResources) {
                        if (scriptResources.hasOwnProperty(member)) {
                            if (tplPrototype[member] && !tplPrototype.$resources[member]) {
                                this.$logError(Aria.RESOURCES_HANDLE_CONFLICT, [member, scriptDef.$classpath]);
                            } else {
                                proto[member] = scriptTransformedProto[member];
                                tplPrototype.$resources[member] = scriptResources[member];
                            }
                        }
                    }
                }

                var scriptTexts = scriptClass.classDefinition.$texts;
                if (scriptTexts) {
                    if (!tplPrototype.$texts) {
                        tplPrototype.$texts = {};
                    }
                    for (var member in scriptTexts) {
                        if (scriptTexts.hasOwnProperty(member)) {
                            if (tplPrototype[member] && !tplPrototype.$texts[member]) {
                                this.$logError(Aria.TEXT_TEMPLATE_HANDLE_CONFLICT, [member, scriptDef.$classpath]);
                            } else {
                                proto[member] = scriptClass.prototype[member];
                                tplPrototype.$texts[member] = scriptTexts[member];
                            }
                        }
                    }
                }

                // copy script prototype to template prototype
                Aria.copyObject(proto, tplPrototype);
                proto.constructor = scriptDef.$constructor || Aria.empty;
                proto.$destructor = scriptDef.$destructor || Aria.empty;
                tplPrototype[refScriptProto] = proto;
            },

            /**
             * Convert print options into a set of CSS classes and add them to the provided set of classes.
             * @param {String} classes Set of classes separated by a space (e.g. className property). If print options
             * CSS classes are already present in this string, they will be removed.
             * @param {aria.templates.CfgBeans:PrintOptions} printOptions print options
             * @return {String} the updated set of classes.
             */
            addPrintOptions : function (classes, printOptions) {
                classes = classes.replace(/(\s|^)\s*xPrint\w*/g, '');
                if (printOptions == "adaptX") {
                    classes += " xPrintAdaptX";
                } else if (printOptions == "adaptY") {
                    classes += " xPrintAdaptY";
                } else if (printOptions == "adaptXY") {
                    classes += " xPrintAdaptX xPrintAdaptY";
                } else if (printOptions == "hidden") {
                    classes += " xPrintHide";
                }
                return classes;
            },

            /**
             * Load a template in a div. You should call Aria.loadTemplate, instead of this method.
             * @param {aria.templates.CfgBeans:LoadTemplateCfg} cfg configuration object
             * @param {aria.core.CfgBeans:Callback} callback which will be called when the template is loaded or if
             * there is an error. The first parameter of the callback is a JSON object with the following properties: {
             * success : {Boolean} true if the template was displayed, false otherwise } Note that the callback is
             * called when the template is loaded, but sub-templates may still be waiting to be loaded (showing a
             * loading indicator). Note that success==true means that the template was displayed, but there may be
             * errors inside some widgets or sub-templates.
             */
            loadTemplate : function (cfg, cb) {
                var appE = Aria.getClassRef("aria.core.environment.Customizations");
                if (appE && appE.isCustomized() && !appE.descriptorLoaded()) {
                    // the application is customized but the descriptor hasn't been loaded yet: register to the event
                    appE.$onOnce({
                        'descriptorLoaded' : {
                            fn : this._startLoad,
                            scope : this,
                            args : {
                                cfg : cfg,
                                cb : cb
                            }
                        }
                    });
                } else {
                    // no descriptor was specified, or it has already been loaded: go ahead
                    this._startLoad(null, {
                        cfg : cfg,
                        cb : cb
                    });
                }
            },

            /**
             * Internal callback from loadTemplate, resumes template loading after the customization descriptor has been
             * succesfully loaded (if necessary)
             */
            _startLoad : function (evt, args) {
                var cfg = args.cfg; // little redundant? (see below)
                var cb = args.cb;
                var appE = Aria.getClassRef("aria.core.environment.Customizations");

                var oldCP = cfg.origClasspath || cfg.classpath;

                // substitute CP (see method doc)
                cfg.classpath = appE ? appE.getTemplateCP(oldCP) : oldCP;
                cfg.origClasspath = oldCP;

                // resume normal template loading
                // PROFILING // this.prototype.$startMeasure("Tpl display", cfg.classpath);
                Aria.load({
                    classes : ['aria.templates.Layout', 'aria.templates.CfgBeans', 'aria.utils.Dom',
                            'aria.templates.TemplateManager'],
                    oncomplete : {
                        fn : __loadTemplate1,
                        args : {
                            cfg : cfg,
                            cb : cb
                        },
                        scope : this
                    }
                });
            },
            /**
             * Unload a template loaded with Aria.loadTemplate. You should call Aria.disposeTemplate, instead of this
             * method.
             * @param {aria.templates.CfgBeans:Div} div The div given to Aria.loadTemplate.
             */
            disposeTemplate : function (div) {
                if (typeof(div) == "string") {
                    div = aria.utils.Dom.getElementById(div);
                }
                if (aria && aria.utils && aria.utils.Dom) {
                    return aria.templates.TemplateCtxtManager.disposeFromDom(div);
                }
            }
        }
    });
})();

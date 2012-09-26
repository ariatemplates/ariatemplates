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

(function () {

    // shortcuts
    var layout;
    var jsonValidator;
    var functionUtils;
    var typeUtils;
    var __getModulePrivateInfo;

    // list of methods to map between the template and the template context
    var methodMapping = ["$refresh", "$getChild", "$getElementById", "$focus", "$hdim", "$vdim", "getContainerScroll",
            "setContainerScroll", "__$writeId", "__$processWidgetMarkup", "__$beginContainerWidget", "$getId",
            "__$endContainerWidget", "__$statementOnEvent", "__$statementRepeater", "__$createView", "__$beginSection",
            "__$endSection", "__$bindAutoRefresh", "$setFocusedWidget", "$getFocusedWidget"];

    // list of parameters to map between the template and the template context
    var paramMapping = ["data", "moduleCtrl", "flowCtrl", "moduleRes"];

    var _wlibs = {};

    // This function must be called from a templateCtxt instance with __getLib.call(this,lib).
    var __getLib = function (lib) {
        var res = _wlibs[lib];
        if (res == null) {
            res = Aria.getClassRef(lib);
            // TODO: check if res is a library
            _wlibs[lib] = res;
        }
        if (res === undefined) {
            this.$logError(this.WIDGET_LIBRARY_NOT_FOUND, [lib, this.tplClasspath]);
        }
        return res;
    };

    var idCount = 0;

    /**
     * A TemplateCtxt object is an interface between Aria templates and a template. TemplateCtxt can be used in two
     * different ways: - either you already have a div object, and you want to put a template inside it - or you don't
     * have it yet, but want to include the markup of this template inside another markup and link the template with its
     * markup later
     * @class aria.templates.TemplateCtxt
     * @extends aria.core.JsObject
     */
    Aria.classDefinition({
        $classpath : 'aria.templates.TemplateCtxt',
        $dependencies : ['aria.templates.Layout', 'aria.templates.CfgBeans', 'aria.utils.Array', 'aria.utils.Function',
                'aria.utils.Type', 'aria.templates.TemplateCtxtManager', 'aria.templates.RefreshManager',
                'aria.templates.CSSMgr', 'aria.utils.Path', 'aria.utils.Delegate', 'aria.templates.NavigationManager',
                'aria.templates.SectionWrapper', 'aria.core.environment.Customizations',
                'aria.templates.DomElementWrapper', 'aria.templates.MarkupWriter', 'aria.utils.DomOverlay'],
        $implements : ['aria.templates.ITemplate', 'aria.templates.ITemplateCtxt'],
        $extends : "aria.templates.BaseCtxt",
        $onload : function () {
            layout = aria.templates.Layout;
            jsonValidator = aria.core.JsonValidator;
            functionUtils = aria.utils.Function;
            typeUtils = aria.utils.Type;
        },
        $onunload : function () {
            layout = null;
            jsonValidator = null;
            functionUtils = null;
            typeUtils = null;
        },
        $events : {
            "Ready" : {
                description : "Raised when the template content is fully displayed."
            }
        },
        $constructor : function () {
            this.$BaseCtxt.constructor.apply(this, arguments);

            /**
             * Array of differed content
             * @protected
             * @type Array
             */
            this._differed = null;

            /**
             * This is set to true when the "Ready" event is fired
             * @protected
             */
            this._ready = false;

            /**
             * Object used as parent for this._data.
             * @private
             * @type Object
             */
            this.__dataGround = null;

            /**
             * Keep a list of wrappers retrieved either by $getElementById. These objects contain a reference to the
             * DOM, and since I'm confident that the users will forget to dispose them, keep here a reference and
             * they'll be disposed when the template is disposed
             * @type Array
             * @private
             */
            this.__wrappers = [];

            /**
             * List of loading overlay registered to this template context
             * @type Array
             * @private
             */
            this.__loadingOverlays = [];

            /**
             * Map of loading overlays registered on a section
             * @type Object
             * @private
             */
            this.__loadingOverlaysSection = {};

            /**
             * Template context configuration
             * @protected
             * @type Object
             *
             * <pre>
             *     {
             *      div : // div acting as a container for the template
             *      tplDiv : // div of the template
             *      data : // data associated to this template
             *      macro : // main macro for this template
             *      classpath : // template classpath after customization if any
             *     }
             * </pre>
             */
            this._cfg = null;

            /**
             * Persistent storage place. This storage is persistent accross different instances of this class. It is
             * stored in the datamodel as metadata.
             * @protected
             * @type Object
             */
            this._persistentStorage = null;

            /**
             * Stores the widget Id and templates/parent template ids, starting from the parent template through to the
             * widget. Used for focus handling after refresh.
             */
            this._focusedWidgetPath = [];

            /**
             * Whether this instance of the template context has asked for the load of the global CSS widget
             * dependencies. This is normally true only for root templates.
             * @protected
             * @type Boolean
             */
            this._globalCssDepsLoaded = false; // added for PTR 05086835
        },
        $destructor : function () {
            aria.templates.TemplateCtxtManager.remove(this);
            if (this._cssClasses) {
                // PTR 04913091: only unload CSS dependencies if they were already loaded
                // Warn the CSS Manager that we are removing a template (it won't change the style)
                aria.templates.CSSMgr.unloadDependencies(this);
                if (this._globalCssDepsLoaded) {
                    // PTR 05086835: only unload the global CSS if it was loaded by this instance
                    aria.templates.CSSMgr.unloadWidgetDependencies('aria.templates.Template', [
                            'aria.templates.GlobalStyle', /* BACKWARD-COMPATIBILITY-BEGIN */'aria.widgets.GlobalStyle' /* BACKWARD-COMPATIBILITY-END */]);
                    this._globalCssDepsLoaded = false;
                }
                this._cssClasses = null;
            }
            if (this.__dataGround) {
                // break link used for root level refresh
                aria.utils.Json.setValue(this.__dataGround, "data", null);
                this.__dataGround = null;
            }

            // Dispose overlays
            this.__disposeProcessingIndicators();
            // and wrappers
            this.__disposeWrappers();

            var tpl = this._tpl;
            if (tpl) {
                try {
                    if (this.flowCtrl) {
                        this.flowCtrl.$unregisterListeners(tpl);
                    }
                    if (this.moduleCtrl) {
                        // use targeted listeners for better efficiency
                        // this.moduleCtrl.$unregisterListeners(tpl);
                        this.moduleCtrl.$removeListeners({
                            '*' : {
                                fn : tpl.onModuleEvent,
                                scope : tpl,
                                // only one was added : better perf
                                firstOnly : true
                            },
                            'beforeDispose' : {
                                fn : this._beforeModuleDispose,
                                scope : this,
                                // only one was added : better perf
                                firstOnly : true
                            }
                        });
                    }
                } catch (e) {
                    this.$logError(this.TEMPLATE_EXCEPTION_REMOVING_LISTENERS, [this.tplClasspath], e);
                }
                try {
                    tpl.$dispose();
                } catch (e) {
                    this.$logError(this.TEMPLATE_DESTR_ERROR, [this.tplClasspath], e);
                }

                // remove manually set methods
                tpl.__$write = null;
                for (var index = 0, name; name = paramMapping[index]; index++) {
                    delete tpl[name];
                }
                for (index = 0; name = methodMapping[index]; index++) {
                    delete tpl[name];
                }

                this._tpl = null;
            }

            // dispose of sections and their widgets
            var mainSection = this._mainSection;
            if (mainSection) {
                mainSection.$dispose();
                this._mainSection = null;
            }

            var cfg = this._cfg;
            if (cfg) {
                var tplDiv = cfg.tplDiv;
                if (tplDiv) {
                    this.__removeDebugInfo(tplDiv);
                    cfg.tplDiv = null;
                }
                if (cfg.div) {
                    if (typeUtils.isObject(cfg.width) || typeUtils.isObject(cfg.height)) {
                        layout.unregisterAutoresize(cfg.div);
                    }
                    aria.utils.Dom.replaceHTML(cfg.div, "");
                    cfg.div = null;
                }
                if (cfg.toDispose) {
                    var td = cfg.toDispose;
                    for (var i = td.length - 1; i >= 0; i--) {
                        td[i].$dispose();
                    }
                    cfg.toDispose = null;
                    td = null;
                }
                cfg.data = null;
                cfg.macro = null;
                this._cfg = null;
            }

            this.data = null;
            this.moduleRes = null;
            this.moduleCtrl = null;
            this.moduleCtrlPrivate = null;
            this.flowCtrl = null;
            this.flowCtrlPrivate = null;

            this.$BaseCtxt.$destructor.call(this);
        },
        $statics : {
            // ERROR MESSAGES:
            WIDGET_LIBRARY_NOT_FOUND : "Error in template '%2': widget library '%1' was not found.",
            INVALID_STATE_FOR_REFRESH : "Error in template '%1': calling $refresh while the template is being refreshed is not allowed.",
            SECTION_OUTPUT_NOT_FOUND : "Error while refreshing template '%1': output section '%2' was not found.",
            VAR_NULL_OR_UNDEFINED : "Template %2 \nLine %1: expression is null or undefined.",
            SECTION_BINDING_ERROR_SINGLE_VAR : "line %1: Cannot bind section to single variable except data. Binding must be something like container.parameter",
            SECTION_MACRO_MISUSED : "Template %1 \nline %2: section statement must either be a container or have a non-null macro property.",
            TEMPLATE_EXCEPTION_REMOVING_LISTENERS : "Error in template '%1' while removing module or flow listeners.",
            TEMPLATE_NOT_READY_FOR_REFRESH : "Error in template '%1': the $refresh method was called, but the template is not yet ready to be refreshed.",
            FOCUS_FAILURE : "Focus failure: widget/element with id '%1' in '%2' does not exist or it is not yet ready for focus.",
            DATA_READY_EXCEPTION : "Error in template %1: an exception happened in $dataReady.",
            VIEW_READY_EXCEPTION : "Error in template %1: an exception happened in $viewReady.",
            DISPLAY_READY_EXCEPTION : "Error in template %1: an exception happened in $displayReady.",
            BEFORE_REFRESH_EXCEPTION : "Error in template %1: an exception happened in $beforeRefresh.",
            AFTER_REFRESH_EXCEPTION : "Error in template %1: an exception happened in $afterRefresh.",
            ALREADY_REFRESHING : "$refresh was called while another refresh is happening on the same template (%1). This is not allowed. Please check bindings.",
            MISSING_MODULE_CTRL_FACTORY : "Template %1 cannot be initialized without aria.templates.ModuleCtrlFactory, make sure it is loaded"
        },
        $prototype : {

            /**
             * This function is called by TplClassLoader when data is available. It calls a function in the Template
             * class which can be overridden.
             */
            dataReady : function () {
                try {
                    this._tpl.$dataReady();
                } catch (e) {
                    this.$logError(this.DATA_READY_EXCEPTION, [this.tplClasspath], e);
                }
            },

            /**
             * This function is called by TplClassLoader when the template has been rendered. It calls a function in the
             * Template class which can be overridden.
             */
            viewReady : function () {
                try {
                    this._tpl.$viewReady();
                } catch (e) {
                    this.$logError(this.VIEW_READY_EXCEPTION, [this.tplClasspath], e);
                }
            },

            /**
             * This function is called by TplClassLoader when the template has been rendered, and it's subtemplates. It
             * calls a function in the Template class which can be overridden.
             */
            displayReady : function () {
                try {
                    this._tpl.$displayReady();
                } catch (e) {
                    this.$logError(this.DISPLAY_READY_EXCEPTION, [this.tplClasspath], e);
                }
            },

            /**
             * This method is called before a refresh, and call a method $beforeRefresh in the Template that can be
             * overriden.
             * @param {Object} args
             */
            beforeRefresh : function (args) {
                if (this._tpl.$beforeRefresh) {
                    try {
                        this._tpl.$beforeRefresh(args);
                    } catch (e) {
                        this.$logError(this.BEFORE_REFRESH_EXCEPTION, [this.tplClasspath], e);
                    }
                }
            },

            /**
             * This method is called after a refresh, and call a method $afterRefresh in the Template that can be
             * overriden.
             * @param {Object} sectionDescription
             *
             * <pre>
             *     {
             *         outputSection : // {String} section id
             *     }
             * </pre>
             */
            afterRefresh : function (sectionDescription) {
                if (this._tpl.$afterRefresh) {
                    try {
                        this._tpl.$afterRefresh(sectionDescription);
                    } catch (e) {
                        this.$logError(this.AFTER_REFRESH_EXCEPTION, [this.tplClasspath], e);
                    }
                }
            },

            /**
             * Do a partial or whole refresh of the template, using the specified macro and section. This method can be
             * called from templates and template scripts.
             * @param {aria.templates.CfgBeans.RefreshCfg} args macro and section for the refresh. If not specified, do
             * a complete refresh.
             * @implements aria.templates.ITemplate
             */
            $refresh : function (args) {
                if (aria.templates.RefreshManager.isStopped()) {
                    // look for the section to be refreshed, and notify it:
                    if (args) {
                        var sectionToRefresh = args.outputSection || args.filterSection;
                        if (sectionToRefresh && this._mainSection) {
                            var section = this._mainSection.getSectionById(sectionToRefresh);
                            if (section) {
                                section.notifyRefreshPlanned(args);
                                return;
                            }
                        }
                    }
                    aria.templates.RefreshManager.queue({
                        fn : this.$refresh,
                        args : args,
                        scope : this
                        // TODO : write explicite TODO ...
                        // TODO check this
                    }, this);
                } else {
                    if (!this._cfg.tplDiv) {
                        // this can happen if calling $refresh before linkToPreviousMarkup is called
                        // (for example: including a sub-template which is already in the cache, and calling refresh in
                        // the onModuleEvent of the sub-template with no condition in the template script)
                        this.$logError(this.TEMPLATE_NOT_READY_FOR_REFRESH, [this.tplClasspath]);
                        return;
                    }

                    if (this._refreshing) {
                        this.$logError(this.ALREADY_REFRESHING, [this.tplClasspath]);
                        // TODO: call return when backward compatibility is removed
                    }

                    this._refreshing = true;

                    // PROFILING // var profilingId = this.$startMeasure("Refreshing " + this.tplClasspath);

                    // stopping the refresh manager ensure that what we are doing now will not impact elements that will
                    // be disposed
                    aria.templates.RefreshManager.stop();
                    // stopping the CSS Manager as weel to avoid refreshing it every time we create a widget
                    aria.templates.CSSMgr.stop();

                    this.$assert(304, !!this._tpl); // CSS dependencies

                    var validatorParam = {
                        json : args,
                        beanName : "aria.templates.CfgBeans.RefreshCfg"
                    };

                    jsonValidator.normalize(validatorParam);
                    args = validatorParam.json;

                    // call the $beforeRefresh if defined in the script associated to the template
                    this.beforeRefresh(args);

                    var section = this.getRefreshedSection({
                        filterSection : args.filterSection,
                        outputSection : args.outputSection,
                        macro : args.macro
                    });

                    // Before removing the content from the DOM dispose any processing indicators to avoid leaks
                    this.__disposeProcessingIndicators(section);

                    if (section && !section.id) {
                        // remove also any html wrapper, in case it is a complete refresh
                        this.__disposeWrappers();
                    }

                    // Inserting a section will add the html in the page, resume the CSSMgr before
                    aria.templates.CSSMgr.resume();

                    if (section != null) {
                        this.insertSection(section);
                    }

                    this._refreshing = false;

                    // PROFILING // this.$stopMeasure(profilingId);
                    // restaure refresh manager
                    aria.templates.RefreshManager.resume();

                    // WARNING: this must always be the last thing to do
                    if (section != null) {
                        // call the $afterRefresh if defined in the script associated to the template
                        this.afterRefresh(args);
                        this.$raiseEvent({
                            name : "SectionRefreshed",
                            sectionID : section.id
                        });
                    }
                }
            },

            /**
             * Returns an array containing the widgetId, and templateIds from child to parent.
             * @return{Array} Contains the widget and template Ids.
             */
            $getFocusedWidget : function () {
                return this._focusedWidgetPath;
            },

            /**
             * Retrieves the currently focused widget, and extracts the widget Id and template Ids which combined form
             * the widget path. This is then set into a property of the templates context.
             */
            $setFocusedWidget : function () {
                var focusedElement = Aria.$window.document.activeElement;
                this._focusedWidgetPath = this._getWidgetPath(focusedElement);
            },

            /**
             * Tries to find the widget id based on an HTML element, if no id can be found then null is returned.
             * @param {HTMLElement} element which is a part of a widget that the id needs to be retrieved for.
             * @return {Array} contains ids for the widget and templates that make the focused widget path.
             */
            _getWidgetPath : function (element) {
                if (element === null || element.tagName === "BODY") {
                    return [];
                }
                var Ids = [];
                while (!element.__widget) {
                    element = element.parentElement;
                }
                var id = element.__widget.getId();
                if (!id) {
                    return [];
                }
                Ids.unshift(id);
                var context = element.__widget._context;
                while (this !== context && context !== null) {
                    id = context.getOriginalId();
                    if (!id) {
                        return [];
                    }
                    Ids.unshift(id);
                    context = context.parent;
                }
                if (context === null) {
                    return [];
                }
                return Ids;
            },

            getOriginalId : function () {
                return this._cfg.originalId;
            },

            /**
             * Build and return the HTML string containing the markup for the template. This method must only be called
             * once per template context instance, and only if the tplDiv property of the parameter of InitTemplate was
             * undefined. When this function returns a non-null argument, you must call linkToPreviousMarkup after
             * inserting the returned html in the DOM, so that widgets are properly initialized.
             * @param {aria.templates.CfgBeans.MacroCfg} macro macro to call to generate the markup
             * @param {String} filterSection section to filter
             * @return {String} html markup for the template
             */
            getMarkup : function (macro, filterSection) {
                /* must not be already linked */
                this.$assert(299, this._cfg.tplDiv == null);
                /* must not have already been called */
                this.$assert(301, this._mainSection == null);
                // run the section

                var section = this.getRefreshedSection({
                    macro : macro,
                    filterSection : filterSection,
                    outputSection : null
                });
                // returns corresponding markup
                return section.html;
            },

            /**
             * Initializes the widgets of the template after the HTML markup returned by getMarkup has been inserted in
             * the DOM.
             * @param {HTMLElement} tplDiv element in which the HTML markup has been inserted
             */
            linkToPreviousMarkup : function (tplDiv) {
                var params = this._cfg;
                /* check parameter: */
                this.$assert(320, tplDiv != null);
                /* must not be already linked: */
                this.$assert(322, params.tplDiv == null);
                /* must already have a markup waiting to be linked: */
                this.$assert(324, this._mainSection != null);
                params.tplDiv = tplDiv;
                params.div = (tplDiv.parentNode) ? tplDiv.parentNode : null;
                this.__addDebugInfo(tplDiv);
                this.insertSection(this._mainSection, true);
                // getMarkup + linkToPreviousMarkup is in fact doing the first refresh
                // so we call $afterRefresh here as well
                this.afterRefresh();
                this.$raiseEvent({
                    name : "SectionRefreshed",
                    sectionID : null
                });
            },

            /**
             * Add debug information as expandos on the tplDiv element.
             * @param {aria.templates.CfgBeans.Div} tplDiv Reference to the div where to store debug information. Do
             * nothing if tplDiv is either null or does not have the setAttribute method.
             */
            __addDebugInfo : function (tplDiv) {
                if (tplDiv && tplDiv.setAttribute) {
                    tplDiv.setAttribute("_template", this.tplClasspath);
                    tplDiv.__template = this._tpl;
                    tplDiv.__moduleCtrl = (this.moduleCtrlPrivate ? this.moduleCtrlPrivate : this.moduleCtrl);
                    tplDiv.__data = this.data;
                }
            },

            /**
             * Remove debug information from the DOM element. Do nothing if the parameter is null.
             * @param {HTMLElement} tplDiv
             */
            __removeDebugInfo : function (tplDiv) {
                if (tplDiv) {
                    tplDiv.__data = null;
                    tplDiv.__moduleCtrl = null;
                    tplDiv.__template = null;
                }
            },

            /**
             * Generate the markup for a specific section and return the section object.
             * @param {aria.templates.CfgBeans.GetRefreshedSectionCfg} args
             */
            getRefreshedSection : function (args) {
                // PROFILING // var profilingId = this.$startMeasure("Generate markup for " + this.tplClasspath);
                var validatorParam = {
                    json : args,
                    beanName : "aria.templates.CfgBeans.GetRefreshedSectionCfg"
                };
                jsonValidator.normalize(validatorParam);
                args = validatorParam.json;
                var outputSectionId = args.outputSection;
                var filterSectionId = args.filterSection;
                if (outputSectionId === undefined) {
                    outputSectionId = filterSectionId;
                }
                var sectionToReplace = null;
                if (outputSectionId != null) {
                    sectionToReplace = (this._mainSection ? this._mainSection.getSectionById(outputSectionId) : null);
                    if (sectionToReplace == null) {
                        // PROFILING // this.$stopMeasure(profilingId);
                        this.$logError(this.SECTION_OUTPUT_NOT_FOUND, [this.tplClasspath, outputSectionId]);
                        return null;
                    }

                    sectionToReplace.beforeRefresh(args);
                    // desactivate section to refresh, not to trigger bindings when creating the new section
                    sectionToReplace.stopListeners();

                }
                var writerCallback = args.writerCallback;
                if (writerCallback == null) {
                    writerCallback = {
                        fn : this._callMacro,
                        args : args.macro,
                        scope : this
                    };
                }
                var section = this.createSection(writerCallback, {
                    filterSection : filterSectionId,
                    ownIdMap : (sectionToReplace == null)
                });
                if (section == null) {
                    // PROFILING // this.$stopMeasure(profilingId);
                    return null;
                }
                if (sectionToReplace == null) {
                    // replace the whole main section
                    if (this._mainSection) {
                        this._mainSection.$dispose();
                    }
                    this._mainSection = section;
                } else {
                    if (filterSectionId) {
                        sectionToReplace.copyConfigurationTo(section);
                        var parentSection = sectionToReplace.parent;
                        this.$assert(402, parentSection != null);
                        sectionToReplace.$dispose();
                        parentSection.addSubSection(section);
                    } else {
                        // empty old section, move new section content to old section and dispose new section
                        sectionToReplace.removeContent();
                        sectionToReplace.removeDelegateIdsAndCallbacks();
                        section.moveContentTo(sectionToReplace);
                        sectionToReplace.html = section.html;
                        section.$dispose();
                        section = sectionToReplace;
                        section.resumeListeners(); // resume listeners
                    }
                }
                // PROFILING // this.$stopMeasure(profilingId);
                return section;
            },

            /**
             * Set the out object on this context and all its macro libs.
             * @param {aria.templates.MarkupWriter} out markup writer
             */
            _setOut : function (out) {
                this._out = out;
                var macrolibs = this._macrolibs || [];
                for (var i = 0, l = macrolibs.length; i < l; i++) {
                    macrolibs[i]._setOut(out);
                }
            },

            /**
             * Dynamically insert sections adjacent to a reference section.
             * {aria.templates.CfgBeans.InsertAdjacentSectionsCfg} args Adjacent sections configuration.
             */
            insertAdjacentSections : function (args) {
                var position = args.position;
                var validatorParam = {
                    json : args,
                    beanName : "aria.templates.CfgBeans.InsertAdjacentSectionsCfg"
                };
                jsonValidator.normalize(validatorParam);
                var topSection = this.createSection({
                    fn : this.__dynamicSectionWriter,
                    scope : this,
                    args : args
                });
                // insert the new section items in the DOM and initialize them
                aria.utils.Dom.insertAdjacentHTML(args.refSection.domElt, position, topSection.html);
                aria.utils.Dom.refreshDomElt(this._cfg.tplDiv);
                var parentSection = args.refSection.object;
                if (position == "beforeBegin" || position == "afterEnd") {
                    parentSection = parentSection.parent;
                }
                this.$assert(459, parentSection);
                // put the content at the right place inside the widget
                // and initialize it
                var differed = topSection.moveContentTo(parentSection);
                topSection.$dispose();
                this.$assert(466, differed);
                this.__processDifferedItems(differed);
                for (var i = 0; i < args.sections.length; i++) {
                    this.afterRefresh({
                        outputSection : args.sections[i].id
                    });
                }
            },

            /**
             * Write dynamic sections.
             * @param {aria.templates.MarkupWriter} out markup writer.
             * @param {aria.templates.CfgBeans.InsertAdjacentSectionsCfg} args Adjacent sections configuration.
             * @private
             */
            __dynamicSectionWriter : function (out, args) {
                var sections = args.sections;
                for (var i = 0, l = sections.length; i < l; i++) {
                    this.__$beginSection(null, false, sections[i]);
                    this.__$endSection();
                }
            },

            /**
             * Create a section. The section is not inserted in the sections tree of the template.
             * @param {aria.core.JsObject.Callback} callback callback which creates the content of the section. The
             * parameter given to this callback is the markup writer out object.
             * @param {Object} options optional object containing options for the markup writer
             */
            createSection : function (callback, options) {
                if (this._out != null) {
                    // calling refresh while the HTML is being generated is not permitted
                    this.$logError(this.INVALID_STATE_FOR_REFRESH, [this.tplClasspath]);
                    return null;
                }
                var out = new aria.templates.MarkupWriter(this, options);
                var res = null;
                this._setOut(out);
                this.$callback(callback, out);
                res = out.getSection();
                out.$dispose();
                this._setOut(null);
                return res;
            },

            /**
             * Insert the sction's markup in the DOM
             */
            insertSection : function (section, skipInsertHTML) {
                // PROFILING // var profilingId = this.$startMeasure("Inserting section in DOM from " +
                // PROFILING // this.tplClasspath);
                var differed;
                var params = this._cfg;
                var tpl = this._tpl;
                var domElt = !section.id ? params.tplDiv : aria.utils.Dom.getElementById(this.$getId(section.id));
                if (domElt) {
                    if (!skipInsertHTML) {
                        // replaceHTML may change domElt (especially on IE)
                        domElt = aria.utils.Dom.replaceHTML(domElt, section.html);
                    }
                    if (!section.id) {
                        // the whole template is being refreshed; let's apply the correct size
                        // to its DOM container
                        layout.setDivSize(domElt, tpl.$width, tpl.$height, 'hidden');
                    }

                    // update expando of container
                    aria.utils.Delegate.addExpando(domElt, section.delegateId);

                    differed = section.initWidgets();
                    this.__processDifferedItems(differed);
                } else {
                    // TODO: LOG ERROR
                }
                if (!skipInsertHTML) {
                    // Redundant, but makes sure that insertSection doesn't dispose the template
                    this.$assert(743, params.tplDiv && tpl);
                    aria.utils.Dom.refreshDomElt(params.tplDiv);
                }
                // PROFILING // this.$stopMeasure(profilingId);
            },

            /**
             * Process differed items returned by Section.initWidgets or Section.moveContentTo. Basically, register a
             * listener (__checkContextReadyCb) for the ElementReady event of each differed element, if any, or directly
             * call __checkContextReadyCb.
             * @param {Array} differed array of differed items
             * @private
             */
            __processDifferedItems : function (differed) {
                // TODO: what happens in case new items are refreshed while old items
                // are still there?
                if (differed.length > 0) {
                    for (var i = 0, l = differed.length; i < l; i++) {
                        differed[i].$onOnce({
                            "ElementReady" : this.__checkContextReadyCb,
                            scope : this
                        });
                    }
                    this._differed = differed;
                } else {
                    this.__checkContextReadyCb();
                }
            },

            /**
             * Callback used differed element are ready. When all elements are ready, raise "Ready" event.
             * @private
             * @param {Object} evt
             */
            __checkContextReadyCb : function (evt) {
                if (evt) {
                    var src = evt.src, differed = this._differed;
                    if (differed) {
                        aria.utils.Array.remove(differed, src);
                    }
                }
                if (!differed || !differed.length) {
                    this._differed = null;
                    this._ready = true;
                    this.displayReady();
                    this.$raiseEvent("Ready");
                    // this.$stopMeasure(null, this.tplClasspath);
                }
            },

            /**
             * Write the markup for a widget not used as a container. This method is intended to be called only from the
             * generated code of templates (created in aria.templates.ClassGenerator) and never directly from developper
             * code. A call of this method is generated for widget statements:
             * <code>{@libraryName:widgetName {...}/}</code>
             * @param {String} lib library name
             * @param {String} widget widget name in the library
             * @param {Object} cfg widget configuration
             * @param {Number} lineNbr line number in the template where the widget is
             * @private
             * @implements aria.templates.ITemplate
             */
            __$processWidgetMarkup : function (lib, widget, cfg, lineNbr) {
                var out = this._out;
                if (out.sectionState != out.SECTION_KEEP) {
                    return; // skip when we are not in the right section
                }
                var wlib = __getLib.call(this, lib);
                if (!wlib) {
                    return;
                }
                wlib.processWidgetMarkup(widget, out, cfg, lineNbr);
            },

            /**
             * Write the beginning of the markup for a widget used as a container. This method is intended to be called
             * only from the generated code of templates (created in aria.templates.ClassGenerator) and never directly
             * from developper code. A call of this method is generated for opening widget statements:
             * <code>{@libraryName:widgetName {...}}...{/@libraryName:widgetName}</code>
             * @param {String} lib library name
             * @param {String} widget widget name in the library
             * @param {Object} cfg widget configuration
             * @param {Number} lineNbr line number in the template where the widget is
             * @private
             * @implements aria.templates.ITemplate
             */
            __$beginContainerWidget : function (lib, widget, cfg, lineNbr) {
                var out = this._out;
                if (out.sectionState == out.SECTION_SKIP) {
                    return false; // skip only when the right section has already been found
                }
                out.skipContent = false;
                var wlib = __getLib.call(this, lib);
                if (!wlib) {
                    return false; // do not keep the content
                }
                var ctl = wlib.processWidgetMarkupBegin(widget, out, cfg, lineNbr);
                if (out.skipContent || ctl == null) {
                    // the widget does not want to show its content, or it does not exist
                    if (ctl) {
                        ctl.writeMarkupEnd(out);
                    }
                    return false; // do not keep the content
                } else {
                    out.addToCtrlStack(ctl);
                    return true; // also process content
                }
            },

            /**
             * Write the end of the markup for a widget used as a container. This method is intended to be called only
             * from the generated code of templates (created in aria.templates.ClassGenerator) and never directly from
             * developper code. A call of this method is generated for closing widget statements:
             * <code>{@libraryName:widgetName {...}}...{/@libraryName:widgetName}</code>
             * @private
             * @implements aria.templates.ITemplate
             */
            __$endContainerWidget : function () {
                var out = this._out, ctl = out.removeFromCtrlStack();
                ctl.writeMarkupEnd(out);
            },

            /**
             * Write markup to handle dom events. This method is intended to be called only from the generated code of
             * templates (created in aria.templates.ClassGenerator) and never directly from developper code. A call to
             * this method is generated for {on .../} statements.
             * @param {String} eventName name of the event
             * @param {aria.core.JsObject.Callback} callback callback to be called when the event is raised
             * @param {String} lineNumber
             * @private
             * @implements aria.templates.ITemplate
             */
            __$statementOnEvent : function (eventName, callback, lineNumber) {
                this._out.pushDelegate(eventName, callback);
            },

            /**
             * Create a repeater. This method is intended to be called only from the generated code of templates
             * (created in aria.templates.ClassGenerator) and never directly from developper code. A call to this method
             * is generated for {repeater .../} statements.
             * @private
             * @param {Number} lineNumber
             * @param {aria.templates.CfgBeans.RepeaterCfg} param
             * @implements aria.templates.ITemplate
             */
            __$statementRepeater : function (lineNumber, repeaterStatement) {
                this._out.repeater(repeaterStatement);
            },

            /**
             * Init the template with the given configuration.
             * @param {aria.templates.CfgBeans.InitTemplateCfg} cfg Template context configuration
             * @return {Boolean} true if there was no error
             */
            initTemplate : function (cfg) {
                if (!jsonValidator.normalize({
                    json : cfg,
                    beanName : "aria.templates.CfgBeans.InitTemplateCfg"
                })) {
                    return false;
                }
                this._out = null;
                this._cfg = cfg;
                if (cfg.id) {
                    this._id = cfg.id;
                } else {
                    this._id = "tpl" + idCount;
                    idCount++;
                }

                // if the template has been customized, get the actual (customized) classpath
                // this is already done in the widget
                // this.tplClasspath = aria.core.environment.Customizations.getTemplateCP(cfg.classpath);
                this.tplClasspath = cfg.classpath;

                // TODO: check if cfg.classpath corresponds to a template is a template
                var tpl;
                try {
                    tpl = Aria.getClassInstance(cfg.classpath);
                } catch (e) {
                    this.$logError(this.TEMPLATE_CONSTR_ERROR, [cfg.classpath], e);
                    return false;
                }
                this._tpl = tpl;

                // set the macro after tpl
                if (cfg.macro == null) {
                    cfg.macro = {
                        name : "main",
                        args : cfg.args,
                        scope : tpl
                    };
                }
                cfg.macro = this.checkMacro(cfg.macro);

                // PTR05228660: use private interface for performances
                var context = cfg.context, moduleCtrl = cfg.moduleCtrl, data = cfg.data;
                var privateInfo, moduleCtrlPrivate;

                // retrieve information from context if not specified
                if (context && !moduleCtrl) {
                    if (!data) {
                        data = context.data;
                    }
                    moduleCtrl = context.moduleCtrl;
                }

                if (moduleCtrl) {
                    // When a moduleCtrl is used, the ModuleCtrlFactory should be loaded.
                    // However, the ModuleCtrlFactory is not a static dependency cause sometimes we don't need it.
                    // TODO: today, we just fail if it's not here, replace this with a silent dynamic loading
                    // (Aria.load)
                    if (!aria.templates.ModuleCtrlFactory) {
                        this.$logError(this.MISSING_MODULE_CTRL_FACTORY, [cfg.classpath]);
                    } else {

                        if (!__getModulePrivateInfo) {
                            __getModulePrivateInfo = aria.templates.ModuleCtrlFactory.__getModulePrivateInfoMethod();
                        }
                        privateInfo = __getModulePrivateInfo.call(this, moduleCtrl);

                        if (!privateInfo) {
                            // if privateInfo is null, it means either the module controller was not created through
                            // aria.templates.ModuleCtrlFactory or it was already disposed (error was already logged in
                            // __getModulePrivateInfo)
                            return false;
                        }
                        moduleCtrlPrivate = privateInfo.moduleCtrlPrivate;

                        if (!data) {
                            data = moduleCtrlPrivate.getData();
                        } else {
                            // data where specified. If a context was also specified, try to match data with a sub
                            // controller
                            if (context) {
                                var newModuleCtrl = moduleCtrlPrivate.getSubModuleCtrl(data);
                                if (newModuleCtrl != moduleCtrl) {
                                    moduleCtrl = newModuleCtrl;
                                    // update moduleCtrl info
                                    privateInfo = __getModulePrivateInfo.call(this, moduleCtrl);
                                    if (!privateInfo) {
                                        // if privateInfo is null, it means either the module controller was not created
                                        // through aria.templates.ModuleCtrlFactory or it was already disposed (error
                                        // was already logged in __getModulePrivateInfo)
                                        return false;
                                    }
                                    moduleCtrlPrivate = privateInfo.moduleCtrlPrivate;
                                }
                            }
                        }
                    }
                }

                this.data = data;
                this.moduleCtrl = moduleCtrl;
                if (privateInfo) {
                    this.flowCtrl = privateInfo.flowCtrl;
                    this.flowCtrlPrivate = privateInfo.flowCtrlPrivate;
                    this.moduleCtrlPrivate = moduleCtrlPrivate;
                    this.moduleRes = moduleCtrlPrivate.getResourceSet();
                }

                // update configuration
                cfg.data = data;
                cfg.moduleCtrl = moduleCtrl;

                // register this template in the templateCtxtManager
                aria.templates.TemplateCtxtManager.add(this);

                if (this.data != null) {
                    this.__dataGround = {
                        data : this.data
                    };
                }

                // We no longer create new methods in a closure each time a new instance of a template is created,
                // instead we use the interface mechanism to expose methods to the template and prevent access to the
                // template context
                // LEAK & PERF IMPROVMENT : interface on these two functions results in poor performance and leaks

                var oSelf = this, index, name;

                for (index = 0; name = paramMapping[index]; index++) {
                    tpl[name] = this[name];
                }

                for (index = 0; name = methodMapping[index]; index++) {
                    tpl[name] = functionUtils.bind(this[name], this);
                }

                // do not use bind for __$write as this method is called intensively (Perf improvment)
                tpl.__$write = function (s, line) {
                    return oSelf.__$write(s, line);
                };

                if (this.moduleCtrl) {
                    this.moduleCtrl.$on({
                        '*' : {
                            fn : tpl.onModuleEvent,
                            scope : tpl
                        },
                        'beforeDispose' : {
                            fn : this._beforeModuleDispose,
                            scope : this
                        }
                    });
                }
                if (this.flowCtrl) {
                    this.flowCtrl.$on({
                        '*' : tpl.onFlowEvent,
                        scope : tpl
                    });
                }

                this._width = {};
                this._height = {};
                this.$setViewportWidth(layout.realWidth(cfg.width));
                this.$setViewportHeight(layout.realHeight(cfg.height));
                this.$setSizeCfg(tpl.__$width, tpl.__$height);
                this.__addDebugInfo(cfg.tplDiv);
                var res = tpl.__$initTemplate();
                this.__loadLibs(tpl.__$macrolibs, "macrolibs");
                return res;
            },

            /**
             * Begin a section. This method is intended to be called only from the generated code of templates (created
             * in aria.templates.ClassGenerator) and never directly from developper code. A call to this method is
             * generated for the {section ...} opening statement.
             * @param {Number} lineNumber line number at which the section begins, used for error reporting
             * @param {Boolean} container true if the section statement is used as a container, false otherwise
             * @param {Object/String} sectionParam section id, or configuration object
             * @param {String} Dom element wrapper type to be created.
             * @private
             * @implements aria.templates.ITemplate
             */
            __$beginSection : function (lineNumber, container, sectionParam, type) {
                // do the normalization here
                if (aria.utils.Type.isString(sectionParam)) {
                    sectionParam = {
                        id : sectionParam
                    };
                    if (type) {
                        sectionParam.type = type;
                    }
                }

                if (container === (sectionParam != null && sectionParam.macro != null)) {
                    // the section statement must either be a container or have a macro property
                    this.$logError(this.SECTION_MACRO_MISUSED, [this.tplClasspath, lineNumber]);
                    if (container) {
                        sectionParam.macro = null;
                    }
                }
                this._out.beginSection(sectionParam);
            },

            /**
             * End a section previously started with a call to __$beginSection. This method is intended to be called
             * only from the generated code of templates (created in aria.templates.ClassGenerator) and never directly
             * from developper code. A call to this method is generated for the {/section} closing statement.
             * @private
             * @implements aria.templates.ITemplate
             */
            __$endSection : function () {
                return this._out.endSection();
            },

            /**
             * Write some markup. This method is intended to be called only from the generated code of templates
             * (created in aria.templates.ClassGenerator) and never directly from developper code. A call to this method
             * is generated for simple text in templates and for ${...} statements.
             * @param {String} a Markup to write.
             * @param {Number} lineNumber Number of the line in the Template that is writing some markup
             * @private
             * @implements aria.templates.ITemplate
             */
            __$write : function (a, lineNumber) {
                if (a === undefined || a === null) {
                    this.$logWarn(this.VAR_NULL_OR_UNDEFINED, [lineNumber, this.tplClasspath]);
                }
                return this._out.write(a);
            },

            /**
             * Return a computed horizontal size. This method can be called from templates and template scripts.
             * @param {Number} min the size of the element (in pixels) when the template has its minimum size
             * @param {Number} incrementFactor [optional, default: 1] the proportion of the extra space (if available)
             * which should be added to the previous min argument
             * @param {Number} max [optional] the maximum size of the element (in pixels)
             * @implements aria.templates.ITemplate
             */
            $hdim : function (a, b, c) {
                return layout.getSODim(this._width, a, b, c);
            },

            /**
             * Return a computed vertical size. This method can be called from templates and template scripts.
             * @param {Number} min the size of the element (in pixels) when the template has its minimum size
             * @param {Number} incrementFactor [optional, default: 1] the proportion of the extra space (if available)
             * which should be added to the previous min argument
             * @param {Number} max [optional] the maximum size of the element (in pixels)
             * @implements aria.templates.ITemplate
             */
            $vdim : function (a, b, c) {
                return layout.getSODim(this._height, a, b, c);
            },

            /**
             * Return the div containing the template associated to this context
             * @return {HTMLElement}
             */
            getContainerDiv : function () {
                if (this._cfg && this._cfg.div) {
                    return this._cfg.div;
                }
                return null;
            },

            /**
             * Set the actual width of the template so that $hdim can work properly. This method is intended to be
             * called only from the generated code of templates (created in aria.templates.ClassGenerator) and never
             * directly from developer code.
             * @private
             */
            $setViewportWidth : function (width) {
                var so = this._width;
                layout.setSOViewport(so, width);
                if (this._tpl.$width != so.value) {
                    this._tpl.$width = so.value;
                    return true;
                }
                return false;
            },

            /**
             * Set the actual height of the template so that $vdim can work properly. This method is intended to be
             * called only from the generated code of templates (created in aria.templates.ClassGenerator) and never
             * directly from developer code.
             * @private
             */
            $setViewportHeight : function (height) {
                var so = this._height;
                layout.setSOViewport(so, height);
                if (this._tpl.$height != so.value) {
                    this._tpl.$height = so.value;
                    return true;
                }
                return false;
            },

            /**
             * Set the size config. This method is intended to be called only from the generated code of templates
             * (created in aria.templates.ClassGenerator) and never directly from developer code.
             * @param {aria.templates.CfgBeans.TemplateSizeCfg} width constraints for the width of the template
             * @param {aria.templates.CfgBeans.TemplateSizeCfg} height constraints for the height of the template
             * @private
             * @implements aria.templates.ITemplate
             */
            $setSizeCfg : function (width, height) {
                if (width) {
                    layout.setSOSizeCfg(this._width, width);
                }
                this._tpl.$width = this._width.value;
                if (height) {
                    layout.setSOSizeCfg(this._height, height);
                }
                this._tpl.$height = this._height.value;
            },

            /**
             * Call a function declared as a callback in a template
             * @param callback JSON structure used in template to declare the callback
             * @param arg object to declare the event (which will be accessible in the callback as first parameter)
             * property)
             */
            evalCallback : function (callback, arg, errorId) {
                return this._tpl.$callback(callback, arg, errorId);
            },

            /**
             * Return a global id from an id specified in a template. It adds a template-specific suffix or prefix so
             * that there is no name collision between several instances of the same template, or different templates.
             * @param {String} id specified in the template
             * @return {String} global id which should not collide with ids from other templates
             */
            $getId : function (id) {
                return [this._id, id].join("_");
            },

            /**
             * Deprecated. Please use $getId instead.
             */
            createId : function (id) {
                this.$logWarn("createId is deprecated. Please use $getId instead.");
                return this.$getId(id);
            },

            /**
             * Write generated ID to DOM Element. This method is intended to be called only from the generated code of
             * templates (created in aria.templates.ClassGenerator) and never directly from developper code. A call to
             * this method is generated for the {id ...} statement
             * @param {String} id specified in the template
             * @private
             * @implements aria.templates.ITemplate
             */
            __$writeId : function (id) {
                // the id must come from the real template context (for a macro lib today, this is not the real
                // templateCtxt)
                var genId = this._out.tplCtxt.$getId(id);
                this._out.write('id="' + genId + '"');
            },

            /**
             * Returns an HTMLElement wrapped in DomElementWrapper. This method can be called from templates and
             * template scripts.
             * @param {String} id Id specified in the templates
             * @implements aria.templates.ITemplate
             * @return aria.templates.DomElementWrapper
             */
            $getElementById : function (id) {
                var genId = this.$getId(id);
                var oElm = aria.utils.Dom.getElementById(genId);
                if (!oElm) {
                    return null;
                }

                // Get the section object, if any
                var sectionObject = this._mainSection.getSectionById(id);

                var wrapper;
                if (sectionObject) {
                    // section element
                    wrapper = new aria.templates.SectionWrapper(oElm, sectionObject);
                } else {
                    // dom element
                    wrapper = new aria.templates.DomElementWrapper(oElm, this);
                }
                if (this.__wrappers) {
                    this.__wrappers.push(wrapper);
                }
                return wrapper;
            },

            /**
             * Returns an HTMLElement wrapped in DomElementWrapper. This method can be called from templates and
             * template scripts.
             * @param {String} id Id specified in the templates
             * @param {String} index Index of child element to return
             * @implements aria.templates.ITemplate
             * @return aria.templates.DomElementWrapper
             */
            $getChild : function (id, index) {
                var Dom = aria.utils.Dom, genId = this.$getId(id), parent = Dom.getElementById(genId);
                if (parent) {
                    var oElm = Dom.getDomElementChild(parent, index);
                }
                if (oElm) {
                    var wrapper = new aria.templates.DomElementWrapper(oElm, this);
                    if (this.__wrappers) {
                        this.__wrappers.push(wrapper);
                    }
                    return wrapper;
                }
                return null;
            },

            /**
             * Return a behavior (contained in this template) from its global id.
             * @param {String} id global id of the behavior
             * @return {Object} if it exists in this template, return the behavior with the given id; otherwise, return
             * null
             */
            getBehaviorById : function (id) {
                if (this._mainSection == null) {
                    return null;
                }
                return this._mainSection.getBehaviorById(id);
            },

            /**
             * Get a persistent storage place.
             */
            getPersistentStorage : function () {
                var res = this._persistentStorage;
                if (res == null) {
                    if (this.data) {
                        res = this.data[Aria.FRAMEWORK_PREFIX + "persist::" + this.tplClasspath];
                        if (res == null) {
                            res = {};
                            this.data[Aria.FRAMEWORK_PREFIX + "persist::" + this.tplClasspath] = res;
                        }
                    } else {
                        res = {};
                    }
                    this._persistentStorage = res;
                }
                return res;
            },

            /**
             * Focus a widget with a specified id programmatically. This method can be called from templates and
             * template scripts. If the focus fails, an error is thrown.
             * @param {String|Array} containing a path of ids of the widget to focus
             * @implements aria.templates.ITemplate
             */
            $focus : function (idArray) {
                var idToFocus;
                if (aria.utils.Type.isArray(idArray)) {
                    idArray = idArray.slice(0);
                    idToFocus = idArray.shift();
                } else {
                    idToFocus = idArray;
                    idArray = [];
                }
                if (!idToFocus) {
                    return;
                }
                var focusSuccess = false; // First look for widget...
                var widgetToFocus = this.getBehaviorById(idToFocus);
                if (widgetToFocus && (typeof(widgetToFocus.focus) != "undefined")) {
                    widgetToFocus.focus(idArray);
                    focusSuccess = true;
                }
                // ... then look for arbitrary dom element with id
                if (!focusSuccess) {
                    var domElementId = this.$getId(idToFocus);
                    var elementToFocus = aria.utils.Dom.getElementById(domElementId);
                    if (elementToFocus) {
                        elementToFocus.focus();
                        focusSuccess = true;
                    }
                }
                if (!focusSuccess) {
                    this.$logError(this.FOCUS_FAILURE, [idToFocus, this.tplClasspath]);
                }
            },

            /**
             * Call the $focusFromParent method of the associated template, when it has been defined (in the script of
             * the template). Otherwise, perform the standard focus handling. It is called by the focus() method of the
             * template widget
             * @return {Boolean} success/failure of the focus
             */
            $focusFromParent : function () {
                if (this._tpl.$focusFromParent) {
                    return this._tpl.$focusFromParent();
                } else {
                    var templateContainer = aria.utils.Dom.getElementById(this._id);
                    return aria.templates.NavigationManager.focusFirst(templateContainer);
                }
            },

            /**
             * Create a view if it does not exist already. This method is intended to be called only from the generated
             * code of templates (created in aria.templates.ClassGenerator) and never directly from developper code. A
             * call to this method is generated for the {createView ...} statement.
             * @private
             * @implements aria.templates.ITemplate
             */
            __$createView : function (viewName, parameters, array) {
                var storage = this.getPersistentStorage();
                parameters.unshift(viewName); // add viewName at the begining
                var nbrParams = parameters.length;
                var view = storage;
                var eltName;
                for (var i = 0; i < nbrParams - 1; i++) {
                    eltName = parameters[i];
                    if (!view[eltName]) {
                        view[eltName] = [];
                    }
                    view = view[eltName];
                }
                eltName = parameters[nbrParams - 1];
                if (!view[eltName]) {
                    view[eltName] = new aria.templates.View(array);
                    // FIXME: this view is never disposed
                    view = view[eltName];
                } else {
                    view = view[eltName];
                    view.initialArray = array;
                }
                view.refresh();
                return storage[viewName]; // note that the returned value is not the view itself when the view has
                // parameters
            },

            /**
             * Returns true after the "Ready" event has been fired
             * @return {Boolean} true if the template is ready
             */
            isReady : function () {
                return this._ready;
            },

            /**
             * Called when the module controller is about to be disposed.
             * @param {Object} event Module controller event.
             * @protected
             */
            _beforeModuleDispose : function (evt) {
                var reloading = evt.reloadingObject;
                var tmpCfg = this._getReloadCfg();
                var isUsingModuleData = reloading && (this.moduleCtrl.getData() == tmpCfg.data);
                Aria.disposeTemplate(tmpCfg.div); // dispose the old template
                if (reloading) {
                    var oSelf = this;
                    reloading.$on({
                        scope : {},
                        "objectLoaded" : function (evt) {
                            tmpCfg.moduleCtrl = evt.object;
                            if (isUsingModuleData) {
                                tmpCfg.data = evt.object.getData();
                            }
                            oSelf._callLoadTemplate(tmpCfg);
                        }
                    });
                }
            },

            /**
             * Return the configuration object to use with Aria.loadTemplate to reload this template. With the result of
             * this method, it is possible to call this._callLoadTemplate.
             * @return {aria.templates.CfgBeans.LoadTemplateCfg}
             * @protected
             */
            _getReloadCfg : function () {
                var container = this.getContainerDiv();
                var origCP = this._cfg.origClasspath ? this._cfg.origClasspath : this._cfg.classpath;

                var tmpCfg = {
                    classpath : origCP,
                    width : this._cfg.width,
                    height : this._cfg.height,
                    printOptions : this._cfg.printOptions,
                    div : container,
                    data : this._cfg.data,
                    moduleCtrl : this.moduleCtrlPrivate, // target real module, and not the interface
                    provideContext : true, // needed for the callback for the widget case, to restore mapping
                    args : this._cfg.args
                };
                // moduleCtrl needs to be saved: it might be in toDispose of the template -> empty toDispose
                this._cfg.toDispose = [];
                return tmpCfg;
            },

            /**
             * Call Aria.loadTemplate to reload this template.
             * @param {aria.templates.CfgBeans.LoadTemplateCfg} tmpCfg configuration for Aria.loadTemplate
             * @param {aria.core.JsObject.Callback} callback callback to be called when the reload is finished
             * @protected
             */
            _callLoadTemplate : function (tmpCfg, callback) {
                var div = tmpCfg.div;
                // check if the div is still in the dom
                // (because it could be inside a template which was refreshed, so no longer in the dom)
                if (!aria.utils.Dom.isInDom(div)) {
                    this.$callback(callback);
                    return;
                }
                var tplWidget = div.__widget;
                Aria.loadTemplate(tmpCfg, function (args) {
                    // remap widget content
                    if (args.success && tplWidget) {
                        var tplCtxt = args.tplCtxt;
                        var tplCtxtManager = aria.templates.TemplateCtxtManager;
                        // TODO: find a cleaner way to do this
                        // as this template is inside a template widget, it is not a root template
                        // (even if we reloaded it with Aria.loadTemplate)
                        // This is necessary for the inspector not to display the template twice:
                        tplCtxtManager.remove(tplCtxt); // remove the template from the list of root templates
                        args.tplCtxt._cfg.isRootTemplate = false; // remove the root template flag
                        tplCtxtManager.add(tplCtxt); // add the template back to the list of templates
                        tplWidget.subTplCtxt = tplCtxt; // add the reference to the template context in the template
                        // widget
                    }

                    if (callback != null) {
                        this.$callback(callback);
                    }
                });
            },

            /**
             * Reload this template context. Note: this will destroy it.
             * @param {String} tplSource new source for template
             * @param {aria.core.JsObject.Callback} callback [optional] function called when reload is complete
             */
            $reload : function (tplSource, callback) {

                var tmpCfg = this._getReloadCfg();
                if (tplSource) {
                    aria.templates.TemplateManager.$onOnce({
                        "unloadTemplate" : {
                            fn : function () {
                                var logicalPath = tmpCfg.classpath.replace(/\./g, "/") + ".tpl";
                                var cacheContent = aria.core.Cache.getItem("files", logicalPath, true);
                                cacheContent.status = 3; // status OK
                                cacheContent.value = tplSource;
                            },
                            scope : this
                        }
                    });
                }

                tmpCfg.reload = true;
                tmpCfg.reloadByPassCache = true;

                var disposed = Aria.disposeTemplate(tmpCfg.div); // dispose the old template
                if (!disposed) {
                    this.$logError("Could not reload template: " + tmpCfg.classpath);
                } else {
                    this._callLoadTemplate(tmpCfg, callback);
                }
            },

            /**
             * Bind an automatic refresh to the template or section
             * @private
             * @implements aria.templates.ITemplate
             * @param {Object} container object containing the parameter a section or template is bound to, or data
             * @param {String} param parameter on which to bind, or null if binding to data
             * @param {Number} linNumber
             */
            __$bindAutoRefresh : function (container, param, lineNumber) {

                // de not register for partial refresh if section is not in the refresh
                if (this._out._currentSection) {
                    var boundCfg = {
                        inside : container,
                        to : param
                    };

                    if (param === null) {
                        if (container == this.data) {
                            boundCfg.inside = this.__dataGround;
                            boundCfg.to = "data";
                        } else {
                            this.$logError(this.SECTION_BINDING_ERROR_SINGLE_VAR, [lineNumber]);
                        }
                    }

                    this._out._currentSection.registerBinding(boundCfg);
                }
            },

            /**
             * Get the list of CSS classpath on which the template depends on
             * @return Array
             */
            getCSSDependencies : function () {
                var res;
                if (this._tpl) {
                    // this._tpl.$css can be null
                    res = this._tpl.$css;
                }
                if (res == null) {
                    res = [];
                }
                return res;
            },

            /**
             * Get the list of CSS classnames that should be added to the Template container DOM element
             * @param {Boolean} onlyCSSDep if true, only include CSS class names corresponding to CSS template
             * dependencies.
             * @return String
             */
            getCSSClassNames : function (onlyCSSDep) {
                var classes = this._cssClasses;
                if (!classes) {
                    if (this._cfg.isRootTemplate) {
                        // PTR 05086835: load the global CSS here, and remember that it was loaded
                        aria.templates.CSSMgr.loadWidgetDependencies('aria.templates.Template', [
                                'aria.templates.GlobalStyle', /* BACKWARD-COMPATIBILITY-BEGIN */
                                'aria.widgets.GlobalStyle' /* BACKWARD-COMPATIBILITY-END */]);
                        this._globalCssDepsLoaded = true;
                    }
                    // Load the CSS dependencies, the style should be added before the html
                    classes = aria.templates.CSSMgr.loadDependencies(this);
                    this._cssClasses = classes; // save classes for later calls
                }
                if (onlyCSSDep) {
                    return classes.join(" ");
                }
                var classNames = ["xTplContent"];
                // Add also the classes used by the CSS manager to scope a dependency
                if (classes.length) {
                    classNames = classNames.concat(classes);
                }
                return aria.core.TplClassLoader.addPrintOptions(classNames.join(" "), this._cfg.printOptions);
            },

            /**
             * Register a processing indicator, either around a DomElementWrapper or a SectionWrapper. This function
             * necessary to know which are the visible indicators during a refresh.
             * @param {Boolean} status if the indicator is visible or not
             * @param {String} id Unique indicator identifier
             * @param {String} sectionId Optional id of the section (in case the indicator is above a section)
             */
            registerProcessingIndicator : function (status, id, sectionId) {
                this.$assert(1200, id != null);
                if (status) {
                    if (!sectionId) {
                        this.__loadingOverlays.push(id);
                    } else {
                        this.__loadingOverlaysSection[sectionId] = id;
                    }
                } else {
                    if (!sectionId) {
                        aria.utils.Array.remove(this.__loadingOverlays, id);
                    } else {
                        delete this.__loadingOverlaysSection[sectionId];
                    }
                }
            },

            /**
             * Refreshes the positions ans zindexes of the processing indicators of all subsections in a recursive way
             */
            refreshProcessingIndicator : function () {
                if (this._mainSection) {
                    this._mainSection.refreshProcessingIndicator(true);
                }
            },

            /**
             * Dispose all the processing indicators associated to this template context
             * @param {aria.templates.Section} section Optional Section object in case of a section refresh
             * @private
             */
            __disposeProcessingIndicators : function (section) {
                var domOverlay = aria.utils.DomOverlay;

                // Dispose all the overlays that are not bound to a section
                domOverlay.disposeOverlays(this.__loadingOverlays);
                this.__loadingOverlays = [];

                if (!section || section.isRoot) {
                    // If I refresh the root section, dispose also all the overlays on any section
                    domOverlay.disposeOverlays(aria.utils.Array.extractValuesFromMap(this.__loadingOverlaysSection));
                    this.__loadingOverlaysSection = {};
                } else {
                    domOverlay.disposeOverlays([this.__loadingOverlaysSection[section.id]]);
                    delete this.__loadingOverlaysSection[section.id];
                }
            },

            /**
             * Dispose all DOMElement wrappers linked to this template context. This avoids memory leaks.
             * @private
             */
            __disposeWrappers : function () {
                // backward because we call splice)
                for (var i = this.__wrappers.length; i--;) {
                    this.__wrappers[i].$dispose();
                    this.__wrappers.splice(i, 1);
                }
            },

            /**
             * Return an object with the scrollTop and the scrollLeft values of the HTMLElement that contains the div of
             * the template
             * @return {Object} scrollTop and scrollLeft of the div that contains the template
             */
            getContainerScroll : function () {
                var scrollPositions = null;
                var containerDiv = this.getContainerDiv();
                if (containerDiv) {
                    scrollPositions = {
                        scrollLeft : containerDiv.scrollLeft,
                        scrollTop : containerDiv.scrollTop
                    };
                }
                return scrollPositions;
            },

            /**
             * Set the scrollTop and the scrollLeft values of the HTMLElement that contains the div of the template
             * @param {Object} contains the desired scrollTop and scrollLeft values
             */
            setContainerScroll : function (scrollPositions) {
                var containerDiv = this.getContainerDiv();
                if (containerDiv && scrollPositions) {
                    if (scrollPositions.hasOwnProperty('scrollLeft') && scrollPositions.scrollLeft != null) {
                        containerDiv.scrollLeft = scrollPositions.scrollLeft;
                    }
                    if (scrollPositions.hasOwnProperty('scrollTop') && scrollPositions.scrollTop != null) {
                        containerDiv.scrollTop = scrollPositions.scrollTop;
                    }
                }
            }
        }
    });
})();
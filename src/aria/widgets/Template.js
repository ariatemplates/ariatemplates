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
var ariaTemplatesTemplateTrait = require("../templates/TemplateTrait");
var ariaTemplatesTemplateCtxt = require("../templates/TemplateCtxt");
var ariaUtilsDom = require("../utils/Dom");
require("../templates/CfgBeans");
var ariaCoreEnvironmentCustomizations = require("../core/environment/Customizations");
var ariaWidgetsContainerContainer = require("./container/Container");
var ariaCoreJsonValidator = require("../core/JsonValidator");


/**
 * Widget used to load sub-templates.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.Template",
    $extends : ariaWidgetsContainerContainer,
    $events : {
        "ElementReady" : {
            description : "Raised when the template content is fully displayed."
        }
    },
    $constructor : function (cfg, ctxt) {
        aria.widgets.Template.superclass.constructor.apply(this, arguments);

        if (cfg.width != -1) {
            // horizontal scrollbars
            this._cssClassNames += (cfg.xForceScrollbar? " xOverflowXScroll" : " xOverflowXAuto");
        }

        if (cfg.height != -1) {
            // vertical scrollbars
            this._cssClassNames += (cfg.yForceScrollbar? " xOverflowYScroll" : " xOverflowYAuto");
        }

        this._defaultMargin = 0;

        /**
         * Element containing the template (first child of this._domElt).\
         * @protected
         * @type HTMLElement
         */
        this._subTplDiv = null;

        /**
         * Template context of the sub template.
         * @type aria.templates.TemplateCtxt
         */
        this.subTplCtxt = null;

        /**
         * Is true if a module controller instance has to be created by the template widget itself.
         * @protected
         * @type Boolean
         */
        this._needCreatingModuleCtrl = cfg.moduleCtrl && cfg.moduleCtrl.getData == null;

        /**
         * Configuration which will be sent to the template context. It is initialized with some properties in the
         * template widget constructor and completed later. It is set to null just after the template context has been
         * initialized, or if an error prevents the template from being loaded. So, if it is not null, we are still
         * waiting for the template to be loaded.
         * @protected
         * @type aria.templates.CfgBeans:InitTemplateCfg
         */
        this._tplcfg = {
            classpath : ariaCoreEnvironmentCustomizations.getTemplateCP(cfg.defaultTemplate),
            args : cfg.args,
            id : this._domId,
            originalId : this.getId()
        };

        /**
         * Callback function to be called when the sub-template has been completely loaded or if there is an error while
         * loading the template. This property must be set before the call of the writeMarkup method to ensure it is
         * called in all cases. In case of success, the callback function is called after all the widgets on the
         * sub-template have been initialized. It is not called if the widget is disposed before the end of the load of
         * the template. The first parameter of this object is a json object containing:
         *
         * <pre>
         *           {
         *                   success: {Boolean} is true if the template is correctly loaded,
         *                   templateCtxt: {aria.templates.TemplateCtxt} if success == true, contains the template context
         *           }
         * </pre>
         *
         * @type aria.core.CfgBeans:Callback
         * @public
         */
        this.tplLoadCallback = null;
    },
    $destructor : function () {
        // Remove the delegation before disposing the context as it might raise some events
        this.removeDelegation();

        this._subTplDiv = null;
        if (this.subTplCtxt) {
            this.subTplCtxt.$dispose();
            this.subTplCtxt = null;
        }
        this.tplLoadCallback = null;
        this._deleteTplcfg();
        aria.widgets.Template.superclass.$destructor.call(this);
    },
    $prototype : {
        $init : function (p) {
            var src = ariaTemplatesTemplateTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    // copy methods which are not already on this object (this avoids copying $classpath and
                    // $destructor)
                    p[key] = src[key];
                }
            }
        },


        /**
         * Add custom attributes in the container markup
         * @extraAttributes String attributes to add in the markup. For example : 'att1="val1" att1="val2"'
         */
        addExtraAttributes : function (extraAttributes) {
            if (this._extraAttributes == null) {
                this._extraAttributes = "";
            }
            this._extraAttributes += " " + extraAttributes;
        },

        /**
         * OVERRIDE Flag for widget that get initialized right after being displayed (typically, templates)
         * @protected
         * @type Boolean
         */
        _directInit : true,

        /**
         * Display an error message inside the template div. This might happen because the template context wasn't able
         * to initialize the template.
         * @protected
         */
        _errorWhileLoadingTemplate : function () {
            var tplDiv = this._subTplDiv; // may be null at this time
            if (tplDiv) {
                tplDiv.className = "xTplContent"; // remove the loading indicator
                ariaUtilsDom.replaceHTML(tplDiv, "#ERROR WHILE LOADING TEMPLATE#");
            }
            this._deleteTplcfg();
            this.$callback(this.tplLoadCallback, {
                success : false
            });
        },

        /**
         * Verify that the configuration is valid. This will set this._cfgOk to either true or false
         * @protected
         */
        _checkCfgConsistency : function () {
            var tplcfg = this._tplcfg;
            var cfg = this._cfg;
            if (this._needCreatingModuleCtrl) {
                if (!ariaCoreJsonValidator.normalize({
                    json : cfg.moduleCtrl,
                    beanName : "aria.templates.CfgBeans.InitModuleCtrl"
                })) {
                    this._cfgOk = false;
                    return;
                }
            } else {
                /* TODO: check that cfg.moduleCtrl is a module controller if it is not null */
                tplcfg.moduleCtrl = cfg.moduleCtrl;
            }
            if (cfg.width > -1) {
                tplcfg.width = cfg.width;
            }
            if (cfg.height > -1) {
                tplcfg.height = cfg.height;
            }
            tplcfg.printOptions = cfg.printOptions;
            tplcfg.baseTabIndex = cfg.baseTabIndex;
        },

        /**
         * Callback for the template load. It is called after the module controller initialization. This method creates
         * and intiliazes a template context for the widget and triggers a refresh on the template.
         * @protected
         */
        _onTplLoad : function (res, args) {
            var tplcfg = this._tplcfg;
            if (!tplcfg) {
                // the template may be ready after the widget has been disposed
                // do nothing in this case
                // except disposing the module which has just been created
                if (args.autoDispose) {
                    res.moduleCtrlPrivate.$dispose();
                }
                return;
            }

            var tplDiv = this._subTplDiv; // may be null at this time

            tplcfg.tplDiv = tplDiv;
            tplcfg.div = this._domElt;
            tplcfg.data = this._cfg.data;

            // if a module controller was created, inject it in template initialization
            if (res.moduleCtrl) {
                tplcfg.moduleCtrl = res.moduleCtrl;
            }
            tplcfg.isRootTemplate = false; // a Template Widget is not a root template
            tplcfg.context = this._context;

            if (args.autoDispose) {
                if (tplcfg.toDispose == null) {
                    tplcfg.toDispose = [res.moduleCtrlPrivate];
                } else {
                    tplcfg.toDispose.push(res.moduleCtrlPrivate);
                }
            }

            var tplCtxt = new ariaTemplatesTemplateCtxt();
            this.subTplCtxt = tplCtxt;
            tplCtxt.parent = this._context;

            var res = tplCtxt.initTemplate(tplcfg);

            if (res) {
                tplCtxt.dataReady(); // data successfully loaded: signal to template through TemplateContext
                // check that tplCtxt was not disposed
                if (tplDiv && tplCtxt._cfg) {
                    // Load the CSS dependencies, the style should be added before the html
                    tplDiv.className = tplCtxt.getCSSClassNames();
                    tplCtxt.$onOnce({
                        "Ready" : this.__innerTplReadyCb,
                        "SectionRefreshed" : {
                            fn : this.__innerTpl1stRefreshed,
                            args : {
                                success : true,
                                templateCtxt : tplCtxt
                            },
                            scope : this
                        },
                        scope : this
                    });
                    tplCtxt.$refresh();
                }
                // don't clean this object, as the template context will do it. Just break reference
                this.tplcfg = null;

            } else {
                tplCtxt.$dispose();
                this.subTplCtxt = null;
                this._errorWhileLoadingTemplate();
            }

            tplDiv = null;
        },

        /**
         * Called when inner template raises its first "SectionRefreshed" event.
         * @private
         */
        __innerTpl1stRefreshed : function (res, args) {
            this.$callback(this.tplLoadCallback, args);
        },

        /**
         * Initialize the template widget when DOM is available. As this widget has _directInit it gets initialized soon
         * after the markup is added to the DOM.
         * @protected
         */
        _init : function () {
            aria.widgets.Template.superclass._init.call(this);

            var tplDiv = ariaUtilsDom.getDomElementChild(this._domElt, 0);
            this._subTplDiv = tplDiv;
            var tplCtxt = this.subTplCtxt;

            if (tplCtxt) {
                tplCtxt.linkToPreviousMarkup(tplDiv);

                this.$callback(this.tplLoadCallback, {
                    success : true,
                    templateCtxt : tplCtxt
                });
                tplCtxt.viewReady();
            }

            // Even if not differed yet, it might still be so if its context is not yet ready
            if (!this.isDiffered) {
                // No template context means a template error, let the normal flow handle this case
                this.isDiffered = tplCtxt && !tplCtxt._ready;

                if (this.isDiffered) {
                    tplCtxt.$on({
                        "Ready" : {
                            fn : this.__differedComplete,
                            scope : this
                        }
                    });
                }
            }
        },

        /**
         * Write in the output buffer the markup for a template widget. Since the template classpath might not be loaded
         * yet, this function is asynchronous. If the template is not loaded yet it will write a placeholder, otherwise
         * the template content
         * @param {aria.templates.MarkupWriter} out Markup Writer
         * @protected
         */
        _widgetMarkup : function (out) {
            var tplcfg = this._tplcfg;
            Aria.load({
                templates : [tplcfg.classpath],
                classes : (this._needCreatingModuleCtrl ? [this._cfg.moduleCtrl.classpath] : null),
                oncomplete : {
                    scope : this,
                    fn : this._onModuleCtrlLoad
                }
            });
            var tplCtxt = this.subTplCtxt, markup;
            if (tplCtxt) {
                // the template has already been loaded, get the classname before processing the markup !important
                out.write('<div class="' + tplCtxt.getCSSClassNames() + '">');
                markup = tplCtxt.getMarkup();
                if (markup != null) {
                    out.write(markup);
                } else {
                    out.write("#ERROR IN SUBTEMPLATE#");
                }
                out.write('</div>');
                // In this case we're not quite sure whether this widget is differed or not because it might
                // contain differed widgets, understanding if this widget is differed or not is done in _init
            } else if (this._tplcfg) {
                // the template is not yet loaded, show the loading indicator
                out.write('<div class="xLDI"></div>');
                // As the context is not available, here I can be sure that this is differed
                this.isDiffered = true;
            } else {
                out.write("<div>#ERROR IN SUBTEMPLATE#</div>");
            }
        },

        /**
         * Return the DOM element used by this widget.
         * @return {HTMLElement} the DOM element used by this widget.
         */
        getDomElt : function () {
            return this._domElt;
        },

        /**
         * This function is called as callback of Ready state event when this widget's instance is differed.<br />
         * This widget is differed when the context is not ready when markup is generated, this could happen because of
         * sub templates or other differed content.
         */
        __differedComplete : function () {
            this.isDiffered = false;
            this.$raiseEvent("ElementReady");
        }
    }
});

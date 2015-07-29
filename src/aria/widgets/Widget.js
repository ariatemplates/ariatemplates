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
require("./CfgBeans");
var ariaUtilsJson = require("../utils/Json");
var ariaUtilsDom = require("../utils/Dom");
var ariaUtilsDelegate = require("../utils/Delegate");
var ariaWidgetsAriaSkinInterface = require("./AriaSkinInterface");
var ariaTemplatesRefreshManager = require("../templates/RefreshManager");
var ariaUtilsString = require("../utils/String");
var ariaWidgetsGlobalStyle = require("./GlobalStyle.tpl.css");
var ariaWidgetLibsBindableWidget = require("../widgetLibs/BindableWidget");
var ariaCoreTplClassLoader = require("../core/TplClassLoader");
var ariaCoreJsonValidator = require("../core/JsonValidator");
var environment = require("../core/environment/Environment");

/**
 * Base Widget class from which all widgets must derive
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.Widget",
    $extends : ariaWidgetLibsBindableWidget,
    $css : [ariaWidgetsGlobalStyle],
    $onload : function () {
        // check for skin existency
        if (!aria.widgets.AriaSkin) {
            this.$JsObject.$logError.call(this, this.SKIN_NOT_READY);
        }
    },

    /**
     * Widget constructor
     * @param {aria.widgets.CfgBeans:WidgetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     * @param {Number} lineNumber line number in current template
     */
    $constructor : function (cfg, context, lineNumber) {
        // if cfg is not defined, make it an object
        cfg = (!cfg) ? {} : cfg;

        this.$BindableWidget.constructor.call(this, cfg, context, lineNumber);

        this.$assert(18, context && context.$getId);

        /**
         * Reference to the dom element
         * @protected
         * @type HTMLElement
         */
        this._domElt = null;

        /**
         * Default margin for widget
         * @protected
         * @type Number
         */
        this._defaultMargin = 1;

        /**
         * Does this widget needs the default markup
         * @protected
         * @type Boolean
         */
        this._hasMarkup = true;

        /**
         * Specify if this widget is differed in it's rendering
         * @type Boolean
         */
        this.isDiffered = false;

        /**
         * Delegate id for this widget
         * @protected
         * @type String
         */
        this._delegateId = null;

        /**
         * Flag to check if initialization of widget has been done
         * @protected
         * @type Boolean
         */
        this._initDone = false;

        /**
         * Flag to check if dom for this widget have been injected (in fact only check that it has been produced)
         * @protected
         * @type Boolean
         */
        this._domReady = false;

        /**
         * Maps of parameter to update with old and new value when refresh manager is stopped.
         * @protected
         * @type Object
         */
        this._refreshMap = null;

        /**
         * CSS classes which should be applied to this widget when it is created.
         * @protected
         * @type String
         */
        this._cssClassNames = "xWidget";

        /**
         * CSS extra classes for the widget.
         * @protected
         * @type Array
         */
        this._extraCssClassNames = [];

        /**
         * Extra attributes for the widget.
         * @protected
         * @type String
         */
        this._extraAttributes = "";

        /**
         * True if the widget is in the middle of an initialization triggered by a delegated content change event.
         * @type Boolean
         * @private
         */
        this.__initWhileContentChange = false;

        this._cfgOk = ariaCoreJsonValidator.validateCfg(this._cfgBean || this._cfgPackage + "." + this.$class + "Cfg", cfg);

        // Check if the defined skinClass exists for this widget, if not set it to 'std'
        if (this._skinnableClass) {
            if (!ariaWidgetsAriaSkinInterface.checkSkinClassExists(this._skinnableClass, cfg.sclass)) {
                cfg.sclass = 'std';
            }
        }

        if (cfg.waiAria == null) {
            cfg.waiAria = environment.isWaiAria();
        }

        var bindings = cfg.bind;
        if (bindings) {
            this._initBindings(bindings);
        }

        // check id
        var id = cfg.id;
        var domId;
        if (id && id.indexOf('+') > -1) {
            if (Aria.testMode) {
                domId = this._context.$getAutoId(id);
            }
            // From the application's point of view, an id with a '+' inside it is equivalent to no id at all.
            // We only use the id with a '+' inside it to generate the id used in the DOM
            delete cfg.id;
            id = null;
        }
        this._domId = domId || (id ? this._context.$getId(id) : this._createDynamicId());
    },
    $destructor : function () {
        this.removeDelegation();

        if (this._tooltipWidget) {
            this._tooltipWidget = null;
        }
        if (this._domElt) {
            this._domElt.__widget = null;
        }

        this.$BindableWidget.$destructor.call(this);

        this._domElt = null;
        this._refreshMap = null;
        this._context = null;
        this._cfg = null;
    },
    $statics : {
        // ERROR MESSAGES:
        SKIN_NOT_READY : "CRITICAL! There is no skin available, widgets can not be used.\nCheck that the skin is properly loaded in a script tag that looks like this:\n<script src=\"/aria/css/atskin-"
                + Aria.version + ".js\" ></script>",
        WIDGET_NOT_FOUND : "%1Following %3 widget was not found in DOM: %2",
        WIDGET_TOOLTIP_NOT_FOUND : "%1Tooltip with id '%2', for widget %3 was not found in template '%4'.",
        WIDGET_BINDING_ERROR : "%1Binding failed in widget: \tInside:%2\tTo:%3",
        WIDGET_PROPERTY_DEPRECATION : "%1The following property is deprecated and will be removed from the framework in the near future. Refactor your code to avoid any issues. Property:'%2'.",
        INVALID_VERTICAL_ALIGN : "%1Invalid verticalAlign:'%2'.",

        verticalAlignTester : /^[%a-z0-9-]*$/
    },
    $prototype : {
        /**
         * Classpath of the CfgBeans to use when validating the configuration of this widget.
         * @type String
         */
        _cfgPackage : "aria.widgets.CfgBeans",

        /**
         * Widget Cfg Bean Classpath to use when validating the configuration for the widget.
         * @type String
         */
        _cfgBean : null,

        /**
         * Flag for widget that get initialized right after being displayed (typically, templates)
         * @protected
         * @type Boolean
         */
        _directInit : false,

        /**
         * Skinnable class to use for this widget.
         * @protected
         * @type String
         */
        _skinnableClass : null,

        /**
         * Initialize the binding description.
         * @param {Array} bindings List of bindings
         */
        _initBindings : function (bindings) {
            var bnd, inside, to, bindValue, transform;
            for (var bindedProperty in bindings) {
                if (bindings.hasOwnProperty(bindedProperty)) {
                    bnd = bindings[bindedProperty];
                    inside = bnd.inside;
                    to = bnd.to;
                    transform = bnd.transform;
                    if (inside && (to || to === 0)) {
                        // there is binding
                        bindValue = inside[to];

                        // Different behavior if the data bound to is defined or not.
                        // Used to be able to set default value directly in cfg
                        // without initializing data model before.
                        if (typeof(bindValue) != "undefined") {
                            if (transform) {
                                // If we have a transform specified,
                                // transform the datamodel value to widget value before storing into cfg
                                bindValue = this._transform(transform, bindValue, "toWidget");
                                if (typeof bindValue == "undefined") {
                                    // no bindValue available, skip this one
                                    continue;
                                }
                            }
                            // set the computed value, to preserve configuration
                            this._cfg[bindedProperty] = bindValue;
                        } else {
                            // If the property is explicitly set, transfer to data model
                            if (typeof(this._cfg[bindedProperty]) != "undefined") {
                                var valueToDataModel = this._transform(transform, this._cfg[bindedProperty], "fromWidget");
                                ariaUtilsJson.setValue(inside, to, valueToDataModel);
                            }
                        }
                    }
                }
            }
        },

        /**
         * Main widget entry-point called by the template objects to get the markup associated to a widget for
         * non-container widgets
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkup : function (out) {

            if (this._cfgOk) {
                if (this._hasMarkup) {
                    // call the begin method that is used also for container widgets
                    this.__markupBegin(out);
                }
                // internal markup
                this._widgetMarkup(out);
                if (this._hasMarkup) {
                    // call the end method that is used also for container widgets
                    this.__markupEnd(out);
                }
                this._domReady = true;
            } else {
                out.write('#ERROR#<span style="font-size:x-small"><br/>Widget: ' + this.$classpath + '<br/>Tpl:'
                        + this._context.tplClasspath + '<br/>Line: ' + this._lineNumber + '</span>');
            }
        },

        /**
         * Method called to write the begin markup for container widgets
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {
            if (this._cfgOk) {
                if (this._hasMarkup) {
                    this.__markupBegin(out);
                }
                this._widgetMarkupBegin(out);
            } else {
                out.write('#ERROR - Begin#<span style:"font-size:x-small"><br/>Widget: ' + this.$classpath
                        + '<br/>Tpl:' + this._context.tplClasspath + '<br/>Line: ' + this._lineNumber + '</span>');
            }
        },

        /**
         * Method called to write the end markup for container widgets
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : function (out) {
            if (this._cfgOk) {
                this._widgetMarkupEnd(out);
                if (this._hasMarkup) {
                    this.__markupEnd(out);
                }
                this._domReady = true;
            } else {
                out.write('#ERROR - End#');
            }
        },

        /**
         * Return the id of the widget, if it should be referenced from the template scripts or other widgets. Called by
         * the section when registering the widget (out.registerBehavior). This id is checked for unicity in
         * aria.templates.Section.
         * @return {String} id of the widget, as specified in the config
         */
        getId : function () {
            // do not return dynamic ids, as they don't need to be checked for unicity
            // and they are not known outside the widget
            return this._cfg.id;
        },

        /**
         * Method to write the end markup
         * @private
         * @param {aria.templates.MarkupWriter} out
         */
        __markupEnd : function (out) {
            out.write('</span>');
        },

        /**
         * Method to write the begin markup
         * @private
         * @param {aria.templates.MarkupWriter} out
         */
        __markupBegin : function (out) {
            var cfg = this._cfg, cssClasses = ariaCoreTplClassLoader.addPrintOptions(this._cssClassNames, cfg.printOptions);
            var delegateManager = ariaUtilsDelegate;
            if (cfg.block) {
                cssClasses += " xBlock";
            }

            this._checkCfgConsistency();
            if (this._extraCssClassNames.length > 0) {
                cssClasses += " " + this._extraCssClassNames.join(" ");
            }

            // widget markup begin
            out.write('<span id="' + this._domId + '" ');

            // Tag the span for event delegation. delegateId might be defined by someone else
            if (!this._delegateId) {
                this._delegateId = delegateManager.add({
                    fn : this.delegate,
                    scope : this
                });
            }
            out.write(this._extraAttributes);

            out.write(delegateManager.getMarkup(this._delegateId) + " ");

            out.write('class="' + cssClasses + '" ');

            out.write('style="');
            if (this._spanStyle != null) {
                out.write(this._spanStyle);
            }
            if (cfg.width > -1) {
                out.write('width:' + cfg.width + 'px;');
            }
            if (cfg.height != null && cfg.height != -1) {
                out.write('height:' + cfg.height + 'px;');
            }
            if (cfg.verticalAlign != null) {
                if (this.verticalAlignTester.test(cfg.verticalAlign)) {
                    out.write('vertical-align:' + cfg.verticalAlign + ';');
                } else {
                    this.$logError(this.INVALID_VERTICAL_ALIGN, [cfg.verticalAlign]);
                }
            }
            if (cfg.margins != null && cfg.margins.match(/^(\d+|x) (\d+|x) (\d+|x) (\d+|x)$/)) {
                var margins = cfg.margins.split(" ");
                out.write(['margin:', margins[0] === "x" ? this._defaultMargin : margins[0], 'px ',
                        margins[1] === "x" ? this._defaultMargin : margins[1], 'px ',
                        margins[2] === "x" ? this._defaultMargin : margins[2], 'px ',
                        margins[3] === "x" ? this._defaultMargin : margins[3], 'px;" '].join(''));
            } else {
                out.write('margin:' + this._defaultMargin + 'px;" ');
            }
            if (cfg.tooltip) {
                out.write('title="' + ariaUtilsString.escapeHTMLAttr(cfg.tooltip) + '" ');
            }
            if (cfg.tabIndex != null && !this._customTabIndexProvided && !cfg.disabled) {
                var tabIndex = this._calculateTabIndex();
                out.write('tabindex="' + tabIndex + '" ');
            }
            out.write('>'); // end of main span.
        },

        /**
         * Calculates the real tab index from configuration parameters given to the widget. Only valid to call if
         * baseTabIndex and tabIndex are correctly set, otherwise method will return -1.
         * @protected
         * @return {Number}
         */
        _calculateTabIndex : function () {
            var retVal = -1;
            if (this._context && this._context._cfg && this._context._cfg.baseTabIndex >= 0) {
                if (this._cfg.tabIndex > 0) {
                    retVal = this._context._cfg.baseTabIndex + this._cfg.tabIndex;
                } else {
                    retVal = this._cfg.tabIndex;
                }
            }
            return retVal;
        },

        /**
         * Internal function to override to generate the internal widget markup
         * @protected
         * @param {aria.templates.MarkupWriter} out
         */
        _widgetMarkup : function (out) {},

        /**
         * Internal function to override to generate the internal widget begin markup
         * @protected
         * @param {aria.templates.MarkupWriter} out
         */
        _widgetMarkupBegin : function (out) {},

        /**
         * Internal function to override to generate the internal widget end markup
         * @protected
         * @param {aria.templates.MarkupWriter} out
         */
        _widgetMarkupEnd : function (out) {},

        /**
         * Internal function called before markup generation to check the widget configuration consistency (e.g. make
         * sure that the label width is less than the widget width, etc..) When called the cfg structure has already
         * been normalized from its bean definition Note: this method must be overridden if extra-checks have to be made
         * in sub-widgets
         * @protected
         * @param {aria.widgets.CfgBeans:WidgetCfg} cfg
         */
        _checkCfgConsistency : function () {},

        /**
         * Associate the tooltip widget to this widget.
         * @protected
         */
        _linkToTooltipWidget : function () {
            var tooltipId = this._cfg.tooltipId;
            if (!tooltipId) {
                return;
            }
            var tooltipWidget = this._context.getBehaviorById(tooltipId);
            if (!tooltipWidget) {
                this.$logError(this.WIDGET_TOOLTIP_NOT_FOUND, [tooltipId, this.$class, this._context.tplClasspath]);
                return;
            }
            this._tooltipWidget = tooltipWidget;
        },

        /**
         * Handler for mouse move event, to deal with tooltip.
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onmousemove : function (domEvt) {
            if (this._tooltipWidget) {
                this._tooltipWidget.associatedWidgetMouseMove(this, domEvt);
                domEvt.$dispose();
            }
        },

        /**
         * Handler for mouse over event, to deal with tooltip.
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onmouseover : function (domEvt) {
            if (this._tooltipWidget) {
                this._tooltipWidget.associatedWidgetMouseOver(this, domEvt);
                domEvt.$dispose();
            }
        },

        /**
         * Handler for mouse out event, to deal with tooltip.
         * @protected
         * @param {aria.DomEvent} domEvt
         */
        _dom_onmouseout : function (domEvt) {
            if (this._tooltipWidget) {
                this._tooltipWidget.associatedWidgetMouseOut(this, domEvt);
                domEvt.$dispose();
            }
        },

        /**
         * Initialization method called by the delegate engine when the DOM is loaded
         */
        initWidget : function () {
            this._linkToTooltipWidget();
            this._registerBindings();
            if (this._directInit && this._hasMarkup) {
                this.initWidgetDom();
            }
        },

        /**
         * Initialize link between widget and DOM. Called when an access to dom is first required.
         * @param {HTMLElement} dom
         */
        initWidgetDom : function (dom) {
            this._initDone = true;
            if (!dom) {
                dom = ariaUtilsDom.getElementById(this._domId);
                if (!dom) {
                    this.$logError(this.WIDGET_NOT_FOUND, [this._domId, this.$class]);
                }
            }
            dom.__widget = this;
            this._domElt = dom;
            this._init();
        },

        /**
         * Internal method to override to initialize a widget when DOM is available
         * @protected
         */
        _init : function () {},

        /**
         * Set and propagate bindable property changes in JSON data if applicable. This method must be called internally
         * by widgets when one of their property changes (e.g. field value for a TextField)
         * @param {String} propertyName
         * @param {MultiTypes} newValue If transformation is used, this should be the widget value and not the data
         * model value
         * @return {Object} null if the property did not change or if no binding is defined (there is no way to get the
         * previous value) or an {oldValue:'',newValue:''} object if property changed
         */
        setProperty : function (propertyName, newValue) {

            var structureValue;

            if (!this._cfg) {
                return null;
            }

            var bnds = this._cfg.bind;
            // note that oldValue can be equal to newValue in case setWidgetProperty has already been called before
            // (happens when calling changeProperty)
            var oldValue = this.getProperty(propertyName);

            this._cfg[propertyName] = newValue;

            if (bnds) {
                var target = bnds[propertyName];
                if (target) {
                    var holder = target.inside;
                    var nm = target.to;
                    var transform = target.transform;
                    if (holder && (nm || nm === 0)) {
                        structureValue = this._transform(transform, newValue, "fromWidget");
                        var listener = this._bindingListeners[propertyName];
                        ariaUtilsJson.setValue(holder, nm, structureValue, listener ? listener.cb : null);
                    }
                }
            }

            if (oldValue !== newValue) {
                return {
                    oldValue : oldValue,
                    newValue : newValue
                };
            }
        },

        /**
         * Set property for this widget, and reflect change on itself, but not in the associated datamodel
         * @param {String} propertyName in the configuration
         * @param {Object} newValue to set
         */
        setWidgetProperty : function (propertyName, newValue) {
            if (!this._cfg) {
                return;
            }
            var oldValue = this.getProperty(propertyName);
            if (newValue != oldValue) {
                this._cfg[propertyName] = newValue;
                this._onBoundPropertyChange(propertyName, newValue, oldValue);
            }
        },

        /**
         * Set the property in the JSON model and reflect the change in the widget (setProperty() only changes the value
         * in the JSON model)
         * @param {String} propertyName
         * @param {Object} newValue. Refers to the widget value and not the data model value (transformers may apply)
         */
        changeProperty : function (propertyName, newValue) {
            if (!this._cfg) {
                return;
            }
            // setWidgetProperty must be called before setProperty
            // otherwise _onBoundPropertyChange is not called
            // (as both setWidgetProperty and setProperty change this._cfg[propertyName])
            this.setWidgetProperty(propertyName, newValue);
            this.setProperty(propertyName, newValue);
        },

        /**
         * Get the value of a configuration property, or its new value if it has changed
         * @param {String} propertyName
         * @return {Object}
         */
        getProperty : function (propertyName) {
            if (!this._cfg) {
                return null;
            }
            return this._cfg[propertyName];
        },

        /**
         * Called when a change occurs for a value with binding.
         * @protected
         * @param {Object} args details about what changed
         * @param {String} propertyName key of the binding configuration that registered this callback
         */
        _notifyDataChange : function (args, propertyName) {
            // check if widget is ready / not disposed
            if (!this._cfg) {
                return;
            }

            // retrieve binding configuration
            var bnd = this._cfg.bind[propertyName], newValue = this._transform(bnd.transform, bnd.inside[bnd.to], "toWidget");

            // retrieve new value in datamodel, and convert it to have new value for this widget

            if (ariaTemplatesRefreshManager.isStopped()) {
                // refreshes have been paused: queue a request to call for the update (only once),
                // and store parameter change
                if (!this._refreshMap) {
                    ariaTemplatesRefreshManager.queue({
                        fn : this._notifyDataChangeCB,
                        scope : this
                    }, this);
                    this._refreshMap = {};
                }
                // update new value. In case of parameter being updated this way 1 -> 2 ->1, widget won't be updated
                this._refreshMap[propertyName] = newValue;
            } else {
                this.setWidgetProperty(propertyName, newValue);
            }
        },

        /**
         * Refresh Manager notifies that widget display has to be updated. Update is based on local _refreshMap to
         * identify which parameter has changed.
         * @protected
         */
        _notifyDataChangeCB : function () {
            var refreshMap = this._refreshMap;
            if (!refreshMap) {
                // the widget may have been disposed in the mean time
                return;
            }
            // clean refresh map
            this._refreshMap = null;

            // call for changes
            for (var changed in refreshMap) {
                if (refreshMap.hasOwnProperty(changed)) {
                    this.setWidgetProperty(changed, refreshMap[changed]);
                }
            }
        },

        /**
         * Internal method called when one of the model property that the widget is bound to has changed Must be
         * overridden by sub-classes defining bindable properties
         * @protected
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value. If transformation is used, refers to widget value and not data model
         * value.
         * @param {Object} oldValue the old property value. If transformation is used, refers to widget value and not
         * data model value.
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            var domElt = this.getDom();
            if (propertyName == 'tooltip') {
                domElt.title = newValue;
            }
            if (propertyName == 'disabled') {
                var hasTabIndex = domElt.tabIndex != null;
                if (newValue && hasTabIndex) {
                    // Remove the tab index completely
                    // The optional 0 parameter is needed by IE to be case insensitive
                    domElt.removeAttribute("tabindex", 0);
                }
                if (!newValue && !hasTabIndex) {
                    // Set the configured tab index if there is one
                    var tabIndex = this.getProperty("tabIndex");
                    if (tabIndex) {
                        domElt.tabIndex = tabIndex;
                    }
                }
            }
        },

        /**
         * Delegate an incoming event
         * @param {aria.DomEvent} evt
         * @param {HTMLElement} target that raised the event delegation (not the original target)
         * @return {Boolean} event bubbles ?
         */
        delegate : function (evt) {
            var target = evt.delegateTarget;

            if (!(this._cfg.disabled || this._cfg.readOnly)) {
                if (!this._initDone) {
                    if (evt.type == "contentchange") {
                        this.__initWhileContentChange = true;
                    }
                    this.initWidgetDom(target);
                }
                var handlerName = "_dom_on" + evt.type;
                if (this[handlerName]) {
                    // false return false, everything else return true
                    return this[handlerName](evt) !== false;
                }
                return true;
            }
        },

        /**
         * Return dom element associated to this widget. Does initialization if needed.
         * @return {HTMLElement}
         */
        getDom : function () {
            if (!this._domElt && this._domReady) {
                this.initWidgetDom();
            }
            return this._domElt;
        },

        /**
         * Remove delegation from this widget id
         */
        removeDelegation : function () {
            if (this._delegateId) {
                ariaUtilsDelegate.remove(this._delegateId);
                delete this._delegateId;
            }
        }
    }
});

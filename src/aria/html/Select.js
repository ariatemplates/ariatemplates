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
/**
 * Select widget. Bindable widget providing bi-directional bind of 'selectedIndex'.
 */
Aria.classDefinition({
    $classpath : "aria.html.Select",
    $extends : "aria.html.Element",
    $statics : {
        BINDING_NEEDED : "The property '%2' from Widget %1 should be bound to a data model",
        WRONG_OPTIONS : "Can't use the options property if an html body content is defined for %1"
    },
    $dependencies : ["aria.html.beans.SelectCfg", "aria.utils.Type", "aria.html.DisabledTrait"],
    $constructor : function (cfg, context, line) {
        cfg.attributes = cfg.attributes || {};
        cfg.on = cfg.on || {};

        this._chainListener(cfg.on, 'click', {
            fn : this.__updateDataModel,
            scope : this
        });

        this._chainListener(cfg.on, 'change', {
            fn : this.__updateDataModel,
            scope : this
        });

        this._chainListener(cfg.on, 'blur', {
            fn : this.__updateDataModel,
            scope : this
        });

        this.$Element.constructor.call(this, cfg, context, line);
    },
    $prototype : {
        /**
         * Tagname to use to generate the markup of the widget
         */
        tagName : "select",

        /**
         * Classpath of the configuration bean for this widget.
         */
        $cfgBean : "aria.html.beans.SelectCfg.Properties",

        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         */
        $init : function (p) {
            var src = aria.html.DisabledTrait.prototype;
            for (var key in src) {
                if (src.hasOwnProperty(key) && !p.hasOwnProperty(key)) {
                    p[key] = src[key];
                }
            }
        },

        /**
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkup : function (out) {
            this._openTag(out);

            out.write(">");

            // now write the options tag
            // add as many items in the select element as we have elements in the options array
            var cfgOptions = this._cfg.options;

            if (cfgOptions) {
                this.options = [];
                var string = aria.utils.String;
                for (var i = 0, l = cfgOptions.length; i < l; i++) {
                    out.write("<option ");
                    var option = cfgOptions[i];

                    // need to know what is the type of the array: array of strings or array of ListItemCfgs (see
                    // selectCfg.js)
                    if (aria.utils.Type.isString(option)) {
                        // use the string as a value and a label
                        option = {
                            label : option,
                            value : option
                        };
                    } else {
                        option = {
                            label : option.label,
                            attributes : option.attributes,
                            // value is optional, so we set the default value to label(mandatory) if it's not
                            // defined
                            value : option.value == null ? option.label : option.value
                        };
                    }

                    var value = string.encodeForQuotedHTMLAttribute(option.value);

                    out.write("value=\"" + value + "\"");

                    if (option.attributes) {
                        var attributes = aria.utils.Html.buildAttributeList(option.attributes);
                        out.write(attributes);
                    }

                    out.write(">");
                    out.write(string.escapeHTML(option.label));

                    out.write("</option>");

                    this.options[i] = option;
                }
            }
            out.write("</" + this._cfg.tagName + ">");
        },

        /**
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {
            if (this.options) {
                this.$logError(this.WRONG_OPTIONS, [this.$class]);
            }
            this._openTag(out);
            out.write(">");
        },

        /**
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : function (out) {
            out.write("</" + this._cfg.tagName + ">");
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM.
         */
        initWidget : function () {
            this.$Element.initWidget.call(this);
            this.setOptions();

            var newIndex = this.getSelectedIndexFromBindings();
            if (newIndex != null) {
                this._domElt.selectedIndex = newIndex;
            }
            this.initDisabledWidgetAttribute();

            this.__updateDataModel();
        },

        /**
         * return true if the index is a number within the valid boundaries
         * @param {MultiTypes} index
         */
        isIndexValid : function (index) {
            return aria.utils.Type.isNumber(index) && index >= 0 && index <= this.options.length - 1;
        },

        /**
         * Return the selected index from the value bound to the data model. if both selectedIndex and value are bound,
         * compute the index from selectedIndex. Throws a warning if there is no binding defined in the widget
         */
        getSelectedIndexFromBindings : function () {

            var bindings = this._cfg.bind;
            var isBound = false;
            // it doesn't make sense to bind both index and value,
            // so we just state that the index takes precedence on the value
            if (bindings.selectedIndex) {
                var index = this._transform(bindings.selectedIndex.transform, bindings.selectedIndex.inside[bindings.selectedIndex.to], "toWidget");
                if (index != null) {
                    if (!this.isIndexValid(index)) {
                        index = -1;
                    }
                    return index;
                }
                isBound = true;
            }
            if (bindings.value) {
                var newValue = this._transform(bindings.value.transform, bindings.value.inside[bindings.value.to], "toWidget");
                if (newValue != null) {
                    return this.getIndex(newValue);
                }
                isBound = true;
            }

            if (!isBound) {
                this.$logWarn(this.BINDING_NEEDED, [this.$class, "selectedIndex"]);
            }
        },

        /**
         * get the options from the dom if they haven't been set from the cfg
         */
        setOptions : function () {
            if (!this.options) {
                this.options = [];
                if (this._domElt.options) {
                    for (var i = 0, l = this._domElt.options.length; i < l; i++) {
                        var elementToPush = {
                            value : this._domElt.options[i].value,
                            label : this._domElt.options[i].label
                        };
                        this.options.push(elementToPush);
                    }
                }
            }
        },

        /**
         * Function called when a value inside 'bind' has changed.
         * @param {String} name Name of the property
         * @param {Object} value Value of the changed property
         * @param {Object} oldValue Value of the property before the change happened
         */
        onbind : function (name, value, oldValue) {
            // it doesn't make sense to bind both index and value,
            // so we just state that the index takes precedence on the value

            if (name === "selectedIndex") {
                this._domElt.selectedIndex = value;
                this.setValueInDataModel();
                if (!this.isIndexValid(value)) {
                    this.setIndexInDataModel();
                }
            } else if (name === "value") {
                this._domElt.selectedIndex = this.getIndex(value);
                this.setIndexInDataModel();
                // if selectedIndex is set to -1 and value is bound we modify the data model to change the value to ''
                if (this._domElt.selectedIndex === -1) {
                    this.setValueInDataModel();
                }
            }
            this.onDisabledBind(name, value, oldValue);
        },

        /**
         * Function called to retrieve the selected index from a selected value
         * @param {Object} value Value to retrieve from the options
         */
        getIndex : function (value) {
            if (this.options) {
                for (var i = 0, l = this.options.length; i < l; i++) {
                    if (this.options[i].value === value) {
                        return i;
                    }
                }
            }
            return -1;
        },

        /**
         * Being a BindableWidget we already have one direction binding of checked (from the datamodel to the widget).
         * This function is the callback for implementing the other bind, from the widget to the datamodel. The checked
         * property is set in the datamodel on click.
         * @param {aria.DomEvent} event click event
         * @private
         */
        __updateDataModel : function (event) {

            this.setIndexInDataModel();
            this.setValueInDataModel();
        },

        /**
         * set the value in the data model from the binding
         */
        setValueInDataModel : function () {
            var bind = this._bindingListeners.value;
            if (bind) {

                var selectedIndex = this._domElt.selectedIndex;
                var value = "";
                if (selectedIndex != -1) {
                    value = this.options[this._domElt.selectedIndex].value;
                }
                var newValue = this._transform(bind.transform, value, "fromWidget");
                aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);

            }

        },

        /**
         * set the selectedIndex in the data model from the binding
         */
        setIndexInDataModel : function () {
            var bind = this._bindingListeners.selectedIndex;
            if (bind) {
                var newIndex = this._transform(bind.transform, this._domElt.selectedIndex, "fromWidget");
                aria.utils.Json.setValue(bind.inside, bind.to, newIndex, bind.cb);
            }
        }
    }
});

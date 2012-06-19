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
 * Class definition for the button widget.
 */
Aria.classDefinition({
    $classpath : "aria.widgets.action.Button",
    $extends : "aria.widgets.action.ActionWidget",
    $dependencies : ["aria.widgets.frames.FrameFactory", "aria.utils.Dom", "aria.DomEvent", "aria.utils.String"],
    $css : ["aria.widgets.action.ButtonStyle"],
    /**
     * ActionWidget constructor
     * @param {aria.widgets.CfgBeans.ActionWidgetCfg} cfg the widget configuration
     * @param {aria.templates.TemplateCtxt} ctxt template context
     */
    $constructor : function (cfg, ctxt) {
        this.$ActionWidget.constructor.apply(this, arguments);

        /**
         * Tells if the mouse is currently over the widget.
         * @protected
         * @type Boolean
         */
        this._mouseOver = false;

        /**
         * Tells if the mouse is currently pressing the widget.
         * @protected
         * @type Boolean
         */
        this._mousePressed = false;

        /**
         * Tells if a key down event happened before the last click event. This prevents an enter event to fire the
         * action twice.
         * @protected
         * @type Boolean
         */
        this._keyPressed = false;

        this._updateState(true);

        /**
         * Tells if the widgets is using a tabindex (for tab navigation).
         * @protected
         * @type Boolean
         * @override
         */
        this._customTabIndexProvided = true;

        /**
         * Pointer used to store the target on mousedown/mouseup
         * @type HTMLElement
         */
        this.currTarget = null;

        if (!this._skinnableClass) {
            /**
             * Skinnable class to use for this widget.
             * @type {String}
             * @protected
             */
            this._skinnableClass = "Button";
        }

        /**
         * Skin configutation for simpleHTML
         * @type {Object}
         * @protected
         */
        this._simpleHTML = aria.widgets.AriaSkinInterface.getSkinObject(this._skinnableClass, cfg.sclass).simpleHTML;

        if (!this._simpleHTML) {
            /**
             * Frame containing this widget.
             * @protected
             * @type {aria.widgets.frames.Frame}
             */
            this._frame = aria.widgets.frames.FrameFactory.createFrame({
                height : cfg.height,
                width : cfg.width,
                state : this._state,
                sclass : cfg.sclass,
                skinnableClass : this._skinnableClass,
                "oldStuff:cssRoot" : "BTN",
                // added in PTR 05170822 to avoid the internal scrollbard for content
                scrollBarX : false,
                scrollBarY : false
            });
        }
    },
    $destructor : function () {
        this.currTarget = null;
        if (this._frame) {
            this._frame.$dispose();
            this._frame = null;
        }
        this.$ActionWidget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
         * by all instances
         * @param {Object} p the prototype object being built
         * @param {Object} def the class definition
         * @param {Object} sdef the superclass class definition
         */
        $init : function (p, def, sdef) {
            // prototype initialization function
            // we add the bindable properties to the Widget prototype
            p.bindableProperties = p.bindableProperties.concat(["disabled"]);
        },

        /**
         * Internal method to update the state of the widget
         * @param {Boolean} skipChangeState If true the internal state won't change
         * @protected
         */
        _updateState : function (skipChangeState) {
            var state = "normal";
            var cfg = this._cfg;
            if (cfg.disabled) {
                state = "disabled";
            } else {
                if ((this._mousePressed && this._mouseOver) || this._keyPressed) {
                    state = "msdown";
                } else if (this._mouseOver) {
                    state = "msover";
                }
            }
            this._state = state;
            if (!skipChangeState) {
                // force widget - DOM mapping
                this.getDom();
                if (this._simpleHTML) {
                    if (state == "disabled") {
                        this._focusElt.setAttribute("disabled", "disabled");
                    }
                } else {
                    this._frame.changeState(this._state);
                    this._focusElt.className = (state == "disabled" ? "xButton xButtonDisabled" : "xButton");
                }
            }
        },

        /**
         * A method called when a bindable property has changed in the data model
         * @param {String} propertyName the property name
         * @param {Object} newValue the new value. If transformation is used, refers to widget value and not data model
         * value.
         * @param {Object} oldValue the old property value. If transformation is used, refers to widget value and not
         * data model value.
         * @protected
         */
        _onBoundPropertyChange : function (propertyName, newValue, oldValue) {
            this.$ActionWidget._onBoundPropertyChange.apply(this, arguments);
            var changedState = false;
            if (propertyName === "disabled") {
                changedState = true;
                this._isDisabled = !!newValue;
            }
            if (changedState) {
                this._cfg[propertyName] = newValue;
                this._updateState();
            }
        },

        /**
         * Add the remaining events that are needed for the button
         * @param {HTMLElement} actingDom html element on which actions can happen.
         * @protected
         */
        _initActionWidget : function (actingDom) {
            if (!this._simpleHTML) {
                this._frame.linkToDom(aria.utils.Dom.getDomElementChild(actingDom, 0));
            }
            this._focusElt = actingDom;
        },

        /**
         * Create the button markup from the Div class
         * @param {aria.templates.MarkupWriter} out Output markup writer
         * @protected
         */
        _widgetMarkup : function (out) {
            var cfg = this._cfg;
            var tabIndexString = (cfg.tabIndex != null ? ' tabindex="' + this._calculateTabIndex() + '" ' : '');
            var ie67 = aria.core.Browser.isIE7 || aria.core.Browser.isIE6;
            var ariaTestMode = (Aria.testMode) ? ' id="' + this._domId + '_button" ' : '';
            var buttonClass = cfg.disabled ? "xButton xButtonDisabled" : "xButton";

            if (this._simpleHTML) {
                var disableMarkup = cfg.disabled ? " disabled='disabled' " : "";
                var styleMarkup = cfg.width != "-1" ? " style='width:" + cfg.width + "px;' " : "";
                out.write(['<input type="button" value="', aria.utils.String.encodeForQuotedHTMLAttribute(cfg.label),
                        '"', ariaTestMode, tabIndexString, disableMarkup, styleMarkup, '/>'].join(''));
            } else {
                if (ie67) {
                    // FIXME: find a way to put a button also on ie6-7
                    // on ie6 and 7 the button is having display issues the current frame implementation inside it
                    out.write(['<span class="' + buttonClass + '" style="margin: 0;"', tabIndexString, ariaTestMode,
                            '>'].join(''));
                } else {
                    // PTR 05613372: prevent 'clickability' of greyed out button. Adding "disabled" makes adjusting the
                    // text color impossible in IE, thus onfocusin used (more suitable for this use case than onfocus)
                    var onFocusInString = aria.core.Browser.isIE ? " onfocusin='this.blur()' " : "";
                    out.write(['<button type="button" class="' + buttonClass + '"', onFocusInString, tabIndexString,
                            ariaTestMode, '>'].join(''));
                }
                this._frame.writeMarkupBegin(out);
                // call the method to write the content of the button - here is is just
                // the label cfg attribute, but the method can be overwritten in child classes
                this._widgetMarkupContent(out);
                this._frame.writeMarkupEnd(out);
                if (ie67) {
                    out.write('</span>');
                } else {
                    out.write('</button>');
                }
            }
        },

        /**
         * Write the content of the widget (note that _widgetMarkup writes the frame)
         * @param {aria.templates.MarkupWriter} out Output markup writer
         * @protected
         */
        _widgetMarkupContent : function (out) {
            out.write(aria.utils.String.escapeHTML(this._cfg.label));
        },

        /**
         * React to delegated mouse over events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onmouseover : function (domEvt) {
            this.$ActionWidget._dom_onmouseover.call(this, domEvt);
            this._mouseOver = true;
            this._updateState();
        },

        /**
         * React to delegated mouse out events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onmouseout : function (domEvt) {
            this.$ActionWidget._dom_onmouseout.call(this, domEvt);
            this._mouseOver = false;
            this._mousePressed = false;
            this._updateState();
        },

        /**
         * React to delegated mouse down events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onmousedown : function (domEvt) {
            this.focus();
            this._mouseOver = true;
            this._mousePressed = true;
            this._updateState();

            if (aria.core.Browser.isChrome || aria.core.Browser.isSafari) {
                this.currTarget = domEvt.currentTarget;
            }
        },

        /**
         * React to delegated mouse up events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onmouseup : function (domEvt) {
            // TODO: this method should also be called when the mouse button is released, not depending on where it is
            // released

            if (aria.core.Browser.isChrome || aria.core.Browser.isSafari) {
                if (this._mousePressed && domEvt.currentTarget == this.currTarget) {
                    // handle an onclick event
                    this._performAction(domEvt);
                }
                this.currTarget = null;
            }

            if (this._cfg) { // this._cfg can become null if e.g. the button triggers a template substitution
                // and the button is part of that template
                this._mousePressed = false;
                this._updateState();
            }

        },

        /**
         * React to delegated key down events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onkeydown : function (domEvt) {
            if (domEvt.keyCode == aria.DomEvent.KC_SPACE || domEvt.keyCode == aria.DomEvent.KC_ENTER) {
                this._keyPressed = true;
                this._updateState();
                domEvt.stopPropagation();
                return false;
            }

            return true;
        },

        /**
         * The method called when the markup is clicked
         * @param {aria.DomEvent} evt Event
         * @method
         * @private
         */
        _dom_onclick : (aria.core.Browser.isChrome || aria.core.Browser.isSafari) ? function (domEvent) {
            this._keyPressed = false;
            return; // we don't catch onclick's for buttons on chrome & safari. we catch mouseup's instead
        } : function (domEvent) {
            if (this._keyPressed) {
                this._keyPressed = false;
                return;
            }
            this._performAction(domEvent);
        },

        /**
         * React to delegated key up events
         * @protected
         * @param {aria.DomEvent} domEvt Event
         */
        _dom_onkeyup : function (domEvt) {
            if (domEvt.keyCode == aria.DomEvent.KC_SPACE || domEvt.keyCode == aria.DomEvent.KC_ENTER) {
                this._keyPressed = false;
                this._updateState();

                if (!this._performAction(domEvt)) {
                    domEvt.stopPropagation();
                    return false;
                }
                return true;
            }
            return true;
        }
    }
});
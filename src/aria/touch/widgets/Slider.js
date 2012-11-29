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
 * Touch Slider Widget.
 */
Aria.classDefinition({
    $classpath : 'aria.touch.widgets.Slider',
    $extends : 'aria.widgetLibs.BaseWidget',
    $css : ['aria.touch.widgets.SliderCSS'],
    $statics : {
        INVALID_CONFIGURATION : "Invalid configuration for the slider!",
        BUTTON_WIDTH : 14
    },
    $dependencies : ['aria.touch.widgets.SliderCfgBeans', 'aria.touch.Swipe'],
    /**
     * Slider Constructor.
     * @param {aria.touch.widgets.SliderCfgBeans.SliderCfg} cfg slider configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.apply(this, arguments);
        var normalizeArg = {
            beanName : "aria.touch.widgets.SliderCfgBeans.SliderCfg",
            json : this._cfg
        };
        try {
            this._cfgOk = aria.core.JsonValidator.normalize(normalizeArg, true);
        } catch (e) {
            this.$logError(this.INVALID_CONFIGURATION, null, e);
        }
        if (!this._cfgOk) {
            return;
        }
        /**
         * Maximum value for this._leftPosition, in pixels.
         * @type Number
         * @protected
         */
        this._maxLeftPosition = this._cfg.width - this.BUTTON_WIDTH;
        if (this._maxLeftPosition < 10) {
            this._maxLeftPosition = 10;
        }
        var binding = this._cfg.bindValue;
        if (binding) {
            this._bindingCallback = {
                fn : this._notifyDataChange,
                scope : this
            };
            aria.utils.Json.addListener(binding.inside, binding.to, this._bindingCallback, false);
        }
        /**
         * Value of the widget (must be between 0 and 1)
         * @type Number
         * @protected
         */
        this._value = null;
        this._readValue();
        /**
         * Distance in pixels between the left side of the slider and the left side of its button.
         * @type Number
         * @protected
         */
        this._leftPosition = null;
        this._setLeftPosition(this._value * this._maxLeftPosition);
        /**
         * Id generated for the button DOM element of the slider.
         * @type String
         * @protected
         */
        this._domId = this._createDynamicId();
        /**
         * Id generated for the slider container element.
         * @type String
         * @protected
         */
        this._parentDomId = this._createDynamicId();
        /**
         * Reference to the button DOM element of the slider. It is only defined after the value of the slider is
         * changed through bindings or if the user interacts with the slider (see the _updateDisplay method).
         * @type String
         * @protected
         */
        this._domElt = null;

        /**
         * Value of the page/clientX property of the touch event when the user started moving the slider. It is then
         * updated so that it is always the position of the touch for which there is no change of the position of the
         * slider.
         * @type Number
         * @protected
         */
        this._savedX = null;

        /**
         * True if the value has changed between the time the widget is created and the time its markup is inserted in
         * the DOM.
         * @type Boolean
         * @protected
         */
        this._needUpdate = false;

        var ariaWindow = aria.utils.AriaWindow;
        ariaWindow.$on({
            "attachWindow" : this._attachBodyEvents,
            "detachWindow" : this._detachBodyEvents,
            scope : this
        });
        if (ariaWindow.isWindowUsed) {
            this._attachBodyEvents();
        }
    },
    $destructor : function () {
        this._detachBodyEvents();
        if (this._bindingCallback) {
            var binding = this._cfg.bindValue;
            aria.utils.Json.removeListener(binding.inside, binding.to, this._bindingCallback, false);
            this._bindingCallback = null;
        }
        this._domElt = null;
        this._cfgOk = null;
        this._maxLeftPosition = null;
        this._cfg = null;
        this._value = null;
        this._leftPosition = null;
        this._domId = null;
        this._savedX = null;
        this._needUpdate = null;
        this.$BaseWidget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Main widget entry-point, called by the widget library. Write the markup of the slider.
         * @param {aria.templates.MarkupWriter} out
         * @public
         */
        writeMarkup : function (out) {
            if (!this._cfgOk) {
                // configuration was incorrect, do not generate any markup in this case
                return;
            }
            var html = ['<div class="touchLibSlider" style="width:', this._maxLeftPosition + this.BUTTON_WIDTH,
                    'px;" id="', this._parentDomId, '"><span id="', this._domId, '" class="sliderButton" style="left:',
                    this._leftPosition, 'px;">&nbsp;</span></div>'];
            out.write(html.join(''));
        },

        /**
         * Listen for swipestart and swipecancel.
         * @protected
         */
        _attachBodyEvents : function () {
            aria.touch.Swipe.$on({
                swipestart : {
                    fn : this._dom_onswipestart,
                    scope : this
                },
                swipecancel : {
                    fn : this._dom_onswipecancel,
                    scope : this
                }
            });
        },

        /**
         * Unregister all listeners for the swipe gesture.
         * @protected
         */
        _detachBodyEvents : function () {
            aria.touch.Swipe.$unregisterListeners(this);
        },

        /**
         * Used when the user first touches the slider button.
         * @param {Object} evt swipestart event
         * @protected
         */
        _dom_onswipestart : function (evt) {
            var domElt = this.getButtonDom();
            var target = (evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement;
            if (target.id === domElt.id) {
                (evt.originalEvent.preventDefault)
                        ? evt.originalEvent.preventDefault()
                        : evt.originalEvent.returnValue = false;
                this._savedX = evt.startX;
                this._updateDisplay();
                aria.touch.Swipe.$on({
                    swipemove : {
                        fn : this._dom_onswipemove,
                        scope : this
                    },
                    swipeend : {
                        fn : this._dom_onswipeend,
                        scope : this
                    }
                });
            }
        },

        /**
         * Used when the user moves their finger along the slider.
         * @param {Object} evt swipemove event
         * @protected
         */
        _dom_onswipemove : function (evt) {
            var domElt = this.getButtonDom();
            var target = (evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement;
            if (target.id === domElt.id || (domElt.parentNode.id && target.id === domElt.parentNode.id)) {
                (evt.originalEvent.preventDefault)
                        ? evt.originalEvent.preventDefault()
                        : evt.originalEvent.returnValue = false;
                var diff = evt.route.endX - this._savedX;
                var oldLeftPosition = this._leftPosition;
                this._setLeftPosition(this._leftPosition + diff);
                this._savedX += this._leftPosition - oldLeftPosition;
                this._updateDisplay();
                this._setValue(this._leftPosition / this._maxLeftPosition);
            }
        },

        /**
         * Used when the user stops touching the slider.
         * @param {Object} evt swipeend event
         * @protected
         */
        _dom_onswipeend : function (evt) {
            this._dom_onswipecancel();
            var domElt = this.getButtonDom();
            var target = (evt.originalEvent.target) ? evt.originalEvent.target : evt.originalEvent.srcElement;
            if (target.id === domElt.id) {
                (evt.originalEvent.preventDefault)
                        ? evt.originalEvent.preventDefault()
                        : evt.originalEvent.returnValue = false;
                this._updateDisplay();
                this._setValue(this._leftPosition / this._maxLeftPosition);
            }
        },

        /**
         * Used when the swipe was invalid.
         * @protected
         */
        _dom_onswipecancel : function () {
            this._detachBodyEvents();
            this._attachBodyEvents();
        },

        /**
         * Set the position of the button in pixels
         * @param {Number} newLeftPosition new position
         * @protected
         */
        _setLeftPosition : function (newLeftPosition) {
            if (newLeftPosition > this._maxLeftPosition) {
                newLeftPosition = this._maxLeftPosition;
            } else if (newLeftPosition < 0) {
                newLeftPosition = 0;
            }
            this._leftPosition = newLeftPosition;
        },

        /**
         * Set the value of the slider in the data model.
         * @param {Number} newValue new value
         * @protected
         */
        _setValue : function (newValue) {
            if (newValue !== this._value) {
                this._value = newValue;
                var binding = this._cfg.bindValue;
                if (binding) {
                    aria.utils.Json.setValue(binding.inside, binding.to, newValue);
                }
            }
        },

        /**
         * Read the bound value in the data model, ensure it is defined, between 0 and 1, and assign the _value
         * property.
         * @protected
         */
        _readValue : function () {
            var value = this._value;
            var binding = this._cfg.bindValue;
            if (binding) {
                value = binding.inside[binding.to];
            }
            if (value === null) {
                value = 0;
            }
            if (value < 0) {
                value = 0;
            }
            if (value > 1) {
                value = 1;
            }
            this._value = value;
        },

        /**
         * Internal method called when the value in the data model changed (this method was registered with addListener
         * in the constructor of the slider).
         * @protected
         */
        _notifyDataChange : function () {
            this._readValue();
            this._setLeftPosition(this._value * this._maxLeftPosition);
            this._updateDisplay();
        },

        /**
         * Uses this._leftPosition to update the actual display of the slider.
         * @protected
         */
        _updateDisplay : function () {
            var domElt = this.getButtonDom();
            if (!domElt) {
                // This case may happen if the bound value changed between the time the widget is created and the time
                // its markup is inserted in the DOM
                this._needUpdate = true; // mark that it needs update (it will be updated when the widget is inserted
                // in the DOM, see the initWidget method)
                return;
            }
            var className = "sliderButton";
            className += " down";
            if (domElt.className != className) {
                domElt.className = className;
            }
            var leftStyle = this._leftPosition + "px";
            if (domElt.style.left != leftStyle) {
                domElt.style.left = leftStyle;
            }
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM. This method calls
         * _updateDisplay if the value has changed between the time the widget is created and the time its markup is
         * inserted in the DOM.
         * @public
         */
        initWidget : function () {
            if (this._needUpdate) {
                this._updateDisplay();
            }
        },

        /**
         * Return the DOM element corresponding to the button of the slider.
         * @return {HTMLElement}
         * @public
         */
        getButtonDom : function () {
            var domElt = this._domElt;
            if (domElt === null) {
                domElt = aria.utils.Dom.getElementById(this._domId);
                this._domElt = domElt;
            }
            return domElt;
        },

        /**
         * Return the DOM element corresponding to the whole slider.
         * @return {HTMLElement}
         * @public
         */
        getDom : function () {
            var domElt = this.getButtonDom();
            return domElt.parentNode;
        }
    }
});

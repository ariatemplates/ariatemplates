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
 * Double Slider widget.<br/> This widget has two movable thumbs over a region defined by the width of the widget.<br/>
 * The first thumb is aligned on its right border, while the second thumb on its left, this allows them to have the same
 * value. The length of the rail (where the thumbs can move) is thus the difference between the widget's width and its
 * thumbs width.
 */
Aria.classDefinition({
    $classpath : "aria.touch.widgets.DoubleSlider",
    $extends : "aria.widgetLibs.BaseWidget",
    $css : ["aria.touch.widgets.DoubleSliderCSS"],
    $statics : {
        INVALID_CONFIGURATION : "Invalid configuration for the slider!"
    },
    $dependencies : ["aria.touch.widgets.SliderCfgBeans", "aria.utils.Dom", "aria.utils.Type", "aria.utils.Mouse",
            "aria.utils.Html"],
    /**
     * Slider Constructor.
     * @param {aria.touch.widgets.SliderCfgBeans:DoubleSliderCfg} cfg slider configuration
     * @param {aria.templates.TemplateCtxt} context template context
     * @param {Number} lineNumber line number in the template
     */
    $constructor : function (cfg, context, lineNumber) {
        this.$BaseWidget.constructor.apply(this, arguments);

        /**
         * Whether the widget configuration is valid
         * @type Boolean
         * @protected
         */
        this._cfgOk = aria.core.JsonValidator.validateCfg("aria.touch.widgets.SliderCfgBeans.DoubleSliderCfg", cfg);

        if (!this._cfgOk) {
            return;
        }

        /**
         * Computed width of the first thumb. The actual value is compute on initialization.
         * @type Number
         * @protected
         */
        this._firstWidth = 0;

        /**
         * Computed width of the second thumb. The actual value is compute on initialization. Being aligned differently
         * it should account for the borders.
         * @type Number
         * @protected
         */
        this._secondWidth = 0;

        /**
         * Width of the rail between the two thumbs.
         * @type Number
         * @protected
         */
        this._railWidth = 0;

        /**
         * Value of the widget (must be an array of values between 0 and 1)
         * @type Array
         * @protected
         */
        this.value = [0, 0];

        /**
         * Value before the start of a move, this is kept to raised the change event only if after a move the new value
         * changes
         * @type Array
         * @protected
         */
        this._oldValue = [0, 0];
        this._readValue();

        /**
         * Dom Reference for the first thumb of the slider
         * @type HTMLElement
         * @protected
         */
        this._firstSlider = null;

        /**
         * Dom Reference for the second thumb of the slider
         * @type HTMLElement
         * @protected
         */
        this._secondSlider = null;

        /**
         * Reference to the button DOM element of the slider.
         * @type HTMLElement
         * @protected
         */
        this._domElt = null;

        /**
         * Dom Reference for the region between the two thumbs
         * @type HTMLElement
         * @protected
         */
        this._hightlight = null;

        /**
         * Geometry of the parent slider element
         * @type Object
         * @protected
         */
        this._geometry = null;

        /**
         * Initial position of the element being dragged
         * @type Number
         * @protected
         */
        this._initialDrag = 0;

        var binding = this._cfg.bind ? this._cfg.bind.value : null;
        /**
         * Description of the bind value
         * @type Object
         * @protected
         */
        this._binding = binding;
        if (binding) {
            /**
             * Callback for the data change
             * @protected
             * @type aria.core.CfgBeans:Callback
             */
            this._bindingCallback = {
                fn : this._notifyDataChange,
                scope : this
            };
            aria.utils.Json.addListener(binding.inside, binding.to, this._bindingCallback, false);
        }

        /**
         * Value of the first thumb page/clientX property of the touch/mouse event when the user started moving the
         * slider. It is then updated so that it is always the position of the touch/mouse for which there is no change
         * of the position of the slider.
         * @type Number
         * @protected
         */
        this._savedX1 = 0;

        /**
         * Value of the second thumb page/clientX property of the touch/mouse event when the user started moving the
         * slider. It is then updated so that it is always the position of the touch/mouse for which there is no change
         * of the position of the slider.
         * @type Number
         * @protected
         */
        this._savedX2 = 0;

        /**
         * Id generated for the DOM element of the slider.
         * @type String
         * @protected
         */
        this._domId = cfg.id ? context.$getId(cfg.id) : this._createDynamicId();

        /**
         * Id generated for the first thumb DOM element of the slider.
         * @type String
         * @protected
         */
        this._firstDomId = this._domId + "_first";

        /**
         * Id generated for the second thumb DOM element of the slider.
         * @type String
         * @protected
         */
        this._secondDomId = this._domId + "_second";

        /**
         * List of Drag instances associated to the two thumbs
         * @type Array of aria.utils.dragdrop.Drag
         */
        this._draggable = [];

    },
    $destructor : function () {
        if (this._binding) {
            var binding = this._binding;
            aria.utils.Json.removeListener(binding.inside, binding.to, this._bindingCallback, false);
            this._bindingCallback = null;
        }
        if (this._draggable) {
            for (var i = 0, len = this._draggable.length; i < len; i++) {
                this._draggable[i].$dispose();
            }
        }
        this._draggable = null;
        this._firstSlider = null;
        this._secondSlider = null;
        this._domElt = null;

        this.$BaseWidget.$destructor.call(this);
    },
    $prototype : {
        /**
         * Return the configured id of the widget, this is used by the section to register the widget's behavior
         * @return {String}
         */
        getId : function () {
            return this._cfg.id;
        },

        /**
         * Return the DOM element of the widget
         * @return {HTMLElement}
         */
        getDom : function () {
            return this._domElt.parentNode;
        },

        /**
         * Main widget entry-point, called by the widget library. Write the markup of the slider.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkup : function (out) {
            if (!this._cfgOk) {
                // configuration was incorrect, do not generate any markup in this case
                this.initWidget = Aria.empty;
                return out.write(this.INVALID_CONFIGURATION);
            }

            var cfg = this._cfg;
            cfg.attributes = cfg.attributes || {};
            cfg.attributes.classList = cfg.attributes.classList || [];
            cfg.attributes.classList.push("touchLibDoubleSlider");

            out.write([
                    // Div containing the widget
                    '<div ', aria.utils.Html.buildAttributeList(cfg.attributes), '" style="width:', this._cfg.width,
                    'px;">',
                    // Rail, thumbs move over here
                    '<span class="touchContainer" style="width:', cfg.width, 'px;" id="', this._domId, '">',
                    // Two thumbs
                    '<span id="', this._secondDomId, '" class="sliderButton secondPoint" style="left:0px;"></span>',
                    '<span id="', this._firstDomId, '" class="sliderButton firstPoint" style="left:0px;"></span>',
                    // Highlight the part between two thumbs
                    '<span class="sliderHighLight" id="', this._domId + "_hightlight", '"></span>', '</span></div>'].join(""));
        },

        /**
         * Initialization method called after the markup of the widget has been inserted in the DOM. This method calls
         * _updateDisplay if the value has changed between the time the widget is created and the time its markup is
         * inserted in the DOM.
         */
        initWidget : function () {
            this._readValue();

            this._firstSlider = aria.utils.Dom.getElementById(this._firstDomId);
            this._secondSlider = aria.utils.Dom.getElementById(this._secondDomId);
            this._domElt = aria.utils.Dom.getElementById(this._domId);
            this._hightlight = aria.utils.Dom.getElementById(this._domId + "_hightlight");

            this._firstWidth = parseInt(aria.utils.Dom.getStyle(this._firstSlider, "width"), 10);
            this._secondWidth = parseInt(aria.utils.Dom.getStyle(this._secondSlider, "width"), 10);
            this._secondWidth += parseInt(aria.utils.Dom.getStyle(this._secondSlider, "borderLeftWidth"), 10) || 0;
            this._secondWidth += parseInt(aria.utils.Dom.getStyle(this._secondSlider, "borderRightWidth"), 10) || 0;
            this._railWidth = this._cfg.width - this._firstWidth - this._secondWidth;

            this._geometry = aria.utils.Dom.getGeometry(this._domElt);
            this._setLeft();
            this._updateDisplay();
            if (aria.core.Browser.isIE) {
                this.getDom().onselectstart = Aria.returnFalse;
            }
            this._loadAndCreateDraggable();
        },

        /**
         * Read the bound value in the data model, ensure it is defined, between 0 and 1, and assign the value property.
         * @protected
         */
        _readValue : function () {
            var value, binding = this._binding;
            if (!binding) {
                return;
            }
            value = binding.inside[binding.to];
            if (aria.utils.Type.isArray(value)) {
                // Constrain values to be between 0 and 1 and the first to be smaller
                this.value[0] = Math.max(0, Math.min(value[0], value[1], 1));
                this.value[1] = Math.min(1, Math.max(value[0], value[1], 0));
            }
            aria.utils.Json.setValue(binding.inside, binding.to, this.value, this._bindingCallback);
        },

        /**
         * Set the left position of the two thumbs without knowing if they are correct. The first thumb is aligned on
         * the left, while the second on the right.
         */
        _setLeft : function () {
            var first = Math.max(0, Math.min(this.value[0], this.value[1], 1));
            var second = Math.min(1, Math.max(this.value[0], this.value[1], 0));
            this._savedX1 = Math.floor(first * this._railWidth);
            this._savedX2 = Math.ceil(second * this._railWidth + this._firstWidth);
        },

        /**
         * Update the position of the thumbs of the slider depending on the index. It also updates the width and
         * position of the highlight.
         * @protected
         */
        _updateDisplay : function () {
            this._firstSlider.style.left = this._savedX1 + "px";
            this._secondSlider.style.left = this._savedX2 + "px";
            this._updateHighlight();
        },

        /**
         * Update the width and position of the highlight between two thumbs.
         * @protected
         */
        _updateHighlight : function () {
            var left = this._savedX1 + this._firstWidth / 2;
            var widthHighlight = this._savedX2 + (this._secondWidth / 2) - left;
            this._hightlight.style.left = left + "px";
            this._hightlight.style.width = widthHighlight + "px";
        },

        /**
         * Internal method called when the value in the data model changed (this method was registered with addListener
         * in the constructor of the slider).
         * @protected
         */
        _notifyDataChange : function () {
            this._readValue();
            this._setLeft();
            this._updateDisplay();
        },

        /**
         * Load the dependency for Drag before if not loaded yet.
         * @protected
         */
        _loadAndCreateDraggable : function () {
            if (aria.utils.dragdrop && aria.utils.dragdrop.Drag) {
                this._createSliderDrag();
            } else {
                Aria.load({
                    classes : ["aria.utils.dragdrop.Drag"],
                    oncomplete : {
                        fn : this._createSliderDrag,
                        scope : this
                    }
                });
            }
        },

        /**
         * Create the Draggable element.
         * @protected
         */
        _createSliderDrag : function () {
            if (!this._cfg) {
                // In case the widget gets disposed while loading the dependencies
                return;
            }
            var thumbs = [this._firstSlider, this._secondSlider];
            for (var i = 0, len = thumbs.length; i < len; i++) {
                this._draggable[i] = new aria.utils.dragdrop.Drag(thumbs[i], {
                    handle : thumbs[i],
                    proxy : null,
                    axis : "x",
                    constrainTo : this._domElt
                });
                this._draggable[i].$on({
                    "dragstart" : {
                        fn : this._onDragStart,
                        scope : this
                    },
                    "move" : {
                        fn : this._onDragMove,
                        scope : this
                    },
                    "dragend" : {
                        fn : this._onDragEnd,
                        scope : this
                    }
                });
            }
        },

        /**
         * Handle the beginning of a drag
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragStart : function (evt) {
            this._oldValue = [this.value[0], this.value[1]];
            // Just store the initial position of the element to compute the move later
            this._initialDrag = evt.src.posX;
        },

        /**
         * Handle the move during a drag by setting the correct position of the thumb element
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragMove : function (evt) {
            this._move(evt.src);
        },

        /**
         * Handle the mouse up or touch end during drag end by setting the correct position of the thumb element
         * @protected
         * @param {aria.DomEvent} evt
         */
        _onDragEnd : function (evt) {
            this._move(evt.src);
            this._initialDrag = null;
            if (this._oldValue[0] !== this.value[0] || this._oldValue[1] !== this.value[1]) {
                if (this._cfg.onchange) {
                    this._context.evalCallback(this._cfg.onchange);
                }
            }
        },

        /**
         * Move a source element
         * @param {Object} src Source of the drag gesture
         */
        _move : function (src) {
            var move = src.posX - this._initialDrag;

            if (src.id === this._firstDomId) {
                // We can't move further the second thumb
                var limit = this._savedX2 - this._firstWidth;
                if (this._savedX1 + move >= limit) {
                    this._savedX1 = limit;
                    // No need to update the initial drag because we are not moving
                } else {
                    this._savedX1 += move;
                    // Update the initial drag to take care of the current move
                    this._initialDrag = src.posX;
                }
            } else {
                var limit = this._savedX1 + this._firstWidth;
                if (this._savedX2 + move <= limit) {
                    this._savedX2 = limit;
                } else {
                    this._savedX2 += move;
                    this._initialDrag = src.posX;
                }
            }
            this._updateHighlight();
            this._setValue();
        },

        /**
         * Set the value of the slider in the data model given the left position of the thumbs.
         * @protected
         */
        _setValue : function () {
            var left = this._savedX1, right = this._savedX2;

            var first = Math.max(left / this._railWidth, 0);
            var second = Math.min((right - this._firstWidth) / this._railWidth, 1);

            if (this.value[0] !== first || this.value[1] !== second) {
                this.value = [first, second];
                var binding = this._binding;
                aria.utils.Json.setValue(binding.inside, binding.to, this.value);
            } else {
                // Trying to go somewhere far, don't update value, but only the display
                this._notifyDataChange();
            }
            return;
        }
    }
});

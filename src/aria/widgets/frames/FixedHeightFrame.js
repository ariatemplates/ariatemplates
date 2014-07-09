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

    var domUtils;

    /**
     * A fixed height frame is a frame whose height is defined by the skin class. The height can depend on the state.
     * The width can either be defined by the frame configuration, or left undefined so that it is adapted to the
     * content. The expansion in width is done by repeating an image horizontally.
     */
    Aria.classDefinition({
        $classpath : "aria.widgets.frames.FixedHeightFrame",
        $extends : "aria.widgets.frames.Frame",
        $dependencies : ["aria.utils.Dom"],
        $onload : function () {
            domUtils = aria.utils.Dom;
        },
        $onunload : function () {
            domUtils = null;
        },
        $constructor : function (cfg) {
            this.$Frame.constructor.call(this, cfg);
            this._mainContentIndex = 1;
            this._computeSize();
        },
        $prototype : {
            /**
             * Fill the innerWidth and innerHeight properties.
             * @protected
             */
            _computeSize : function () {
                var cfg = this._cfg, state = cfg.stateObject;
                if (cfg.width > -1) {
                    var w = cfg.width - state.marginLeft - state.marginRight;
                    if (this._hasBorder(state.skipLeftBorder, cfg.iconsLeft)) {
                        // remove the size of the left border if there is one:
                        w -= state.spcLeft;
                    }
                    if (this._hasBorder(state.skipRightBorder, cfg.iconsRight)) {
                        // remove the size of the right border if there is one:
                        w -= (state.sprWidth - state.spcLeft);
                    }
                    this.innerWidth = w > 0 ? w : 0;
                } else {
                    this.innerWidth = -1;
                }
                this.innerHeight = state.innerHeight || state.sprHeight - state.marginTop - state.marginBottom;
                /*
                this.innerHeight = state.verticalAlign && state.innerHeight ?
                        state.innerHeight :
                        state.sprHeight - state.marginTop - state.marginBottom;
                        */
            },

            /**
             * Empty method to be overriden by sub-classes to generate markup for extra elements between the beginning
             * of the border and the main content.
             * @protected
             * @param {aria.templates.MarkupWriter} out
             */
            _writeExtraMarkupBegin : function (out) {},

            /**
             * Empty method to be overriden by sub-classes to generate markup for extra elements between the main
             * content and the end of the border.
             * @protected
             * @param {aria.templates.MarkupWriter} out
             */
            _writeExtraMarkupEnd : function (out) {},

            /**
             * Generate the begining of the markup for this frame.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {

                var cfg = this._cfg, cssPrefix = this._cssPrefix;

                var sizeInfo = {
                    style : '',
                    className : 'xFrameContent ' + cssPrefix + 'c ' + cfg.cssClass
                };

                this._appendInnerWidthInfo(sizeInfo);
                // added in PTR 05170822 to avoid the internal scrollbar for widget content
                this._appendInnerHeightInfo(sizeInfo);

                out.write(['<span class="xFixedHeightFrame_w ', cssPrefix, 'w">'].join(''));
                var hasBorder = this._hasBorder(this._cfg.stateObject.skipLeftBorder, this._cfg.iconsLeft);
                out.write(['<span  ', hasBorder ? '' : 'style="display:none;"', ' class="xFixedHeightFrame_bme ',
                        cssPrefix, 'b ', cssPrefix, 'bkgA"></span>'].join(''));
                this._writeExtraMarkupBegin(out);
                out.write(['<span class="xFixedHeightFrame_bme ', cssPrefix, 'm ', cssPrefix, 'bkgB" >',
                        '<span style="', sizeInfo.style, '" class="', sizeInfo.className, '">'].join(''));
            },

            /**
             * Generate the end of the markup for this frame.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : function (out) {
                var cssPrefix = this._cssPrefix;
                out.write('</span></span>');
                this._writeExtraMarkupEnd(out);
                var hasBorder = this._hasBorder(this._cfg.stateObject.skipRightBorder, this._cfg.iconsRight);
                out.write(['<span ', hasBorder ? '' : 'style="display:none;"', ' class="xFixedHeightFrame_bme ',
                        cssPrefix, 'e ', cssPrefix, 'bkgA"></span>'].join(''));
                out.write('</span>');
            },

            /**
             * Link this frame to a DOM element after the markup has been inserted in the DOM.
             * @param {HTMLElement} domElt The DOM element which corresponds to the first item inserted by the
             * writeMarkupBegin method.
             */
            linkToDom : function (domElt) {
                this.$Frame.linkToDom.call(this, domElt);
                this._childRootElt = domUtils.getDomElementChild(domUtils.getDomElementChild(domElt, this._mainContentIndex), 0);
            },

            /**
             * Change the state of the frame. Must not be called before linkToDom has been called.
             * @param {String} stateName name of the state
             */
            changeState : function (stateName) {
                this.$Frame.changeState.call(this, stateName);
                this._computeSize();
                var cfg = this._cfg, cssPrefix = this._cssPrefix;
                var parentSpan = this._domElt;
                parentSpan.className = ['xFixedHeightFrame_w ', cssPrefix, 'w'].join("");
                var curSpan;
                curSpan = domUtils.getDomElementChild(parentSpan, 0);
                curSpan.className = ['xFixedHeightFrame_bme ', cssPrefix, 'b ', cssPrefix, 'bkgA'].join("");
                curSpan = domUtils.getDomElementChild(parentSpan, this._mainContentIndex);
                curSpan.className = ['xFixedHeightFrame_bme ', cssPrefix, 'm ', cssPrefix, 'bkgB'].join("");
                curSpan = domUtils.getDomElementChild(curSpan, 0);
                var sizeInfo = {
                    className : ['xFrameContent ', cssPrefix, 'c ', cfg.cssClass].join("")
                };
                this._appendInnerWidthInfo(sizeInfo);
                // added in PTR 05170822 to avoid the internal scrollbar for widget content
                this._appendInnerHeightInfo(sizeInfo);
                curSpan.style.width = sizeInfo.width;
                curSpan.style.height = sizeInfo.height;
                curSpan.className = sizeInfo.className;
                curSpan = domUtils.getDomElementChildReverse(parentSpan, 0);
                curSpan.className = ['xFixedHeightFrame_bme ', cssPrefix, 'e ', cssPrefix, 'bkgA'].join("");
            },

            /**
             * Resize the frame to new dimensions.
             * @param {Number} width New width, or -1 to fit the content width
             * @param {Number} height New height, or -1 to fit the content height
             */
            resize : function (width, height) {
                this.$Frame.resize.call(this, width, height);
                this.changeState(this.getStateName());
            },
            /**
             * Checks for any border in left or right.
             * @protected
             * @param {String} border
             * @param {Array} Icons
             * @return {Boolean}
             */
            _hasBorder : function (skipBorder, icons) {
                var hasBorder = (skipBorder === false);
                if (skipBorder == "dependsOnIcon") {
                    hasBorder = (icons.length === 0);
                }
                return hasBorder;
            }
        }
    });
})();

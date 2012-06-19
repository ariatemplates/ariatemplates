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
 * A simple frame is a span with a configurable border width and color.
 * @class aria.widgets.frames.SimpleFrame
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.frames.SimpleFrame',
    $extends : 'aria.widgets.frames.Frame',
    $dependencies : ['aria.utils.Dom'],
    $constructor : function (cfg) {
        this.$Frame.constructor.call(this, cfg);
        this._computeSize();
    },
    $prototype : {
        /**
         * Compute the size of the frame (fill the innerWidth and innerHeight properties).
         * @protected
         */
        _computeSize : function () {
            var cfg = this._cfg, state = cfg.stateObject;
            var border = (state.borderSize > 0) ? (state.borderSize) * 2 : 0;
            this.innerWidth = (cfg.width > -1) ? cfg.width - state.paddingLeft - state.paddingRight - border : -1;
            this.innerHeight = (cfg.height > -1) ? cfg.height - state.paddingTop - state.paddingBottom - border : -1;
        },

        /**
         * Generate the begining of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {
            var cfg = this._cfg;
            var cssPrefix = this._cssPrefix;
            var state = cfg.stateObject;
            var sizeInfo = {
                style : cfg.block ? 'display:block;' : '',
                className : "xSimpleFrame " + this._cssPrefix + "frame " + cfg.cssClass
            };
            this._appendInnerWidthInfo(sizeInfo);
            this._appendInnerHeightInfo(sizeInfo);
            out.write('<span ' + (sizeInfo.style ? 'style="' + sizeInfo.style + '"' : '') + 'class="'
                    + sizeInfo.className + '">');
        },

        /**
         * Generate the end of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : function (out) {
            out.write('</span>');
        },

        /**
         * Link this frame to a DOM element after the markup has been inserted in the DOM.
         * @param {HTMLElement} domElt The DOM element which corresponds to the first item inserted by the
         * writeMarkupBegin method.
         */
        linkToDom : function (domElt) {
            this.$Frame.linkToDom.call(this, domElt);
            this._childRootElt = domElt;
        },

        /**
         * Change the state of the frame. Must not be called before linkToDom has been called.
         * @param {String} stateName name of the state
         */
        changeState : function (stateName) {
            this.$Frame.changeState.call(this, stateName);
            this._computeSize();
            var domElt = this._domElt;
            var sizeInfo = {
                className : "xSimpleFrame " + this._cssPrefix + "frame " + this._cfg.cssClass
            };
            this._appendInnerWidthInfo(sizeInfo);
            this._appendInnerHeightInfo(sizeInfo);
            domElt.style.width = sizeInfo.width;
            domElt.style.height = sizeInfo.height;
            domElt.className = sizeInfo.className;
        },

        /**
         * Resize the frame to new dimensions.
         * @param {Number} width New width, or -1 to fit the content width
         * @param {Number} height New height, or -1 to fit the content height
         */
        resize : function (width, height) {
            this.$Frame.resize.call(this, width, height);
            this.changeState(this.getStateName());
        }
    }
});

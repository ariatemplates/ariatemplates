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
 * Frame that does nothing, for the simple HTML skinning mode
 */
Aria.classDefinition({
    $classpath : "aria.widgets.frames.SimpleHTMLFrame",
    $extends : "aria.widgets.frames.Frame",
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
            // The following line was removed (set as a comment) because the borderSize property was not passed by the
            // skinning system, and as a consequence the hard-coded default was always used.
            // var border = (state.borderSize > 0) ? (state.borderSize) * 2 : 4;
            // Does this borderSize property, which is coming from a copy paste (from SimpleFrame), and which is used
            // nowhere else (for the simple HTML frame) make sense?
            var border = 4;
            this.innerWidth = (cfg.width > -1) ? cfg.width - border : -1;
            this.innerHeight = (cfg.height > -1) ? cfg.height - border : -1;
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
         * This is a special case as there is no frame markup.
         * @return {HTMLElement} the requested DOM element inside the frame
         */
        getChild : function (idx) {
            if (idx === 0) {
                return this._childRootElt;
            } else {
                return aria.utils.Dom.getDomElementChild(this._childRootElt, idx - 1);
            }
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
                width : (this.innerWidth > -1) ? this.innerWidth + "px" : "",
                height : (this.innerHeight > -1) ? this.innerHeight + "px" : ""
            };
            domElt.style.width = sizeInfo.width;
            domElt.style.height = sizeInfo.height;
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
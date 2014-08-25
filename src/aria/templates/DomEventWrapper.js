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
var ariaTemplatesDomElementWrapper = require("./DomElementWrapper");
var ariaDomEvent = require("../DomEvent");


/**
 * Wrapper class for DOM events to be passed to templates. Templates must not have direct access to the DOM, so the
 * DomEvent object cannot be passed directly. Instead, this wrapper object extends the DomEvent object by replacing DOM
 * references by wrappers on that references for safe DOM access.
 * @class aria.templates.DomEventWrapper
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.templates.DomEventWrapper",
    $extends : ariaDomEvent,
    /**
     * Build a DomEventWrapper object.
     * @param {Object} domEvt DOM event object (passed directly)
     */
    $constructor : function (domEvt) {
        var DomWrapper = ariaTemplatesDomElementWrapper;
        this.$DomEvent.constructor.call(this, domEvt);

        /**
         * Wrapper on the HTML element on which the event happened.
         * @type aria.templates.DomElementWrapper
         */
        this.target = (this.target ? new DomWrapper(this.target) : null);

        /**
         * Wrapper on the HTML element from/to which the event is directed. (relatedTarget/fromElement/toElement)
         * @type aria.templates.DomElementWrapper
         */
        this.relatedTarget = (this.relatedTarget ? new DomWrapper(this.relatedTarget) : null);
        // bind function to original scope so that "this" is preserved
        // Not needed as $DomEvent constructor creates these functions
        // this.stopPropagation = aria.utils.Function.bind(domEvt.stopPropagation, domEvt);
        // this.preventDefault = aria.utils.Function.bind(domEvt.preventDefault, domEvt);
    },
    $destructor : function () {
        if (this.target) {
            this.target.$dispose();
            this.target = null;
        }
        if (this.relatedTarget) {
            this.relatedTarget.$dispose();
            this.relatedTarget = null;
        }
        this.$DomEvent.$destructor.call(this);
    },
    $prototype : {
        /**
         * Modify the target element of this event.
         * @param {HTMLElement} target New event target
         * @override
         */
        setTarget : function (target) {
            if (this.target) {
                this.target.$dispose();
            }
            this.target = target ? new ariaTemplatesDomElementWrapper(target) : null;
        }
    }
});

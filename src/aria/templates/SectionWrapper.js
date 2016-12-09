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
 * Wrapper around a Section Object and it's DOM Element
 * @class aria.templates.SectionWrapper
 * @extends aria.core.JsObject
 */
Aria.classDefinition({
    $classpath : 'aria.templates.SectionWrapper',
    $extends : 'aria.templates.DomElementWrapper',
    $dependencies : ['aria.utils.Dom'],
    /**
     * Create a Wrapper object to allow safe changes in the DOM without giving direct access to the DOM. Note that a
     * closure is used to prevent access to the domElt object from the template.
     * @param {HTMLElement} domElt DOM element which is wrapped
     * @param {aria.templates.Section} sectionObject Section object which is wrapped
     */
    $constructor : function (domElt, sectionObject) {
        if (domElt) {
            while (domElt.nodeType != 1) {
                domElt = domElt.parentNode;
            }
        }
        this.$DomElementWrapper.constructor.call(this, domElt, sectionObject.tplCtxt);

        /**
         * Dynamically insert an adjacent section, without refreshing any other section.
         * @param {String} where May be one of: beforeBegin, afterBegin, beforeEnd, afterEnd
         * @param {String|aria.templates.CfgBeans:SectionCfg} sectionParam A string containing the new section id, or an
         * object containing the new section configuration.
         */
        this.insertAdjacentSection = function (where, sectionParam) {
            if (where != "beforeBegin" && where != "afterBegin" && where != "beforeEnd" && where != "afterEnd") {
                this.$logError(aria.utils.Dom.INSERT_ADJACENT_INVALID_POSITION, [where]);
                return;
            }
            sectionObject.tplCtxt.insertAdjacentSections({
                position : where,
                refSection : {
                    domElt : domElt,
                    object : sectionObject
                },
                sections : [sectionParam]
            });
        };

        /**
         * Remove the section dynamically from the DOM.
         */
        this.remove = function () {
            sectionObject.$dispose();
            var parentNode = domElt.parentNode;
            aria.utils.Dom.removeElement(domElt);
            aria.utils.Dom.refreshDomElt(parentNode);
            this.$dispose();
        };

        /**
         * Set the state of the processing indicator. It updates the datamodel if the section has a processing binding
         * @param {Boolean} visible True if the loading indicator should be visible
         * @param {String} message Text message to display inside the loading indicator
         */
        this.setProcessingIndicator = function (visible, message) {
            sectionObject.setProcessingIndicator(visible, message);
        };

        var parentClassListSetClassName = this.classList.setClassName;
        this.classList.setClassName = function (className) {
            parentClassListSetClassName.call(this, className);
            sectionObject.cssClass = className;
        };

        var parentSetClassName = this.setClassName;
        this.setClassName = function (className) {
            parentSetClassName.call(this, className);
            // also update the cssClass property of the section object:
            sectionObject.cssClass = className;
        };

        var parentDispose = this._dispose;
        /**
         * Clean the variables inside the closure.
         * @private
         */
        this._dispose = function () {
            parentDispose.call(this);
            sectionObject = null;
            parentDispose = null;
            parentSetClassName = null;
        };
    },
    $prototype : {}
});

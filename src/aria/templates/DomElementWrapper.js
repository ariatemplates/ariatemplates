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
 * Wrapper for DOM elements inside templates (so that the templates do not have a direct access to the DOM).
 * @class aria.templates.DomElementWrapper
 */
Aria.classDefinition({
    $classpath : 'aria.templates.DomElementWrapper',
    $dependencies : ['aria.utils.Dom', 'aria.utils.DomOverlay', 'aria.utils.ClassList',
            'aria.utils.sandbox.DOMProperties'],
    /**
     * Create a DOM Wrapper object to allow safe changes in the DOM without giving direct access to the DOM. Note that a
     * closure is used to prevent access to the domElt object from the template.
     * @param {HTMLElement} domElt DOM element which is wrapped
     */
    $constructor : function (domElt, tplCtxt) {

        if (domElt && domElt.nodeType) {
            while (domElt.nodeType != 1) {
                domElt = domElt.parentNode;
            }
        }

        // TODO: add a check that domElt is not part of a widget

        /**
         * Tag name
         * @type {String}
         */
        var tagName = domElt.tagName;

        this.tagName = tagName;

        // all the functions are defined in the constructor to be sure that the user cannot access domElt
        // in any case. domElt only exists in this scope and cannot be accessed from outside.
        // THIS COULD BE CHANGED

        /**
         * Get a wrapper on a child element of this node. When the wrapper is not needed anymore, it must be disposed
         * with its $dispose method.
         * @param {Number} childIndex
         * @return {aria.templates.DomElementWrapper} A wrapper on the child element, if the child element exists, or null if it does not exist.
         */
        this.getChild = function (childIndex) {
            var oElm = aria.utils.Dom.getDomElementChild(domElt, childIndex);
            return (oElm) ? new aria.templates.DomElementWrapper(oElm) : null;
        };

        /**
         * Get the html attribute of the dom element
         * @param {String} attributeName Attribute name to retrieve
         * @return {String} The attribute value
         */
        this.getAttribute = function (attributeName) {

            /*
             * This white list check should be done with aria.templates.CfgBeans.HtmlAttribute, except dataset and
             * classList. But the jsonvalidator validate beans only in debug mode. Right now there is code duplication :
             * This must be solved .
             */
            if (!this.attributesWhiteList.test(attributeName)) {
                this.$logError(this.INVALID_ATTRIBUTE_NAME, [attributeName]);
                return null;
            }

            var attribute = domElt.attributes[attributeName];
            return (attribute ? attribute.value : null);
        };

        /**
         * Set the html attribute of the dom element
         * @param {String} attributeName Attribute name to be set
         * @return {String} value Value to be set
         */
        this.setAttribute = function (attributeName, value) {
            // can't change <input>'s type in IE8- (fixed in IE9)
            var blackListed = !this.attributesWhiteList.test(attributeName)
                    || (attributeName == "type" && domElt.tagName == "INPUT");
            if (blackListed) {
                this.$logError(this.ATTRIBUTE_WRITE_DENIED, [attributeName]);
            } else {
                domElt.setAttribute(attributeName, value);
            }
        },

        /**
         * Get a data value. An expando called "myExpando" can be declared in the HTML code this way: &lt;div
         * data-myExpando = "myExpandoValue"&gt;
         * @param {String} expandoName name of the expando.
         * @param {Boolean} checkAncestors if the expando is not found on the element, look on its ancestors
         */
        this.getData = function (dataName, checkAncestors) {
            if (!this.expandoNameRegex.test(dataName) || dataName.charAt(0) == '_') {
                // don't allow access to incorrect expando names
                this.$logError(this.INVALID_EXPANDO_NAME, [dataName]);
                return null;
            }
            var dataKey = 'data-' + dataName;
            var attribute = domElt.attributes[dataKey];
            if (!attribute && checkAncestors) {
                var parent = domElt.parentNode;
                while (!attribute && parent != null && parent.attributes != null) {
                    attribute = parent.attributes[dataKey];
                    parent = parent.parentNode;
                }
            }
            return (attribute ? attribute.value : null);
        };

        /**
         * Get a DomElementWrapper object referring to the closest ancestor of this element which contains the given
         * expando. If this element itself contains the expando, a new wrapper on this element is returned. If no
         * element in the hierarchy contains the expando, null is returned. An expando called "myExpando" can be
         * declared in the HTML code this way: <div data-myExpando = "myExpandoValue" >
         * @param {String} expandoName name of the expando.
         * @return {aria.templates.DomElementWrapper}
         */
        this.getParentWithData = function (dataName) {
            if (!this.expandoNameRegex.test(dataName) || dataName.charAt(0) == '_') {
                // don't allow access to incorrect expando names
                this.$logError(this.INVALID_EXPANDO_NAME, [dataName]);
                return null;
            }
            var dataKey = 'data-' + dataName;
            var element = domElt;
            var attribute = element.attributes[dataKey];
            while (!attribute && element.parentNode != null) {
                element = element.parentNode;
                if (element.attributes) {
                    attribute = element.attributes[dataKey];
                }
            }
            return (attribute ? new aria.templates.DomElementWrapper(element) : null);
        };

        /**
         * Wrapper to manage classes for DOM elements inside templates
         * @type aria.utils.ClassList
         */
        this.classList = new aria.utils.ClassList(domElt);

        /**
         * Set focus on dom element.
         */
        this.focus = function () {
            try {
                return domElt.focus();
            } catch (e) {
                this.$logDebug(this.FOCUS_FAILURE, domElt);
            }
        };

        /**
         * Set inline style for this element. Note that if you change the style of a DOM element inside a template with
         * this method, the change will probably be lost the next time the template is refreshed (if no other mechanism
         * is used to persist that change).
         * @param {String} style
         */
        this.setStyle = function (style) {
            domElt.style.cssText = style;
        };

        /**
         * Get the value of a property for this element. Note that, for security reasons, as part of template
         * sandboxing, the property name is checked with a white list of readable properties.
         * @param {String} propertyName name of the property to get
         */
        this.getProperty = function (propertyName) {
            if (aria.utils.sandbox.DOMProperties.isReadSafe(tagName, propertyName)) {
                return domElt[propertyName];
            } else {
                this.$logError(this.READ_ACCESS_DENIED, [propertyName, tagName]);
            }
        };

        /**
         * Set the value of a property for this element. Note that, for security reasons, as part of template
         * sandboxing, the property name is checked with a white list of writable properties. Note that if you change a
         * property of a DOM element inside a template with this method, the change will probably be lost the next time
         * the template is refreshed (if no other mechanism is used to persist that change).
         * @param {String} propertyName name of the property to set
         * @param {String} value value of the property to set
         */
        this.setProperty = function (propertyName, value) {
            if (aria.utils.sandbox.DOMProperties.isWriteSafe(tagName, propertyName)) {
                domElt[propertyName] = value;
            } else {
                this.$logError(this.WRITE_ACCESS_DENIED, [propertyName, tagName]);
            }
        };

        /**
         * Get parent from dom element with given name
         * @param {String} nodeName
         * @return {aria.templates.DomElementWrapper}
         */
        this.getParentWithName = function (nodeName) {
            if (!nodeName || !domElt) {
                return null;
            }
            var body = Aria.$window.document.body;
            nodeName = nodeName.toUpperCase();
            var parent = domElt.parentNode;
            while (parent && parent != body) {
                if (parent.nodeName == nodeName) {
                    return new aria.templates.DomElementWrapper(parent);
                }
                parent = parent.parentNode;
            }
            return null;
        };

        /**
         * Set the state of the processing indicator
         * @param {Boolean} visible True if the loading indicator should be visible
         * @param {String} message Text message to display inside the loading indicator
         */
        this.setProcessingIndicator = function (visible, message) {
            var overlay, doRegistration = true;
            if (visible) {
                overlay = aria.utils.DomOverlay.create(domElt, message);
            } else {
                overlay = aria.utils.DomOverlay.detachFrom(domElt, message);

                if (!overlay) {
                    // Trying to remove an overlay from an element that has no overlay attached
                    doRegistration = false;
                }
            }

            // Notify the template context
            if (tplCtxt && doRegistration) {
                tplCtxt.registerProcessingIndicator(visible, overlay);
            }
        };

        /**
         * Scroll containers to make the element visible
         * @param {Boolean} alignTop if true, try to make the element top aligned with the top of its container. If
         * false, try to align with bottom. Otherwise, just perform minimal scroll.
         */
        this.scrollIntoView = function (alignTop) {
            aria.utils.Dom.scrollIntoView(domElt, alignTop);
        };

        /**
         * Return the scroll positions of the dom element
         * @return {Object} scrollLeft and scrollTop of the dom element
         */
        this.getScroll = function () {
            return {
                scrollLeft : domElt.scrollLeft,
                scrollTop : domElt.scrollTop
            };
        };

        /**
         * Set the scroll positions of the dom element
         * @param {Object} desired scrollLeft and scrollTop
         */
        this.setScroll = function (scrollPositions) {
            if (scrollPositions) {
                if (scrollPositions.hasOwnProperty('scrollLeft') && scrollPositions.scrollLeft != null) {
                    domElt.scrollLeft = scrollPositions.scrollLeft;
                }
                if (scrollPositions.hasOwnProperty('scrollTop') && scrollPositions.scrollTop != null) {
                    domElt.scrollTop = scrollPositions.scrollTop;
                }
            }
        };

        /**
         * Clean the variables inside the closure.
         * @private
         */
        this._dispose = function () {
            this.setProcessingIndicator(false);
            domElt = null;
            tplCtxt = null;
            this.getChild = null;
            this.classList.$dispose();
            this.getData = null;
            this.getAttribute = null;
            this.getProperty = null;
            this.setProperty = null;
            this.focus = null;
            this.setStyle = null;
            this.getParentWithName = null;
            this.getParentWithData = null;
            this.setProcessingIndicator = null;
        };
    },
    $destructor : function () {
        if (this._dispose) {
            this._dispose();
            this._dispose = null;
        }
    },
    $statics : {

        attributesWhiteList : /^(data\-\w+(?:\-\w+)*|aria\-[a-z]+|name|title|style|dir|lang|abbr|height|width|size|cols|rows|rowspan|colspan|nowrap|valign|align|border|cellpadding|cellspacing|disabled|readonly|checked|selected|multiple|value|alt|maxlength|type|accesskey|tabindex|placeholder|autocomplete|autofocus|autocorrect|autocapitalize|spellcheck)$/,
        expandoNameRegex : /^\w+(?:\-\w+)*$/,

        // ERROR MESSAGE:
        INVALID_EXPANDO_NAME : "Invalid expando name: '%1'.",
        INVALID_ATTRIBUTE_NAME : "Invalid attribute name: '%1'.",
        ATTRIBUTE_WRITE_DENIED : "Write access to attribute '%1' is not allowed.",
        FOCUS_FAILURE : "Could not focus element",
        READ_ACCESS_DENIED : "Access to property %1 of tag %2 is not allowed.",
        WRITE_ACCESS_DENIED : "Write access to property %1 of tag %2 is not allowed."
    },
    $prototype : {

        // Empty functions are defined in the prototype to have JsDoc correctly generated.

        getChild : function (childIndex) {},

        getAttribute : function (attributeName) {},

        setAttribute : function (attributeName, value) {},

        getData : function (dataName, checkAncestors) {},

        getParentWithData : function (dataName) {},

        focus : function () {},

        setStyle : function (style) {},

        /**
         * Return value property of DOM node.
         * @return {String}
         */
        getValue : function () {
            return this.getProperty("value");
        },

        /**
         * Set the value property of DOM node
         * @param {String} value
         */
        setValue : function (value) {
            this.setProperty("value", value);
        },

        _dispose : function () {},
        getParentWithName : function (nodeName) {},
        setProcessingIndicator : function (visible, message) {},
        scrollIntoView : function (alignTop) {},
        getScroll : function () {},
        setScroll : function (scrollPositions) {}
    }
});

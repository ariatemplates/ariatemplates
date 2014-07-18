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
 * This class contains utilities to manipulate the DOM.
 */
Aria.classDefinition({
    $classpath : "aria.utils.Dom",
    $dependencies : ["aria.core.JsonValidator", "aria.core.Browser", "aria.utils.String", "aria.utils.css.Units"],
    $singleton : true,
    $statics : {

        VIEWPORT : "__$viewport",

        DIV_NOT_FOUND : "Missing div '%1' in DOM.",
        INSERT_ADJACENT_INVALID_POSITION : "Invalid position %1. Expected one of: beforeBegin, afterBegin, beforeEnd or afterEnd.",

        pxRegExp : /^[0-9]+px$/

    },
    $prototype : {

        /**
         * To be used instead of document.getElementById because IE6/7 do not retrieve correctly the elements in some
         * cases
         * @param {String} id the 'id' parameter of the element to find
         * @return {HTMLElement}
         */
        getElementById : function (id) {
            if (aria.core.Browser.isIE6 || aria.core.Browser.isIE7) {
                this.getElementById = function (id) {
                    var document = Aria.$window.document;
                    var el = document.getElementById(id);
                    if (el) {
                        // If id match, return element
                        if (el.getAttribute("id") == id) {
                            return el;
                        } else {
                            for (var elem in document.all) {
                                if (elem.id == id) {
                                    return elem;
                                }
                            }
                        }
                    }
                    return null;
                };
            } else {
                this.getElementById = function (id) {
                    var document = Aria.$window.document;
                    return document.getElementById(id);
                };
            }
            return this.getElementById(id);
        },

        /**
         * Get one of the elements in the DOM which follows the given DOM element.
         * @param {HTMLElement} domElt reference DOM element
         * @param {Number} count [optional, default: 1], number of the following DOM element (1 for the immediately
         * following DOM element)
         * @return {HTMLElement}
         */
        getNextSiblingElement : function (domElt, count) {
            if (count == null) {
                count = 1;
            }
            while (domElt && count > 0) {
                domElt = domElt.nextSibling;
                if (domElt && domElt.nodeType == 1) {
                    count--;
                }
            }
            return domElt;
        },

        /**
         * Get one of the elements in the DOM which precedes the given DOM element.
         * @param {HTMLElement} domElt reference DOM element
         * @param {Number} count [optional, default: 1], number of the preceding DOM element (1 for the immediately
         * preceding DOM element)
         */
        getPreviousSiblingElement : function (domElt, count) {
            if (count == null) {
                count = 1;
            }
            while (domElt && count > 0) {
                domElt = domElt.previousSibling;
                if (domElt && domElt.nodeType == 1) {
                    count--;
                }
            }
            return domElt;
        },

        /**
         * Used to retrieve a node element of type ELEMENT
         * @param {HTMLElement} parentNode
         * @param {Integer} index the expected index in the list (0=first)
         * @param {Boolean} reverse true to start from the last child with reverse order
         * @return {HTMLElement} the dom elt or null if not found
         * @public
         */
        getDomElementChild : function (parentNode, index, reverse) {
            if (!parentNode) {
                return null;
            }
            var childNodes = parentNode.childNodes, count = 0, l = childNodes.length;
            for (var i = (reverse) ? l - 1 : 0; (reverse) ? i >= 0 : i < l; (reverse) ? i-- : i++) {
                if (childNodes[i].nodeType == 1) {
                    // this is an element
                    if (count == index) {
                        return childNodes[i];
                    }
                    count++;
                }
            }
            return null;
        },
        /**
         * Used to retrieve node elements with a specifig TAG name
         * @param {HTMLElement} parentNode The HTML node which descendants should be searched
         * @param {String} tagName Name of the tag, i.e. 'label'
         * @return {HTMLElement} An array of elements with specific tag name
         */
        getDomElementsChildByTagName : function (parentNode, tagName) {
            if (!parentNode) {
                return null;
            }
            return parentNode.getElementsByTagName(tagName);
        },

        /**
         * Used to retrieve a node element of type ELEMENT, with the index counting from the last child.
         * @param {HTMLElement} parentNode
         * @param {Integer} index the expected index, counting from the last one in the list (0=last)
         * @return {HTMLElement} the dom elt or null if not found
         */
        getDomElementChildReverse : function (parentNode, index) {
            return this.getDomElementChild(parentNode, index, true);
        },

        /**
         * This method, intended to be called after changes in the DOM, makes IE understand that it must update the
         * display (which it would do only after mouse move otherwise). It does nothing on other browsers.
         * @param {HTMLElement} domElt
         */
        refreshDomElt : function (domElt) {
            if (aria.core.Browser.isIE7) {
                this.refreshDomElt = function (domElt) {
                    // Ugly fix for IE, it might fail if domElt is inside an iFrame
                    try {
                        // PTR5975877 (IE7) PTR6034278 (IE9 in IE7mode)
                        var s1 = domElt.parentNode.style, s2 = domElt.style;
                        var dummyCss = "foo:foo;"; // do not add leading ';' here!
                        s1.cssText += "";
                        s1.zoom = 1;
                        s2.cssText += dummyCss;
                        s2.cssText = s2.cssText.replace(dummyCss, "");
                        // PTR06973328 (IE7)
                        s2.zoom = 1;
                    } catch (ex) {}
                };
            } else if (aria.core.Browser.isIE8) {
                this.refreshDomElt = function (domElt) {
                    // why on earth it is necessary to write code like this is a mystery
                    // but as it stands, we abide. fixes PTR 04273172
                    // refreshing only the parentNode className is not enough, see regression 04563420
                    // when you're dealing with shit, there's no limit to the smell
                    // -----------------------------------------------------------
                    // Solution of PTR 04563420: the div overlay after a refresh can be fixed by hiding and redesplaying
                    // the body like this:
                    // document.body.style.display = 'none';
                    // document.body.style.display = 'block';
                    // But this causes a loss of focus, for example on text inputs. Another solution (which is less
                    // efficient
                    // but does not compromise the focus) is the following:
                    for (var i = 0, l = Aria.rootTemplates.length; i < l; i++) {
                        var rootTemplate = Aria.rootTemplates[i];
                        if (rootTemplate._cfg && rootTemplate._cfg.tplDiv) {
                            var tplDiv = rootTemplate._cfg.tplDiv;
                            tplDiv.className = tplDiv.className;
                            tplDiv = null;
                        }
                    }
                };
            } else {
                this.refreshDomElt = function (domElt) {};
            }

            this.refreshDomElt(domElt);
        },

        /**
         * Replace the HTML contained in an element by another piece of HTML.
         * @param {aria.templates.CfgBeans:Div} idOrElt div whose content have to be replaced
         * @param {String} newHTML html to set
         * @return {Object} Reference to the html element, or null if the element was not found in the DOM. If the
         * element was not found in the DOM, the DIV_NOT_FOUND error is also logged. Note that in IE, in tables, the
         * returned domElt can be different from the one given as a parameter.
         */
        replaceHTML : function (idOrElt, newHTML) {

            // PROFILING // var msr1 = this.$startMeasure("ReplaceHTML");
            var domElt = idOrElt;
            if (typeof(domElt) == "string") {
                domElt = this.getElementById(domElt);
            }
            if (domElt) {
                if ((aria.core.Browser.isIE7 || aria.core.Browser.isIE8) && aria.utils && aria.utils.Delegate) {
                    try {
                        var activeElement = Aria.$window.document.activeElement;
                        if (activeElement && this.isAncestor(activeElement, domElt)) {
                            // On IE 7-8, there is an issue after removing from the DOM a focused element.
                            // We detect it here so that next time there is a need to focus an element, we focus the
                            // body first (which is the work-around for IE 7-8)
                            aria.utils.Delegate.ieRemovingFocusedElement();
                        }
                    } catch (e) {
                        // on (real) IE8, an "Unspecified error" can be raised when trying to read
                        // Aria.$window.document.activeElement
                        // It happens when executing the following test: test.aria.utils.cfgframe.AriaWindowTest
                        // It does not happen with IE 11 in IE8 mode.
                    }
                }
                // PROFILING // var msr2 = this.$startMeasure("RemoveHTML");
                // TODO: check HTML for security (no script ...)
                try {
                    domElt.innerHTML = ""; // this makes IE run faster (!)
                    // PROFILING // this.$stopMeasure(msr2);
                    domElt.innerHTML = newHTML;
                } catch (ex) {
                    // PTR 04429212:
                    // IE does not support setting the innerHTML property of tbody, tfoot, thead or tr elements
                    // directly. We use a simple work-around:
                    // create a complete table, get the HTML element and insert it in the DOM
                    var newDomElt = this._createTableElement(domElt.tagName, newHTML, domElt.ownerDocument);
                    if (newDomElt) {
                        this.replaceDomElement(domElt, newDomElt);
                        this.copyAttributes(domElt, newDomElt);
                        domElt = newDomElt;
                    } else {
                        // propagate the exception
                        throw ex;
                    }
                }
                // PROFILING // var msr3 = this.$startMeasure("contentchange");
                // use the delegate manager to forward a fake event
                if (aria.utils && aria.utils.Delegate) {
                    aria.utils.Delegate.delegate(aria.DomEvent.getFakeEvent('contentchange', domElt));
                }
                // PROFILING // this.$stopMeasure(msr3);
            } else {
                this.$logError(this.DIV_NOT_FOUND, [idOrElt]);
                return null;
            }
            // PROFILING // this.$stopMeasure(msr1);
            return domElt;
        },

        /**
         * Work-around to create a table element of type containerType containing the given html in IE. As IE does not
         * support setting the innerHTML property of tbody, tfoot, thead or tr elements directly. We use a simple
         * work-around: create a complete table, and get the corresponding HTML element.
         * @param {String} containerType type of the element which will be returned, and will contain the given html
         * @param {String} html html to be put inside the element of type containerType
         * @param {Object} document document to use to create the element
         * @return {HTMLElement}
         * @private
         */
        _createTableElement : function (containerType, html, document) {
            containerType = containerType.toUpperCase();
            var div = document.createElement("DIV");
            var domElt;
            if (containerType == "TBODY" || containerType == "THEAD" || containerType == "TFOOT") {
                div.innerHTML = ["<TABLE><", containerType, ">", html, "</", containerType, "></TABLE>"].join('');
                domElt = div.children[0].children[0];
            } else if (containerType == "TR") {
                div.innerHTML = ["<TABLE><TBODY><", containerType, ">", html, "</", containerType, "></TBODY></TABLE>"].join('');
                domElt = div.children[0].children[0].children[0];
            } else {
                div.innerHTML = ["<", containerType, ">", html, "</", containerType, ">"].join('');
                domElt = div.children[0];
            }
            this.$assert(194, !domElt || (domElt.tagName.toUpperCase() == containerType)); // only to be sure
            // we got the right element
            return domElt;
        },

        /**
         * Simple utility method which replaces a dom element by another.
         * @param {HTMLElement} oldElt
         * @param {HTMLElement} newElt
         */
        replaceDomElement : function (oldElt, newElt) {
            var parentNode = oldElt.parentNode;
            parentNode.insertBefore(newElt, oldElt);
            parentNode.removeChild(oldElt);
        },

        /**
         * Insert the given HTML markup into the document at the specified location. This method is cross-browser
         * compatbile. When possible, it relies on the insertAdjacentHTML method, otherwise, it relies on ranges.
         * @param {HTMLElement} domElt Reference DOM element
         * @param {String} where maybe beforeBegin, afterBegin, beforeEnd or afterEnd
         * @param {String} html HTML markup to insert at that place
         */
        insertAdjacentHTML : function (domElt, where, html) {
            if (Aria.$window.document.body.insertAdjacentHTML) {
                this.insertAdjacentHTML = function (domElt, where, html) {
                    // PROFILING // var msr = this.$startMeasure("insertAdjacentHTML");
                    // IE, Chrome, Safari, Opera
                    // simply use insertAdjacentHTML
                    try {
                        domElt.insertAdjacentHTML(where, html);
                    } catch (ex) {
                        // insertAdjacentHTML can fail in IE with tbody, tfoot, thead or tr elements
                        // We use a simple work-around: create a complete table, get the HTML element and insert it in
                        // the DOM
                        var containerElt;
                        var newDomElt;
                        if (where == "afterBegin" || where == "beforeEnd") {
                            containerElt = domElt;
                        } else if (where == "beforeBegin" || where == "afterEnd") {
                            containerElt = domElt.parentNode;
                        } else {
                            this.$logError(this.INSERT_ADJACENT_INVALID_POSITION, [where]);
                            return;
                        }
                        newDomElt = this._createTableElement(containerElt.tagName, html, domElt.ownerDocument);
                        if (newDomElt) {
                            var previousChild = newDomElt.lastChild;
                            // now let's move the html content to the right place
                            // first put lastChild at the right place, then, move the remaining children
                            if (previousChild) {
                                this.insertAdjacentElement(domElt, where, previousChild);
                                var curChild = newDomElt.lastChild;
                                while (curChild) {
                                    containerElt.insertBefore(curChild, previousChild);
                                    previousChild = curChild;
                                    curChild = newDomElt.lastChild;
                                }
                            }
                        } else {
                            // propagate the exception
                            throw ex;
                        }
                    }
                    // PROFILING // this.$stopMeasure(msr);
                };
            } else {
                this.insertAdjacentHTML = function (domElt, where, html) {
                    // PROFILING // var msr = this.$startMeasure("insertAdjacentHTML");
                    // Firefox
                    // Note that this solution could work as well with Chrome, Safari and Opera
                    var document = domElt.ownerDocument;
                    var range = document.createRange();
                    if (where == "beforeBegin" || where == "afterEnd") {
                        range.selectNode(domElt);
                    } else {
                        range.selectNodeContents(domElt);
                    }
                    var fragment = range.createContextualFragment(html);
                    this.insertAdjacentElement(domElt, where, fragment);
                    range.detach();
                    // PROFILING // this.$stopMeasure(msr);
                };
            }

            this.insertAdjacentHTML(domElt, where, html);
        },

        /**
         * Insert the given HTML element into the document at the specified location. This method is cross-browser
         * compatbile. When possible, it relies on the insertAdjacentElement method, otherwise, it relies on
         * insertBefore and appendChild.
         * @param {HTMLElement} domElt Reference DOM element
         * @param {String} where maybe beforeBegin, afterBegin, beforeEnd or afterEnd
         * @param {String} html HTML markup to insert at that place
         */
        insertAdjacentElement : function (domElt, where, newElement) {
            if (Aria.$window.document.body.insertAdjacentElement) {
                this.insertAdjacentElement = function (domElt, where, newElement) {
                    domElt.insertAdjacentElement(where, newElement);
                };
            } else {
                // Firefox :'(
                this.insertAdjacentElement = function (domElt, where, newElement) {
                    if (where == "beforeBegin") {
                        domElt.parentNode.insertBefore(newElement, domElt);
                    } else if (where == "afterBegin") {
                        domElt.insertBefore(newElement, domElt.firstChild);
                    } else if (where == "beforeEnd") {
                        domElt.appendChild(newElement);
                    } else if (where == "afterEnd") {
                        domElt.parentNode.insertBefore(newElement, domElt.nextSibling);
                    } else {
                        this.$logError(this.INSERT_ADJACENT_INVALID_POSITION, [where]);
                    }
                };
            }

            this.insertAdjacentElement(domElt, where, newElement);
        },

        /**
         * Copy attributes from one dom element to another.
         * @param {HTMLElement} src Source element
         * @param {HTMLElement} dest Destination element
         */
        copyAttributes : function (src, dest) {
            // IE has a mergeAttributes method which does exactly that. Let's use it directly.
            // Note that copying attributes with a loop on attributes and setAttributes has strange results on IE7 (for
            // example, a TR can appear as disabled)
            if (Aria.$window.document.body.mergeAttributes) {
                this.copyAttributes = function (src, dest) {
                    dest.mergeAttributes(src, false);
                };
            } else {
                this.copyAttributes = function (src, dest) {
                    // on other browsers, let's copy the attributes manually:
                    var srcAttr = src.attributes;
                    for (var i = 0, l = srcAttr.length; i < l; i++) {
                        var attr = srcAttr[i];
                        dest.setAttribute(attr.name, attr.value);
                    }
                };
            }

            this.copyAttributes(src, dest);
        },

        /**
         * Gets the dimensions of the viewport. Extracted from Closure's documentation.
         *
         * <pre>
         * *
         * Gecko standards mode:
         * docEl.clientWidth  Width of viewport excluding scrollbar.
         * win.innerWidth     Width of viewport including scrollbar.
         * body.clientWidth   Width of body element.
         *
         * docEl.clientHeight Height of viewport excluding scrollbar.
         * win.innerHeight    Height of viewport including scrollbar.
         * body.clientHeight  Height of document.
         *
         * Gecko Backwards compatible mode:
         * docEl.clientWidth  Width of viewport excluding scrollbar.
         * win.innerWidth     Width of viewport including scrollbar.
         * body.clientWidth   Width of viewport excluding scrollbar.
         *
         * docEl.clientHeight Height of document.
         * win.innerHeight    Height of viewport including scrollbar.
         * body.clientHeight  Height of viewport excluding scrollbar.
         *
         * IE6/7 Standards mode:
         * docEl.clientWidth  Width of viewport excluding scrollbar.
         * win.innerWidth     Undefined.
         * body.clientWidth   Width of body element.
         *
         * docEl.clientHeight Height of viewport excluding scrollbar.
         * win.innerHeight    Undefined.
         * body.clientHeight  Height of document element.
         *
         * IE5 + IE6/7 Backwards compatible mode:
         * docEl.clientWidth  0.
         * win.innerWidth     Undefined.
         * body.clientWidth   Width of viewport excluding scrollbar.
         *
         * docEl.clientHeight 0.
         * win.innerHeight    Undefined.
         * body.clientHeight  Height of viewport excluding scrollbar.
         *
         * Opera 9 Standards and backwards compatible mode:
         * docEl.clientWidth  Width of viewport excluding scrollbar.
         * win.innerWidth     Width of viewport including scrollbar.
         * body.clientWidth   Width of viewport excluding scrollbar.
         *
         * docEl.clientHeight Height of document.
         * win.innerHeight    Height of viewport including scrollbar.
         * body.clientHeight  Height of viewport excluding scrollbar.
         *
         * WebKit:
         * Safari 2
         * docEl.clientHeight Same as scrollHeight.
         * docEl.clientWidth  Same as innerWidth.
         * win.innerWidth     Width of viewport excluding scrollbar.
         * win.innerHeight    Height of the viewport including scrollbar.
         * frame.innerHeight  Height of the viewport exluding scrollbar.
         *
         * Safari 3 (tested in 522)
         *
         * docEl.clientWidth  Width of viewport excluding scrollbar.
         * docEl.clientHeight Height of viewport excluding scrollbar in strict mode.
         * body.clientHeight  Height of viewport excluding scrollbar in quirks mode.
         * </pre>
         *
         * @return {aria.utils.DomBeans:Size} Size object width 'width' and 'height' properties
         * @private
         */
        _getViewportSize : function () {
            var document = Aria.$window.document;
            var docEl = document.documentElement;
            var size = {
                'width' : docEl.clientWidth,
                'height' : docEl.clientHeight
            };
            return size;
        },

        /**
         * @return {aria.utils.DomBeans:Size} Size object width 'width' and 'height' properties
         */
        getViewportSize : function () {
            return this._getViewportSize();
        },

        /**
         * Gets the document scroll distance as a coordinate object.
         * @parameter {Object} base If provided, the total scrolling offset of the base element is calculated, minus the
         * scrolling offset of the document element
         * @return {Object} Object with values 'scrollLeft' and 'scrollTop'.
         * @protected
         */
        _getDocumentScroll : function (base) {
            var document = base && base.ownerDocument ? base.ownerDocument : Aria.$window.document;
            var scrollLeft = 0;
            var scrollTop = 0;
            var documentScroll = this.getDocumentScrollElement(document);

            if (base != null) {
                var next = base;
                while (next != null) {
                    if (next.scrollLeft) {
                        scrollLeft += next.scrollLeft;
                    }
                    if (next.scrollTop) {
                        scrollTop += next.scrollTop;
                    }
                    next = next.parentNode;
                }
                // now subtract scroll offset of the document
                scrollLeft -= documentScroll.scrollLeft;
                scrollTop -= documentScroll.scrollTop;

            } else {
                scrollLeft = documentScroll.scrollLeft;
                scrollTop = documentScroll.scrollTop;
            }

            // this will be used to insert elements in the body, so body scrolls needs to be taken in consideration also
            if (documentScroll != document.body) {
                scrollLeft += document.body.scrollLeft;
                scrollTop += document.body.scrollTop;
            }

            var scroll = {
                'scrollLeft' : scrollLeft,
                'scrollTop' : scrollTop
            };
            return scroll;
        },

        /**
         * Get the full size of the page. It is bigger than the viewport size if there are scrollbars, otherwise it's
         * the viewport size
         * @return {aria.utils.DomBeans:Size} Size object
         */
        getFullPageSize : function () {
            // https://developer.mozilla.org/en/DOM/window.scrollMaxY suggests not to use scrollMaxY
            // Take the maximum between the document and the viewport srollWidth/Height
            // PTR 04677501 AT-Release1.0-36 release bug fixing: Safari has the correct scrollWidth and scrollHeight in
            // document.body
            var doc = this.getDocumentScrollElement();

            var docSize = {
                width : doc.scrollWidth,
                height : doc.scrollHeight
            };

            var vieportSize = this._getViewportSize();

            return {
                width : Math.max(docSize.width, vieportSize.width),
                height : Math.max(docSize.height, vieportSize.height)
            };
        },

        /**
         * Get the absolute position in a page of an element
         * @param {HTMLElement} element
         * @param {Boolean} stopAbsolute <i>[optional, default=false]</i> if true, it will stop calculating the
         * position when it encounters the first ancestor of the element with absolute positioning
         * @return {aria.utils.DomBeans:Position}
         */
        calculatePosition : function (element, stopAbsolute) {
            if (!element) {
                return;
            }

            var document = element.ownerDocument;
            // shortcut to Browser
            var browser = aria.core.Browser;

            var offsetLeft = 0;
            var offsetTop = 0;
            var scrollTop = 0;
            var scrollLeft = 0;

            var scrollNotIncluded = true;

            // Get offset information
            var i = 0;
            /* Get the dom in case of JS object */
            var obj = element, objPositionCss;

            if (obj.getBoundingClientRect && !stopAbsolute) {
                // IE getBoundingClientRect have extra pixels.
                var shift = (browser.isIE6 || browser.isIE7) ? 2 : 0;
                // IE throws an error if the element is not in DOM
                try {
                    var rect = obj.getBoundingClientRect();
                    scrollNotIncluded = false;
                    offsetLeft = rect.left - shift;
                    offsetTop = rect.top - shift;

                } catch (er) {
                    offsetLeft = 0;
                    offsetTop = 0;
                }
            } else {
                while (obj && obj.parentNode) {
                    objPositionCss = aria.utils.Dom.getStyle(obj, "position");

                    if (stopAbsolute && i > 0 && objPositionCss == "absolute") {
                        break;
                    }
                    offsetLeft += obj.offsetLeft;
                    offsetTop += obj.offsetTop;

                    obj = obj.offsetParent;
                    i++;
                }
            }

            // Get scroll information
            i = 0;
            obj = element;

            while (obj && obj.parentNode && obj.parentNode != document.body && obj.parentNode.tagName) {

                if (!browser.isOpera && obj.nodeName != 'HTML') {
                    if (obj.scrollTop !== 0 && obj.scrollTop) {
                        scrollTop = obj.scrollTop;
                        if (scrollNotIncluded) {
                            offsetTop -= obj.scrollTop;
                        }
                    } else if (obj.scrollLeft !== 0 && obj.scrollLeft) {
                        scrollLeft = obj.scrollLeft;
                        if (scrollNotIncluded) {
                            offsetLeft -= obj.scrollLeft;
                        }
                    }
                } else if (browser.isOpera) {
                    if (obj.scrollTop !== 0 && obj.scrollTop != obj.offsetTop) {
                        if (scrollNotIncluded) {
                            offsetTop -= obj.scrollTop;
                        }
                        scrollTop = obj.scrollTop;
                    } else if (obj.scrollLeft !== 0 && obj.scrollLeft != obj.offsetLeft) {
                        scrollLeft = obj.scrollLeft;
                        if (scrollNotIncluded) {
                            offsetLeft -= obj.scrollLeft;
                        }
                    }
                }

                // scrollOffset calculation did not take care of the stopAbsolute
                objPositionCss = aria.utils.Dom.getStyle(obj, "position");
                if (i > 0 && objPositionCss == "absolute") {
                    break;
                }

                i++;
                obj = obj.parentNode;
            }

            var position = {
                top : Math.round(offsetTop),
                left : Math.round(offsetLeft),
                scrollTop : scrollTop,
                scrollLeft : scrollLeft
            };

            return position;
        },

        /**
         * Get the client geometry of an element. It means the coordinates of the top/left corner and the width and
         * height of the area inside the element which can be used by its child elements.
         * @param {HTMLElement} element Element whose client geometry is requested.
         * @return {aria.utils.DomBeans:Geometry} Geometry object
         */
        getClientGeometry : function (element) {
            var position = this.calculatePosition(element);
            return {
                x : position.left + element.clientLeft,
                y : position.top + element.clientTop,
                width : element.clientWidth,
                height : element.clientHeight
            };
        },

        /**
         * Get the offset top and left of an element, based either on the style or the offset element. Useful to manage
         * some internet explorer offset issues.
         * @param {HTMLElement} element Element whose offset is requested.
         * @return {Object} JSON with the top ad left properties.
         * @public
         */
        getOffset : function (element) {
            var style = element.currentStyle || element.style;
            var isAbsolute = style.position == "absolute";
            var pxRegExp = this.pxRegExp;

            var offsetTop = element.offsetTop;
            var offsetLeft = element.offsetLeft;
            var offset = {
                top : (isAbsolute && pxRegExp.test(style.top)) ? parseInt(style.top, 10) : offsetTop,
                left : (isAbsolute && pxRegExp.test(style.left)) ? parseInt(style.left, 10) : offsetLeft
            };

            if (isNaN(offset.top)) {
                offset.top = offsetTop;
            }

            if (isNaN(offset.left)) {
                offset.left = offsetLeft;
            }

            return offset;

        },

        /**
         * Get the geometry of an element. It means the coordinates of top/left corner and its width and height. If the
         * element is the body, the geometry corresponds to the whole page, otherwise it's the visible part of the
         * element.
         * @param {HTMLElement} element Element whose geometry is requested.
         * @return {aria.utils.DomBeans:Geometry} Geometry object
         * @public
         */
        getGeometry : function (element) {
            if (!element) {
                return null;
            }
            var document = element.ownerDocument;

            if (element === document.body) {
                var size = this.getFullPageSize();

                return {
                    x : 0,
                    y : 0,
                    width : size.width,
                    height : size.height
                };

            } else {
                var width, height;
                var browser = aria.core.Browser;
                if (browser.isChrome || browser.isSafari) {
                    var rectTextObject = element.getBoundingClientRect();
                    width = Math.round(rectTextObject.width);
                    height = Math.round(rectTextObject.height);
                } else {
                    width = element.offsetWidth;
                    height = element.offsetHeight;
                }

                var position = this.calculatePosition(element);
                var res = {
                    x : position.left,
                    y : position.top,
                    width : width,
                    height : height
                };

                // PTR 04606169:
                // adapt res if one of the parent overflow property prevents parts of the item from being visible
                var parent = element;
                // we do not need to go up to html or body element (and it can lead to wrong results
                // especially in IE7)
                var documentElement = document.documentElement;
                var body = document.body;
                do {
                    var parentPosition = this.getStyle(parent, "position");
                    if (parentPosition == "absolute" || parentPosition == "fixed") {
                        parent = parent.offsetParent;
                    } else {
                        parent = parent.parentNode;
                    }
                    if (!parent || parent == documentElement || parent == body) {
                        return res;
                    }

                    // taking client geometry of the parent so that it does not include scrollbars
                    var parentGeometry = this.getClientGeometry(parent);
                    var parentOverflowX = this.getStyle(parent, "overflowX");
                    var parentOverflowY = this.getStyle(parent, "overflowY");

                    var delta;
                    if (parentOverflowX != "visible") {
                        delta = parentGeometry.x - res.x;
                        if (delta > 0) {
                            res.x += delta;
                            res.width -= delta;
                            if (res.width < 0) {
                                return null; // item is not visible
                            }
                        }
                        delta = res.x + res.width - parentGeometry.x - parentGeometry.width;
                        if (delta > 0) {
                            res.width -= delta;
                            if (res.width < 0) {
                                return null; // item is not visible
                            }
                        }
                    }
                    if (parentOverflowY != "visible") {
                        delta = parentGeometry.y - res.y;
                        if (delta > 0) {
                            res.y += delta;
                            res.height -= delta;
                            if (res.height < 0) {
                                return null; // item is not visible
                            }
                        }
                        delta = res.y + res.height - parentGeometry.y - parentGeometry.height;
                        if (delta > 0) {
                            res.height -= delta;
                            if (res.height < 0) {
                                return null; // item is not visible
                            }
                        }
                    }
                } while (true);
            }
        },

        /**
         * Retrieve the computed style for a given CSS property on a given DOM element.
         * @param {HTMLElement} element The DOM element on which to retrieve a CSS property
         * @param {String} property The CSS property to retrieve
         */
        getStyle : function (element, property) {
            var browser = aria.core.Browser;
            var isIE8orLess = browser.isIE8 || browser.isIE7 || browser.isIE6;
            if (isIE8orLess) {
                this.getStyle = function (element, property) {
                    if (property == 'opacity') {// IE<=8 opacity uses filter
                        var val = 100;
                        try { // will error if no DXImageTransform
                            val = element.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                        } catch (e) {
                            try { // make sure its in the document
                                val = element.filters('alpha').opacity;
                            } catch (er) {}
                        }
                        return (val / 100).toString(10); // to be consistent with getComputedStyle
                    } else if (property == 'width' || property == 'height') {
                        return aria.utils.css.Units.getDomWidthOrHeightForOldIE(element, property);
                    } else if (property == 'float') { // fix reserved word
                        property = 'styleFloat'; // fall through
                    }
                    var value;
                    // test currentStyle before touching
                    if (element.currentStyle) {
                        value = element.currentStyle[property];
                        if (!value) {
                            // Try the camel case
                            var camel = aria.utils.String.dashedToCamel(property);
                            value = element.currentStyle[camel];
                        }
                    }
                    return (value || element.style[property]);
                };
            } else {
                this.getStyle = function (element, property) {
                    var window = Aria.$window;
                    var value = null;
                    if (property == "float") {
                        property = "cssFloat";
                    } else if (property == "backgroundPositionX" || property == "backgroundPositionY") {
                        // backgroundPositionX and backgroundPositionY are not standard
                        var backgroundPosition = this.getStyle(element, "backgroundPosition");
                        if (backgroundPosition) {
                            var match = /^([-.0-9a-z%]+)\s([-.0-9a-z%]+)($|,)/.exec(backgroundPosition);
                            if (match) {
                                value = ((property == "backgroundPositionX") ? match[1] : match[2]);
                            }
                        }
                        return value;
                    }
                    var computed = window.getComputedStyle(element, "");
                    if (computed) {
                        value = computed[property];
                    }
                    return (value || element.style[property]);
                };
            }

            return this.getStyle(element, property);
        },

        /**
         * Center the given size in the viewport.
         * @param {aria.utils.DomBeans:Size} size size of the element to center in the viewport
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {aria.utils.DomBeans:Position} position of the element when centered in the viewport
         */
        centerInViewport : function (size, base) {
            var viewportSize = this._getViewportSize();
            var documentScroll = this._getDocumentScroll(base);
            return {
                left : parseInt(documentScroll.scrollLeft + (viewportSize.width - size.width) / 2, 10),
                top : parseInt(documentScroll.scrollTop + (viewportSize.height - size.height) / 2, 10)
            };
        },

        /**
         * Check if a given position + size couple can fit in the current viewport
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {Boolean} True if the given position+size couple can fit in the current viewport
         */
        isInViewport : function (position, size, base) {
            var viewportSize = this._getViewportSize();
            var documentScroll = this._getDocumentScroll(base);

            if (position.top < documentScroll.scrollTop || position.left < documentScroll.scrollLeft
                    || position.top + size.height > documentScroll.scrollTop + viewportSize.height
                    || position.left + size.width > documentScroll.scrollLeft + viewportSize.width) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * Compares two geometries to ascertain whether an element is inside another one
         * @param {aria.utils.DomBeans:Geometry} needle
         * @param {aria.utils.DomBeans:Geometry|aria.utils.Dom:VIEWPORT:property} haystack
         * @return {Boolean}
         */
        isInside : function (needle, haystack) {
            needle.width = needle.width || 0;
            needle.height = needle.height || 0;
            if (haystack == this.VIEWPORT) {
                return this.isInViewport({
                    left : needle.x,
                    top : needle.y
                }, {
                    width : needle.width,
                    height : needle.height
                });
            }
            haystack.width = haystack.width || 0;
            haystack.height = haystack.height || 0;
            if (needle.x < haystack.x || needle.y < haystack.y || needle.x + needle.width > haystack.x + haystack.width
                    || needle.y + needle.height > haystack.y + haystack.height) {
                return false;
            }
            return true;
        },

        /**
         * Given a position + size couple, return a corrected position that should fit in the viewport. If the size is
         * bigger than the vieport it returns a position such that the top left corner of the element to be fit is in
         * the viewport.
         * @param {aria.utils.DomBeans:Position} position
         * @param {aria.utils.DomBeans:Size} size
         * @param {Object} base The base element used to account for scrolling offsets
         * @return {aria.utils.DomBeans:Position}
         */
        fitInViewport : function (position, size, base) {
            var viewportSize = this._getViewportSize();
            var documentScroll = this._getDocumentScroll(base);

            var minTopValue = documentScroll.scrollTop;
            var maxTopValue = Math.max(0, documentScroll.scrollTop + viewportSize.height - size.height);
            var top = aria.utils.Math.normalize(position.top, minTopValue, maxTopValue);

            var minLeftValue = documentScroll.scrollLeft;
            var maxLeftValue = Math.max(0, documentScroll.scrollLeft + viewportSize.width - size.width);
            var left = aria.utils.Math.normalize(position.left, minLeftValue, maxLeftValue);

            return {
                'top' : top,
                'left' : left
            };
        },

        /**
         * Fits a geometry into another geometry
         * @param {aria.utils.DomBeans:Geometry} geometry
         * @param {aria.utils.DomBeans:Geometry|aria.utils.Dom:VIEWPORT:property} container
         * @return {aria.utils.DomBeans:Position} top and left values of the fitted geometry
         */
        fitInside : function (geometry, container) {
            geometry.width = geometry.width || 0;
            geometry.height = geometry.height || 0;
            if (container == this.VIEWPORT) {
                return this.fitInViewport({
                    left : geometry.x,
                    top : geometry.y
                }, {
                    width : geometry.width,
                    height : geometry.height
                });
            }
            container.width = container.width || 0;
            container.height = container.height || 0;
            var left = (geometry.x < container.x) ? container.x : geometry.x;
            var top = (geometry.y < container.y) ? container.y : geometry.y;
            if (geometry.x + geometry.width > container.x + container.width) {
                left = container.x + container.width - geometry.width;
            }
            if (geometry.y + geometry.height > container.y + container.height) {
                top = container.y + container.height - geometry.height;
            }
            return {
                'top' : top,
                'left' : left
            };

        },

        /**
         * Check whether a child element is a child element of a particular parentNode
         * @param {HTMLElement} child The child DOM element to check
         * @param {HTMLElement} parent The parent DOM element to check
         * @return {Boolean} True if the given child is a child of the given parent
         */
        isAncestor : function (child, parent) {
            if (!(child && child.ownerDocument)) {
                return false;
            }
            var document = child.ownerDocument;
            var body = document.body;
            var element = child;
            while (element && element != body) {
                if (element == parent) {
                    return true;
                }
                element = element.parentNode;
            }
            return (element == parent); // can be true if parent == body and element is present in DOM
        },

        /**
         * Check whether an HTML element is in the DOM (a descendant of document.body).
         * @param {HTMLElement} element The HTML element to check
         * @return {Boolean} true if the HTML element is in the DOM hierarchy
         */
        isInDom : function (element) {
            return element ? this.isAncestor(element, element.ownerDocument.body) : false;
        },

        /**
         * Removes an element from the DOM
         * @param {HTMLElement} element
         */
        removeElement : function (element) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        },

        /**
         * Change scrollbar positions to ensure that an item is visible.
         * @param {HTMLElement} element element which is to be made visible
         * @param {Boolean} alignTop if true align top of the element with top of container. if false, align bottom. If
         * not specified, does "minimal job".
         */
        scrollIntoView : function (element, alignTop) {
            var document = element.ownerDocument;
            var origin = element, originRect = origin.getBoundingClientRect();
            var hasScroll = false;
            var documentScroll = this.getDocumentScrollElement(document);

            while (element) {

                if (element == document.body) {
                    element = documentScroll;
                } else {
                    element = element.parentNode;
                }

                if (element) {
                    var hasScrollbar = (!element.clientHeight) ? false : element.scrollHeight > element.clientHeight;
                    if (!hasScrollbar) {
                        if (element == documentScroll) {
                            element = null;
                        }
                        continue;
                    }

                    var rects;
                    if (element == documentScroll) {
                        rects = {
                            left : 0,
                            top : 0
                        };
                    } else {
                        rects = element.getBoundingClientRect();
                    }

                    // check that elementRect is in rects
                    var deltaLeft = originRect.left - (rects.left + (parseInt(element.style.borderLeftWidth, 10) | 0));
                    var deltaRight = originRect.right
                            - (rects.left + element.clientWidth + (parseInt(element.style.borderLeftWidth, 10) | 0));
                    var deltaTop = originRect.top - (rects.top + (parseInt(element.style.borderTopWidth, 10) | 0));
                    var deltaBottom = originRect.bottom
                            - (rects.top + element.clientHeight + (parseInt(element.style.borderTopWidth, 10) | 0));

                    // adjust display depending on deltas
                    if (deltaLeft < 0) {
                        element.scrollLeft += deltaLeft;
                    } else if (deltaRight > 0) {
                        element.scrollLeft += deltaRight;
                    }

                    if (alignTop === true && !hasScroll) {
                        element.scrollTop += deltaTop;
                    } else if (alignTop === false && !hasScroll) {
                        element.scrollTop += deltaBottom;
                    } else {
                        if (deltaTop < 0) {
                            element.scrollTop += deltaTop;
                        } else if (deltaBottom > 0) {
                            element.scrollTop += deltaBottom;
                        }
                    }

                    if (element == documentScroll) {
                        element = null;
                    } else {
                        // readjust element position after scrolls, and check if vertical scroll has changed.
                        // this is required to perform only one alignment
                        var nextRect = origin.getBoundingClientRect();
                        if (nextRect.top != originRect.top) {
                            hasScroll = true;
                        }
                        originRect = nextRect;
                    }
                }
            }
        },

        /**
         * Get the the document scroll element (hidden element used to measure things).
         * @param {Object} document document to use (optional, defaults to Aria.$window.document)
         * @return {HTMLElement} documentElement
         */
        getDocumentScrollElement : function (document) {
            if (document == null) {
                document = Aria.$window.document;
            }
            return ((!(aria.core.Browser.isSafari || aria.core.Browser.isChrome) && (document.compatMode == "CSS1Compat"))
                    ? document.documentElement
                    : document.body);
        },

        /**
         * Set the opacity of an element
         * @param {HTMLElement} element
         * @param {Number} opacity must be between 0 and 1
         */
        setOpacity : function (element, opacity) {
            var browser = aria.core.Browser;
            var isIE8OrLess = (browser.isIE8 || browser.isIE7 || browser.isIE6);
            this.setOpacity = isIE8OrLess ? this._setOpacityLegacyIE : this._setOpacityW3C;
            this.setOpacity(element, opacity);
        },

        /**
         * Set the opacity of an element on IE<=8
         * @private
         * @param {HTMLElement} element
         * @param {Number} opacity must be between 0 and 1
         */
        _setOpacityLegacyIE : function (element, opacity) {
            element.style.cssText += ";filter:alpha(opacity=" + (opacity * 100) + ");";
        },

        /**
         * Set the opacity of an element on modern browsers (IE9+ and non-IE)
         * @private
         * @param {HTMLElement} element
         * @param {Number} opacity must be between 0 and 1
         */
        _setOpacityW3C : function (element, opacity) {
            element.style.opacity = opacity;
        },

        /**
         * Refreshes scrollbars for the specified DOM element and all its parents.
         * @see refreshScrollbars
         * @param {HTMLElement} domElt
         */
        _refreshScrollbarsFix : function (domElt) {
            // work-around for http://crbug.com/240772
            var values = [];
            var parent = domElt;
            while (parent && parent.style) {
                values.push(parent.style.cssText);
                parent.style.overflow = "hidden";
                parent = parent.parentNode;
            }
            domElt.getBoundingClientRect(); // making sure Chrome updates the display
            parent = domElt;
            while (parent && parent.style) {
                parent.style.cssText = values.shift();
                parent = parent.parentNode;
            }
        },

        /**
         * Checks whether <a href="http://crbug.com/240772">this Chrome scrollbars bug</a> (also appearing on other
         * webkit-based browsers) is still there.
         * @see refreshScrollbars
         * @return {Boolean} true if Webkit is used and the bug is still there. false otherwise.
         */
        _checkRefreshScrollbarsNeeded : function () {
            if (!aria.core.Browser.isWebkit) {
                // we only do this check on Webkit
                return false;
            }
            var document = Aria.$window.document;
            var testElt = document.createElement("div");
            testElt.style.cssText = "overflow:auto;width:100px;height:100px;left:-1000px;top:-1000px;";
            testElt.innerHTML = '<div style="width:150px;height:100px;"></div>';
            document.body.appendChild(testElt);
            // firstCheck below is always true, computing it is necessary so that Chrome knows a scrollbar is
            // needed at this stage
            var firstCheck = testElt.scrollWidth > testElt.clientWidth;
            testElt.firstChild.style.width = "100px";
            var secondCheck = testElt.scrollWidth > testElt.clientWidth; // should be false, but is true on Chrome
            document.body.removeChild(testElt);
            return firstCheck && secondCheck;
        },

        /**
         * Refreshes scrollbars for the specified DOM element and all its parents. It is needed for some webkit-based
         * browsers as a work-around for <a href="http://crbug.com/240772">this bug</a>, otherwise scrollbars are not
         * removed when they are no longer necessary if the content has nearly the same size as the container.<br>
         * This method does nothing on other browsers. On Webkit, the first time it is called, it checks whether the
         * work-around is still needed and does nothing if the bug was fixed.
         * @param {HTMLElement} element
         */
        refreshScrollbars : function (domElt) {
            this.refreshScrollbars = this._checkRefreshScrollbarsNeeded() ? this._refreshScrollbarsFix : Aria.empty;
            this.refreshScrollbars(domElt);
        },

        /**
         * Proxy/polly fill method for getElementsByClassName.
         * On browser which don't support this feature the behaviour is emulated,
         * otherwise the native version is called.
         * @param {HTMLElement} dom The source dom element
         * @param {String} className The class name to look for
         * @return {Array} Array of Html elements
         */
        getElementsByClassName : function (domElement, className) {
            if(!domElement || !className) {
                return [];
            }
            if (domElement.getElementsByClassName) {
                return domElement.getElementsByClassName(className);
            } else {
                var elements = domElement.getElementsByTagName("*");
                var found = [];
                var regexp = new RegExp("\\b" + className + "\\b");
                for (var i = 0, ii = elements.length; i < ii; i++) {
                    var el = elements[i];
                    if (regexp.test(el.className)) {
                        found.push(el);
                    }
                }
                return found;
            }
        }
    }
});

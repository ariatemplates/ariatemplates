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
var Aria = require("../../Aria");


(function () {

    var __properties = {
        "abbr" : {
            "TD" : "rw",
            "TH" : "rw"
        },
        "accept" : {
            "INPUT" : "rw"
        },
        "acceptCharset" : {
            "FORM" : "rw"
        },
        "accessKey" : "rw",
        "action" : {
            "FORM" : "rw"
        },
        "align" : {
            "IFRAME" : "rw",
            "IMG" : "rw"
        },
        "alt" : {
            "AREA" : "rw",
            "IMG" : "rw"
        },
        "axis" : {
            "TD" : "rw",
            "TH" : "rw"
        },
        "baseURI" : "r-",
        "border" : {
            "IMG" : "rw"
        },
        "cellIndex" : {
            "TD" : "r-",
            "TH" : "r-"
        },
        "cellPadding" : {
            "TABLE" : "rw"
        },
        "cellSpacing" : {
            "TABLE" : "rw"
        },
        "ch" : {
            "TD" : "rw",
            "TH" : "rw",
            "TR" : "rw"
        },
        "charset" : {
            "A" : "rw"
        },
        "checked" : {
            "INPUT" : "rw"
        },
        "chOff" : {
            "TD" : "rw",
            "TH" : "rw",
            "TR" : "rw"
        },
        "className" : "rw",
        "clientHeight" : "r-",
        "clientWidth" : "r-",
        "cols" : {
            "TEXTAREA" : "rw"
        },
        "colSpan" : {
            "TD" : "rw",
            "TH" : "rw"
        },
        "complete" : {
            "IMG" : "r-"
        },
        "coords" : {
            "AREA" : "rw"
        },
        "defaultChecked" : {
            "INPUT" : "rw"
        },
        "defaultSelected" : {
            "OPTION" : "rw"
        },
        "defaultValue" : {
            "INPUT" : "rw",
            "TEXTAREA" : "rw"
        },
        "dir" : "rw",
        "disabled" : {
            "BUTTON" : "rw",
            "INPUT" : "rw",
            "OPTION" : "rw",
            "SELECT" : "rw",
            "TEXTAREA" : "rw"
        },
        "enctype" : {
            "FORM" : "rw"
        },
        "frame" : {
            "TABLE" : "rw"
        },
        "frameBorder" : {
            "IFRAME" : "rw"
        },
        "hash" : {
            "AREA" : "rw"
        },
        "headers" : {
            "TD" : "rw",
            "TH" : "rw"
        },
        "height" : {
            "IFRAME" : "rw",
            "IMG" : "rw"
        },
        "host" : {
            "AREA" : "rw"
        },
        "hostname" : {
            "AREA" : "rw"
        },
        "href" : {
            "A" : "rw",
            "AREA" : "rw"
        },
        "hreflang" : {
            "A" : "rw"
        },
        "hspace" : {
            "IMG" : "rw"
        },
        "id" : "r-",
        "index" : {
            "OPTION" : "rw"
        },
        "innerHTML" : "r-",
        "lang" : "rw",
        "length" : {
            "FORM" : "r-",
            "SELECT" : "r-"
        },
        "localName" : "r-",
        "longDesc" : {
            "IFRAME" : "rw",
            "IMG" : "rw"
        },
        "lowsrc" : {
            "IMG" : "rw"
        },
        "marginHeight" : {
            "IFRAME" : "rw"
        },
        "marginWidth" : {
            "IFRAME" : "rw"
        },
        "maxLength" : {
            "INPUT" : "rw"
        },
        "method" : {
            "FORM" : "rw"
        },
        "multiple" : {
            "SELECT" : "rw"
        },
        "name" : {
            "A" : "rw",
            "BUTTON" : "rw",
            "FORM" : "rw",
            "IFRAME" : "rw",
            "IMG" : "rw",
            "INPUT" : "rw",
            "SELECT" : "rw",
            "TEXTAREA" : "rw"
        },
        "namespaceURI" : "r-",
        "naturalWidth" : {
            "IMG" : "r-"
        },
        "naturalHeight" : {
            "IMG" : "r-"
        },
        "nodeName" : "r-",
        "nodeType" : "r-",
        "nodeValue" : "r-",
        "noHref" : {
            "AREA" : "rw"
        },
        "noResize" : {
            "IFRAME" : "rw"
        },
        "offsetHeight" : "r-",
        "offsetLeft" : "r-",
        "offsetTop" : "r-",
        "offsetWidth" : "r-",
        "pathname" : {
            "AREA" : "rw"
        },
        "port" : {
            "AREA" : "rw"
        },
        "prefix" : "r-",
        "protocol" : {
            "AREA" : "rw"
        },
        "readOnly" : {
            "INPUT" : "rw",
            "TEXTAREA" : "rw"
        },
        "rel" : {
            "A" : "rw"
        },
        "rev" : {
            "A" : "rw"
        },
        "rowIndex" : {
            "TR" : "r-"
        },
        "rows" : {
            "TEXTAREA" : "rw"
        },
        "rowSpan" : {
            "TD" : "rw",
            "TH" : "rw"
        },
        "rules" : {
            "TABLE" : "rw"
        },
        "schemaTypeInfo" : "r-",
        "scrollHeight" : "r-",
        "scrolling" : {
            "IFRAME" : "rw"
        },
        "scrollLeft" : "rw",
        "scrollTop" : "rw",
        "scrollWidth" : "r-",
        "search" : {
            "AREA" : "rw"
        },
        "sectionRowIndex" : {
            "TR" : "r-"
        },
        "selected" : {
            "OPTION" : "rw"
        },
        "selectedIndex" : {
            "SELECT" : "rw"
        },
        "shape" : {
            "AREA" : "rw"
        },
        "size" : {
            "INPUT" : "rw",
            "SELECT" : "rw"
        },
        "src" : {
            "IFRAME" : "rw",
            "IMG" : "rw"
        },
        "style" : "r-",
        "summary" : {
            "TABLE" : "rw"
        },
        "tabIndex" : "rw",
        "tagName" : "r-",
        "target" : {
            "A" : "rw",
            "AREA" : "rw",
            "FORM" : "rw"
        },
        "text" : {
            "OPTION" : "rw"
        },
        "textContent" : "r-",
        "title" : "rw",
        "type" : {
            "A" : "rw",
            "BUTTON" : "rw",
            "INPUT" : "r-",
            "SELECT" : "r-",
            "TEXTAREA" : "r-"
        },
        "useMap" : {
            "IMG" : "rw"
        },
        "vAlign" : {
            "TD" : "rw",
            "TH" : "rw",
            "TR" : "rw"
        },
        "value" : {
            "BUTTON" : "rw",
            "INPUT" : "rw",
            "OPTION" : "rw",
            "SELECT" : "rw",
            "TEXTAREA" : "rw"
        },
        "vspace" : {
            "IMG" : "rw"
        },
        "width" : {
            "IFRAME" : "rw",
            "IMG" : "rw"
        }
    };

    /**
     * Stores access control information for DOM properties.
     */
    module.exports = Aria.classDefinition({
        $classpath : 'aria.utils.sandbox.DOMProperties',
        $singleton : true,
        $prototype : {
            /**
             * Gives information about what access should be granted for a given property of a DOM element of a given
             * type.
             * @param {String} tagName tag name (this is case insensitive, for example "a" and "A" are equivalent)
             * @param {String} propertyName property name (this is case sensitive)
             * @return {String} "--" for no access, "r-" for read-only access, "rw" for read-write access
             */
            getPropertyAccess : function (tagName, propertyName) {
                if (!__properties.hasOwnProperty(propertyName)) {
                    return "--";
                }
                var property = __properties[propertyName];
                if (typeof property == "object") {
                    tagName = tagName.toUpperCase();
                    if (!property.hasOwnProperty(tagName)) {
                        return "--";
                    }
                    property = property[tagName];
                }
                return property;
            },

            /**
             * Return true if a read access is safe for the given property for a DOM element of the given type.
             * @param {String} tagName tag name (this is case insensitive, for example "a" and "A" are equivalent)
             * @param {String} propertyName property name (this is case sensitive)
             * @return {Boolean} true if a read access to that element is safe, false otherwise.
             */
            isReadSafe : function (tagName, propertyName) {
                return this.getPropertyAccess(tagName, propertyName).charAt(0) == "r";
            },

            /**
             * Return true if a write access is safe for the given property for a DOM element of the given type.
             * @param {String} tagName tag name (this is case insensitive, for example "a" and "A" are equivalent)
             * @param {String} propertyName property name (this is case sensitive)
             * @return {Boolean} true if a write access to that element is safe, false otherwise.
             */
            isWriteSafe : function (tagName, propertyName) {
                return this.getPropertyAccess(tagName, propertyName).charAt(1) == "w";
            }
        }
    });
})();

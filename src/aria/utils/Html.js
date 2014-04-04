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
 * This class contains utilities to manipulate Html elements.
 */
Aria.classDefinition({
    $classpath : "aria.utils.Html",
    $extends : "aria.core.JsObject",
    $dependencies : ["aria.templates.DomElementWrapper", "aria.utils.String", "aria.utils.Json"],
    $singleton : true,
    $statics : {
        datasetRegex : /^\w+$/, /* This is to mainly to forbid dashes. Actually uppercase chars are not allowed by the spec, but they're transparently lowercased by the browser */
        INVALID_CONFIGURATION : "Invalid attribute %1.",
        INVALID_DATASET_KEY : "Invalid dataset key %1. Dataset keys can contain only [a-zA-Z0-9_]"
    },
    $prototype : {
        /**
         * Build the HTML markup regarding the attributes provided.
         * @param {aria.templates.CfgBeans:HtmlAttribute} attributes Attributes to be parsed
         * @return {String} String which can be used directly in a html tag
         */
        buildAttributeList : function (attributes) {
            var result = [], whiteList = aria.templates.DomElementWrapper.attributesWhiteList;
            var jsonUtils = aria.utils.Json;

            /*
             * This assumes that white list is performed by config validation, but this is only available in debug mode :
             * FIXME!
             */
            var stringUtil = aria.utils.String;
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key) && !jsonUtils.isMetadata(key)) {
                    var attribute = attributes[key];
                    if (key === "classList") {
                        result.push(" class=\"");
                        result.push(stringUtil.encodeForQuotedHTMLAttribute(attribute.join(" ")));
                        result.push("\"");
                    } else if (key === "dataset") {
                        for (var dataKey in attribute) {
                            if (attribute.hasOwnProperty(dataKey) && !jsonUtils.isMetadata(dataKey)) {
                                if (this.datasetRegex.test(dataKey)) {
                                    /* BACKWARD-COMPATIBILITY-BEGIN (GH-499): hyphenate it in the new version */
                                    // result.push(" data-", stringUtil.camelToDashed(dataKey), "=\"");
                                    result.push(" data-", dataKey, "=\"");
                                    /* BACKWARD-COMPATIBILITY-END */
                                    result.push(stringUtil.encodeForQuotedHTMLAttribute(attribute[dataKey]));
                                    result.push("\"");
                                } else {
                                    /* BACKWARD-COMPATIBILITY-BEGIN (GH-499): change to $logError and don't output */
                                    this.$logWarn(this.INVALID_DATASET_KEY, dataKey);
                                    result.push(" data-", dataKey, "=\"");
                                    result.push(stringUtil.encodeForQuotedHTMLAttribute(attribute[dataKey]));
                                    result.push("\"");
                                    /* BACKWARD-COMPATIBILITY-END */
                                }
                            }
                        }
                    } else if (whiteList.test(key)) {
                        attribute = (attribute != null) ? attribute + "" : "";
                        result.push(" ", key, "=\"");
                        result.push(stringUtil.encodeForQuotedHTMLAttribute(attribute));
                        result.push("\"");
                    } else {
                        this.$logError(this.INVALID_CONFIGURATION, key);
                    }
                }
            }
            return result.join('');
        },

        /**
         * Turn an HTML form element into a string that contains the list of name-value pairs of all relevant elements
         * of the form. For example, the following form
         *
         * <pre>
         * &lt;form id=&quot;myForm&quot;&gt;
         *     &lt;input type=&quot;text&quot; name=&quot;firstname&quot; value=&quot;Colin&quot;&gt;
         *     &lt;input type=&quot;text&quot; name=&quot;lastname&quot; value=&quot;Pitt&quot; disabled&gt;
         *     &lt;input type=&quot;date&quot; name=&quot;birth&quot; value=&quot;2012-04-04&quot;
         *     &lt;input type=&quot;text&quot;&gt;
         *     &lt;input type=&quot;file&quot; name=&quot;picture&quot; /&gt;
         *     &lt;input type=&quot;submit&quot; name=&quot;submit&quot;/&gt;
         *     &lt;input type=&quot;checkbox&quot; name=&quot;vehicle&quot; value=&quot;Bike&quot; checked /&gt;
         * &lt;/form&gt;
         * </pre>
         *
         * yields
         *
         * <pre>
         * firstname
         * =Colin&amp;birth=2012-04-04&amp;vehicle=Bike
         * </pre>
         *
         * This method can be useful when you want to send the form information as data of an ajax call
         * @param {HTMLElement} form
         * @return {String}
         */
        serializeForm : function (form) {
            var elements = form.elements, params = [], element, name, value;
            for (var i = 0, len = elements.length; i < len; i++) {
                element = elements[i];
                if (this._isSerializable(element)) {
                    name = encodeURIComponent(element.name);
                    value = encodeURIComponent(element.value.replace(/\r?\n/g, "\r\n"));
                    params.push(name + "=" + value);
                }
            }
            return params.join("&").replace(/%20/g, "+");
        },

        /**
         * Return true if the HTML element is serializable in a form. Serializable elements are input, select, textarea,
         * keygen, which have a name attribute, a certain type, and are not disabled
         * @param {HTMLElement} element
         * @return {Boolean}
         */
        _isSerializable : function (element) {
            var submittable = /^(?:input|select|textarea|keygen)/i;
            var submitterTypes = /^(?:submit|button|image|reset|file)$/i;
            var type = element.type;
            var checkableTypes = /^(?:checkbox|radio)$/i;

            return element.name && !element.disabled && submittable.test(element.nodeName)
                    && !submitterTypes.test(type) && (element.checked || !checkableTypes.test(type));
        },

        /**
         * Set "data-" attributes
         * @param {HTMLElement} domElement
         * @param {Object} dataset
         */
        setDataset : function (domElement, dataset) {
            this.__setOrRemoveDataset(domElement, dataset);
        },

        /**
         * Remove "data-" attributes
         * @param {HTMLElement} domElement
         * @param {Object} dataset
         */
        removeDataset : function (domElement, dataset) {
            this.__setOrRemoveDataset(domElement, dataset, true);
        },

        /**
         * Set or remove "data-" attributes
         * @param {HTMLElement} domElement
         * @param {Object} dataset
         * @param {Boolean} remove if false or undefined, attributes will be set instead
         */
        __setOrRemoveDataset : function (domElement, dataset, remove) {
            var fullKey, stringUtil = aria.utils.String;
            for (var dataKey in dataset) {
                if (dataset.hasOwnProperty(dataKey) && !aria.utils.Json.isMetadata(dataKey)) {
                    if (this.datasetRegex.test(dataKey)) {
                        fullKey = "data-" + stringUtil.camelToDashed(dataKey);
                        /* BACKWARD-COMPATIBILITY-BEGIN (GH-499) */
                        fullKey = "data-" + dataKey;
                        /* BACKWARD-COMPATIBILITY-END (GH-499) */
                        if (remove) {
                            domElement.removeAttribute(fullKey);
                        } else {
                            domElement.setAttribute(fullKey, dataset[dataKey]);
                        }
                    } else {
                        /* BACKWARD-COMPATIBILITY-BEGIN (GH-499): change to $logError and don't remove */
                        this.$logWarn(this.INVALID_DATASET_KEY, dataKey);
                        fullKey = "data-" + dataKey;
                        if (remove) {
                            domElement.removeAttribute(fullKey);
                        } else {
                            domElement.setAttribute(fullKey, dataset[dataKey]);
                        }
                        /* BACKWARD-COMPATIBILITY-END (GH-499) */
                    }
                }
            }
        }
    }
});

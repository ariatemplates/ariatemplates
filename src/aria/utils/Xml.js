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


/**
 * @class aria.utils.Xml Utilities for manipulating xml content
 * @extends aria.core.JsObject
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Xml',
    $singleton : true,
    $prototype : {

        /**
         * Performs a lossy conversion of a Xml string to a Json object Node atrributes are omitted in the parsing
         * process
         * @param {String} str The content of the Xml document
         * @return {Object} Json represantation of the Xml content
         */
        convertXmlToJson : function (str) {
            var xmlDoc;
            var DOMParser = Aria.$global.DOMParser;
            if (DOMParser) {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(str, "text/xml");
            } else { // Internet Explorer
                var ActiveXObject = Aria.$global.ActiveXObject;
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(str);
            }

            if (xmlDoc.hasChildNodes()) {
                return this.__parseXmlNode(xmlDoc);
            } else {
                return null;
            }
        },

        /**
         * Performs a lossy conversion of a Xml node object to a Json object. Node atrributes are omitted in the parsing
         * process
         * @param {XmlNode} xmlNode Xml node to be converted
         * @return {Object} Json object representing the xml node
         */
        convertXmlNodeToJson : function (xmlNode) {
            return this.__parseXmlNode(xmlNode);
        },

        /**
         * Internal method used for parsing the nodes of a xml document
         * @param {XmlNode} xmlNode Xml node to be parsed
         * @return {Object} Json object representing a xml node
         */
        __parseXmlNode : function (xmlNode) {
            if (!xmlNode) {
                return;
            }
            var node = {};
            for (var i = 0; i < xmlNode.childNodes.length; i++) {
                var currNode = xmlNode.childNodes[i];

                // if it's a text node or a CDATA section use the nodeValue directly
                if (currNode.nodeType != 3 && currNode.nodeType != 4) {
                    var name = currNode.nodeName;
                    var count = 0;
                    for (var j = 0; j < xmlNode.childNodes.length; j++) {
                        if (xmlNode.childNodes[j].nodeName == name) {
                            if (++count == 2) {
                                break;
                            }
                        }
                    }
                    var el = this.__parseXmlNode(currNode);
                    if (count == 2) {
                        if (node[name] == null) {
                            node[name] = [];
                        }
                        node[name].push(el);
                    } else {
                        node[name] = el;
                    }

                } else if (xmlNode.childNodes.length == 1) {
                    node = currNode.nodeValue;
                }
            }
            return node;
        }
    }
});

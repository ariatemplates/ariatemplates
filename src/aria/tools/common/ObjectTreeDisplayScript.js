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
 * Script associated with template dedicated to object display in tree
 */
Aria.tplScriptDefinition({
    $classpath : "aria.tools.common.ObjectTreeDisplayScript",
    $prototype : {

        /**
         * Override template $dataReady
         */
        $dataReady : function () {
            if (this.data.showDepth) {
                this._showDepth(this.data.content, this.data.showDepth, 0);
            }
        },

        /**
         * @protected
         * @param {Object} element
         * @param {Number} depth
         */
        _showDepth : function (element, maxDepth, depth) {
            if (element && depth < maxDepth) {
                element["view:ariaDebug:showOpen" + depth] = true;
                for (var key in element) {
                    if (element.hasOwnProperty(key)) {
                        this._showDepth(element[key], maxDepth, depth + 1);
                    }
                }
            }
        },

        /**
         * Function called when user clicks on a node.
         * @param {aria.DomEvent} event
         * @param {Object} element subpart of json corresponding to this node
         */
        nodeClick : function (event, args) {
            var element = args.element;
            var depth = args.depth;
            var metaDataName = "view:ariaDebug:showOpen" + depth;
            if (element[metaDataName]) {
                element[metaDataName] = false;
            } else {
                element[metaDataName] = true;
            }
            this.$refresh();
        },

        /**
         * Filters parameters of an object depending on their types
         * @param {Object} element
         * @return {Object}
         */
        filterTypes : function (element) {

            var types = {
                meta : {
                    arrays : [],
                    objects : [],
                    strings : [],
                    numbers : [],
                    instances : [],
                    booleans : [],
                    others : []
                },
                data : {
                    arrays : [],
                    objects : [],
                    strings : [],
                    numbers : [],
                    instances : [],
                    booleans : [],
                    others : []
                }
            }, typeUtils = aria.utils.Type;

            for (var key in element) {
                if (element.hasOwnProperty(key) && !this.$json.isMetadata(key) && key.indexOf("view:ariaDebug:showOpen") !== 0) {
                    var subElement = element[key], target;

                    // filter meta / non meta

                    if (key.indexOf(":") == -1) {
                        target = types.data;
                    } else {
                        target = types.meta;
                    }

                    if (typeUtils.isArray(subElement)) {
                        target = target.arrays;
                    } else if (typeUtils.isObject(subElement)) {
                        target = target.objects;
                    } else if (typeUtils.isString(subElement)) {
                        target = target.strings;
                    } else if (typeUtils.isNumber(subElement)) {
                        target = target.numbers;
                    } else if (typeUtils.isBoolean(subElement)) {
                        target = target.booleans;
                    } else if (subElement && subElement.$classpath) {
                        target = target.instances;
                    } else {
                        target = target.others;
                    }

                    target.push(key);
                }
            }
            return types;
        }
    }
});
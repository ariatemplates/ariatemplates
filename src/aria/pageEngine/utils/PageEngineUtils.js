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
 * Generic utilities needed across different classes in the page engine
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.PageEngineUtils",
    $singleton : true,
    $dependencies : ["aria.utils.Array", "aria.utils.Path"],
    $prototype : {

        /**
         * Add an item inside a container only if it is not already there
         * @param {MultiTypes} item
         * @param {Array} container
         */
        addIfMissing : function (item, container) {
            if (item && !aria.utils.Array.contains(container, item)) {
                container.push(item);
            }
        },

        /**
         * Add all the entries of the array toAdd into the array container only if container does not already have them
         * @param {Array} container
         * @param {Array} toAdd
         */
        wiseConcat : function (container, toAdd) {
            var entry;
            for (var i = 0, len = toAdd.length; i < len; i++) {
                entry = toAdd[i];
                this.addIfMissing(entry, container);
            }
        },

        /**
         * Extract a certain property from all the elements of the container array
         * @param {Array} container
         * @param {String} property
         * @return {Array}
         */
        extractPropertyFromArrayElements : function (container, property) {
            var output = [], entry;
            for (var i = 0, len = container.length; i < len; i++) {
                entry = container[i];
                if (entry[property]) {
                    output.push(entry[property]);
                }
            }
            return output;
        },

        /**
         * Go through all the values of an object and adds the corresponding value inside its entries using the provided
         * keyName
         * @param {Object} container
         * @param {String} keyName
         */
        addKeyAsProperty : function (container, keyName) {
            for (var element in container) {
                if (container.hasOwnProperty(element)) {
                    container[element][keyName] = element;
                }
            }
        },

        /**
         * @param {String|Array} path If a string, will parse it. If Array, specifies the suite of parameters to follow.
         * @param {Object} inside container
         * @return {Object} undefined if the path does not exist
         */
        resolvePath : function (path, inside) {
            var output;
            try {
                output = aria.utils.Path.resolve(path, inside);
            } catch (ex) {
                output = undefined;
            }
            return output;
        },

        /**
         * Log multiple errors to the default logger
         * @param {String} msg The global error message
         * @param {Array} errors List of all errors in this batch
         * @param {Object} scope Scope of the $logError method
         */
        logMultipleErrors : function (msg, errors, scope) {
            scope.$logError.apply(scope, [msg + ":"]);
            for (var i = 0, len = errors.length; i < len; i++) {
                scope.$logError.apply(scope, [(i + 1) + " - " + errors[i].msgId, errors[i].msgArgs]);
            }
        }

    }
});

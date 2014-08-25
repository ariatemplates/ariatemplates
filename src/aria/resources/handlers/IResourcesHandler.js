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


/**
 * Generic interface for Resources Handlers. Resources Handlers are normally used by AutoComplete controllers.
 */
module.exports = Aria.interfaceDefinition({
    $classpath : "aria.resources.handlers.IResourcesHandler",
    $interface : {

        /**
         * Call the callback with an array of suggestions in its arguments.
         * @param {String} textEntry Search string
         * @param {aria.core.CfgBeans:Callback} callback Called when suggestions are ready
         */
        getSuggestions : {
            $type : "Function"
        },

        /**
         * Returns the classpath of the default template for this resourceHandler. This method is used only by
         * aria.widgets.controllers.AutoCompleteController
         * @return {String}
         */
        getDefaultTemplate : {
            $type : "Function"
        },

        /**
         * Provide a label for given suggestion
         * @param {Object} suggestion
         * @return {String}
         */
        suggestionToLabel : {
            $type : "Function"
        },

        /**
         * Call the callback with all possible suggestions.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        getAllSuggestions : {
            $type : "Function"
        }
    }
});

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
 * Placeholder widget
 * @class aria.embed.Placeholder
 * @extends aria.widgetLibs.BaseWidget
 */
Aria.classDefinition({
    $classpath : "aria.embed.PlaceholderManager",
    $dependencies : ['aria.utils.Type'],
    $singleton : true,
    $constructor : function (cfg, context, lineNumber) {},
    $statics : {
        _providers : [],

        // ERROR MESSAGES:
        PLACEHOLDER_PATH_NOT_FOUND : "No content has been found for the placeholder path '%1'"
   },
    $prototype : {
        /**
         * Return an array of contents, each item is an html string or an html template configuration
         * @param {String} placeholderPath The placeholder path
         * @return {Array}
         */
        getContent : function (placeholderPath) {
            var contents = [];
            var typeUtils = aria.utils.Type;

            var providers = this._providers;
            for (var i = 0, ii = providers.length; i < ii; i++) {
                var provider = providers[i];
                var content = provider.getContent(placeholderPath);
                if (content) {
                    if (typeUtils.isArray(content)) {
                        for (var j = 0, jj = content.length; j < jj; j++) {
                            contents.push(content[j]);
                        }
                    } else {
                        contents.push(content);
                    }
                }
            }

            // Warn if no content has been found
            if (contents.length == 0) {
	            this.$logWarn(this.PLACEHOLDER_PATH_NOT_FOUND, [placeholderPath]);
            }

            return contents;
        },

        /**
         * Register a class as a content provider,
         * if the provider is already registered, it is not added twice.
         * @param {Class} provider Any class implementing aria.embed.IContentProvider
         */
        register : function (provider) {
            // Prevent from adding the same provider twice
            var providers = this._providers;
            for (var i = 0, ii = providers.length; i < ii; i++) {
                if (providers[i] === provider) {
                    return; // / already registered, nothing to do
                }
            }

            providers.push(provider);
        },

        /**
         * Unregister a procider
         * @param {Class} provider Any class implementing aria.embed.IContentProvider
         */
        unregister : function (provider) {
            var providers = this._providers;
            for (var i = 0, ii = providers.length; i < ii; i++) {
                if (providers[i] === provider) {
                    providers.splice(i, i);
                }
            }
        }

    }
});
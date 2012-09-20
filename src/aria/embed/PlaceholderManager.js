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
 * Placeholder Manager used by the Placeholder widget
 */
Aria.classDefinition({
    $classpath : "aria.embed.PlaceholderManager",
    $dependencies : ["aria.utils.Type", "aria.utils.Array"],
    $singleton : true,
    $constructor : function () {

        /**
         * Listener to contentChange events raised by content providers
         * @type {aria.core.CfgBeans.Callback}
         * @private
         */
        this._contentChangeListener = {
            fn : this._onContentChange,
            scope : this
        };

        /**
         * List of content providers. Each of them implements the interface aria.embed.IContentProvider
         * @type {Array}
         * @private
         */
        this._providers = [];
    },
    $destructor : function () {
        this.unregisterAll();
        this._contentChangeListener = null;
    },
    $events : {
        "contentChange" : {
            description : "Raised when a content provider notifies a change of content.",
            properties : {
                placeholderPaths : "{Array} contains the placeholderPaths whose corresponding content has changed."
            }
        }
    },
    $statics : {
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

            if (contents.length === 0) {
                this.$logWarn(this.PLACEHOLDER_PATH_NOT_FOUND, [placeholderPath]);
            }

            return contents;
        },

        /**
         * Register an object as a content provider, if the provider is already registered, it is not added twice.
         * @param {Object} provider Any class implementing aria.embed.IContentProvider
         */
        register : function (provider) {
            var providers = this._providers;
            if (!aria.utils.Array.contains(providers, provider)) {
                provider.$addListeners({
                    "contentChange" : this._contentChangeListener
                });
                providers.push(provider);
            }
        },

        /**
         * Unregister a provider
         * @param {Object} provider Any object implementing aria.embed.IContentProvider
         */
        unregister : function (provider) {
            var providers = this._providers;
            if (aria.utils.Array.remove(providers, provider)) {
                provider.$removeListeners({
                    "contentChange" : this._contentChangeListener
                });
            }
        },

        /**
         * Unregister all providers by removing the listeners for content changes
         */
        unregisterAll : function () {
            var providers = this._providers;
            while (providers.length > 0) {
                this.unregister(providers[0]);
            }
        },

        /**
         * Method that is called after a content change is notified from one of the providers
         * @param {Array} placeholderPaths placeholderPaths whose corresponding content has changed
         * @private
         */
        _onContentChange : function (event) {
            this.$raiseEvent({
                name : "contentChange",
                placeholderPaths : event.contentPaths
            });
        }

    }
});
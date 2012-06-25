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
 * Default interface for a content provider
 * @class aria.embed.IContentProvider
 */
Aria.interfaceDefinition({
    $classpath : 'aria.embed.IContentProvider',
    $interface : {
        /**
         * Called by the placeholder manager to get the content configuration, which will be used by the placehoder to
         * build its content
         * @param {String} contentClasspath The content classpath which will be used to retrieve the configuration
         * @return {String|json|Array} the content configuration
         */
        getContent : function (placeholderPath) {}
    }
});

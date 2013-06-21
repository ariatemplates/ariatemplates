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
 * Default interface for an embed controller
 */
Aria.interfaceDefinition({
    $classpath : "aria.embed.IEmbedController",
    $interface : {
        /**
         * Called when the widget is being displayed
         * @param {HTMLElement} domContainer Container of this embed based widget
         * @param {Object} args arguments given in the embed Element widget
         */
        onEmbeddedElementCreate : function (domContainer, arg) {},
        /**
         * Called when the widget is being disposed
         * @param {HTMLElement} domContainer Container of this embed based widget
         * @param {Object} args arguments given in the embed Element widget
         */
        onEmbeddedElementDispose : function (domContainer, arg) {}
    }
});

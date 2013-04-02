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

Aria.classDefinition({
    $classpath : "test.aria.modules.test.CustomImplementation",
    $extends : "aria.core.JsObject",
    $implements : ["aria.modules.urlService.IUrlService"],
    $prototype : {
        /**
         * Generate an action URL.
         * @param {moduleName} Name of the module that is making the request
         * @param {actionName} Action to be called on the server
         * @param {sessionId} Value of the session id
         * @return String Full URL
         */
        createActionUrl : function (moduleName, actionName, sessionId) {
            return "Custom";
        },

        /**
         * Generate a service URL.
         * @param {String} moduleName Name of the module that is making the request
         * @param {Object} serviceSpec Specification for target service
         * @param {Number} sessionId Value of the session id
         * @return {aria.modules.RequestBeans.RequestDetails|String} URL details
         */
        createServiceUrl : function (moduleName, serviceSpec, sessionId) {
            return "Custom";
        },

        /**
         * Generate an i18n URL.
         * @param {moduleName} Name of the module that is making the request
         * @param {sessionId} Value of the session id
         * @return String Full URL
         */
        createI18nUrl : function (moduleName, sessionId) {
            return "Custom";
        }
    }
});

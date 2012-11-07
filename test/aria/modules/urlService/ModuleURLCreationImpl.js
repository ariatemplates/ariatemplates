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
    $classpath : 'test.aria.modules.urlService.ModuleURLCreationImpl',
    $implements : ['aria.modules.urlService.IUrlService'],
    $constructor : function (actionUrlPattern, i18nUrlPattern) {
        this.actionUrlPattern = actionUrlPattern || "";
        this.i18nUrlPattern = i18nUrlPattern || "";
    },
    $prototype : {
        /**
         * Generate an action URL. The pattern recognized are
         *
         * <pre>
         *  ${moduleName}, ${actionName} and ${sessionId}
         * </pre>
         *
         * @param {String} Name of the module that is making the request. ${moduleName}
         * @param {String} Action to be called on the server. ${actionName}
         * @param {String} Value of the session id. ${sessionId}
         * @return {String} Full URL
         */
        createActionUrl : function (moduleName, actionName, sessionId) {
            var url = this.actionUrlPattern;
            url = url.replace(/\$\{moduleName\}/g, moduleName || "");
            // Additional parameter is passed specific for this module
            // url = url.concat("&myCustMod=true");
            url = url.replace(/\$\{actionName\}/g, actionName || "");
            url = url.replace(/\$\{sessionId\}/g, sessionId || "");
            return url;
        },

        /**
         * Generate a 'service' URL This implementation understands a serviceSpec in the form {actionName: string}
         * @param {String} moduleName Name of the module that is making the request
         * @param {Object} serviceSpec Specification for target service
         * @param {Number} sessionId Value of the session id
         * @return {String} full URL
         */
        createServiceUrl : function (moduleName, serviceSpec, sessionId) {
            if (!serviceSpec || !serviceSpec.actionName) {
                return this.createActionUrl(moduleName, null, sessionId);
            }
            return this.createActionUrl(moduleName, serviceSpec.actionName, sessionId);
        },

        /**
         * Generate an i18n URL. The pattern recognized are
         *
         * <pre>
         *  ${moduleName}, ${sessionId} amd ${locale}
         * </pre>
         *
         * @param {String} Name of the module that is making the request. ${moduleName}
         * @param {String} Value of the session id. ${sessionId}
         * @param {String} Locale for i18n, if not present defaults to currentLocale. ${locale}
         * @return {String} Full URL
         */
        createI18nUrl : function (moduleName, sessionId, locale) {
            var url = this.i18nUrlPattern;
            url = url.replace(/\$\{moduleName\}/g, moduleName || "");
            // Additional parameter is passed specific for this module resources
            url = url.concat("&myCustRes=true");
            url = url.replace(/\$\{sessionId\}/g, sessionId || "");
            url = url.replace(/\$\{locale\}/g, locale || "");
            return url;
        }
    }
});

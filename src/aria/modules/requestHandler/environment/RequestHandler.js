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
 * Public API for retrieving, applying application variables.
 * @class aria.modules.requestHandler.environment.RequestHandler
 * @extends aria.core.environment.EnvironmentBase
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.modules.requestHandler.environment.RequestHandler",
    $dependencies : ["aria.modules.requestHandler.environment.RequestHandlerCfgBeans"],
    $singleton : true,
    $extends : "aria.core.environment.EnvironmentBase",
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.modules.requestHandler.environment.RequestHandlerCfgBeans.AppCfg",

        /**
         * Get the urlService classpath configuration. It is a copy of the current configuration and not a reference to
         * the object itself.
         * @public
         * @return {aria.modules.requestHandler.environment.RequestHandlerCfgBeans:AppCfg} The classpath configuration
         */
        getRequestHandlerCfg : function () {
            return aria.utils.Json.copy(this.checkApplicationSettings("requestHandler"));
        },

        /**
         * Get the requestJsonSerializer configuration. It is the current configuration
         * @public
         * @return {aria.modules.requestHandler.environment.RequestHandlerCfgBeans:RequestJsonSerializerCfg} The JSON
         * serializer configuration
         */
        getRequestJsonSerializerCfg : function () {
            return this.checkApplicationSettings("requestJsonSerializer");
        }
    }
});

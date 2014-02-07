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
    $classpath : "aria.templates.environment.ImgUrlMapping",
    $dependencies : ["aria.templates.environment.ImgUrlMappingCfgBeans"],
    $extends : "aria.core.environment.EnvironmentBase",
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.templates.environment.ImgUrlMappingCfgBeans.AppCfg",

        /**
         * Get the imgUrlMapping classpath configuration. It is a copy of the current configuration and not a reference to
         * the object itself.
         * @public
         * @return {aria.core.environment.environment.EnvironmentBaseCfgBeans:AppCfg} The classpath configuration
         */
        getImgUrlMappingCfg : function () {
            return aria.utils.Json.copy(this.checkApplicationSettings("imgUrlMapping"));
        }
    }
});

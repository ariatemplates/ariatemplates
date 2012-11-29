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
 * Contains getters for the WidgetLibs environment.
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.widgetLibs.environment.WidgetLibsSettings",
    $extends : "aria.core.environment.EnvironmentBase",
    $dependencies : ["aria.widgetLibs.environment.WidgetLibsSettingsCfgBeans"],
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.widgetLibs.environment.WidgetLibsSettingsCfgBeans.AppCfg",

        /**
         * Return default widget libraries.
         * @public
         * @return {aria.widgetLibs.environment.WidgetLibsSettingsCfgBeans.AppCfg.defaultWidgetLibs}
         */
        getWidgetLibs : function () {
            var res = this.checkApplicationSettings("defaultWidgetLibs");

            /* BACKWARD-COMPATIBILITY-BEGIN */
            var ariaLib = this.checkApplicationSettings("defaultWidgetLib");
            if (ariaLib) {
                // make a copy before changing the value:
                res = aria.utils.Json.copy(res, false);
                res.aria = ariaLib;
            }
            /* BACKWARD-COMPATIBILITY-END */

            return res;
        }
    }
});

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
 * Contains getters for the Number environment.
 * @class aria.utils.environment.WidgetSettings
 * @extends aria.core.environment.EnvironmentBase
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.widgets.environment.WidgetSettings",
    $extends : "aria.core.environment.EnvironmentBase",
    $dependencies : ["aria.widgets.environment.WidgetSettingsCfgBeans"],
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.widgets.environment.WidgetSettingsCfgBeans.AppCfg",

        /**
         * Returns the widget settings
         * @public
         * @return {aria.widgets.environment.WidgetSettingsCfgBeans.AppCfg.WidgetSettingsCfg}
         */
        getWidgetSettings : function () {
            return this.checkApplicationSettings("widgetSettings");
        }

    }
});

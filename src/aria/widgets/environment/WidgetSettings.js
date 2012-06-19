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
    $dependencies : ["aria.widgets.environment.WidgetSettingsCfgBeans",
            /* BACKWARD-COMPATIBILITY-BEGIN */"aria.widgetLibs.environment.WidgetLibsSettings"/* BACKWARD-COMPATIBILITY-END */],
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.widgets.environment.WidgetSettingsCfgBeans.AppCfg",

        /**
         * This method is deprecated. There is no longer a single default library. Instead of this method, you can
         * consider using the getWidgetLibs method in aria.widgetLibs.environment.WidgetLibsSettings, along with
         * Aria.getClassRef.
         * @public
         * @return {Object}
         * @deprecated
         */
        getWidgetLib : function () {
            return Aria.getClassRef(this.getWidgetLibClassName());
        },

        /**
         * This method is deprecated. There is no longer a single default library. Instead of this method, you can
         * consider using the getWidgetLibs method in aria.widgetLibs.environment.WidgetLibsSettings.
         * @public
         * @return {String}
         * @deprecated
         */
        getWidgetLibClassName : function () {
            this.$logWarn("The getWidgetLibClassName and getWidgetLib methods are deprecated. There is no longer a single default library. Instead of these methods, you can consider using the getWidgetLibs method in aria.widgetLibs.environment.WidgetLibsSettings.");
            return aria.widgetLibs.environment.WidgetLibsSettings.getWidgetLibs().aria;
        },

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
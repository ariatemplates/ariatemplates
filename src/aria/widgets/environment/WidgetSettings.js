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
var Aria = require("../../Aria");
require("./WidgetSettingsCfgBeans");
var ariaCoreEnvironmentEnvironmentBase = require("../../core/environment/EnvironmentBase");


/**
 * Contains getters for the Number environment.
 * @class aria.utils.environment.WidgetSettings
 * @extends aria.core.environment.EnvironmentBase
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.widgets.environment.WidgetSettings",
    $extends : ariaCoreEnvironmentEnvironmentBase,
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         * @protected
         */
        _cfgPackage : "aria.widgets.environment.WidgetSettingsCfgBeans.AppCfg",

        /**
         * Returns the widget settings
         * @return {aria.widgets.environment.WidgetSettingsCfgBeans:WidgetSettingsCfg}
         */
        getWidgetSettings : function () {
            return this.checkApplicationSettings("widgetSettings");
        },

        /**
         * Returns the widget defaults
         * @return {aria.widgets.environment.WidgetSettingsCfgBeans:AppCfg.widgetDefaults}
         */
        getWidgetDefaults : function () {
            return this.checkApplicationSettings("widgetDefaults");
        }
    }
});

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
 * Test the environment settings related to widget libraries.
 */
Aria.classDefinition({
    $classpath : 'test.aria.widgetLibs.environment.WidgetLibsSettingsTest',
    $dependencies : ['aria.widgetLibs.environment.WidgetLibsSettings'],
    $extends : 'aria.jsunit.TestCase',
    $prototype : {
        testGetWidgetLibs : function () {
            aria.core.AppEnvironment.setEnvironment({});
            var widgetLibs = aria.widgetLibs.environment.WidgetLibsSettings.getWidgetLibs();
            this.assertJsonEquals(widgetLibs, {
                aria : "aria.widgets.AriaLib"
            }, "Invalid default environment value for defaultWidgetLibs");

            aria.core.AppEnvironment.setEnvironment({
                defaultWidgetLibs : {
                    a : "aria.a.ALib",
                    b : "aria.b.BLib"
                }
            });

            widgetLibs = aria.widgetLibs.environment.WidgetLibsSettings.getWidgetLibs();

            this.assertJsonEquals(widgetLibs, {
                a : "aria.a.ALib",
                b : "aria.b.BLib"
            }, "Invalid default environment value for defaultWidgetLibs");

            aria.core.AppEnvironment.setEnvironment({});

            aria.core.AppEnvironment.setEnvironment({
                defaultWidgetLibs : {
                    aria : "aria.a.NewAriaLib",
                    a : "aria.a.ALib",
                    b : "aria.b.BLib"
                }
            });

            widgetLibs = aria.widgetLibs.environment.WidgetLibsSettings.getWidgetLibs();

            this.assertJsonEquals(widgetLibs, {
                aria : "aria.a.NewAriaLib",
                a : "aria.a.ALib",
                b : "aria.b.BLib"
            }, "Invalid default environment value for defaultWidgetLibs");

            aria.core.AppEnvironment.setEnvironment({});
            // test again the default value
            widgetLibs = aria.widgetLibs.environment.WidgetLibsSettings.getWidgetLibs();
            this.assertJsonEquals(widgetLibs, {
                aria : "aria.widgets.AriaLib"
            }, "Invalid default environment value for defaultWidgetLibs");

        }
    }
});

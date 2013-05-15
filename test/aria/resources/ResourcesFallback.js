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
    $classpath : "test.aria.resources.ResourcesFallback",
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        testAsyncLoadClassWithResources : function () {
            this._oldLanguageSettings = aria.core.environment.Environment.getLanguage();
            aria.core.AppEnvironment.setEnvironment({
                language : {
                    "primaryLanguage" : "fr",
                    "region" : "BE"
                }
            }, {
                fn : this._afterLanguageSetting,
                scope : this
            }, true);

        },

        _afterLanguageSetting : function () {
            Aria.load({
                classes : ["test.aria.resources.ClassWithResources"],
                oncomplete : {
                    fn : this._afterClassLoad,
                    scope : this
                }
            });
        },

        _afterClassLoad : function () {
            aria.core.Timer.addCallback({
                fn : this._waitBeforeRestore,
                scope : this,
                delay : 500
            });
        },

        _waitBeforeRestore : function () {
            var parts = this._oldLanguageSettings.split("_");
            aria.core.AppEnvironment.setEnvironment({
                language : {
                    "primaryLanguage" : parts[0],
                    "region" : parts[1]
                }
            }, {
                fn : this._afterLocaleReset,
                scope : this
            });
        },

        _afterLocaleReset : function () {
            this.notifyTestEnd("testAsyncLoadClassWithResources");
        }

    }

});

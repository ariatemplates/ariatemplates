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
 * Test for the ResMgr class
 */
Aria.classDefinition({
    $classpath : "test.aria.core.ResMgrTestCase",
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        setUp : function () {
            aria.core.AppEnvironment.updateEnvironment({
                "language" : {
                    "primaryLanguage" : "it",
                    "region" : "IT"
                }
            });
        },

        tearDown : function () {
            Aria.dispose("test.aria.core.test.ExtResource");
        },

        testAsyncGetResourceLocale : function () {
            Aria.load({
                resources : ["test.aria.core.test.ExtResource"],
                oncomplete : {
                    fn : this._resourceItLoaded,
                    scope : this
                }
            });
        },

        _resourceItLoaded : function () {
            var locale = aria.core.ResMgr.getResourceLocale("test.aria.core.test.ExtResource");
            this.assertTrue(locale == "it_IT");
            this.assertTrue(test.aria.core.test.ExtResource.noResources.empty == "Niente");
            this.notifyTestEnd('testAsyncGetResourceLocale');
        }
    }
});

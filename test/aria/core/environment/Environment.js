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
    $classpath : "test.aria.core.environment.Environment",
    $dependencies : ["aria.core.environment.Environment", "aria.tools.contextual.environment.ContextualMenu"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        testGetSetLanguage : function () {
            aria.core.AppEnvironment.setEnvironment({
                "language" : {
                    "primaryLanguage" : "fr",
                    "region" : "FR"
                }
            });

            var settings = aria.core.environment.Environment.getLanguage();
            this.assertTrue(settings === "fr_FR");// user defined settings

            aria.core.AppEnvironment.setEnvironment({});

            settings = aria.core.environment.Environment.getLanguage();
            this.assertTrue(settings === "en_US");// default bean definition
        },

        testAsyncSetLanguage : function () {
            aria.core.environment.Environment.setLanguage("it_IT", {
                fn : this._setOneLang,
                scope : this
            });
        },
        _setOneLang : function () {
            var settings = aria.core.environment.Environment.getLanguage();
            this.assertTrue(settings === "it_IT");
            aria.core.AppEnvironment.setEnvironment({});
            aria.core.environment.Environment.setLanguage("not a locale!", {
                fn : this._setLocaleWithErr,
                scope : this
            });
        },

        _setLocaleWithErr : function () {
            this.assertErrorInLogs(aria.core.environment.Environment.INVALID_LOCALE);
            aria.core.AppEnvironment.setEnvironment({});
            aria.core.environment.Environment.setLanguage(null, {
                fn : this._setLocaleNull,
                scope : this
            });
        },

        _setLocaleNull : function () {
            this.assertErrorInLogs(aria.core.environment.Environment.INVALID_LOCALE);
            this.notifyTestEnd('testAsyncSetLanguage');
        },

        testGetSetRegion : function () {
            aria.core.AppEnvironment.setEnvironment({
                "language" : {
                    "primaryLanguage" : "fr",
                    "region" : "FR"
                }
            });

            var settings = aria.core.environment.Environment.getRegion();
            this.assertTrue(settings === "FR");

            aria.core.AppEnvironment.setEnvironment({});

            settings = aria.core.environment.Environment.getRegion();
            this.assertTrue(settings === "US");
        },

        testGetSetContextualMenu : function () {
            aria.core.AppEnvironment.setEnvironment({
                "contextualMenu" : {
                    enabled : false,
                    template : "testTemplate",
                    moduleCtrl : "testModuleController"
                }
            });
            var settings = aria.tools.contextual.environment.ContextualMenu.getContextualMenu();
            this.assertFalse(settings.enabled);
            this.assertTrue(settings.template === 'testTemplate');
            this.assertTrue(settings.moduleCtrl === 'testModuleController');

            aria.core.AppEnvironment.setEnvironment({});

            settings = aria.tools.contextual.environment.ContextualMenu.getContextualMenu();
            this.assertTrue(settings.enabled);
            this.assertTrue(settings.template === 'aria.tools.contextual.ContextualDisplay');
            this.assertTrue(settings.moduleCtrl === 'aria.tools.contextual.ContextualModule');
        },

        testIsDevMode : function () {
            aria.core.AppEnvironment.setEnvironment({
                "appSettings" : {
                    "devMode" : true
                }
            }, null, true);
            var dev = aria.core.environment.Environment.isDevMode();
            this.assertTrue(dev);
        },

        testIsDebug : function () {
            aria.core.AppEnvironment.setEnvironment({
                "appSettings" : {
                    "debug" : true
                }
            }, null, true);
            var debug = aria.core.environment.Environment.isDebug();
            this.assertTrue(debug);
        },

        testSetDebug : function () {
            aria.core.environment.Environment.setDebug(false);
            var debug = aria.core.environment.Environment.isDebug();
            this.assertFalse(debug);
        },

        testSetDevMode : function () {
            aria.core.environment.Environment.setDevMode(false);
            var dev = aria.core.environment.Environment.isDevMode();
            this.assertFalse(dev);
        },

        testHasEscapeHtmlByDefault : function () {
            aria.core.AppEnvironment.setEnvironment({
                "templateSettings" : {
                    "escapeHtmlByDefault" : true
                }
            }, null, true);
            var escape = aria.core.environment.Environment.hasEscapeHtmlByDefault();
            this.assertTrue(escape);
        },

        testSetEscapeHtmlByDefault : function () {
            aria.core.environment.Environment.setEscapeHtmlByDefault(false);
            var escape = aria.core.environment.Environment.hasEscapeHtmlByDefault();
            this.assertFalse(escape);
        },


        testAsyncSettingsPreservedAfterCustomizationEnabled : function () {
            // make sure the class is not loaded - clue of this test
            if (aria.core.environment.Customizations) {
                aria.core.ClassMgr.unloadClass("aria.core.environment.Customizations");
            }

            // first, let's update the env
            aria.core.AppEnvironment.updateEnvironment({
                customization : {
                    descriptor : {
                        "templates" : {
                            "originalApp.appdemo.tpl.Main" : "bob.appdemo.tpl.Main"
                        }
                    }
                }
            });

            // now, load Customizations and make sure it did not abandon the settings
            Aria.load({
                classes : ['aria.core.environment.Customizations'],
                oncomplete : {
                    fn : this._afterCustomizationLoaded,
                    scope : this
                }
            });
        },

        _afterCustomizationLoaded : function () {
            var resources = aria.core.environment.Customizations.getCustomizations()['templates'];
            try {
                this.assertTrue(resources['originalApp.appdemo.tpl.Main'] === 'bob.appdemo.tpl.Main', "Abandoned the AppEnvironment settings");
            } catch (e) {
                this.handleAsyncTestError(e, false);
            }
            this.notifyTestEnd();
        }
    }
});

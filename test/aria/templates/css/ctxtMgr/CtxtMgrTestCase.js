/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.templates.css.ctxtMgr.CtxtMgrTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.CSSMgr", "aria.utils.Type"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        var testData = {
            // Templates that should be visible
            T1 : true,
            T2 : true,
            T3 : false,
            T4 : false,
            T5 : false,
            T6 : false,
            T7 : false,
            T8 : false,
            T9 : false,
            T10 : false,
            T11 : false,
            T12 : false,
            // state of the test
            step : 0,
            // configuration for each state (what should be enabled
            configuration : [["T1", "T2"], ["T1", "T2"], ["T1", "T2", "T3"], ["T1", "T3", "T4", "T5"],
                    ["T1", "T2", "T3", "T4", "T5", "T6"],
                    ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T7", "T8", "T9", "T10", "T11", "T12"],
                    ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T7", "T8", "T9", "T10", "T11", "T12"]]
        };

        this.setTestEnv({
            template : "test.aria.templates.css.ctxtMgr.Main",
            data : testData
        });
    },
    $prototype : {
        assertPrefixes : function (prefixes) {
            var loadedPrefixes = [], expectedPrefixes = [];
            for (var name in prefixes) {
                if (prefixes.hasOwnProperty(name)) {
                    loadedPrefixes.push({
                        path : name,
                        value : parseInt(aria.templates.CSSMgr.__prefixes[name].substring(3), 10)
                    });
                    expectedPrefixes.push({
                        path : name,
                        value : parseInt(prefixes[name].substring(3), 10)
                    });
                }
            }
            loadedPrefixes = loadedPrefixes.sort(function (one, two) {
                return one.value - two.value;
            });
            expectedPrefixes = expectedPrefixes.sort(function (one, two) {
                return one.value - two.value;
            });
            for (var i = 0; i < expectedPrefixes.length; i += 1) {
                this.assertEquals(loadedPrefixes[i].path, expectedPrefixes[i].path);
            }
        },

        runTemplateTest : function () {
            // T1 and T2 should be loaded, check what's going on
            var cm = aria.templates.CSSMgr;

            // Button widget and Global skin are part of the usage
            var usage = {
                "aria.templates.GlobalStyle" : ["aria.templates.Template"],
                "aria.templates.LegacyGeneralStyle" : ["aria.templates.Template"],
                "aria.widgets.action.ButtonStyle" : ["aria.widgets.action.Button"],
                "aria.widgets.GlobalStyle" : ["aria.widgets.action.Button", "aria.widgets.Template",
                        "aria.widgets.Template"],
                "test.aria.templates.css.ctxtMgr.C1" : ["test.aria.templates.css.ctxtMgr.T1"],
                "test.aria.templates.css.ctxtMgr.C2" : ["test.aria.templates.css.ctxtMgr.T2"]
            };
            this.assertJsonEquals(usage, cm.__cssUsage);

            var prefixes = {
                "aria.templates.GlobalStyle" : "CSS0",
                "aria.templates.LegacyGeneralStyle" : "CSS1",
                "aria.widgets.GlobalStyle" : "CSS2",
                "test.aria.templates.css.ctxtMgr.C1" : "CSS3",
                "test.aria.templates.css.ctxtMgr.C2" : "CSS4"
            };
            this.assertPrefixes(prefixes);

            var loaded = ["aria.templates.GlobalStyle", "aria.widgets.GlobalStyle",
                    "test.aria.templates.css.ctxtMgr.C1", "test.aria.templates.css.ctxtMgr.C2",
                    "aria.widgets.action.ButtonStyle"];
            this.assertEquals(cm.__pathsLoaded.length, 8);
            for (var i = 0, len = loaded.length; i < len; i += 1) {
                this.assertTrue(aria.utils.Array.indexOf(cm.__pathsLoaded, loaded[i]) > -1);
            }

            var association = {
                "test.aria.templates.css.ctxtMgr.C1" : "tpl",
                "test.aria.templates.css.ctxtMgr.C2" : "tpl",
                "aria.widgets.action.ButtonStyle" : "wgt",
                "aria.templates.GlobalStyle" : "wgt",
                "aria.templates.LegacyGeneralStyle" : "wgt",
                "aria.widgets.GlobalStyle" : "wgt"
            };
            this.assertJsonEquals(association, cm.__styleTagAssociation);
            this.__styleTagAssociation = {};

            this.assertTrue(aria.utils.Type.isHTMLElement(cm.__styleTagPool.tpl));
            this.assertTrue(aria.utils.Type.isHTMLElement(cm.__styleTagPool.wgt));

            // Call a refresh
            this.synEvent.click(this.getWidgetInstance("btnNext").getDom(), {
                fn : this.__state1,
                scope : this
            });
        },

        __state1 : function () {
            // It was a simple refresh, T1 and T2 should be loaded with the same order
            var cm = aria.templates.CSSMgr;

            var usage = {
                "aria.templates.GlobalStyle" : ["aria.templates.Template"],
                "aria.templates.LegacyGeneralStyle" : ["aria.templates.Template"],
                "aria.widgets.action.ButtonStyle" : ["aria.widgets.action.Button"],
                "aria.widgets.GlobalStyle" : ["aria.widgets.action.Button", "aria.widgets.Template",
                        "aria.widgets.Template"],
                "test.aria.templates.css.ctxtMgr.C1" : ["test.aria.templates.css.ctxtMgr.T1"],
                "test.aria.templates.css.ctxtMgr.C2" : ["test.aria.templates.css.ctxtMgr.T2"]
            };
            this.assertJsonEquals(usage, cm.__cssUsage);

            var prefixes = {
                "aria.templates.GlobalStyle" : "CSS0",
                "aria.templates.LegacyGeneralStyle" : "CSS1",
                "aria.widgets.GlobalStyle" : "CSS2",
                "test.aria.templates.css.ctxtMgr.C1" : "CSS3",
                "test.aria.templates.css.ctxtMgr.C2" : "CSS4"
            };
            this.assertPrefixes(prefixes);

            var loaded = ["aria.templates.GlobalStyle", "aria.widgets.GlobalStyle",
                    "test.aria.templates.css.ctxtMgr.C1", "test.aria.templates.css.ctxtMgr.C2",
                    "aria.widgets.action.ButtonStyle"];
            this.assertEquals(cm.__pathsLoaded.length, 8);
            for (var i = 0, len = loaded.length; i < len; i += 1) {
                this.assertTrue(aria.utils.Array.indexOf(cm.__pathsLoaded, loaded[i]) > -1);
            }

            var association = {
                "test.aria.templates.css.ctxtMgr.C1" : "tpl",
                "test.aria.templates.css.ctxtMgr.C2" : "tpl",
                "aria.widgets.action.ButtonStyle" : "wgt",
                "aria.templates.GlobalStyle" : "wgt",
                "aria.templates.LegacyGeneralStyle" : "wgt",
                "aria.widgets.GlobalStyle" : "wgt"
            };
            this.assertJsonEquals(association, cm.__styleTagAssociation);
            this.__styleTagAssociation = {};

            this.assertTrue(aria.utils.Type.isHTMLElement(cm.__styleTagPool.tpl));
            this.assertTrue(aria.utils.Type.isHTMLElement(cm.__styleTagPool.wgt));

            this.notifyTemplateTestEnd();
        }
    }
});

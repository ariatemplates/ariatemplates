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
    $classpath : "test.aria.templates.css.numberReload.OneLevelTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.CSSMgr", "aria.utils.Array"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.css.numberReload.Base",
            data : {
                visible : false,
                tpl : ""
            }
        });
    },
    $prototype : {
        /**
         * Instrument the CSS Manager to measure the number of reloads
         */
        instrumentCode : function () {
            this.refreshNumber = 0;
            this.loadNumber = 0;

            this._originalReload = aria.templates.CSSMgr.__reloadStyleTags;
            this._originalLoad = aria.templates.CSSMgr.loadWidgetDependencies;

            var that = this;
            aria.templates.CSSMgr.__reloadStyleTags = function () {
                that.refreshNumber += 1;

                return that._originalReload.apply(aria.templates.CSSMgr, arguments);
            };

            aria.templates.CSSMgr.loadWidgetDependencies = function () {
                that.loadNumber += 1;

                return that._originalLoad.apply(aria.templates.CSSMgr, arguments);
            };
        },

        tearDown : function () {
            aria.templates.CSSMgr.loadWidgetDependencies = this._originalLoad;
            aria.templates.CSSMgr.__reloadStyleTags = this._originalReload;
        },

        runTemplateTest : function () {
            // Set the template to load
            var ctxt = this.templateCtxt;
            ctxt.data.tpl = "test.aria.templates.css.numberReload.MoreWidgets";
            ctxt.data.visible = true;

            this.instrumentCode();

            // Being a template widget the refresh is asynchronous
            ctxt.$onOnce({
                "Ready" : {
                    fn : this._onSubTemplateLoaded,
                    scope : this
                }
            });

            ctxt._tpl.$refresh();
        },

        _onSubTemplateLoaded : function () {
            // As of AT 1.4.1, there are two CSS reloads here:
            // - First, when loading a template widget (to have a subtemplate), which loads
            // $css : ["aria.widgets.GlobalStyle"] indirectly in aria.widgets.Widget
            // - Second, when loading the actual subtemplate in that template widget - and its dependencies' CSS.
            //
            // It used to be only 1 reload before extracting widgets-global-style (AT 1.4.1) into separate TPL.CSS.
            // It would be better to have only 1 reload, but having two is not that big deal (this is actually only due
            // to
            // the fact that the first widget loaded is the Template widget, needed to have a subtemplate).
            this.assertTrue(this.refreshNumber === 1 || this.refreshNumber === 2, "Expecting 1 or 2 refreshes, got "
                    + this.refreshNumber);
            this._inspectCSSMgr();

            // Now do again a refresh to check what happens
            var ctxt = this.templateCtxt;
            ctxt.$onOnce({
                "Ready" : {
                    fn : this._onSubTemplateRefreshed,
                    scope : this
                }
            });

            this.refreshNumber = 0;
            this.loadNumber = 0;

            // Wait for the first refresh to be ready (i'm in the refresh callback)
            aria.core.Timer.addCallback({
                fn : function () {
                    this._tpl.$refresh();
                },
                scope : ctxt,
                delay : 100
            });
        },

        _onSubTemplateRefreshed : function () {
            this.assertEquals(this.refreshNumber, 0, "Expecting 0 refreshes, got " + this.refreshNumber);
            // Just to check that we called load at least once
            this.assertTrue(this.loadNumber > 3, "Load method was never called");
            this.notifyTemplateTestEnd();
        },

        _inspectCSSMgr : function () {
            var cm = aria.templates.CSSMgr;
            var arrayUtil = aria.utils.Array;

            this.assertTrue(!!cm.__cssUsage["aria.widgets.form.TextInputStyle"], "cssUsage TextInput");
            this.assertTrue(!!cm.__cssUsage["aria.widgets.action.LinkStyle"], "cssUsage Link");
            this.assertTrue(!!cm.__cssUsage["aria.widgets.form.SelectStyle"], "cssUsage Select");
            this.assertTrue(!!cm.__cssUsage["aria.widgets.form.SelectBoxStyle"], "cssUsage SelectBox");
            this.assertTrue(!!cm.__cssUsage["aria.widgets.form.MultiSelectStyle"], "cssUsage MultiSelect");

            this.assertTrue(arrayUtil.contains(cm.__pathsLoaded, "aria.widgets.form.TextInputStyle"), "pathsLoaded TextInput");
            this.assertTrue(arrayUtil.contains(cm.__pathsLoaded, "aria.widgets.action.LinkStyle"), "pathsLoaded Link");
            this.assertTrue(arrayUtil.contains(cm.__pathsLoaded, "aria.widgets.form.SelectStyle"), "pathsLoaded Select");
            this.assertTrue(arrayUtil.contains(cm.__pathsLoaded, "aria.widgets.form.SelectBoxStyle"), "pathsLoaded SelectBox");
            this.assertTrue(arrayUtil.contains(cm.__pathsLoaded, "aria.widgets.form.MultiSelectStyle"), "pathsLoaded MultiSelect");

            this.assertTrue(!!cm.__textLoaded["aria.widgets.form.TextInputStyle"], "textLoaded TextInput");
            this.assertTrue(!!cm.__textLoaded["aria.widgets.action.LinkStyle"], "textLoaded Link");
            this.assertTrue(!!cm.__textLoaded["aria.widgets.form.SelectStyle"], "textLoaded Select");
            this.assertTrue(!!cm.__textLoaded["aria.widgets.form.SelectBoxStyle"], "textLoaded SelectBox");
            this.assertTrue(!!cm.__textLoaded["aria.widgets.form.MultiSelectStyle"], "textLoaded MultiSelect");

        }
    }
});

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
    $classpath : "test.aria.widgets.action.sortindicator.onclick.OnclickCallback",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["test.aria.widgets.action.sortindicator.onclick.samples.SortData"],
    $constructor : function () {

        this.$TemplateTestCase.constructor.call(this);
        var DataClass = Aria.getClassRef("test.aria.widgets.action.sortindicator.onclick.samples.SortData");
        this.dataObj = new DataClass();

        this.setTestEnv({
            template : this.$classpath + "Tpl",
            moduleCtrl : null,
            data : this.dataObj.data
        });
    },
    $destructor : function () {
        this.dataObj.$dispose();
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {

        runTemplateTest : function () {
            var siElement = this.getSortIndicator("SortIndicatorId0");
            this.synEvent.click(siElement.firstChild, {
                fn : this.siClicked,
                scope : this
            });
        },

        siClicked : function () {
            this.assertTrue(this.env.data.isClicked, "onClick callback should be called on sort indicator click");

            // dispose views, as the framework does not do it:
            this._disposeViews();

            this.notifyTemplateTestEnd();
        },

        _disposeViews : function () {
            // Note that this should not be accessed directly by applications. It is done only so that there is no
            // undisposed object error.
            var persistentStorage = this.templateCtxt.getPersistentStorage();
            persistentStorage.recommendationsView[0].$dispose();
        }
    }
});

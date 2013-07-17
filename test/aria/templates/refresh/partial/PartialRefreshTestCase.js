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
    $classpath : "test.aria.templates.refresh.partial.PartialRefreshTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.refresh.partial.PTRTemplate"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var btnPartialRefresh = this.getElementById("button1");
            this.synEvent.click(btnPartialRefresh, {
                fn : this.__afterPartialRefresh,
                scope : this
            });

        },
        __afterPartialRefresh : function () {
            this.assertTrue(this.templateCtxt._tpl.data.textAfterRefresh == "After partial refresh");
            var btnFullRefresh = this.getElementById("button2");
            this.synEvent.click(btnFullRefresh, {
                fn : this.__afterFullRefresh,
                scope : this
            });

        },
        __afterFullRefresh : function () {
            this.assertTrue(this.templateCtxt._tpl.data.textAfterRefresh == "After full refresh");
            this.notifyTemplateTestEnd();
        }
    }
});
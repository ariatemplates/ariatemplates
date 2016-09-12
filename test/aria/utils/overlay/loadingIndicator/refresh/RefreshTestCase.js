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
    $classpath : "test.aria.utils.overlay.loadingIndicator.refresh.RefreshTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            processing : true,
            myBoolean : true
        };
        this.setTestEnv({
            template : "test.aria.utils.overlay.loadingIndicator.refresh.RefreshTestTpl",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            try {
                var jsonUtils = aria.utils.Json;
                jsonUtils.setValue(this.data, "myBoolean", false);
                this.templateCtxt.$refresh();
                this.notifyTemplateTestEnd();
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }
    }
});

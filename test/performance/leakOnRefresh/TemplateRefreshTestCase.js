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
    $classpath : "test.performance.leakOnRefresh.TemplateRefreshTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.performance.leakOnRefresh.Refresh"
        });
    },
    $prototype : {

        runTemplateTest : function () {
            // For the test it's enough two iteration, for the leak do a lot of them
            this.doRefresh(1);
        },

        doRefresh : function (iteration) {
            var wrapper = this.templateCtxt.$getElementById("container");
            this.templateCtxt.$refresh();

            // after a refresh the variables containing DOM references should be empty
            this.assertEquals(this.templateCtxt.__wrappers.length, 0);

            if (iteration > 0) {
                aria.core.Timer.addCallback({
                    fn : this.doRefresh,
                    scope : this,
                    args : --iteration,
                    delay : 500
                });
            } else {
                this.notifyTemplateTestEnd();
            }
        }
    }
});

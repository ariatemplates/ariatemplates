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
    $classpath : "test.aria.utils.css.AnimationsBean",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.css.AnimationsBean"],
    $prototype : {
        testBean : function () {
            var document = Aria.$window.document;
            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var validBean = {
                from : div1,
                to : div2,
                reverse : true,
                type : 1,
                hiddenClass : "not-visible"
            };

            var isValid = aria.core.JsonValidator.normalize({
                json : validBean,
                beanName : "aria.utils.css.AnimationsBean.AnimationCfg"
            }, false);
            this.assertTrue(isValid, "Valid bean invalid");

            var invalidBean = {
                nothing : "here"
            };

            isValid = aria.core.JsonValidator.normalize({
                json : invalidBean,
                beanName : "aria.utils.css.AnimationsBean.AnimationCfg"
            }, false);
            this.assertErrorInLogs(aria.core.JsonValidator.UNDEFINED_PROPERTY);
            this.assertFalse(isValid, "Invalid bean valid");
        }
    }
});

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
    $classpath : "test.aria.utils.environment.VisualFocus",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.environment.VisualFocus", "aria.utils.VisualFocus"],
    $prototype : {
        testGetSetVisualFocus : function () {
            var test = aria.utils.environment.VisualFocus.getAppOutlineStyle();

            aria.core.AppEnvironment.setEnvironment({
                appOutlineStyle : "red dashed 2px"
            });

            var settings = aria.utils.environment.VisualFocus.getAppOutlineStyle();
            this.assertTrue(settings === "red dashed 2px");
        }
    }
});

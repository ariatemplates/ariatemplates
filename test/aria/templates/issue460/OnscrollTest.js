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
    $classpath : "test.aria.templates.issue460.OnscrollTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {
            vertical : 0,
            horizontal : 0
        };
        this.setTestEnv({
            template : "test.aria.templates.issue460.Onscroll",
            data : this.data
        });

    },
    $prototype : {
        runTemplateTest : function () {
            var touchDiv = aria.utils.Dom.getElementById("touchMe");

            this.synEvent.click(touchDiv, {
                fn : this.__horizontalTest,
                scope : this
            });

        },

        __horizontalTest : function () {
            this.synEvent.type(aria.utils.Dom.getElementById("touchMe"), "[right][right][right]", {
                fn : this.__verticalTest,
                scope : this
            });
        },
        
        __verticalTest : function () {
            this.synEvent.type(aria.utils.Dom.getElementById("touchMe"),"[down][down][down][right][right][right]", {
                fn : this.__FinishTest,
                scope : this
            });
        },

        __FinishTest : function () {
            this.assertTrue(this.data.vertical>0,"scrollTop didnt change");
            this.assertTrue(this.data.horizontal>0,"scrollLeft didnt change");
            this.end();
        }
    }
});

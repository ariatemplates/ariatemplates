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

/**
 * Special flow controller to test flow classpath override.
 */
Aria.classDefinition({
    $classpath : 'test.aria.templates.test.SampleModuleSpecialCtrlFlow',
    $extends : 'aria.templates.FlowCtrl',
    $constructor : function () {
        this.$FlowCtrl.constructor.call(this);
    },
    $destructor : function () {
        this._testCb = null;
        this.$FlowCtrl.$destructor.call(this);
    },
    $prototype : {
        oninitCallBegin : function (param) {
            var initArgs = param.args[0];
            // test is the test itself. Set the special flag to true to identify this flow
            initArgs.test.special = true;
        }
    }
});

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
    $classpath : "test.aria.modules.moduleReload.CustomizedFlow",
    $extends : "aria.templates.FlowCtrl",
    $implements : ["test.aria.modules.moduleReload.ICustomizedFlow"],
    $constructor : function () {
        this.$FlowCtrl.constructor.call(this);
        this.instanceLoadDate = new Date();
        this._flowData = {
            customized : true
        };
    },
    $prototype : {
        $publicInterfaceName : "test.aria.modules.moduleReload.ICustomizedFlow",
        classLoadDate : new Date(),
        getFlowData : function () {
            return this._flowData;
        }
    }
});

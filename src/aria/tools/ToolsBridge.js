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
var Aria = require("../Aria");
var ariaUtilsBridge = require("../utils/Bridge");


/**
 * Entry point for the tools
 * @singleton
 * @class aria.tools.ToolsBridge
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.tools.ToolsBridge',
    $extends : ariaUtilsBridge,
    $singleton : true,
    $constructor : function () {
        this.$Bridge.constructor.call(this);
    },
    $prototype : {

        /**
         * Open the tools bridge
         */
        open : function () {
            return this.$Bridge.open.call(this, {
                moduleCtrlClasspath : "aria.tools.ToolsModule",
                displayClasspath : "aria.tools.ToolsDisplay",
                title : "Tools"
            });
        }
    }
});

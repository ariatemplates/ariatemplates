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
 * Test class implementing an interface and extending another class which implements an interface.
 * @class test.aria.core.test.InheritAndImplementInterface
 */
Aria.classDefinition({
    $classpath : "test.aria.core.test.InheritAndImplementInterface",
    $extends : "test.aria.core.test.ImplementInterface1",
    $implements : ["test.aria.core.test.Interface2"],
    $constructor : function () {
        this.$ImplementInterface1.constructor.call(this);
    },
    $prototype : {
        myAdditionnalFunction : function (param1, param2) {
            // Real implementation here
            this.myData.myAdditionnalFunctionCalled++;
            this.myData.myAFParam1 = param1;
            this.myData.myAFParam2 = param2;
            return param1;
        }
    }
});
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
 * Test class implementing an interface.
 */
Aria.classDefinition({
    $classpath : "test.aria.core.test.ImplementInterface2",
    $implements : ["test.aria.core.test.Interface2"],
    $events : {
        "evtNotPartOfInterface" : "This event does not belong to an interface."
    },
    $constructor : function () {
        // real implementation:
        this.myData = {
            searchCalled : 0,
            resetCalled : 0,
            notPartOfInterfaceCalled : 0
        };
        this.myArray = ["a", "b", "c"];
        this.dataNotPartOfInterface = ["here"];
    },
    $prototype : {
        notPartOfInterface : function () {
            // this is not part of the interface
            this.myData.notPartOfInterfaceCalled++;
        },
        search : function (searchParam1, searchParam2) {
            // Real implementation here
            this.myData.searchCalled++;
            // test that the parameters are well transmitted:
            this.myData.searchParam1 = searchParam1;
            this.myData.searchParam2 = searchParam2;
            return "searchResult";
        },
        reset : function () {
            // Real implementation here
            this.myData.resetCalled++;
        },
        myAdditionnalFunction : function (param1, param2) {
            // Real implementation here
            this.myData.myAdditionnalFunctionCalled++;
            this.myData.myAFParam1 = param1;
            this.myData.myAFParam2 = param2;
            return param1;
        }
    }
});

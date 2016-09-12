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
 * Test a binding with a listener on module data
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModelBindingTestFour",
    $extends : "test.aria.pageEngine.siteRootModule.ModelBindingTestTwo",
    $prototype : {

        _assertDataStructure : function () {
            var commonM1data = this._getModuleData("common:m1", true);
            var listener = {
                fn : this._changeOtherModuleData,
                scope : this
            };
            this.$json.addListener(commonM1data.first, "data", listener);

            // change a bound value
            this.$json.setValue(this._getModuleData("m1", true), "first", "new");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new");
            this.assertEquals(this._getModuleData("common:m1", false).first.data, "new");

            // verify that a value has changed because of the listener added in the data model of the module
            this.assertEquals(this.rm.getData().storage.appData.second, true);
            this.assertEquals(this._getModuleData("m1", false).second, true);
            this.assertEquals(this._getModuleData("common:m1", false).second, true);

            this.$json.removeListener(commonM1data.first, "data", listener);

            this.completeTest();
        },

        _changeOtherModuleData : function () {
            this.$json.setValue(this._getModuleData("common:m1", true), "second", true);
        }
    }
});

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

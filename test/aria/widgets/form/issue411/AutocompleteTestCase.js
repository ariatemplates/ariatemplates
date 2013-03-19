Aria.classDefinition({
    $classpath : "test.aria.widgets.form.issue411.AutocompleteTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // override the template for this test case
        this.setTestEnv({
            template : "test.aria.widgets.form.issue411.Autocomplete",
            data : {
                options : [{
                            label : "First",
                            value : "One"
                        }, {
                            label : "Second",
                            value : "Two"
                        }, {
                            label : "Third",
                            value : "Three"
                        }, {
                            label : "Fourth",
                            value : "Four"
                        }]
            }
        });
    },
    $prototype : {
        _helperGetPopupTable : function (id) {
            var popup = this.getWidgetDropDownPopup(id);

            if (popup) {
                var table = popup.getElementsByTagName("table")[0];
                if (table) {
                    return table.parentNode;
                }
            }
        },

        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this.openPopupDropdownWithExpandButton,
                scope : this,
                delay : 1000
            });
        },

        openPopupDropdownWithExpandButton : function () {
            var popup = this._helperGetPopupTable("ac");
            var widgetInstance = this.getWidgetInstance("ac");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true-1");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the Autocomplete is not opened");
            var expandButton = this.getExpandButton("ac");
            this.synEvent.click(expandButton, {
                fn : this.assertPopup0,
                scope : this
            });
        },

        assertPopup0 : function () {
            var popup = this._helperGetPopupTable("ac");
            var widgetInstance = this.getWidgetInstance("ac");
            this.assertEquals(widgetInstance._cfg.popupOpen, false, "Current value of popupOpen is true, where as it was expected to be false-2");
            popup = this._helperGetPopupTable("ac");
            this.assertEquals(typeof(popup), "undefined", "Dropdown for the Autocomplete is still open where as it was expected to be closed-3");
            this.openNextPopup();
        },

        openNextPopup : function () {
            aria.utils.Json.setValue(this.env.data, "popupopenAC", true);
            var delayM = aria.core.Browser.isIE ? 1000 : 500;
            aria.core.Timer.addCallback({
                fn : this.assertPopup1,
                scope : this,
                delay : delayM
            });
        },

        assertPopup1 : function () {
            var popup = this._helperGetPopupTable("ac");
            var widgetInstance = this.getWidgetInstance("ac");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true-4");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the Autocomplete is not opened");
            aria.utils.Json.setValue(this.env.data, "popupopenAC", false);
            this.assertEquals(widgetInstance._cfg.popupOpen, false, "Current value of popupOpen is true, where as it was expected to be false-5");
            popup = this._helperGetPopupTable("ac");
            this.assertEquals(typeof(popup), "undefined", "Dropdown for the Autocomplete is still open where as it was expected to be closed-6");
            var expandButton = this.getExpandButton("ac");
            this.synEvent.click(expandButton, {
                fn : this.assertPopup2,
                scope : this
            });
        },

        assertPopup2 : function () {
            var popup = this._helperGetPopupTable("ac");
            var widgetInstance = this.getWidgetInstance("ac");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true-4");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the Autocomplete is not opened");
            this.openPopupDropdownWithOutExpandButton();
        },

        openPopupDropdownWithOutExpandButton : function () {
            aria.utils.Json.setValue(this.env.data, "popupopenAC1", true);
            aria.core.Timer.addCallback({
                fn : this.assertPopup3,
                scope : this,
                delay : 200
            });
        },

        assertPopup3 : function () {
            var popup = this._helperGetPopupTable("ac1");
            var widgetInstance = this.getWidgetInstance("ac1");
            this.assertEquals(widgetInstance._cfg.popupOpen, false, "Current value of popupOpen for Autocomplete without expand button is true, where as it was expected to be false - assertPopup21");
            this.assertEquals(typeof(popup), "undefined", "Dropdown for the Autocomplete without expand button is open where as it was expected to be closed - assertPopup22");
            var expandButton = this.getExpandButton("ac1");
            this.notifyTemplateTestEnd();
        }
    }
});
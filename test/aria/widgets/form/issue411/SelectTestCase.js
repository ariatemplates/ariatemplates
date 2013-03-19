Aria.classDefinition({
    $classpath : "test.aria.widgets.form.issue411.SelectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // override the template for this test case
        this.setTestEnv({
            template : "test.aria.widgets.form.issue411.Select",
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
                fn : this.assertPopup,
                scope : this,
                delay : 500
            });
        },
        assertPopup : function () {
            var popup = this._helperGetPopupTable("select");
            var widgetInstance = this.getWidgetInstance("select");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the Select is not opened");
            var expandButton = this.getExpandButton("select");
            this.synEvent.click(expandButton, {
                fn : this.openPopupDropdown,
                scope : this
            });
        },
        openPopupDropdown : function () {
            var popup = this._helperGetPopupTable("select");
            var widgetInstance = this.getWidgetInstance("select");
            this.assertEquals(widgetInstance._cfg.popupOpen, false, "Current value of popupOpen is true, where as it was expected to be false");
            this.assertEquals(typeof(popup), "undefined", "Dropdown for the Select is still open where as it was expected to be closed");
            aria.utils.Json.setValue(this.env.data, "popupopenSelect", true);
            aria.core.Timer.addCallback({
                fn : this.assertPopup1,
                scope : this,
                delay : 500
            });
        },
        assertPopup1 : function () {
            var popup = this._helperGetPopupTable("select");
            var widgetInstance = this.getWidgetInstance("select");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the Select is not opened");
            aria.utils.Json.setValue(this.env.data, "popupopenSelect", false);
            this.assertEquals(widgetInstance._cfg.popupOpen, false, "Current value of popupOpen is true, where as it was expected to be false");
            popup = this._helperGetPopupTable("select");
            this.assertEquals(typeof(popup), "undefined", "Dropdown for the Select is still open where as it was expected to be closed");

            var expandButton = this.getExpandButton("select");
            this.synEvent.click(expandButton, {
                fn : this.assertPopup2,
                scope : this
            });

        },
        assertPopup2 : function () {
            var popup = this._helperGetPopupTable("select");
            var widgetInstance = this.getWidgetInstance("select");
            this.assertEquals(widgetInstance._cfg.popupOpen, true, "Current value of popupOpen is false, where as it was expected to be true");
            this.assertNotEquals(typeof(popup), "undefined", "Dropdown for the Select is not opened");
            this.notifyTemplateTestEnd();
        }
    }
});
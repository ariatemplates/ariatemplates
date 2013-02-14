Aria.classDefinition({
    $classpath : "test.aria.templates.issue353.Issue353TestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        var item1 = {
            name : "item1"
        };
        var item2 = {
            name : "item2"
        };
        this.setTestEnv({
            template : "test.aria.templates.issue353.Main",
            data : {
                items : [item1, item2],
                subItems : [item1]
            }
        });

    },
    $prototype : {
        runTemplateTest : function () {
            var textField1 = this.__getChildrenByIdAndTagName("textField1", "input")[0];

            this.synEvent.execute([["click", textField1], ["type", textField1, "test1"]], {
                fn : this.__afterFirstType,
                scope : this
            });

        },

        __afterFirstType : function () {
            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.__afterFirstClick,
                scope : this
            });
        },

        __afterFirstClick : function () {
            var textField2 = this.__getChildrenByIdAndTagName("textField2", "input")[0];

            this.__checkFieldsets(["item1test1", "item2"], ["item1test1"]);
            this.__checkInputs("item1test1");
            this.synEvent.execute([["click", textField2], ["type", textField2, "test2"]], {
                fn : this.__afterSecondType,
                scope : this
            });
        },

        __afterSecondType : function () {
            var outside = aria.utils.Dom.getElementById("outsideDiv");

            this.synEvent.click(outside, {
                fn : this.__afterSecondClick,
                scope : this
            });
        },

        __afterSecondClick : function () {

            this.__checkFieldsets(["item1test1test2", "item2"], ["item1test1test2"]);
            this.__checkInputs("item1test1test2");
            this.__finishTest();
        },

        __checkFieldsets : function (items, subitems) {
            var arrLi;

            arrLi = this.__getChildrenByIdAndTagName("list", "li", true);
            this.assertTrue(arrLi[0].innerHTML == items[0], "The arrLi[0].innerHTML value in list is not correct [section]: "
                    + arrLi[0].innerHTML + "!=" + items[0]);
            this.assertTrue(arrLi[1].innerHTML == items[1], "The arrLi[1].innerHTML value in list is not correct [section]: "
                    + arrLi[1].innerHTML + "!=" + items[1]);

            arrLi = this.__getChildrenByIdAndTagName("sublist", "li", true);
            this.assertTrue(arrLi[0].innerHTML == subitems[0], "The arrLi[0].innerHTML value in sublist is not correct [section]: "
                    + arrLi[0].innerHTML + "!=" + subitems[0]);

        },

        __checkInputs : function (itemValue) {
            var arrLi;

            arrLi = this.__getChildrenByIdAndTagName("textField1", "input");
            this.assertTrue(arrLi[0].value == itemValue, "The arrLi[0].innerHTML value in list is not correct [textField]: "
                    + arrLi[0].value + "!=" + itemValue);

            arrLi = this.__getChildrenByIdAndTagName("textField2", "input");
            this.assertTrue(arrLi[0].value == itemValue, "The arrLi[0].innerHTML value in sublist is not correct [textField]: "
                    + arrLi[0].value + "!=" + itemValue);

        },

        __getChildrenByIdAndTagName : function (id, tagName, section) {
            var domId, elem, arrLi;

            if (section) {
                elem = this.getElementById(id);
            } else {
                domId = this.getWidgetInstance(id)._domId;
                elem = aria.utils.Dom.getElementById(domId);
            }

            arrLi = aria.utils.Dom.getDomElementsChildByTagName(elem, tagName);

            return arrLi;
        },

        __finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
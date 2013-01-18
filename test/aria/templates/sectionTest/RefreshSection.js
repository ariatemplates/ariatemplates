/**
 * @class test.aria.templates.sectionTest.RefreshSection",
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.sectionTest.RefreshSection",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.sectionTest.SectionXTpl"
        });
        this.attributes = [{
                    name : 'name'
                }, {
                    name : 'title'
                }];
    },

    $prototype : {
        runTemplateTest : function () {
            this._checkSectionAttributes();
            this.refreshSectionAttributes();
        },
        /**
         * This method tests the refreshing of section attributes.
         */
        refreshSectionAttributes : function () {
            this.attributes = [{
                        name : 'name'
                    }, {
                        name : 'dir'
                    }];
            this._buttonClick(1, this._checkSectionAttributes);
            this.attributes = [{
                        name : 'name'
                    }, {
                        name : 'title'
                    }, {
                        name : 'dir'
                    }];
            this._buttonClick(2, this._checkSectionAttributes);
            this._end();
        },
        _checkSectionAttributes : function () {
            // check attributes
            var domElt = this.getElementById('sectionx');
            var attributeMatch = false;
            for (var h = 0; h < this.attributes.length; h++) {
                for (var i = 0; i < domElt.attributes.length; i++) {
                    if (domElt.attributes[i].name === this.attributes[h].name) {
                        attributeMatch = true;
                    }
                }
            }
            this.assertTrue(attributeMatch);
        },
        _buttonClick : function (button, cb) {
            // chrome and IE are not playing nicely thus need to include two approaches to acheive the same result...
            var buttonToClick = this.getElementById(button);
            buttonToClick.click();
            cb.call(this);
        },
        _end : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
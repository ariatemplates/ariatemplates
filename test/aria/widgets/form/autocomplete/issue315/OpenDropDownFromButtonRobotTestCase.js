Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.issue315.OpenDropDownFromButtonRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.FireDomEvent"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.issue315.OpenDropDownFromButtonTestCaseTpl",
            data : {
                email : "" // must be an empty string && res handler must return empty array in this test
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this._logAppender.setLogs([]);
            var expandButton = this.getExpandButton("ac1");
            this.synEvent.click(expandButton, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return !this.getWidgetDropDownPopup("ac1");
                        },
                        callback : {
                            fn : this._openAc,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },

        _openAc : function (evt, args) {
            var logs = this._logAppender.getLogs();
            this.assertEquals(logs.length, 1);
            this.assertEquals(logs[0].msg, "OpenDropDownFromButtonTest handler message");
            this.notifyTemplateTestEnd();
        }
    }
});

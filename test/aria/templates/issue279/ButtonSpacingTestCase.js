Aria.classDefinition({
    $classpath : "test.aria.templates.issue279.ButtonSpacingTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.issue279.ButtonSpacingTemplate"
        });

    },
    $prototype : {
        runTemplateTest : function () {
            this.__checkButtonSpacing();
            this.__finishTest();
        },
        __checkButtonSpacing : function () {
            var domId, button1DomStyle, domUtil, button1Position, button2DomStyle, button2Position;

            domUtil = aria.utils.Dom;
            domId = this.getWidgetInstance("id1")._domId;
            button1DomStyle = aria.utils.Dom.getElementById(domId);
            button1Position = domUtil.calculatePosition(button1DomStyle);

            domId = this.getWidgetInstance("id2")._domId;
            button2DomStyle = aria.utils.Dom.getElementById(domId);
            button2Position = domUtil.calculatePosition(button2DomStyle);

            this.assertTrue(Math.abs(button1Position.left + button1DomStyle.offsetWidth - button2Position.left) >= 1, "Button spacing between button is less than 1 px, actual:"
                    + Math.abs(button1Position.left + button1DomStyle.offsetWidth - button2Position.left));
            this.assertTrue(Math.abs(button1Position.left + button1DomStyle.offsetWidth - button2Position.left) < 3, "Button spacing between button is more than 3 px, actual:"
                    + Math.abs(button1Position.left + button1DomStyle.offsetWidth - button2Position.left));
        },
        __finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});

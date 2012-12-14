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
            var domId, button1DomStyle, domUtil, button1Position, button2DomStyle, button2Position, space;

            domUtil = aria.utils.Dom;
            domId = this.getWidgetInstance("id1")._domId;
            button1DomStyle = aria.utils.Dom.getElementById(domId);
            button1Position = domUtil.calculatePosition(button1DomStyle);

            domId = this.getWidgetInstance("id2")._domId;
            button2DomStyle = aria.utils.Dom.getElementById(domId);
            button2Position = domUtil.calculatePosition(button2DomStyle);

            space = button2Position.left - button1Position.left - button1DomStyle.offsetWidth;
            this.assertTrue(space >= 1, "Button spacing between button is less than 1 px, actual:" + space);
            this.assertTrue(space < 3, "Button spacing between button is more than 3 px, actual:" + space);
        },
        __finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});

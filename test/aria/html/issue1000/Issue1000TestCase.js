Aria.classDefinition({
    $classpath : "test.aria.html.issue1000.Issue1000TestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.html.issue1000.Issue1000Template"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.assertNotUndefined(this.getWidgetInstance("checkId"), "Widget with id checkId not found");
            this.assertNotUndefined(this.getWidgetInstance("radioId"), "Widget with id radioId not found");
            this.assertNotUndefined(this.getWidgetInstance("selectId"), "Widget with id selectId not found");
            this.assertNotUndefined(this.getWidgetInstance("areaId"), "Widget with id areaId not found");
            this.assertNotUndefined(this.getWidgetInstance("inputId"), "Widget with id inputId not found");
            this.end();
        }
    }
});

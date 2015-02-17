Aria.classDefinition({
    $classpath : "test.aria.templates.issue1413.RefreshDisposedTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.TemplateCtxt"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.issue1413.RefreshTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.templates.RefreshManager.stop();
            this.templateCtxt._tpl.$refresh();
            Aria.disposeTemplate(this.testDiv);
            aria.templates.RefreshManager.resume();
            this.end();
        }
    }
});

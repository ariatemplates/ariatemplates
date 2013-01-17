Aria.classDefinition({
    $classpath : "test.aria.widgets.form.autocomplete.issue315.Handler",
    $implements : ["aria.resources.handlers.IResourcesHandler"],
    $templates : ["aria.widgets.form.list.templates.LCTemplate", "aria.widgets.form.list.templates.ListTemplate"],
    $dependencies : ["aria.widgets.form.list.templates.ListTemplateScript"],
    $prototype : {

        getSuggestions : function (text, cb) {
            this.$callback(cb, [text, text]);
        },

        getDefaultTemplate : function () {
            return "aria.widgets.form.list.templates.LCTemplate";
        },

        suggestionToLabel : function (text) {
            return text;
        },

        getAllSuggestions : function (cb) {
            this.$callback(cb, []); // the point of this test: handler returns empty suggestion list
            // logging a message to make sure the method has actually been called
            this.$logInfo("OpenDropDownFromButtonTest handler message");
        }
    }
});

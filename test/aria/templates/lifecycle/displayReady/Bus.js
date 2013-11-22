Aria.classDefinition({
    $classpath : "test.aria.templates.lifecycle.displayReady.Bus",
    $singleton : true,
    $prototype : {
        messages : [],

        send : function (message) {
            this.messages.push(message);
        }
    }
});

Aria.classDefinition({
    $classpath : "test.aria.core.test.MyFlow",
    $extends : "aria.templates.FlowCtrl",
    $constructor : function () {
        this.$FlowCtrl.constructor.call(this);
    },
    $prototype : {
        onSearchCallBegin : function (info) {
            info.returnValue = 'intercepted by onSearchCallBegin';
            info.cancelDefault = true;
            return info;
        },

        onResetCallEnd : function (info) {
            info.returnValue = 'intercepted by onResetCallEnd';
            return info;
        }
    }
});

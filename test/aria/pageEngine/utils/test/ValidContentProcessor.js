Aria.classDefinition({
    $classpath : "test.aria.pageEngine.utils.test.ValidContentProcessor",
    $constructor : function () {

    },
    $destructor : function () {
        this._converter = null;
    },
    $prototype : {

        processContent : function (str) {
            return str;
        }
    }
});

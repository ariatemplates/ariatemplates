Aria.tplScriptDefinition({
    $classpath : "test.aria.utils.dragdrop.ScrollIntoViewDragTestTemplateScript",
    $dependencies : ["aria.utils.Mouse", "aria.utils.dragdrop.Drag"],
    $destructor : function () {
        this._dragFive.$dispose();
        this._dragTen.$dispose();
    },
    $prototype : {
        $displayReady : function () {
            this._dragFive = new aria.utils.dragdrop.Drag("constrained-draggable5", {
                cursor : "move",
                proxy : {
                    type : "CloneOverlay"
                },
                constrainTo : "first-boundary"
            });
            this._dragTen = new aria.utils.dragdrop.Drag("constrained-draggable10", {
                cursor : "move",
                proxy : {
                    type : "CloneOverlay"
                },
                constrainTo : "second-boundary"
            });
        }
    }
});

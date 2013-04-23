/*
 * Copyright Amadeus
 */
Aria.tplScriptDefinition({
    $classpath : "test.aria.templates.issue460.OnscrollScript",
    $implements : ["aria.core.Browser", "aria.utils.Dom"],
    $prototype : {
        onScroll : function (event) {
            event.preventDefault(true);
            var horizontal = aria.utils.Dom.getElementById("horizontal");
            horizontal.innerHTML = aria.utils.Dom.getElementById("touchMe").scrollLeft;
            aria.utils.Json.setValue(this.data, "horizontal", aria.utils.Dom.getElementById("touchMe").scrollLeft);
            var vertical = aria.utils.Dom.getElementById("vertical");
            vertical.innerHTML = aria.utils.Dom.getElementById("touchMe").scrollTop;
            aria.utils.Json.setValue(this.data, "vertical", aria.utils.Dom.getElementById("touchMe").scrollTop);
        }
    }
});

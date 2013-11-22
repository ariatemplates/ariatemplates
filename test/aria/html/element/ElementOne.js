Aria.classDefinition({
    $classpath : "test.aria.html.element.ElementOne",
    $extends : "aria.html.Element",
    $constructor : function (cfg, ctxt, lineNumber) {
        var listeners = cfg.on;
        this._chainListener(listeners, "notInThere", {
            b : "b"
        });
        this._chainListener(listeners, "keydown", {
            c : "c"
        });
        this._chainListener(listeners, "keydown", {
            d : "d"
        }, true);
        this._chainListener(listeners, "mousedown", {
            e : "e"
        }, true);
        this._chainListener(listeners, "coffee", {
            f : "f"
        }, false);

        this.$Element.constructor.apply(this, arguments);
    },
    $prototype : {
        $normCallback : function (a) {
            return a;
        }
    }
});

{Template {
  $classpath : "test.aria.utils.dragdrop.DragTestTemplate",
  $css : ["test.aria.utils.dragdrop.TemplateDialogSkin", "test.aria.utils.dragdrop.DragDropCSS"]
} }

  {macro main ( )}
    <div id = "dialog-container">
        <div id = "dialog-title">
            <span id="dialog-title-dialog-message">Handle</span>
        </div>
        <div id="dialog-message">
            <p>Drag me from the handle</p>
        </div>

    </div>
    <div id="first-boundary", class="boundary">
        <div id="constrained-draggable" class="constrained-draggable-class">You cannot drag me too far...</div>
        <div id="free-draggable" class="constrained-draggable-class">You can drag me anywhere</div>
    </div>
    <div id="second-boundary", class="boundary">
        <div id="vertical-draggable" class="constrained-draggable-class">You can drag me only vertically</div>
    </div>
    <div id="third-boundary", class="boundary">
        <div id="horizontal-draggable" class="constrained-draggable-class">You can drag me only horizontally</div>
    </div>

{/macro}

{/Template}
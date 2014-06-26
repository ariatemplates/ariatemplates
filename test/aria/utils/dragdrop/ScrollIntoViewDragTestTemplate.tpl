/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

{Template {
  $classpath : "test.aria.utils.dragdrop.ScrollIntoViewDragTestTemplate",
  $css : ["test.aria.utils.dragdrop.ScrollIntoViewDragDropCSS"],
  $hasScript : true
} }

  {macro main ( )}

    <div id="first-boundary", class="boundary1">
        <div id="constrained-draggable1" class="constrained-draggable-class1">Drag One</div>
        <div id="constrained-draggable2" class="constrained-draggable-class1">Drag Two</div>
        <div id="constrained-draggable3" class="constrained-draggable-class1">Drag Three</div>
        <div id="constrained-draggable4" class="constrained-draggable-class1">Drag Four</div>
        <div id="constrained-draggable5" class="constrained-draggable-class1">Drag Five</div>
    </div>

    <div id="second-boundary", class="boundary2">
        <div id="constrained-draggable6" class="constrained-draggable-class2">Drag One</div>
        <div id="constrained-draggable7" class="constrained-draggable-class2">Drag Two</div>
        <div id="constrained-draggable8" class="constrained-draggable-class2">Drag Three</div>
        <div id="constrained-draggable9" class="constrained-draggable-class2">Drag Four</div>
        <div id="constrained-draggable10" class="constrained-draggable-class2">Drag Five</div>
    </div>

{/macro}

{/Template}

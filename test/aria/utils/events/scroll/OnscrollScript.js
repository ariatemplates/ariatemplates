/*
 * Copyright 2013 Amadeus s.a.s.
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

Aria.tplScriptDefinition({
    $classpath : "test.aria.utils.events.scroll.OnscrollScript",
    $implements : ["aria.utils.Dom"],
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

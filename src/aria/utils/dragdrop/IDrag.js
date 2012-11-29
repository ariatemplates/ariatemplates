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

Aria.interfaceDefinition({
    $classpath : "aria.utils.dragdrop.IDrag",
    $interface : {
        /**
         * Start of drag event.
         * @param {Object} coordinates X and Y coordinates of the initial mouse position
         */
        start : {
            $type : "Function"
        },

        /**
         * Drag move event.
         * @param {aria.DomEvent} evt Move event
         */
        move : {
            $type : "Function"
        },

        /**
         * End of drag event.
         */
        end : {
            $type : "Function"
        }
    },
    $events : {
        "dragstart" : "Occurs when the user starts drag operation",
        "move" : "Occurs when the user moves the draggable element",
        "dragend" : "Occurs when the user ends drag operation",
        "beforeresize" : "Occurs when the user starts resize operation",
        "resize" : "occurs when the user resizing element",
        "resizeend" : "Occurs when the user ends resize"
    }
});

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

Aria.classDefinition({
    $classpath : "test.aria.tools.contextualMenu.ContextualMenuHelper",
    $singleton : true,
    $dependencies : ["aria.tools.contextual.ContextualMenu", "aria.DomEvent", "aria.utils.Dom"],
    $constructor : function () {
        this.contextualMenu = aria.tools.contextual.ContextualMenu;
    },
    $destructor : function () {
        this.contextualMenu = null;
    },
    $prototype : {

        createEvent : function (eventName, domElt) {
            var event = aria.DomEvent.getFakeEvent(eventName, domElt);
            event.stopPropagation = function () {};
            event.preventDefault = function () {};
            event.ctrlKey = true;
            event.button = 2;
            var geom = aria.utils.Dom.getGeometry(domElt);
            event.clientX = Math.floor(geom.x + geom.width / 2);
            event.clientY = Math.floor(geom.y + geom.height / 2);
            return event;
        },

        sendCtrlRightClick : function (target) {
            // FireDomEvents and Syn are unable to simulate a contextmenu event, so let's test it
            // differently
            var event;
            if (aria.core.Browser.isSafari) {
                event = this.createEvent("mouseup", target);
                this.contextualMenu._onSafariMouseUp(event);
                event.$dispose();
            }
            event = this.createEvent("contextmenu", target);
            this.contextualMenu._onContextMenu(event);
            event.$dispose();
        },

        assertContextualMenu : function (testCase, templateCtxt) {
            testCase.assertTrue(this.contextualMenu._popup != null, "_popup == null");
            testCase.assertTrue(this.contextualMenu.targetTemplateCtxt == templateCtxt, "invalid targetTemplateCtxt");
        },

        assertNoContextualMenu : function (testCase) {
            testCase.assertTrue(this.contextualMenu._popup == null, "_popup != null");
            testCase.assertTrue(this.contextualMenu.targetTemplateCtxt == null, "targetTemplateCtxt should be null");

        }
    }
});

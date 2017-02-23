/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.templates.binding.recursiveBindingLeak.RecursiveBindingLeakTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            this.template = this.templateCtxt._tpl;
            this.data = this.template.data;
            this.json = this.template.$json;
            this.checkListenerAriaParents();
            this.template.triggerRefresh();
            this.checkListenerAriaParents();
            this.template.triggerRefresh();
            this.checkListenerAriaParents();
            this.end();
        },

        checkListeners : function (listeners) {
            var length = listeners.length;
            this.assertUndefined(listeners[this.json.OBJECT_PARENT_PROPERTY]);
            this.assertEquals(length, 1, "Expected exactly %2 listener, found %1.");
            for (var i = 0; i < length; i++) {
                var curListener = listeners[i];
                this.assertUndefined(curListener[this.json.OBJECT_PARENT_PROPERTY]);
            }
        },

        checkListenerAriaParents : function () {
            this.checkListeners(this.data[this.json.META_FOR_LISTENERS + "_someAttribute"]);
            this.checkListeners(this.data[this.json.META_FOR_RECLISTENERS + "_someAttribute"]);
        }
    }
});

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

Aria.classDefinition({
    $classpath : "test.aria.dom.getid.GetIdTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            var tpl = this.templateCtxt._tpl;
            var id = tpl.$getId("myDivId");
            var item = aria.utils.Dom.getElementById(id);
            this.assertTrue(item.innerHTML == "hello");
            var label = item.nextSibling;
            var forAttribute = label.attributes["for"].value;
            var myInput = aria.utils.Dom.getElementById(forAttribute);
            this.assertTrue(myInput.tagName == "INPUT");
            this.notifyTemplateTestEnd();
        }
    }
});
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
	$classpath : 'test.aria.templates.TemplateContextTest',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ['aria.utils.Dom', 'aria.templates.TemplateCtxt', 'aria.templates.Layout',
			'aria.templates.CfgBeans', 'aria.templates.DomElementWrapper'],
	$prototype : {

		testGetChild : function () {
			var document = Aria.$window.document;
			var parent = document.createElement("div"), child = document.createElement("p"), join = parent.appendChild(child);
			parent.setAttribute('id', 'test');
			document.body.appendChild(parent);

			var tc = new aria.templates.TemplateCtxt();
			var f1 = tc.$getChild("test"), f2 = tc.$getChild("test", 0), f3 = tc.$getChild("test", 1), f4 = tc.$getChild("te_st", 1);
			this.assertTrue(f1 == null);
			this.assertTrue(typeof f2 == "object");
			this.assertTrue(f3 == null);
			this.assertTrue(f4 == null);
			tc.$dispose();

			document.body.removeChild(parent);
		}
	}
})
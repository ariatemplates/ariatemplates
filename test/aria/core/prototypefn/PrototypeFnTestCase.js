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
    $classpath : 'test.aria.core.prototypefn.PrototypeFnTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ['aria.templates.CSSMgr', 'aria.utils.Type','test.aria.core.prototypefn.ClassB'],
    $constructor : function () {
        this.defaultTestTimeout = 10000;
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : function () {
        var closureVar = true, cssMgr = aria.templates.CSSMgr, type = aria.utils.Type;
        return {
            runTemplateTest : function () {
                this.assertTrue(true, "classDefinition $prototype not accepts function");
                this._checkTplClassDef();
            },
            _checkTplClassDef : function () {
                this.assertTrue(this.templateCtxt.data.isTrue, "TplScriptDefinition $prototype not accepts function");
                this.assertTrue(closureVar);
                this._checkClosure();
            },
            _checkClosure : function () {
                this.assertTrue(closureVar);
                this._checkShortcutDependecies();
            },
            _checkShortcutDependecies : function () {
                this.assertTrue(cssMgr.$classpath == "aria.templates.CSSMgr");
                this.assertTrue(type.$classpath == "aria.utils.Type");
                this._checkBrowserDependentExec();
            },
            _checkBrowserDependentExec : function () {
                this.assertTrue(this.templateCtxt.data.count == 1);
                var mydiv1 = aria.utils.Dom.getElementById('mydiv1');
                this.synEvent.click(mydiv1, {
                    fn : this._afterHandler,
                    scope : this
                });
            },
            _afterHandler : function () {
                this.assertTrue(this.templateCtxt.data.count == 1, "Browser dependent code executed more than once");
                this._checkPrototypeAcceptMap();
            },
            _checkPrototypeAcceptMap : function () {
                this.assertTrue(this.templateCtxt.data.isset, "$prototype accept map");
        var obj = new test.aria.core.prototypefn.ClassB();
        this.assertTrue(obj.getBaseClassVal());
        obj.$dispose();
                this.notifyTemplateTestEnd();
            }
        };
    }
});
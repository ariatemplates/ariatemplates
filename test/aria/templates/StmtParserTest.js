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
	$classpath : 'test.aria.templates.StmtParserTest',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ['aria.templates.TplClassGenerator'],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testAsyncParseTemplateErrors : function () {
			var toTest = [{
				tpl : "{Template {$classpath: 'test.aria.templates.test.StmtTemplate'}}{macro main()}{/macro}{/Template}"
			}, {
				tpl : "{Template {$classpath: 'test.aria.templates.test.StmtTemplate'}}{macro main() }{/macro}{/Template}"
			}, {
				tpl : "{Template {$classpath: 'test.aria.templates.test.StmtTemplate'}}{macro main ()}{/macro}{/Template}"
			},{
				tpl : "{Template {$classpath: 'test.aria.templates.test.StmtTemplate'}}{macro main () }{/macro}{/Template}"
			}];

			var seq = new aria.core.Sequencer();
			var sz = toTest.length;
			for (var i = 0; i < sz; i++) {
				seq.addTask({
					name : "testAsyncParseTemplate" + i,
					fn : this._taskParseTemplate,
					scope : this,
					args : toTest[i],
					asynchronous : true
				});
			}
			seq.$on({
				scope : this,
				end : this._taskParseTemplateEnd
			});
			seq.start();
		},

		_taskParseTemplate : function (task, args) {
			var cg = aria.templates.TplClassGenerator;
			cg.parseTemplate(args.tpl, true, {
				fn : this._parseTemplateResponse,
				scope : this,
				args : {
					task : task
				}
			});
		},

		_parseTemplateResponse : function (res, args) {
			var task = args.task;
			this.assertFalse(res.classDef == null);
			this.assertLogsEmpty();
			task.taskMgr.notifyTaskEnd(task.id);
		},
		_taskParseTemplateEnd : function (evt) {
			evt.src.$dispose();
			this.notifyTestEnd("testAsyncParseTemplateErrors");
		}

	}
});

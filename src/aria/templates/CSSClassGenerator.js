/**
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
/**
 * Generate the class definition for a CSS Template
 * @class aria.templates.CSSClassGenerator
 * @extends aria.templates.ClassGenerator
 */
Aria.classDefinition({
	$classpath : 'aria.templates.CSSClassGenerator',
	$extends : 'aria.templates.ClassGenerator',
	$singleton : true,
	$dependencies : ['aria.templates.CSSParser'],
	$constructor : function () {
		this.$ClassGenerator.constructor.call(this);

		// Load the Template specific statements
		this.$ClassGenerator._loadStatements.call(this, ["CSSTemplate", "macro", "call"]);

		// Redefine the protected parser
		this._parser = aria.templates.CSSParser;

		// Redefine the class used as the parent for templates which do not inherit from any other template
		this._superClass = "aria.templates.CSSTemplate";

		this._classType = "CSS";
		this._rootStatement = "CSSTemplate";
		this._templateParamBean = "aria.templates.CfgBeans.CSSTemplateCfg";
	},
	$prototype : {}
});
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
 * A TxtCtxt object is the interface toward an Aria text template. TxtCtxt is used to generate and initialize a text
 * template
 * @class aria.templates.TxtCtxt
 * @extends aria.templates.BaseCtxt
 * @implements aria.templates.IBaseTemplate
 */
Aria.classDefinition({
	$classpath : 'aria.templates.TxtCtxt',
	$extends : "aria.templates.BaseCtxt",
	$implements : ['aria.templates.IBaseTemplate'],
	$constructor : function (classPath) {
		this.$BaseCtxt.constructor.apply(this, arguments);

		/**
		 * Classpath of the Text Template
		 * @type String
		 */
		this.tplClasspath = null;

	},

	$destructor : function () {
		if (this._tpl) {
			try {
				this._tpl.$dispose();
			} catch (e) {
				this.$logError(this.TEMPLATE_DESTR_ERROR, [this.tplClasspath], e);
			}
			// dispose the template interface wrapper as well:
			aria.templates.IBaseTemplate.prototype.$destructor.call(this._tpl);
			this._tpl = null;
		}

		this.$BaseCtxt.$destructor.call(this);
	},
	$prototype : {
		/**
		 * Init the text template with the given configuration.
		 * @param {aria.templates.CfgBeans.InitTxtTemplateCfg} cfg Template context configuration
		 * @return {Boolean} true if there was no error
		 */
		initTemplate : function (cfg) {

			if (!aria.core.JsonValidator.normalize({
				json : cfg,
				beanName : "aria.templates.CfgBeans.InitTxtTemplateCfg"
			})) {
				return false;
			}

			this._cfg = cfg;

			// Get an instance of the text template
			var tpl;
			try {
				tpl = Aria.getClassInstance(cfg.classpath);
			} catch (e) {
				this.$logError(this.TEMPLATE_CONSTR_ERROR, [cfg.classpath], e);
				return false;
			}
			this._tpl = tpl;

			this.tplClasspath = cfg.classpath;

			// We no longer create new methods in a closure each time a new instance of a template is created,
			// instead we use the interface mechanism to expose methods to the template and prevent access to the
			// template context
			aria.templates.IBaseTemplate.call(tpl, this);

			// TEMPORARY PERF IMPROVMENT : interface on these two functions results in poor performances.
			// Investigation ongoing on interceptors

			var oSelf = this;

			tpl.__$write = function (text) {
				return oSelf.__$write.call(oSelf, text);
			};

			if (!tpl.__$initTemplate()) {
				return false;
			}
			tpl.data = cfg.data;
			return true;
		},

		/**
		 * Get the text template content by calling the main macro of the text template to which the context is
		 * associated. It is called by the processTextTemplate method of the TextTemplate constructor
		 * @return {String}
		 */
		getTextTemplateContent : function () {
			this.$assert(19, this._out == null);
			this._out = [];
			this._callMacro(this._out, "main");
			var stringToReturn = this._out.join("");
			this._out = null;
			return stringToReturn;
		},

		/**
		 * Write some text. This method is intended to be called only from the generated code of templates (created in
		 * aria.templates.ClassGenerator) and never directly from developer code. A call to this method is generated for
		 * simple text in templates and for ${...} statements.
		 * @param {Array} text Text to write.
		 * @private
		 * @implements aria.templates.IBaseTemplate
		 */
		__$write : function (text) {
			this._out.push(text);
		}
	}
});
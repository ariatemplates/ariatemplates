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
 * Script for highlight display
 * @class aria.tools.inspector.InspectorDisplayScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.inspector.InspectorDisplayScript',
	$prototype : {
		/**
		 * Highlight a template in the application on mouseover
		 * @param {Object} event
		 * @param {Object} template description
		 */
		tplMouseOver : function (event, template) {
			this.moduleCtrl.displayHighlight(template.templateCtxt.getContainerDiv());
			this.data.overModuleCtrl = template.moduleCtrl;
			this.mouseOver(event);
			this._refreshModulesDisplay();
			// prevent propagation
			event.stopPropagation();
		},

		/**
		 * Remove highlight from a template link on mouseout
		 * @param {Object} event
		 */
		tplMouseOut : function (event, template) {
			// this.moduleCtrl.clearHighlight();
			this.data.overModuleCtrl = null;
			this.mouseOut(event);
			this._refreshModulesDisplay();
			// prevent propagation
			event.stopPropagation();
		},

		/**
		 * Highlight the template associated with a module
		 * @param {Object} event
		 * @param {Object} module description
		 */
		moduleMouseOver : function (event, module) {
			this.data.overTemplates = module.outerTemplateCtxts;
			this.mouseOver(event);
			this._refreshTemplatesDisplay();
			// prevent propagation
			event.stopPropagation();
		},

		/**
		 * Remove for highlights for a module
		 * @param {Object} event
		 */
		moduleMouseOut : function (event) {
			// this.moduleCtrl.clearHighlight();
			this.data.overTemplates = null;
			this.mouseOut(event);
			this._refreshTemplatesDisplay();
			// prevent propagation
			event.stopPropagation();
		},

		/**
		 * Highlight an element on mouseover
		 * @param {Object} event
		 */
		mouseOver : function (event) {
			event.target.setStyle("background:#DDDDDD;");
		},

		/**
		 * Remove highlight of element on mouseout
		 * @param {Object} event
		 */
		mouseOut : function (event) {
			event.target.setStyle("");
		},

		/**
		 * Display details regarding a given template
		 * @param {Object} event
		 * @param {Object} template
		 */
		selectTemplate : function (event, template) {
			this.data.selectedTemplate = template;
			this.$refresh();
		},

		/**
		 * Display details regarding a given module
		 * @param {Object} event
		 * @param {Object} template
		 */
		selectModule : function (event, module) {
			this.data.selectedModule = module;
			this.$refresh();
		},

		/**
		 * Call the module controller to reload a given template instance
		 * @param {Object} event
		 * @param {Object} template
		 */
		reloadTemplate : function (event, template) {
			this.moduleCtrl.reloadTemplate(template.templateCtxt);
		},

		/**
		 * Call the module controller to refresh a given template
		 * @param {Object} event
		 * @param {Object} template
		 */
		refreshTemplate : function (event, template) {
			this.moduleCtrl.refreshTemplate(template.templateCtxt);
		},

		/**
		 * Act on module event
		 * @param {Object} event
		 */
		onModuleEvent : function (event) {
			if (event.name == "contentChanged") {
				this.$refresh();
			}
		},

		/**
		 * Refresh the list of modules only.
		 */
		_refreshModulesDisplay : function () {
			this.$refresh({
				filterSection : "modules",
				macro : {
					name : "displayModules",
					args : [this.data.modules]
				}
			});
		},

		/**
		 * Refresh the list of templates only.
		 */
		_refreshTemplatesDisplay : function () {
			this.$refresh({
				filterSection : "templates",
				macro : {
					name : "displayTemplates",
					args : [this.data.templates]
				}
			});
		}
	}
});
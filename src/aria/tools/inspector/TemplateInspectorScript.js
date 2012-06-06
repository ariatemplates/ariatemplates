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
 * Script for template display interactions
 * @class aria.tools.inspector.TemplateInspectorScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.inspector.TemplateInspectorScript',
	$prototype : {

		/**
		 * Highlight a widget in the application on mouseover
		 * @param {Object} event
		 * @param {Object} widgetDesc description
		 */
		widgetMouseOver : function (event, widgetDesc) {
			var widget = widgetDesc.widget;
			var domElt = widget.getDom();
			if (domElt) {
				this.moduleCtrl.displayHighlight(domElt, "#FF6666");
			}
			this.mouseOver(event);
			event.stopPropagation();
		},

		/**
		 * Remove highlight from a widget link on mouseout
		 * @param {Object} event
		 */
		widgetMouseOut : function (event) {
			this.mouseOut(event);
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
		 * Display widget details
		 * @param {Object} widgetDesc
		 */
		displayWidgetDetails : function (event, widgetDesc) {
			this.data.selectedWidget = widgetDesc;
			this.$refresh({
				filterSection : "widgets"
			});
		},

		/**
		 * Call the module controller to reload a given template instance
		 * @param {Object} event
		 */
		reloadTemplate : function (event) {
			this.moduleCtrl.reloadTemplate(this.data.templateCtxt);
		},

		/**
		 * Reload source using content from editable source
		 */
		reloadTemplateWithSrc : function () {
			this.moduleCtrl.reloadTemplate(this.data.templateCtxt, true);
		},

		/**
		 * Call the module controller to refresh a given template
		 * @param {Object} event
		 */
		refreshTemplate : function (event) {
			this.moduleCtrl.refreshTemplate(this.data.templateCtxt);
		},

		/**
		 * Act on module event
		 * @param {Object} event
		 */
		onModuleEvent : function (event) {

		},

		/**
		 * Change visibility of source, and retrieve it if not available
		 * @param {aria.DomEvent} event
		 */
		toggleSource : function (event) {
			this.data.showSource = !this.data.showSource;
			if (this.data.showSource) {
				this.data.initialSource = true;
				var filePath = this.data.templateCtxt.tplClasspath.replace(/\./g, "/") + ".tpl";
				this.data.source = this.moduleCtrl.getSource(filePath).value;
			}
			this.$refresh();
		},

		/**
		 * Edit source code of template
		 * @param {aria.DomEvent} event
		 */
		editSource : function (event) {
			if (this.data.initialSource) {
				aria.utils.Json.setValue(this.data, "initialSource", false);
				this.$refresh({
					filterSection : "controls",
					macro : {
						name : "displayControls"
					}
				});
			}
			this.data.tplSrcEdit = event.target.getValue();
		},

		/**
		 * Refresh the list of widgets only.
		 */
		_refreshWidgetsDisplay : function () {
			this.$refresh({
				filterSection : "widgets"
			});
		}
	}
});
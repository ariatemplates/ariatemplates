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
 * Script for module display interactions
 * @class aria.tools.inspector.ModuleInspectorScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.inspector.ModuleInspectorScript',
	$prototype : {

		$dataReady : function () {
			if (!this.data["view:dataDepth"]) {
				this.data["view:dataDepth"] = 3;
			}
		},

		/**
		 * Call the module controller to reload a given module instance
		 * @param {Object} event
		 */
		reloadModule : function () {
			this.moduleCtrl.reloadModule(this.data.moduleCtrl);
		},

		/**
		 * Act on module event
		 * @param {Object} event
		 */
		onModuleEvent : function (event) {

		}

	}
});
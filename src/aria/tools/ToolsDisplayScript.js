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
 * Script for main tools display
 * @class aria.tools.ToolsDisplayScript
 */
Aria.tplScriptDefinition({
	$classpath : 'aria.tools.ToolsDisplayScript',
	$prototype : {

		$dataReady : function () {
			if (this.moduleCtrl.subModulesList.length > 0) {
				this.moduleCtrl.subModulesList[0]["view:selected"] = true;
			}
		},

		/**
		 * Act on module event
		 * @param {Object} event
		 */
		onModuleEvent : function (event) {
			this.$refresh();
		},

		/**
		 * Select targeted tool tab
		 * @param {aria.DomEvent} event
		 * @param {String} refPath
		 */
		selectTab : function (event, refPath) {
			var list = this.moduleCtrl.subModulesList;
			for (var index = 0, l = list.length; index < l; index++) {
				if (list[index].refpath == refPath) {
					list[index]["view:selected"] = true;
				} else {
					list[index]["view:selected"] = false;
				}
			}
			this.$refresh();
		}

	}
});
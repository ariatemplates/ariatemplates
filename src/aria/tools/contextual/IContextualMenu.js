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
 * Interface for aria.tools.ContextualMenu to be accessible from outside the framework, when developping tools to debug
 * or customize Aria Templates applications.
 * @class aria.tools.contextual.IContextualMenu
 */
Aria.interfaceDefinition({
	$classpath : 'aria.tools.contextual.IContextualMenu',
	$interface : {
		/**
		 * Close the contextual menu
		 */
		close : "Function",
		
		/**
		 * open the contextual menu
		 */
		open : "Function",

		/**
		 * Start the tools module with a template context to inspect
		 */
		openTools : "Function"
	}
});

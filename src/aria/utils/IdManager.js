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
 * Handle Id generation
 * @class aria.utils.IdManager
 */
Aria.classDefinition({
	$classpath : 'aria.utils.IdManager',
	$dependencies : ['aria.utils.Array'],

	/**
	 * Constructor
	 * @param {String} prefix
	 */
	$constructor : function (prefix) {
		/**
		 * Map of free ids
		 * @protected
		 * @type Object
		 */
		this._freeIdMap = {};

		/**
		 * Counter for ids when none is free
		 * @protected
		 * @type Number
		 */
		this._idCounter = 0;

		/**
		 * Prefix for the ids
		 * @type String
		 */
		this.prefix = prefix || "";

	},
	$destructor : function () {
		this._freeIdMap = null;
	},
	$prototype : {

		/**
		 * Create a unique id. Either reuse an existing reusable id or create a new one if none exist.
		 */
		getId : function () {
			for (var i in this._freeIdMap) {
				if (!this._freeIdMap.hasOwnProperty(i)) {
					continue;
				}
				delete this._freeIdMap[i];
				return i;
			}
			
			var id = this.prefix + this._idCounter;
			this._idCounter++;
			return id;
		},

		/**
		 * Release an id (register it to be reused).
		 * @param {String} id
		 */
		releaseId : function (id) {
			if (id) {
				this._freeIdMap[id] = true;
			}
		}
	}
});
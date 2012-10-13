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

/**
 * Mock module controller used by test cases in test.aria.jsunit
 */
Aria.classDefinition({
	$classpath : 'test.aria.jsunit.mock.MockModule',
	$extends : 'aria.templates.ModuleCtrl',
	$implements : ['test.aria.jsunit.mock.IMockModule'],
	$dependencies : ['test.aria.jsunit.mock.MockMsgHandler', 'aria.modules.RequestMgr'],
	$constructor : function () {
		this.$ModuleCtrl.constructor.call(this);

		this._data = {}
		// comment the following line to deactivate ghost mode
		aria.core.IOFiltersMgr.addFilter('test.aria.jsunit.mock.MockMsgHandler');
	},
	$destructor : function () {
		aria.core.IOFiltersMgr.removeFilter('test.aria.jsunit.mock.MockMsgHandler');
		this.$ModuleCtrl.$destructor.call(this);
	},
	$prototype : {
		$publicInterfaceName : "test.aria.jsunit.mock.IMockModule",

		/**
		 * Module init - initialize the data model and other stuf...
		 * @param {Object} args init argument
		 * @param {aria.core.JsObject.Callback} cb callback method
		 */
		init : function (args, cb) {
			var d = this._data
			d.command = {
				value : 'ANPARNCE'
			}
			d.lastCommands = [] // list of previous commands - index 0 = most recent command
			d.responses = [] // list of previous responses - index 0 = oldest response

			this.$callback(cb);
		},

		/**
		 * Processes the command contained in the data model, sending the request to an appropriate address
		 * @param {String} url the address to which the request must be sent
		 * @param {aria.core.JsObject.Callback} cb callback
		 */
		processCommand : function (url, cb) {
			// TODO this method must accept a callback
			var d = this._data.command
			// TODO: validation

			// prepare the JSON request
			var jsr = {
				command : this._data.command.value,
				address : url
			}
			// this.json.alert(jsr) // debug info!

			// submit
			// this.submitJsonRequest("processCommand",jsr,"_processCommandResponse")
			this.submitJsonRequest("processCommand", jsr, cb)
		},

		/**
		 * Internal callback to handle processCommand response
		 * @param {Object} res the server response
		 */
		_processCommandResponse : function (res) {
			var d = this.json.load(res.data, this);
			if (!d || !d.result) {
				return; // no data - error already logged
			}
			// update data model
			this._data.responses.push(d.result)
			// this.json.alert(this._data) // debug info!

			this.$raiseEvent('responseReceived');
		}
	}
})

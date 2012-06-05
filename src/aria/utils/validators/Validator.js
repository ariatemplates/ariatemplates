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
 * Base class for framework-provided validators, which support one error message specified outside of the validator.
 */
Aria.classDefinition({
	$classpath : "aria.utils.validators.Validator",
	$dependencies : ['aria.utils.Data'],
	$implements : ['aria.utils.validators.IValidator'],
	$extends : "aria.core.JsObject",
	$constructor : function (message) {
		
		/**
		 * Default message sent by this validator
		 * @type Object
		 */
		this.message = null;

		/**
		 * String localized message for this validator
		 * @type String
		 */
		this.localized_message = null;

		if (message) {
			this.setMessage(message);
		} else {
			this.setMessage(this.DEFAULT_LOCALIZED_MESSAGE);
		}
		this.groups = [];
		this.eventToValidate = "onsubmit";
	},
	$destructor : function () {
		this.message = null;
		this.groups = null;
		this.eventToValidate = null;
	},
	$statics : {
		/**
		 * Default localized message for this validator
		 * @type String
		 */
		DEFAULT_LOCALIZED_MESSAGE : "Incorrect value."
	},
	$prototype : {

		/**
		 * Prototype init method called at prototype creation time Allows to store class-level objects that are shared
		 * by all instances
		 * @param {Object} p the prototype object being built
		 * @param {Object} def the class definition
		 */
		$init : function (p, def) {
			p.utilsType = aria.utils.Type;
		},

		/**
		 * validate will always fail by default.
		 * @param {String} value
		 * @return {Object}
		 */
		validate : function (value) {
			/* to be overriden in sub-classes */
			return this._validationFailed();
		},

		/**
		 * Sets the message if there is one otherwise set the message.
		 * @param {String|Object}msg
		 */
		setMessage : function (msg) {
			if (this.utilsType.isObject(msg)) {
				this.message = msg;
				this.localized_message = msg.localizedMessage;
			} else if (this.utilsType.isString(msg)) {
				this.localized_message = msg;
				this.message = aria.utils.Data.createMessage(msg);
			}
		},

		/**
		 * Returns a copy of the message.
		 * @return {Array}
		 */
		_validationFailed : function () {
			return [aria.utils.Json.copy(this.message)];
		},

		/**
		 * Added for future use cases where a success message structure maybe needed.
		 * @return {Object}
		 */
		_validationSucceeded : function () {
			return null;
		}
	}
});
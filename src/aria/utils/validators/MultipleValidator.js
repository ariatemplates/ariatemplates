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
 * Handles a stack of validators.
 * @classpath aria.utils.MultipleValidator
 * @extends aria.utils.validators.Validator
 */
Aria.classDefinition({
	$classpath : 'aria.utils.validators.MultipleValidator',
	$extends : 'aria.utils.validators.Validator',
	$dependencies : ['aria.utils.Array', 'aria.utils.Data'],
	$constructor : function (message, groups, event) {
		this.$Validator.constructor.call(this, message);
		this.validators = [];
		this.breakOnMessage = false;
		this.groupMessages = (message != null);
		this.groups = (groups != null) ? groups : [];
		this.eventToValidate = (event != null) ? event : "onsubmit";
		this.dataUtils = aria.utils.Data;
		/**
		 * type : "ERROR", code : "Code2", localizedMessage : "The last name is incorrect."
		 */
	},
	$destructor : function () {
		this.breakOnError = null;
		this.groupMessages = null;
		this.validators = null;
		this.$Validator.$destructor.call(this);
	},
	$prototype : {
		/**
		 * loops through each validator within the multiple validator and calls it's validate method.
		 * 
		 * @param {String} value to be validated.
		 * @param {Array} groups to validate against.
		 * @param {String} event that validation occurs on.
		 * @return {Object} res containing any message objects if validation fails.
		 */
		validate : function (value, groups, event) {
			var validators = this.validators;
			if (validators.length) {
				var res;
				var isMember = false;
				for (var i = 0; i < validators.length; i++) {
					isMember = this.dataUtils.checkGroup(validators[i].groups, groups);
					if (isMember && (this.dataUtils.checkEventToValidate(validators[i].eventToValidate, event))) {
						var extraRes = validators[i].validate(value, groups, event);
						if (extraRes && extraRes.length > 0) {
							if (res == null) {
								res = extraRes;
							} else {
								res = res.concat(extraRes);
							}
							if (this.breakOnMessage) {
								break;
							}
						}
					}
				}
				if (res && res.length > 0) {
					if (this.groupMessages) {
						var msgGroup = aria.utils.Json.copy(this.message);
						msgGroup.subMessages = res;
						return [msgGroup];
					} else {
						return res;
					}
				}
				return null;
			}
		},
		/**
		 * adds a validator to this.validators[]
		 * @param {Object} arguments
		 */
		add : function () {
			for (var i = 0, item; item = arguments[i]; i++) {
				if (item.validator && (item.groups || item.event)) {
					this.dataUtils.setValidatorProperties(item.validator, item.groups, item.event);
				}

				if (item.validator) {
					this.validators[this.validators.length] = item.validator;
				} else {
					this.validators[this.validators.length] = item;
				}
			}
		},
		/**
		 * removes a validator from this.validators[]
		 * @param {Object} arguments
		 */
		remove : function () {
			var arrayUtils = aria.utils.Array;
			for (var i = 0, item; item = arguments[i]; i++) {
				arrayUtils.remove(this.validators, item);
			}
		}
	}
});

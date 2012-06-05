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
 * Base interface for module controller interfaces, exposed to templates and parent module controllers.
 * @class aria.templates.IModuleCtrl
 */
Aria.interfaceDefinition({
	$classpath : 'aria.templates.IModuleCtrl',
	$events : {
		"methodCallBegin" : {
			description : "Raised before a method from the module controller public interface is called.",
			properties : {
				method : "Name of the method about to be called."
			}
		},
		"methodCallEnd" : {
			description : "Raised after a method from the module controller public interface has been called.",
			properties : {
				method : "Name of the method which was called."
			}
		},
		"methodCallback" : {
			description : "Raised when a method from the module controller public interface calls its callback.",
			properties : {
				method : "Name of the method which was called."
			}
		},
		"beforeDispose" : {
			description : "Raised when the module controller is about to be disposed or reloaded.",
			properties : {
				reloadingObject : "If the module controller is about to be reloaded, it contains an object which raises an 'objectLoaded' event when the module controller is reloaded."
			}
		}
	},
	$interface : {
		/**
		 * Module initialization method - shall be overridden by sub-classes Note: this method is asynchronous (cf.
		 * callback argument)
		 * @param {Object} initArgs init argument - actual type is defined by the sub-class
		 * @param {aria.core.JsObject.Callback} callback the callback description
		 */
		init : {
			$type : "Function",
			$callbackParam : 1
		},

		/**
		 * Retrieve the module data model.
		 * @return {Object} the module data model
		 */
		getData : function () {},

		/**
		 * Set the data in the dataModel.
		 * @param {Object} data the new Data to set
		 * @param {Boolean} merge If true, existing value in this._data will not be overriden
		 */
		setData : function (data, merge) {},

		/**
		 * Retrieve the module resource set.
		 * @return {JSON object} The module resource set
		 */
		getResourceSet : function () {},

		/**
		 * Retrieve a sub-module data controller.
		 * @param {Object} dataToFind data object which may correspond to the root of a sub-module data controller
		 * @return {Object} the sub-module data controller public interface whose root data model is dataToFind, or
		 * this.$publicInterface() if no sub-module have dataToFind as root data model
		 */
		getSubModuleCtrl : function (dataToFind) {},

		/**
		 * Register a listener to receive events from this module controller.
		 * @param {aria.core.JsObject.Callback} lsn listener to register. Note that JsObject.$callback is not used for
		 * performance and error reporting reasons, so that only the form { fn : {Function}, scope: {Object}, args :
		 * {MultiTypes}} is supported for this callback.
		 */
		registerListener : function (lsn) {},

		/**
		 * Unregister a listener on this object so that it no longer receives events from this module controller.
		 * @param {Object} tpl Scope of the listeners to unregister
		 */
		unregisterListeners : function (scope) {},

		/**
		 * Set this module and submodules session
		 * @param {Object} session object containing paramName and id, the session id
		 */
		setSession : function (session) {}
	}
});
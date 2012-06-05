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
 * Base class for flow controllers.
 * @class aria.templates.FlowCtrl
 */
Aria.classDefinition({
	$classpath : 'aria.templates.FlowCtrl',
	$extends : 'aria.templates.PublicWrapper',
	$implements : ['aria.templates.IFlowCtrl'],
	$dependencies : ['aria.utils.String'],
	$constructor : function () {
		this.$PublicWrapper.constructor.call(this);
	},
	$destructor : function () {
		this.moduleCtrl = null;
		this.data = null;
		this.$PublicWrapper.$destructor.call(this);
	},
	$prototype : {
		/**
		 * Classpath of the interface to be used as the public interface of this flow controller.
		 * @protected
		 * @type {String}
		 */
		$publicInterfaceName : 'aria.templates.IFlowCtrl',

		/**
		 * Interceptor dispatch function.
		 * @param {Object} param interceptor parameters
		 */
		interceptModuleCtrl : function (param) {	
			var methodName = aria.utils.String.capitalize(param.method);
			var fctRef = this["on" + methodName + param.step];
			if (fctRef) {
				return fctRef.call(this, param);
			}
			fctRef = this["on" + param.method + param.step];
			if (fctRef) {	 			
				return fctRef.call(this, param);				 
			}
		},

		/**
		 * Called when the flow controller is initialized, to set the module controller associated to this flow
		 * controller. Note that this is before the module controller init method has been called.
		 * @param {Object} moduleCtrl Public interface of the flow controller.
		 */
		setModuleCtrl : function (moduleCtrl) {
			this.moduleCtrl = moduleCtrl;
		},

		/**
		 * Interceptor on the callback of the init method of the module controller. It is used to set the data property
		 * on the flow controller.
		 */
		oninitCallback : function (param) {
			this.data = this.moduleCtrl.getData();
		}
	}
});
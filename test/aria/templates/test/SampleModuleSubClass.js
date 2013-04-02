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
 * Sample class used to validate the support of sub-classes in Module Controllers
 */
Aria.classDefinition({
	$classpath : "test.aria.templates.test.SampleModuleSubClass",
	$extends : "aria.templates.PublicWrapper",
	$implements : ["test.aria.templates.test.ISampleModuleSubClass"],
	$constructor : function (initArgs) {
		this.$PublicWrapper.constructor.call(this);
		this._initArgs = initArgs;
	},
	$prototype : {
		$publicInterfaceName : "test.aria.templates.test.ISampleModuleSubClass",

		/**
		 * Sample method added to the public interface
		 * @return {Object} the contstructor argument (test purpose)
		 */
		samplePublicMethod : function () {
			return this._initArgs;
		},
		/**
		 * Sample method that should not be visible in the public interface
		 * @return {Number} 123
		 */
		__samplePrivateMethod : function () {
			return 123;
		}
	}
});
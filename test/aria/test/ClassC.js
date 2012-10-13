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
 * Simple class used to test class definition
 */
Aria.classDefinition({
	$classpath : 'test.aria.test.ClassC',
	$extends : 'test.aria.test.ClassB',

	$constructor : function () {
		this.$ClassB.constructor.call(this, "CLASS_C");
		this.propertyC = 'valueC';
		this.count = 1; // override default value
	},

	$destructor : function () {
		this.$ClassB.$destructor.call(this);
		this.propertyC = null; // for test purpose: only object properties should be handled in $destructor
	},

	$prototype : {
		/**
		 * Override ClassA implementation
		 */
		methodA1 : function () {
			// will increment count by 2
			this.count++;
			this.$ClassB.methodA1.call(this);
		},

		/**
		 * Override ClassB implementation
		 * @return {String}
		 */
		methodB2 : function () {
			var res = "mC2-";
			res += this.$ClassB.methodB2.call(this);
			res += "-mC2";
			return res;
		}
	}
});
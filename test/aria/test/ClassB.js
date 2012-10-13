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
	$classpath : 'test.aria.test.ClassB',
	$extends : 'test.aria.test.ClassA',

	$constructor : function (optValueA) {
		this.$ClassA.constructor.call(this, optValueA);
		this.propertyB = 'valueB';
	},

	$destructor : function () {
		this.$ClassA.$destructor.call(this);
		this.propertyB = null; // for test purpose: only object properties should be handled in $destructor
	},

	$prototype : {
		/**
		 * Increment count by 5
		 */
		methodB1 : function () {
			this.count += 4;
			this.$ClassA.methodA1.call(this);
		},

		/**
		 * Use a method defined in parent
		 * @return {String}
		 */
		methodB2 : function () {
			return this.methodA2("mB2-");
		}
	}
});

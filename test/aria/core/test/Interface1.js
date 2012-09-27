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
 * Sample interface definition.
 * @class test.aria.core.test.Interface1
 */
Aria.interfaceDefinition({
	$classpath : "test.aria.core.test.Interface1",
	$events : {
		"MyEventFromInterface1" : "This  event belongs to interface 1."
	},
	$interface : {
		// The $interface section contains empty functions, objects or arrays
		search : function () {},
		reset : function () {},
		myData : "Object",
		myArray : []
	}
});
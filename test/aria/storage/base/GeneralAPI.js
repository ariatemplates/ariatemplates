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

Aria.classDefinition({
	$classpath : "test.aria.storage.base.GeneralAPI",
	$extends : "test.aria.storage.base.BaseTests",
	$prototype : {
		/**
		 * Test how the API work on a single instance
		 */
		testOneInstanceStrings : function () {
			var storage = new this.storageClass();

			// storage should be initially empty
			var value = storage.getItem("some");
			this.assertTrue(value == null, "Storage should be empty initially");

			// set a value
			storage.setItem("some", "a");
			value = storage.getItem("some");
			this.assertEquals(value, "a", "some should be a, got " + value);

			// reset it
			storage.setItem("some", "b");
			value = storage.getItem("some");
			this.assertEquals(value, "b", "some should be b, got " + value);

			// set another value
			storage.setItem("other", "f");
			value = storage.getItem("other");
			this.assertEquals(value, "f", "other should be f, got " + value);

			// it shouldn't change other values
			value = storage.getItem("some");
			this.assertEquals(value, "b", "some should still be b, got " + value);

			// remove one item
			storage.removeItem("some");
			value = storage.getItem("some");
			this.assertTrue(value == null, "some should now be null, got " + value);

			// the other value shouldn't change
			value = storage.getItem("other");
			this.assertEquals(value, "f", "other should still be f, got " + value);

			// set it again
			storage.setItem("some", "p");
			value = storage.getItem("some");
			this.assertEquals(value, "p", "some should be p, got " + value);

			// clear
			storage.clear();
			value = storage.getItem("some");
			this.assertTrue(value == null, "some should be null after a clear, got " + value);
			value = storage.getItem("other");
			this.assertTrue(value == null, "other should be null after a clear, got " + value);

			// just check that the object is still working after a clear
			storage.setItem("left", "right");
			value = storage.getItem("left");
			this.assertEquals(value, "right", "left should be right, got " + value);

			// remove an item that doesn't exist, shouldn't complain
			storage.removeItem("missing");
			this.assertLogsEmpty();

			storage.$dispose();
		},

		/**
		 * Test the API when using two different storage instances
		 */
		testTwoInstancesStrings : function () {
			var one = new this.storageClass();
			var two = new this.storageClass();

			// set an item in one
			one.setItem("x", "1");
			// and check it in the other object
			var value = two.getItem("x");
			this.assertEquals(value, "1", "x should be 1, got " + value);

			// do it the other way round
			two.setItem("y", "2");
			// and check it in the other object
			value = one.getItem("y");
			this.assertEquals(value, "2", "y should be 2, got " + value);

			// override one value from the other object
			two.setItem("x", "ab");
			// and check it in the other object
			value = one.getItem("x");
			this.assertEquals(value, "ab", "x should be ab, got " + value);

			// remove an item in one
			one.removeItem("x");
			value = two.getItem("x");
			this.assertTrue(value == null, "x should be empty, got " + value);

			// clear one memory
			two.clear();
			value = one.getItem("y");
			this.assertTrue(value == null, "y should be empty, got " + value);

			one.$dispose();
			two.$dispose();
		}
	}
});
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
 * Test case for the View class.
 */
Aria.classDefinition({
	$classpath : 'test.aria.templates.ViewTest',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ['aria.templates.View', 'aria.utils.Json'],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		_buildTestArray : function (size) {
			var res = [];
			for (var i = 0; i < size; i++) {
				this._addElementToArray(res);
			}
			return res;
		},

		_randomIndex : function (array) {
			return Math.floor(Math.random() * array.length);
		},

		_randomNumber : function () {
			return Math.floor(Math.random() * 10000);
		},

		_addElementToArray : function (array) {
			var i = this._randomIndex(array);
			array.splice(i, 0, {
				myRandomOrder : this._randomNumber(),
				myOtherRandomOrder : this._randomNumber(),
				present : true
			});
		},

		_removeElementFromArray : function (array) {
			var i = this._randomIndex(array);
			var elt = array[i];
			elt.present = false;
			array.splice(i, 1);
		},

		_checkInitialOrder : function (view, originalArray) {
			this.assertTrue(view.initialArray == originalArray);
			var items = view.items;
			var length = items.length;
			this.assertTrue(length == originalArray.length);
			var lastKey = null;
			for (var i = 0; i < length; i++) {
				var itm = items[i];
				if (itm.value != originalArray[i]) {
					throw (null);
				}
				this.assertTrue(itm.value == originalArray[i], "checking initial order failed for " + i);
			}
		},

		_checkOrder : function (view, sortKey, ascending, originalArray) {
			this.assertTrue(view.initialArray == originalArray);
			var items = view.items;
			var length = items.length;
			this.assertTrue(length == originalArray.length);
			var lastKey = null;
			for (var i = 0; i < length; i++) {
				var itm = items[i];
				this.assertTrue(itm.value.present, "element should not be in the view");
				this.assertTrue(itm.sortKey == itm.value[sortKey], "checking sortkey");
				if (i > 0) {
					this.assertTrue(ascending ? lastKey <= itm.sortKey : lastKey >= itm.sortKey, "checking order by comparing with previous element");
				}
				lastKey = itm.sortKey;
			}
		},

		testMyViewOnArray : function () {
			var View = aria.templates.View;
			var testArray = this._buildTestArray(10);
			var myView = new View(testArray);
			this._checkInitialOrder(myView, testArray);

			// check toggleSortOrder:
			myView.toggleSortOrder("sortByMyRandomOrder", myView.propertySorter("myRandomOrder"));
			myView.refresh();
			this._checkOrder(myView, "myRandomOrder", true, testArray);
			myView.toggleSortOrder("sortByMyRandomOrder", myView.propertySorter("myRandomOrder"));
			myView.refresh();
			this._checkOrder(myView, "myRandomOrder", false, testArray);
			myView.toggleSortOrder("sortByMyRandomOrder", myView.propertySorter("myRandomOrder"));
			myView.refresh();

			// Now once the sorting is activated, toggle-ing just change the order
			// this._checkInitialOrder(myView, testArray);
			this._checkOrder(myView, "myRandomOrder", true, testArray);

			// myView.toggleSortOrder("sortByMyRandomOrder", myView.propertySorter("myRandomOrder"));
			// myView.refresh();
			// this._checkOrder(myView, "myRandomOrder", true, testArray);

			myView.toggleSortOrder("sortByMyOtherRandomOrder", myView.propertySorter("myOtherRandomOrder"));
			myView.refresh();
			this._checkOrder(myView, "myOtherRandomOrder", true, testArray);

			// test removing and adding elements to the initial array:
			myView.allFilteredOut(); // filter out all the elements to check they are still filtered out after adding
			// elements
			this._removeElementFromArray(testArray);
			this._removeElementFromArray(testArray);
			this._addElementToArray(testArray); // when adding elements, the filteredIn property is automatically set to
			// true
			this._addElementToArray(testArray); // when adding elements, the filteredIn property is automatically set to
			// true
			myView.notifyChange(myView.CHANGED_INITIAL_ARRAY);
			myView.refresh();
			this._checkOrder(myView, "myOtherRandomOrder", true, testArray);
			this.assertTrue(myView.filteredInCount == 2, "filteredIn property was not kept properly")

			myView.$dispose();

		},
		/**
		 * Creates a map data model for views.
		 * @protected
		 * @return {Object} map
		 */
		_buildTestMap : function () {
			var map = {
				"first" : {
					myFirstKey : "FA",
					mySecondKey : "SZ"
				},
				"second" : {
					myFirstKey : "FB",
					mySecondKey : "SB"
				},
				"third" : {
					myFirstKey : "FE",
					mySecondKey : "SC"
				},
				"four" : {
					myFirstKey : "FD",
					mySecondKey : "SD"
				}
			};

			// test that the view does not take into account metadata added in the initial map
			aria.utils.Json.addListener(map, "second", this._fakeCallbackForListener, false, false);

			return map;
		},

		/**
		 * Check the initial order of the created items array
		 * @protected
		 * @param {aria.templates.View} view
		 * @param {Object} map Initial map
		 */
		_checkInitialOrderForMap : function (view, originalMap) {
			this.assertTrue(view.initialArray == originalMap);
			var items = view.items;
			var i = 0, itm;
			for (var key in originalMap) {
				if (originalMap.hasOwnProperty(key) && !aria.utils.Json.isMetadata(key)) {
					itm = items[i];
					this.assertTrue(itm.value == originalMap[key], "checking initial order failed for " + i);
					this.assertTrue(itm.initIndex == key, "initIndex was not correctly initialized");
					i++;
				};
			}
			this.assertTrue(items.length == i, "the size of the items array is wrong - expected: " + i + ", found: "
					+ items.length);
		},

		_checkOrderForMaps : function (view, mySortKey, ascending, originalMap) {
			var items = view.items;
			var length = items.length;
			var lastKey = null;
			for (var i = 0; i < length; i++) {
				var itm = items[i];
				this.assertTrue(itm.initIndex in originalMap, "element should not be in the view");
				this.assertTrue(itm.sortKey == itm.value[mySortKey], "checking sortkey");
				if (i > 0) {
					this.assertTrue(ascending ? lastKey <= itm.sortKey : lastKey >= itm.sortKey, "checking order by comparing with previous element");
				}
				lastKey = itm.sortKey;
			}
		},

		/**
		 * Test View with string data model.
		 */

		testMyViewOnStrings : function () {
			var View = aria.templates.View;
			var testString = "Hello to views";
			var myView = new View(testString);
			this.assertErrorInLogs(myView.INVALID_TYPE_OF_ARGUMENT);
			myView.$dispose();
		},

		_fakeCallbackForListener : {
			fn : function () {},
			scope : this
		},
		/**
		 * Test View with map data model.
		 */

		testMyViewOnMaps : function () {
			var View = aria.templates.View;
			var testMap = this._buildTestMap();
			var myView = new View(testMap);

			// test that the filtereInCount property of the view has been correctly initialized
			this.assertTrue(myView.filteredInCount == 4, "The filteredInCount property has not been correctly initialized.");

			this._checkInitialOrderForMap(myView, testMap);
			// check toggleSortOrder:
			myView.toggleSortOrder("sortByFirstKey", function (item) {
				return item.value.myFirstKey;
			});
			myView.refresh();
			this._checkOrderForMaps(myView, "myFirstKey", true, testMap);
			myView.toggleSortOrder("sortByFirstKey", function (item) {
				return item.value.myFirstKey;
			});
			myView.refresh();
			this._checkOrderForMaps(myView, "myFirstKey", false, testMap);
			myView.toggleSortOrder("sortByFirstKey", function (item) {
				return item.value.myFirstKey;
			});
			myView.refresh();
			this._checkOrderForMaps(myView, "myFirstKey", true, testMap);

			// check the setSort method:
			myView.setSort(myView.SORT_DESCENDING, "sortBySecondKey", myView.propertySorter("mySecondKey"));
			this._checkOrderForMaps(myView, "mySecondKey", false, testMap);

			// check the setSort method with initial sort so that the _resetSort method can be tested:
			myView.setSort(myView.SORT_INITIAL, "sortBySecondKey", myView.propertySorter("mySecondKey"));
			this._checkInitialOrderForMap(myView, testMap);

			// test the allFilteredOut method
			this.assertTrue(myView.filteredInCount == 4);
			myView.allFilteredOut();
			myView.refresh();
			this.assertTrue(myView.filteredInCount == 0, "allFilteredOut did not work properly.");

			// check that a newly added element is taken into account and filtered in
			testMap["fifth"] = {
				myFirstKey : "FH",
				mySecondKey : "SS"
			};
			myView.notifyChange(myView.CHANGED_INITIAL_ARRAY);
			myView.refresh();
			this.assertTrue(myView.filteredInCount == 1, "filteredInCount wrong after adding a new element.");
			myView.allFilteredIn();
			myView.refresh();
			this.assertTrue(myView.filteredInCount == 5, "allFilteredIn did not work properly.");

			// check that the removal of an element is properly taken into account

			delete testMap.first;
			myView.notifyChange(myView.CHANGED_INITIAL_ARRAY);
			myView.refresh();
			// check the setSort method:
			myView.setSort(myView.SORT_DESCENDING, "sortBySecondKey", myView.propertySorter("mySecondKey"));
			this._checkOrderForMaps(myView, "mySecondKey", false, testMap);

			// test the getNewIndex method
			this.assertTrue(myView.getNewIndex(myView.items, "second") == 3, "getNewIndex method returned the wrong value.");
			// check the setSort method with initial sort so that the _resetSort method can be tested:
			myView.setSort(myView.SORT_INITIAL, "sortBySecondKey", myView.propertySorter("mySecondKey"));
			this._checkInitialOrderForMap(myView, testMap);

			this.assertTrue(myView.filteredInCount == 4);

			// test the filtering
			myView.filterIn(myView.FILTER_SET, function (o) {
				return (o.value.mySecondKey == "SS")
			});
			myView.refresh();
			this.assertTrue(myView.filteredInCount == 1);
			myView.filterIn(myView.FILTER_SET, function (o) {
				return (o.value.myFirstKey == "FB")
			});
			myView.refresh();
			this.assertTrue(myView.filteredInCount == 1);
			myView.filterIn(myView.FILTER_ADD, function (o) {
				return (o.value.mySecondKey == "SS" || o.value.mySecondKey == "SC")
			});
			myView.refresh();
			this.assertTrue(myView.filteredInCount == 3);
			myView.filterIn(myView.FILTER_REMOVE, function (o) {
				return (o.value.mySecondKey == "SS" || o.value.mySecondKey == "SC")
			});
			myView.refresh();
			this.assertTrue(myView.filteredInCount == 2);
			myView.allFilteredIn();

			// test the paging
			testMap["sixth"] = {
				myFirstKey : "BB",
				mySecondKey : "DD"
			};
			testMap["seventh"] = {
				myFirstKey : "BC",
				mySecondKey : "DA"
			};
			testMap["eighth"] = {
				myFirstKey : "ZZ",
				mySecondKey : "KK"
			};
			testMap["ninth"] = {
				myFirstKey : "AA",
				mySecondKey : "HH"
			};
			myView.notifyChange(myView.CHANGED_INITIAL_ARRAY);
			myView.filterIn(myView.FILTER_SET, function (o) {
				return (o.value.mySecondKey != "SS")
			});
			myView.setPageSize(3);
			myView.setSort(myView.SORT_DESCENDING, "sortByFirstKey", myView.propertySorter("myFirstKey"));
			this._checkOrderForMaps(myView, "myFirstKey", false, testMap);
			this.assertTrue(myView.pages.length == 3, "Wrong number of pages.");
			this.assertTrue(myView.pages[0].firstItemIndex == 0);
			this.assertTrue(myView.pages[0].lastItemIndex == 3);
			this.assertTrue(myView.pages[0].firstItemNumber == 1);
			this.assertTrue(myView.pages[0].lastItemNumber == 3);
			this.assertTrue(myView.pages[2].firstItemIndex == 7);
			this.assertTrue(myView.pages[2].lastItemIndex == 7);
			this.assertTrue(myView.pages[2].firstItemNumber == 7);
			this.assertTrue(myView.pages[2].lastItemNumber == 7);
			myView.filterIn(myView.FILTER_REMOVE, function (o) {
				return (o.value.myFirstKey != "BC")
			});
			myView.refresh();
			this.assertTrue(myView.pages.length == 2, "Wrong number of pages.");
			this.assertTrue(myView.pages[0].firstItemIndex == 0);
			this.assertTrue(myView.pages[0].lastItemIndex == 3);
			this.assertTrue(myView.pages[0].firstItemNumber == 1);
			this.assertTrue(myView.pages[0].lastItemNumber == 3);
			this.assertTrue(myView.pages[1].firstItemIndex == 4);
			this.assertTrue(myView.pages[1].lastItemIndex == 7);
			this.assertTrue(myView.pages[1].firstItemNumber == 4);
			this.assertTrue(myView.pages[1].lastItemNumber == 6);



			aria.utils.Json.removeListener(testMap, "second", this._fakeCallbackForListener);

			myView.$dispose();

		}
	}
});
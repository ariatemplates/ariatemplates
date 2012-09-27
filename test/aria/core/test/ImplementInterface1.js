/**
 * Test class implementing an interface.
 * @class test.aria.core.test.ImplementInterface1
 */
Aria.classDefinition({
	$classpath : "test.aria.core.test.ImplementInterface1",
	$implements : ["test.aria.core.test.Interface1"],
	$events : {
		"evtNotPartOfInterface" : "This event does not belong to an interface."
	},
	$constructor : function () {
		// real implementation:
		this.myData = {
			searchCalled : 0,
			resetCalled : 0,
			notPartOfInterfaceCalled : 0
		};
		this.myArray = ["a", "b", "c"];
		this.dataNotPartOfInterface = ["here"];
	},
	$prototype : {
		notPartOfInterface : function () {
			// this is not part of the interface
			this.myData.notPartOfInterfaceCalled++;
		},
		search : function (searchParam1, searchParam2) {
			// Real implementation here
			this.myData.searchCalled++;
			// test that the parameters are well transmitted:
			this.myData.searchParam1 = searchParam1;
			this.myData.searchParam2 = searchParam2;
			return "searchResult";
		},
		reset : function () {
			// Real implementation here
			this.myData.resetCalled++;
		}
	}
});
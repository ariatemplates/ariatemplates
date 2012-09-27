(function () {
	/**
	 * @class test.aria.core.BrowserTest
	 * @extends extends
	 */
	var classDefinition = {
		$classpath : 'test.aria.core.BrowserTest',
		$dependencies : ['aria.core.Browser'],
		$extends : "aria.jsunit.TestCase",
		$constructor : function () {
			this.$TestCase.constructor.call(this);
		},
		$destructor : function () {
			this.$TestCase.$destructor.call(this)
		},
		$prototype : {
			setUp : function () {},
			tearDown : function () {},
			testToString : function () {
				var browserToString = aria.core.Browser.toString();
				this.assertTrue(browserToString != "[object Object]", "aria.core.Browser.toString method not overrided correctly. "
						+ "Expected something different from [object Object] and got " + browserToString);
			},
			testVersion : function () {
				var browser = aria.core.Browser;
				if (Object.defineProperty) {
					this.assertFalse(browser.isIE6);
					this.assertFalse(browser.isIE7);
					try {
						var testVar = {};
						Object.defineProperty(testVar, "a", {
							get : function () {}
						});
						this.assertFalse(browser.isIE8);
					} catch (e) {
						this.assertFalse(browser.isIE9);
					}
				}
			}
		}
	};
	Aria.classDefinition(classDefinition);
})();
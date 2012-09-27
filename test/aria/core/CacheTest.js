Aria.classDefinition({
	$classpath : "test.aria.core.CacheTest",
	$extends : "aria.jsunit.TestCase",
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		testAsyncGetFileName : function () {
			// Load a template
			Aria.load({
				templates : ["test.aria.core.test.TemplateWithCSS"],
				oncomplete : {
					fn : this._assertGetFileName,
					scope : this
				}
			});
		},

		_assertGetFileName : function () {
			var classpaths = [
				"test.aria.core.test.TemplateWithCSS",
				"test.aria.core.test.TemplateWithCSSScript",
				"test.aria.core.test.CSSOfATemplate",
				"test.aria.core.test.MacroLibrary",
				"test.aria.core.test.CSSOfATemplateCSSLib",
				"test.aria.core.test.TextOfATemplate",
				"test.aria.core.test.ResourceOfATemplate",
				"some.other.class",
				null
			];

			var expected = [
				"test/aria/core/test/TemplateWithCSS.tpl",
				"test/aria/core/test/TemplateWithCSSScript.js",
				"test/aria/core/test/CSSOfATemplate.tpl.css",
				"test/aria/core/test/MacroLibrary.tml",
				"test/aria/core/test/CSSOfATemplateCSSLib.cml",
				"test/aria/core/test/TextOfATemplate.tpl.txt",
				"test/aria/core/test/ResourceOfATemplate.js",
				null,
				null
			];
			try {
				for (var i = 0, len = classpaths.length; i < len; i += 1) {
					this.assertTrue(aria.core.Cache.getFilename(classpaths[i]) == expected[i],
						"Classpath " + classpaths[i] + " doesn't match the expected value");
				}
			} catch (ex) {}

			this.notifyTestEnd("testAsyncGetFileName");
		}
	}
});

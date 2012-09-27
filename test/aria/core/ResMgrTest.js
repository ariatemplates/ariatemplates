/**
 * Test for the ResMgr class
 * @class test.aria.core.ResMgrTest
 */
Aria.classDefinition({
	$classpath : 'test.aria.core.ResMgrTest',
	$extends : 'aria.jsunit.TestCase',
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		setUp : function () {
      aria.core.AppEnvironment.updateEnvironment({
        "language" : {
          "primaryLanguage" : "it",
          "region" : "IT"
        }
      });
		},

		tearDown : function () {
      // Delete the resource loaded
      delete aria.core.ResMgr.loadedResources["test.aria.core.test.ExtResource"];
		},

		testAsyncGetResourceLocale : function () {
      Aria.load({
        resources : ["test.aria.core.test.ExtResource"],
        oncomplete : {
          fn : this._resourceItLoaded,
          scope : this
        }
      });
    },

    _resourceItLoaded : function () {
      var locale = aria.core.ResMgr.getResourceLocale("test.aria.core.test.ExtResource");
      this.assertTrue(locale == "it_IT");
      this.assertTrue(test.aria.core.test.ExtResource.noResources.empty == "Niente");
      this.notifyTestEnd('testAsyncGetResourceLocale');
    }
	}
});
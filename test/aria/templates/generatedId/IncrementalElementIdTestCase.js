/**
 * @class test.aria.templates.generatedId.IncrementalElementIdTest",
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.generatedId.IncrementalElementIdTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.DomOverlay"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        Aria.testMode = true;

        this.setTestEnv({
            template : "test.aria.templates.generatedId.TemplateWithSectionId",
            data : {
                sectionrefresh : "value1",
                firstTime : true,
                processingIndicator: false
            }
        });

    },

    $prototype : {
        tearDown : function () {
            aria.core.IO.$unregisterListeners(this);
        },
        _genId : function (id, index) {
            return aria.utils.Dom.getElementById([this.templateCtxt._id, id, 'auto', index].join("_"));
        },
        _genTplId : function (id) {
            return this.templateCtxt._id + id;
        },

        _checkDom : function(expectedCount) {
            var isTestMode = Aria.testMode;

            var tpl = this.testDiv.getElementsByTagName("div")[0];

            // Artificially put the "bibi" class on the button, to easily target it
            var container = this.getElementsByClassName(tpl, "button")[0];
            var button = container.getElementsByTagName("span")[0];
            if (button.className.indexOf("bibi") == -1) {
                button.className += " button bibi";
            }

            for(var baseId in expectedCount) {
                var count = expectedCount[baseId];
                var elements = this.getElementsByClassName(tpl, baseId);

                // Check element numbers
                this.assertEquals(elements.length, count.length, "The number of elements '" + baseId + "' is incorrect");

                for(var i = 0, ii = count.length; i < ii; i++) {
                    if (elements[i]) {
                        if (isTestMode) {
                            this.assertEquals(elements[i].id, this._genTplId('_' + baseId + '_auto_' + count[i]));
                        } else {
                            var id = elements[i].id;
                            var expected = count[i];
                            if (!expected) {
                                this.assertEquals(id, expected);
                            } else {
                                this.assertTrue(count[i].test(id), "The dom id is not the expected one (should match " + expected + ")");
                            }
                        }
                    }
                }
            }
        },

        runTemplateTest : function () {
            this._whenTestModeOn();
        },
        _whenTestModeOn : function () {


            this._checkDom({
                "bibi" : [1, 2],
                "toto" : [1, 2, 3, 4]
            });

            // Section refresh;
            aria.utils.Json.setValue(this.templateCtxt.data, "firstTime", false);
            aria.utils.Json.setValue(this.templateCtxt.data, "sectionrefresh", "_whenTestModeOn");

            this._checkDom({
                "bibi" : [3, 2],
                "toto" : [1, 5, 4]
            });

            // Chain
            Aria.testMode = false;
            this._refreshTestTemplate();
            this._whenTestModeOff();

        },
        _whenTestModeOff : function () {

            this._checkDom({
                "bibi" : [/^w.*/, ''],
                "toto" : [/^s.*/, '', '']
            });

            // Change firstTime and refresh
            aria.utils.Json.setValue(this.templateCtxt.data, "firstTime", false);
            aria.utils.Json.setValue(this.templateCtxt.data, "sectionrefresh", "_whenTestModeOff");

            this._checkDom({
                "bibi" : [/^w.*/, ''],
                "toto" : [/^s.*/, '', '']
            });

            // Chain
            Aria.testMode = true;
            this._replaceTestTemplate({
                template : "test.aria.templates.generatedId.TemplateWithOutSectionId",
                data : {
                    sectionrefresh : "value1",
                    firstTime : true,
                    processingIndicator: false
                }
            }, {
                fn : this._whenTestModeOnWithOutSectionId,
                scope : this
            });

        },
        _whenTestModeOnWithOutSectionId : function () {

            this._checkDom({
                "bibi" : [1, 2],
                "toto" : [1, 2, 3]
            });

            // Change firstTime and refresh
            aria.utils.Json.setValue(this.templateCtxt.data, "firstTime", false);
            aria.utils.Json.setValue(this.templateCtxt.data, "sectionrefresh", "_whenTestModeOnWithOutSectionId");

            this._checkDom({
                "bibi" : [3, 2],
                "toto" : [4, 3]
            });

            Aria.testMode = false;
            this._refreshTestTemplate();

            this._whenTestModeOffWithOutSectionId();
        },
        _whenTestModeOffWithOutSectionId : function () {

            this._checkDom({
                "bibi" : [/^w.*/, ''],
                "toto" : ['', ''],
                "section" : [/^s.*/]
            });

            // Change firstTime and refresh
            aria.utils.Json.setValue(this.templateCtxt.data, "firstTime", false);
            aria.utils.Json.setValue(this.templateCtxt.data, "sectionrefresh", "_whenTestModeOnWithOutSectionId");

            this._checkDom({
                "bibi" : [/^w.*/, ''],
                "toto" : ['', ''],
                "section" : [/^s.*/]
            });

            Aria.testMode = false;

            this._processingIndicator();
        },
        _processingIndicator : function () {
            var utilsOverlay = aria.utils.DomOverlay;

            this.assertEquals(utilsOverlay._nbOverlays, 0, "The page shouldn't contain an overlay");
            aria.utils.Json.setValue(this.templateCtxt.data, "processingIndicator", true);
            this.assertEquals(utilsOverlay._nbOverlays, 1, "The page should contain an overlay");

            this._end();

        },
        _end : function () {
            this.notifyTemplateTestEnd();
        }

    }
});
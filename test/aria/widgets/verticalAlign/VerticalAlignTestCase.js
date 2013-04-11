/**
 * Test different API for the section statement
 * @class test.templateTests.tests.features.section.SectionTestCase
 */

Aria.classDefinition({
    $classpath : 'test.aria.widgets.verticalAlign.VerticalAlignTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ['aria.jsunit.LayoutTester', 'aria.utils.Json', 'aria.core.Browser'],
    $templates : ['aria.widgets.form.list.templates.ListTemplate'],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            data : {
                group1 : "a"
            }

        });
    },
    $prototype : {

        setUp : function () {
            aria.core.AppEnvironment.setEnvironment({
                widgetSettings : {
                    middleAlignment : true
                }
            }, null, true);
        },

        runTemplateTest : function () {
            // Determine the file reference to load:
            var refName = "FF";
            var browser = aria.core.Browser;
            if (browser.isIE7) {
                refName = "IE7";
            } else if (browser.isIE8) {
                refName = "IE8";
            } else if (browser.isIE9) {
                refName = "IE9";
            } else if (browser.isIE10) {
                refName = "IE10";
            } else if (browser.isChrome) {
                refName = "Chrome";
            } else if (browser.isSafari) {
                refName = "Safari";
            } else {
                if (browser.isFirefox && browser.majorVersion == "3.6") {
                    // The layout tester doesn't work with FF 3.6
                    // To be done
                    this.notifyTemplateTestEnd();
                }
                // Take FF as the default
                refName = "FF";
            }

            Aria.load({
                classes : ['test.aria.widgets.verticalAlign.ExpectedFor' + refName],
                oncomplete : {
                    fn : function () {
                        this.compare(test.aria.widgets.verticalAlign['ExpectedFor' + refName].results);
                    },
                    scope : this
                }
            });
        },

        compare : function (expectedResult) {
            var document = Aria.$window.document;
            // Select the divs to compare
            var found = document.getElementsByTagName("div");
            var divs = [];
            for (var i = 0, ii = found.length; i < ii; i++) {
                if (found[i].className == "line") {
                    divs.push(found[i]);
                }
            }

            var layoutTester = aria.jsunit.LayoutTester;
            var results = [];
            for (var i = 0, ii = divs.length; i < ii; i++) {
                results.push(layoutTester.captureJsonScreenshot(divs[i]));
                var comparison = layoutTester.compare(expectedResult[i], 1); // Diff of 1px is accepted
                this.assertTrue(comparison.length === 0, "Layout comparison failed on div " + i);

                //if (comparison.length !== 0) { debugger; }
            }

            // To store the result
            for(var i = 0, ii = results.length; i < ii; i++) {
                var resultItem = results[i];
                for(var j = 0, jj = resultItem.length; j < jj; j++) {
                    // Revome the HTML element from the result, before the serialization
                    delete resultItem[j].element;
                }
            }
            if (!aria.core.Browser.isPhantomJS) {
                Aria.$window.document.getElementById("snapshotId").innerHTML = aria.utils.Json.convertToJsonString(results);
            } else {
                //Aria.$window.console.log(aria.utils.Json.convertToJsonString(results));
            }

            this.notifyTemplateTestEnd();
        }
    }
});

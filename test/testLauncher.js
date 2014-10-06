/* globals window, document */

aria.core.AppEnvironment.setEnvironment({
    appSettings : {
        devMode : true
    }
});

var toBeDisposed = [];

var endTest = function (evt) {
    var src = evt.src;

    // Show information about objects created/disposed
    aria.core.Timer.addCallback({
        fn : function () {
            var templatesTestContainer = document.getElementById("TESTAREA");
            templatesTestContainer.style.cssText = "visibility:hidden";

            /* Try to collect some information on disposed object */

            // this method depends on aria.utils.Function, call it now before disposal
            aria.jsunit.JsCoverage.addFiltersFromQueryString();

            var exclude = ["aria.jsunit.JsCoverage", "aria.jsunit.JsCoverageObject", "aria.jsunit.JsCoverageReport",
                    "aria.jsunit.JsCoverageStore", "aria.jsunit.TestRunner", "aria.utils.Type"];

            for (var i = Aria.$classes.length - 1; i >= 0; i--) {
                var elt = Aria.$classes[i];
                // beans and interfaces don't have a classdefinition, dispose then anyway
                var classpath = elt.classDefinition ? elt.classDefinition.$classpath : "_no_classpath";
                if (!aria.utils.Array.contains(exclude, classpath)) {
                    toBeDisposed.push(elt);
                }
            }

            disposeEverything();
        },
        delay : 15
    });
};

var disposeEverything = function () {
    // Dispose 100 elements at a time and then yeld to avoid unresponsive script warning
    for (var i = 0; i < 100; i += 1) {
        if (toBeDisposed.length > 0) {
            try {
                var elt = toBeDisposed.splice(0, 1)[0];
                Aria.dispose(elt);
            } catch (ex) {}
        } else {
            break;
        }
    }

    if (toBeDisposed.length > 0) {
        setTimeout(disposeEverything, 50);
    } else {
        aria.jsunit.JsCoverage.extractData();

        var storeResults = document.location.href.indexOf("store=true") != -1;
        if (storeResults) {
            aria.jsunit.JsCoverage.store();
        }
    }
};

Aria.load({
    classes : ["aria.jsunit.IOViewer", "aria.widgets.AriaSkinInterface", "aria.utils.Array"],
    oncomplete : function () {
        var qs = aria.utils.QueryString;

        var testToRun = (qs.getKeyValue("testClasspath") || "").replace(/^\s+|\s+$/g, '');
        if (!testToRun || testToRun == "testClasspath") {
            var html = '';
            html += '<form action="test.htm" style="text-align:center; font-family:Arial;">';
            if (qs.getKeyValue('dev') == "false") {
                html += '<input type="hidden" name="dev" value="false">';
            }
            if (qs.getKeyValue('amabuild') === "true") {
                html += '<input type="hidden" name="amabuild" value="true">';
            }

            var atversion = qs.getKeyValue('atversion');
            if (atversion) {
                html += '<input type="hidden" name="atversion" value="' + atversion + '">';
            }
            if (qs.getKeyValue('verbose') == "false") {
                html += '<input type="hidden" name="verbose" value="false">';
            }
            html += '<p>Classpath to run the test:</p>';
            // test classpath at the end, so that it gets output to to the request URL at the end
            html += '<input type="text" size="60" name="testClasspath">';
            html += '</form>';
            document.body.innerHTML = html;
            return;
            // testToRun = "test.CoverageTestSuite";
        }

        var neededClasses = ["aria.jsunit.TestRunner", "aria.jsunit.JsCoverage", "aria.utils.Callback",
                "aria.jsunit.TestWrapper", "aria.utils.Type", testToRun];

        var additionalAppender = qs.getKeyValue("appender");
        if (additionalAppender === "window") {
            additionalAppender = "aria.core.log.WindowAppender";
            neededClasses.push(additionalAppender);
            Aria.verbose = true;
        } else {
            additionalAppender = "";
        }

        Aria.load({
            classes : neededClasses,
            oncomplete : function () {
                if (additionalAppender) {
                    var appender = Aria.getClassInstance(additionalAppender);
                    aria.core.Log.addAppender(appender);
                }
                var qs = aria.utils.QueryString;
                var runIsolated = (qs.getKeyValue("runIsolated") == "true");
                var cstr = Aria.getClassRef(testToRun);
                var ts;
                if (runIsolated && !aria.utils.Type.isInstanceOf(cstr.prototype, "aria.jsunit.TestSuite")) {
                    ts = new aria.jsunit.TestWrapper(testToRun);
                } else {
                    ts = new cstr();
                }
                ts.$addListeners({
                    'end' : endTest,
                    scope : window
                });

                // test cases and test suites specified in the array will be skipped
                var skipTests = [];
                if (qs.getKeyValue("robot") === "false") {
                    skipTests.push("aria.jsunit.RobotTestCase");
                }

                if (qs.getKeyValue("flash") === "false") {
                    skipTests.push("test.aria.core.io.IOXDRTest");
                }

                aria.jsunit.TestRunner.getEngine().runIsolated = runIsolated;

                if (qs.getKeyValue("demo") == "true") {
                    ts.demoMode = true;
                }

                aria.jsunit.TestRunner.run(ts, skipTests);

            }
        });
    }
});

/* globals window, document */
var applet = null;

aria.core.AppEnvironment.setEnvironment({
    appSettings : {
        devMode : true
    },
    widgetSettings : {
        middleAlignment : true
    }
});

function onTestResultsSaved () {
    applet.sendInstruction({
        instruction : "_TESTMON:Test ended"
    });
}

var console;
var startTest = function (evt) {
    var qs = aria.utils.QueryString;
    applet = aria.jsunit.AppletWorker;

    if (qs.getKeyValue("UITest") == "1" || qs.getKeyValue("monitorTest") == "1") {
        applet.init("appletContainer");
    }

    if (qs.getKeyValue("monitorTest") == "1") {
        if (applet.isReady()) {
            applet.sendInstruction({
                instruction : "_TESTMON:Test started"
            });
        }
    }
};

/**
 * Communicators are DIVs in the page with a test statuses
 */
var createCommunicators = function () {
    createStatusCommunicator();
    createMailReportCommunicator();
    createFullReportCommunicator();
    createFailedTestCommunicator();
};

var createStatusCommunicator = function () {
    var errors = aria.jsunit.TestRunner.getErrors();
    if (errors.length > 0) {
        var testStatus = "ko";
    } else {
        var testStatus = "ok";
    }
    new aria.jsunit.TestCommunicator({
        id : "__ARIA_TEST_STATUS",
        content : testStatus
    });
};

var createMailReportCommunicator = function () {
    var jsCoverage = aria.jsunit.JsCoverage;
    var testRunner = aria.jsunit.TestRunner;

    var mailHeader = testRunner.getReporter().getMailHeader();
    var runnerReport = testRunner.getReport();
    var jsCoverageEmailReport = jsCoverage.getReportForEmail();
    var mailFooter = testRunner.getReporter().getMailFooter();

    var report = mailHeader + runnerReport + jsCoverageEmailReport +
            // Insert new reports here
            mailFooter;

    new aria.jsunit.TestCommunicator({
        id : "__ARIA_MAIL_REPORT",
        content : report
    });
};

var createFullReportCommunicator = function () {
    var jsCoverage = aria.jsunit.JsCoverage;
    var testRunner = aria.jsunit.TestRunner;

    var report = testRunner.getSonarReporter().getReport();

    new aria.jsunit.TestCommunicator({
        id : "__ARIA_FULL_REPORT",
        content : report
    });
};

var createFailedTestCommunicator = function () {
    var failures = aria.jsunit.TestRunner.getFailures();

    new aria.jsunit.TestCommunicator({
        id : "__ARIA_FAILED_TESTS",
        content : failures
    });
};

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
                    "aria.jsunit.JsCoverageStore", "aria.jsunit.TestRunner", "aria.jsunit.TestCommunicator",
                    "aria.utils.Type"];

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
            aria.jsunit.JsCoverage.store({
                callback : {
                    fn : createCommunicators,
                    scope : window
                }
            });
        } else {
            createCommunicators();
        }
    }
};

Aria.load({
    classes : ["aria.jsunit.IOViewer", "aria.jsunit.AppletWorker", "aria.widgets.AriaSkinInterface",
            "aria.jsunit.TestacularReport", "aria.utils.Array"],
    oncomplete : function () {
        var qs = aria.utils.QueryString;

        var testToRun = qs.getKeyValue("testClasspath");
        if (!testToRun || testToRun == "testClasspath") {
            var html = '';
            html += '<form action="test.htm" style="text-align:center; font-family:Arial;">';
            if (qs.getKeyValue('dev') == "false") {
                var atversion = qs.getKeyValue('atversion');
                html += '<input type="hidden" name="dev" value="false">';
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
            //testToRun = "test.CoverageTestSuite";
        }

        var neededClasses = ["aria.jsunit.TestRunner", "aria.jsunit.JsCoverage", "aria.jsunit.TestCommunicator",
            "aria.utils.Callback", "aria.jsunit.TestWrapper", "aria.utils.Type", testToRun];

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
                    'start' : startTest,
                    'end' : endTest,
                    scope : window
                });

                // test cases and test suites specified in the array will be skipped
                var skipTests = [];
                if (qs.getKeyValue("UITest") != "1") {
                    skipTests.push("test.aria.widgets.WidgetsUITestSuite");
                }
                if (qs.getKeyValue("robot") === "false") {
                    skipTests.push("aria.jsunit.RobotTestCase");
                }

                if (qs.getKeyValue("flash") === "false") {
                    skipTests.push("test.aria.core.io.IOXDRTest");
                }

                aria.jsunit.TestacularReport.attachTestEngine(aria.jsunit.TestRunner.getEngine());
                aria.jsunit.TestRunner.getEngine().runIsolated = runIsolated;

                if (qs.getKeyValue("demo") == "true") {
                    ts.demoMode = true;
                }

                aria.jsunit.TestRunner.run(ts, skipTests);

            }
        });
    }
});

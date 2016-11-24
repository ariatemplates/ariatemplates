/*
 * Copyright 2016 Amadeus s.a.s.
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

var disabledTestCasesPatterns = [
    // The following test fails, it needs to be fixed or removed:
    "test/aria/pageEngine/siteRootModule/ModelBindingTestCase.js",

    // The following test fails in all browsers except PhantomJS...
    // ... but PhantomJS is known not to correctly handle the viewport size,
    // ... and this test seems to be linked to exactly that!
    // The test needs to be fixed or removed.
    "test/aria/widgets/container/dialog/viewportResize/ViewportHugeShrinkTestCase.js"
];

var unpackagedOnlyPatterns = [
    // The following test does not work in packaged mode (because it tries to open a file from
    // the bootstrap, but it is packaged, and bootstrap files are not in the map)
    "test/aria/core/JsonValidatorTestCase.js"
];

var unpackagedPatterns = [
    // Includes a simple template test in unpackaged mode, to check that the framework
    // can correctly load a template in unpackaged mode
    "test/aria/widgets/form/datepicker/pickdate/PickDateTestCase.js"
].concat(unpackagedOnlyPatterns);

var jawsOnlyPatterns = [
    "test/**/*JawsTestCase.js"
];

var noFlashExcludesPatterns = [
    "test/aria/core/io/IOXDRTestCase.js"
];

var phantomjsExcludesPatterns = [
    // Excluded because PhantomJS has random issues with history management:
    // (to be investigated)
    "test/aria/utils/HistoryTestCase.js",
    // Excluded because PhantomJS has random issues with the viewport:
    "test/aria/widgets/container/dialog/scroll/OnScrollTestCase.js",
    "test/aria/widgets/container/dialog/resize/test3/DialogOnResizeRobotTestCase.js",
    "test/aria/widgets/container/dialog/resize/test4/DialogOnResizeScrollRobotTestCase.js",
    "test/aria/widgets/container/dialog/resize/test5/OverlayOnResizeScrollRobotTestCase.js",
    "test/aria/utils/overlay/loadingIndicator/scrollableBody/ScrollableBodyTestCase.js",
    "test/aria/utils/DomScrollIntoViewTestCase.js",
    "test/aria/widgets/form/multiselect/downArrowKeyPreventDef/MSDownArrowKeyRobotTestCase.js",
    "test/aria/widgets/container/dialog/indicators/DialogTestCase.js",
    "test/aria/widgets/container/dialog/movable/test5/MovableDialogFiveRobotTestCase.js",
    "test/aria/widgets/container/dialog/container/*TestCase.js",
    "test/aria/widgets/wai/popup/dialog/modal/SecondRobotTestCase.js",
    "test/aria/widgets/container/dialog/hiddenViewportResize/HiddenDialogViewportResizeTestCase.js",
    // Excluded because it often randomly fails with PhantomJS on travis-ci:
    "test/aria/widgets/container/tooltip/TooltipRobotTestCase.js"
];

// Some tests do not succeed in some browsers, and are listed here.
// They should be investigated and fixed.
var generalBrowserExcludes = {
    "PhantomJS": phantomjsExcludesPatterns,
    "Firefox 3": [
        "test/aria/core/io/JSONPTestCase.js",
        "test/aria/pageEngine/pageEngine/externalHashNavigation/ExternalHashNavigationTestCase.js",
        "test/aria/pageEngine/pageEngine/PageEngineFiveTestCase.js",
        "test/aria/pageEngine/pageEngine/PageEngineFourTestCase.js",
        "test/aria/pageEngine/utils/HashManagerTestCase.js",
        "test/aria/pageEngine/utils/HistoryManagerTestCase.js",
        "test/aria/storage/localStorage/EventIssueTestCase.js",
        "test/aria/utils/hashManager/HashManagerOneTestCase.js"
    ],
    "Firefox 11": [
        "test/aria/core/io/JSONPTestCase.js",
        "test/aria/pageEngine/pageEngine/PageEngineSixTestCase.js",
        "test/aria/pageEngine/pageEngine/PageEngineTemplateDisposalWithAnimationsTestCase.js",
        "test/aria/pageEngine/utils/HashManagerTestCase.js",
        "test/aria/pageEngine/utils/HistoryManagerTestCase.js",
        "test/aria/utils/css/AnimationsTestCase.js"
    ],
    "Firefox": [
        "test/aria/utils/events/scroll/OnscrollRobotTestCase.js",

        // The following tests fail on Firefox >= 49 because the default action for SHIFT-F10 can no longer be prevented:
        "test/aria/widgets/wai/dropdown/AutoCompleteDropdownTogglingRobotTestCase.js",
        "test/aria/widgets/wai/dropdown/DatePickerDropdownTogglingRobotTestCase.js",
        "test/aria/widgets/wai/dropdown/MultiAutoCompleteDropdownTogglingRobotTestCase.js",
        "test/aria/widgets/wai/dropdown/SelectBoxDropdownTogglingRobotTestCase.js",
        "test/aria/widgets/wai/dropdown/SelectDropdownTogglingRobotTestCase.js",
        "test/aria/widgets/wai/dropdown/MultiSelectDropdownTogglingRobotTestCase.js",
        "test/aria/templates/keyboardNavigation/dialog/escape/DialogEscapeAutoCompleteRobotTestCase.js",
        "test/aria/templates/keyboardNavigation/dialog/escape/DialogEscapeDatePickerRobotTestCase.js",
        "test/aria/templates/keyboardNavigation/dialog/escape/DialogEscapeMultiAutoCompleteRobotTestCase.js",
        "test/aria/templates/keyboardNavigation/dialog/escape/DialogEscapeMultiSelectRobotTestCase.js",
        "test/aria/templates/keyboardNavigation/dialog/escape/DialogEscapeSelectBoxRobotTestCase.js",
        "test/aria/templates/keyboardNavigation/dialog/escape/DialogEscapeSelectRobotTestCase.js",
        "test/aria/widgets/form/multiselect/escapeKey/MultiSelectRobotTestCase.js"
    ],
    "Chrome": [
        "test/aria/utils/mouse/MouseDragKoRobotTestCase.js"
    ],
    "Safari": [],
    "IE 7": [
        "test/aria/utils/domNavigationManager/DomNavigationManagerRobotTestCase.js"
    ],
    "IE 8": [
        "test/aria/html/textinput/placeholder/PlaceholderTestCase.js",
        "test/aria/map/Google3MapProviderTestCase.js",
        "test/aria/modules/RequestMgrTimeoutTestCase.js",
        "test/aria/storage/localStorage/EventIssueTestCase.js",
        "test/aria/utils/dragdrop/DragConstraintRobotTestCase.js",
        "test/aria/utils/dragdrop/DragProxyRobotTestCase.js",
        "test/aria/utils/hashManager/HashManagerOneTestCase.js",
        "test/aria/utils/mouse/MouseDragKoRobotTestCase.js",
        "test/aria/widgets/form/labelClick/FocusTestCase.js",
        "test/aria/widgets/wai/tabs/Group3RobotTestCase.js",
        "test/aria/widgets/wai/tabs/Group4RobotTestCase.js",
        "test/aria/widgets/action/link/disabled/LinkDisabledTestCase.js",
        "test/aria/widgets/form/multiselect/downArrowKeyPreventDef/MSDownArrowKeyRobotTestCase.js",
        "test/aria/widgets/form/textinput/helpText/HelpTextTestCase.js"
    ],
    "IE 9": [
        "test/aria/utils/hashManager/HashManagerOneTestCase.js",
        "test/aria/utils/mouse/MouseDragKoRobotTestCase.js",
        "test/aria/widgets/wai/dropdown/DatePickerDropdownTogglingRobotTestCase.js",
        "test/aria/templates/keyboardNavigation/dialog/escape/DialogEscapeDatePickerRobotTestCase.js",
        "test/aria/widgets/wai/popup/dialog/modal/ThirdRobotTestCase.js",
        "test/aria/widgets/wai/popup/dialog/modal/FourthRobotTestCase.js",
        "test/aria/widgets/wai/popup/dialog/modal/SecondRobotTestCase.js"
    ],
    "IE 10": [
        "test/aria/utils/mouse/MouseDragKoRobotTestCase.js",
        "test/aria/widgets/dropdown/touchDevices/MultiSelectPopupTouchRobotTestCase.js"
    ],
    "IE 11": [
        "test/aria/storage/localStorage/EventIssueTestCase.js",
        "test/aria/utils/mouse/MouseDragKoRobotTestCase.js",
        "test/aria/widgets/form/selectbox/SelectboxTestCase.js",
        "test/aria/widgets/form/multiautocomplete/navigation/input/InputFieldRobotTestCase.js"
    ],
    "Edge": [
        "test/aria/storage/localStorage/EventIssueTestCase.js",
        "test/aria/widgets/container/dialog/container/FocusDialogContainerRobotTestCase.js",
        "test/aria/widgets/form/multiselect/downArrowKeyPreventDef/MSDownArrowKeyRobotTestCase.js",
        "test/aria/widgets/form/multiselect/focusMove/Issue968RobotTestCase.js",
        "test/aria/widgets/container/dialog/resize/test3/DialogOnResizeRobotTestCase.js"
    ]
};

var testSkinOnlyPatterns = [
    "test/aria/widgets/skin/ExternalCSSTestCase.js",
    "test/aria/widgets/icon/fontIcon/FontIconTestCase.js",
    "test/aria/widgets/form/widgetsfont/WidgetsFontTestCase.js",
    "test/aria/widgets/form/fullWidth/errorLog/ErrorLogTestCase.js"
];

var testSkinPatterns = [
    "test/aria/widgets/form/fullWidth/FullWidthTestCase.js"
].concat(testSkinOnlyPatterns);

var flatSkinOnlyPatterns = [
    "test/aria/widgets/skin/dialogTitleBar/DialogTitleBarTestCase.js"
];

var flatSkinPatterns = [
    "test/aria/widgets/skin/**/*TestCase.js",
    "test/aria/widgets/form/autocomplete/popupWidth/AdaptToContentWidthRobotTestCase.js"
].concat(flatSkinOnlyPatterns);

var append = function (array, extraArray) {
    if (extraArray) {
        array.push.apply(array, extraArray);
    }
};

exports.unpackagedRootDirectory = "build/target/bootstrap";
exports.packagedRootDirectory = "build/target/production";
exports.testsRootDirectory = "test";
exports.bootstrapPath = "/aria/<%= env.name %>-<%= env.version %>.js";
exports.atSkinPath = "/aria/css/atskin-<%= env.version %>.js";
exports.flatSkinPath = "/aria/css/atflatskin-<%= env.version %>.js";
exports.testSkinPath = "/test/aria/testSkin/CustomTestSkin.js";

var path = require("path");

exports.buildTestConfig = function (config) {
    var extraScripts = [];
    var filesIncludes = [];
    var filesExcludes = [];
    var browserExcludes;
    var browsers = config.browsers;
    var rootFilePath = exports.packagedRootDirectory;
    var unpackaged = config.unpackaged;
    var noFlash = config.noFlash;

    var campaign = config.campaign;

    append(filesIncludes, config.includes);
    append(filesExcludes, config.excludes);

    if (campaign === "failing") {
        browserExcludes = {};
        browsers.forEach(function (browserName) {
            var failingInCurBrowser = generalBrowserExcludes[browserName];
            if (!failingInCurBrowser) {
                return;
            }
            append(filesIncludes, failingInCurBrowser);
            failingInCurBrowser.forEach(function (failingPattern) {
                browsers.forEach(function (browserName) {
                    var generalBrowserExcludesForCurBrowser = generalBrowserExcludes[browserName];
                    if (generalBrowserExcludesForCurBrowser && generalBrowserExcludesForCurBrowser.indexOf(failingPattern) > -1) {
                        return;
                    }
                    var curBrowserExcludes = browserExcludes[browserName];
                    if (!curBrowserExcludes) {
                        curBrowserExcludes = browserExcludes[browserName] = [];
                    }
                    curBrowserExcludes.push(failingPattern);
                });
            });
        });
        append(filesIncludes, disabledTestCasesPatterns);
        extraScripts.push(exports.atSkinPath);
    } else {
        browserExcludes = generalBrowserExcludes;
        append(filesExcludes, disabledTestCasesPatterns);
    }

    if (campaign === "unpackaged") {
        unpackaged = true;
        append(filesIncludes, unpackagedPatterns);
        extraScripts.push(exports.atSkinPath);
    } else {
        append(filesExcludes, unpackagedOnlyPatterns);
    }

    if (campaign === "classic") {
        append(filesIncludes, ["test/**/*TestCase.js"]);
        extraScripts.push(exports.atSkinPath);

        if (config.phantomjs) {
            noFlash = true;
            append(filesExcludes, phantomjsExcludesPatterns);
        }
    }

    if (campaign === "nophantom") {
        append(filesIncludes, phantomjsExcludesPatterns);
        extraScripts.push(exports.atSkinPath);
        if (!noFlash) {
            append(filesIncludes, noFlashExcludesPatterns);
        }
    }

    if (campaign === "testSkin") {
        append(filesIncludes, testSkinPatterns);
        extraScripts.push(exports.testSkinPath);
    } else {
        append(filesExcludes, testSkinOnlyPatterns);
    }

    if (campaign === "flatSkin") {
        append(filesIncludes, flatSkinPatterns);
        extraScripts.push(exports.flatSkinPath);
    } else {
        append(filesExcludes, flatSkinOnlyPatterns);
    }

    if (campaign === "jawsTests") {
        append(filesIncludes, jawsOnlyPatterns);
        extraScripts.push(exports.atSkinPath);
    } else {
        append(filesExcludes, jawsOnlyPatterns);
    }

    if (noFlash) {
        append(filesExcludes, noFlashExcludesPatterns);
    }

    var res = {
        resources: {
            "/": [
                unpackaged ? exports.unpackagedRootDirectory : exports.packagedRootDirectory
            ],
            "/test": [
                exports.testsRootDirectory
            ]
        },
        tests: {
            "aria-templates": {
                bootstrap: exports.bootstrapPath,
                extraScripts: extraScripts,
                files: {
                    rootDirectory: path.join(exports.testsRootDirectory, ".."),
                    includes: filesIncludes,
                    excludes: filesExcludes,
                    browserExcludes: browserExcludes
                }
            }
        }
    };
    if (browsers) {
        res.browsers = browsers;
    }
    return res;
};

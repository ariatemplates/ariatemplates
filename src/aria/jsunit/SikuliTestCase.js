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
var Aria = require("../Aria");
var ariaJsunitRobotJavaApplet = require("./RobotJavaApplet");
var ariaJsunitTestCase = require("./TestCase");
var ariaCoreDownloadMgr = require("../core/DownloadMgr");


/**
 * Base class for test cases which are using Sikuli. This is still experimental. It relies on the RobotApplet, which, by
 * default, is not distributed with Aria Templates.
 * @private
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.jsunit.SikuliTestCase',
    $extends : ariaJsunitTestCase,
    $statics : {
        /**
         * Settings to run test cases.
         * @type Object
         */
        settings : {
            /**
             * Path to the executable of the browser currently being tested. It should contain the string %url% to be
             * replaced by the url to load in the browser.
             * @type String
             */
            browserPath : ""
        },

        FAILED_OPENING_BROWSER : "The browser could not be opened. Command line used: %1"
    },
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        /**
         * Directory containing images. By default, it corresponds to the directory containing the test case.
         * @type String
         */
        this.imagesRoot = ariaCoreDownloadMgr.resolveURL(this.$package.replace(/\./g, "/", true)) + "/";

        /**
         * Reference to the RobotJavaApplet object.
         */
        this.robot = null;

        /**
         * Reference to a Java Screen object from Sikuli (see the <a target="_blank"
         * href="http://sikuli.org/doc/java-x/org/sikuli/script/Screen.html">JavaDoc here</a>)
         */
        this.screen = null;

        /**
         * Reference to the Java KeyModifier class from Sikuli (see the <a target="_blank"
         * href="http://sikuli.org/doc/java-x/org/sikuli/script/KeyModifier.html">JavaDoc here</a>)
         */
        this.KeyModifier = null;

        /**
         * Reference to the Java Key class from Sikuli (see the <a target="_blank"
         * href="http://sikuli.org/doc/java-x/org/sikuli/script/Key.html">JavaDoc here</a>)
         */
        this.Key = null;

    },
    $destructor : function () {
        this.robot = null;
        this.screen = null;
        this.KeyModifier = null;
        this.Key = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {
        /**
         * Entry point for the Sikuli test.
         */
        testAsyncRunSikuliTest : function () {
            ariaJsunitRobotJavaApplet.initRobot({
                fn : this._robotStarted,
                scope : this
            });
        },

        /**
         * Initializes the robot, screen, KeyModifier and Key properties and calls runSikuliTest. This method is called
         * automatically from testAsyncRunSikuli once the robot applet is initialized.
         */
        _robotStarted : function () {
            this.robot = ariaJsunitRobotJavaApplet.applet;
            this.screen = this.robot.createSikuliScreen();
            this.KeyModifier = this.robot.Packages.org.sikuli.script.KeyModifier;
            this.Key = this.robot.Packages.org.sikuli.script.Key;
            try {
                this.runSikuliTest();
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        /**
         * Creates a pattern from an image file.
         * @param {String} imageName Path to the image file. It is relative to this.imagesRoot.
         * @return {Object} A Java Pattern object containing the image.
         */
        image : function (imageName) {
            return this.robot.createPattern(this.imagesRoot + imageName);
        },

        /**
         * Contains the actual test case. It is intended to be overridden by sub-classes. The method in the
         * SikuliTestCase base class only calls sikuliTestEnd.
         */
        runSikuliTest : function () {
            // to be overridden by sub-classes
            this.sikuliTestEnd();
        },

        /**
         * Notifies the framework that the test is finished. This method is intended to be called from runSikuliTest or
         * in the callback of a method called from runSikuliTest.
         */
        sikuliTestEnd : function () {
            this.notifyTestEnd("testAsyncRunSikuliTest");
        },

        /**
         * Opens a URL in the currently tested browser.
         * @param {String} url
         */
        openURL : function (url) {
            var browserPath = this.settings.browserPath;
            var cmdLine = browserPath.replace(/\%url\%/, url);
            var app = this.robot.createApp(cmdLine);
            var res = app.open();
            if (res == null) {
                this.$logError(this.FAILED_OPENING_BROWSER, [cmdLine]);
                return false;
            }
            return true;
        }
    }
});

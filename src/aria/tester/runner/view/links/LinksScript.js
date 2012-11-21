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

Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.links.LinksScript',
    $prototype : {
        getTopspotLinks : function () {
            return ([{
                        href : "http://topspot/index.php/Aria_Templates_Testing_Documentation",
                        title : "Topspot : Testing Documentation"
                    }, {
                        href : "http://topspot/index.php/Category:Aria_Templates_Testing",
                        title : "Topspot : Testing Category"
                    }, {
                        href : "http://topspot/index.php/Aria_Templates_Testing_Documentation_:_Assert",
                        title : "Topspot : List of Assert Methods"
                    }, {
                        href : "http://topspot/index.php/Aria_Templates_Testing_Documentation_:_First_Steps_Tutorial",
                        title : "Topspot : First Tutorial"
                    }, {
                        href : "http://topspot/index.php/Aria_Templates_Testing_Documentation_:_Test_Runner",
                        title : "Topspot : Tester User Guide"
                    }]);
        },
        getKeyboardShortcuts : function () {
            var shortcuts = [{
                        key : "F",
                        description : "fullscreen on/<b>off</b>",
                        callback : this.switchView
                    }, {
                        key : "R",
                        description : "Run/Reload the test",
                        callback : this.runTest
                    }, {
                        key : "E",
                        description : "Display End test report",
                        callback : this.navigateToReport
                    }];
            return shortcuts;
        },
        switchView : function () {
            this.moduleCtrl.switchView();
        },
        navigateToOptions : function () {
            this.flowCtrl.navigate(this.flowCtrl.STATES.OPTIONS);
        },
        navigateToReport : function () {
            this.flowCtrl.navigate(this.flowCtrl.STATES.REPORT);
        }
    }
});

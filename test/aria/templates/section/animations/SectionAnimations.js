/*
 * Copyright 2014 Amadeus s.a.s.
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

/**
 * Test case for the section animations that checks that the section is
 * correctly updated, and the afterRefresh and onRefreshAnimationEnd are
 * properly triggered in 3 different use cases.
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.section.animations.SectionAnimations",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.css.Animations", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            animate : 0,
            noAnimate : 0,
            refreshNum : 0,
            refreshAnimationNum : 0,
            animation : {
                animateOut : "slide left",
                animateIn : "slide left"
            }
        };

        this.setTestEnv({
            template : "test.aria.templates.section.animations.TestTemplate",
            data : this.data,
            iframe : true
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.aria = this.testWindow.aria;
            if(!this.aria.utils.css.Animations.isSupported()){
                this.end();
                return;
            }

            this.aria.utils.Json.setValue(this.data, "animate", this.data.animate + 1);

            this.waitFor({
                condition : function () {
                    // checks if onRefreshAnimationEnd has been triggered
                    return this.data.refreshAnimationNum == 1;
                },
                callback : {
                    fn : this.animatedRefresh,
                    scope : this
                }
            });

        },

        animatedRefresh : function () {
            this._checkRefreshesAndSectionUpdated(2, 1, 1, 0);

            this.aria.utils.Json.setValue(this.data, "noAnimate", this.data.noAnimate + 1);

            this.waitFor({
                condition : function () {
                    // checks if $afterRefresh has been triggered
                    return this.data.refreshNum == 3;
                },
                callback : {
                    fn : this.manualRefresh1,
                    scope : this
                }
            });
        },

        manualRefresh1 : function () {
            this._checkRefreshesAndSectionUpdated(3, 1, 1, 1);

            this.data.animate = -33;
            this.templateCtxt.$refresh({
                section : "autoSection2",
                animate : false
            });

            this.waitFor({
                condition : function () {
                    // checks if $afterRefresh has been triggered
                    return this.data.refreshNum == 4;
                },
                callback : {
                    fn : this.manualRefresh2,
                    scope : this
                }
            });
        },

        manualRefresh2 : function () {
            this._checkRefreshesAndSectionUpdated(4, 1, -33, 1);

            this.data.noAnimate = -11;
            this.templateCtxt.$refresh({
                section : "autoSection2",
                animate : true
            });
            this.waitFor({
                condition : function () {
                    // checks if $afterRefresh has been triggered
                    return this.data.refreshAnimationNum == 2;
                },
                callback : {
                    fn : this.multipleRefreshStopRefreshMgr,
                    scope : this
                }
            });
        },

        multipleRefreshStopRefreshMgr : function () {
            // this._checkRefreshesAndSectionUpdated(5, 2, -33, -11);
            this.aria.templates.RefreshManager.stop();

            this.aria.utils.Json.setValue(this.data, "animate", this.data.animate + 1);
            this.aria.utils.Json.setValue(this.data, "noAnimate", this.data.noAnimate + 1);

            this.aria.templates.RefreshManager.resume();

            this.waitFor({
                condition : function () {
                    // checks if onRefreshAnimationEnd has been triggered
                    return this.data.refreshAnimationNum == 3;
                },
                callback : {
                    fn : this.multipleRefresh,
                    scope : this
                }
            });
        },

        multipleRefresh : function () {
            this._checkRefreshesAndSectionUpdated(6, 3, -32, -10);

            this.aria.utils.Json.setValue(this.data, "animate", this.data.animate + 1);
            this.aria.utils.Json.setValue(this.data, "animate", this.data.animate + 1);
            this.aria.utils.Json.setValue(this.data, "noAnimate", this.data.noAnimate + 1);

            this.waitFor({
                condition : function () {
                    // checks if onRefreshAnimationEnd has been triggered (only once, because the
                    // second refresh is called when the first animation is still in progress, so
                    // no animation is executed for the second one, but only a refresh )
                    return this.data.refreshAnimationNum == 4 && this.data.refreshNum == 9;
                },
                callback : {
                    fn : this.checkLastRefresh,
                    scope : this
                }
            });
        },

        checkLastRefresh : function () {
            this._checkRefreshesAndSectionUpdated(9, 4, -30, -9);

            this.end();
        },

        _checkRefreshesAndSectionUpdated : function (refreshNum, refreshAnimationNum, animate, noAnimate) {
            var refreshNumElement = this.testWindow.document.getElementById("animate");
            var refreshAnimationNumElement = this.testWindow.document.getElementById("noAnimate");
            this.assertEquals(this.data.refreshNum, refreshNum, "$afterRefresh has been triggered %1 times instead of %2");
            this.assertEquals(this.data.refreshAnimationNum, refreshAnimationNum, "$onRefreshAnimationEnd has been triggered %1 times instead of %2");
            this.assertEquals(refreshNumElement.innerHTML, "" + animate, "The animate data has not been updated in the section: %1 != %2");
            this.assertEquals(refreshAnimationNumElement.innerHTML, "" + noAnimate, "The noAnimate data has not been updated in the section: %1 != %2");
        }
    }
});

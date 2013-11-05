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

/**
 * test.aria.pageEngine.utils.PageConfigHelper test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.utils.PageConfigHelperTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.utils.PageConfigHelper", "aria.utils.Array", "aria.utils.Object"],
    $resources : {
        pageDefOne : "test.aria.pageEngine.utils.test.PageConfigOne"
    },
    $prototype : {

        testGetMenus : function () {
            var menus = {
                "menuOne" : ["childOne", "childTwo"]
            };
            var pageDef = {
                contents : {
                    menus : menus,
                    placeholderContents : {}
                },
                pageComposition : {}
            };

            var pgh = new aria.pageEngine.utils.PageConfigHelper(pageDef);
            this.assertTrue(pgh.getMenus() == menus, "getMenus method not working correctly");
            pgh.$dispose();
        },

        testGetMenusEmpty : function () {
            var pageDef = {
                pageComposition : {}
            };

            var pgh = new aria.pageEngine.utils.PageConfigHelper(pageDef);
            this.assertTrue(pgh.getMenus() === null, "getMenus method should return null when no menu is defined.");
            pgh.$dispose();
        },

        testGetPageDependencies : function () {
            var pgh = new aria.pageEngine.utils.PageConfigHelper(this.pageDefOne.pageDef);
            var dep = pgh.getPageDependencies();

            // templates
            this._testContains(dep.templates, ["body.template", "body.first.template", "body.middle.template",
                    "body.second.template", "main.page.template"], "Incorrect templates dependencies");
            this.assertTrue(dep.templates.length == 5);

            // classes
            this._testContains(dep.classes, ["module.one.classpath", "module.two.classpath", "module.three.classpath"]);
            this.assertTrue(dep.classes.length == 3);

            // common modules refpaths
            this._testContains(dep.modules.common, ["modOne"]);
            this.assertTrue(dep.modules.common.length == 1);

            // page-specific modules refpaths
            this._testContains(dep.modules.page, ["modOne", "modTwo", "mod.modthree", "modFour"]);
            this.assertTrue(dep.modules.page.length == 4);
            pgh.$dispose();

        },

        testAutoRefpathAddition : function () {
            var pgh = new aria.pageEngine.utils.PageConfigHelper(this.pageDefOne.pageDef);
            var modules = pgh.getPageModulesDescriptions();
            var refpaths = ["modOne", "modTwo", "mod.modthree", "modFour", "modFive"];
            var testVar = true, testRefPathShouldBeMissing = true;
            for (var i = 0, len = refpaths.length; i < len; i++) {
                testVar = testVar && (this._getModuleWithRefpath(modules, refpaths[i]).refpath == refpaths[i]);
                testRefPathShouldBeMissing = testRefPathShouldBeMissing && (!this.pageDefOne.pageDef.pageComposition.modules[refpaths[i]].refpath);
            }
            this.assertTrue(testVar, "Module definitions have not been decorated with refpaths");
            this.assertTrue(testRefPathShouldBeMissing, "Original Module definitions have been decorated with refpaths");

            pgh.$dispose();
        },

        testGetPageModulesDescriptions : function () {
            var pgh = new aria.pageEngine.utils.PageConfigHelper(this.pageDefOne.pageDef);

            var modules = pgh.getPageModulesDescriptions(["modOne", "mod.modthree"]);
            this.assertTrue(modules.length == 2);
            this.assertTrue(this._getModuleWithRefpath(modules, "modOne") != null);
            this.assertTrue(this._getModuleWithRefpath(modules, "mod.modthree") != null);

            modules = pgh.getPageModulesDescriptions([]);
            this.assertTrue(modules.length === 0);

            modules = pgh.getPageModulesDescriptions(["modOne", "mod.modthree", "doesnotexist"]);
            this.assertTrue(modules.length === 2);

            pgh.$dispose();
        },

        testGetLazyPlaceholderIds : function () {
            var pgh = new aria.pageEngine.utils.PageConfigHelper(this.pageDefOne.pageDefTwo);
            var lazyDeps = pgh.getLazyPlaceholdersIds();
            this.assertTrue(lazyDeps.length == 3);
            this._testContains(["body.middle", "body.middle.top", "bottomRight"], lazyDeps, "");
            this._testContains(lazyDeps, ["body.middle", "body.middle.top", "bottomRight"], "");
            pgh.$dispose();
        },

        testGetLazyPageDependencies : function () {
            var pgh = new aria.pageEngine.utils.PageConfigHelper(this.pageDefOne.pageDefTwo);
            var dep = pgh.getPageDependencies(false);

            // css
            this._testContains(dep.css, ["a.css", "d.css", "e.css", "f.css", "g.css", "h.css"]);
            this.assertTrue(dep.css.length == 6);

            // templates
            this._testContains(dep.templates, ["body.template", "body.first.template", "body.second.template",
                    "main.page.template"], "Incorrect templates dependencies");
            this.assertTrue(dep.templates.length == 4);

            // classes
            this._testContains(dep.classes, ["module.one.classpath", "module.two.classpath", "module.three.classpath"]);
            this.assertTrue(dep.classes.length == 3);

            // common modules refpaths
            this._testContains(dep.modules.common, ["modOne"]);
            this.assertTrue(dep.modules.common.length == 1);

            // page-specific modules refpaths
            this._testContains(dep.modules.page, ["modOne", "mod.modthree", "modFour"]);
            this.assertTrue(dep.modules.page.length == 3);

            dep = pgh.getPageDependencies(true);

            // css
            this._testContains(dep.css, ["b.css", "c.css", "d.css"]);
            this.assertTrue(dep.css.length == 3);

            // templates
            this._testContains(dep.templates, ["body.middle.template", "body.second.template"], "Incorrect lazy templates dependencies");
            this.assertTrue(dep.templates.length == 2);

            // classes
            this._testContains(dep.classes, ["module.four.classpath"]);
            this.assertTrue(dep.classes.length == 1);

            // common modules refpaths
            this.assertTrue(dep.modules.common.length === 0);

            // page-specific modules refpaths
            this._testContains(dep.modules.page, ["modTwo"]);
            this.assertTrue(dep.modules.page.length == 1);
            pgh.$dispose();

        },

        _testContains : function (container, content, errorMsg) {
            var containsAll = true;
            var arrayUtils = aria.utils.Array;
            for (var i = 0, len = content.length; i < len; i++) {
                containsAll = containsAll && arrayUtils.contains(container, content[i]);
            }
            this.assertTrue(containsAll, errorMsg);
        },

        _getModuleWithRefpath : function (modules, refpath) {
            for (var i = 0, len = modules.length; i < len; i++) {
                if (modules[i].refpath == refpath) {
                    return modules[i];
                }
            }
            return null;
        }

    }
});

/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Testcase for shared macro libraries
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.csslibs.CSSLibsTestCase",
    $dependencies : ["aria.templates.BaseTemplate", "aria.templates.BaseCtxt", "aria.utils.Dom"],
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._cssLibsEnv = {
            template : "test.aria.templates.csslibs.csslibsenv.CssLibs"
        };
        this.setTestEnv(this._cssLibsEnv);
        this.domUtil = aria.utils.Dom;
    },
    $prototype : {
        runTemplateTest : function () {
            // var el, s, sw, s1, s2, s3 -> element, style, style wanted

            // Note about colors: IE returns named values (red, magenta ... etc.) as provided in CSS,
            // while all other browsers normalize it to the rgb(x, x, x) form.
            // However, when given rgb(x, x, x) code in CSS, IE normalizes it by removing whitespace to rgb(x,x,x)
            // while the others normalize it with the whitespace to rgb(x, x, x)...

            this.tpltestCmlScriptFromCssTemplate();
            this.tpltestMethodFromParentCmlIsInheritedInChildCml();
            this.tpltestOverriddenMethodInChildAndDirectInvocationOfParentOverriddenMacro();
            this.tpltestOverriddingChildMacro();
            this.tpltestImportingCmlFromCml();
            this.tpltestVariablePassing();
            this.tpltestCallingScriptFromCml();
            this.tpltestInvokingMethodOfADependencyFromCml();
            this.tpltestUsingCssPath();

            // ++: special vars csspath
            this.end();
        },

        tpltestCmlScriptFromCssTemplate : function () {
            // test CML script from CSS template
            // testCmlScriptFromCssTemplate
            var el = this.getElementById("CssLibTestContainer");
            var s = this._rmws(this.domUtil.getStyle(el, 'backgroundColor'));
            var sw = "rgb(255,255,0)"; // yellow
            this.assertEquals(s, sw, 'The element should have bgcolor ' + sw + ' while it has ' + s);
        },

        tpltestMethodFromParentCmlIsInheritedInChildCml : function () {
            // test inheritance from parent CML + unescaped objects in {var} in a macro
            var el = this.getElementById("headerLink");
            var s = this._rmws(this.domUtil.getStyle(el, 'color'));
            var sw = "rgb(221,0,0)"; // dark red (#DD0000)
            this.assertEquals(s, sw, 'The element should have color ' + sw + ' while it has ' + s);
        },

        tpltestOverriddenMethodInChildAndDirectInvocationOfParentOverriddenMacro : function () {
            // test inheritance + overriding the parent CML
            // test calling $ParentLib.method from child CML
            // don't measuring border width since it changes in browser zoom mode
            var el = this.getElementById("overriddenStyle");
            var s1 = this.domUtil.getStyle(el, 'borderTopStyle');
            var s2 = this._rmws(this.domUtil.getStyle(el, 'borderTopColor'));
            var s = [s1, s2].join(" ");
            var sw = "solid rgb(255,0,0)";
            this.assertEquals(s, sw, 'The element should have border ' + sw + ' while it has ' + s);
        },

        tpltestOverriddingChildMacro : function () {
            // test statements in the overridden method in the child CML
            var el = this.getElementById("overriddenStyle");
            var s = this._rmws(this.domUtil.getStyle(el, 'color'));
            var sw = "rgb(85,85,85)"; // #555
            this.assertEquals(s, sw, 'The element should have color ' + sw + ' while it has ' + s);
        },

        tpltestImportingCmlFromCml : function () {
            // test calling external CML from CML + unescaped CSS in a macro + cross-browser opacity
            var el = this.getElementById("para");
            var s = (this.domUtil.getStyle(el, 'opacity')).toString(); // float in IE, string elsewhere
            var sw = "0.5";
            this.assertEquals(s, sw, 'The element should have opacity ' + sw + ' while it has ' + s);
        },

        tpltestVariablePassing : function () {
            var el = this.getElementById("para");
            var s = this.domUtil.getStyle(el, 'display');
            var sw = "block";
            this.assertEquals(s, sw, 'The element should have display ' + sw + ' while it has ' + s);
        },

        tpltestCallingScriptFromCml : function () {
            var el = this.getElementById("para");
            var s = this._rmws(this.domUtil.getStyle(el, 'color'));
            var sw = "rgb(0,128,0)"; // green
            this.assertEquals(s, sw, 'The element should have color ' + sw + ' while it has ' + s);
        },

        tpltestInvokingMethodOfADependencyFromCml : function () {
            var el = this.getElementById("colorFromDependency");
            var s = this._rmws(this.domUtil.getStyle(el, 'backgroundColor'));
            var sw = "rgb(255,0,255)"; // magenta
            this.assertEquals(s, sw, 'The element should have bgcolor ' + sw + ' while it has ' + s);
        },

        tpltestUsingCssPath : function () {
            var el = this.getElementById("usingCssPath");
            var s = this.domUtil.getStyle(el, 'backgroundImage');
            var swcontained = '/test/aria/templates/csslibs/csslibsenv/libs/MyChildLib/noSuchImage.jpg';
            this.assertTrue((s.indexOf(swcontained) != -1), 'The element\'s bgimage should contain ' + swcontained
                    + ' while it has the value: ' + s);
        },

        /**
         * Removes all whitespace from the string.
         */
        _rmws : function (s) {
            return s.replace(/\s/g, '');
        }
    }
});

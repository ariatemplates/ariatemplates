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

Aria.classDefinition({
    $classpath : "test.aria.templates.css.imgprefix.ImgPrefixTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",

    $constructor : function () {

        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.css.imgprefix.SimpleTemplate"
        });

        this.imgPaths = ["images/bg.jpg", "images/bg.jpg", "images/bg.jpg", "images)/bg.jpg", "images/?bg.jpg",
                "images'/bg.'jpg", "images\"/bg.\"jpg"];

        // set the app environment
        aria.core.AppEnvironment.setEnvironment({
            "imgUrlMapping" : this._fakeUrlMapping
        });
    },
    $prototype : {
        _fakeUrlMapping : function (url, cssClasspath) {
            return "ariatemplates/prefix/" + url;
        },

        runTemplateTest : function () {
            var firstCSS = aria.templates.CSSCtxtManager.getContext("test.aria.templates.css.imgprefix.SimpleTemplateCss").getText();
            var secondCSS = aria.templates.CSSCtxtManager.getContext("test.aria.templates.css.imgprefix.SimpleTemplateCss2").getText();

            var urls = firstCSS.match(/\bariatemplates\/prefix\/([^"'\r\n,]+|[^'\r\n,]+|[^"\r\n,]+)["']?\s*\)/gi).concat(secondCSS.match(/\bariatemplates\/prefix\/([^"'\r\n,]+|[^'\r\n,]+|[^"\r\n,]+)["']?\s*\)/gi));

            for (var i = 0; i < urls.length; i++) {
                var tmp = this._cleanUrls(urls[i]);
                this.assertTrue(tmp === "ariatemplates/prefix/" + this.imgPaths[i], "There isn't any prefix for image urls inside CSS templates");
            }

            aria.templates.CSSMgr.invalidate("test.aria.templates.css.imgprefix.SimpleTemplateCss", true);
            aria.templates.CSSMgr.invalidate("test.aria.templates.css.imgprefix.SimpleTemplateCss2", true);

            // reset app environment
            aria.core.AppEnvironment.setEnvironment({
                "imgUrlMapping" : null
            }, {
                fn : this._afterAppEnvResetting,
                scope : this
            }, true);
        },

        _afterAppEnvResetting : function () {
            // changing template
            this._replaceTestTemplate({
                template : "test.aria.templates.css.imgprefix.SimpleTemplateTwo"
            }, this._afterSecondTemplateLoaded);
        },

        _afterSecondTemplateLoaded : function () {
            // check that is not adding any prefix to image urls
            var firstCSS = aria.templates.CSSCtxtManager.getContext("test.aria.templates.css.imgprefix.SimpleTemplateCss").getText();
            var secondCSS = aria.templates.CSSCtxtManager.getContext("test.aria.templates.css.imgprefix.SimpleTemplateCss2").getText();

            var urls = firstCSS.match(/\bimages([^"'\r\n,]+|[^"\r\n,]+|[^'\r\n,]+)["']?\s*\)/gi).concat(secondCSS.match(/\bimages([^"'\r\n,]+|[^"\r\n,]+|[^'\r\n,]+)["']?\s*\)/gi));

            for (var i = 0; i < urls.length; i++) {
                var tmp = this._cleanUrls(urls[i]);
                this.assertTrue(tmp === this.imgPaths[i], "The framework is adding a prefix for image urls inside CSS templates, it shouldn't.");
            }
            this._testImageIsActuallyLoadedAfterPrefixing();
        },

        _testImageIsActuallyLoadedAfterPrefixing : function () {
            aria.core.AppEnvironment.setEnvironment({
                "imgUrlMapping" : function (url) {
                    return aria.core.DownloadMgr.resolveURL("aria/css/atskin/imgs/" + url);
                }
            }, {
                fn : this._loadThirdTpl,
                scope : this
            }, true);
        },

        _loadThirdTpl : function () {
            this._replaceTestTemplate({
                template : "test.aria.templates.css.imgprefix.TemplateWithRealImage"
            }, this._afterThirdTemplateLoaded);
        },

        _afterThirdTemplateLoaded : function () {
            var container = Aria.$window.document.getElementById("container-real-image");
            var style = aria.utils.Dom.getStyle(container, "backgroundImage");

            // if the image did not load, it will be "none"
            this.assertNotEquals(style, "none", "The prefixed image did not really load!");
            this.assertTrue(style.indexOf('aria/css/atskin/imgs/errortooltip.png') > -1);

            this.end();
        },

        _cleanUrls : function (url) {
            url = url.charAt(url.length - 1) === ")" ? url.substring(0, url.length - 1) : url;
            url = url.charAt(url.length - 1) === "\"" || url.charAt(url.length - 1) === "\'"
                    ? url.substring(0, url.length - 1)
                    : url;
            return url;
        }
    }
});
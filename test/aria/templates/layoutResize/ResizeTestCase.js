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
    $classpath : "test.aria.templates.layoutResize.ResizeTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom", "aria.utils.Event", "aria.utils.Callback"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            dialogVisible : true,
            showDiv : false
        };
        this.setTestEnv({
            template : "test.aria.templates.layoutResize.ResizeTemplate",
            data : this.data,
            iframe : true,
            rootDim : {
                width : {
                    min : 1
                },
                height : {
                    min : 1
                }
            },
            width : {
                min : 1,
                incrementFactor : 1
            },
            height : {
                min : 1,
                incrementFactor : 1
            }
        });
    },
    $prototype : {
        // overriding the TemplateTestCase method, in order to anticipate the Layout singleton loading
        _iframeLoad : function (args) {
            args.iframe.contentWindow.Aria.load({
                classes : ["aria.templates.Layout"],
                oncomplete : {
                    fn : this._afterLoadLayout,
                    scope : this,
                    resIndex : -1,
                    args : args
                }
            });
        },

        _afterLoadLayout : function (args) {
            this.cb = new aria.utils.Callback({
                fn : this.$TemplateTestCase._iframeLoad,
                scope : this,
                resIndex : -1,
                args : args
            });

            var iframe = args.iframe;

            // enlarge the iframe by a size much greater than the tollerance (50) of the test
            this.iframeGeom = iframe.contentWindow.aria.utils.Dom.getGeometry(iframe);
            this.iframeGeom.width += 1000;
            this.iframeGeom.height += 1000;

            iframe.style.width = this.iframeGeom.width + "px";
            iframe.style.height = this.iframeGeom.height + "px";
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.body.style.padding = 0;
            doc.body.style.margin = 0;

            aria.core.Timer.addCallback({
                fn : this.cb,
                scope : this,
                delay : 1000
            });
        },

        runTemplateTest : function () {
            this.data.showDiv = true;
            this.templateCtxt.$refresh();
            var div = this.testDocument.getElementById("resizableDiv");
            this.assertEqualsWithTolerance(parseInt(div.style.height), this.iframeGeom.height, 50, "Bad height after resize: %1, should be ~%2");
            this.assertEqualsWithTolerance(parseInt(div.style.width), this.iframeGeom.width, 50, "Bad width after resize: %1, should be ~%2");
            this.cb.$dispose();
            this.notifyTemplateTestEnd();

        }

    }
});

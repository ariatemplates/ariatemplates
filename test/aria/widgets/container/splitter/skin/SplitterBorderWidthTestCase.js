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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.splitter.skin.SplitterBorderWidthTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        borderWidth : 20,

        setUp : function () {
            var splitterSkin = aria.widgets.AriaSkin.skinObject.Splitter.std;
            splitterSkin.borderWidth = this.borderWidth;
            splitterSkin.borderColor = "blue";
        },

        runTemplateTest : function () {
            this.checkSplitter("H", "width", "x");
            this.checkSplitter("V", "height", "y");
            this.end();
        },

        checkSplitter : function (orientation, commonDimension, commonPosition) {
            var domUtils = aria.utils.Dom;
            var instance = this.getWidgetInstance("splitter" + orientation);
            var fullSplitter = instance._domElt;
            var splitBar = instance._splitBar;
            var splitBarProxy = instance._splitBarProxy;
            var panel1 = instance._splitPanel1;
            var panel2 = instance._splitPanel2;
            var geomFullSplitter = domUtils.getGeometry(fullSplitter);
            var geomSplitBar = domUtils.getGeometry(splitBar);
            var geomSplitBarProxy = domUtils.getGeometry(splitBarProxy);
            var geomPanel1 = domUtils.getGeometry(panel1);
            var geomPanel2 = domUtils.getGeometry(panel2);
            this.assertEquals(geomFullSplitter[commonDimension], 300);
            var sizeCommon = 300 - 2 * this.borderWidth;
            var posCommon = geomFullSplitter[commonPosition] + this.borderWidth;
            this.assertEquals(geomSplitBarProxy[commonDimension], sizeCommon);
            this.assertEquals(geomSplitBarProxy[commonPosition], posCommon);
            this.assertEquals(geomSplitBar[commonDimension], sizeCommon);
            this.assertEquals(geomSplitBar[commonPosition], posCommon);
            this.assertEquals(geomPanel1[commonDimension], sizeCommon);
            this.assertEquals(geomPanel1[commonPosition], posCommon);
            this.assertEquals(geomPanel2[commonDimension], sizeCommon);
            this.assertEquals(geomPanel2[commonPosition], posCommon);
        }
    }
});
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

Aria.classDefinition({
    $classpath : "test.aria.utils.UtilsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.utils.cssLoader.CSSLoaderTestCase");
        this.addTests("test.aria.utils.cfgframe.AriaWindowTestCase");
        this.addTests("test.aria.utils.css.AnimationsTestSuite");
        this.addTests("test.aria.utils.css.EffectsTestCase");
        this.addTests("test.aria.utils.environment.EnvironmentTestSuite");
        this.addTests("test.aria.utils.hashManager.HashManagerTestSuite");
        this.addTests("test.aria.utils.json.JsonTestSuite");
        this.addTests("test.aria.utils.overlay.OverlayTestSuite");
        this.addTests("test.aria.utils.sandbox.DOMPropertiesTestCase");
        this.addTests("test.aria.utils.mouse.MouseTestSuite");
        this.addTests("test.aria.utils.scriptloader.ScriptLoaderTestCase");
        this.addTests("test.aria.utils.validators.ValidatorsTestSuite");

        this.addTests("test.aria.utils.ArrayTestCase");
        this.addTests("test.aria.utils.ClassListTestCase");
        this.addTests("test.aria.utils.CallbackTestCase");
        this.addTests("test.aria.utils.DataTestCase");
        this.addTests("test.aria.utils.DateTestCase");
        this.addTests("test.aria.utils.DateInterpretTestCase");
        this.addTests("test.aria.utils.DatePatternInterpretTestCase");
        this.addTests("test.aria.utils.DateCompareTestCase");
        this.addTests("test.aria.utils.DelegateTestCase");
        this.addTests("test.aria.utils.DomTestCase");
        this.addTests("test.aria.utils.DomScrollIntoViewTestCase");
        this.addTests("test.aria.utils.EllipsisTestCase");
        this.addTests("test.aria.utils.EventTestCase");
        this.addTests("test.aria.utils.FireDomEventTestCase");
        this.addTests("test.aria.utils.FunctionTestCase");
        this.addTests("test.aria.utils.FunctionWriterTestCase");
        this.addTests("test.aria.utils.HistoryTestCase");
        this.addTests("test.aria.utils.HtmlTestCase");
        this.addTests("test.aria.utils.IdManagerTestCase");
        this.addTests("test.aria.utils.IdMgrTestCase");
        this.addTests("test.aria.utils.JsonTestCase");
        this.addTests("test.aria.utils.MathTestCase");
        this.addTests("test.aria.utils.NumberTestCase");
        this.addTests("test.aria.utils.NumberFormatTestCase");
        this.addTests("test.aria.utils.NumberLocaleTestCase");
        this.addTests("test.aria.utils.ObjectTestCase");
        this.addTests("test.aria.utils.PathTestCase");
        this.addTests("test.aria.utils.ProfilingTestCase");
        this.addTests("test.aria.utils.SizeTestCase");
        this.addTests("test.aria.utils.StackHashMapTestCase");
        this.addTests("test.aria.utils.StoreTestCase");
        this.addTests("test.aria.utils.StringTestCase");
        this.addTests("test.aria.utils.TimeTestCase");
        this.addTests("test.aria.utils.TypeTestCase");
        this.addTests("test.aria.utils.XmlTestCase");
        this.addTests("test.aria.utils.DeviceTestCase");
        this.addTests("test.aria.utils.OrientationTestCase");
        this.addTests("test.aria.utils.bridge.BridgeTestCase");
        this.addTests("test.aria.utils.dragdrop.DragTestSuite");
        this.addTests("test.aria.utils.events.EventsTestSuite");
    }
});

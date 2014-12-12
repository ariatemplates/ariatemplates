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
    $classpath : "test.aria.templates.section.SectionTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.templates.section.SectionTestCase");
        this.addTests("test.aria.templates.section.sectionAttributes.SectionAttributes");
        this.addTests("test.aria.templates.section.autorefresh.SectionAutorefreshTestCase");
        this.addTests("test.aria.templates.section.processingIndicator.ProcessingIndicatorOnSection");
        this.addTests("test.aria.templates.section.sectionWithoutMacro.SectionWithoutMacro");
        this.addTests("test.aria.templates.section.sectionAttributes.binding.SectionAttributesBinding");
        this.addTests("test.aria.templates.section.sectionAttributes.binding.SectionAttributesBindingNonRecursive");
        /* BACKWARD-COMPATIBILITY-BEGIN (cssclass) */
        this.addTests("test.aria.templates.section.sectionAttributes.cssClass.CssClassDeprecationTest");
        /* BACKWARD-COMPATIBILITY-END (cssclass) */
        this.addTests("test.aria.templates.section.animations.SectionAnimations");
        this.addTests("test.aria.templates.section.asContainer.SectionAsContainerTest");
    }
});

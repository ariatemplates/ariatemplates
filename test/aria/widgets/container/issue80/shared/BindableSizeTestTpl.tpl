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
{Template {
    $classpath : 'test.aria.widgets.container.issue80.shared.BindableSizeTestTpl',
    $hasScript : true
}}

{macro main()}
    {call noConstraints() /}
    {call withConstraints() /}
{/macro}

/* override me */
{macro noConstraints()}
{/macro}

/* override me */
{macro withConstraints()}
{/macro}

{macro contentMacroLong()}
    There <br> is <br> really <br> lots <br> lots <br> lots <br> lots <br>
    lots <br> lots <br> lots <br> lots <br>of <br> lines <br> here.
{/macro}

{macro putButtons()}
    // buttons for manual testing
    {@aria:Button {
      label : "Resize +40",
      onclick : {
        fn : buttonClickPlus
      }
    }/}
    {@aria:Button {
      label : "Resize -30",
      onclick : {
        fn : buttonClickMinus
      }
    }/}
    {@aria:Button {
      label : "Resize to 166",
      onclick : {
        fn : buttonClick166
      }
    }/}
    {@aria:Button {
      label : "Resize to 666",
      onclick : {
        fn : buttonClick666
      }
    }/}
    {@aria:Button {
      label : "Resize to 400x300",
      onclick : {
        fn : buttonClick400x300
      }
    }/}
{/macro}

{/Template}

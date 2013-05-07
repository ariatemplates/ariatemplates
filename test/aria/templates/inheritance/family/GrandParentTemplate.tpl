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
  $classpath: "test.aria.templates.inheritance.family.GrandParentTemplate",
  $css: ["test.aria.templates.inheritance.family.GrandParentCSS"],
  $macrolibs: {
    libGP : "test.aria.templates.inheritance.family.LibGrandParent",
    libOne : "test.aria.templates.inheritance.family.LibGrandParent2"
  },
  $res: {
    cartoons: "test.aria.templates.inheritance.family.Cartoons",
    cartoonsNew: "test.aria.templates.inheritance.family.CartoonsParent"
  },
  $hasScript: true
}}

  {var varGP = 3/}
  {var b = 1/}

  {macro main()}
    {call myMacro2()/}
    {call myMacro3()/}
    {call myMacro4()/}
    {call myMacro5()/}
  {/macro}

  {macro myMacroGrandParent()}
    <div>mymacrograndparent</div>
  {/macro}

  {macro myMacro2()}
    <div>parent mymacro2</div>
  {/macro}

  {macro myMacro3()}
    <div>grandparent mymacro3</div>
  {/macro}


{/Template}

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

{Template {
    $classpath : "test.aria.widgets.container.dialog.sizes.DialogWidthTestCaseTpl"
}}

	{macro main()}

		{@aria:Dialog {
		    visible : true,
		    macro : "dialogMacro",
		    id : "center"
		}/}

		{@aria:Dialog {
		    visible : true,
		    macro : "dialogMacro",
		    id : "centerHeight",
		    height : 500
		}/}

		{@aria:Dialog {
		    visible : true,
		    macro : "dialogMacro",
		    id : "notCentered",
		    center : false
		}/}

		{@aria:Dialog {
		    visible : true,
		    macro : "dialogMacro",
		    id : "positioned",
		    center : false,
		    xpos : 500,
		    ypos : 500
		}/}

		{@aria:Dialog {
		    visible : true,
		    macro : "dialogMacro",
		    id : "positionedHeight",
		    center : false,
		    xpos : 1000,
		    ypos : 1000,
		    height : -1
		}/}

	{/macro}

	{macro dialogMacro ()}
		{@aria:Template {
		    defaultTemplate : "test.aria.widgets.container.dialog.sizes.Content",
		    block : true
		}/}
	{/macro}

{/Template}

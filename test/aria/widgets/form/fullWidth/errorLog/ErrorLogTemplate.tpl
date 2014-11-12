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
	$classpath : "test.aria.widgets.form.fullWidth.errorLog.ErrorLogTemplate",
	$hasScript : false
}}
	{macro main()}
	    <div style="background-color:#3498DB;border-bottom: 1px solid #2C3E50;padding-bottom: 60px;padding-top: 60px;">
	    	{@aria:TextField {
	    	  id: "tf102",
              label : "Simple HTML:",
              labelPos : "left",
              block : true,
              helptext : "Enter your data",
              sclass: "simple",
              fullWidth : true
            }/}

            {@aria:TextField {
              id: "tf202",
              label : "Table Frame:",
              labelPos : "left",
              width : 500,
              block : true,
              labelWidth : 150,
              helptext : "Enter your data",
              sclass : "table",
              fullWidth : true
            }/}
	    </div>

	{/macro}
{/Template}

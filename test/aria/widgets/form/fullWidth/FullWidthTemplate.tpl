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
	$classpath : "test.aria.widgets.form.fullWidth.FullWidthTemplate",
	$hasScript : true
}}
	{macro main()}
		<div style="background-color:#3498DB;border-bottom: 1px solid #2C3E50;padding-bottom: 60px;padding-top: 60px;">
			{@aria:TextField {
			  id: "tf101",
	          label : "Simple Frame:",
	          labelPos : "right",
	          block : true,
	          helptext : "Enter your data",
	          sclass : "simpleFrame",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:TextField {
	          id: "tf201",
	          label : "Simple Frame:",
	          labelPos : "left",
	          helptext : "Enter your data",
	          sclass: "simpleFrame",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:PasswordField {
	          id: "pf101",
	          label : "Your password: ",
	          sclass : "simpleFrame",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:NumberField {
	          id: "nf101",
	          label : "Please enter a decimal number:",
	          mandatory : true,
	          errorMessages : [ "Please type in a number" ],
	          sclass : "simpleFrame",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:TimeField {
	          id: "tmf101",
	          label : "Departure time (short format: hh:mm):",
	          block : true,
	          labelPos : "right",
	          fullWidth : true,
	          sclass: "simpleFrame",
	          pattern : ""
	        }/}

	        <br/>
	        {@aria:TextField {
	        	id: "tf301",
	          label : "Simple Frame (not fullWidth):",
	          disabled : true,
	          labelPos : "left",
	          helptext : "Enter your data",
	          sclass: "simpleFrame"
	        }/}

			<br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Normal:",
	            labelPos:"left",
	            id: "ac101",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "simpleFrame",
	            fullWidth: true
	        }/}

	        <br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Normal:",
	            labelPos:"right",
	            id: "ac201",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "simpleFrame",
	            fullWidth: true
	        }/}

	        <br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Normal:",
	            labelPos:"top",
	            id: "ac301",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "simpleFrame",
	            fullWidth: true
	        }/}

			<br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Normal:",
	            labelPos:"bottom",
	            id: "ac401",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "simpleFrame",
	            fullWidth: true
	        }/}
	    </div>

	    <div style="background-color:#3498DB;border-bottom: 1px solid #2C3E50;padding-bottom: 60px;padding-top: 60px;">
	    	{@aria:TextField {
			  id: "tf100",
	          label : "Fixed Height:",
	          labelPos : "right",
	          block : true,
	          helptext : "Enter your data",
	          sclass : "std",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:TextField {
	          id: "tf200",
	          label : "Fixed Height:",
	          labelPos : "left",
	          helptext : "Enter your data",
	          sclass: "std",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:PasswordField {
	          id: "pf100",
	          label : "Your password: ",
	          sclass : "std",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:NumberField {
	          id: "nf100",
	          label : "Please enter a decimal number:",
	          mandatory : true,
	          errorMessages : [ "Please type in a number" ],
	          sclass : "std",
	          fullWidth : true
	        }/}

	        <br/>
	        {@aria:TimeField {
	          id: "tmf100",
	          label : "Departure time (short format: hh:mm):",
	          block : true,
	          labelPos : "right",
	          fullWidth : true,
	          pattern : aria.utils.environment.Date.getTimeFormats().shortFormat
	        }/}

	        <br/>
	        {@aria:TextField {
	        	id: "tf300",
	          label : "Fixed Height (not fullWidth):",
	          disabled : true,
	          labelPos : "left",
	          helptext : "Enter your data",
	          sclass: "std"
	        }/}

			<br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Fixed Height:",
	            labelPos:"left",
	            id: "ac100",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "std",
	            fullWidth: true
	        }/}

	        <br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Fixed Height:",
	            labelPos:"right",
	            id: "ac200",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "std",
	            fullWidth: true
	        }/}

	        <br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Fixed Height:",
	            labelPos:"top",
	            id: "ac300",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "std",
	            fullWidth: true
	        }/}

			<br/>
			{@aria:AutoComplete {
	            autoselect: true,
	            label:"Fixed Height:",
	            labelPos:"bottom",
	            id: "ac400",
	            resourcesHandler:getAutoCompleteHandler(3),
	            sclass: "std",
	            fullWidth: true
	        }/}
	    </div>

	{/macro}
{/Template}

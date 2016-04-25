/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.label.LabelJawsTestCaseTpl"
}}
    {macro main()}
        <span id="label-for-described-by">aria label described by</span>
        <span id="label-for-labelled-by">aria label labelled by</span>
        <div style="margin:10px;font-size:+3;font-weight:bold;">Label accessibility sample</div>
        <div style="margin:10px; overflow: auto; height: 600px;">
            With accessibility enabled: <br><br>
            {call checkBox("cbWaiEnabledStart") /}<br>
            {call dateField("dfWaiEnabledStart") /}<br>
            {call datePicker("dpWaiEnabledStart") /}<br>
            {call link("lWaiEnabledStart") /}<br>
            {call multiSelect("msWaiEnabledStart") /}<br>
            {call numberField("nfWaiEnabledStart") /}<br>
            {call passwordField("pfWaiEnabledStart") /}<br>
            {call radioButton("rbWaiEnabledStart") /}<br>
            {call selectBox("sbWaiEnabledStart") /}<br>
            {call textArea("taWaiEnabledStart") /}<br>
            {call textField("tfWaiEnabledStart") /}<br>
            {call timeField("tifWaiEnabledStart") /}<br>
        </div>
    {/macro}

    {macro checkBox(id)}

        <input type="text" {id id/}>
        {@aria:CheckBox {
            waiAria : true,
            label : "enabled - with aria label hidden",
            waiDescribedBy: "label-for-described-by",
            waiLabelledBy: "label-for-labelled-by",
            waiLabelHidden: true
        }/} <br><br>
        {@aria:CheckBox {
            waiAria : true,
            label : "enabled - with aria label hidden",
            waiLabel: "waiLabel",
            waiLabelHidden: true
        }/} <br><br>
    {/macro}

    {macro dateField(id)}
        <input type="text" {id id/}>
        {@aria:DateField {
            waiAria : true,
            label : "enabled - with aria label hidden",
            waiDescribedBy: "label-for-described-by",
            waiLabelledBy: "label-for-labelled-by",
            waiLabelHidden: true
        }/} <br><br>
        {@aria:DateField {
            waiAria : true,
            label : "enabled - with aria label hidden",
            waiLabel: "waiLabel",
            waiLabelHidden: true
        }/} <br><br>
    {/macro}

    {macro datePicker(id)}
        <input type="text" {id id/}>
        {@aria:DatePicker {
            label : "enabled - with aria label hidden",
            iconTooltip: "Display calendar",
            waiAria: true,
            waiAriaCalendarLabel: "Calendar table. Use arrow keys to navigate and space to validate.",
            waiAriaDateFormat: "EEEE d MMMM yyyy",
            calendarShowShortcuts: false,
            waiDescribedBy: "label-for-described-by",
            waiLabelledBy: "label-for-labelled-by",
            waiLabelHidden: true
        }/}  <br><br>
        {@aria:DatePicker {
            label : "enabled - with aria label hidden",
            iconTooltip: "Display calendar",
            waiAria: true,
            waiAriaCalendarLabel: "Calendar table. Use arrow keys to navigate and space to validate.",
            waiAriaDateFormat: "EEEE d MMMM yyyy",
            calendarShowShortcuts: false,
            waiLabel: "waiLabel",
            waiLabelHidden: true
        }/}
    {/macro}

    {macro link(id)}
            <input type="text" {id id/}>
            {@aria:Link {
              label : "enabled - with aria label hidden",
              margins : "60 x x 60",
              waiAria: true,
              waiDescribedBy: "label-for-described-by",
              waiLabelledBy: "label-for-labelled-by",
            }/} <br><br>
            {@aria:Link {
              label : "enabled - with aria label hidden",
              margins : "60 x x 60",
              waiAria: true,
              waiLabel: "waiLabel"
            }/} <br><br>
    {/macro}

    {macro multiSelect(id)}
            <input type="text" {id id/}>
            {@aria:MultiSelect {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                items: [],
                waiDescribedBy: "label-for-described-by",
                waiLabelledBy: "label-for-labelled-by",
                waiLabelHidden: true
            }/} <br><br>
            {@aria:MultiSelect {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                items: [],
                waiLabel: "waiLabel",
                waiLabelHidden: true
            }/} <br><br>
    {/macro}

    {macro numberField(id)}
            <input type="text" {id id/}>
            {@aria:NumberField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiDescribedBy: "label-for-described-by",
                waiLabelledBy: "label-for-labelled-by",
                waiLabelHidden: true
            }/} <br><br>
            {@aria:NumberField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiLabel: "waiLabel",
                waiLabelHidden: true
            }/} <br><br>

    {/macro}

    {macro passwordField(id)}
            <input type="text" {id id/}>
            {@aria:PasswordField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiDescribedBy: "label-for-described-by",
                waiLabelledBy: "label-for-labelled-by",
                waiLabelHidden: true
            }/} <br><br>
            {@aria:PasswordField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiLabel: "waiLabel",
                waiLabelHidden: true
            }/} <br><br>
    {/macro}

    {macro radioButton(id)}
        <input type="text" {id id/}>
        {@aria:RadioButton {
            id : 'radio1',
            waiAria : true,
            label : "enabled - with aria label hidden",
            labelWidth: 100,
            waiDescribedBy: "label-for-described-by",
            waiLabelledBy: "label-for-labelled-by",
            waiLabelHidden: true,
            value: '1',
            keyValue: '1'
        }/} <br><br>
        {@aria:RadioButton {
            id : 'radio2',
            waiAria : true,
            label : "enabled - with aria label hidden",
            labelWidth: 100,
            waiLabel: "waiLabel",
            waiLabelHidden: true,
            value: '1',
            keyValue: '1'
        }/} <br><br>
    {/macro}

    {macro selectBox(id)}
          <input type="text" {id id/}>
          {@aria:SelectBox {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiDescribedBy: "label-for-described-by",
                waiLabelledBy: "label-for-labelled-by",
                waiLabelHidden: true,
                options: [{label: 'option1',value: 1}]
            }/} <br><br>
            {@aria:SelectBox {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiLabel: "waiLabel",
                waiLabelHidden: true,
                options: [{label: 'option1',value: 1}]
            }/} <br><br>
    {/macro}

    {macro textArea(id)}
            <input type="text" {id id/}>
            {@aria:Textarea {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiDescribedBy: "label-for-described-by",
                waiLabelledBy: "label-for-labelled-by",
                waiLabelHidden: true
            }/} <br><br>
            {@aria:Textarea {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiLabel: "waiLabel",
                waiLabelHidden: true
            }/} <br><br>
    {/macro}

    {macro textField(id)}
            <input type="text" {id id/}>
            {@aria:TextField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiDescribedBy: "label-for-described-by",
                waiLabelledBy: "label-for-labelled-by",
                waiLabelHidden: true
            }/} <br><br>
            {@aria:TextField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiLabel: "waiLabel",
                waiLabelHidden: true
            }/} <br><br>
    {/macro}

    {macro timeField(id)}
            <input type="text" {id id/}>
            {@aria:TimeField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiDescribedBy: "label-for-described-by",
                waiLabelledBy: "label-for-labelled-by",
                waiLabelHidden: true
            }/} <br><br>
            {@aria:TimeField {
                waiAria : true,
                label : "enabled - with aria label hidden",
                labelWidth: 100,
                waiLabel: "waiLabel",
                waiLabelHidden: true
            }/} <br><br>
    {/macro}

{/Template}

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
  $classpath:"test.aria.widgets.skin.dialogTitleBar.TitleBarWidth"
}}

    {macro main()}
        {@aria:Dialog {
          id : "theDialog",
          maxWidth: 800,
          modal: true,
          center: true,
          visible: true,
          closeOnMouseClick: true,
          closable: true,
          sclass: "std",
          title: "Hotel - 1 Night",
          macro: "dialogContent"
        }/}
    {/macro}

    {macro dialogContent()}
        <div class="hotelDetails">
          <div class="hotel">
            <div class="providerHeader">
              <div class="providerName">
                <div class="mainTitle">GRANGER</div>
                <div class="subTitle">Global Hospitality</div>
              </div>
            </div>
          <div class="address">
            <span class="addressType">Location: </span>2-5 LETS BE AVENUE, LONDON WC1Z 6BT United Kingdom
            <span class="distance"> (1.2 kilometers from airport)</span>
            <br>
            <span class="addressType">Voice: </span>44-207-0000000
            <br>
            <span class="addressType">Fax: </span>44-207-0000001
            <br>
            <span class="addressType">Telex: </span>N/A
          </div>

          <div class="description">With a spectacular private garden overlooking and adjoining the world renowned British Museum, the Grange White Hall is in a unique private location, just minutes away from the myriad theatre and fashion attractions of London’s west end.</div>

          <div class="separator"></div>
          <div class="roomDescription">
            <span class="addressType">Room: </span>Moderate with bath/shower
            <br>BEST AVAILABLE RATE EX VAT
            <br>SUPERIOR SINGLE FRENCH QUEEN BED MIN 18 SQM
            <br>DEDICATED WORK DESK LAMP AND HI SPEED INTERNET
          </div>

        </div>

        <div class="hotelFacilitiesContainer">
          <ul class="hotelFacilities">

            <li class="hotelFacility">Restaurants</li>

            <li class="hotelFacility">Bar</li>

            <li class="hotelFacility">Laundry service</li>

            <li class="hotelFacility">Room service</li>

            <li class="hotelFacility">Safe dep box</li>

            <li class="hotelFacility">PC hookup in room</li>

            <li class="hotelFacility">Meeting rooms</li>

          </ul>
        </div>

        </div>
    {/macro}

{/Template}

/**
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
/**
 * @class aria.widgets.IconLib
 * Aria Icon Library Definition. A store of sprites and an API to retrieve needed information.
 * Also here is a cataloging mechanism that allows the contents of the library in the template.
 * To include this, declare {@aria:IconLib()} inside your template. It is useful for development
 * and documentation.
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
	$classpath:'aria.widgets.IconLib',
	$dependencies:[
		'aria.widgets.AriaLib'
	],
	$singleton:true,
	$onload:function() {
		// declare IconLib as a widget to allow the cataloging mechanism.
		//aria.widgets.AriaLib.registerWidget("IconLib",aria.widgets.IconLib);
	},
	$constructor:function () {
		
		// Internal library map where the sprites are stored.
		this._sprites = {
			iconsSTD:{
				cssClass:'xICNstd',
				spriteURL:null,
				spriteSpacing:2,
				iconWidth:16,
				iconHeight:16,
				biDimensional:false,
				direction:"x",
				content: {
					amn_air:0,		// amenitities - air conditioning - first image in sprite
					amn_bar:1,		// bar - second image in sprite
					amn_bus:2,		// business
					amn_chi:3,		// children
					amn_hea:4,		// health club - same as gym
					amn_gym:4,
					amn_lau:5,		// laundry
					amn_mee:6,		// meeting
					amn_par:7,		// parking
					amn_pch:8,		// PC host
					amn_pet:9,
					amn_res:10,		// restaurant
					amn_roo:11,		// ?
					amn_saf:12, 	// safe
					amn_sea:13,
					amn_spa:14,
					amn_swi:15,		// swimming pool
					amn_wif:16,		// wifi
					info:17,		// information
					fire:18,		// fire extinguisher
					add_line:19,
					rm_line:20,
					zoom_in:21,
					zoom_out:22,
					save:23,
					close:24,
					undo:25,
					redo:26,
					baby:27,
					extended_seat:28,
					hand_bag:29,
					expand:30,
					collapse:31,
					left_arrow:32,
					down_arrow:33,
					right_arrow:34,
					up_arrow:35,
					validated:36,
					warning:37
				}
			},
			iconsPb13x19: {
				cssClass:'xICNPB13x19',
				spriteURL:null,
				spriteSpacing:2,
				iconWidth:13,
				iconHeight:19,
				biDimensional:true,
				content: {
					no1:"0_0",
					no2:"0_1",
					no3:"0_2",
					no4:"1_0",
					no5:"1_1",
					no6:"1_2"
				}
			},
			fieldstd: {
				cssClass:"xTINbkg_std",
				spriteURL:null,
				spriteSpacing:2,
				iconWidth:2000,
				iconHeight:20,
				biDimensional:false,
				direction:"y",
				content: {
					"normal":0,
					"mandatory":1,
					"normalFocus":2,
					"mandatoryFocus":3,
					"normalError":4,
					"mandatoryError":5,
					"disabled":6,
					"readOnly":7
				}
			},
			ariaButton: {
				cssClass:"xBTN",
				spriteURL:null,
				spriteSpacing:2,
				iconWidth:1000,
				iconHeight:25,
				biDimensional:false,
				direction:"y",
				content:{
					"normal":0,
					"pushed":1,
					"disabled":2
				}
			},
			field1aBlue: {
				cssClass:"xTINbkg_1aBlue",
				spriteURL:null,
				spriteSpacing:2,
				iconWidth:800,
				iconHeight:22,
				biDimensional:false,
				direction:"y",
				content: {
					"normal":0,
					"normalFocus":1
				}
			}
		};
	},
	$prototype:{
		/**
		 * A method to register a user-defined custom sprite in the icon library.
		 * @param {Object} sprite
		 * @return {Boolean} returns whether the sprite was correctly registered.
		 */
		registerSprite: function(sprite){
			var icon;
			// Verify that the sprite passed follows the schema
			if(!sprite) return false;
			if(this._sprites[sprite.name]!==undefined){
				this.$logError("Sprite already exists");
				return false;
			}
			if (aria.core.JsonValidator.normalize({json:sprite,beanName:"aria.widgets.CfgBeans.SpriteCfg"})) {
				if(sprite.biDimensional){
					for(icon in sprite.content){
						if(!(typeof sprite.content[icon] === "string" && sprite.content[icon].match(/^\d+_\d+$/))){
							this.$logError("Bidimensional sprites must have positionings in the following format: x_y");
							return false;
						}
					}
				}
				else{
					for(icon in sprite.content){
						if(typeof sprite.content[icon] !== "number"){
							this.$logError("single-dimensional sprites must have numerical positionings.");
							return false;
						}
					}
				}
				this._sprites[sprite.name] = sprite;
				delete(sprite.name);
				return true;
			}
			return false;
		},
		/**
		 * A method to remove a sprite from the iconLib. Shouldn't be allowed to 
		 * delete aria-defined sprites. Declared as internal for the moment.
		 * @param {Object} name
		 * @return {Boolean} returns whether the sprite was found and correctly deleted.
		 */
		_deleteSprite: function(name){
			if(this._sprites[name]){
				delete(this._sprites[name]);
				return true;
			}
			return false;
		},
		/**
		 * Will return either false if the sprite and icon aren't in the library, or it returns an object 
		 * with the necessary information for building the markup inside the aria Icon object.
		 * @param {String} sprite
		 * @param {String} icon
		 * @return {Object|Boolean}
		 */
		getIcon: function(sprite, icon){
			var curSprite = this._sprites[sprite],
				iconContent,iconLeft=0, iconTop=0;
			if ( curSprite && (iconContent = curSprite.content[icon])!== undefined){
				if(curSprite.biDimensional){
					var XY = iconContent.split("_");
					iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing)*XY[0];
					iconTop = (curSprite.iconHeight + curSprite.spriteSpacing)*XY[1];
				}
				else if(curSprite.direction==="x") {
					iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing)*iconContent; 
				}
				else if(curSprite.direction==="y"){
					iconTop = (curSprite.iconHeight + curSprite.spriteSpacing)*iconContent;
				}
				curSprite = iconContent = null;
				return {
					"iconLeft": iconLeft,
					"iconTop": iconTop,
					"cssClass": curSprite.cssClass,
					"spriteURL": curSprite.spriteURL,
					"width": curSprite.iconWidth,
					"height": curSprite.iconHeight
				};
			}
			
			return false;
		},
		/**
		 * This is used to catalogue all the icon sets and icons inside this library. 
		 * There is no cfg object passed through as is normal for other widgets. This shouldn't ever be 
		 * called inside a real application, only as documentation or during development.
		 * @param {Object} out - the output stream where we can write to
		 */
		writeMarkup: function(out){
			var curSprite, iconLeft=0, iconTop=0, iconContent;
			for(var sprite in this._sprites){
				curSprite = this._sprites[sprite];
				out.write('<h3>'+sprite+'</h3>');
				for(var icon in curSprite.content){
					iconContent = curSprite.content[icon];
					if(curSprite.biDimensional){
						var XY = iconContent.split("_");
						iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing)*XY[0];
						iconTop = (curSprite.iconHeight + curSprite.spriteSpacing)*XY[1];
					}
					else if(curSprite.direction==="x") {
						iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing)*iconContent; 
					}
					else if(curSprite.direction==="y"){
						iconTop = (curSprite.iconHeight + curSprite.spriteSpacing)*iconContent;
					}
					
					var cssClass = curSprite.cssClass?'class="'+curSprite.cssClass+'" ':'';
					var background = curSprite.spriteURL?'background:url('+curSprite.spriteURL+') no-repeat;':'';
					var width = (curSprite.iconWidth<600)?'width:'+(curSprite.iconWidth+100)+'px;':'';
					out.write([
						'<span style="display:inline-block;',width,
						'"><span ',cssClass,'style="',	background,
						'margin:1px;display:inline-block;width:',
						curSprite.iconWidth,'px;height:',curSprite.iconHeight,'px;background-position:-',
						iconLeft,'px -',iconTop,'px;"></span> ',icon,'</span>'
					].join(''));
				}
				out.write('<br /><br/>');
			}
            curSprite = null;
		}
	}
});

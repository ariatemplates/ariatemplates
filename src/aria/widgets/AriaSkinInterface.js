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
 * @class aria.widgets.AriaSkinInterface A class that provides an interface to the AriaSkin object that comes from the
 * skinning system.
 * @extends aria.core.JsObject
 * @singleton
 */
Aria.classDefinition({
	$classpath : 'aria.widgets.AriaSkinInterface',
	$singleton : true,
	$dependencies : [],
	$constructor : function () {},
	$statics : {
		// ERROR MESSAGES:
		WIDGET_SKIN_OBJECT_NOT_FOUND : "The skin object for widget '%1' was not found.",
		WIDGET_SKIN_CLASS_OBJECT_NOT_FOUND : "This skin class '%1' for widget '%2' was not found. Please check that the sclass property of the widget is correctly set, and that the properties for the skin class are well defined in your skin .properties file."
	},
	$prototype : {
		/**
		 * This method will retrieve and also normalize the skin object before passing it back. A full normalization has
		 * two parts. The first is to normalize the top object in relation to the std object (not needed if we are
		 * retrieving the std object itself). This process will fill in the blanks from the std.states.normal object to
		 * the skinClass.states.normal. The second will normalize the states, a process that uses the
		 * skinClass.states.normal as a base (that has been normalized in relation to the std class, and then fills in
		 * all the missing blanks for all other states defined in the skinClass. This means that other states (not
		 * normal) defined in the std class are not used in this process. We only normalize the states that have been
		 * defined by the skinner in the skin class. This is done as we add events to the dom based on the states
		 * defined (eg if no msover state is defined, the onmouseover event is not added).
		 * @param {String} widget
		 * @param {String} skinClass
		 * @param {Boolean} skipError
		 * @return {Object}
		 */
		getSkinObject : function (widgetName, skinClass, skipError) {
			var widgetSkinObj = aria.widgets.AriaSkin['sc' + widgetName];
			if (widgetSkinObj) {
				if (skinClass === undefined)
					skinClass = 'std';
				var skinClassObj = widgetSkinObj[skinClass];
				if (skinClassObj) {
					// normalization is no longer necessary as it is already done in the skinning system
					// it causes problems with icons
					return skinClassObj;
				} else if (!skipError) {
					// thrown if the skin class inside the already found widget skin object isn't found
					this.$logError(this.WIDGET_SKIN_CLASS_OBJECT_NOT_FOUND, [skinClass, widgetName]);
				}
				return null;
			} else {
				// thrown if for example scTextfield or scButton aren't found
				this.$logError(this.WIDGET_SKIN_OBJECT_NOT_FOUND, widgetName);
			}
		},

		/**
		 * Return icon information for given sprite and icon name
		 * @param {String} sprite
		 * @param {String} icon
		 * @return {Object}
		 */
		getIcon : function (sprite, icon) {
			var curSprite = aria.widgets.AriaSkin["scIcon"][sprite], iconContent, iconLeft = 0, iconTop = 0;
			if (curSprite && (iconContent = curSprite.content[icon]) !== undefined) {
				if (curSprite.biDimensional) {
					var XY = iconContent.split("_");
					iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing) * XY[0];
					iconTop = (curSprite.iconHeight + curSprite.spriteSpacing) * XY[1];
				} else if (curSprite.direction === "x") {
					iconLeft = (curSprite.iconWidth + curSprite.spriteSpacing) * iconContent;
				} else if (curSprite.direction === "y") {
					iconTop = (curSprite.iconHeight + curSprite.spriteSpacing) * iconContent;
				}
				return {
					"iconLeft" : iconLeft,
					"iconTop" : iconTop,
					"cssClass" : curSprite.cssClass,
					"spriteURL" : curSprite.spriteURL,
					"width" : curSprite.iconWidth,
					"height" : curSprite.iconHeight,
					"verticalAlign" : curSprite.verticalAlign,
					"margins" : curSprite.margins
				};
			}
			return false;
		},

		/**
		 * Return the name of the skin loaded
		 * @return {String} Name of the skin, Default atdefskin
		 */
		getSkinName : function () {
			return aria.widgets.AriaSkin.skinName || "atdefskin";
		},

		/**
		 * Build the backgroung rule of a CSS selector. It is equivalent to the background macro inside .ftl files. It
		 * computes the path to the css image from the baseUrl FIXME This function is needed because the packager
		 * modifies any url(
		 * @param {String} color Color description
		 * @param {String} imageurl Image path, relative to the css folder
		 * @param {String} otherparams Extra parameters
		 * @return {String} full background rule
		 */
		backgroundMacro : function (color, imageurl, otherparams) {
			var fullUrl = "";
			var gifUrl = "";

			if (imageurl) {
				var baseUrl = Aria.rootFolderPath;
				if (!baseUrl) {
					// Relative path, make it looks like an absolute
					baseUrl = "./";
				} else if (baseUrl.charAt(baseUrl.length - 1) !== "/") {
					// Ensure an ending slash
					baseUrl += "/";
				}

				fullUrl = "url(" + baseUrl + "css/" + imageurl + ") ";

				if (aria.utils.String.endsWith(imageurl, ".png")) {
					gifUrl = baseUrl + "css/" + imageurl.substring(0, imageurl.length - 4) + ".gif";
				} else {
					gifUrl = baseUrl + "css/" + imageurl;
				}
			}

			var rule = ["background: ", color, " ", fullUrl, otherparams, ";"];

			if (gifUrl) {
				rule.push("_background-image: url(", gifUrl, ") !important;")
			}

			return rule.join("");
		}
	}
});
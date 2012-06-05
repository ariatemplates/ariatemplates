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
 * Aria Icon Widget
 * @class aria.widgets.Icon
 * @extends aria.widgets.Widget
 */
Aria.classDefinition({
	$classpath : 'aria.widgets.Icon',
	$extends : 'aria.widgets.Widget',
	$dependencies : ['aria.utils.Dom'],
	$css : ['aria.widgets.css.' + aria.widgets.AriaSkinInterface.getSkinName() + '.Icon'],
	$constructor : function (cfg, ctxt) {

		this.$Widget.constructor.apply(this, arguments);

		/**
		 * Skin information for this icon
		 * @protected
		 * @type {Object}
		 */
		this._iconInfo = null;

		/**
		 * CSS classes which should be applied to this widget when it is created.
		 * @protected
		 * @type String
		 */
		this._cssClassNames = "xWidget";
	},
	$statics : {
		/**
		 * Icon used when the resquest icon is missing
		 * @type {Object}
		 */
		ERROR_ICON : null,

		/**
		 * Title for the missing icon. % will be replaced with the icon name
		 * @type {String}
		 */
		ERROR_ICON_TITLE : 'Icon % not found',

		// ERROR MESSAGES:
		ICON_BADLY_FORMATTED : "%1Icon name is not valid: %2",
		ICON_NOT_FOUND : "%1Icon was not found: %2"
	},
	$prototype : {

		/**
		 * Override widget writeMarkup method.
		 * @param {aria.templates.MarkupWriter} out the html output writer
		 */
		writeMarkup : function (out) {
			var cfg = this._cfg, id = this._domId, tooltip = cfg.tooltip, iconInfo;
			iconInfo = this._getIconInfo(cfg.icon);
			if (!iconInfo) {
				tooltip = this.ERROR_ICON_TITLE.replace('%', cfg.icon);
				iconInfo = this._getErrIcon();
			}

			if (this._cfgOk) {

				if (tooltip != null && tooltip != '') {
					tooltip = 'title="' + tooltip + '" ';
				} else {
					tooltip = '';
				}

				out.write(['<span id="', id, '" class="', this._getIconClasses(iconInfo), '" ', tooltip, 'style="',
						this._getIconStyle(iconInfo), '"></span>'].join(''));

				this._iconInfo = iconInfo;

			}

			this._domReady = true;

		},

		/**
		 * Change the style to display a different icon.
		 * @param {String} newIcon
		 */
		changeIcon : function (newIcon) {

			// check if initialization was successful
			if (!this._iconInfo) {
				return;
			}

			var iconInfo = this._getIconInfo(newIcon);
			// check
			if (iconInfo) {
				var domElt = this.getDom();
				domElt.style.cssText = this._getIconStyle(iconInfo);
				domElt.className = this._getIconClasses(iconInfo);
			}

			this._iconInfo = iconInfo;
		},

		/**
		 * Gets the current icon info
		 * @return {Object}
		 */
		getCurrentIconInfo : function () {
			return this._iconInfo;
		},

		/**
		 * Gets the icon info
		 * @param {String} icon, something like myLib:myIcon
		 * @return {Object}
		 */
		_getIconInfo : function (icon) {
			var iconParts = icon.split(":");
			if (iconParts.length !== 2) {
				this.$logError(this.ICON_BADLY_FORMATTED, [icon]);
				return null;
			} else {
				var iconInfo = aria.widgets.AriaSkinInterface.getIcon(iconParts[0], iconParts[1]);
				if (!iconInfo) {
					this.$logError(this.ICON_NOT_FOUND, [icon]);
					return null;
				}
				return iconInfo;
			}
		},

		/**
		 * Return the icon style for a given icon skin
		 * @param {Object} iconInfo
		 * @return {String}
		 */
		_getIconStyle : function (iconInfo) {
			var cfg = this._cfg;
			var vAlign = !iconInfo.verticalAlign ? "" : "vertical-align: " + iconInfo.verticalAlign;
			var margins = "margin: 0 0 0 0 "; // default value

			if (cfg.margins != null && cfg.margins.match(/^(\d+|x) (\d+|x) (\d+|x) (\d+|x)$/)) {
				var margArray = cfg.margins.split(" ");
				margins = ['margin:', margArray[0], 'px ', margArray[1], 'px ', margArray[2], 'px ', margArray[3],
						'px; '].join('');
			} else if (iconInfo.margins != null) {
				margins = iconInfo.margins;
			}

			return [margins, ';padding:0;background-position:-', iconInfo.iconLeft, 'px -', iconInfo.iconTop,
					'px;width:', iconInfo.width, 'px;height:', iconInfo.height, 'px;', vAlign].join('');

		},

		/**
		 * Return the icon classes for a given icon
		 * @param {Object} iconInfo
		 * @return {String}
		 */
		_getIconClasses : function (iconInfo) {
			var cfg = this._cfg;
			var cssClasses = aria.core.TplClassLoader.addPrintOptions(this._cssClassNames, cfg.printOptions);
			if (iconInfo.cssClass) {
				cssClasses += " " + iconInfo.cssClass
			}
			if (cfg.block) {
				cssClasses += " xBlock"
			}
			return cssClasses;
		},

		/**
		 * Get the error icon when an icon is missing / wrongly spelled
		 * @return {Object} error icon description
		 */
		_getErrIcon : function () {
			if (!this.ERROR_ICON) {
				aria.widgets.Icon.prototype.ERROR_ICON = aria.widgets.AriaSkinInterface.getIcon('std', 'missing');
			}
			return this.ERROR_ICON;
		}
	}
});
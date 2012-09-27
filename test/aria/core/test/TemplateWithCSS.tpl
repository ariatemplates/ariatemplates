{Template {
	$classpath : "test.aria.core.test.TemplateWithCSS",
	$hasScript : true,
	$css : ["test.aria.core.test.CSSOfATemplate"],
	$macrolibs : {
		lib : "test.aria.core.test.MacroLibrary"
	},
	$texts : {
		txt : "test.aria.core.test.TextOfATemplate"
	},
	$res : {
		res : "test.aria.core.test.ResourceOfATemplate"
	}
}}

{macro main()}
Nothing here
{/macro}
{/Template}
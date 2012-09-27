// Template with a classpath which does not match its location.
// It should generate an error message.
{Template {
	$classpath:'test.aria.core.test.wrongclasspath.TPLWrongClasspath'
}}
	{macro main()}
	{/macro}

{/Template}

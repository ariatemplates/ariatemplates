{Template {
  $classpath : 'test.aria.widgets.wai.errorlist.binding.ErrorListBindingTpl'
}}

  {macro main()}

      - A Mandatory validator is used for all fields, and can be triggered onblur or onsubmit:
      <br/><br/>

      {@aria:ErrorList {
        margins: "10 1 10 1",
        title: "Error",
        filterTypes: ['E'],
        ariaLive: data.ariaLive,
        bind: {
            messages: {
                to: "errorMessages",
                inside: data
            },
            requireFocus: {
                to: "focus",
                inside: data
            }
        }
      }/}

      {@aria:Fieldset {
        label: "Please enter your details"
      }}

        {@aria:TextField {
          label: "First Name:",
          labelWidth: 100,
          bind: {
            value: {
              to: "firstName",
              inside: data
            }
          }
        }/}
        <br/>
        {@aria:TextField {
          label: "Last Name:",
          labelWidth: 100,
          bind: {
            value: {
              to: "lastName",
              inside: data
            }
          }
        }/}
        <br/>
        {@aria:TextField {
          label: "Phone Number:",
          labelWidth: 100,
          bind: {
            value: {
              to: "phoneNumber",
              inside: data
            }
          }
        }/}
        <br/>
        {@aria:TextField {
          id: "email",
          label: "Email Address:",
          labelWidth: 100,
          bind: {
            value: {
              to: "email",
              inside: data
            }
          }
        }/}
        <br/><br/>
        {@aria:Button {
          label: "Submit",
          onclick: {
            fn : "submit",
            scope : moduleCtrl
          }
        }/}
      {/@aria:Fieldset}
  {/macro}
{/Template}

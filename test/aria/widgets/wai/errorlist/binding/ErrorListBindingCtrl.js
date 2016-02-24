
Aria.classDefinition({
    $classpath : 'test.aria.widgets.wai.errorlist.binding.ErrorListBindingCtrl',
    $extends : 'aria.templates.ModuleCtrl',
    $implements : ['test.aria.widgets.wai.errorlist.binding.IErrorListBindingCtrl'],
    $dependencies : ['aria.utils.validators.Mandatory'],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._data = {
            firstName : "",
            lastName : "",
            phoneNumber : "",
            email : "",
            errorMessages : [],
            focus: false
        };
        this.myDataUtil = aria.utils.Data;
        this.validators = [];
    },
    $destructor : function () {

        var validators = this.validators;
        for(var i in validators) {
            validators[i].$dispose();
        }

        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.widgets.wai.errorlist.binding.IErrorListBindingCtrl",
        init : function (arg, cb) {
            var validatorPkg = aria.utils.validators;

            var firstNameValidator = new validatorPkg.Mandatory("The first name is a required field using a mandatory validator.");
            this.myDataUtil.setValidatorProperties(firstNameValidator, null, "onblur");
            this.validators.push(firstNameValidator);

            var lastNameValidator = new validatorPkg.Mandatory("The last name is a required field using a mandatory validator.");
            this.myDataUtil.setValidatorProperties(lastNameValidator, null, "onblur");
            this.validators.push(lastNameValidator);

            var emailValidator = new validatorPkg.Mandatory("The email is a required field using a mandatory validator.");
            this.myDataUtil.setValidatorProperties(emailValidator, null, "onblur");
            this.validators.push(emailValidator);

            var phoneNumberValidator = new validatorPkg.Mandatory("The phone number is a required field using a mandatory validator.");
            this.myDataUtil.setValidatorProperties(phoneNumberValidator, null, "onblur");
            this.validators.push(phoneNumberValidator);

            this.myDataUtil.setValidator(this._data, "firstName", firstNameValidator);
            this.myDataUtil.setValidator(this._data, "lastName", lastNameValidator);
            this.myDataUtil.setValidator(this._data, "email", emailValidator);
            this.myDataUtil.setValidator(this._data, "phoneNumber", phoneNumberValidator);

            this.$callback(cb);
        },
        submit : function () {
            var messages = {};
            this.myDataUtil.validateModel(this._data, messages);
            this.json.setValue(this._data, "errorMessages", messages.listOfMessages);
            if (messages.listOfMessages && messages.listOfMessages.length) {
                this.json.setValue(this._data, "focus", true);
            }
        }
    }
});

/********************************************************************************
 * SERVICE TO TRANSLATE MODEL VALIDATION ERROR MESSAGES INTO PROPER JSON FORMAT
 * WHICH COULD BE USED TO SEND TO THE FRONT END TO DISPLAY ERROR TOASTS
 * 
 * 
 * FOR EACH MODEL DEFINE VALIDATION MESSAGES LIKE ->
 * 
 *     validationMessages: {
 *       username: {
 *         required: 'Please fill in your name',
 *         string: 'Name should be a valid string',
 *         unique: 'Sorry, username already taken'
 *       },
 *       password: {
 *         required: 'Please fill in the password',
 *         string: 'Please fill in the password',
 *         minLength: 'password should be at least 6 characters long'
 *       }    
 *     }
 * 
 *   usage ->
 * 
 *   Users.create({}).exec(function(err, user) {
 *     if (err) {
 *       if err["error"] === "E_VALIDATION"
 * 
 *       // GETTING THE ERROR MESSAGES
 *       HandleValidation.transformValidationErrors(Users, err.invalidAttributes)
 *     }
 *   })
 *    
 *   OUTPUT ->
 *  
 *    {
 *	    username: [
 *        { string: 'Name should be a valid string' }, 
 *        { required: 'Please fill in your name' }
 *      ],
 *	    password: [
 *        { string: 'Please fill in the password' }, 
 *        { minLength: 'password should be at least 6 characters long'}, 
 *        { required: 'Please fill in the password' }
 *	    ]
 *    }
 * 
 */
exports.transformValidationErrors = function(model, validationError) {

    var validation_response = {};
    var messages = model.validationMessages;
    validation_fields = Object.keys(messages);

    validation_fields.forEach(function(validation_field) {

        if (validationError[validation_field]) {
            var processField = validationError[validation_field];
            processField.forEach(function(rule) {
                if (messages[validation_field][rule.rule]) {
                    if (!(validation_response[validation_field] instanceof Array)) {
                        validation_response[validation_field] = new Array();
                    }
                    var newMessage = {};
                    newMessage[rule.rule] = messages[validation_field][rule.rule];
                    validation_response[validation_field].push(newMessage);
                }
            });

        }
    });

    // TO RETURN ALL RULE ERRORS FOR ALL FIELDS, UNCOMMENT BELOW
    // return validation_response;

    // RETURNING ONLY ONE ERROR MESSAGE INSTEAD
    var firstError = getFirstProperty(getFirstProperty(validation_response)[0]);
    return firstError;

};

function getFirstProperty(jsonObj) {
    var firstProp;
    for(var key in jsonObj) {
        if(jsonObj.hasOwnProperty(key)) {
            firstProp = jsonObj[key];
            break;
        }
    }
    return firstProp;
}
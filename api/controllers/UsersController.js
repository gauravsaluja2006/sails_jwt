/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createNewUser: createNewUser
};

// FUNCTION TO HANDLE REQUEST TO CREATE NEW USER
// @param: first_name - User's First Name
// @param: last_name - User's Last Name
// @param: email - User's Email ID
// @param: username - User's Username
// @param: password - User's Password
function createNewUser(req, res) {

    console.log("GOT REQUEST TO CREATE A NEW USER");

    // RETURN OBJECT
    var returnObject = {
        user: null,
        statusCode: null,
        message: null
    };

    // RETURN STATUS CODES FOR THE API
    var USER_CREATED_SUCCESSFULLY_RETURN_CODE = 1;
    var VALIDATION_ERROR_RETURN_CODE = 2;
    var SERVER_ERROR_RETURN_CODE = 3;

    // ERROR TYPES
    var VALIDATION_ERROR_TYPE = "E_VALIDATION";
    var SERVER_ERROR_TYPE = "E_SERVER";

    // RETURN MESSAGES OF THE API
    var USER_CREATED_SUCCESSFULLY_MESSAGE = "User Created Successfully";
    var VALIDATION_ERROR_MSG = "Please fill in the details correctly";
    var SERVER_ERROR_MSG = "Some error occured";

    // CREATING NEW USER
    Users.create(req.body).exec(function(err, newUser) {

        // ERROR IN CREATION
        if (err) {

            // VALIDATION ERROR
            if (err["code"] == VALIDATION_ERROR_TYPE) {
                var validationErrorMessage = HandleValidation.transformValidationErrors(Users, err.invalidAttributes);
                returnObject.message = validationErrorMessage;
                returnObject.statusCode = VALIDATION_ERROR_RETURN_CODE;
                res.badRequest(returnObject);

            } else {

                // OTHER ERRORS
                returnObject.message = SERVER_ERROR_MSG;
                returnObject.statusCode = SERVER_ERROR_RETURN_CODE;
                res.badRequest(returnObject);
            }

        } else {
            // USER CREATED SUCCESSFULLY
            returnObject.user = newUser;
            returnObject.statusCode = USER_CREATED_SUCCESSFULLY_RETURN_CODE;
            returnObject.message = USER_CREATED_SUCCESSFULLY_MESSAGE;
            res.json(returnObject);
        }
    })
}


/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createNewUser: createNewUser,
    login: login,
    testLoginService: testLoginService
};

function testLoginService(req, res) {
    res.json({works: true})
} 

var bcrypt = require('bcrypt');

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

function login(req, res) {

    console.log("Login Request: ", req.body);

    // REQUEST BODY
    var email = req.body.username;
    var passwordAttempt = req.body.password;

    // FINDING THE USER IN THE DATABASE
    Users.findOne({
        or: [
            { username: email },
            { email: email }
        ]
    }, function(err, user) {

        // ERROR IN FINDING THE USER
        if (err) {
            return res.badRequest({
                error: true,
                message: 'Some Error Occurred. Please try again later'
            })
        }

        // USER NOT FOUND
        if (!user) {
            return res.badRequest({
                error: true,
                message: 'Invalid Username or Password'
            })
        }


        bcrypt.compare(passwordAttempt, user.password).then(isPasswordValid => {

            if (isPasswordValid) {

                console.log("Password Valid");

                // THIS IS THE PAYLOAD WHICH WILL BE ENCODED AND SAVED IN THE JWT
                var userData = {
                    id: user.id,
                    first_name: user.first_name,
                    username: user.username,
                    someRandomData: {}
                };
                console.log("Creating Token");
                var jwtToken = JWTService.encode(userData);
                console.log("GOT TOKEN: ", jwtToken);

                res.json({
                    error: false,
                    user: user,
                    token: jwtToken
                })

            } else {

                console.log("Password InValid");
                res.json(200, { error: true, message: 'Invalid Password' });
            }
        });

    });
}
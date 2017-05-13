/*****************************************************
 * POLICY TO CHECK IF A USER IS LOGGED IN
 * THIS IS A MIDDLEWARE FUNCTION AND WILL BE CALLED
 * BEFORE THE REQUEST IS SERVED AT THE CONTROLLERS.
 * IF THE USER DOES NOT HAVE A VALID JWT, 
 * RETURN 401 UNAUTHORIZED HTTP STATUS CODE
 *****************************************************/
module.exports = function(req, res, next) {

    var token;

    /**************************************************************
     * JWT TOKEN IS ADDED IN Authorization HEADER IN HTTP REQUEST
     *************************************************************/
    if (req.headers && req.headers.authorization) {

        // HEADER FORMAT --> Authorization: Bearer [TOKEN]
        var parts = req.headers.authorization.split(' ');

        if (parts.length == 2) {

            var scheme = parts[0],
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            } else {
                return res.json(401, { err: 'Format is Authorization: Bearer [token]' });
            }

        } else {
            // INVALID TOKEN FORMAT
            return res.json(401, { err: 'Format is Authorization: Bearer [token]' });
        }
        
    } else {
        return res.json(401, { err: 'No Authorization header was found' });
    }

    JWTService.verify(token, function(isTokenValid, payload) {

        if (!isTokenValid) return res.json(401, { err: 'Invalid Token!' });

        req.token = payload; // THIS IS THE DECRYPTED TOKEN OR THE PAYLOAD YOU PROVIDED
        next();
    });
};
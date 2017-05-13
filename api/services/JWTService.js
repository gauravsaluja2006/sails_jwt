// REQUIRING THE CRYPTO LIBRARY TO HASH DATA
var crypto = require('crypto');

module.exports = {
    encode: encode,
    verify: decode
}

// SHOULD MOVE THIS TO ENVIRONMENT VARIABLES FOR SECURITY PURPOSES
var JWT_SECRET = 'someSecretToHashAgainst';

function encode(payload) {

    // ALGORITHM USED TO CREATE HASH/SIGNATURE
    var algorithm = 'HS256';

    // JWT HEADER
    var header = {
        'typ': 'jwt',
        'alg': algorithm
    }

    // BASE64 ENCODE HEADER AND PAYLOAD
    var jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));

    // ADD SIGNATURE TO THE JWT
    return jwt + '.' + sign(jwt, JWT_SECRET);
}

function sign(str, key) {
    // CREATE HASH OF THE BASE64 ENCODED HEADER AND PAYLOAD
    return crypto.createHmac('SHA256', JWT_SECRET).update(str).digest('base64');
}

function base64Encode(str) {
    return new Buffer(str).toString('base64');
}


function decode(token, callback) {

    // SPLITTING HEADER, PAYLOAD AND SIGNATURE
    var segments = token.split('.');

    var header = JSON.parse(base64Decode(segments[0]));
    var payload = JSON.parse(base64Decode(segments[1]));

    var rawSignature = segments[0] + '.' + segments[1];

    if( !verify(rawSignature, JWT_SECRET, segments[2])) {
        return callback(false, null);
    } else {
        return callback(true, payload);
    }
}

function base64Decode(str) {
    return new Buffer(str, 'base64').toString();
}

function verify(raw, secret, signature) {
    return signature === sign(raw, secret);
}
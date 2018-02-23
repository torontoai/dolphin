var validator = require('validator'); // github.com/chriso/validator.js

/**
 * extract_validation_error does what its name suggests
 * given that the error is not in a very useable format we
 * need to extract it into a simple set of key:value pairs
 * @param {Object} error see: http://git.io/vcwiU
 * @returns {Object} err - the simplified error object
 */
function extract_validation_error(error){
    var key = error.data.details[0].path;
    err = {}
    err[key] = {
        class   : 'input-error',                // css class
        message : error.data.details[0].message // Joi error message
    }
    return err;
}

/**
 * return_values extracts the values the person submitted if they
 * submitted the form with incomplete or invalid data so that
 * the form is not "wiped" each time it gets valdiated!
 * @param {Object} error - see: http://git.io/vciZd
 * @returns {Object} values - key:value pairs of the fields
 * with the value sent by the client.
 */
function return_form_input_values(error) {
    // var values;
    // if(error.data && error.data._object) { // see: http://git.io/vciZd
    var values = {};
    var keys = Object.keys(error.data._object)
    keys.forEach(function(k){
        values[k] = validator.escape(error.data._object[k]);
    });
    // }
    return values;
}

/**
 * register_handler is a dual-purpose handler that initially renders
 * the registration form but is re-used to display the form with any
 * Joi validation errors to the client until they input valid info
 * @param {Object} request - the hapi request object
 * @param {Object} reply - the standard hapi reply object
 * @param {String} source - source of the invalid field e.g: 'payload'
 * @param {Object} error - the error object prepared for the client
 * response (including the validation function error under error.data
 */
function register_handler(request, reply, source, error) {
    // show the registration form until its submitted correctly
    if(!request.payload || request.payload && error) {
        var errors, values; // return empty if not set.
        if(error && error.data) { // means the handler is dual-purpose
            errors = extract_validation_error(error); // the error field + message
            values = return_form_input_values(error); // avoid wiping form data
        }
        return reply.view('index', {
            title  : 'Please Register ' + request.server.version,
            error  : errors, // error object used in html template
            values : values  // (escaped) values displayed in form inputs
        }).code(error ? 400 : 200);
    }
    else { // once successful, show welcome message!
        console.log('hello world');
        console.log('request.payload.asset: ' + request.payload.asset);
        console.log('deposit: ' + request.payload.deposit);
        console.log('language: ' + request.payload.language);
        console.log('validation: ' + request.payload.validation);
        console.log('history: ' + request.payload.history);
        console.log('plan: ' + request.payload.plan);

        var ip;
        if (request.headers['x-forwarded-for']) {
            ip = request.headers['x-forwarded-for'].split(",")[0];
        } else if (request.connection && request.connection.remoteAddress) {
            ip = request.connection.remoteAddress;
        } else if (request.socket && request.socket.remoteAddres){
            ip = request.socket.remoteAddres;
        } else if (request.connection && request.connection.socket && request.connection.socket.remoteAddress){
            ip = request.connection.socket.remoteAddress;
        } else {
            ip = request.ip;
        }

        return reply.view('success', {
            name   : validator.escape(request.payload.name),
            email  : validator.escape(request.payload.email)
        })
    }
}

module.exports = register_handler;

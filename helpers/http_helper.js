var http = require( 'http' );
/**
* application global info for api connection
@Q?dW]VG!74nK+Ym
**/
var g_opts = {
    hostname : 'balpres-be-gunt2raro.c9users.io',
    api_uri : 'http://balpres-be-gunt2raro.c9users.io:8080/api/',
    port : '8080',
    token : 'cmVzZXJ2YXRpb25zX2FwcGxpY2F0aW9uOkBRP2RXXVZHITc0bksrWW0='
};

/**
* Get the full api uri compose with the model and the url data
**/
var get_api_uri = function( model, url_data ) {
    return g_opts.api_uri + model + url_data;
};

/**
* Get the basic authorization appliation header
**/
var get_basic_auth_app_header = function( ) {
    return 'Basic ' + g_opts.token;
};

/**
* Get the user basic authorization appliation header
* with pass and username
**/
var get_user_basic_auth = function( username, password ) {
    return( new Buffer( username + ':' + password ).toString( 'base64' ) );
};

/**
* get the basic authentication string
* with the token
**/
var get_basic_auth_w_token = function( token ) {
    return( 'Basic ' + token );
};

// do magic
module.exports.g_opts = g_opts;
module.exports.get_basic_auth_app_header = get_basic_auth_app_header;
module.exports.get_api_uri = get_api_uri;
module.exports.get_user_basic_auth = get_user_basic_auth;
module.exports.get_basic_auth_w_token = get_basic_auth_w_token;

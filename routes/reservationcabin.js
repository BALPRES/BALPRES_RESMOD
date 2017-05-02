'use strict';

var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var urlLib = require( 'url' );
var request = require( 'request' );
var http_helper = require( '../helpers/http_helper' );
var encryption_system = require( '../helpers/encryption_helper' );
var router = express.Router();
var jsonParser = bodyParser.json();

/**
* get reservtion cabins by dates
**/
router.get( '/', jsonParser, function( req, res ) {

	var url_parts = urlLib.parse(req.url, true);

    request(
        {
            url : http_helper.get_api_uri( 'reservation/cabins/', '?d1=' + url_parts.query.d1 + '&d2=' + url_parts.query.d2 ),
            method : 'GET',
            json : true,
            headers : {
                'Authorization' : http_helper.get_basic_auth_app_header()
            }
        },
        function( error, response, body ){
            switch (response.statusCode) {
                case 200 :
                    var data_from_server = encryption_system.decryptLongJSON( body );
                    var jsonData = JSON.stringify({
                        error : false,
                        data : data_from_server.data
                    });
                    res.send( jsonData );
                    break;
                default :
                    var data_from_server = encryption_system.decryptLongJSON( body );
                    var jsonData = JSON.stringify({
                        error : true,
                        message : data_from_server.message
                    });
                    res.send( jsonData );
                    break;
            }
        }
    );
});

/**
* get reservation cabins by token
**/
router.get( '/:token', jsonParser, function( req, res ) {

    var token = req.params.token;

    request(
        {
            url : http_helper.get_api_uri( 'balpresresclient/reservationcabin/', token ),
            method : 'GET',
            json : true,
            headers : {
                'Authorization' : http_helper.get_basic_auth_app_header()
            }
        },
        function( error, response, body ) {
            if( response ) {
                switch (response.statusCode) {
                    case 200:
                        var data_from_server = encryption_system.decryptLongJSON( body );
                        var jsonData = JSON.stringify({
                            error : false,
                            data : data_from_server.data
                        });
                        res.send( jsonData );
                        break;
                    default:
                        var data_from_server = encryption_system.decryptLongJSON( body );
                        var jsonData = JSON.stringify({
                            error : true,
                            message : data_from_server
                        });
                        res.send( jsonData );
                        break;
                }
            }
        }
    );
});

/**
* get cabin by id
**/
router.get( '/cabin/:id', jsonParser, function( req, res ) {

    var id = req.params.id;

    request(
        {
            url : http_helper.get_api_uri( 'cabin/detail/', id ),
            method : 'GET',
            json : true,
            headers : {
                'Authorization' : http_helper.get_basic_auth_app_header()
            }
        },
        function( error, response, body ) {
            if( response ) {
                switch (response.statusCode) {
                    case 200:
                        var data_from_server = encryption_system.decryptLongJSON( body );
                        var jsonData = JSON.stringify({
                            error : false,
                            data : data_from_server.data
                        });
                        res.send( jsonData );
                        break;
                    default:
                        var data_from_server = encryption_system.decryptLongJSON( body );
                        var jsonData = JSON.stringify({
                            error : true,
                            message : data_from_server
                        });
                        res.send( jsonData );
                        break;
                }
            }
        }
    );
});

/**
* new reservation cabin
**/
router.post( '/new/', jsonParser, function( req, res ) {

    request(
        {
            url : http_helper.get_api_uri( 'reservation/cabin/new/', '' ),
            method : 'POST',
            json : true,
            body : encryption_system.encryptLongJSON( req.body ),
            headers : {
                'Authorization' : http_helper.get_basic_auth_app_header()
            }
        },
        function( error, response, body ) {
            switch( response.statusCode ) {
                case 201 :
                    var data_from_server = encryption_system.decryptLongJSON( body );
                    var jsonData = JSON.stringify({
                        error : false,
                        data : data_from_server.data
                    });
                    res.send( jsonData );
                    break;
                default :
                    var data_from_server = encryption_system.decryptLongJSON( body );
                    var jsonData = JSON.stringify({
                        error : true,
                        message : data_from_server.message
                    });
                    res.send( jsonData );
                    break;
            }
        }
    );
});

module.exports = router;

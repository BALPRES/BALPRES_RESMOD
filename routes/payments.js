var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var urlLib = require( 'url' );
var request = require( 'request' );
var http_helper = require( '../helpers/http_helper' );
var encryption_system = require( '../helpers/encryption_helper' );
var router = express.Router();
var jsonParser = bodyParser.json();
var MP = require( 'mercadopago' );

var config = {
	    "client_id": "2620041704606675",
	    "client_secret": "ek7dhDMzyAx3N2VXoZCQ4awuPi3F12CA"
    };

/**
* This will create with a reservation a preference for the mercadopago api
**/
router.post( '/mercadopago', jsonParser, function( req, res ) {
    console.log( req.body );
    var mp = new MP (config.client_id, config.client_secret);
    var reservation = req.body;
    var preference = {
            "items": [
                {
                    "id" : reservation.extended_token,
                    "title": "Reservación Cabañas",
                    "quantity": 1,
                    "currency_id": "MXN",
                    "unit_price": parseFloat( reservation.total )
                }
            ],
            "back_urls" : {
                "failure" : "https://reservaciones.balneariolaspalmas.co/#/reservations/paymenterror/",
                "pending" : "https://reservaciones.balneariolaspalmas.co/#/reservations/cabin/" + reservation.extended_token,
                "success" : "https://reservaciones.balneariolaspalmas.co/#/reservations/cabin/" + reservation.extended_token
            },
            "auto_return" : "all",
            "external_reference" : reservation.extended_token
        };

    mp.createPreference (preference, function (err, data){
        if( err ) {
            var jsonData = JSON.stringify({
                error : true,
                message : err
            });
            res.send(jsonData);
        } else {
            var jsonData = JSON.stringify({
                error : false,
                data : data
            });
            res.send( jsonData );
        }
    });
});

/**
* This will get the preference object from the mercado pago api by id
**/
router.get( '/mercadopago/:id', jsonParser, function( req, res ) {
    var mp = new MP( config.client_id, config.client_secret );
    mp.getPreference( req.params.id, function( err, data ) {
        if( err ) {
            var jsonData = JSON.stringify({
                error : true,
                message : err
            });
            res.send(jsonData);
        } else {
            var jsonData = JSON.stringify({
                error : false,
                data : data
            });
            res.send( jsonData );
        }
    });
});

router.get( '/mercadopago/payment/:collection_id', jsonParser, function( req, res ) {
    var mp = new MP( config.client_id, config.client_secret );
    var filters = {
        "id" : parseInt( req.params.collection_id )
    };
    mp.searchPayment (filters, function (err, data){
        console.log(data);

        if( err ) {
            var jsonData = JSON.stringify({
                error : true,
                message : err
            });
            res.send(jsonData);
        } else {
            var jsonData = JSON.stringify({
                error : false,
                data : data
            });
            res.send( jsonData );
        }
    });
});

module.exports = router;

angular.module( 'payment-service', [])
    .factory( 'PaymentRepository', [ '$http', function( $http ) {
        return({
            reservationPayment : function( reservation ) {
                return $http.post( '/payments/mercadopago', JSON.stringify( reservation ) );
            },
            getPayment : function( collection_id ) {
                return $http.get( '/payments/mercadopago/payment/' + collection_id );
            }
        });
    }])
    .service( 'PaymentService', [ function() {
        this.initMercadoPago = function() {
            Mercadopago.setPublishableKey("TEST-a0ed5203-2766-4e7e-b045-0d927e94aa0d");
            console.log("Init mercado pago test.");
        };

    }]);

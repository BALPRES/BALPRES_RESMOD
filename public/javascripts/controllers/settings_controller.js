app
    .factory( 'SettingsRepository', [ '$http', function( $http ) {
        return({
            getTicketPrices : function( ) {
                return $http({
                    method : 'GET',
                    url : '/settings/ticketprices'
                });
            }
        });
    }]);

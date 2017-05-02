app
    .factory( 'ReservationCabinRepository', [ '$http', '$cookies', function( $http, $cookies ) {
        return({
            getById : function( id ) {
                return $http({
                    method : 'GET',
                    url : '/reservationcabin/' + id
                });
            },
            getCabinById : function( id ) {
                return $http({
                    method : 'GET',
                    url : '/reservationcabin/cabin/' + id
                });
            },
            getCabinsByDate : function( data ) {
                var date_1 = data.date_start.getFullYear() + '-' + ( data.date_start.getMonth() + 1 ) + '-' + data.date_start.getDate(),
                    date_2 = data.date_end.getFullYear() + '-' + ( data.date_end.getMonth() + 1 ) + '-' + data.date_end.getDate();
                $cookies.put( 'dates', JSON.stringify( data ) );
                return $http({
                    url : '/reservationcabin/?d1=' + date_1 + '&d2=' + date_2,
                    method : 'GET'
                });
            },
            getDatesOnSession : function() {
                return JSON.parse( $cookies.get( 'dates' ) );
            },
            reserveCabin : function( data ) {
                return $http({
                    method : 'POST',
                    url : '/reservationcabin/new/',
                    data : JSON.stringify( data )
                });
            }
        });
    }])
    .controller( 'reservationcabin-controller', [
                                                    '$scope',
                                                    '$rootScope',
                                                    '$routeParams',
                                                    '$location',
                                                    'ReservationCabinRepository',
                                                    'SettingsRepository',
                                                    'DocumentService',
                                                    function(   $scope,
                                                                $rootScope,
                                                                $routeParams,
                                                                $location,
                                                                ReservationCabinRepository,
                                                                SettingsRepository,
                                                                DocumentService ) {
        if( $routeParams.token ) {

            $rootScope.title = "Detalle reservación [Balneario Las Palmas]";

            ReservationCabinRepository.getById( $routeParams.token ).success( function( data ) {
                if( !data.error ) {
                    $scope.reservation = data.data;
                } else {
                    $scope.errors = data.message;
                }
            }).error( function( error ) {
                $scope.errors = error;
            });

            SettingsRepository.getTicketPrices().success( function( data ) {
                if( !data.error ) {
                    var ticketprices = data.data;
                    $scope.ticket_price_child = ticketprices[0].price;
                    $scope.ticket_price_adult = ticketprices[1].price;
                } else {
                    $scope.errors = data.message;
                }
            }).error( function( error ) {
                $scope.errors = error;
            });

            $scope.print = function() {
                DocumentService.printReservation( $scope.reservation, $scope.ticket_price_child, $scope.ticket_price_adult );
            };

        } else if( $routeParams.id ) {

            $rootScope.title = "Reservación de cabaña [Balneario Las Palmas]";

            var initReservation = function( dates ) {
                var d_e = new Date( dates.date_end ),
                    d_s = new Date( dates.date_start );
                $scope.days = Math.round( ( d_e - d_s ) / ( 1000 * 60 * 60 * 24 ) );
                $scope.reservation = {
                    total : 0,
                    max_guests : 0,
                    max_extra_guests : 0,
                    date_start : dates.date_start,
                    date_end : dates.date_end,
                    reservation_type : 1,
                    promotion : {},
                    details : [],
                    extra_guests_child : 0,
                    extra_guests_adult : 0,
                    reservationinfo : {
                        full_name : "",
                        email : "",
                        address1 : "",
                        address2 : "",
                        zip_code : 0,
                        state : "Zacatecas",
                        country : "México",
                        city : "Fresnillo",
                        phone_number : ""
                    }
                };
            };

            var calculate_total = function() {
                var d_s = new Date( $scope.reservation.date_start ),
                    d_e = new Date( $scope.reservation.date_end ),
                    sum = $scope.reservation.details.map( d => parseInt( d.product.price ) ).reduce( ( a, b ) => ( a + b ), 0 );
                $scope.reservation.max_guests = $scope.reservation.details.map( d => parseInt( d.product.cabin_type.max_guests ) ).reduce( ( a, b ) => ( a + b ), 0 );
                $scope.reservation.max_extra_guests = $scope.reservation.details.map( d => parseInt( d.product.cabin_type.max_extra_guests ) ).reduce( ( a, b ) => ( a + b ), 0 );
                $scope.reservation.total = $scope.days * ( ( sum ) + ( $scope.reservation.extra_guests_adult * $scope.ticket_price_adult ) + ( $scope.reservation.extra_guests_child * $scope.ticket_price_child ) );
            };

            var getCabin = function( id ) {
                ReservationCabinRepository.getCabinById( id ).success( function( data ) {
                    if ( !data.error ) {
                        $scope.cabin = data.data;
                        $scope.reservation.details.push( { product : $scope.cabin, qty : 1 } );
                        SettingsRepository.getTicketPrices().success( function( data ) {
                            if( !data.error ) {
                                var ticketprices = data.data;
                                $scope.ticket_price_child = ticketprices[0].price;
                                $scope.ticket_price_adult = ticketprices[1].price;
                                calculate_total();
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            initReservation( ReservationCabinRepository.getDatesOnSession() );

            getCabin( $routeParams.id );

            $scope.reservePay = function() {
                console.log( "This is reservation and pay test" );
                console.log( $scope.reservation );
            };

            $scope.reserveAndPrint = function() {
                var d_s = new Date( $scope.reservation.date_start ),
                    d_e = new Date( $scope.reservation.date_end );
                $scope.reservation.date_start = d_s.getFullYear() + "/" + ( d_s.getMonth() + 1 ) + "/" + d_s.getDate();
                $scope.reservation.date_end = d_e.getFullYear() + "/" + ( d_e.getMonth() + 1 ) + "/" + d_e.getDate();
                ReservationCabinRepository.reserveCabin( $scope.reservation ).success( function( data ) {
                    if( !data.error ) {
                        $scope.reservation = data.data;
                        $location.path( '/reservations/cabin/' + $scope.reservation.extended_token );
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            $scope.red_extra_adult = function() {
                if( $scope.reservation.extra_guests_adult > 0  ) {
                    $scope.reservation.extra_guests_adult--;
                    calculate_total();
                }
            };

            $scope.sum_extra_adult = function() {
                if( $scope.reservation.extra_guests_adult  < ( $scope.reservation.max_extra_guests - $scope.reservation.extra_guests_child ) ) {
                    $scope.reservation.extra_guests_adult++;
                    calculate_total();
                } else {
                    alert( "La capacidad máxima es de " + $scope.reservation.max_guests + " más " + $scope.reservation.max_extra_guests + " extra." );
                }
            };

            $scope.red_extra_child = function() {
                if( $scope.reservation.extra_guests_child > 0  ) {
                    $scope.reservation.extra_guests_child--;
                    calculate_total();
                }
            };

            $scope.sum_extra_child = function() {
                if( $scope.reservation.extra_guests_child  < ( $scope.reservation.max_extra_guests - $scope.reservation.extra_guests_adult ) ) {
                    $scope.reservation.extra_guests_child++;
                    calculate_total();
                } else {
                    alert( "La capacidad máxima es de " + $scope.reservation.max_guests + " más " + $scope.reservation.max_extra_guests + " extra." );
                }
            };

        } else {

            $rootScope.title = "Búsqueda de reservaciones [Balneario Las Palmas]";

            var validateDates = function( date1, date2 ) {
                return date1 && date2;
            };

            $scope.search = function() {
                var date1 = document.getElementById( 'date_start' ).value,
                    date2 = document.getElementById( 'date_end' ).value;
                if( validateDates( date1, date2 ) ) {
                    ReservationCabinRepository.getCabinsByDate( { "date_start" : new Date( date1 ), "date_end" : new Date( date2 ) } ).success( function( data ) {
                        if( !data.error ) {
                            $scope.cabins = data.data;
                            if( $scope.cabins.length == 0 ) {
                                $scope.message = "Parece que durante esas fechas no tenemos reservaciones disponibles, seleccione otra fecha.";
                            } else {
                                $scope.message = "";
                            }
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                } else {
                    alert( "Seleccione fechas válidas por favor." );
                }
            };
        }

    }]);

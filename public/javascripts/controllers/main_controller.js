var app = angular.module( 'BALPRES_RESERVATIONS', [ 'ngRoute', 'ngCookies', 'ngMaterial', 'document-service' ])
    .config([ '$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
        $routeProvider
            .when( '/cabins/', {
                templateUrl : '../views/search_reservationcabin.html'
            })
            .when( '/reservations/cabin/:token', {
                templateUrl : '../views/reservations/cabin_detail.html'
            })
            .when( '/reservations/new/:id', {
                templateUrl : '../views/reservations/cabin_new.html'
            })
            .otherwise({
                templateUrl : '/404.html'
            });
    }])
    .filter( 'dateTimeFilter', function() {
        return function( date ) {
            var d = new Date( date );
            var month = new Array();
            month[0] = "Enero";
            month[1] = "Febrero";
            month[2] = "Marzo";
            month[3] = "Abril";
            month[4] = "Mayo";
            month[5] = "Junio";
            month[6] = "Julio";
            month[7] = "Agosto";
            month[8] = "Septiembre";
            month[9] = "Octubre";
            month[10] = "Noviembre";
            month[11] = "Diciembre";
            return d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear() + " " + ( d.getHours() < 10 ? ("0"+d.getHours()) : d.getHours() ) + ":" + (d.getMinutes()<10?("0"+d.getMinutes()):d.getMinutes());
        };
    })
    .filter( 'dateFilter', function() {
        return function( date ) {
            var d = new Date( date );
            var month = new Array();
            month[0] = "Enero";
            month[1] = "Febrero";
            month[2] = "Marzo";
            month[3] = "Abril";
            month[4] = "Mayo";
            month[5] = "Junio";
            month[6] = "Julio";
            month[7] = "Agosto";
            month[8] = "Septiembre";
            month[9] = "Octubre";
            month[10] = "Noviembre";
            month[11] = "Diciembre";
            return d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear();
        };
    })
    .directive('stringToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function(value) {
                    return parseFloat(value);
                });
            }
        };
    });

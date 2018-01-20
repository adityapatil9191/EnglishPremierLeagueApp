myapp.config(['$routeProvider', function($routeProvider) { 
$routeProvider. 
when('/', { 
templateUrl: 'views/index-view.html', 
controller: 'appCtrl' 
}).
when('/match/:matchId',{
templateUrl:'views/match.html',
controller:'matchCtrl'

}). 
when('/stats',{
templateUrl:'views/stats.html',
controller:'statsCtrl'
}).

otherwise({ 
redirectTo: '/' 
}); 
}]);


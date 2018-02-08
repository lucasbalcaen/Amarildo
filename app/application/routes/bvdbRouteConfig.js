/**
 * Created by lucas on 20/06/2016.
 */

var bvdbRouteConfig = function ($routeProvider, $httpProvider, $locationProvider)
{

    $routeProvider.
    when('http://localhost:63342/Website/app/index.html',{
        controller: 'homeController',
        templateUrl: './application/views/homepage.html'
    });

    $locationProvider.html5Mode(true);
};

module.exports = bvdbRouteConfig;
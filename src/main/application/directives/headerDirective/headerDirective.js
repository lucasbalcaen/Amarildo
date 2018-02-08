/**
 * Created by lucas on 20/06/2016.
 */
var headerDirective = function ($location) {
    return {
        restrict: 'E',
        scope: {

        },
        templateUrl: 'application/directives/headerDirective/header.html',
        link: function(scope, element, attributes){

        }
    };
};

module.exports = headerDirective;
/**
 * Created by lucas on 20/06/2016.
 */

var angular = require('angular');
var ngRoute = require('../../bower_components/angular-route/angular-route.min');

var bvdbWebsite = angular.module('bvdbWebsite',['ngRoute']);

//route
var routeConfig = require('./application/routes/bvdbRouteConfig');
bvdbWebsite.config(routeConfig);

//controllers

var homeController = require ('./application/controllers/homeController');

bvdbWebsite.controller('homeController',homeController);

//directives
var headerDirective = require('./application/directives/headerDirective/headerDirective');

bvdbWebsite.directive('header',headerDirective);

bvdbWebsite.directive('scrollToItem', function() {
    return {
        restrict: 'A',
        scope: {
            scrollTo: "@"
        },
        link: function(scope, $elm,attr) {

            $elm.on('click', function() {
                $('html,body').animate({scrollTop: ($(scope.scrollTo).offset().top -50) }, "slow");
            });
        }
    }});

$(document).ready(function() {

    new WOW().init();

});

'use strict';

/**
 * @ngdoc overview
 * @name juniperApp
 * @description
 * # juniperApp
 *
 * Main module of the application.
 */
angular
  .module('juniperApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap', 
    'ui.bootstrap.datetimepicker'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

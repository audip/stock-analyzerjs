'use strict';

angular.module('stockAnalyzerApp', [
  'stockAnalyzerApp.auth',
  'stockAnalyzerApp.admin',
  'stockAnalyzerApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });

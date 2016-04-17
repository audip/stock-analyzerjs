'use strict';

angular.module('stockAnalyzerApp.auth', [
  'stockAnalyzerApp.constants',
  'stockAnalyzerApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });

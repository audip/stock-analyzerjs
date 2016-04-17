'use strict';

angular.module('stockAnalyzerApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<main></main>'
      });
  });

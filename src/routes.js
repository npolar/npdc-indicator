'use strict';

/**
 * @ngInject */
var routes = function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider

  // timeseries
  .when('/timeseries/:id/edit', {
    templateUrl: 'indicator-timeseries/timeseries.html', controller: 'TimeseriesEditController'
  })
  .when('/timeseries/:id', {
    templateUrl: 'indicator-timeseries/timeseries.html', controller: 'TimeseriesShowController'
  })
  .when('/timeseries', {
    templateUrl: 'indicator-timeseries/timeseries-search.html',
    controller: 'TimeseriesSearchController',
    reloadOnSearch: false
  })

  // parameter
  .when('/parameter/:id/show', {
    redirectTo: '/parameter/:id'
  })
  .when('/parameter', {
    template: '<npdc:search-input feed="feed"></npdc:search-input><npdc:search feed="feed"></npdc:search>',
    controller: 'ParameterSearchController',
    reloadOnSearch: false
  })
  .when('/parameter/:id', {
    templateUrl: 'indicator-parameter/parameter-show.html', controller: 'ParameterShowController'
  })
  .when('/parameter/:id/edit', {
    templateUrl: 'indicator-parameter/parameter-edit.html', controller: 'ParameterEditController'
  })
  
  // Default route
  .when('/', {
    redirectTo: '/timeseries'
  })    
  ;

};
module.exports = routes;

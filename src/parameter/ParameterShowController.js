'use strict';
var _ = require('lodash');

// @ngInject
var ParameterShowController = function($scope, $routeParams, $location, $controller, $route,
  NpolarTranslate, npolarApiConfig, Indicator, Parameter, Timeseries) {
  
  // Extend NpolarApiBaseController and inject resource
  $controller("NpolarBaseController", {$scope: $scope});
  $scope.resource = Parameter;
  $scope.T = NpolarTranslate;
  
  
  // Fetch parameter document with parent indicator and timeseries children
  Parameter.fetch($routeParams, function(parameter) {
    
    
    $scope.document = parameter;

    var filter_timeseries_ids = _.map(parameter.timeseries, function(t) {
      return t.match(/\/([-\w]+)$/)[1];
    });
    
    if (filter_timeseries_ids.length > 0) {
      // Fetch timeseries children
      Timeseries.array({ "filter-id": filter_timeseries_ids.join("|"), fields: "*", limit: filter_timeseries_ids.length}, function(timeseries) {
        
        $scope.timeseries = timeseries;
        
        console.log(timeseries);
        
      }, function(error) { // Timeseries.array
        $scope.error = error;
      });
    
    }
    
    // Fetch indicator parent
    // FIXME Atm. only "id" and not link.rel=edit is guaranteed...
    var parameter_uri = "http:"+ npolarApiConfig.base +"/indicator/parameter/"+ parameter.id;
    
    Indicator.array({ "filter-parameters": parameter_uri, fields: "*", limit: 1 }, function(indicators) {
      $scope.indicator = indicators[0];
    }, function(error) { // Indicator.array
      $scope.error = error;
    });
    
    
  }, function(error) { // Parameter.fetch
    $scope.error = error;
  });
  
};

module.exports = ParameterShowController;
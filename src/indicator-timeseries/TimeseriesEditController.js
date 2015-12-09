'use strict';

// @ngInject
var TimeseriesEditController = function($scope, $controller, $routeParams, NpolarApiSecurity, Timeseries, Parameter, Indicator) {
  
  const schema = '//api.npolar.no/schema/indicator-timeseries-1';
  //const schema = 'indicator-timeseries/indicator-timeseries-1.json';
  
  $controller("NpolarEditController", {$scope: $scope});
  $scope.resource = Timeseries;

  $scope.formula.schema = schema;
  $scope.formula.form = "indicator-timeseries/timeseries-formula.json";
  $scope.formula.template = 'material';

  $scope.editAction = function() {
    Timeseries.fetch($routeParams, function(timeseries) {
      
      $scope.document = timeseries;
      $scope.formula.model = timeseries;
      
      let uri = NpolarApiSecurity.canonicalUri(`/indicator/timeseries/${timeseries.id}`, 'http');
      
      Parameter.array({ "filter-timeseries": uri, fields: "*", limit: 1 }, function(parameters) {
        $scope.parameter = parameters[0];
        
        let parameterUri =  NpolarApiSecurity.canonicalUri(`/indicator/parameter/${$scope.parameter.id}`, 'http');
        Indicator.array({ "filter-parameters": parameterUri, fields: "*", limit: 1 }, function(indicators) {
          $scope.indicator = indicators[0];
        });  
      });
      
    }); // end Timeseries.fetch
  };
  $scope.edit();

};
module.exports = TimeseriesEditController;
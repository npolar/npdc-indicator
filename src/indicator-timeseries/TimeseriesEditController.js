'use strict';

// @ngInject
var TimeseriesEditController = function($scope, $controller, $routeParams, Timeseries, NpolarTranslate) {
  
  const schema = '//api.npolar.no/schema/indicator-timeseries-1';
  //const schema = 'schema/indicator-timeseries-1.json';
  
  $controller("NpolarEditController", {$scope: $scope});
  $scope.resource = Timeseries;
  $scope.T = NpolarTranslate;
  
  $scope.formula.schema = schema;
  $scope.formula.form = "timeseries/timeseries-formula.json";
  $scope.formula.template = 'material';
  
  $scope.edit();
  
};
module.exports = TimeseriesEditController;
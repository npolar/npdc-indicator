'use strict';

// @ngInject
var TimeseriesEditController = function($scope, $controller, $routeParams, Timeseries, NpolarTranslate) {
  
  $controller("NpolarEditController", {$scope: $scope});
  $scope.resource = Timeseries;
  $scope.T = NpolarTranslate;
  
  $scope.formula.schema = '//api.npolar.no/schema/indicator-timeseries-1';
  $scope.formula.form = "timeseries/timeseries-formula.json";
  $scope.formula.template = 'material';
  
  $scope.edit();
  
};
module.exports = TimeseriesEditController;
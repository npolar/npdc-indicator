'use strict';

// @ngInject
var TimeseriesEditController = function($scope, $controller, NpolarApiSecurity, Timeseries, Parameter) {

  const schema = '//api.npolar.no/schema/indicator-timeseries-1';

  $controller("NpolarEditController", {$scope: $scope});
  $scope.resource = Timeseries;

  $scope.formula.schema = schema;
  $scope.formula.form = "indicator-timeseries/timeseries-formula.json";

  let resource = $scope.edit();

  if (resource && resource.$promise) {
    resource.$promise.then(timeseries => {

      let uri = NpolarApiSecurity.canonicalUri(`/indicator/timeseries/${timeseries.id}`, 'http');
      Parameter.array({ "filter-timeseries": uri, fields: "*", limit: 1 }, parameters => {
      $scope.parameter = parameters[0];
      });
    });
  }

};
module.exports = TimeseriesEditController;

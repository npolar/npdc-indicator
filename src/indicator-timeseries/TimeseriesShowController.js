'use strict';

// @ngInject
var TimeseriesShowController = function($scope, $controller, $routeParams, NpolarApiSecurity, Timeseries, Parameter) {
  
  $controller("NpolarBaseController", {$scope: $scope});
  $scope.resource = Timeseries;
  
  // Load timeseries and fetch parent parameter
  let resource = $scope.show().$promise.then(timeseries => {

      let uri = NpolarApiSecurity.canonicalUri(`/indicator/timeseries/${timeseries.id}`, 'http');
      Parameter.array({ "filter-timeseries": uri, fields: "*", limit: 1 }, parameters => {
        $scope.parameter = parameters[0];
      });
    }
  );
  
};
module.exports = TimeseriesShowController;

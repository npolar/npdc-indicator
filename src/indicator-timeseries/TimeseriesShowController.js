'use strict';

// @ngInject
let TimeseriesShowController = function($scope, $controller, $timeout,
  $filter, NpolarApiSecurity, npdcAppConfig, Timeseries, Parameter, google, Sparkline) {

  $controller("NpolarBaseController", {$scope: $scope});
  $scope.resource = Timeseries;
  $scope.document = {};

  let chartElement = Sparkline.getElement();
  if (chartElement) {
    chartElement.innerHTML = '';
  }

  // Load timeseries and fetch parent parameter
  $scope.show().$promise.then(timeseries => {

    //npdcAppConfig.cardTitle = $filter('title')(timeseries.titles);
    $scope.data = timeseries.data;

    if ($scope.data && $scope.data.length > 0) {
      $timeout(function(){
        let sparkline = timeseries.data.map(d => [d.value]);
        google.setOnLoadCallback(Sparkline.draw(sparkline));
      });
    }

    let uri = NpolarApiSecurity.canonicalUri(`/indicator/timeseries/${timeseries.id}`, 'http');
    Parameter.array({ "filter-timeseries": uri, fields: "*", limit: 1 }, parameters => {
      if (parameters && parameters.length > 0) {
        $scope.parameter = parameters[0];
        $scope.siblings = $scope.parameter.timeseries.filter(uri => {
          let id = uri.split('/').slice(-1)[0];
          return (id !== timeseries.id);
        });
      }
    });
  });
};
module.exports = TimeseriesShowController;

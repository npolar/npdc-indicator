'use strict';

// @ngInject
var ParameterShowController = function($scope, $routeParams, $location, $controller, $route, $timeout, $filter,
  npdcAppConfig, Parameter, Timeseries, google, Sparkline) {

  // Extend NpolarApiBaseController and inject resource
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Parameter;

  // Fetch parameter document with parent indicator and timeseries children
  Parameter.fetch($routeParams, function(parameter) {

    $scope.document = parameter;
    //npdcAppConfig.cardTitle = $filter('title')(parameter.titles);

    // Fetch timeseries children and draw sparklines
    let filter_timeseries_ids = parameter.timeseries.map(t => {
      return t.match(/\/([-\w]+)$/)[1];
    });

    if (filter_timeseries_ids.length > 0) {
      // Fetch all timeseries children
      Timeseries.array({
        "filter-id": filter_timeseries_ids.join("|"),
        fields: "*",
        limit: filter_timeseries_ids.length
      }, function(timeseries) {

        $scope.timeseries = timeseries;

        // @todo Warn user if linked data is not there
        if (timeseries.length !== filter_timeseries_ids.length) {
          console.warn("timeseries", filter_timeseries_ids);
          console.warn("existing timeseries", timeseries.map(t => t.id));
        }

        // Draw sparklines after page load
        $timeout(() => {
          google.setOnLoadCallback(Sparkline.drawArray(timeseries));
        });
      });
    }

  });

};

module.exports = ParameterShowController;

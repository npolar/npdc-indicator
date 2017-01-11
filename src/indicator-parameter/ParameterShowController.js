'use strict';

let ParameterShowController = function($scope, $routeParams, $location, $controller, $route, $timeout, $filter,
  npdcAppConfig, NpdcWarningsService,
  Parameter, Timeseries, google, Sparkline) {
  'ngInject';

  let self = this;

  self.metadata = (p, resource) => {
    let path = resource.path.replace('//api.npolar.no', '');    // @todo i18n
    let byline = 'See https://data.npolar.no/dataset/182e0a62-bcb3-44af-afb6-752762f2f6f6'; //NpolarTranslate.translate('byline.mosj');
    let uri = `https://data.npolar.no/indicator/parameter/${p.id}`;

    let schema = self.schema;
    return {
      uri,
      path,
      byline,
      schema
    };
  };

  // Extend NpolarApiBaseController and inject resource
  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Parameter;

  // Fetch parameter document with parent indicator and timeseries children
  Parameter.fetch($routeParams, function(parameter) {

    $scope.document = parameter;
    $scope.metadata = self.metadata(parameter, Parameter);
    npdcAppConfig.cardTitle = $filter('title')(parameter.titles);

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

          NpdcWarningsService.warnings[parameter.id] = [`Number of linked timeseries (${filter_timeseries_ids.length}) ≠ actually existing timeseries (${timeseries.length}) `];

        }

        // Draw sparklines after page load
        $timeout(() => {
          //google.setOnLoadCallback(Sparkline.drawArray(timeseries));
        });
      });
    }

  });

};

module.exports = ParameterShowController;

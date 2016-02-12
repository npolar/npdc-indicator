'use strict';

// @ngInject
let ParameterEditController = function($scope, $controller, formula, npolarApiConfig, npdcAppConfig, Parameter, Timeseries) {

  const schema = '//api.npolar.no/schema/indicator-parameter-1';

  $controller('NpolarEditController', {
    $scope: $scope
  });
  $scope.resource = Parameter;
  $scope.formula = formula.getInstance({
    schema,
    form: "indicator-parameter/parameter-formula.json",
    templates: npdcAppConfig.formula.templates
  });

  // Add new timeseries to current parameter
  $scope.addTimeseries = function(parameter) {
    let duplicate = Object.create(parameter);
    let timeseries = new Timeseries({
      titles: duplicate.titles, //map(t => { t.title += ` [${duplicate.timeseries.length+1}]`; return t; }
      species: duplicate.species,
      collection: 'timeseries',
      workspace: 'indicator',
      systems: duplicate.systems,
      locations: duplicate.locations,
      schema: 'http://api.npolar.no/schema/indicator-timeseries-1'
    });

    timeseries.$save(function(timeseries) {
      let timeseries_uri = "http:" + npolarApiConfig.base + "/indicator/timeseries/" + timeseries.id;
      parameter.timeseries.push(timeseries_uri);
      $scope.update(parameter);
    });
  };

  $scope.edit();
};
module.exports = ParameterEditController;

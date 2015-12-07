'use strict';

// @ngInject
var ParameterEditController = function($scope, $controller, npolarApiConfig, Parameter, Timeseries) {

  $controller('NpolarEditController', {
    $scope: $scope
  });
  $scope.resource = Parameter;

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
      schema: 'https://api.npolar.no/schema/indicator-timeseries-1'
    });

    timeseries.$save(function(timeseries) {
      let timeseries_uri = "http:" + npolarApiConfig.base + "/indicator/timeseries/" + timeseries.id;
      parameter.timeseries.push(timeseries_uri);
      $scope.update(parameter);
    });
  };

  $scope.formula.schema = '//api.npolar.no/schema/indicator-parameter-1';
  $scope.formula.form = "parameter/parameter-formula.json";
  $scope.formula.template = 'material';

  $scope.edit();

};
module.exports = ParameterEditController;

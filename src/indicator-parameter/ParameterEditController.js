'use strict';

// @ngInject
let ParameterEditController = function($scope, $routeParams, $location, $controller, $route, npolarApiConfig, NpolarMessage, Indicator, Parameter, Timeseries) {

  const schema = '//api.npolar.no/schema/indicator-parameter-1';

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
      schema: 'http://api.npolar.no/schema/indicator-timeseries-1'
    });

    timeseries.$save(function(timeseries) {
      let timeseries_uri = "http:" + npolarApiConfig.base + "/indicator/timeseries/" + timeseries.id;
      parameter.timeseries.push(timeseries_uri);
      $scope.update(parameter);
    });
  };

  $scope.formula.schema = schema;
  $scope.formula.form = "parameter/parameter-formula.json";
  $scope.formula.template = 'material';

  // @overide
  $scope.newAction = function() {
    console.debug('newAction');
    $scope.document = new Parameter({
      titles: [{ lang: "nb", title: "Parameter (nb)"}, { lang: "en", title: "Parameter (en)"}],
      systems: ["mosj.no"],
      schema: 'http:'+schema,
      workspace: "indicator",
      collection: "indicator"
    });

    console.debug($scope.document);
    $scope.formula.model = $scope.document;
  };
  $scope.edit();

};
module.exports = ParameterEditController;

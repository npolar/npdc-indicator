'use strict';

// @ngInject
let IndicatorEditController = function($scope, $routeParams, $controller, Indicator, Parameter, NpolarApiSecurity) {
    
  const schema = "//api.npolar.no/schema/indicator-1";
  
  $controller("NpolarEditController", {
    $scope: $scope
  });

  $scope.resource = Indicator;

  $scope.formula.schema = schema;
  $scope.formula.template = 'material';
  $scope.formula.form = "indicator/indicator-formula.json";

  //let newAction = function() {
  //  $scope.document = new Indicator({
  //    titles: [{
  //      lang: "nb",
  //      title: "Indikator"
  //    }, {
  //      lang: "en",
  //      title: "Indicator"
  //    }],
  
  // Add new parameter to indicator
  $scope.addParameter = function(indicator) {
    let duplicate = Object.create(indicator);
    let parameter = new Parameter({
        titles: [{title: 'New parameter', lang: 'en'},{ title: 'Ny parameter', lang: 'nb'}],
      species: duplicate.species,
      collection: 'parameter',
      workspace: 'indicator',
      systems: duplicate.systems,
      locations: duplicate.locations,
      schema: 'http://api.npolar.no/schema/indicator-parameter-1'
    });
        
    parameter.$save(function(parameter) {
      let parameter_uri = NpolarApiSecurity.canonicalUri('/indicator/parameter/'+parameter.id, 'http');
      if (!indicator.parameters) {
        indicator.parameters = [];
      }
      indicator.parameters.push(parameter_uri);
      $scope.update(indicator);
    });
  };
  
  // @override
  $scope.newAction = function() {
    $scope.document = new Indicator({
      titles: [{ lang: "nb", title: `Ny indikator`}, { lang: "en", title: `New indicator`}],
      systems: ["mosj.no"],
      schema: 'http:'+schema,
      workspace: "indicator",
      collection: "indicator"
    });
    $scope.formula.model = $scope.document;
  };

  
  // @override
  $scope.editAction = function() {
    
    // Fetch indicator document and its descendants (parameter children and @todo timeseries grandchildren)
    Indicator.fetch($routeParams, function(indicator) {
      $scope.document = indicator;
      $scope.formula.model = indicator;
  
      $scope.parameters = [];
      let parameter_ids = [];
  
      if (indicator.parameters && indicator.parameters.length > 0) {
        parameter_ids = indicator.parameters.map(p => {
          return p.match(/\/([-\w]+)$/)[1];
        });
  
        Parameter.array({
          "filter-id": parameter_ids.join("|"),
          fields: "*",
          limit: indicator.parameters.length
        }, function(parameters) {
          $scope.parameters = parameters;
  
        });
      }
    });
  };
  $scope.edit();

};

module.exports = IndicatorEditController;
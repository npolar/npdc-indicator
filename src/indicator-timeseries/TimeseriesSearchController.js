'use strict';

function TimeseriesSearchController($scope, $location, $controller, $filter, $timeout,
  NpolarTranslate,
  npdcAppConfig,
  Timeseries, TimeseriesModel, TimeseriesCitation, google, Sparkline) {
  'ngInject';

  let ctrl = this;

  $controller("NpolarBaseController", {
    $scope: $scope
  });
  $scope.resource = Timeseries;

  npdcAppConfig.search.local.results.subtitle = (t) => {
    if (t.systems) {
      return t.systems.join(',');
    } else if (t.species) {
      return t.species;
    }
    return '';
  };
  npdcAppConfig.search.local.results.detail = (t) => {
    let detail = TimeseriesCitation.reference(t);
    if (t.size && t.size > 0) {
      let points = (t.size > 1) ? NpolarTranslate.translate('data points'): NpolarTranslate.translate('data point');
      detail += ` [${t.size} ${points}]`;
    }
    //  subtitle += `. Updates: ${ $filter('date')(t.updated)}`;
    return detail;
  };

  this.query = function(param=$location.search()) {

    let defaults = {
      limit: 25,
      "size-facet": 100,
      format: "json",
      variant: "atom",
      //sort: param.sort || "-updated",
      facets: "keywords.@value,authors.@id,parameter,unit.symbol,systems,species,locations.placename,labels.label,links.rel,created_by,updated_by",
      fields: "titles,authors,systems,keywords,size,labels,species,id,created,created_by,updated,updated_by"
    };

    // Limit search for folks in A using NARE-EMP https://api.npolar.no/indicator/system/nare-emp
    let invariants = {}; //$scope.security.isAuthenticated() ? {} : { "not-draft": "yes", "not-progress": "planned", "filter-links.rel": "data" };
    if ($scope.security.isAuthorized('read', 'https://api.npolar.no/indicator/system/nare-emp') && !$scope.security.isAuthorized('read', 'https://api.npolar.no/indicator/timeseries')) {
      $location.search({'filter-systems': 'NARE-EMP'}, false);
      invariants['filter-systems'] = 'NARE-EMP';
    }

    return Object.assign({}, defaults, invariants);
  };

  this.search = () => {
    $scope.search(ctrl.query()).$promise.then(response => {
       $timeout(function(){

         /// google.setOnLoadCallback(Sparkline.drawArray(response.feed.entries));


       });
    });


  };

  ctrl.search();

  $scope.$on('$locationChangeSuccess', (event) => {
    ctrl.search();
  });
}
module.exports = TimeseriesSearchController;

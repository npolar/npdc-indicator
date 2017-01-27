'use strict';

let TimeseriesShowController = function($scope, $controller, $timeout,
  NpolarApiSecurity, NpolarTranslate,
  npdcAppConfig,
  Timeseries, TimeseriesModel, TimeseriesCitation, Parameter, google, Sparkline) {

  'ngInject';

  let ctrl = this;

  ctrl.authors = (t) => {
    return t.authors.map(a => {
      return { name: a['@id']};
    });
  };

  ctrl.collection_link = (links,hreflang='en') => {
    return links.find(l => l.rel === 'collection' && l.hreflang === hreflang);
  };

  $controller("NpolarBaseController", {$scope: $scope});
  $scope.resource = Timeseries;

  let chartElement = Sparkline.getElement();
  if (chartElement) {
    chartElement.innerHTML = '';
  }

  $scope.show().$promise.then(timeseries => {
    $scope.data = timeseries.data;

    $scope.data_not_null = timeseries.data.filter(t => t.value !== undefined);

    // Create facet-style links to timeseries with same keywords...
    if (!$scope.keywords && timeseries.keywords && timeseries.keywords.length > 0) {
      $scope.keywords = {};
      let keywords = TimeseriesModel.keywords(timeseries);
      ['en', 'no'].forEach(l => {
        let k = keywords[l];
        let href = $scope.resource.uiBase+`?filter-keywords.@value=${ k.join(',') }`;
        let link = { keywords: keywords[l], count: 0, href };
        Timeseries.feed({"filter-keywords.@value": k.join(','), facets: 'keywords,species', limit: 0}).$promise.then((r) => {

          link.count = r.feed.opensearch.totalResults; // Has all keywords

          if (timeseries.species) {
            let f = r.feed.facets.find(f => f.hasOwnProperty('species'));
            
            if (f && f.species) {
              let c = f.species.find(f => f.term === timeseries.species);
              link.count_keywords_and_species = c.count;
            }
          }

          $scope.keywords[l] = link;
        }, (e) => {
          $scope.keywords[l] = link;
        });
      });
    }

    $scope.metadata = TimeseriesModel.metadata(timeseries, $scope.resource);

    $scope.citation = (t) => {
      if (!t) { return; }
      return TimeseriesCitation.citation(timeseries);
    };

    // Create graph
    if ($scope.data && $scope.data.length > 0) {
      $timeout(function(){
        $scope.sparkline = true;
        let sparkline = timeseries.data.map(d => [d.value]);
        google.setOnLoadCallback(Sparkline.draw(sparkline));
      });
    }

    // Count keyword-siblings
    //if ($scope.keywords && $scope.keywords.en) {
    //
    //  let k1 = $scope.keywords.en.join(',');
    //  let k2 = $scope.keywords.no.join(',');
    //
    //  Timeseries.array({"filter-keywords.@value": k1, limit: "all"}).$promise.then(t => {
    //    $scope.siblings_en = t.length;
    //  });
    //
    //  Timeseries.array({"filter-keywords.@value": k2, limit: "all"}).$promise.then(t => {
    //    $scope.siblings_no = t.length;
    //  });
    //}

    // Count number of timeseries belonging to the same collection
    if (timeseries.links && timeseries.links.length > 0) {
      ['en', 'nb'].forEach(l => {
        if (!$scope.collection || !$scope.collection[l]) {
          let link = ctrl.collection_link(timeseries.links, l);
          let query = {"filter-links.href": link.href, limit: 0 };
          Timeseries.feed(query).$promise.then(r => {
            if (!$scope.collection) {
              $scope.collection = {};
            }
            $scope.collection[l] = { href: $scope.resource.uiBase+`?filter-links.href=${link.href}`, title: link.title, count: r.feed.opensearch.totalResults }
          });
        }
      });
    }

  });
};
module.exports = TimeseriesShowController;

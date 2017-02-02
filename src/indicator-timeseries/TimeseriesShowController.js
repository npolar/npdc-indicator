'use strict';

let TimeseriesShowController = function($scope, $controller, $timeout,
  NpolarApiSecurity, NpolarTranslate,
  npdcAppConfig,
  Timeseries, TimeseriesModel, TimeseriesCitation, google, Sparkline) {

  'ngInject';

  let ctrl = this;

  ctrl.authors = (t) => {
    return t.authors.map(a => {
      return { name: a['@id']};
    });
  };

  // @todo NpolarLinkModel?
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

    // Create facet-style links with counts to timeseries with all of the same keywords...
    if (!$scope.keywords && timeseries.keywords && timeseries.keywords.length > 0) {
      $scope.keywords = {};
      let keywords = TimeseriesModel.keywords(timeseries);
      ['en', 'no'].forEach(l => {
        let k = keywords[l];
        let href = $scope.resource.uiBase+`?filter-keywords.@value=${ k.join(',') }`;
        let link = { keywords: keywords[l], count: 0, href };
        Timeseries.feed({"filter-keywords.@value": k.join(','), facets: 'keywords,species,locations.placename', limit: 0}).$promise.then((r) => {

          link.count = r.feed.opensearch.totalResults; // All keywords

          // Count for all keywords + species
          if (timeseries.species) {
            let f = r.feed.facets.find(f => f.hasOwnProperty('species'));

            if (f && f.species) {
              let c = f.species.find(f => f.term === timeseries.species);
              link.count_keywords_and_species = c.count;
            }
          }

          // Count for first all keywords + placename[0]
          if (timeseries.locations && timeseries.locations.length > 0) {
            let f = r.feed.facets.find(f => f.hasOwnProperty('locations.placename'));

            if (f && f['locations.placename']) {
              let c = f['locations.placename'].find(f => f.term === timeseries.locations[0].placename);
              link.count_keywords_and_placename = c.count;
            }
          }


          $scope.keywords[l] = link;
        }, (e) => {
          $scope.keywords[l] = link;
        });
      });
    }

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

    // Count number of timeseries belonging to the same collection
    if (timeseries.links && timeseries.links.length > 0) {
      ['en', 'nb'].forEach(l => {
        if (!$scope.collection || !$scope.collection[l]) {
          let link = ctrl.collection_link(timeseries.links, l);
          if (link && link.href) {
            let query = {"filter-links.href": link.href, limit: 0 };
            Timeseries.feed(query).$promise.then(r => {
              if (!$scope.collection) {
                $scope.collection = {};
              }
              $scope.collection[l] = { href: $scope.resource.uiBase+`?filter-links.href=${link.href}`,
                title: link.title,
                count: r.feed.opensearch.totalResults
              };

            });

          }
        }
      });
    }

  });
};
module.exports = TimeseriesShowController;

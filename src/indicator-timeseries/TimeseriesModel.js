'use strict';

function TimeseriesModel($filter, NpolarLang, NpolarApiSecurity,
  NpdcAPA, NpdcCitationModel, Timeseries) {
  'ngInject';

  const LANG_NO = '^(nb|nn|no)';
  const LANG_EN = '^en';
  const SCHEMA = 'https://api.npolar.no/schema/indicator-timeseries-1';

  const _keywordsT = (timeseries, language) => {
    if (!timeseries || !timeseries.keywords) {
      return;
    }
    let regexp = new RegExp(language);

    let k = timeseries.keywords.filter(k => regexp.test(k['@language'])).map(k => k['@value']);
    return k;
  };

  let model = this;

  this.create = () => {
    return  { systems: ['mosj.no'], uri: ['http://data.npolar.no/monitoring/timeseries'] };
  };
  Timeseries.create = model.create;

  // URI (web address) of the timeseries dataset
  this.uri = (t) => {
    if (!t || !t._rev || !t.id) {
      return;
    }
    return `https://data.npolar.no/indicator/timeseries/${t.id}`;
  };

  this.title = (t) => {
    return $filter('i18n')(t.title);
  };

  this.keywords = (timeseries) => {
    return {
      en: _keywordsT(timeseries, LANG_EN),
      no: _keywordsT(timeseries, LANG_NO)
    };
  };

  // FIXME @todo These default should be moved into the directive

  this.metadata = (timeseries, resource, uri=model.uri(timeseries)) => {
    let path = resource.path.replace('//api.npolar.no', '');

    let byline = ''; //'@todo byline MOSJ';

    return {
      uri,
      path,
      formats: [{ href: NpolarApiSecurity.canonicalUri(resource.path+'/'+timeseries.id), title: "JSON"}],
      editors: [],
      byline,
      schema: SCHEMA
    };
  };
}
module.exports = TimeseriesModel;
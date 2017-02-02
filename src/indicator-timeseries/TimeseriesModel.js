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

  model.schema = SCHEMA;

  model.create = () => {
    return  { systems: ['mosj.no'],
      domainType: 'PointSeries'
    };
  };
  Timeseries.create = model.create;

  // URI (web address) of the timeseries dataset
  this.uri = (t) => {
    if (!t || !t._rev || !t.id) {
      return;
    }
    return `https://data.npolar.no/indicator/timeseries/${t.id}`;
  };

  model.title = (t) => {
    return $filter('i18n')(t.title);
  };

  model.keywords = (timeseries) => {
    return {
      en: _keywordsT(timeseries, LANG_EN),
      no: _keywordsT(timeseries, LANG_NO)
    };
  };
}
module.exports = TimeseriesModel;
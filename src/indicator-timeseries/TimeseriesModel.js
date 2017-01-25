'use strict';

function TimeseriesModel(NpolarLang, NpdcAPA, NpdcCitationModel,Timeseries) {
  'ngInject';

  const LANG_NO = '^(nb|nn|no)';
  const LANG_EN = '^en';
  const SCHEMA = 'https://api.npolar.no/schema/indicator-timeseries-1';

  let model = this;

  this.create = () => {
    return  { systems: ['mosj.no'], uri: ['http://data.npolar.no/monitoring/timeseries'] };
  };
  Timeseries.create = model.create;

  this.keywords = (timeseries) => {
    return {
      en: model.keywordsT(timeseries, LANG_EN),
      no: model.keywordsT(timeseries, LANG_NO)
    };
  };

  this.keywordsT = (timeseries, language) => {
    if (!timeseries || !timeseries.keywords) {
      return;
    }
    let regexp = new RegExp(language);

    let k = timeseries.keywords.filter(k => regexp.test(k['@language'])).map(k => k['@value']);
    return k;
  };


  this.metadata = (timeseries, resource, uri) => {
    let path = resource.path.replace('//api.npolar.no', '');

    let byline = '@todo byline MOSJ';

    return {
      uri,
      path,
      formats: [{ href: "JSON", title: "JSON"}],
      editors: [],
      byline,
      schema: SCHEMA
    };
  };
}
module.exports = TimeseriesModel;
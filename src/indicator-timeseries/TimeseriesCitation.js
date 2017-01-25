'use strict';

function TimeseriesCitation($location, $filter,
  NpolarTranslate, NpolarLang,
  NpdcDOI, NpdcCitationModel, NpdcAPA, NpdcBibTeX, TimeseriesModel) {
  'ngInject';

  let self = this;

  // @return Array
  this.authors = (t, l = NpolarLang.getLang()) => {
    if (!t || !t.authors) {
      return;
    }
    return t.authors.map(a => {
      return { name: NpolarTranslate.translate(a['@id']), roles: ["author"] };
    });
  };


  this.published = (t) => {
    if (!t) {
      return;
    }
    if (t.published) {
      return t.published;
    } else {
      return new Date().getFullYear();
    }
  };

  // @return String "Authorlist (year [first published])"
  this.reference = (t) => {
    if (!t || !t.authors) {
      return;
    }
    return NpdcAPA.reference(self.authors(t), self.published(t));
  };

  // URI (web address) of the monitoring dataset
  this.uri = (t) => {
    if (!t || !t.uri || ! t.uri.length) {
      return;
    }
    return t.uri[0];
  };

  // List of available citations, use href and header for services
  this.citationList = (t) => {
    let list = [
      { text: self.citation(t, 'apa'), title: 'APA'},
      //{ text: self.citation(dataset, 'bibtex'), title: 'BibTeX'},
      //{ text: self.citation(dataset, 'csl'), title: 'CSL JSON'}
    ];
    list = list.sort((a,b) => a.title.localeCompare(b.title));
    console.log(list);
    return list;
  };

  // Citation helper
  this.citation = (t, style='APA', l = NpolarLang.getLang()) => {
    if (!t) {
      return;
    }

    let authors = self.authors(t);
    let year = self.published(t);
    let title = $filter('title')(t.titles);
    // t.title[l]
    let type;
    let publisher = NpolarTranslate.translate('mosj.no');
    // systems => publisher
    // license!?
    let uri = self.uri(t);

    if ((/apa/i).test(style)) {
      type = NpolarTranslate.translate('Data set');
      return NpdcAPA.citation({ authors, year, title, type, publisher, uri });
    } /*else if ((/bibtex/i).test(style)){
      type = '@misc';
      return NpdcBibTeX.bibtex({ title, url, doi, type, publisher, author, year, id: dataset.id });
    } else if ((/csl/i).test(style)){
      type = 'dataset';
      let issued = { 'date-parts': [year, month, day], 'date-time': dataset.released };
      return self.csl({ type, DOI: doi, URL: url, title, publisher, issued, author });
    }*/ else {
      throw `Uknown citation style: ${style}`;
    }
  };
}

module.exports = TimeseriesCitation;

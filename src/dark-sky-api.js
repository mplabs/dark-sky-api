import moment from 'moment';
import queryString from 'query-string';
import fetchJsonp from 'fetch-jsonp';
import fetch from 'whatwg-fetch';

class DarkSkyApi {
  constructor(apiKey, proxyUrl) {
    this.proxyUrl = proxyUrl || '';
    this.apiKey = apiKey || '';
    this._longitude = null;
    this._latitude = null;
    this._time = null;
    this.query = {};
  }

  longitude(long) {
    !long ? null : this._longitude = long;
    return this;
  }

  latitude(lat) {
    !lat ? null : this._latitude = lat;
    return this;
  }

  time(time) {
    !time ? null : this._time = moment(time).format('YYYY-MM-DDTHH:mm:ss');
    return this;
  }

  units(unit) {
    !unit ? null : this.query.units = unit;
    return this;
  }

  language(lang) {
    !lang ? null : this.query.lang = lang;
    return this;
  }

  exclude(blocks) {
    !blocks ? null : this.query.exclude = blocks;
    return this;
  }

  extendHourly(param) {
    !param ? null : this.query.extend = 'hourly';
    return this;
  }

  generateReqUrl() {
    const baseUrl = this.proxyUrl ? this.proxyUrl : `https://api.darksky.net/forecast/${this.apiKey}`;
    this.url = `${baseUrl}/${this._latitude},${this._longitude}`;
    this._time
      ? this.url += `,${this._time}`
      : this.url;
    !this.isEmpty(this.query)
      ? this.url += `?${queryString.stringify(this.query)}`
      : this.url;
  }

  get() {
    if (!this._latitude || !this._longitude) {
      return new Promise((resolve, reject) => {
        reject("Request not sent. ERROR: Longitute or Latitude is missing.");
      });
    }
    this.generateReqUrl();

    const query = this.proxyUrl ? fetch(this.url) : fetchJsonp(this.url);

    return query.then(function (response) {
      return response.json();
    }).then(function (json) {
      return json;
    }).catch(function (ex) {
      return ex;
    });
  }

  isEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}

export default DarkSkyApi;
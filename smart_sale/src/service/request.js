import Cookies from "js-cookie";
import axios from "axios";
import { basePrefix, deepMerge } from "../helpers";
// import { URL } from "../constants";
// import getConfig from "next/config";

// const { publicRuntimeConfig } = getConfig();
const env = "publicRuntimeConfig.NODE_ENV";

export default class request {
  settings;

  constructor(settings = {}) {
    this.settings = settings;
  }

  setUrl(url) {
    this.settings.url = url;
  }

  getBaseURL = () => {
    if (env === "production") {
      return URL.PROD;
    } else if (env === "staging" || env === "homolog") {
      return URL.HML;
    } else {
      return 'https://pokeapi.co/api/v2/';
    }
  };

  request(options) {
    let promise = new Promise((resolve, reject) => {
      try {
        let request = {};

        request = deepMerge(request, options);
        request.responseType = "json";
        request.Headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization",
          "Access-Control-Allow-Methods":
            "GET, POST, OPTIONS, PUT, PATCH, DELETE",
          "Content-Type": "application/json;charset=UTF-8",
          // "Authorization": `Basic ${Base64.encode(secret + ':')}`
        };

        if (!this.settings.url) {
          let url = this.getBaseURL();
          this.setUrl(url);
        }

        axios(basePrefix(this.settings.url, request)).then((response) => {
          resolve(response.data);
        });
        
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  get(path, query) {
    let request = {
      method: "get",
      url: path,
      params: query,
    };
    return this.request(request);
  }

  put(path, data, query) {
    let request = {
      method: "put",
      url: path,
      params: query,
      data,
    };
    return this.request(request);
  }

  delete(path, data, query) {
    let request = {
      method: "delete",
      url: path,
      params: query,
      data,
    };
    return this.request(request);
  }

  post(path, data, query) {
    let request = {
      method: "post",
      url: path,
      params: query,
      data,
    };
    return this.request(request);
  }
}
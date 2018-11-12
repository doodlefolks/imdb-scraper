import fetch from "node-fetch";
import cheerio from "cheerio";

const baseSearchUrl = "https://www.imdb.com/find";

const imdbCrawler = {
  search: query => {
    var encodedQuery = encodeURIComponent(query);
    return fetch(`${baseSearchUrl}?q=${encodedQuery}`)
      .then(res => res.text())
      .then(body => {
        return cheerio.load(body);
      });
  }
};

export default imdbCrawler;

import { expect } from "chai";

import crawler from "../crawlers/imdbCrawler";

describe("imdbCrawler.js", function() {
  describe("parseResults", function() {
    const results = crawler.parseResults(require("./data.json").imdbResults);
    it("should find two results", function() {
      expect(results.length).to.equal(2);
    });
    it("should preserve anchor tags", function() {
      expect(results[0].title).to.match(/<a.*<\/a>/);
    });
  });
});

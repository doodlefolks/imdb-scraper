import fetch from "node-fetch";
import cheerio from "cheerio";

const baseSearchUrl = "https://www.imdb.com/find";

const imdbCrawler = {
  // fetches imdb search results and parses them
  getParsedResults: async query => {
    var encodedQuery = encodeURIComponent(query);
    const html = await fetch(`${baseSearchUrl}?q=${encodedQuery}`).then(res =>
      res.text()
    );
    return imdbCrawler.parseResults(html);
  },
  // parses results from raw html
  parseResults(html) {
    const $ = cheerio.load(html);
    const results = $("td.result_text");
    const parsed = [];
    results.each(function() {
      parsed.push(parseResult($(this)));
    });
    return parsed;
  }
};

// parses an imdb search result to get the title, description, and category
function parseResult($result) {
  const parsed = {
    title: "",
    description: "",
    category: $result
      .parents(".findSection")
      .children(".findSectionHeader")
      .text()
  };

  let parsingTitle = true;
  for (let i = 0; i < $result[0].children.length; i++) {
    let node = $result[0].children[i];
    // a <br> tag denotes beginning of description text
    if (node.type === "tag" && node.name === "br") {
      parsingTitle = false;
      continue;
    }
    if (parsingTitle) {
      parsed.title = `${parsed.title}${extractNestedText(node)}`;
    } else {
      parsed.description = `${parsed.description}${extractNestedText(node)}`;
    }
  }

  return parsed;
}

// recursive function to combine all nested text nodes
function extractNestedText(node) {
  // a text node is a leaf
  if (node.type === "text") {
    return node.data;
  }
  // traverse tree adding text to the string
  let combinedText = "";
  for (let child of node.children) {
    combinedText = `${combinedText}${extractNestedText(child)}`;
  }
  // preserve hyperlink markup
  if (node.type === "tag" && node.name === "a") {
    return `<a href="https://www.imdb.com${
      node.attribs.href
    }">${combinedText}</a>`;
  }
  return combinedText;
}

export default imdbCrawler;

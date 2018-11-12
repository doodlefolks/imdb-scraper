import fetch from "node-fetch";
import cheerio from "cheerio";

const baseSearchUrl = "https://www.imdb.com/find";

const imdbCrawler = {
  search: query => {
    var encodedQuery = encodeURIComponent(query);
    return fetch(`${baseSearchUrl}?q=${encodedQuery}`)
      .then(res => res.text())
      .then(body => {
        const $ = cheerio.load(body);
        const results = $("td.result_text");
        return results.map(parseResult);
      });
  }
};

// parses an imdb search result to get the title and description
function parseResult(index, result) {
  const parsed = { title: "", description: "" };
  let parsingTitle = true;
  for (let i = 0; i < result.children.length; i++) {
    let node = result.children[i];
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
    return `<a href="${node.attribs.href}">${combinedText}</a>`;
  }
  return combinedText;
}

export default imdbCrawler;
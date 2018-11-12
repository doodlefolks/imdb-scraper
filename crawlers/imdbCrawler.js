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
        var temp = results.map(parseResult);
        return temp;
      });
  }
};

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

function extractNestedText(node, text = "") {
  // a text node is a leaf
  if (node.type === "text") {
    return `${text}${node.data}`;
  }
  // traverse tree adding text to the string
  for (let child of node.children) {
    text = extractNestedText(child, text);
  }
  return text;
}

export default imdbCrawler;

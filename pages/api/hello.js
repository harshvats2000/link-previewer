// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jsdom from "jsdom";

export default async function handler(req, res) {
  let { url } = req.query;
  const { JSDOM } = jsdom;

  if (!isValidHttpUrl(url)) {
    res.send("not valid url");
  }

  if (!url.startsWith("h")) {
    url = "https://" + url;
  }

  let response = await fetch(url);
  if (!response.ok) {
    res.send("error");
  }

  res.setHeader("Content-Type", "text/html");
  const htmlString = await response.text();

  const dom = new JSDOM(htmlString);

  const result = getMeta(dom);
  console.log(result);

  res.send(result);

  function getMeta(dom) {
    const { document } = dom.window;
    return {
      desc: document.querySelector("meta[name='description']")?.getAttribute("content"),
      title: document.querySelector("title")?.textContent,
      image: document.querySelector("meta[property='og:image']")?.getAttribute("content")
    };
  }

  function isValidHttpUrl(string) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(string);
  }
}

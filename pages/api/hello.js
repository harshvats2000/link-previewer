// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jsdom from "jsdom";
import { isValidUrl } from "../../utils";

export default async function handler(req, res) {
  let { url } = req.query;
  const { JSDOM } = jsdom;

  if (!isValidUrl(url)) {
    res.send("not valid url");
  }

  if (!url.startsWith("h")) {
    url = "https://" + url;
  }
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      res.status(404).send({ error: "URL not found." });
    }
    res.send(error);
  }

  res.setHeader("Content-Type", "text/html");
  const htmlString = await response.text();

  const result = getMeta(htmlString);

  res.send(result);

  function getMeta(htmlString) {
    const dom = new JSDOM(htmlString);
    const { document } = dom.window;
    let favicon = document.querySelector("link[rel='icon']")?.getAttribute("href");
    if (favicon.startsWith("/")) {
      favicon = url + favicon;
    }
    let sizeInBytes = new TextEncoder().encode(htmlString).length;
    return {
      desc: document.querySelector("meta[name='description']")?.getAttribute("content"),
      title: document.querySelector("title")?.textContent,
      image: document.querySelector("meta[property='og:image']")?.getAttribute("content"),
      favicon,
      sizeInBytes
    };
  }
}

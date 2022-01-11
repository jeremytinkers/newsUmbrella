const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.get("/", function (req, res) {
  res.json("Webscraper backend running!");
});

function resolvePath(path, urlParent) {
  if (path.includes("http")) {
    return path;
  }

  return urlParent + path;
}

function validateData(url, title) {
  if (!!url && !!title) {
    //both url and title are not blank
    return true;
  }
  return false;
}

//general
app.get("/guardian", (req, res) => {
  axios("https://www.theguardian.com/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const newsItems = [];

      $(".fc-item__title").each(function () {
        const title = $(this).find(".js-headline-text").text();
        const url = $(this).find("a").attr("href");
        newsItems.push({
          title,
          url,
          src: "Guardian",
        });
      });
      res.json(newsItems);
    })
    .catch((err) => console.log(err));
});

app.get("/bbcnews", (req, res) => {
  const urlParent = "https://www.bbc.com/news";
  axios(urlParent)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const newsItems = [];

      $(
        ".nw-c-top-stories__secondary-item,.nw-c-top-stories__tertiary-items"
      ).each(function () {
        // const title = $(this).text()
        const baseElement = $(this).find("a.gs-c-promo-heading");
        const title = baseElement.find("h3").text();
        const url = baseElement.attr("href");
        newsItems.push({ title, url: resolvePath(url, urlParent), src: "BBC" });
      });
      res.send(newsItems);
    })
    .catch((err) => console.log(err));
});

//finance
app.get("/mint", (req, res) => {
  axios("https://www.livemint.com/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const newsItems = [];

      $("h2.headline").each(function () {
        const title = $(this).text();
        // console.log(title.replace(/\n/g, ""));
        const url = $(this).find("a").attr("href");
        newsItems.push({
          title,
          url,
          src: "Mint",
        });
      });
      res.json(newsItems);
    })
    .catch((err) => console.log(err));
});

app.get("/marketwatch", (req, res) => {
  axios("https://www.marketwatch.com/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const newsItems = [];

      $("a.latestNews__headline").each(function () {
        // const title = $(this).text()
        const baseElement = $(this);
        const title = baseElement.find(".headline").text();
        const url = baseElement.attr("href");
        newsItems.push({ title, url , src: "MarketWatch" });
      });

      $("h3.article__headline").each(function () {
        // const title = $(this).text()
        const baseElement = $(this);
        const title = baseElement.text();
        const url = baseElement.find("a").attr("href");
        if (validateData(url, title)) {
          newsItems.push({ title, url, src: "MarketWatch" });
        }
      });

      res.send(newsItems);
    })
    .catch((err) => console.log(err));
});

//tech
app.get("/techcrunch", (req, res) => {
  axios("https://techcrunch.com/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html, { decodeEntities: false });
      const newsItems = [];

      $("h2.post-block__title").each(function () {
        // const title = $(this).text()
        const baseElement = $(this);
        const title = baseElement.text();
        const url = baseElement.find("a").attr("href");
        newsItems.push({ title, url, src: "TechCrunch" });
      });
      res.send(newsItems);
    })
    .catch((err) => console.log(err));
});

app.get("/wired", (req, res) => {
  const urlParent = "https://www.wired.com/";
  axios(urlParent)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html, { decodeEntities: false });
      const newsItems = [];

      $("h3.summary-item__hed").each(function () {
        // const title = $(this).text()
        const baseElement = $(this);
        const title = baseElement.text();
        const url = baseElement.closest("a").attr("href");
        if (validateData(url, title)) {
          newsItems.push({
            title,
            url: resolvePath(url, urlParent),
            src: "Wired",
          });
        }
      });
      res.send(newsItems);
    })
    .catch((err) => console.log(err));
});

//local
app.get("/timesofoman", (req, res) => {
  const urlParent = "https://timesofoman.com/";
  axios(urlParent)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html, { decodeEntities: false });
      const newsItems = [];

      $("h3.post-title").each(function () {
        // const title = $(this).text()
        const baseElement = $(this);
        const title = baseElement.text();
        const url = baseElement.find("a").attr("href");
        newsItems.push({
          title,
          url: resolvePath(url, urlParent),
          src: "Times of Oman",
        });
      });
      res.send(newsItems);
    })
    .catch((err) => console.log(err));
});

app.get("/muscatdaily", (req, res) => {
  const urlParent = "https://www.muscatdaily.com/category/oman/";
  axios(urlParent)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html, { decodeEntities: false });
      const newsItems = [];

      $(".nbs1-title").each(function () {
        // const title = $(this).text()
        const baseElement = $(this);
        const title = baseElement.text();
        const url = baseElement.siblings("a").attr("href");
        if (validateData(url, title)) {
          newsItems.push({ title, url, src: "Muscat Daily" });
        }
      });
      res.send(newsItems.slice(1));
    })
    .catch((err) => console.log(err));
});

app.listen(5000, () => console.log(`server running on PORT 5000`));

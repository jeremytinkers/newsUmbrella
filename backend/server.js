const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.get("/", function (req, res) {
  res.json("Webscraper backend running!");
});

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
        });
      });
      res.json(newsItems);
    })
    .catch((err) => console.log(err));
});

function cleanTitle(title){

    let startIdx = 0;
    for(let i=0; i< title.length ; i++){

        if ((/[A-Z]/).test(title[i])) {
            startIdx = i;
            console.log(startIdx);
            break;
            
    }

    return title.slice(startIdx);    

}
}

app.get("/mint", (req, res) => {
    axios("https://www.livemint.com/")
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const newsItems = [];
  
        $("h2.headline").each(function () {
          const title = $(this).text();
          console.log(title.replace(/\n/g, ''));
          const url = $(this).find("a").attr("href");
          newsItems.push({
            title,
            url,
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
          newsItems.push({ title, url});
        });

        $("h3.article__headline").each(function () {
            // const title = $(this).text()
            const baseElement = $(this);
            const title = baseElement.text();
            const url = baseElement.find("a").attr("href");
            newsItems.push({ title, url});
          });


        res.send(newsItems);
  
      })
      .catch((err) => console.log(err));
  });
  


app.get("/bbcnews", (req, res) => {
  axios("https://www.bbc.com/news")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const newsItems = [];

      $(".nw-c-top-stories__secondary-item,.nw-c-top-stories__tertiary-items").each(function () {
        // const title = $(this).text()
        const baseElement = $(this).find("a.gs-c-promo-heading");
        const title = baseElement.find("h3").text();
        const urlPart = baseElement.attr("href");
        let url = "https://www.bbc.com" + urlPart;
        newsItems.push({ title, url});
      });
      res.send(newsItems);

    })
    .catch((err) => console.log(err));
});

app.listen(5000, () => console.log(`server running on PORT 5000`));

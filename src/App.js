import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, Grid, Message, Select } from "semantic-ui-react";
import MenuButtons from "./MenuButtons1";
import MenuButtons1 from "./MenuButtons1";
import IntialSetup from "./IntialSetup";
// import IntialSetup from "./IntialSetup";

function randomGenerator() {
  //Not a purist random generator but it should suffice for now
  var arr = [];
  while (arr.length < 3) {
    var r = Math.floor(Math.random() * 7);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr.map((curI) => {
    return srcList[curI];
  });
}

const srcList = [
  "wired", //0
  "techcrunch",
  "bbcnews", //2
  "guardian",
  "muscatdaily", //4
  "mint", //5
  "marketwatch",
];

const domainsSet = {
  tech: ["wired", "techcrunch"],
  general: ["bbcnews", "guardian"],
  local: ["muscatdaily"],
  finance: ["mint", "marketwatch"],
  random: randomGenerator(),
};

function App() {
  const [newsData, setNewsData] = useState([]);
  const [feedTitle, setFeedTitle] = useState("Not assigned");
  const [data, setData] = useState([]);

  let c = 0;

  let setupDoneBefore = false;

  if (localStorage.getItem("name") && localStorage.getItem("preference")) {
    setupDoneBefore = true;
  }

  const [setupDone, setSetupDone] = useState(setupDoneBefore);

  let preferenceBefore = localStorage.getItem("preference")
    ? localStorage.getItem("preference")
    : "tech";

  const [preferredDomain, setPreferredDomain] = useState(preferenceBefore);

  useEffect(() => {
    const srcList = [
      "wired", //0
      "techcrunch",
      "bbcnews", //2
      "guardian",
      "muscatdaily", //4
      "mint", //5
      "marketwatch",
    ];

    const domainsSet = {
      tech: ["wired", "techcrunch"],
      general: ["bbcnews", "guardian"],
      local: ["muscatdaily"],
      finance: ["mint", "marketwatch"],
    };

    //template fetch Data call
    async function fetchDataPreferred(domain) {
      console.log(`fetching...${domain} `);
      try {
        let tempPreferred = [];
        for (const curSource of domainsSet[domain]) {
          console.log(`fetching..idomain...${curSource} `);
          const response = await axios.get(
            `http://localhost:5000/${curSource}`
          );
          tempPreferred = tempPreferred.concat(response.data);
        }
        // console.log(tempPreferred);
        setNewsData(tempPreferred);
        setFeedTitle("Preferred");
      } catch (error) {
        console.log(error.message);
      }
    }

    async function fetchDataAll(srcList) {
      let dataLocal = [];
      try {
        for (let i = 0; i < srcList.length; i++) {
          console.log(`fetching...${srcList[i]}`);
          const response = await axios.get(
            `http://localhost:5000/${srcList[i]}`
          );
          dataLocal.push(response.data);
        }
        setData(dataLocal);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchDataPreferred(preferredDomain);
    fetchDataAll(srcList);
  }, [preferredDomain]);

  function renderCards() {
    const items = newsData.map((curArticle) => {
      return {
        header: (
          <a href={curArticle.url} target="_blank">
            {curArticle.title}
          </a>
        ),
        meta: curArticle.src,
        fluid: true,
        key: c,
        // style: { marginLeft: "10em" },
      };
    });

    return <Card.Group items={items} />;
  }

  function srcIndex(src) {
    for (let i = 0; i < srcList.length; i++) {
      if (src === srcList[i]) {
        return i;
      }
    }
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function showSelected(requestSrc) {
    setNewsData(data[srcIndex(requestSrc)]);
    setFeedTitle(capitalizeFirstLetter(requestSrc));
  }

  function selectDomainNews(domainReq) {
    let tempNews = [];
    for (let i = 0; i < domainsSet[domainReq].length; i++) {
      tempNews = tempNews.concat(data[srcIndex(domainsSet[domainReq][i])]);
    }
    setNewsData(tempNews);
    setFeedTitle(capitalizeFirstLetter(domainReq));
  }
  let loading = true;
  return (
    <div>
      {setupDone ? (
        <div className="homeScreen">
          <div>
            {data.length === srcList.length ? (
              <div className="menuButtons">
                <Button
                  color="black"
                  content="Local"
                  label={{
                    basic: true,
                    color: "black",
                    pointing: "left",
                    content: data[4].length,
                  }}
                  onClick={() => selectDomainNews("local")}
                />
                <Button
                  color="black"
                  content="General"
                  label={{
                    basic: true,
                    color: "black",
                    pointing: "left",
                    content: data[2].length + data[3].length,
                  }}
                  onClick={() => selectDomainNews("general")}
                />

                <Button
                  color="black"
                  content="Tech"
                  label={{
                    basic: true,
                    color: "black",
                    pointing: "left",
                    content: data[0].length + data[1].length,
                  }}
                  onClick={() => selectDomainNews("tech")}
                />
                <Button
                  color="black"
                  content="Finance"
                  label={{
                    basic: true,
                    color: "black",
                    pointing: "left",
                    content: data[5].length + data[6].length,
                  }}
                  onClick={() => selectDomainNews("finance")}
                />
              </div>
            ) : (
              <MenuButtons
                techSize="Loading"
                generalSize="Loading"
                localSize="Loading"
                financeSize="Loading"
              />
            )}

            <div className="gridParent">
              <Grid>
                <Grid.Column width={3}></Grid.Column>
                <Grid.Column width={7}>
                  <h1>{feedTitle}</h1>
                  {renderCards()}
                </Grid.Column>
                <Grid.Column width={6}>
                  <div id="srcMenuButtons">
                    <></>
                    <Button.Group vertical>
                      {srcList.map((curSrc) => {
                        return (
                          <Button
                            onClick={() => {
                              showSelected(curSrc);
                            }}
                          >
                            {curSrc.toUpperCase()}
                          </Button>
                        );
                      })}
                      <Button onClick={() => selectDomainNews("random")}>
                        RANDOM
                      </Button>
                    </Button.Group>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </div>
      ) : (
        <IntialSetup
          changePreference={setPreferredDomain}
          changeDomainNews={selectDomainNews}
          changeSetup={setSetupDone}
        />
      )}
    </div>
  );
}

export default App;

//  {/* <MenuButtons1
//       techSize={data[0].length + data[1].length}
//       generalSize={data[2].length + data[3].length}
//       localSize={data[4].length}
//       selectDomainNews = {() => {selectDomainNews("local")}}
//       financeSize={data[5].length + data[6].length}
//     /> */}

// const [wired, setWired] = useState([]);
// const [techcrunch, setTechcrunch] = useState([]);
// const [guardian, setGuardian] = useState([]);
// const [bbcnews, setBbcnews] = useState([]);
// const [mint, setMint] = useState([]);
// const [marketwatch, setMarketwatch] = useState([]);
// const [timesofoman, setTimesofoman] = useState([]);
// const [muscatdaily, setMuscatdaily] = useState([]);
//load  and disaply the recommeded displayRequest presettign for the user first
//then as he looks at his preferred newsfeed , load everything else in the background

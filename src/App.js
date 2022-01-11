import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Grid, Message } from "semantic-ui-react";
import MenuButtons from "./MenuButtons1";
import MenuButtons1 from "./MenuButtons1";

function App() {
  const [newsData, setNewsData] = useState([]);
  const [data, setData] = useState([]);

  let c = 0;

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

  // const [wired, setWired] = useState([]);
  // const [techcrunch, setTechcrunch] = useState([]);
  // const [guardian, setGuardian] = useState([]);
  // const [bbcnews, setBbcnews] = useState([]);
  // const [mint, setMint] = useState([]);
  // const [marketwatch, setMarketwatch] = useState([]);
  // const [timesofoman, setTimesofoman] = useState([]);
  // const [muscatdaily, setMuscatdaily] = useState([]);

  let displayRequest = "Jeremiah";
  let preferred = "muscatdaily";
  //load  and disaply the recommeded displayRequest presettign for the user first
  //then as he looks at his preferred newsfeed , load everything else in the background

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

    //template fetch Data call
    async function fetchData(source) {
      console.log(`fetching...${source} `);
      try {
        const response = await axios.get(`http://localhost:5000/${source}`);
        setNewsData(response.data);
        console.log(newsData);
      } catch (error) {
        console.log(error.message);
      }
    }

    function fetchDataPreferred() {
      fetchData("guardian");
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

    fetchDataPreferred();
    fetchDataAll(srcList);
  }, []);

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

  function showSelected(requestSrc) {
    setNewsData(data[srcIndex(requestSrc)]);
  }

  function selectDomainNews(domainReq) {
    let tempNews = [];
    for (let i = 0; i < domainsSet[domainReq].length; i++) {
      tempNews = tempNews.concat(data[srcIndex(domainsSet[domainReq][i])]);
    }

    setNewsData(tempNews);
  }

  return (
    <div>
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

        <h1>For {displayRequest}</h1>
        <div className="gridParent">
          <Grid>
            <Grid.Column width={9}>{renderCards()}</Grid.Column>
            <Grid.Column width={4}>
              {" "}
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
              </Button.Group>
            </Grid.Column>
          </Grid>
        </div>
      </div>
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

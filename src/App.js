import "./App.css";
import Card from "./Card";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      console.log("fetching...");
      try {
        const response = await axios.get("http://localhost:5000/techcrunch");
        setNewsData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {newsData.map((curData) => {
        return <Card title={curData.title} url={curData.url} />;
      })}
    </div>
  );
}

export default App;

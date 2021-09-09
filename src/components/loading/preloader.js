import React, { useEffect, useState } from "react";
import "./loading.css";
import SearchBar from "../location/locationInput";

function PreLoader() {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(undefined);
  const [completed, setcompleted] = useState(undefined);

  useEffect(() => {
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setData(json);
          setloading(true);

          setTimeout(() => {
            setcompleted(true);
          }, 1000);
        });
    }, 2000);
  }, []);

  return (
    <>
      {!completed ? (
        <>
        <header className="App-header">
        {!loading ? (
            <div className="spinner">
              <span>Loading...</span>
              <div className="half-spinner"></div>
            </div>
          ) : (
            <div className="completed">Welcome</div>
          )}
        </header>
        </>
      ) : (
        <>
          <SearchBar />
        </>
      )}
    </>
  );
}

export default PreLoader;
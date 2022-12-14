import Head from "next/head";
import { useEffect, useState } from "react";
import * as _ from "lodash";
import { isValidUrl } from "../utils";

export default function Home() {
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(isValidUrl("www.youtube"));
  }, []);

  const handleError = (err) => {
    if (err?.message) {
      setError(err.message);
    } else {
      setError(null);
    }
    setData(null);
    setFetching(false);
  };

  const fetchData = (url) => {
    setFetching(true);
    setError(null);
    fetch(`/api/preview?url=${url}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((json) => {
            throw new Error(json.error);
          });
        }
        return res.json();
      })
      .then((res) => {
        const { ...rest } = res;
        setData({ ...rest });
        console.log(res);
        setFetching(false);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  let fetchDebounce = _.debounce(fetchData, 500);

  const onChange = (e) => {
    let url = e.target.value;
    url = url.trim();
    if (!isValidUrl(url)) {
      handleError();
      return;
    }
    fetchDebounce(url);
  };

  return (
    <div>
      <Head>
        <title>Social Media Link Previewer by Harsh Vats</title>
        <meta name="description" content="See how your website would look like when you share it on social media." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet"></link>
      </Head>

      <header>
        <h1>Link Previewer</h1>
      </header>

      <div className="container">
        <div>
          <input placeholder="Type url like example.com" onChange={onChange} />
          {fetching ? (
            <div>
              <div className="lds-ripple">
                <div></div>
                <div></div>
              </div>
            </div>
          ) : data ? (
            <div className="preview">
              <div className="card">
                <div
                  className="img-container"
                  style={{
                    backgroundImage: `url(${
                      data.image ||
                      "data:image/png;base64,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"
                    })`
                  }}
                ></div>
                <div className="card-body">
                  <h2 className="title">{data.title}</h2>
                  <p className="desc">{data.desc}</p>
                </div>
              </div>
            </div>
          ) : null}

          {!fetching && data?.favicon && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
              <span style={{ marginRight: 5 }}>Favicon: </span>
              <img src={data.favicon} style={{ background: "white" }} />
            </div>
          )}
          {!fetching && data?.sizeInBytes && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
              <span style={{ marginRight: 5 }}>Page Size: </span>
              {data.sizeInBytes} bytes
            </div>
          )}

          <p className="error">{error}</p>
        </div>
      </div>
    </div>
  );
}

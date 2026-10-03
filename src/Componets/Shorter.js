import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { countpluse, clickplus } from "../actioncreater/actioncreater";

function Shorter() {
  const dispatch = useDispatch();
  const [Prevurl, setPreveurl] = useState("");

  const [urls, seturl] = useState([]);
  useEffect(() => {
    geturl();
  }, []);

  const geturl = async () => {
    try {
      const responce = await fetch("http://localhost:5000/geturl", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await responce.json();
      seturl(data.urls || []);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const shorturl = async () => {
    const responce = await fetch("http://localhost:5000/urlshort", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ Prevurl: Prevurl }),
    });
    const data = await responce.json();
    dispatch(clickplus(data));
    dispatch(countpluse(data));
    await geturl();
    setPreveurl("");
    console.log(data);
  };
  const deleteurl = async (id) => {
    try {
      const responce = await fetch(`http://localhost:5000/deleteurl/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await responce.json();
      await geturl();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="Scontainer">
        <section className="Homepage">
          <div className="text">URL SHORTNER</div>
          <h1>Shorten URL</h1>
          <h2>Url shorting</h2>
          <div className="text">
            Enter a long url create into short and clera url
          </div>

          <input
            className="enterurl"
            value={Prevurl}
            onChange={(e) => {
              setPreveurl(e.target.value);
            }}
            type="text"
            name="url"
            placeholder="https://example.com/very/long/url/that/need/shorting"
          />

          <button className="urlbtn" onClick={shorturl}>
            Shorten
          </button>
          <h1>Your url</h1>
          <hr />
        </section>
        <table className="previouslink">
          <thead>
            <tr>
              <th>Your url</th>
              <th className="sidewrep">Short link</th>
              <th className="sidewrep">Delete</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => {
              return (
                <tr key={url.shortUrl}>
                  <td>{url.orignalurl}</td>
                  <td className="sidewrep">
                    {url.shortUrl}
                    <button
                      className="copybtn"
                      onClick={() =>
                        navigator.clipboard.writeText(url.shortUrl)
                      }
                    >
                      ☐
                    </button>
                  </td>
                  <td className="sidewrep">
                    <i
                      className="fa-solid fa-trash deletebtn"
                      onClick={() => deleteurl(url.id)}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Shorter;

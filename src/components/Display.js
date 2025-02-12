import { React, useEffect, useState, useContext } from "react";
import { useLocalStorage } from "@har4s/use-local-storage";
import { Link } from "react-router-dom";
import AuthContext from "./context/AuthProvider";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

import "./Display.css";
function Display() {
  const [movieData, setMovieData] = useState([]);
  const { auth } = useContext(AuthContext);
  const [uid, setUid] = useLocalStorage("UID");
  let history = useHistory();

  useEffect(() => {
    console.log("CHECK", uid);
    const movieUrl = `https://graceful-hoodie-deer.cyclic.app/title`;

    const makeApiCall = async () => {
      let res = await fetch(movieUrl);
      let data = await res.json();
      setMovieData(data);
      console.log("API is successful", data);
    };

    if (!uid) {
      window.alert("You have no access");
      return;
    } else {
      makeApiCall();
    }
  }, []);

  const movieResult = movieData.map((item, index) => {
    return (
      <div className="result">
        <img key={item.movieId} alt="display" src={item.image} />
        <div className="text">
          <a>{item.title}</a>
          <br></br>
          <a>{item.plot}</a>
        </div>
      </div>
    );
  });

  const handleSignOut = async (e) => {
    e.preventDefault();
    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch(
      "https://graceful-hoodie-deer.cyclic.app/auth/signout",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result, "logoout success");
        setUid(null);
        setMovieData([]);
        window.alert("You have signed out");

        setTimeout(() => {
          history.push("./");
        }, 500);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      <h2>Movie that available </h2>
      <nav>
        <Link to="/">
          <Button>Home Page</Button>
        </Link>
        <Link to="/Popular">
          <Button variant="info">Popular</Button>
        </Link>
        <Button variant="warning" onClick={handleSignOut}>
          Sign Out{" "}
        </Button>
      </nav>
      <div className="divResult">{movieResult}</div>
    </>
  );
}

export default Display;

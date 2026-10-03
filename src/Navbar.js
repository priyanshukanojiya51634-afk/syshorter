import React from "react";
import { useSelector } from "react-redux";

function Navbar() {
  const links = useSelector((state) => state);
  const clicks = useSelector((state) => state);
  return (
    <>
      <div className="navbar">
        <h1 className="Urllog">E-urlshorted</h1>
        <div className="container">
          <div className="Totallink">link {links} </div>
          <div className="Totalclick">Total click {clicks}</div>
        </div>
      </div>
    </>
  );
}

export default Navbar;

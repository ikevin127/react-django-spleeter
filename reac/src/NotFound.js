import React from "react";
import Helmet from "react-helmet";
import logoBP from "./logo.png";
import icon from "./favicon.ico";

export default class NotFound extends React.Component {
  render() {
    let page_title = "Spleeter - Page not found";
    let favicon = icon;
    return (
      <>
        <Helmet>
          <title>{page_title}</title>
          <link rel="icon" href={favicon} />
        </Helmet>
        <div className="notfound-container">
          <img src={logoBP} alt="BADERproductions Logo" />
          <h1>Page not found</h1>
          <p>The page you tried to access was not found</p>
        </div>
      </>
    );
  }
}

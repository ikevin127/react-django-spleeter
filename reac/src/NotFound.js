import React from "react";
import logoBP from "./logo.png";
import Helmet from "react-helmet";

export default class NotFound extends React.Component {
  render() {
    let page_title = "Spleeter - Page not found";
    return (
      <>
        <Helmet>
          <title>{page_title}</title>
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

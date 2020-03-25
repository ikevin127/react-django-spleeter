import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
// Pages
import SpleeterPage from "./SpleeterPage";
import NotFound from "./NotFound";
import "./App.scss";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SpleeterPage} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

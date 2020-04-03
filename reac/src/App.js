import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// Pages
import SpleeterPage from "./SpleeterPage";
import NotFound from "./NotFound";
import "./App.scss";

export default class App extends React.Component {
  render() {
    return (
      <HelmetProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={SpleeterPage} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </HelmetProvider>
    );
  }
}

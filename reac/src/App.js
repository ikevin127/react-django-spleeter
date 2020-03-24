import React from "react";
import axios from "axios";
import "./App.scss";
import spleeter from "./spleeter-logo.png";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spleets: [],
      message: "",
      media: null,
      download: false
    };
  }

  componentDidMount() {
    this.axiosGet();
  }

  axiosGet = () => {
    let self = this;
    let url = "http://localhost:8000/api/spleets/";
    axios
      .get(url)
      .then(function(res) {
        self.setState({ spleets: res.data });
      })
      .catch(err => console.log(err));
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleMediaChange = e => {
    this.setState({
      media: e.target.files[0]
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.axiosGet();
    let form_data = new FormData();
    form_data.append("message", this.state.message);
    form_data.append("media", this.state.media, this.state.media.name);
    let url = "http://localhost:8000/api/spleets/";
    axios
      .post(url, form_data, {
        headers: {
          "content-type": "multipart/form-data"
        }
      })
      .then(res => {
        document.getElementById("message").value = this.setState({
          message: ""
        });
        document.getElementById("media").value = null;
        // window.location.reload()
        this.setState({
          download: true
        });
        setTimeout(
          function() {
            this.setState({
              download: false
            });
          }.bind(this),
          5 * 60 * 1000
        );
      })
      .catch(err => console.log(err));
  };

  downloadVocals(id, filename) {
    let url = `http://127.0.0.1:8000/api/download/vocals/${id}/`;
    fetch(url)
      .then(res => {
        res.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
        });
      })
      .catch(err => console.log(err));
  }

  downloadInstrumental(id, filename) {
    let url = `http://127.0.0.1:8000/api/download/instrumental/${id}/`;
    fetch(url)
      .then(res => {
        res.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    let arr = this.state.spleets;
    let res = arr.map(a => a.id);
    let latest = Math.max(...res);
    //let curr = latest + 1
    console.log(latest);
    return (
      <>
        <div className="App">
          <img src={spleeter} alt="Spleeter by Deezer Logo" />
          <form id="up-form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Message for developer (optional)</label>
              <textarea
                type="text"
                placeholder="Message..."
                id="message"
                className="form-control"
                value={this.state.message}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Select your audio file</label>
              <br />
              <input
                type="file"
                id="media"
                className="btn btn-secondary"
                accept="audio/mp3, audio/mp4"
                onChange={this.handleMediaChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Spleet it
            </button>
          </form>
          {this.state.download ? (
            <>
              <div className="alert alert-success">
                <strong>The spleets are ready!</strong>
                <br />
                <label>Links will be deleted in 5 minutes...</label>
              </div>
              <div className="download-section">
                <button
                  onClick={() => this.downloadVocals(latest, "vocals.mp3")}
                  className="vocals btn btn-danger"
                  download
                >
                  Vocals
                </button>
                <button
                  onClick={() =>
                    this.downloadInstrumental(latest, "instrumental.mp3")
                  }
                  className="vocals btn btn-danger"
                  download
                >
                  Instrumental
                </button>
              </div>
            </>
          ) : null}
          {/* <span></span>
          <div className="cards-container">
            {this.state.spleets
              .slice(Math.max(this.state.spleets.length - 5, 0))
              .map(s => (
                <div
                  key={s.id}
                  className="card text-dark bg-light border-secondary mb-3"
                  style={{ maxWidth: "20rem" }}
                >
                  <div className="card-header">
                    {s.id}# Message for developer
                  </div>
                  <div className="card-body">
                    <p className="card-text">{s.message}</p>
                  </div>
                </div>
              ))}
          </div>
          <span id="span-bottom"></span> */}
          <div className="pt-5 pb-5 footer">
            <div className="container">
              <div className="row">
                <div className="col-lg-5 col-xs-12 about-company">
                  <h2>Spleeter by Deezer</h2>
                  <p className="text-white">
                    Spleeter is the Deezer source separation library with
                    pretrained models written in Python and uses Tensorflow.{" "}
                  </p>
                  <p>
                    <a href="https://github.com/deezer/spleeter">
                      <i
                        title="Spleeter Github"
                        style={{ fontSize: "30px" }}
                        className="fab fa-github text-white"
                      ></i>
                    </a>
                  </p>
                </div>
                <div className="col-lg-3 col-xs-12 links">
                  <h4 className="mt-lg-0 mt-sm-3">Links</h4>
                  <ul className="m-0 p-0 ">
                    <li>
                      <a className="text-white" href="https://www.deezer.com/">
                        Deezer
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white"
                        href="https://pypi.org/project/spleeter/"
                      >
                        Spleeter PyPi
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-white"
                        href="https://pypi.org/project/tensorflow/"
                      >
                        Tensorflow PyPi
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-xs-12 location">
                  <h4 className="mt-lg-0 mt-sm-4">Contact</h4>
                  <ul className="m-0 p-0 ">
                    <li>
                      <a
                        className="text-white"
                        href="https://baderproductions.net/"
                      >
                        BADERproductions - Junior Web Developer
                      </a>
                    </li>
                  </ul>
                  <br />
                  <p className="text-white">
                    <i className="fa fa-phone mr-3"></i>
                    (+44) 741-744-2609
                  </p>
                  <p className="text-white">
                    <i className="fas fa-envelope mr-3"></i>
                    kevin.bader96@gmail.com
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col copyright">
                  <p className="">
                    <small className="text-white-50">
                      {new Date().getFullYear()} © BADERproductions
                      <br />
                      All rights reserved.
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

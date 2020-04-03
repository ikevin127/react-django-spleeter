import React from "react";
import axios from "axios";
import $ from "jquery";
import jQuery from "jquery";
import Loader from "react-loader-spinner";
import LoadingBar from "react-top-loading-bar";
import { Helmet } from "react-helmet-async";
import spleeter from "./spleeter-logo.png";
import icon from "./favicon.ico";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class SpleeterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spleets: [],
      tasks: [],
      message: "",
      errorMsg: "",
      currentStrings: "",
      download: false,
      isLoading: false,
      isError: false,
      info: false,
      media: null,
      timer: null,
      instanceId: 0,
      uploadProgress: 0
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOut = this.handleClickOut.bind(this);
    this.timer = 0;
  }

  componentDidMount() {
    this.axiosGet();
    document.addEventListener("mousedown", this.handleClickOut);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOut);
  }

  getTasks = () => {
    let self = this;
    let url = "http://127.0.0.1:8000/api/tasks/";
    let resd = this.state.tasks.map(a => a.task_id);
    let strings = JSON.stringify(resd);
    this.setState({
      currentStrings: strings
    });
    axios
      .get(url)
      .then(function(res) {
        self.setState({ tasks: res.data });
      })
      .catch(err => console.log(err));
  };

  axiosGet = () => {
    let self = this;
    let url = "http://127.0.0.1:8000/api/spleets/";
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

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      let cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isError === false) {
      this.setState({
        isLoading: true
      });
    }
    let form_data = new FormData();
    form_data.append("message", this.state.message);
    form_data.append("media", this.state.media, this.state.media.name);
    let url = "http://127.0.0.1:8000/api/spleets/";
    let csrftoken = this.getCookie("csrftoken");
    axios
      .post(url, form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrftoken
        },
        onUploadProgress: function(progressEvent) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          this.setState({
            uploadProgress: percentCompleted
          });
          if (percentCompleted <= 99) {
            $("#upload-text").fadeOut(500, function() {
              $(this)
                .text("Uploading file...")
                .fadeIn(500);
            });
          } else {
            $("#upload-text").fadeOut(0, function() {
              $(this)
                .text("")
                .fadeIn(0);
            });
            this.startSpinner();
          }
        }.bind(this)
      })
      .then(res => {
        this.setState({
          instanceId: res.data.id
        });
        console.log("Current instance Spleet ID: " + res.data.id);
        document.getElementById("message").value = this.setState({
          message: ""
        });
        document.getElementById("media").value = null;
        this.timer = setInterval(() => {
          this.getTasks();
          if (this.state.currentStrings.includes(this.state.instanceId)) {
            this.timer = clearInterval(this.timer);
            this.setState({
              isLoading: false,
              download: true
            });
            console.log("Job done, polling stopped.");
          }
        }, 1000);
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        if (err.response === undefined) {
          this.setState({
            isError: true
          });
          this.setState({
            errorMsg: "Undefined error."
          });
        } else {
          let mediaError = err.response.status.toString();
          this.setState({
            isError: true
          });
          this.setState({
            errorMsg: mediaError
          });
        }
      });
  };

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOut = e => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({
        isError: false
      });
    }
  };

  startSpinner() {
    let i = 0;
    let loadingMsg = [
      "Reading audio waveform",
      "Performing source separation",
      "Writing vocals and instrumental",
      "Almost done..."
    ];
    setInterval(function() {
      let newText = loadingMsg[(i, i < loadingMsg.length, i++)];
      $("#loader-text").fadeOut(500, function() {
        $(this)
          .text(newText)
          .fadeIn(500);
      });
    }, 4000);
  }

  downloadVocals(filename, id) {
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

  downloadInstrumental(filename, id) {
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
    let csrftoken = this.getCookie("csrftoken");
    let page_title =
      "Spleeter - Separate Vocals and Accompaniment from MP3 files using Machine Learning";
    let favicon = icon;

    return (
      <>
        <Helmet>
          <title>{page_title}</title>
          <link rel="icon" href={favicon} />
        </Helmet>
        <div className="App">
          {this.state.isError ? (
            <div className="error-bg">
              <div
                ref={node => (this.wrapperRef = node)}
                className="alert alert-danger"
              >
                <strong>Oh snap!</strong>
                <br />
                {this.state.errorMsg}
              </div>
              <label>Touch outside to go back</label>
            </div>
          ) : null}
          {this.state.isLoading ? (
            <>
              <div className="loader-bg">
                <LoadingBar
                  className="loading-bar-up"
                  progress={this.state.uploadProgress}
                  color="#2990f0"
                />
                <label id="upload-text"></label>
                <Loader
                  style={{
                    transform: "rotate(180deg)"
                  }}
                  type="Triangle"
                  color="#00b7ff"
                  height={300}
                  width={300}
                />
                <label id="loader-text"></label>
              </div>
            </>
          ) : null}
          <img src={spleeter} alt="Spleeter by Deezer Logo" />
          <div className="jumbotron jumbotron-fluid">
            <div className="container">
              <h1 className="display-4">Aloha!</h1>
              <p className="lead">
                Have you ever thought about using machine learning to extract
                vocals and instrumentals from your favourite songs ?
                <br />
                <br />
                This is now made possible by{" "}
                <a id="sbd" href="https://github.com/deezer/spleeter">
                  Spleeter
                </a>
                <br />
                <br />
                <span id="span">
                  * If your song file-size is over 10MB, it might take a while.
                  Please be patient.
                </span>
              </p>
            </div>
          </div>
          <form id="up-form" onSubmit={this.handleSubmit}>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
            <div className="form-group">
              <label>Message (optional)</label>
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
              <label>Select your song</label>
              <br />
              <input
                type="file"
                id="media"
                className="btn btn-secondary"
                accept="audio/*"
                onChange={this.handleMediaChange}
                required
              />
            </div>
            <div className="info-button">
              <button
                onClick={() =>
                  this.setState({
                    info: !this.state.info
                  })
                }
                type="button"
              >
                <i className="fas fa-info-circle"></i>
              </button>
            </div>
            {this.state.info ? (
              <div className="alert alert-primary" id="info-message">
                <strong>Allowed audio extensions</strong>
                <br />
                .mp3 .mp4 .wav .flac
                <br />
                <strong>
                  Make sure you can see the file extension in the box above
                  before spleeting
                </strong>
              </div>
            ) : null}
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
                  onClick={() =>
                    this.downloadVocals("vocals.mp3", this.state.instanceId)
                  }
                  className="vocals btn btn-danger"
                  download
                >
                  Vocals
                </button>
                <button
                  onClick={() =>
                    this.downloadInstrumental(
                      "instrumental.mp3",
                      this.state.instanceId
                    )
                  }
                  className="vocals btn btn-danger"
                  download
                >
                  Instrumental
                </button>
              </div>
            </>
          ) : null}
          <div className="pt-5 pb-5 footer">
            <div className="container">
              <div className="row">
                <div className="col-lg-5 col-xs-12 about-company">
                  <h2>Spleeter by Deezer</h2>
                  <p className="text-white">
                    Spleeter is the source separation library with pretrained{" "}
                    <a id="tensor" href="https://www.tensorflow.org/">
                      Tensorflow
                    </a>{" "}
                    models written in Python that separates vocals and
                    accompaniment from audio files.{" "}
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
                  <h4 className="mt-2 mt-lg-0 mt-sm-4">Contact</h4>
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

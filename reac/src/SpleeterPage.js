import React from "react";
import axios from "axios";
import $ from "jquery";
import jQuery from "jquery";
import Loader from "react-loader-spinner";
import Helmet from "react-helmet";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import spleeter from "./spleeter-logo.png";
import icon from "./favicon.ico";

export default class SpleeterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spleets: [],
      message: "",
      media: null,
      download: false,
      isLoading: false
    };
  }

  componentDidMount() {
    this.axiosGet();
  }

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

  startSpinner() {
    let i = 0;
    let loadingMsg = [
      "Uploading file...",
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

  handleSubmit = e => {
    e.preventDefault();
    this.mediaValidation();
    if (this.mediaValidation() === true) {
      this.axiosGet();
      this.setState({
        isLoading: true
      });
      this.startSpinner();
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
          }
        })
        .then(res => {
          document.getElementById("message").value = this.setState({
            message: ""
          });
          document.getElementById("media").value = null;
          this.setState({
            isLoading: false
          });
          this.setState({
            download: true
          });
          setTimeout(
            function() {
              this.axiosGet();
              this.setState({
                download: false
              });
            }.bind(this),
            5 * 60 * 1000
          );
        })
        .catch(err => console.log(err));
    } else {
      console.log("Accepted file-types: .mp3, .mp4, .wav or .flac");
    }
  };

  mediaValidation() {
    var allowedFiles = [".mp3", ".mp4", ".wav", ".flac"];
    var fileUpload = document.getElementById("media");
    var validationMsg = document.getElementById("validation-message");
    var regex = new RegExp(
      "([a-zA-Z0-9s_\\.-:])+(" + allowedFiles.join("|") + ")$"
    );
    if (!regex.test(fileUpload.value.toLowerCase())) {
      validationMsg.style.padding = "20px 10px";
      validationMsg.style.margin = "15px auto 0 auto";
      validationMsg.style.backgroundColor = "#be0000";
      validationMsg.innerHTML =
        "Your file has to end with one of the following extensions<b> <br/>" +
        allowedFiles.join(", ") +
        "</b>";
      return false;
    }
    validationMsg.style.display = "none";
    return true;
  }

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
    let curr = latest + 1;
    let csrftoken = this.getCookie("csrftoken");
    //console.log(curr);

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
          {this.state.isLoading ? (
            <>
              <div className="loader-bg">
                <Loader
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
                Have you ever thought about using Machine Learning technology to
                extract vocals or instrumentals from your favourite songs ?
                <br />
                <br />
                This is now a reality with{" "}
                <a id="sbd" href="https://github.com/deezer/spleeter">
                  Spleeter by Deezer
                </a>
                <br />
                <br />
                <span id="span">
                  * The bigger your song file size, the longer it takes. Please
                  be patient.
                </span>
              </p>
            </div>
          </div>
          <form id="up-form" onSubmit={this.handleSubmit}>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
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
                onChange={this.handleMediaChange}
                required
              />
              <div id="validation-message"></div>
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
                  onClick={() => this.downloadVocals(curr, "vocals.mp3")}
                  className="vocals btn btn-danger"
                  download
                >
                  Vocals
                </button>
                <button
                  onClick={() =>
                    this.downloadInstrumental(curr, "instrumental.mp3")
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
                    Spleeter by Deezer is the source separation library with
                    pretrained models written in Python using{" "}
                    <a id="tensor" href="https://www.tensorflow.org/">
                      Tensorflow
                    </a>{" "}
                    to separate vocals from accompaniment from MP3 audio files.{" "}
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

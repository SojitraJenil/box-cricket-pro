import React from "react";
import "./Slider.css";

function Slider() {
  return (
    <div>
      <div className="main-banner" id="top">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="left-content">
                <div className="thumb">
                  <div className="inner-content">
                    <h4>Limited Players
                    </h4>
                    <span>Typically played with smaller teams (e.g., 6-8 players per side).</span>
                    <div className="main-border-button">
                      <a href="#">Purchase Now!</a>
                    </div>
                  </div>
                  <img src={require("./image/513149ebe19daba32a1c472169575a640694efb0")} alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-content">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4 className="">Time-Saving</h4>
                          <span>Best For Kids </span>
                        </div>
                        <img
                          src={require("./image/a20240902092050.png")}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4>Surat</h4>
                          <span>Best Clothes For Men</span>
                        </div>
                        <img
                          src={require("./image/ns-box-cricket-hanamkonda-warangal-sports-ground-rwa36rv79f.jpg")}
                          alt=""
                        />{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4>Kids</h4>
                          <span>Best Clothes For Kids</span>
                        </div>
                        <img
                          src={require("./image/orbitMall_box_cricket_1.png")}
                          alt=""
                        />{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4>Accessories</h4>
                          <span>Best Trend Accessories</span>
                        </div>
                        <img
                          src={require("./image/product-jpeg.jpg")}
                          alt=""
                        />{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Slider;

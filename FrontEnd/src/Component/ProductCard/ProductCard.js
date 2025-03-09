import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./ProductCard.css";
import axios from "axios";
import { MdCurrencyRupee } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { IoStar } from "react-icons/io5";
import { Link } from "react-router-dom";
import LoaderSmall from "../../Container/Loading/LoaderSmall";
import Pagination from "react-bootstrap/Pagination";
import { Card, CardImg, CardBody, Badge } from "react-bootstrap"
import { FaTools } from "react-icons/fa"
import { RenderHost } from "../../API/Api";
import { useNavigate } from "react-router-dom";


function Product_card({ SetMainCart, inputValue }) {
  const Navigation = useNavigate();
  const [data, setdata] = useState();
  const [loading, setLoading] = useState(false);
  console.log('data :>> ', data);
  const [cate, setcate] = useState(null);
  const [sortingOption, setSortingOption] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Fix the useState call
  const [totalPages, setTotalPages] = useState(1);

  const notify = (val) => {
    toast("Box Added Successfully...!", { icon: "👏" });
    // setCart(Cart + 1);
    Navigation(`/product/${val._id}`)
    // SetMainCart(Cart);
    // AddItemToCart(val);
  };

  useEffect(() => {
    if (inputValue.length > 0) {
      FindProductByProductName(inputValue);
    } else {
      Product();
    }
    Category();
  }, [inputValue]); //

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const AddItemToCart = async (val) => {
    console.log('val :>> ', val);
    try {
      const response = await axios.post(
        `${RenderHost}/addItemToCart`,
        {
          userId,
          productId: val._id,
          quantity: 1,
          Product_stock: val.Product_stock,
          product_name: val.product_name,
          product_price: val.product_price,
          product_img: val.product_img[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const FindProductByProductName = (inputValue) => {
    console.log(inputValue);
    if (inputValue) {
      axios
        .get(`${RenderHost}/Product_show/ProductName/${inputValue}`)
        .then(function (response) {
          setdata(response.data.products);
        })
        .catch(function (error) {
          console.log("error", error);
        });
    }
  };

  const handleHighToLow = () => {
    axios
      .get(`${RenderHost}/Product_show/Product_Price/high_to_low`)
      .then(function (response) {
        setdata(response.data.products);
        setSortingOption("high_to_low");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleLowToHigh = () => {
    axios
      .get(`${RenderHost}/Product_show/Product_Price/low_to_high`)
      .then(function (response) {
        setdata(response.data.products);
        setSortingOption("low_to_high");
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const Category = () => {
    axios
      .get(`${RenderHost}/categories`)
      .then(function (response) {
        setcate(response.data.categories);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const Product = () => {
    setLoading(true); // Set loading to true when the request starts
    axios
      .get(`${RenderHost}/Product_Show`)
      .then(function (response) {
        setdata(response.data.product_show);
        setTotalPages(response.data.page);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const Product1 = (item) => {
    if (item) {
      axios
        .get(`${RenderHost}/Product_show/category/${item}`)
        .then(function (response) {
          setdata(response.data.One_product_show);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    handlePageChange(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    axios
      .get(`${RenderHost}/Product_show?page_no=${pageNumber}`)
      .then(function (response) {
        setdata(response.data.product_show);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <>
      <div className="py-5">
        <Container>
          <div>
            <div className="Title">
              <h4>
                <center className="fw-bold">Select Branch :</center>{" "}
              </h4>
            </div>
            <div className="Btn py-2">
              <input
                type="button"
                value={"All"}
                className="my-md-2 my-sm-2 my-2"
                onClick={() => Product()} // Pass item name to Product1 function
              />
              {cate != null &&
                cate.map((item) => {
                  return (
                    <input
                      type="button"
                      value={item.name}
                      className="my-md-2 my-sm-2 my-2"
                      onClick={() => Product1(item.name)} // Pass item name to Product1 function
                    />
                  );
                })}
            </div>
            <div className="d-flex">
              <div className="">
                <h4 className="mt-2 me-3 ">Filter</h4>
              </div>
              <div>
                {/* Sorting radio buttons */}
                <input
                  type="radio"
                  name="sortingOption"
                  onChange={handleHighToLow}
                  checked={sortingOption === "high_to_low"} // Check if High to Low is selected
                />
                <span className="ps-2">High to Low</span>
                <br />
                <input
                  type="radio"
                  name="sortingOption"
                  onChange={handleLowToHigh}
                  checked={sortingOption === "low_to_high"} // Check if Low to High is selected
                />
                <span className="ps-2">Low to High</span>
                <br />
              </div>
              <div className="ms-auto">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>{" "}
              </div>
            </div>

            <hr />
          </div>
          <div className="">
            {loading ? (
              <LoaderSmall />
            ) : (
              <Row>
                {data != null &&
                  data.map((val) => {
                    console.log('val :>> ', val);
                    return (
                      <Col
                        xxl={4}
                        xl={4}
                        lg={4}
                        md={6}
                        sm={12}
                        className="mb-4 mb-lg-0 my-4"
                      >
                        <Card className="h-100 shadow-sm cursor-pointer position-relative">
                          {val.isRenovation && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backdropFilter: "blur(5px)",
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                                zIndex: 1, // Ensure it overlays the content
                              }}
                            ></div>
                          )}
                          <div className="bg-info text-white px-3 py-2 font-medium">
                            <span> Book only minimum 3 hour</span>
                          </div>
                          {val.isRenovation && (
                            <div
                              className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                              style={{ zIndex: 1 }}
                            >
                              <div className="bg-white p-5 rounded-lg shadow text-center">
                                <FaTools className="text-warning mb-2" size={24} />
                                <h5 className="fw-bold text-dark m-0"> We are under maintenance</h5>
                              </div>
                            </div>
                          )}

                          <div
                            className="position-relative"
                            onClick={() => Navigation(val.isRenovation ? "#" : `/product/${val._id}`)}
                          >
                            <CardImg
                              src={val.product_img[0] || val.product_img}
                              alt={val.product_name}
                              className="object-fit-cover"
                              style={{ height: "200px" }}
                            />
                            <Badge
                              bg="info"
                              className="position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "35px", height: "35px" }}
                            >
                              x4
                            </Badge>
                          </div>

                          <CardBody className="d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="mb-0 text-truncate">{val.product_name}</h5>
                              <div className="d-flex">
                                {[...Array(5)].map((_, index) => (
                                  <IoStar key={index} className={`fs-5 ${index < val.Product_rating ? "text-warning" : "text-muted"}`} />
                                ))}
                              </div>
                            </div>

                            <p className="text-muted small mb-2">{val.product_address}</p>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                <h5 className="mb-0 text-primary">
                                  <MdCurrencyRupee className="mb-1" />
                                  {val.product_price} <span className="text-black font-black">(1 Hour)</span>
                                </h5>
                                {val.Product_dis_rate && (
                                  <small className="text-muted text-decoration-line-through">
                                    <MdCurrencyRupee className="mb-1" />
                                    {val.product_price * Math.floor(Math.random() * val.product_price)
                                    }
                                  </small>
                                )}
                              </div>
                              {val.Product_dis_rate && <Badge bg="success">{val.Product_dis_rate}% OFF</Badge>}
                            </div>

                            <div className="mt-auto d-flex justify-content-between">
                              <Link
                                to={val.isRenovation ? "#" : `/product/${val._id}`}
                                className={`btn btn-outline-primary ${val.isRenovation ? "disabled" : ""}`}
                              >
                                View Details
                              </Link>
                              <button
                                className={`btn btn-primary ${val.isRenovation ? "disabled" : ""}`}
                                onClick={() => !val.isRenovation && AddItemToCart(val)}
                                disabled={val.isRenovation}
                              >
                                Contact
                              </button>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
              </Row>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}

export default Product_card;

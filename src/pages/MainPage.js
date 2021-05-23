import React, { useEffect, useState } from "react";
import apiCall from "../service/apiCall";
const sw = require("stopword");

export default function MainPage() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setperPage] = useState(10);
  const [sortBy, setSortBy] = useState("Relevance");
  const [accordionToggle, setAccordionToggle] = useState(false);
  useEffect(async () => {
    if (searchTerm) {
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}&search=${searchTerm}`
      )
        .then((response) => {
          setData(response.data.results);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    } else {
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}`
      )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    }
  }, [page, perPage]);

  function onChangeHandler(e) {
    setSearchTerm(e.target.value);
  }

  async function blankSearchPageOne() {
    await apiCall(
      `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}`
    )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("Error is ", error.data);
      });
  }

  async function onSearch() {
    if (searchTerm === "") {
      if (page > 1) {
        setData([]);
        setPage(1);
      } else blankSearchPageOne();
    } else {
      setData([]);
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}&search=${searchTerm}`
      )
        .then((response) => {
          setData(response.data.results);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "next") {
      setData([]);
      let currentPage = page;
      setPage((currentPage = currentPage + 1));
    } else if (name === "previous") {
      if (page <= 1) {
        alert("You are on the first page");
        setPage(1);
      } else {
        let currentPage = page;
        setPage((currentPage = currentPage - 1));
      }
    } else if (name === "accordion") {
      setAccordionToggle(value);
      if (accordionToggle === value) {
        setAccordionToggle(false);
      }
    } else {
      if (page > 1) setPage(1);
      else {
        onSearch();
      }
    }
  }

  function dropDownHelper(e, type) {
    e.preventDefault();
    const { value } = e.target.attributes;
    if (type === "per-page-dropdown") setperPage(value.nodeValue);
    else if (type === "sort-dropdown") setSortBy(value.nodeValue);
  }

  function options(dropdown) {
    if (dropdown === "per-page-dropdown") {
      const content = [5, 10, 20, 30];
      return content.map((item, index) => (
        <li key={index}>
          <a
            className={
              parseInt(perPage) === item
                ? "dropdown-item active"
                : "dropdown-item"
            }
            value={item}
            onClick={(e) => dropDownHelper(e, "per-page-dropdown")}
          >
            {item}
          </a>
        </li>
      ));
    } else if (dropdown === "sort-dropdown") {
      const content = [
        "Relevance",
        "Likes: More-To-Less",
        "Likes: Less-To-More",
        "Photos: More-To-Less",
        "Photos: Less-To-More",
      ];
      return content.map((item, index) => (
        <li key={index}>
          <a
            className={
              sortBy === item ? "dropdown-item active" : "dropdown-item"
            }
            value={item}
            onClick={(e) => dropDownHelper(e, "sort-dropdown")}
          >
            {item}
          </a>
        </li>
      ));
    }
  }

  function sortHelper() {
    if (sortBy === "Relevance") {
      return data;
    } else if (sortBy === "Likes: More-To-Less") {
      const tempData = [...data];
      tempData.sort((a, b) => b.user.total_likes - a.user.total_likes); //Desending
      return tempData;
    } else if (sortBy === "Likes: Less-To-More") {
      const tempData = [...data];
      tempData.sort((a, b) => a.user.total_likes - b.user.total_likes); //Ascending
      return tempData;
    } else if (sortBy === "Photos: More-To-Less") {
      const tempData = [...data];
      tempData.sort((a, b) => b.user.total_photos - a.user.total_photos); //Desending
      return tempData;
    } else if (sortBy === "Photos: Less-To-More") {
      const tempData = [...data];
      tempData.sort((a, b) => a.user.total_photos - b.user.total_photos); //Ascending
      return tempData;
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="position-sticky top-0 bg-light mb-3 topbar-form"
      >
        <div className="row">
          <div className="col-sm-12 col-md-10">
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Search here..."
              onChange={onChangeHandler}
            />
          </div>
          <div className="col-sm-12 col-md-2">
            <button
              type="submit"
              className="btn btn-primary mb-3 search-button"
            >
              Search
            </button>
          </div>
        </div>
        <div className="row">
          <div className="dropdown col-6 col-sm-6 col-md-6 col-lg-6 per-page-dropdown">
            <label className="form-label me-2">Images per page:</label>
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {perPage}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {options("per-page-dropdown")}
            </ul>
          </div>
          <div className="dropdown col-6 col-sm-6 col-md-6 col-lg-6 sort-dropdown">
            <div className="sort-dropdown-inner-div">
              <label className="form-label me-2">Sort By:</label>
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {sortBy}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                {options("sort-dropdown")}
              </ul>
            </div>
          </div>
        </div>
      </form>
      <div className="row">
        {sortHelper().length > 0 ? (
          sortHelper().map((item) => {
            if (
              item.user.instagram_username !== ("@anakin1814" || "@hamzaports")
            ) {
              return (
                <>
                  <div key={item.id} className="col-sm-12 col-md-4 img-column">
                    <img
                      className="img-fluid img-class w-100"
                      alt={item.alt_description}
                      src={item.urls.small}
                    />
                    <div className="download-button-div">
                      <a
                        href={`https://unsplash.com/photos/${item.id}/download?force=true`}
                        className="btn btn-outline-dark download-button"
                      >
                        Download
                      </a>
                    </div>
                    {!item.user.instagram_username && (
                      <b className="text-capitalize" style={{ color: "red" }}>
                        No userId
                      </b>
                    )}
                    {!item.alt_description && (
                      <b className="text-capitalize" style={{ color: "blue" }}>
                        No Hashtags
                      </b>
                    )}
                    {!item.user.location && (
                      <b
                        className="text-capitalize"
                        style={{ color: "darkorange" }}
                      >
                        No Location
                      </b>
                    )}
                    {item.user.location && (
                      <>
                        <h4>Location is:</h4>
                        <div>{item.user.location}</div>
                      </>
                    )}
                    <h4>Hashtags from here:</h4>
                    <div>shot_on_my_camera,</div>
                    <div>india,</div>
                    <div>photography,</div>
                    <div>instagram,</div>
                    <div>love,</div>
                    {item.alt_description
                      ? sw
                          .removeStopwords(item.alt_description.split(" "))
                          .map((item1, j) => {
                            return <div>{item1},</div>;
                          })
                      : null}
                    <div>
                      <b style={{ color: "green" }}>Caption From Here</b>
                    </div>
                    {/* <div className="text-capitalize">{item.alt_description}</div> */}
                    <div>.</div>
                    <div>.</div>
                    <div>credits: @{item.user.instagram_username}</div>
                    <div>.</div>
                    <div>.</div>
                    {/* <div>To feature your shot, use: #shot_on_my_camera</div> */}
                    {/* <div>or tag us: @shot_on_my_camera</div> */}
                    <div>
                      To feature your shot, use the tag: @shot_on_my_camera
                    </div>
                    <div>.</div>
                    <div>.</div>
                    <div>.</div>
                  </div>
                </>
              );
            }
          })
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="navigation-button d-flex justify-content-between">
        <div>
          <button
            onClick={onSubmitHandler}
            name="previous"
            className="btn btn-outline-primary"
          >
            Previous
          </button>
        </div>
        <div className="justify-content-center">{page}</div>
        <div>
          <button
            onClick={onSubmitHandler}
            name="next"
            className="btn btn-outline-primary"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

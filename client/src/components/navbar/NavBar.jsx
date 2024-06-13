import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { IoCreateOutline, IoLogOutOutline } from "react-icons/io5";

import "./navbar.css";
const NavBar = ({ username, setAuth, setShow, setOpenComp }) => {
  const logout = () => {
    localStorage.clear();
    setAuth(false);
  };
  return (
    <>
      <div className="">
        <div className="nav-leftArea d-none d-md-flex align-items-center justify-content-between px-4 py-2">
          <h5 className={" "}>Welcome, {username}</h5>
          <div className={"nav-rightArea"}>
            <div className="d-md-block d-none">
              <Button
                variant="outline-info"
                className="nav-add-btn mx-2"
                onClick={() => setShow(true)}
              >
                Create New Poll
              </Button>
              <Button
                type="button"
                className="nav-logout-btn "
                variant="outline-danger"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className=" nav-leftArea d-md-none d-flex align-items-center justify-content-between px-3 py-2 m-0">
          <div
            className="nav-add-icon"
            onClick={() => {
              setOpenComp("poll");
              setShow(true);
            }}
          >
            <IoCreateOutline /> New Poll
          </div>
          <div className="nav-logout-icon" onClick={logout}>
            <IoLogOutOutline />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateItem from "./components/pages/CreateItem";
import Home from "./components/pages/Home";
import CreatorDashboard from "./components/pages/CreatorDashboard";
import MyAssets from "./components/pages/MyAssets";
import NavBar from "./components/layout/NavBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

function App() {
  return (
    <Router>
      <Fragment>
        <Container>
          <NavBar />
          <Box sx={{ m: 1 }}>
            <Container>
              <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route
                  exact
                  path="/create-item"
                  element={<CreateItem />}
                ></Route>
                <Route exact path="/myassets" element={<MyAssets />}></Route>
                <Route
                  exact
                  path="/creator-dashboard"
                  element={<CreatorDashboard />}
                ></Route>
              </Routes>
            </Container>
          </Box>
        </Container>
      </Fragment>
    </Router>
  );
}

export default App;

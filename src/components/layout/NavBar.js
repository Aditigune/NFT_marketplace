import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const NavBar = () => {
  return (
    <Box sx={{ m: 1, flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography paragraph={true} variant="body" sx={{ margin: 2 }}>
            <Link to="/">Home</Link>
          </Typography>
          <Typography paragraph={true} variant="body" sx={{ margin: 2 }}>
            <Link to="/create-item">Create Item for Sale</Link>
          </Typography>
          <Typography paragraph={true} variant="body" sx={{ margin: 2 }}>
            <Link to="/myassets">My Assets</Link>
          </Typography>
          <Typography paragraph={true} variant="body" sx={{ margin: 2 }}>
            <Link to="/creator-dashboard">Creator Dashboard</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
  /* return (
    <div>
      <Fragment>
        <Link to="/">Home</Link>
        <Link to="/create-item">Create Item for Sale</Link>
        <Link to="/myassets">My Assets</Link>
        <Link to="/creator-dashboard">Creator Dashboard</Link>
      </Fragment>
    </div>
  ); */
};

export default NavBar;

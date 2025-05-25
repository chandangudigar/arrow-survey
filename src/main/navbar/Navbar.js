import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import React, { useContext } from "react";
import { ReactComponent as TickSvg } from "../../assets/Tick.svg";
import "./navbar.css";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthCOntext";

const settings = ["Profile", "Sign Out"];
function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
      console.log("User logged out successfully");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AppBar position="static" sx={{ padding: " 0 20px ", backgroundColor: "#1976d269" }}>
      <Toolbar disableGutters>
        <IconButton size="small" edge="start" color="inherit" aria-label="logo">
          <TickSvg className="navbar-logo" />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align="left" marginLeft="1rem">
          Arrow Survey
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={user?.fullname} src={user?.photo} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem>
              <Typography sx={{ textAlign: "right" }}>{user?.fullname}</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleCloseUserMenu();
              }}
            >
              <Typography sx={{ textAlign: "center" }}>Sign Out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

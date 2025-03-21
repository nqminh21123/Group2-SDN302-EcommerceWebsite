import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import {
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  LogIn,
} from "lucide-react";
import "./styles/Navbar.css";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const DashboardNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [messageCount, setMessageCount] = useState(3);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth?.user || null);
  const dispatch = useDispatch();

  useEffect(() => {
    setUser(auth?.user || null);
  }, [auth]);

  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  if (isLoginPage) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm("Đăng xuất ?")) {
      dispatch(logout());
    }
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className={`py-2 transition-all ${
        scrolled ? "navbar-scrolled shadow-sm" : ""
      }`}
      expanded={expanded}
    >
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <div className="brand-logo me-2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 12l-4 4-4-4M12 8v8" />
            </svg>
          </div>
          <span className="fw-bold">AdminDash</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          className="border-0"
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" active className="fw-medium px-3">
              Dashboard
            </Nav.Link>
            <Nav.Link href="/products" className="fw-medium px-3">
              Products
            </Nav.Link>
            <Nav.Link href="#" className="fw-medium px-3">
              Customers
            </Nav.Link>
            <Nav.Link href="#" className="fw-medium px-3">
              Analytics
            </Nav.Link>
            <Nav.Link href="#" className="fw-medium px-3">
              Reports
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            <Form className="d-flex position-relative">
              <div className="search-container">
                <Form.Control
                  type="search"
                  placeholder="Search..."
                  className="me-2 bg-dark-subtle border-0 rounded-pill ps-4 pe-5"
                  aria-label="Search"
                />
                <Button variant="link" className="search-button p-0">
                  <Search size={18} className="text-light-emphasis" />
                </Button>
              </div>
            </Form>

            <div className="nav-icons d-flex align-items-center ms-2">
              <Button variant="link" className="nav-icon-btn">
                <Bell size={20} className="text-light" />
                {notificationCount > 0 && (
                  <Badge pill bg="danger" className="notification-badge">
                    {notificationCount}
                  </Badge>
                )}
              </Button>

              <Button variant="link" className="nav-icon-btn">
                <MessageSquare size={20} className="text-light" />
                {messageCount > 0 && (
                  <Badge pill bg="danger" className="notification-badge">
                    {messageCount}
                  </Badge>
                )}
              </Button>

              <Dropdown align="end" className="ms-3">
                <Dropdown.Toggle
                  as="div"
                  className="user-dropdown d-flex align-items-center"
                >
                  <div className="avatar-container rounded-circle overflow-hidden bg-primary d-flex justify-content-center align-items-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="ms-2 d-none d-md-block text-start">
                    <div className="fw-semibold text-white">
                      {user ? `${user.name} - ${user.role}` : ""}
                    </div>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-end shadow border-0 py-2">
                  <Dropdown.Item href="#" className="px-4 py-2">
                    <User size={16} className="opacity-75 me-2" />
                    <span>Profile</span>
                  </Dropdown.Item>
                  <Dropdown.Item href="#" className="px-4 py-2">
                    <Settings size={16} className="opacity-75 me-2" />
                    <span>Settings</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="px-4 py-2 text-danger"
                  >
                    <LogOut size={16} className="opacity-75 me-2" />
                    <span>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DashboardNavbar;

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./AppLayout.css";
import AddProduct from "./components/AddProduct";
import Cloudinary from "./components/Cloudinary";
import CouponList from "./components/CouponList";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import DashboardNavbar from "./components/NavBar";
import OrderList from "./components/Order";
import ProductList from "./components/ProductList";
import ProductManagement from "./components/ProductManagement";

function ProtectedRoute({ element }) {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return auth?.user ? element : null;
}

function MainContent({ children }) {
  return <main className="main-content">{children}</main>;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <DashboardNavbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={
                  <MainContent>
                    <Dashboard />
                  </MainContent>
                }
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute
                element={
                  <MainContent>
                    <ProductList />
                  </MainContent>
                }
              />
            }
          />
          <Route
            path="/products/view/:id"
            element={
              <ProtectedRoute
                element={
                  <MainContent>
                    <ProductManagement />
                  </MainContent>
                }
              />
            }
          />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute
                element={
                  <MainContent>
                    <AddProduct />
                  </MainContent>
                }
              />
            }
          />
          <Route
            path="/cloudinary"
            element={
              <ProtectedRoute
                element={
                  <MainContent>
                    <Cloudinary />
                  </MainContent>
                }
              />
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute
                element={
                  <MainContent>
                    <OrderList />
                  </MainContent>
                }
              />
            }
          />

          <Route
            path="/coupon"
            element={
              <ProtectedRoute
                element={
                  <MainContent>
                    <CouponList />
                  </MainContent>
                }
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

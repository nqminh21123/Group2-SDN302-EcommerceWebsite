import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import ProductManagement from "./components/ProductManagement";
import ProductList from "./components/ProductList";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DashboardNavbar from "./components/NavBar";
import AddProduct from "./components/AddProduct";
import "./AppLayout.css";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

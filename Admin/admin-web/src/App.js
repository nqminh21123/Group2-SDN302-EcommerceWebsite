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

function App() {
  return (
    <Router>
      <div className="app-container">
        <DashboardNavbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/products"
            element={<ProtectedRoute element={<ProductList />} />}
          />
          <Route
            path="/products/view/:id"
            element={<ProtectedRoute element={<ProductManagement />} />}
          />
          <Route
            path="/products/add"
            element={<ProtectedRoute element={<AddProduct />} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

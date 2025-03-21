import React from "react";
import ProductManagement from "./components/ProductManagement";
import ProductList from "./components/ProductList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DashboardNavbar from "./components/NavBar";
import "./AppLayout.css";

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
              <main className="main-content">
                <Dashboard />
              </main>
            }
          />
          <Route
            path="/products"
            element={
              <main className="main-content">
                <ProductList />
              </main>
            }
          />
          <Route
            path="/products/view/:id"
            element={
              <main className="main-content">
                <ProductManagement />
              </main>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

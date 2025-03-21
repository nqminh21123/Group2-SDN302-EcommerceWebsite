import ProductManagement from "./components/ProductManagement";
import ProductList from "./components/ProductList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/view/:id" element={<ProductManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

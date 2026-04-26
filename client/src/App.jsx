import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreateBusiness from "./pages/CreateBusiness";
import MyBusiness from "./pages/MyBusiness";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />


      <Route path="/create-business" element={<CreateBusiness />} />
      <Route path="/my-business" element={<MyBusiness />} />
      <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
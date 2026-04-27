import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreateBusiness from "./pages/CreateBusiness";
import MyBusiness from "./pages/MyBusiness";
import AddProduct from "./pages/AddProduct";
import BusinessProfile from "./pages/BusinessProfile";
import Search from "./pages/Search";
import EditProduct from "./pages/EditProduct";


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
      <Route path="/business/:id" element={<BusinessProfile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
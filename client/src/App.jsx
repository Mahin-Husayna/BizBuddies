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
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";

import BusinessDetails from "./pages/BusinessDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Notifications from "./pages/Notifications";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import Insights from "./pages/Insights";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />



      <Route path="/create-business" element={<CreateBusiness />} />
      <Route path="/my-business" element={<MyBusiness />} />
      <Route path="/add-product" element={<AddProduct />} />
      
      <Route path="/business/:id" element={<BusinessProfile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/edit-product/:id" element={<EditProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/insights" element={<Insights />} />
      </Routes>
    </Router>
  );
}

export default App;
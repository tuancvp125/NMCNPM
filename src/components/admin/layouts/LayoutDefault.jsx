import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Product from "../../../pages/Product";
import ProductDetail from "../pages/productDetail/ProductDetail";
import ProductManagement from "../pages/productManagament/productManagement";
import ProductCreate from "../pages/productManagament/productCreate";
import ProductEdit from "../pages/productManagament/productEdit";
import UserManagement from "../pages/userManagement/userManagement";
import UserEdit from "../pages/userManagement/userEdit.jsx";
import UserCreate from "../pages/userManagement/userCreate.jsx";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import OrderManagement from "../pages/order/Orders";
import Setting from "../pages/setting/Setting";
import ChatTicketManagement from "../pages/chat/ChatTicketManagement";
import "./LayoutDefault.css";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import CategoryManagement from "../pages/categoryManagement/categoryManagement";
function LayoutDefault() {
  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Header />
          <Breadcrumbs className="breadcrumbs"/>

          <div className="main-content">
            <Routes>
              {/* Redirect /admin to /admin/dashboard */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<Product />} />
              <Route path="/admin/dashboard/:id" element={<ProductDetail />} />
              <Route path="/admin/order" element={<OrderManagement />} />
              <Route path="/admin/product-management" element={<ProductManagement />} />
              <Route path="/admin/product-management/product-create" element={<ProductCreate />} />
              <Route path="/admin/product-management/product-edit" element={<ProductEdit />} />
              <Route path="/admin/user-management" element={<UserManagement />} />
              <Route path="/admin/user-management/user-edit" element={<UserEdit />} />
              <Route path="/admin/user-management/user-create" element={<UserCreate />} />
              <Route path="/admin/category-management" element={<CategoryManagement />} />
              <Route path="/admin/setting" element={<Setting />} />
              <Route path="/admin/chat-management" element={<ChatTicketManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default LayoutDefault;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../../auth/signup";
import Login from "../../auth/login";
import UserManagement from "../userManagement/userManagement";
import UserCreate from "../userManagement/userCreate";
import UserEdit from "../userManagement/userEdit";
import ProductManagement from "../productManagament/productManagement";
import ProductCreate from "../productManagament/productCreate";
import ProductEdit from "../productManagament/productEdit";
import LoanDetail from "../sell/loanDetail";
import ChatTicketManagement from "../chat/ChatTicketManagement";

export default function HomeAdmin() {
    return (
        <Router>
            <div className="main-body">
                <Routes>
                    <Route path="/" element={<UserManagement />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/user-management/user-create" element={<UserCreate />} />
                    <Route path="/user-management/user-edit" element={<UserEdit />} />
                    <Route path="/product-management" element={<ProductManagement />} />
                    <Route path="/product-management/product-create" element={<ProductCreate />} />
                    <Route path="/product-management/product-edit" element={<ProductEdit />} />
                    <Route path="/loan/loan-detail" element={<LoanDetail />} />
                    <Route path="/chat-management" element={<ChatTicketManagement />} />
                </Routes>
            </div>
        </Router>
    );
}

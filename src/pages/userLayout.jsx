import React from 'react';
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLayout = ({ children }) => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <div>{children}</div> {/* Route children will be rendered here */}
      <Footer />
    </div>
  );
};

export default UserLayout;
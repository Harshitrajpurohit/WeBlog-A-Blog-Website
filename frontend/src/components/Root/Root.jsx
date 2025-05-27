import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { list } from 'postcss';

const Root = () => {
  // const [listings, setListing] = useState([]);

  // useEffect(() => {
  //   axios.get('/api/')
  //     .then((response) => {
  //       setListing(response.data);
  //     }) 
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // },);


  return (
    <>
      <Header />
      <Outlet/>
      <Footer />
    </>
  );
};

export default Root;

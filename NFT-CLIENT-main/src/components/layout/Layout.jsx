import { Box } from '@chakra-ui/react';
import React from 'react';
import Footer from '../Footer/Footer';

const Layout = ({children}) => {
  return (
    <>
    <Box style={{
        backgroundColor:'rgb(6 6 6)',
        padding:'0px 20px',
        color:'white'
    }}>
      {children}
    </Box>
    <Footer/>
    </>
  );
}
export default Layout;

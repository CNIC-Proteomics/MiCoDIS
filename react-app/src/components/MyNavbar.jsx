import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function MyNavbar() {
  return (
    <Navbar bg='dark' variant='dark'>
        <Container style={{margin:'0'}}>
            <Navbar.Brand href="#">MiCoDIS</Navbar.Brand>
        </Container>
    </Navbar>
  )
}

export default MyNavbar
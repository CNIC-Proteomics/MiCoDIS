import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function MyNavbar() {
  return (
    <Navbar bg='dark' variant='dark'>
        <Container style={{margin:'0'}}>
            <Navbar.Brand><Link to='/' style={{textDecoration:'none', color:'rgba(255,255,255)'}}>MiCoDIS</Link></Navbar.Brand>
        </Container>
    </Navbar>
  )
}

export default MyNavbar
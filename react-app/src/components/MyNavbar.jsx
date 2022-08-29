import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function MyNavbar() {
	return (
		<Navbar bg='dark' variant='dark'>
			<Container style={{ margin: '0' }}>
				<Navbar.Brand><Link to='/' style={{ textDecoration: 'none', color: 'rgba(255,255,255)' }}>MiCoDIS</Link></Navbar.Brand>
				<Navbar.Collapse id='basic-navbar-nav'>
					<Nav className='me-auto'>
						<Nav.Link to='/' as={Link}>Home</Nav.Link>
						<Nav.Link to='/correlations' as={Link}>Correlations</Nav.Link>
						<Nav.Link to='/expressions' as={Link}>Expressions</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default MyNavbar
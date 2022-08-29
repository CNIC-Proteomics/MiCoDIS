import React from 'react';
import Card from 'react-bootstrap/Card';

function FieldMode(props) {

	const modeStyle = ['bg-dark text-white', 'bg-white text-secondary'];
	const commonStyle = { width: "18rem", cursor: 'pointer', userSelect: 'none' };

	return (
		<Card
			id={props.id}
			className={props.mode === props.id ? modeStyle[0] : modeStyle[1]}
			style={commonStyle}
			onClick={props.handleClick}
		>

			<Card.Body style={{ textAlign: 'center' }}>
				{props.children}
			</Card.Body>

			<Card.Title className='text-center' style={{ fontSize: '1.5em' }}>{props.name}</Card.Title>

		</Card>
	)
}

export default FieldMode
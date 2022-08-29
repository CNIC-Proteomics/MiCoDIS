import React from 'react';
import { useLocation } from 'react-router-dom';

function Expressions() {

    const { state } = useLocation()

    return (
        <div>
            <div>Expressions</div>
            <div>Params</div>
            <div>{state ? JSON.stringify(state) : 'No state'}</div>
        </div>
    )
}

export default Expressions
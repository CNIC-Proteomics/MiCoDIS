// Import libraries
import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

// Import locals
import MyNavbar from './components/MyNavbar';
import SetParams from './pages/SetParams';
import Correlations from './pages/Correlations';

// Set constants
//const SERVER = 'http://localhost:5000/api';

const App = () => {

    return (
        <div>
            <Router>
                
                <MyNavbar/>

                <Routes>
                    <Route exact path='/' element={<SetParams/>}/>
                    <Route exact path='/correlations' element={<Correlations/>}/>
                </Routes>

            </Router>
        </div>
    )
} 

export default App;
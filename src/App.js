import React from 'react';
import SignUp from './components/general/SignUp'
import SignIn from './components/general/SignIn';
//import logo from './logo.svg';
import './App.css';
import { Route } from '@mui/icons-material';

function App() {
  return (
    <div className="App">
      <div className="App">
        <Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>
      
      </div>
      
    </div>
  );
}

export default App;

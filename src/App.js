import React from 'react';
import SignUp from './components/general/SignUp'
//import SignIn from './components/general/SignIn';
//import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App">
        {/* <Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route> */}
        <SignUp />

        {/* <SignIn /> */}
      </div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

      </header> */}
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Client from './components/Client';
import StaffGrade from './components/StaffGrade';
import Staff from "./components/Staff";
import CampaignManager from "./components/CampaignManager";
import Campaign from "./components/Campaign";
import Advert from "./components/Advert";
import HomePage from "./components/HomePage";
import RoleSelection from "./components/RoleSelection";


function App() {
    /* return (
       <div className="App">
         <header className="App-header">
           <img src={logo} className="App-logo" alt="logo" />
           <p>
             Edit <code>src/App.js</code> and save to reload.
           </p>
           <a
             className="App-link"
             href="https://reactjs.org"
             target="_blank"
             rel="noopener noreferrer"
           >
             Learn React
           </a>
         </header>
       </div>
     );
   }*/
    return (
        <Router>
            <Routes>
                {/* Başlangıç sayfası */}
                <Route path="/" element={<Navigate to="/home" />} />

                <Route
                    exact path='/' component={App}/>
                <Route
                    path="/clients/*"
                    element={<Client/>}
                />
                <Route
                    path="/home/*"
                    element={<HomePage/>}
                />
                <Route
                    path="/role/*"
                    element={<RoleSelection/>}
                />
                <Route
                    path="/staff-grades/*"
                    element={<StaffGrade/>}
                />
                <Route
                    path="/staff/*"
                    element={<Staff/>}
                />
                <Route
                    path="/campaign-managers/*"
                    element={<CampaignManager/>}
                />
                <Route
                    path="/campaigns/*"
                    element={<Campaign/>}
                />
                <Route
                    path="/adverts/*"
                    element={<Advert/>}
                />

            </Routes>

        </Router>
    )
}
export default App;

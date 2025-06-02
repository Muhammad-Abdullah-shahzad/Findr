import React from 'react';
import {  Routes, Route , useLocation} from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import LostItemReport from './components/lostItemReport.jsx';
import LostItemList from './components/LostItemList.jsx';
import ReportFoundItem from './components/FoundItem.jsx';
import FoundItemList from './components/FoundItemList.jsx';
import UserDashboard from './components/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import ItemsMenuComponent from './components/getStartedOptions.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
function App() {
  
const location = useLocation()
  return (
    <>
     {/* {location.pathname==='/'?null:<Navbar/>} */}
   
          
      <Routes >

        <Route path='/adminDashboard' element={<AdminDashboard/>}/>
        <Route path='/getStartedOptions' element={<ItemsMenuComponent/>}/>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lostItemReportPage" element={<LostItemReport />} />
        <Route path="/lostItemsList" element={<LostItemList />} />
        <Route path="/FoundItemList" element={<FoundItemList />} />
        <Route path="/foundItemReportPage" element={<ReportFoundItem />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
      </Routes>
    
    </>
  );
}

export default App;

import './App.css';
import About from './Components/ABOUT/About';
import Contact from './Components/CONTACT/Contact';
import Home from './Components/HOME/Home';
import Footer from './Components/footer'
import Navbar from './Components/navbar'
import Ecombuild from './Components/SERVICES/ecombuild';
import Customize from './Components/SERVICES/customize';

import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom'

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route exact path="/" element={<Home/>}/> 
        <Route exact path="/About" element={<About/>}/>
        <Route exact path="/Services" element={<Ecombuild />}/>
        <Route path="/customize/:projectId" element={<Customize />} />
        <Route exact path="/Contact" element={<Contact/>}/>
        <Route exact path="/Customize" element={<Customize/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
    </div>
  );
}

export default App;



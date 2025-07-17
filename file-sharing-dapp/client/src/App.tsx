import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3Provider } from './context/Web3Context';
import BaseLandingPage from './components/BaseLandingPage';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';
import Projects from './components/Projects';
import ContactUs from './components/ContactUs';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Web3Provider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<BaseLandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </Router>
      </Web3Provider>
    </ChakraProvider>
  );
};

 export default App;
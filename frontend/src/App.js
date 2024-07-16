import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/page/Header';
import SearchBox from './component/page/SearchBox';
import Summoners from './component/page/Summoners';

export default function App() {
  return (
    <Router>
      
      <Header />

      <Routes>
        <Route path="/" element={<SearchBox />} />
        <Route path="/:prefix/:suffix" element={<Summoners />} />
      </Routes>
    </Router>
  );
}
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from "./components/SearchPage";
import ProjectPage from "./components/ProjectPage";
import { useState } from 'react';

const App = () => {
  const [ location, setLocation ] = useState("/search");

  const handleRedirection = (path: string) => {
    setLocation(path);
  };

  return (
    <BrowserRouter>
      <Routes location={location}>
        <Route path="/search" element={<SearchPage onRedirect={handleRedirection} />} />
        <Route path="/project/:id" element={<ProjectPage onRedirect={handleRedirection} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

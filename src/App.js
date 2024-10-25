import React, { useState } from 'react';
import ExcelParser from './components/ExcelParser';
import ThreeJSGraph from './components/ThreeJSGraph';




const App = () => {
  const [data, setData] = useState([]);

  const handleFileData = (parsedData) => {
    setData(parsedData);
  };

  return (
    <div>
      <ExcelParser onDataParsed={handleFileData} />
      <ThreeJSGraph data={data} />
    </div>
  );
};

export default App;

import React from 'react';
import * as XLSX from 'xlsx';
import './ExcelParser.css';

const ExcelParser = ({ onDataParsed }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const parsedData = jsonData.map(row => ({
        startNode: parseFloat(row['Start Node']),
        endNode: parseFloat(row['End Node']),
      }));
      onDataParsed(parsedData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className='heading-1'>
    <div className="parser-container  ">
      <h1 className="parser-heading heading ">3D Graph Visualization</h1>
      <label htmlFor="file-upload" className="upload-button">
        Choose File
      </label>
      <input
        type="file"
        id="file-upload"
        accept=".xlsx"
        onChange={handleFileUpload}
      />
    </div>
    </div>
  );
};

export default ExcelParser;

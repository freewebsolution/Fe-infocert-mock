import React from 'react';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';

const App = () => {
  return (
    <div className="app">
      <div className="d-flex justify-content-between">
        {/* UploadForm e DocumentList affiancati */}
        <div className="w-50 p-3">
          <UploadForm />
        </div>
        <div className="w-50 p-3">
          <DocumentList />
        </div>
      </div>
    </div>
  );
};

export default App;

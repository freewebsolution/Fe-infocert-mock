import React, { useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';

const DocumentList = () => {
  const [externalReferenceId, setExternalReferenceId] = useState('7');  // ID predefinito
  const [size, setSize] = useState('25');  // Numero di risultati predefiniti
  const [jobListFilter, setJobListFilter] = useState('ALL');  // Filtro predefinito
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funzione per recuperare i documenti
  const handleFetchDocuments = async () => {
    setLoading(true);
    setError(null);
    setDocuments([]);

    const url = `http://192.168.1.43:8000/api/v1/ingestions/?externalReferenceId=${externalReferenceId}&size=${size}&jobListFilter=${jobListFilter}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Errore nel recupero dei documenti.');
      }

      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="p-4 bg-light rounded shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="text-center text-primary mb-4">Visualizza Documenti</h2>

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Form>
          <Form.Group controlId="externalReferenceId">
            <Form.Label>Inserisci External Reference ID</Form.Label>
            <Form.Control
              type="text"
              value={externalReferenceId}
              onChange={(e) => setExternalReferenceId(e.target.value)}
              placeholder="Es. 7"
            />
          </Form.Group>

          <Form.Group controlId="size">
            <Form.Label>Inserisci Size</Form.Label>
            <Form.Control
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Es. 25"
            />
          </Form.Group>

          <Form.Group controlId="jobListFilter">
            <Form.Label>Inserisci Job List Filter</Form.Label>
            <Form.Control
              type="text"
              value={jobListFilter}
              onChange={(e) => setJobListFilter(e.target.value)}
              placeholder="Es. ALL"
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleFetchDocuments}
            disabled={loading}
            className="w-100"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Visualizza Documenti'
            )}
          </Button>
        </Form>

        {documents.length > 0 && (
          <div className="mt-4">
            <h3>Documenti:</h3>
            <ul>
              {documents.map((doc, index) => (
                <li key={index}>
                  <strong>{doc.document_class_title}</strong> - {doc.company_title}
                  <br />
                  {/* Nome del documento come link */}
                  <a
                    href={`http://192.168.1.43:8000/api/v1/documents/${doc.id}/download`}
                    download
                    className="mt-2 text-primary"
                  >
                    {doc.original_filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;

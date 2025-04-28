import { useState, useRef } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [documentClass, setDocumentClass] = useState("");  // Stato per la classe del documento
  const [company, setCompany] = useState("");  // Stato per il nome dell'azienda
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    console.log('Submit chiamato'); // Verifica che la funzione venga invocata

    e.preventDefault();

    if (!file || !documentClass || !company) {
      alert('Tutti i campi devono essere completati.');
      console.log("File:", file, "DocumentClass:", documentClass, "Company:", company); // Aggiungi un log per controllare lo stato
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("document_class_title", documentClass);
    formData.append("company_title", company);
    formData.append("external_reference_id", 7);

    try {
      // Chiamata POST all'endpoint di upload
      const response = await axios.post('http://localhost:8080/api/v1/push', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message); // Mostra il messaggio di successo
    } catch (error) {
      setMessage("Errore nel caricamento del documento.");
      console.error("Errore nell'upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDocumentClass("");  // Resetta la classe del documento
    setCompany("");  // Resetta il nome dell'azienda
    setMessage("");
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center gap-4 p-6 bg-white rounded shadow-lg w-100"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="text-center text-primary mb-4">Carica Documento</h2>

        {message && (
          <div
            className={`alert ${message.includes("successo") ? "alert-success" : "alert-danger"}`}
          >
            {message}
          </div>
        )}

        <div className="mb-3 w-100">
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              console.log("File selezionato:", e.target.files[0]); // Log per vedere se il file viene settato correttamente
            }}
            className="form-control"
            ref={fileInputRef}
          />
        </div>

        {/* Select per la classe del documento */}
        <div className="mb-3 w-100">
          <select
            className="form-control"
            value={documentClass}
            onChange={(e) => setDocumentClass(e.target.value)}
            required
          >
            <option value="">Seleziona una classe documento</option>
            <option value="Fattura">Fattura</option>
            <option value="Contratto">Contratto</option>
            <option value="Report">Report</option>
            <option value="Nota">Nota</option>
            {/* Aggiungi altre opzioni qui */}
          </select>
        </div>

        {/* Select per il nome della compagnia */}
        <div className="mb-3 w-100">
          <select
            className="form-control"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          >
            <option value="">Seleziona una compagnia</option>
            <option value="Gifesolutions">Gifesolutions</option>
            <option value="Technocenter">Technocenter</option>
            {/* Aggiungi altre opzioni qui */}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100"
        >
          {loading ? "Caricamento..." : "Invia"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="btn btn-secondary w-100 mt-2"
        >
          Pulisci
        </button>
      </form>
    </div>
  );
}

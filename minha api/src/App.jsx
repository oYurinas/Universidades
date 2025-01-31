import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [country, setCountry] = useState("Brazil");
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const universitiesPerPage = 16;

  const fetchUniversities = async () => {
    if (!country.trim()) {
      alert("Digite um nome válido para o país.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`http://universities.hipolabs.com/search?country=${country}`);

      if (response.status !== 200) {
        throw new Error("Erro na resposta da API");
      }

      setUniversities(response.data);
    } catch (error) {
      console.error("Erro ao buscar universidades:", error.response || error.message);
      alert("Erro ao carregar universidades. Verifique o nome do país.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = universities.slice(indexOfFirstUniversity, indexOfLastUniversity);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="app">
      <header className="search-bar">
        <h1>Encontre Sua Universidade</h1>
        <p>Pesquise universidades ao redor do mundo e tome uma decisão informada sobre seu futuro acadêmico.</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Digite o nome do país (ex: Brazil)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <button onClick={fetchUniversities}>Buscar</button>
        </div>
      </header>

      {loading && <p>Carregando...</p>}

      {!loading && universities.length > 0 && (
        <div className="results">
          <h2>Resultados ({universities.length}):</h2>
          <div className="card-container">
            {currentUniversities.map((university, index) => (
              <div className="card" key={index}>
                <h3>{university.name}</h3>
                {university.web_pages?.[0] ? (
                  <a href={university.web_pages[0]} target="_blank" rel="noopener noreferrer">
                    {university.web_pages[0]}
                  </a>
                ) : (
                  <p>Sem site disponível</p>
                )}
              </div>
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: Math.ceil(universities.length / universitiesPerPage) }, (_, index) => (
              <button key={index + 1} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

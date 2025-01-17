import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [country, setCountry] = useState('Brazil');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [universitiesPerPage] = useState(16); // 16 universidades por página (4 por linha e 4 linhas)

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://universities.hipolabs.com/search?country=${country}`);
      setUniversities(response.data);
    } catch (error) {
      console.error('Erro ao buscar universidades:', error);
      alert('Não foi possível carregar as informações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular a página atual
  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = universities.slice(indexOfFirstUniversity, indexOfLastUniversity);

  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="app">
      <header className="search-bar">
        <h1>Encontre Sua Universidade</h1>
        <p>Pesquise universidades ao redor do mundo para tomar uma decisão informada sobre seu futuro acadêmico.</p>
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
                <a
                  href={`http://${university.domains[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // Evitar redirecionamento padrão
                    window.open(`http://${university.domains[0]}`, '_blank');
                    e.preventDefault();
                  }}
                >
                  {university.domains[0]}
                </a>
              </div>
            ))}
          </div>

          {/* Paginação */}
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

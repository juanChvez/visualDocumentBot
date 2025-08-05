import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    fetch('http://localhost:5000/ping')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage('Error al conectar con backend' + JSON.stringify(err)));
  }, []);

  return (
    <div>
      <h1>Respuesta del backend:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;

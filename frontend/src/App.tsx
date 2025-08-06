import { useEffect, useState } from 'react';
import { VITE_API_BASE } from '@src/config/env';

function App() {
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    fetch(`${VITE_API_BASE}/ping`)
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

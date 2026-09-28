import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const EventosContexto = createContext(null);

export function EventosProvedor({ children }) {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch('https://api.campus.iftm.edu.br/eventos')
      .then((r) => r.json())
      .then((dados) => { setEventos(dados); setCarregando(false); })
      .catch((e) => setErro(e.message));
  }, []);

  const value = useMemo(
    () => ({ eventos, carregando, erro }),
    [eventos, carregando, erro]
  );
  return (
    <EventosContexto.Provider value={value}>{children}</EventosContexto.Provider>
  );
}

export function useEventos() {
  const ctx = useContext(EventosContexto);
  if (!ctx) throw new Error('useEventos deve ser usado dentro de EventosProvedor');
  return ctx;
}
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { eventosReducer, estadoInicial } from '../reducers/eventosReducer';

const EventosContexto = createContext(null);

export function EventosProvedor({ children }) {
  const [estado, dispatch] = useReducer(eventosReducer, estadoInicial);

  useEffect(() => {
    dispatch({ type: 'CARREGANDO' });
    fetch('https://api.campus.iftm.edu.br/eventos')
      .then((r) => r.json())
      .then((dados) => dispatch({ type: 'SUCESSO', eventos: dados }))      
      .catch((e) => {
         if (e.name === 'AbortError') return;
         dispatch({ type: 'FALHA', erro: e.message });
  }) ;

   return () => controlador.abort();
}, []);

  const value = useMemo(() => estado, [estado]);

  return (
    <EventosContexto.Provider value={value}>
      {children}
    </EventosContexto.Provider>
  );
}

export function useEventos() {
  const ctx = useContext(EventosContexto);
  if (!ctx) throw new Error('useEventos deve ser usado dentro de EventosProvedor');
  return ctx;
}
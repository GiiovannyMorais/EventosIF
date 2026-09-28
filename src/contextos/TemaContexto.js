import { createContext, useContext, useMemo, useState } from 'react';

const TemaContexto = createContext(null);

export function TemaProvedor({ children }) {
  const [temaEscuro, setTemaEscuro] = useState(false);

  const value = useMemo(
    () => ({ temaEscuro, setTemaEscuro }),
    [temaEscuro]
  );

  return (
    <TemaContexto.Provider value={value}>
      {children}
    </TemaContexto.Provider>
  );
}

export function useTema() {
  const ctx = useContext(TemaContexto);
  if (!ctx) throw new Error('useTema deve ser usado dentro de TemaProvedor');
  return ctx;
}
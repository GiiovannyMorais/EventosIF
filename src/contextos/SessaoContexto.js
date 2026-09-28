import { createContext, useContext, useMemo, useState } from 'react';

const SessaoContexto = createContext(null);

export function SessaoProvedor({ children }) {
  const [usuario, setUsuario] = useState({ nome: 'Visitante', matricula: null });

  const value = useMemo(
    () => ({ usuario, setUsuario }),
    [usuario]
  );

  return (
    <SessaoContexto.Provider value={value}>
      {children}
    </SessaoContexto.Provider>
  );
}

export function useSessao() {
  const ctx = useContext(SessaoContexto);
  if (!ctx) throw new Error('useSessao deve ser usado dentro de SessaoProvedor');
  return ctx;
}
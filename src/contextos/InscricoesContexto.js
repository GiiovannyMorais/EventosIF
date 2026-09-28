import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const InscricoesContexto = createContext(null);

export function InscricoesProvedor({ children }) {
  const [ids, setIds] = useState([]);

  const inscrever = useCallback((id) => {
    setIds((atuais) => (atuais.includes(id) ? atuais : [...atuais, id]));
  }, []);

  const cancelar = useCallback((id) => {
    setIds((atuais) => atuais.filter((i) => i !== id));
  }, []);

  const value = useMemo(
    () => ({ ids, inscrever, cancelar }),
    [ids, inscrever, cancelar]
  );

  return (
    <InscricoesContexto.Provider value={value}>
      {children}
    </InscricoesContexto.Provider>
  );
}

export function useInscricoes() {
  const ctx = useContext(InscricoesContexto);
  if (!ctx) throw new Error('useInscricoes deve ser usado dentro de InscricoesProvedor');
  return ctx;
}
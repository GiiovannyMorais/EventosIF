export const estadoInicial = { status: 'carregando', eventos: [], erro: null };

export function eventosReducer(estado, acao) {
  switch (acao.type) {
    case 'CARREGANDO':
      return { ...estado, status: 'carregando', erro: null };
    case 'SUCESSO':
      return { status: 'sucesso', eventos: acao.eventos, erro: null };
    case 'FALHA':
      return { status: 'falha', eventos: [], erro: acao.erro };
    default:
      return estado;
  }
}
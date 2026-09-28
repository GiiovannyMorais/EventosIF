import { useState, useContext } from 'react';
import {
  View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet,
} from 'react-native';
import { AppContexto } from '../contextos/AppContexto';
import { useEventos } from '../contextos/EventosContexto';
import { useInscricoes } from '../contextos/InscricoesContexto';
import CartaoEvento from '../componentes/CartaoEvento';

export default function TelaEventos({ navigation }) {
  const { temaEscuro } = useContext(AppContexto);
  const { status, eventos, erro } = useEventos();
  const { ids, inscrever } = useInscricoes();

  const [enviado, setEnviado] = useState(false);
  const [busca, setBusca] = useState('');
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState(null);

  const eventosFiltrados = eventos.filter((ev) =>
    ev.titulo.toLowerCase().includes(busca.toLowerCase())
  );
  const totalInscricoes = ids.length;
  const eventoSelecionado = eventos.find((ev) => ev.id === eventoSelecionadoId);

  function aoInscrever(evento) {
    inscrever(evento.id);
    setEventoSelecionadoId(evento.id);
    setEnviado(true);
  }

  console.log('[render] TelaEventos');

  return (
    <View style={[styles.container,
      { backgroundColor: temaEscuro ? '#121212' : '#FFFFFF' }]}>
      <Text style={styles.contador}>Inscrições: {totalInscricoes}</Text>
      <TextInput
        style={styles.campo}
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar evento"
      />
      {status === 'carregando' && <ActivityIndicator size="large" />}
      {status === 'falha' && <Text style={styles.erro}>Falha: {erro}</Text>}
      {enviado && eventoSelecionado && (
        <Text style={styles.aviso}>
          Inscrição confirmada em {eventoSelecionado.titulo}
        </Text>
      )}
      <FlatList
        data={eventosFiltrados}
        keyExtractor={(itemLista) => String(itemLista.id)}
        renderItem={({ item }) => (
          <CartaoEvento
            evento={item}
            aoInscrever={() => aoInscrever(item)}
            aoAbrir={() =>
              navigation.navigate('Detalhe', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  contador: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  campo: { borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8,
           padding: 10, marginBottom: 12 },
  erro: { color: '#B00020', marginBottom: 8 },
  aviso: { color: '#2E7D32', marginBottom: 8 },
});
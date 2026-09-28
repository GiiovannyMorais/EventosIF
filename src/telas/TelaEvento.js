import { useState, useContext } from 'react';
import {
  View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet,
} from 'react-native';
import { AppContexto } from '../contextos/AppContexto';
import { useEventos } from '../contextos/EventosContexto';
import CartaoEvento from '../componentes/CartaoEvento';

export default function TelaEventos({ navigation }) {
  const { temaEscuro } = useContext(AppContexto);
  const { eventos, carregando, erro } = useEventos();

  const [enviado, setEnviado] = useState(false);
  const [busca, setBusca] = useState('');
  const [inscricoes, setInscricoes] = useState([]);
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState(null);

  const eventosFiltrados = eventos.filter((ev) =>
    ev.titulo.toLowerCase().includes(busca.toLowerCase())
  );
  const totalInscricoes = inscricoes.length;
  const eventoSelecionado = eventos.find((ev) => ev.id === eventoSelecionadoId);

  function inscrever(evento) {
    setInscricoes((atuais) => [...atuais, evento]);
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
      {carregando && <ActivityIndicator size="large" />}
      {erro && <Text style={styles.erro}>Falha: {erro}</Text>}
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
            aoInscrever={() => inscrever(item)}
            aoAbrir={() =>
              navigation.navigate('Detalhe', { id: item.id })}
          />
        )}
      />
    </View>
  );
}
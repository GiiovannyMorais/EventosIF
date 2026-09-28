import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useInscricoes } from '../contextos/InscricoesContexto';
import { useEventos } from '../contextos/EventosContexto';

export default function TelaMinhasInscricoes() {
  const { ids, cancelar } = useInscricoes();
  const { eventos } = useEventos();
  const inscritos = eventos.filter((ev) => ids.includes(ev.id));

  console.log('[render] TelaMinhasInscricoes');

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Minhas inscrições ({inscritos.length})
      </Text>
      <FlatList
        data={inscritos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <Text>{item.titulo}</Text>
            <Button title="Cancelar"
              onPress={() => cancelar(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  linha: { flexDirection: 'row', alignItems: 'center',
           justifyContent: 'space-between', paddingVertical: 8 },
});
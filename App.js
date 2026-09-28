import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TemaProvedor } from './src/contextos/TemaContexto';
import { SessaoProvedor } from './src/contextos/SessaoContexto';
import { EventosProvedor } from './src/contextos/EventosContexto';
import { InscricoesProvedor } from './src/contextos/InscricoesContexto';
import TelaEventos from './src/telas/TelaEventos';
import TelaDetalheEvento from './src/telas/TelaDetalheEvento';
import TelaMinhasInscricoes from './src/telas/TelaMinhasInscricoes';

const Abas = createBottomTabNavigator();

export default function App() {
  return (
    <TemaProvedor>
      <SessaoProvedor>
        <EventosProvedor>
          <InscricoesProvedor>
            <NavigationContainer>
              <Abas.Navigator>
                <Abas.Screen name="Eventos" component={TelaEventos} />
                <Abas.Screen name="Detalhe" component={TelaDetalheEvento} />
                <Abas.Screen name="Inscricoes" component={TelaMinhasInscricoes} />
              </Abas.Navigator>
            </NavigationContainer>
          </InscricoesProvedor>
        </EventosProvedor>
      </SessaoProvedor>
    </TemaProvedor>
  );
}
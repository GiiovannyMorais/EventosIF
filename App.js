  import { NavigationContainer } from '@react-navigation/native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { AppProvedor } from './src/contextos/AppContexto';
  import { EventosProvedor } from './src/contextos/EventosContexto';
  import TelaEventos from './src/telas/TelaEventos';
  import TelaDetalheEvento from './src/telas/TelaDetalheEvento';
  import TelaMinhasInscricoes from './src/telas/TelaMinhasInscricoes';
   
  const Abas = createBottomTabNavigator();
   
  export default function App() {
    return (
      <AppProvedor>
        <NavigationContainer>
          <Abas.Navigator>
            <Abas.Screen name="Eventos" component={TelaEventos} />
            <Abas.Screen name="Detalhe" component={TelaDetalheEvento} />
            <Abas.Screen name="Inscricoes" component={TelaMinhasInscricoes} />
          </Abas.Navigator>
        </NavigationContainer>
      </AppProvedor>
    );
  }

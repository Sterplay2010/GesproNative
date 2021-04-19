import React from 'react';
import {Text, Icon, Button, Content, Container} from 'native-base';
import {
  Modal,
  Portal,
  Provider,
  ProgressBar,
  Colors,
  Surface,
  DataTable,
} from 'react-native-paper';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchAdvances = () => {
  const [porcentaje, setPorcentaje] = React.useState(0);
  const [idProyecto, setIdProyecto] = React.useState(0);
  const [resultado, setResultado] = React.useState([]);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setPorcentaje(0);
    setIdProyecto(0);
    setVisible(false);
  };
  const consultarAvances = async () => {
    const tk = await AsyncStorage.getItem('token');
    await API.get('proyecto/consultarTodos', {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setResultado(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function consultarPorcentajes() {
    const tk = await AsyncStorage.getItem('token');
    await API.get(`avance/buscarProyecto/${idProyecto}`, {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        if (response.data) {
          let porcentajes = response.data.reduce(
            (acum, item) => acum + item.deliverableAssigment.percent,
            0,
          );
          console.log(porcentajes);
          setPorcentaje(porcentajes);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const containerStyle = {
    backgroundColor: 'white',
    marginRight: 50,
    marginLeft: 50,
    padding: 20,
  };

  React.useEffect(() => {
    consultarPorcentajes();
  }, [idProyecto]);

  React.useEffect(() => {
    consultarAvances();
  }, [resultado]);

  return (
    <Provider>
      <Container>
        <Content padder>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}>
              <Text note>Porcentaje total del proyecto: {porcentaje}%</Text>
              <ProgressBar progress={porcentaje / 100} color={Colors.red500} />
            </Modal>
          </Portal>
          <Text style={{alignSelf: 'center', marginBottom: 10, marginTop: 10}}>
            CONSULTAR AVANCES
          </Text>
          <Surface
            style={{
              elevation: 4,
              width: 300,
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Proyecto</DataTable.Title>
                <DataTable.Title>Porcentajes</DataTable.Title>
              </DataTable.Header>
              {resultado.map((proyecto, i) => {
                return (
                  <DataTable.Row key={i} style={{marginTop: 5}}>
                    <DataTable.Cell style={{marginBottom: 5}}>
                      {proyecto.name}
                    </DataTable.Cell>
                    <DataTable.Cell style={{marginBottom: 10, marginTop: 10}}>
                      <Button
                        rounded
                        style={{backgroundColor: '#A93226'}}
                        onPress={() => {
                          setIdProyecto(proyecto.id);
                          showModal();
                        }}>
                        <Icon
                          name="eye"
                          type="MaterialCommunityIcons"
                          style={{fontSize: 20}}
                        />
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </DataTable>
          </Surface>
        </Content>
      </Container>
    </Provider>
  );
};

export default SearchAdvances;

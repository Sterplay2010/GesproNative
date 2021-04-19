import React from 'react';
import {View} from 'react-native';
import {Text, Icon, Button, Content, Container, Grid, Row} from 'native-base';
import {Modal, Portal, Provider, Surface, DataTable} from 'react-native-paper';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchDocs = () => {
  const [proyectos, setProyectos] = React.useState([]);
  const [entregables, setEntregables] = React.useState([]);
  const [fase, setFase] = React.useState([]);
  const [idTipo, setIdTipo] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setIdTipo(0);
    setEntregables([]);
    setVisible(false);
  };

  const consultarProyectos = async () => {
    const tk = await AsyncStorage.getItem('token');
    await API.get('proyecto/consultarTodos', {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setProyectos(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const consultarTipoProyecto = async () => {
    const tk = await AsyncStorage.getItem('token');
    await API.get(`faseTipo/tipoProyecto/${idTipo}`, {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setFase(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const asignarEntregable = async (idFase, tk) => {
    await API.get(`asignarEntregable/faseProyecto/${idFase}`, {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setEntregables((arrayAnterior) => [...arrayAnterior, response.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const obtenerEntregables = async () => {
    const tk = await AsyncStorage.getItem('token');
    fase.map((fase, i) => {
      API.get(`asignarEntregable/faseProyecto/${fase.id}`, {
        headers: {Authorization: `Bearer ${tk}`},
      })
        .then((response) => {
          response.data.map((data) => {
            setEntregables((arrayAnterior) => [
              ...arrayAnterior,
              data.deliverable.name,
            ]);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  React.useEffect(() => {
    obtenerEntregables();
  }, [fase]);

  React.useEffect(() => {
    consultarTipoProyecto();
  }, [idTipo]);

  React.useEffect(() => {
    consultarProyectos();
  }, []);

  const containerStyle = {
    backgroundColor: 'white',
    marginRight: 50,
    marginLeft: 50,
    padding: 20,
  };

  return (
    <Provider>
      <Container>
        <Content padder>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Icon
                  name="documents-outline"
                  type="Ionicons"
                  style={{fontSize: 30}}
                />
                <Text style={{marginLeft: 10, alignSelf: 'flex-end'}}>
                  ENTREGABLES
                </Text>
              </View>
              {entregables.map((obj, i) => {
                return <Text key={i}>- {obj}</Text>;
              })}
            </Modal>
          </Portal>
          <Text style={{alignSelf: 'center', marginBottom: 10, marginTop: 10}}>
            CONSULTAR ENTREGABLES
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
                <DataTable.Title>Entregables</DataTable.Title>
              </DataTable.Header>
              {proyectos.map((proyecto, i) => {
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
                          setIdTipo(proyecto.type.id);
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

export default SearchDocs;
//return <Text key={i}>- {obj.deliverable.name}</Text>;

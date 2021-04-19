import React from 'react';
import {Modal, Portal, Provider, ProgressBar, Colors} from 'react-native-paper';
import {Text, Icon, Button, Content, Container} from 'native-base';
import {DataTable} from 'react-native-paper';
import {Surface} from 'react-native-paper';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Advances = () => {
  const [resultado, setResultado] = React.useState([]);
  const [idEmp, setIdEmp] = React.useState(0);
  const [porcentaje, setPorcentaje] = React.useState();
  const [idProyecto, setIdProyecto] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setIdProyecto(0);
  };
  const containerStyle = {
    backgroundColor: 'white',
    marginRight: 50,
    marginLeft: 50,
    padding: 20,
  };

  async function consultarProyectos() {
    const tk = await AsyncStorage.getItem('token');
    await API.get(`adscrito/consultaIdEmpleado/${idEmp}`, {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setResultado(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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

  async function obtenerSesion() {
    try {
      const session = await AsyncStorage.getItem('sesionUsuario');
      if (session !== null) {
        var persona = JSON.parse(session);
        setIdEmp(persona.id);
        console.log('Id empleado: ' + idEmp);
        consultarProyectos();
        consultarPorcentajes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    obtenerSesion();
  }, [idEmp, idProyecto]);

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
          <Text style={{alignSelf: 'center', marginBottom: 10}}>
            AVANCES DE PROYECTOS
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
              {resultado.map((proyecto) => {
                return (
                  <DataTable.Row
                    key={proyecto.project.id}
                    style={{marginTop: 5}}>
                    <DataTable.Cell style={{marginBottom: 5}}>
                      {proyecto.project.name}
                    </DataTable.Cell>
                    <DataTable.Cell style={{marginBottom: 10, marginTop: 10}}>
                      <Button
                        rounded
                        style={{backgroundColor: '#A93226'}}
                        onPress={() => {
                          setIdProyecto(proyecto.project.id);
                          consultarPorcentajes(proyecto.project.id);
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

export default Advances;

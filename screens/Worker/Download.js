import React from 'react';
import {Text, Icon, Button, Content, Container} from 'native-base';
import {Modal, Portal, Provider, Surface, DataTable} from 'react-native-paper';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const Download = () => {
  const [idEmp, setIdEmp] = React.useState(0);
  const [idTipo, setIdTipo] = React.useState(0);
  const [proyectos, setProyectos] = React.useState([]);
  const [fase, setFase] = React.useState([]);
  const [entregables, setEntregables] = React.useState([]);

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setIdTipo(0);
    setEntregables([]);
    setVisible(false);
  };

  const containerStyle = {
    backgroundColor: 'white',
    marginRight: 50,
    marginLeft: 50,
    padding: 20,
  };

  const descargarEntregable = async (
    idEntregable,
    mimeEntregable,
    original,
    nombre,
  ) => {
    const tk = await AsyncStorage.getItem('token');
    const url = `http://35.172.158.0:2000/entregable/descargar/${idEntregable}`;
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mime: mimeEntregable,
        path: dirs.DownloadDir + `/${original}`,
        title: `${original}`,
        description: 'Descargando archivo...',
      },
    })
      .fetch('GET', url, {
        Authorization: `Bearer ${tk}`,
      })
      .then((resp) => {
        console.log('Listo, si se bajo en ' + resp.path());
      }).catch((err)=>{
        console.log(err);
      });;
  };

  const consultarProyectos = async () => {
    const tk = await AsyncStorage.getItem('token');
    //const url = `http://192.168.0.9:8080/adscrito/consultaIdEmpleado/${idEmp}`;
    await API.get(`adscrito/consultaIdEmpleado/${idEmp}`, {
      headers: {Authorization: `Bearer ${tk}`},
    }).then((response) => {
      setProyectos(response.data);
    }).catch((err)=>{
      console.log(err);
    });;
  };

  const consultarTipoProyecto = async () => {
    const tk = await AsyncStorage.getItem('token');
    //const url = `http://192.168.0.9:8080/faseTipo/tipoProyecto/${idTipo}`;
    await API.get(`faseTipo/tipoProyecto/${idTipo}`, {
      headers: {Authorization: `Bearer ${tk}`},
    }).then((response) => {
      setFase(response.data);
    }).catch((err)=>{
      console.log(err);
    });;
  };

  const sesion = async () => {
    try {
      const session = await AsyncStorage.getItem('sesionUsuario');
      if (session !== null) {
        var persona = JSON.parse(session);
        setIdEmp(persona.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerEntregables = async () => {
    const tk = await AsyncStorage.getItem('token');
    fase.map((fase, i) => {
      //const url = `http://192.168.0.9:8080/asignarEntregable/faseProyecto/${fase.id}`;
      API.get(`asignarEntregable/faseProyecto/${fase.id}`, {
        headers: {Authorization: `Bearer ${tk}`},
      })
        .then((response) => {
          response.data.map((data)=>{
            setEntregables((arrayAnterior) => [...arrayAnterior,data]);
          })
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
  }, [idEmp]);

  React.useEffect(() => {
    sesion();
  }, []);

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
                return (
                  <View
                    style={{flexDirection: 'row', marginBottom: 10}}
                    key={i}>
                    <Text style={{alignSelf: 'flex-start', marginTop: 12}}>
                      - {obj.deliverable.name}
                    </Text>
                    <Button
                      rounded
                      style={{backgroundColor: '#A93226', marginLeft: 30}}
                      onPress={() => {
                        descargarEntregable(
                          obj.deliverable.id,
                          obj.deliverable.mime,
                          obj.deliverable.originalName,
                          obj.deliverable.name,
                        );
                      }}>
                      <Icon
                        name="cloud-download"
                        type="MaterialIcons"
                        style={{fontSize: 20}}
                      />
                    </Button>
                  </View>
                );
              })}
            </Modal>
          </Portal>
          <Text style={{alignSelf: 'center', marginTop: 10, marginBottom: 10}}>
            DESCARGAR ENTREGABLES
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
              {proyectos.map((proyecto) => {
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
                          setIdTipo(proyecto.project.type.id);
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

export default Download;

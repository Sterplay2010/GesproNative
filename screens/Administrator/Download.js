import React from 'react';
import {Text, Icon, Button, Content, Container} from 'native-base';
import {Modal, Portal, Provider, Surface, DataTable} from 'react-native-paper';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {View} from 'react-native';
const Download = () => {
  const [avances, setAvances] = React.useState([]);
  const [comentario, setComentario] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => {
    setComentario('');
    setVisible(false);
  };

  const consultarAvances = async () => {
    const tk = await AsyncStorage.getItem('token');
    await API.get('avance/consultarTerminados', {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setAvances(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const descargarEntregable = async (
    idEntregable,
    mimeEntregable,
    original,
  ) => {
    console.log(idEntregable);
    const tk = await AsyncStorage.getItem('token');
    const url = `http://35.172.158.0:2000/avance/descargar/${idEntregable}`;
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    consultarAvances();
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
              <View>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginBottom: 10,
                    marginTop: 10,
                  }}>
                  COMENTARIO
                </Text>
                <Text note>{comentario}</Text>
              </View>
            </Modal>
          </Portal>
          <Text
            style={{alignSelf: 'center', marginBottom: 10, marginTop: 10}}>
            DESCARGAR AVANCES
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
                <DataTable.Title>Entregable</DataTable.Title>
                <DataTable.Title>Descargar</DataTable.Title>
                <DataTable.Title>Ver</DataTable.Title>
              </DataTable.Header>
              {avances.map((a, i) => {
                return (
                  <DataTable.Row key={i}>
                    <DataTable.Cell>{a.project.name}</DataTable.Cell>
                    <DataTable.Cell>
                      {a.deliverableAssigment.deliverable.name}
                    </DataTable.Cell>
                    <DataTable.Cell style={{marginBottom: 10, marginTop: 10}}>
                      <Button
                        rounded
                        onPress={() =>
                          descargarEntregable(a.id, a.mime, a.originalName)
                        }
                        style={{backgroundColor: '#A93226'}}>
                        <Icon
                          name="cloud-download"
                          type="MaterialCommunityIcons"
                          style={{fontSize: 20}}
                        />
                      </Button>
                    </DataTable.Cell>
                    <DataTable.Cell style={{marginBottom: 10, marginTop: 10}}>
                      <Button
                        rounded
                        onPress={() => {
                          showModal();
                          setComentario(a.description);
                        }}
                        style={{backgroundColor: '#A93226'}}>
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

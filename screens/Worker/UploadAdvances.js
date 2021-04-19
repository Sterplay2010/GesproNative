import React from 'react';
import {
  Icon,
  Container,
  Content,
  Text,
  Form,
  Item,
  Picker,
  Button,
  Textarea,
  CheckBox,
  ListItem,
  Toast,
} from 'native-base';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';

const UploadAdvances = () => {
  const [seleccion, setSeleccion] = React.useState('');
  const [seleccionEntregable, setSeleccionEntregable] = React.useState('');
  const [idEmp, setIdEmp] = React.useState(0);
  const [proyectos, setProyectos] = React.useState([]);
  const [tipoProyectos, setTipoProyectos] = React.useState([]);
  const [fase, setFase] = React.useState([]);
  const [entregables, setEntregables] = React.useState([]);
  const [comentario, setComentario] = React.useState('');
  const [flag, setFlag] = React.useState(false);
  const [avances, setAvances] = React.useState([]);
  //const [flag, setFlag] = React.useState(false);
  const [finales, setFinales] = React.useState([]);

  async function consultarProyectos() {
    const tk = await AsyncStorage.getItem('token');
    //const url = `http://192.168.0.9:8080/adscrito/consultaIdEmpleado/${idEmp}`;
    await API.get(`adscrito/consultaIdEmpleado/${idEmp}`, {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setProyectos(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const eliminarRepetidos = () => {
    const nuevo = [];
    entregables.map((e) => {
      nuevo.push(e.deliverable.name);
    });
    const unicos = Array.from(new Set(nuevo));
    setFinales(unicos);
  };

  async function obtenerSesion() {
    try {
      const session = await AsyncStorage.getItem('sesionUsuario');
      if (session !== null) {
        var persona = JSON.parse(session);
        setIdEmp(persona.id);
        console.log('Id empleado: ' + idEmp);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const guardarTipoProyectos = () => {
    proyectos.map((p, i) => {
      setTipoProyectos((arrayAnterior) => [...arrayAnterior, p.project.type]);
    });
  };

  const obtenerTipoProyecto = async () => {
    const tk = await AsyncStorage.getItem('token');
    tipoProyectos.map((t, i) => {
      //const url = `http://192.168.42.76:8080/faseTipo/tipoProyecto/${t.id}`;
      API.get(`faseTipo/tipoProyecto/${t.id}`, {
        headers: {Authorization: `Bearer ${tk}`},
      })
        .then((response) => {
          setFase((arrayAnterior) => [...arrayAnterior, response.data]);
        })
        .catch((err) => {
          console.log(err);
        });
    });
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

  const obtenerEntregables = async () => {
    const tk = await AsyncStorage.getItem('token');
    fase.map((fase) => {
      fase.map((f2) => {
        //const url = `http://192.168.0.9:8080/asignarEntregable/faseProyecto/${f2.id}`;
        API.get(`asignarEntregable/faseProyecto/${f2.id}`, {
          headers: {Authorization: `Bearer ${tk}`},
        })
          .then((response) => {
            response.data.map((data) => {
              setEntregables((arrayAnterior) => [...arrayAnterior, data]);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  };

  const subirArchivo = async (idProyecto, idFaseEntregable) => {
    const tk = await AsyncStorage.getItem('token');
    //const url = 'http://192.168.0.9:8080/avance/guardar';
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res.uri);
      const data = new FormData();
      data.append(
        'json',
        `{"description":"${comentario}","finish":${flag},"project":{"id":${idProyecto}},"deliverableAssigment":{"id":${idFaseEntregable}}}`,
      );
      data.append('archivo', {
        uri: res.uri,
        type: res.type,
        name: res.name,
      });

      API({
        url: 'avance/guardar',
        method: 'POST',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tk}`,
        },
      })
        .then((response) => {
          console.log('Respuesta del servidor: ' + response.data);
          consultarAvances();
          Toast.show({
            text: 'El avance se subio correctamente',
            buttonText: 'Cerrar',
            type: 'success',
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Se cancelo la subida del archivo');
        Toast.show({
          text: 'Se cancelo la subida del archivo',
          buttonText: 'Cerrar',
          type: 'warning',
        });
      } else {
        throw err;
      }
    }
  };

  const seleccionarTodo = async () => {
    let project = proyectos.find((p) => p.project.name === seleccion);
    let deliverable = entregables.find(
      (d) => d.deliverable.name === seleccionEntregable,
    );
    console.log(project.project.id);
    console.log(deliverable);
    console.log('Id del proyecto ' + project.project.id);
    console.log('Id aignacion entregable ' + deliverable.id);
    if (deliverable.typePhase.type.name === project.project.type.name) {
      let validation = avances.find(
        (a) =>
          a.deliverableAssigment.id === deliverable.id &&
          a.project.id === project.project.id &&
          a.finish === true,
      );
      if (validation) {
        Toast.show({
          text: 'El entregable ya se completo',
          buttonText: 'Cerrar',
          type: 'warning',
        });
      } else {
        subirArchivo(project.project.id, deliverable.id);
      }
    } else {
      Toast.show({
        text: 'El entregable no le pertenece a este proyecto',
        buttonText: 'Cerrar',
        type: 'warning',
      });
    }
  };

  React.useEffect(() => {
    eliminarRepetidos();
  }, [entregables]);

  React.useEffect(() => {
    obtenerEntregables();
  }, [fase]);

  React.useEffect(() => {
    obtenerTipoProyecto();
  }, [tipoProyectos]);

  React.useEffect(() => {
    guardarTipoProyectos();
  }, [proyectos]);

  React.useEffect(() => {
    consultarProyectos();
  }, [idEmp]);

  React.useEffect(() => {
    obtenerSesion();
    consultarAvances();
  }, []);

  return (
    <Container>
      <Content padder>
        <Text style={{alignSelf: 'center', marginBottom: 10}}>
          SUBIR AVANCES
        </Text>
        <Text
          note
          style={{alignSelf: 'flex-start', marginLeft: 35, marginTop: 10}}>
          Proyecto
        </Text>
        <Form style={{width: 270, alignSelf: 'center'}}>
          <Item picker>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Selecciona un proyecto"
              placeholderStyle={{color: '#bfc6ea'}}
              selectedValue={seleccion}
              onValueChange={(seleccion) => setSeleccion(seleccion)}
              placeholderIconColor="#007aff">
              {proyectos.map((p, i) => {
                return (
                  <Picker.Item
                    key={i}
                    label={p.project.name}
                    value={p.project.name}
                  />
                );
              })}
            </Picker>
          </Item>
        </Form>

        <Text
          note
          style={{alignSelf: 'flex-start', marginLeft: 35, marginTop: 10}}>
          Entregable
        </Text>
        <Form style={{width: 270, alignSelf: 'center'}}>
          <Item picker>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Selecciona un proyecto"
              placeholderStyle={{color: '#bfc6ea'}}
              selectedValue={seleccionEntregable}
              onValueChange={(seleccionEntregable) =>
                setSeleccionEntregable(seleccionEntregable)
              }
              placeholderIconColor="#007aff">
              {finales.map((obj, i) => {
                return <Picker.Item key={i} label={obj} value={obj} />;
              })}
            </Picker>
          </Item>
        </Form>

        <Form style={{marginTop: 30, alignSelf: 'center'}}>
          <Textarea
            onChangeText={(comentario) => setComentario(comentario)}
            rowSpan={5}
            style={{width: 320}}
            bordered
            placeholder="Añade un comentario"
          />
        </Form>

        <ListItem
          style={{alignSelf: 'center', marginTop: 10, marginBottom: 10}}>
          <CheckBox
            onPressOut={() => setFlag(false)}
            onPress={() => setFlag(true)}
            color="#A93226"
            style={{alignSelf: 'center'}}
            checked={flag}
          />
          <Text note style={{marginLeft: 10}}>
            Terminado
          </Text>
        </ListItem>
        <Button
          rounded
          onPress={() => seleccionarTodo()}
          style={{
            backgroundColor: '#A93226',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <Icon
            type="MaterialIcons"
            name="cloud-upload"
            style={{marginRight: -5}}
          />
          <Text>Subir</Text>
        </Button>
      </Content>
    </Container>
  );
};

export default UploadAdvances;

/*
const data = new FormData();
          data.append(
            'json',
            `{"description":"Listo we, ya sube", "finish":true, "project":{"id":${idProyecto}  }, deliverableAssigment:{"id":${idFaseEntregable} } }`,
          );
          data.append('archivo', {
            uri: res.uri,
            type: res.type,
            name: res.fileName,
          });
*/

/*const data = new FormData();
      data.append(
        'json',
        `{"description":"${comentario}","finish":${flag},"project":{"id":${idProyecto}},"deliverableAssigment":{"id":${idFaseEntregable}}}`,
      );
      data.append('archivo', {
        uri:res.uri,
        type: res.type,
        name: res.name,
      });

      axios({
        url: url,
        method: 'POST',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          console.log('Respuesta del servidor: ' + response);
          Toast.show({
            text: 'El avance se subio correctamente',
            buttonText: 'Cerrar',
          });
        })
        .catch((error) => {
          console.log(error);
        });
*/

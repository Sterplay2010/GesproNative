import React from 'react';
import {
  Container,
  Content,
  Text,
  Button,
  Icon,
  Form,
  Item,
  Picker,
  Toast,
} from 'native-base';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Add = () => {
  const [emp, setEmp] = React.useState('');
  const [pro, setPro] = React.useState('');
  const [puesto, setPuesto] = React.useState('');
  const [puestos, setPuestos] = React.useState([]);
  const [proyectos, setProyectos] = React.useState([]);
  const [empleados, setEmpleados] = React.useState([]);
  const [adscritos, setAdscritos] = React.useState([]);

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

  const consultarEmpleados = async () => {
    //const url = 'http:192.168.0.9:8080/empleado/rolEmpleado';
    const tk = await AsyncStorage.getItem('token');
    await API.get('empleado/rolEmpleado', {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const consultarPuestos = async () => {
    //const url = 'http:192.168.0.9:8080/puesto/consultarTodos';
    const tk = await AsyncStorage.getItem('token');
    await API.get('puesto/consultarTodos', {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setPuestos(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const consultarTodosAdscritos = async () => {
    const tk = await AsyncStorage.getItem('token');
    await API.get('adscrito/consultarTodos', {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setAdscritos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const guardarAdscrito = async (idEmpleado, idProyecto, idPuesto) => {
    //const urlG = 'http://192.168.0.9:8080/adscrito/guardar';
    const tk = await AsyncStorage.getItem('token');
    await API.post(
      'adscrito/guardar',
      {
        employe: {id: idEmpleado},
        project: {id: idProyecto},
        labor: {id: idPuesto},
      },
      {
        headers: {Authorization: `Bearer ${tk}`},
      },
    )
      .then(() => {
        Toast.show({
          text: 'Empleado añadido',
          buttonText: 'Cerrar',
          type: 'success',
        });
        consultarTodosAdscritos();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const seleccionarEmpleado = async () => {
    proyectos.map((p) => {
      empleados.map((e) => {
        puestos.map((pu) => {
          if (pro === p.name && emp === e.fullName && puesto === pu.name) {
            console.log('id empleado ' + e.id);
            console.log('id empleado ' + p.id);
            const validation = adscritos.find(
              (ads) => ads.employe.id === e.id && ads.project.id === p.id,
            );
            console.log(validation);
            if (validation) {
              Toast.show({
                text: 'Este empleado ya se encuentra en este proyecto',
                buttonText: 'Cerrar',
                type: 'warning',
              });
            } else {
              guardarAdscrito(e.id, p.id, pu.id);
            }
          }
        });
      });
    });
  };

  React.useEffect(() => {
    consultarProyectos();
    consultarEmpleados();
    consultarPuestos();
    consultarTodosAdscritos();
  }, []);

  return (
    <Container>
      <Content padder>
        <Text style={{alignSelf: 'center'}}>AÑADIR ADSCRITO</Text>
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
              selectedValue={pro}
              onValueChange={(pro) => setPro(pro)}
              placeholderIconColor="#007aff">
              {proyectos.map((p, i) => {
                return <Picker.Item key={i} label={p.name} value={p.name} />;
              })}
            </Picker>
          </Item>
        </Form>
        <Text
          note
          style={{alignSelf: 'flex-start', marginLeft: 35, marginTop: 10}}>
          Curp empleado
        </Text>
        <Form style={{width: 270, alignSelf: 'center', marginTop: 10}}>
          <Item picker>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Selecciona un empleado"
              placeholderStyle={{color: '#bfc6ea'}}
              selectedValue={emp}
              onValueChange={(emp) => setEmp(emp)}
              placeholderIconColor="#007aff">
              {empleados.map((e, i) => {
                return (
                  <Picker.Item key={i} label={e.fullName} value={e.fullName} />
                );
              })}
            </Picker>
          </Item>
        </Form>

        <Text
          note
          style={{alignSelf: 'flex-start', marginLeft: 35, marginTop: 10}}>
          Puesto
        </Text>
        <Form style={{width: 270, alignSelf: 'center', marginTop: 10}}>
          <Item picker>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Selecciona un empleado"
              placeholderStyle={{color: '#bfc6ea'}}
              selectedValue={puesto}
              onValueChange={(puesto) => setPuesto(puesto)}
              placeholderIconColor="#007aff">
              {puestos.map((p, i) => {
                return <Picker.Item key={i} label={p.name} value={p.name} />;
              })}
            </Picker>
          </Item>
        </Form>

        <Button
          rounded
          onPress={() => seleccionarEmpleado()}
          style={{
            backgroundColor: '#A93226',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <Icon
            type="MaterialCommunityIcons"
            name="check-bold"
            style={{marginRight: -5}}
          />
          <Text>Guardar</Text>
        </Button>
      </Content>
    </Container>
  );
};

export default Add;

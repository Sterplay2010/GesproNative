import React from 'react';
import {DataTable} from 'react-native-paper';
import {Container, Content, Text, Icon, Button, Toast} from 'native-base';
import {Surface} from 'react-native-paper';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Delete = () => {
  const [empleados, setEmpleados] = React.useState([]);

  const consultarAdscritos = async () => {
    const tk = await AsyncStorage.getItem('token');
    await API.get('adscrito/consultarTodos', {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const eliminarEmpleado = async (idAdscrito) => {
    const tk = await AsyncStorage.getItem('token');
    API.delete(`adscrito/eliminar/${idAdscrito}`, {
      headers: {Authorization: `Bearer ${tk}`},
    })
      .then(() => {
        Toast.show({
          text: 'El empleado se elimino del proyecto',
          buttonText: 'Cerrar',
          type: 'success',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    consultarAdscritos();
  }, [empleados]);

  return (
    <Container>
      <Content padder>
        <Text style={{alignSelf: 'center', marginBottom: 10, marginTop: 10}}>
          ELIMINAR ADSCRITOS
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
              <DataTable.Title>Empleado</DataTable.Title>
              <DataTable.Title>Proyecto</DataTable.Title>
              <DataTable.Title>Acciones</DataTable.Title>
            </DataTable.Header>
            {empleados.map((emp, i) => {
              return (
                <DataTable.Row key={i}>
                  <DataTable.Cell>{emp.employe.fullName}</DataTable.Cell>
                  <DataTable.Cell>{emp.project.name}</DataTable.Cell>
                  <DataTable.Cell style={{marginBottom: 10, marginTop: 10}}>
                    <Button
                      rounded
                      style={{backgroundColor: '#A93226'}}
                      onPress={() => {
                        eliminarEmpleado(emp.id);
                      }}>
                      <Icon
                        name="delete"
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
  );
};

export default Delete;

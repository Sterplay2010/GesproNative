import React from 'react';
import {DataTable} from 'react-native-paper';
import {Container, Content, Text, Icon} from 'native-base';
import {Surface} from 'react-native-paper';
import API from '../utilities/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchWorkers = () => {
  const [empleados, setEmpleados] = React.useState([]);

  const consultarAdscritos = async() => {
    const tk = await AsyncStorage.getItem('token');
    API.get(`adscrito/consultarTodos`, {
      headers: {Authorization: `Bearer ${tk}`},
    }).then((response) => {
      setEmpleados(response.data);
    }).catch((err)=>{
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
          CONSULTAR ADSCRITOS
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
              <DataTable.Title>Puesto</DataTable.Title>
            </DataTable.Header>
            {empleados.map((emp, i) => {
              return (
                <DataTable.Row key={i}>
                  <DataTable.Cell>{emp.employe.fullName}</DataTable.Cell>
                  <DataTable.Cell>{emp.project.name}</DataTable.Cell>
                  <DataTable.Cell style={{marginLeft: 5}}>
                    {emp.labor.name}
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

export default SearchWorkers;

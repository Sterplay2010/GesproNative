import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from 'react-native';
import Profile from '../Profile';
import Home from '../Home';
import Add from '../Administrator/Add';
import Delete from '../Administrator/Delete';
import SearchAdvances from '../Administrator/SearchAdvances';
import SearchDocs from '../Administrator/SearchDocs';
import SearchWorkers from '../Administrator/SearchWorkers';
import Download from '../Administrator/Download';

const Drawer = createDrawerNavigator();

const Administrator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerStyle={{
        backgroundColor: '#AE2329',
      }}
      drawerContentOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#FFFFFF',
      }}>
      {/*Pantalla de Home*/}
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Inicio',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="home"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      {/*Pantalla de agregar adscrito*/}
      <Drawer.Screen
        name="Add"
        component={Add}
        options={{
          title: 'Añadir empleado',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="add-circle"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      {/*Pantalla de buscar adscritos por proyecto*/}
      <Drawer.Screen
        name="SearchWorkers"
        component={SearchWorkers}
        options={{
          title: 'Consultar empleados',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="search"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      {/*Pantalla de eliminar adscrito*/}
      <Drawer.Screen
        name="Delete"
        component={Delete}
        options={{
          title: 'Eliminar empleado',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="remove-circle"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      {/*Pantalla de avances de proyectos*/}
      <Drawer.Screen
        name="SearchAdvances"
        component={SearchAdvances}
        options={{
          title: 'Consultar avances',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="assessment"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      {/*Pantalla de consultar entregables*/}
      <Drawer.Screen
        name="SearchDocs"
        component={SearchDocs}
        options={{
          title: 'Consultar entregales',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="work"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="DownloadAdvances"
        component={Download}
        options={{
          title: 'Descargar Avances',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="cloud-download"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      {/*Pantalla de perfil*/}
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Perfil',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="people-alt"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignSelf: 'center',
  },
});

export default Administrator;

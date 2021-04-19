import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, View, Image} from 'react-native';
import Home from '../Home';
import UploadAdvances from '../Worker/UploadAdvances';
import Advances from '../Worker/Advances';
import Profile from '../Profile';
import Download from '../Worker/Download';

const Drawer = createDrawerNavigator();

const Worker = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerStyle={{
        backgroundColor: '#AE2329'
      }}
      drawerContentOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#FFFFFF',
      }}>
      <Drawer.Screen
        name="Inicio"
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

      <Drawer.Screen
        name="Avances"
        component={Advances}
        options={{
          title: 'Consultar Avances',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="assessment"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="SubirAvances"
        component={UploadAdvances}
        options={{
          title: 'Subir Avances',
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name="cloud-upload"
              size={size}
              color={focused ? '#FFFFFF' : '#FFFFFF'}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="DescargarAvances"
        component={Download}
        options={{
          title: 'Descargar Entregables',
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

export default Worker;

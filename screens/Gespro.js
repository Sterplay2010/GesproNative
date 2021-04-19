import React from 'react';
import { Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Worker from '../screens/Worker/Worker';
import Administrator from '../screens/Administrator/Administrator';
import Recover from '../screens/RecoverPassword';
import { useState } from 'react';
import API from '../screens/utilities/api';
import { navigationRef } from '../screens/RootNavigation';
import { Toast, Container, Content, Button, Text, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();

const Login = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [contra, setContra] = useState('');
  const [token, setToken] = useState(null);
  const [objeto, setObjeto] = useState(null);

  const peticionUsuario = async () => {
    await API.get(`empleado/correo/${usuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setObjeto(response.data);
    });
  };

  async function obtenerToken() {
    await API.post('auth/authenticate', {
      username: usuario,
      password: contra,
    })
      .then((response) => {
        setToken(response.data.jwt);
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          text: 'Contraseña y/o usuario incorrectos',
          buttonText: 'Cerrar',
          type: 'warning',
        });
      });
  }

  async function guardarSesion() {
    let sesion = {
      id: objeto.id,
      fullName: objeto.fullName,
      birthDate: objeto.birthDate,
      phoneNumber: objeto.phoneNumber,
      curp: objeto.curp,
      email: objeto.email,
      adress: objeto.adress,
      degree: objeto.degree,
      password: objeto.password,
      status: objeto.status,
      role: {
        rol: objeto.role.id,
        name: objeto.role.name,
      },
    };
    try {
      const sesionValor = JSON.stringify(sesion);
      await AsyncStorage.setItem('sesionUsuario', sesionValor);
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    let flag = false;
    if (objeto !== null) {
      console.log(objeto.status);
      if (objeto.status === true) {
        if (usuario === objeto.email && contra === objeto.password) {
          guardarSesion();
          flag = true;
          console.log(objeto.fullName);
          switch (objeto.role.id) {
            case 4:
              navigation.navigate('Administrator');
              break;
            case 5:
              navigation.navigate('Worker');
              break;
            default:
              Toast.show({
                text: 'Acceso no permitido',
                buttonText: 'Cerrar',
                type: 'warning',
              });
              break;
          }
        }
        if (!flag) {
          Toast.show({
            text: 'Contraseña y/o usuario incorrectos',
            buttonText: 'Cerrar',
            type: 'warning',
          });
        }
      } else if (objeto.status === false) {
        Toast.show({
          text: 'Su cuenta se encuentra desactivada',
          buttonText: 'Cerrar',
          type: 'warning',
        });
      }
    }
  }, [objeto]);

  React.useEffect(() => {
    if (token != null) {
      peticionUsuario();
    } else {
      console.log('Hola');
    }
  }, [token]);

  return (
    <Container>
      <Content padder>
        <Content padder>
          <Text style={{ alignSelf: 'center' }}>INICIO DE SESIÓN</Text>
          <Image
            source={require('../assets/user.png')}
            style={{ height: 128, width: 128, margin: 20, alignSelf: 'center' }}
          />
        </Content>
        <TextInput
          onChangeText={(usuario) => setUsuario(usuario)}
          mode="outlined"
          label="Correo Electrónico"
          style={{ margin: 15, width: 300, alignSelf: 'center' }}
          theme={{
            colors: {
              primary: '#A93226',
              underlineColor: 'transparent',
              selectionColor: '#A93226',
            },
          }}
        />
        <TextInput
          onChangeText={(contra) => setContra(contra)}
          mode="outlined"
          label="Contraseña"
          style={{ margin: 15, width: 300, alignSelf: 'center' }}
          theme={{
            colors: {
              primary: '#A93226',
              underlineColor: 'transparent',
              selectionColor: '#A93226',
            },
          }}
          secureTextEntry
        />
        <Button
          rounded
          onPress={() => obtenerToken()}
          style={{ backgroundColor: '#A93226', alignSelf: 'center' }}>
          <Icon
            type="MaterialCommunityIcons"
            name="account-key"
            style={{ marginRight: -5 }}
          />
          <Text>Acceder</Text>
        </Button>
        <Button
          rounded
          transparent
          style={{ alignSelf: 'center', marginTop: 10 }}
          onPress={() => navigation.navigate('RecoverPassword')}>
          <Icon
            type="MaterialCommunityIcons"
            name="onepassword"
            style={{ marginRight: -5, color: 'black' }}
          />
          <Text style={{ color: 'black' }}>¿Olvidaste tu contraseña?</Text>
        </Button>
        <Content padder>
          <Text
            note
            style={{
              alignSelf: 'center',
              marginTop: 10,
            }}>
            ® GESPRO 2021
          </Text>
        </Content>
      </Content>
    </Container>
  );
};

const HomeScreen = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Worker" component={Worker} />
        <Stack.Screen name="Administrator" component={Administrator} />
        <Stack.Screen name="RecoverPassword" component={Recover} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Gespro = () => {
  return <HomeScreen />;
};

export default Gespro;

/*
<Button
          style={{margin: 15, width:120, alignSelf:'center'}}
          mode="contained"
          theme={{colors: {primary: '#A93226'}}}
          onPress={() => {
            peticionUsuario();
          }}>
          Acceder
        </Button>

        <Button
          style={{margin: 15}}
          mode="text"
          theme={{colors: {primary: '#A93226'}}}>
          ¿Olvidaste tu contraseña?
        </Button>
*/

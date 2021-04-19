import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  TextInput,
  Title,
  Button,
  ActivityIndicator,
  Colors,
  Caption,
} from 'react-native-paper';
import {useEffect} from 'react';
import {Toast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../screens/utilities/api';

const Profile = () => {
  const [fullName, setFullName] = React.useState('');
  const [id, setId] = React.useState(0);
  const [direccion, setDireccion] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [fechaNacimiento, setFechaNacimiento] = React.useState('');
  const [curp, setCurp] = React.useState('');
  const [contrasenaUsuario, setContrasenaUsuario] = React.useState('');
  const [contrasena, setContrasena] = React.useState('');
  const [confirmarContrasena, setConfirmarContrasena] = React.useState('');
  const [rol, setRol] = React.useState('');
  const [idRol, setIdRol] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [escuela, setEscuela] = React.useState('');
  const [flag, setFlag] = React.useState(false);
  const [confirmar, setConfirmar] = React.useState(false);

  async function obtenerSesion() {
    try {
      const session = await AsyncStorage.getItem('sesionUsuario');
      if (session !== null) {
        var persona = JSON.parse(session);
        setId(persona.id);
        setFullName(persona.fullName);
        setDireccion(persona.adress);
        setTelefono(persona.phoneNumber);
        setEscuela(persona.degree);
        setFechaNacimiento(persona.birthDate);
        setCurp(persona.curp);
        setEmail(persona.email);
        setContrasenaUsuario(persona.password);
        setRol(persona.role.name);
        setIdRol(persona.role.id);
        setFlag(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    obtenerSesion();
  }, []);

  async function actualizarPerfil() {
    const tk = await AsyncStorage.getItem('token');
    console.log(confirmar);
    if (confirmar === false) {
      await API.put(
        `empleado/actualizar/${id}`,
        {
          adress: direccion,
          birthDate: fechaNacimiento,
          curp: curp,
          degree: escuela,
          email: email,
          fullName: fullName,
          password: contrasenaUsuario,
          phoneNumber: telefono,
          role: {
            id: idRol,
          },
          status: true,
        },
        {
          headers: {
            Authorization: `Bearer ${tk}`,
          },
        },
      ).then((response) => {
        Toast.show({
          text: 'Reinicie para ver los cambios',
          buttonText: 'Cerrar',
        });
      });
    } else if (confirmar === true) {
      await API.put(
        `empleado/actualizar/${id}`,
        {
          adress: direccion,
          birthDate: fechaNacimiento,
          curp: curp,
          degree: escuela,
          email: email,
          fullName: fullName,
          password: contrasena,
          phoneNumber: telefono,
          role: {
            id: idRol,
          },
          status: true,
        },
        {
          headers: {
            Authorization: `Bearer ${tk}`,
          },
        },
      ).then(() => {
        Toast.show({
          text: 'Reinicie para ver los cambios',
          buttonText: 'Cerrar',
        });
      });
    }
  }

  return (
    <View>
      {flag === false ? (
        <View style={{marginTop: 250}}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={Colors.red500}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <Caption>Cargando...</Caption>
          </View>
        </View>
      ) : (
        <View>
          <ScrollView>
            <View style={{alignSelf: 'center'}}>
              <Title>PERFIL DE USUARIO</Title>
            </View>
            <View style={{margin: 30}}>
              <TextInput
                mode="outlined"
                label="Nombre Completo"
                onChangeText={(fullName) => setFullName(fullName)}
                value={fullName}
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <TextInput
                mode="outlined"
                label="Fecha De Nacimiento"
                onChangeText={(facN) => setFechaNacimiento(facN)}
                value={fechaNacimiento}
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <TextInput
                mode="outlined"
                label="Dirección"
                onChangeText={(dir) => setDireccion(dir)}
                value={direccion}
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <TextInput
                mode="outlined"
                label="Teléfono"
                onChangeText={(tel) => setTelefono(tel)}
                value={telefono}
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <TextInput
                mode="outlined"
                disabled
                label="Correo Eléctronico"
                onChangeText={(email) => setEmail(email)}
                value={email}
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <TextInput
                mode="outlined"
                label="Curp"
                onChangeText={(cur) => setCurp(cur)}
                value={curp}
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <TextInput
                mode="outlined"
                label="Rol"
                disabled
                value={rol}
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <TextInput
                mode="outlined"
                label="Nueva Contraseña"
                onChangeText={(contrasena) => setContrasena(contrasena)}
                placeholder="* * * * *"
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />
              <TextInput
                mode="outlined"
                label="Confirmar Contraseña"
                onChangeText={(confirmarContrasena) =>
                  setConfirmarContrasena(confirmarContrasena)
                }
                placeholder="* * * * *"
                style={{margin: 10}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />

              <Button
                style={{margin: 15, width: 150, alignSelf: 'center'}}
                mode="contained"
                onPress={() => {
                  if (contrasena === '' && confirmarContrasena === '') {
                    console.log('Entro sin');
                    setConfirmar(false);
                    actualizarPerfil();
                  }
                  if (contrasena != '' &&confirmarContrasena != '' &&contrasena === confirmarContrasena) {
                    setConfirmar(true);
                    console.log('Entro con');
                    actualizarPerfil();
                  }
                  if (contrasena != '' &&confirmarContrasena != '' &&contrasena != confirmarContrasena
                  ) {
                    Toast.show({
                      text: 'Ambas contraseñas deben ser iguales',
                      buttonText: 'Cerrar',
                    });
                  }
                }}
                theme={{colors: {primary: '#A93226'}}}>
                Guardar
              </Button>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 5,
  },
  containerSnack: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default Profile;

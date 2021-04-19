import React from 'react';
import {Toast, Container, Content, Button, Text, Icon} from 'native-base';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import * as RootNavigation from './RootNavigation';

const RecoverPassword = () => {
  const [flagOne, setFlagOne] = React.useState(false);
  const [flagTwo, setFlagTwo] = React.useState(false);
  const [emailCode, setEmailCode] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [codigo, setCodigo] = React.useState('');
  const [pass1, setPass1] = React.useState('');
  const [pass2, setPass2] = React.useState('');

  const recuperar = async () => {
    if (email === '') {
      Toast.show({
        text: 'El campo no debe estar vacío',
        buttonText: 'Cerrar',
        type: 'warning',
      });
    } else {
      let token = await Math.random().toString(36).substr(2);
      console.log(token);
      await axios
        .get(`http://3.212.186.5:3000/correo/recuperar/${email}/${token}`)
        .then((response) => {
          console.log(response.data);
          setEmailCode(token);
          setFlagOne(true);
          Toast.show({
            text: 'El codigo se envio',
            buttonText: 'Cerrar',
            type: 'success',
          });
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            text: 'Ocurrio un error',
            buttonText: 'Cerrar',
            type: 'danger',
          });
        });
    }
  };

  const verificar = () => {
    if (codigo === emailCode) {
      setFlagTwo(true);
    } else {
      Toast.show({
        text: 'Verifique que el codigo sea el correcto',
        buttonText: 'Cerrar',
        type: 'warning',
      });
    }
  };

  const cambiar = async () => {
    console.log(email);
    if (pass1 === pass2 && pass1 !== '' && pass2 !== '') {
      await axios
        .put(
          `http://3.212.186.5:3000/contrasena/actualizarContrasena/${email}/${pass1}`,
        )
        .then((response) => {
          console.log(response.data);
          Toast.show({
            text: 'La contraseña se cambio correctamente',
            buttonText: 'Cerrar',
            type: 'success',
          });

          RootNavigation.navigate('Login');
        })
        .catch((error) => {
          Toast.show({
            text: 'Ocurrio un error',
            buttonText: 'Cerrar',
            type: 'danger',
          });
        });
    } else {
      Toast.show({
        text: 'Ambas contraseñas deben ser iguales',
        buttonText: 'Cerrar',
        type: 'warning',
      });
    }
  };

  return (
    <Container>
      {flagOne === false ? (
        <Content padder>
          <Text style={{alignSelf: 'center', marginTop: 10, marginBottom: 10}}>
            RECUPERAR CONTRASEÑA
          </Text>
          <TextInput
            value={email}
            onChangeText={(email) => setEmail(email)}
            mode="outlined"
            label="Correo Electrónico"
            style={{margin: 15, width: 300, alignSelf: 'center'}}
            theme={{
              colors: {
                primary: '#A93226',
                underlineColor: 'transparent',
                selectionColor: '#A93226',
              },
            }}
          />
          <Button
            rounded
            onPress={() => recuperar()}
            style={{
              backgroundColor: '#A93226',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <Icon
              type="MaterialCommunityIcons"
              name="email"
              style={{marginRight: -5}}
            />
            <Text>Enviar</Text>
          </Button>

          <Content padder style={{alignSelf: 'center'}}>
            <Text
              note
              style={{
                alignSelf: 'center',
                marginTop: 10,
              }}>
              Recuerde que se le enviará un código
            </Text>
            <Text
              note
              style={{
                alignSelf: 'center',
                marginBottom: 10,
              }}>
              a su correo electrónico.
            </Text>
          </Content>
        </Content>
      ) : (
        <Content padder>
          {flagTwo === false ? (
            <Content>
              <Text
                note
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 10,
                  marginLeft: 70,
                }}>
                Ingrese el código que recibio en su correo electrónico
              </Text>
              <TextInput
                value={codigo}
                onChangeText={(codigo) => setCodigo(codigo)}
                mode="outlined"
                label="Código"
                style={{margin: 15, width: 300, alignSelf: 'center'}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
              />
              <Button
                rounded
                onPress={() => verificar()}
                style={{
                  backgroundColor: '#A93226',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <Icon
                  type="MaterialIcons"
                  name="verified-user"
                  style={{marginRight: -5}}
                />
                <Text>Verificar</Text>
              </Button>
            </Content>
          ) : (
            <Content>
              <Text
                note
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 10,
                  marginLeft: 70,
                }}>
                Ingrese su nueva contraseña
              </Text>
              <TextInput
                value={pass1}
                onChangeText={(pass1) => setPass1(pass1)}
                mode="outlined"
                label="Nueva Contraseña"
                style={{margin: 15, width: 300, alignSelf: 'center'}}
                theme={{
                  colors: {
                    primary: '#A93226',
                    underlineColor: 'transparent',
                    selectionColor: '#A93226',
                  },
                }}
                secureTextEntry
              />
              <TextInput
                value={pass2}
                onChangeText={(pass2) => setPass2(pass2)}
                mode="outlined"
                label="Verificar Contraseña"
                style={{margin: 15, width: 300, alignSelf: 'center'}}
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
                onPress={() => cambiar()}
                style={{
                  backgroundColor: '#A93226',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <Icon
                  type="MaterialIcons"
                  name="save-alt"
                  style={{marginRight: -5}}
                />
                <Text>Finalizar</Text>
              </Button>
            </Content>
          )}
        </Content>
      )}
    </Container>
  );
};

export default RecoverPassword;

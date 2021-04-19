import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Container, Content} from 'native-base';
import {Text, IconButton, Colors} from 'react-native-paper';
import * as RootNavigation from './RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = () => {

 const borrarTodo = async () => {
    try {
      await AsyncStorage.clear();
    } catch(e) {
      console.log(e);
    }
    console.log('Hasta Luego :D')
  }
  return (
    <Container>
       <Content padder>
           <IconButton
               icon="logout"
               color={Colors.red900}
               size={30}
               style={{alignSelf:'flex-end', marginTop:15, marginRight:20}}
               onPress={() => {
                   borrarTodo();
                   RootNavigation.navigate('Login');
               }}
           />
           <Text style={{alignSelf: 'center', fontSize: 25}}>BIENVENIDO A</Text>
           <Image
               source={require('../assets/gespro.png')}
               style={{height: 50, width: 256, margin: 20, alignSelf: 'center'}}
           />
           <Image
               source={require('../assets/gesApp.png')}
               style={{height: 256, width: 256, margin: 50, alignSelf: 'center'}}
           />
       </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    alignSelf: 'center',
  },
});

export default Home;

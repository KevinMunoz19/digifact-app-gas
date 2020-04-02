import React, { useState } from 'react';
import { Actions } from 'react-native-router-flux';
import Icon from "react-native-vector-icons/MaterialIcons";


import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Image,
	ImageBackground,
    ActivityIndicator,
    TextInput,
    ScrollView,
    Alert,
    Picker
}	from 'react-native';

import useUlForm from './../utils/useUlForm';


const NewUserLoginForm = () => {
    //const {setUserLoginInfo}  = useUserLogin();
    const [loading,setLoading] = useState(false);
		const {inputs,setInputs, handleInputChange, handleSubmit} = useUlForm();
    //const [formData, setFormData] = useState({
      //  nombre: "Jose",
			//	apellido: "Rodriguez",
      //  idusuario: "123456",
			//	password: "Digifact2020*",
      //  numeroestablecimiento: "0",
			//	permiso: "0"

    //});





  return (
  	<ScrollView style={styles.scrollContainer}>
    	<View style={styles.container}>
        <View style={styles.logoRow}>
        	<Image source={require('../img/logo.png')} style={styles.logo}/>
        </View>
        <View style={styles.formContainer}>
        	<View style={[styles.formLabel]}>
            {/* 1 columna, label de formulario  */}
            <Text style={{color: "#fff", fontSize: 20, padding: 3}}>REGISTRO DE USUARIO</Text>
          </View>
          <View style={styles.formRow}>
            <View style={styles.inputContainer}>
            	<TextInput
                placeholder="Codigo Usuario"
                onChangeText={(e)=>{handleInputChange('codigo',e)}}
                value={inputs.codigo}
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.formRow}>
            <View style={styles.inputHalfcontainer}>
              <TextInput
                placeholder="Nombre"
                onChangeText={(e)=>{handleInputChange('nombre',e)}}
                value={inputs.nombre}
                style={styles.input}
              />
            </View>
						<View style={styles.inputHalfcontainer}>
              <TextInput
                placeholder="Apellido"
                onChangeText={(e)=>{handleInputChange('apellido',e)}}
                value={inputs.apellido}
                style={styles.input}
              />
            </View>

          </View>
          <View style={styles.formRow}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Contraseña"
                onChangeText={(e)=>{handleInputChange('password',e)}}
                value={inputs.password}
                style={styles.input}
              />
            </View>
          </View>


          <View style={styles.formRow}>
            <View style={[styles.inputContainer, styles.input]}>
              <Picker
                selectedValue={inputs.numeroestablecimiento}
                style={styles.selectInput}
                placeholder="Numero de Establecimiento"
                onValueChange={(itemValue, itemIndex) =>
                	handleInputChange('numeroestablecimiento',itemValue)
                }
              >
                <Picker.Item label="Numero de Establecimiento" value={null} disabled={true} />
                <Picker.Item label="Establecimiento 1" value="0" />
                <Picker.Item label="Establecimiento 2" value="1" />

              </Picker>
            </View>
          </View>


					<View style={styles.formRow}>
						<View style={[styles.inputContainer, styles.input]}>
							<Picker
								selectedValue={inputs.permiso}
								style={styles.selectInput}
								placeholder="Permiso"
								onValueChange={(itemValue, itemIndex) =>
									handleInputChange('permiso',itemValue)
								}
							>
								<Picker.Item label="Tipo de Permiso" value={null} disabled={true} />
								<Picker.Item label="Normal" value="0" />
								<Picker.Item label="Administrador" value="1" />

							</Picker>
						</View>
					</View>


          <View style={styles.buttonRow}>
            {loading &&(
              <ActivityIndicator visible={false} size='large' color='#26A657'  style={ {justifyContent: 'center'} }/>
            )}
            {!loading && (
              <TouchableOpacity onPress={()=>handleSubmit({action:'create'})} style={styles.sectionTouch}>
                <Icon
                  name="done"
                  color="#26A657"
                  size={50}
                  style={styles.icon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor:'white'
    },
    container: {
        flex: 1,
        paddingHorizontal: 25,
        paddingVertical: 2,
        backgroundColor: '#fff'
    },
    logoRow: {
        flex: 1,
        alignItems: 'center'
    },
    logoContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    logo:{
		width: 250,
		height: 125,
        resizeMode: 'contain',
	},
    formContainer: {
        flex: 4
    },
    formLabel: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#77D353',
        marginBottom: 10
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    inputContainer:{
        flex: 1,
    },
    inputHalfcontainer: {
        flex: 0.45
    },
	input: {
		borderBottomColor:'#828B95',
		borderBottomWidth:1
    },
    selectInput: {
        fontSize: 10
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default NewUserLoginForm;

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

import useGDForm from './../utils/useGDForm';


const GasDataForm = () => {
    //const {setUserLoginInfo}  = useUserLogin();
    const [loading,setLoading] = useState(false);
		const {inputs,setInputs, handleInputChange, handleSubmit} = useGDForm();


  return (
  	<ScrollView style={styles.scrollContainer}>
    	<View style={styles.container}>
        <View style={styles.logoRow}>
        	<Image source={require('../img/logo.png')} style={styles.logo}/>
        </View>
        <View style={styles.formContainer}>
        	<View style={[styles.formLabel]}>
            {/* 1 columna, label de formulario  */}
            <Text style={{color: "#fff", fontSize: 20, padding: 3}}>Datos de Gasolinera</Text>
          </View>
          <View style={styles.formRow}>
            <View style={styles.inputContainer}>
            	<TextInput
                placeholder="Precio Super"
                onChangeText={(e)=>{handleInputChange('preciosuper',e)}}
                value={inputs.preciosuper}
                style={styles.input}
								keyboardType = 'numeric'
              />
            </View>
          </View>

					<View style={styles.formRow}>
            <View style={styles.inputContainer}>
            	<TextInput
                placeholder="Precio Regular"
                onChangeText={(e)=>{handleInputChange('precioregular',e)}}
                value={inputs.precioregular}
                style={styles.input}
								keyboardType = 'numeric'
              />
            </View>
          </View>

					<View style={styles.formRow}>
            <View style={styles.inputContainer}>
            	<TextInput
                placeholder="Precio Diesel"
                onChangeText={(e)=>{handleInputChange('preciodiesel',e)}}
                value={inputs.preciodiesel}
                style={styles.input}
								keyboardType = 'numeric'
              />
            </View>
          </View>

					<View style={styles.formRow}>
            <View style={styles.inputContainer}>
            	<TextInput
                placeholder="Numero de Bombas"
                onChangeText={(e)=>{handleInputChange('bombas',e)}}
                value={inputs.bombas}
                style={styles.input}
								keyboardType = 'numeric'
              />
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

export default GasDataForm;

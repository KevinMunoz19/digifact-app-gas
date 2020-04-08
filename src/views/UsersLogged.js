import React, {Fragment,useState,useEffect} from 'react';
import DB from '../utils/DB';

import {
	Text,
    View,
    ScrollView,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
    ImageBackground,
    Modal,
		Picker
}	from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from "react-native-vector-icons/MaterialIcons";
import IosHeader from '../components/IosHeader';

const UsersLogged = () =>{

    const [pdfModalVisible,setPdfModalVisible] = useState(false);
    const [pdfSource,setPdfSource] = useState(null);
    const [dteList,setDteList] = useState([]);
    const [loading,setLoading] = useState(false);
    const {select} = DB();

		const [usersList,setUsersList] = useState([]);


		const [us,setUs] = useState('');
		const [pass,setPass] = useState('');





		useEffect(()=>{
        var query = `select * from loginusers`;
        select(query,[],(dtes)=>{
					console.log(dtes);
					setUsersList(dtes);
					setUs(dtes[0].codigo_usuario);
          setPass(dtes[0].password);
        })
    },[])


		function findNewUser(){
			var query = `select * from loginusers`;
			select(query,[],(dtes)=>{
				console.log(dtes);
				setUs(dtes[1].codigo_usuario);
				setPass(dtes[1].password);
			})
		}

		function h() {

	}





	return(
        <View style={styles.container}>
            <Modal visible={pdfModalVisible}>
                <TouchableOpacity  onPress={()=>Actions.home()} style={styles.closeModalButton}>
                    <Icon
                        name="keyboard-arrow-left"
                        color="black"
                        size={50}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </Modal>
            <IosHeader/>
            <View style={styles.headerContainer}>
                <View style={styles.textHeaderContainer}>
                    <Text style={styles.textHeader}>Usuarios</Text>
                </View>
            </View>
            <View style={styles.bodyContainer}>
                <ScrollView style={styles.scroll}>

								<Text>Usuario {us}</Text>
								<Text>Password {pass}</Text>

								<View style={styles.buttonContainer}>
									<TouchableOpacity style={styles.button} onPress={findNewUser}>
										<Text style={styles.buttonText}>Modificar</Text>
									</TouchableOpacity>
								</View>

								<View style={styles.buttonContainer}>
									<TouchableOpacity style={styles.button} onPress={()=>Actions.gasdataform()}>
										<Text style={styles.buttonText}>Datos Gasolinera</Text>
									</TouchableOpacity>
								</View>




								<View style={styles.formRow}>
			            <View style={[styles.inputContainer, styles.input]}>
			              <Picker
			                style={styles.selectInput}
			                placeholder="Nacionalidad"
			              >
										<Picker.Item label="Nacionalidad" value={null} disabled={true} />
										{usersList.map((usr)=>{
												return(
														<Picker.Item label={usr.codigo_usuario} value="Guatemala" />
												)
										})}



			              </Picker>
			            </View>
			          </View>





                </ScrollView>
            </View>
        </View>
	);

}

const styles = StyleSheet.create({
	detailsContainer:{
			alignItems:'center',
			flexDirection:'row',
			justifyContent:'space-around',
			width:'100%',
	},
	valuesText:{
			fontSize:10,
			marginTop:5,
	},
	valuesColumn:{
			flex:2,
			alignItems:'center',
			flexDirection:'column',
			justifyContent:'space-around'
	},
    closeModalButton:{
		flexDirection:'row'
    },
    container:{
        flex:1,
        backgroundColor:'white'

    },
    textHeader:{
        color:'white',
        fontSize:20
    },
    textHeaderContainer:{
        width:'50%',
        height:'50%',
        backgroundColor:'rgb(119,211,83)',
        alignItems:'center',
        justifyContent:'center'
    },
    headerContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    textContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    bodyContainer:{
        flex:8,
        // alignItems:'center'
    },
    buttonContainer:{
        flex:1,
    },
    scroll:{
        flex:1,
    },
    createButton:{
        flexDirection:'row',
        // backgroundColor:'white',
        // borderBottomColor:'#26A657',
        // borderTopColor:'#26A657',
        // borderBottomWidth:1,
        // borderTopWidth:1,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    icon:{
        marginRight:20
    },
    dtesContainer:{
        width:'100%',
        alignItems:'center'
    },

		textHeaderContainerSub:{
        width:'30%',
        height:'80%',
        backgroundColor:'rgb(119,211,83)',
        alignItems:'center',
        justifyContent:'center'
    },
    headerContainerSub:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
		textHeaderSub:{
        color:'white',
        fontSize:12
    },
		buttonContainer:{
			flex:2,
			backgroundColor:'white',
			alignItems:'center'
		},
		button:{
			width:'50%',
			height:'90%',
			backgroundColor:'#828B95',
			alignItems:'center',
			justifyContent:'center'
		},
		buttonText:{
			color:'white',
			fontSize:20
		},
		formRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 30
	},
	inputContainer:{
			flex: 1,
	},
	input: {
		borderBottomColor:'#828B95',
		borderBottomWidth:1
	},
	selectInput: {
			fontSize: 10
	},
});

export default UsersLogged;

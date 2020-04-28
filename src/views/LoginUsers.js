import React, {Fragment,useState,useEffect} from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
	Text,
	View,
	TextInput,
	Button,
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	ScrollView,
}	from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import {Actions} from 'react-native-router-flux';
import useUserLogin from './../utils/useUserLogin';
import IosHeader from '../components/IosHeader';
import DB from '../utils/DB';



const LoginUsers = () =>{

	const [username,setUsername] = useState('');
	const [password,setPassword] = useState('');
	const {setUserLogin,getUserLogin} = useUserLogin();
	const [loading,setLoading] = useState(false);
	const {select,insert} = DB();
	const [userVerification,setUserVerification] = useState([]);

	useEffect(()=>{
		getUserLogin((users)=>{
			console.log('user Login',users);
		})
	},[])

	useEffect(()=>{


	},[])

	function createNewUser() {
		Actions.newuserloginform();
	}

	function verifyUser() {
		setLoading(true);


		if (username.trim().length > 0 &&
				password.trim().length > 0){


			//var queryver = `select * from loginusers where codigo_usuario = ${username.trim()} and password = ${password.trim()}`;
			var queryver = `select * from loginusers where codigo_usuario = "${username.trim()}"`;
			select(queryver,[],(dtes)=>{
				console.log("Query concatenado");
				console.log(queryver);
				console.log("res");
				console.log(dtes);
				if (password == dtes[0].password) {
					setLoading(false);

					var querylogout = `
						UPDATE loginusers set logged_in = "0" where  logged_in = "1"
						`;
						insert(querylogout,[],(result)=>{
							console.log('Todos los usuarios logged out',result);
						})

					var queryup = `
						UPDATE loginusers set logged_in = "1" where codigo_usuario = "${username.trim()}"
						`;
						insert(queryup,[],(result)=>{
							console.log('Update Completado',result);
						})

					Actions.userslogged();
				} else {
					setLoading(false);
					Alert.alert('Usuario o Clave invalida');

				}
			})

		}	else {
			setLoading(false);
			Alert.alert('Llenar todos los campos');
		}



	}




	return(
		<ScrollView style={{backgroundColor:'white',flex:1}}>
		<IosHeader textHeader={'DTE'}/>
			<View style={loginStyles.primaryContainer}>
				<View style={loginStyles.headerContainer}>
				</View>
				<View style={loginStyles.imageContainer}>
					<Image source={require('../img/logo.png')} style={loginStyles.logo}/>
				</View>
				<View style={loginStyles.formContainer}>
					<View style={loginStyles.inputContainer}>
						<Icon
							name="person-pin"
							color="#828B95"
							size={20}
						/>
						<TextInput
							placeholder='CODIGO USUARIO'
							style={loginStyles.input}
							onChangeText={(e)=>{setUsername(e)}}
						/>
					</View>
					<View style={loginStyles.inputContainer}>
						{/* <View style={{flexDirection:'row',alignItems:'center'}}> */}
						<Icon
							name="lock"
							color="#828B95"
							size={20}
						/>
						<TextInput
							placeholder='CONTRASEÑA'
							style={loginStyles.input}
							onChangeText={(e)=>{setPassword(e)}}
							secureTextEntry={true}
						/>
					{/* </View> */}
					</View>
				</View>
				{(loading)&&(
					<ActivityIndicator visible={false} size='large' color='#26A657'/>
				)}
				<View style={loginStyles.buttonContainer}>
					<TouchableOpacity style={loginStyles.button} onPress={verifyUser}>
						<Text style={loginStyles.buttonText}>Ingresar</Text>
					</TouchableOpacity>
				</View>
				<View style={loginStyles.buttonContainer}>
					<TouchableOpacity style={loginStyles.button} onPress={createNewUser}>
						<Text style={loginStyles.buttonText}>Crear Nuevo Usuario</Text>
					</TouchableOpacity>
				</View>


			</View>
		</ScrollView>
	);
}
const loginStyles = StyleSheet.create({
	primaryContainer:{
		flex:1,
		backgroundColor:'white'
	},
	headerContainer:{
		flex:0.5,
		backgroundColor:'rgb(119,211,83)'
	},
	imageContainer:{
		flex:2,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center'
	},
	logo:{
		width: wp('60%'),
		height: hp('20%'),
	},
	formContainer:{
		flex:3,
		backgroundColor:'white',
		alignItems:'center',
		justifyContent:'space-around',
		height: hp('60%'),
	},
	buttonContainer:{
		flex:2,
		backgroundColor:'white',
		alignItems:'center'
	},
	inputContainer:{
		paddingTop:'2%',
		width: wp('30%'),
		//width:'70%',
		textAlign:'center',
		flexDirection:'row',
		alignItems:'center',
		borderBottomColor:'rgb(119,211,83)',
		borderBottomWidth:1,
	},
	input:{
		width: wp('20%')
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
	}

})

const styles = StyleSheet.create({
	container:{
		flex: 1,
		flexDirection:'column',
        alignItems: 'center',
		justifyContent: 'flex-start',
	},
	input:{
		textAlign: 'center',
		width:'80%',
		marginTop:'5%',
		marginBottom:'5%',
		backgroundColor : 'rgb(235, 235, 235)',
		borderRadius:9,
		shadowOpacity: 0.75,
        shadowRadius: 5,
        shadowColor: 'red',
        shadowOffset: { height: 0, width: 0 }
	},
	logo:{
		width:'80%',
		height:'20%',
		resizeMode: 'contain',
	},
	sendButton:{
		backgroundColor:'#26A657',
		width:'40%',
		height:'15%',
		textAlign: 'center',
		justifyContent: 'center',
		borderRadius:9
	},
 })

export default LoginUsers;

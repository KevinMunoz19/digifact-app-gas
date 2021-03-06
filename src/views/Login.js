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
import useUser from './../utils/useUser';
import useApi from './../utils/useApi';



const Login = () =>{

	const [nit,setNit] = useState('');
	const [username,setUsername] = useState('');
	const [password,setPassword] = useState('');
	const {setUser,getUser, confirmContract, setUserInfo} = useUser();
	const {login} = useApi();
	const [loading,setLoading] = useState(false);


	const [formData, setFormData] = useState({
			contactName: "DigifactApp",
			id: "123456",
			nation: "Guatemala",
			job: "null",
			certificate: "null",
			certificateName:"null",
			cellphone: '+ 502 12345678',
			email: 'digifactapp@gmail.com',
			logo: "null",
			logoName:"null"
	});

	useEffect(()=>{
		getUser((users)=>{
			console.log('user',users);
			if(users != null){
				Actions.home();
			}
		})
	},[])

	function handlerSend(){
		setLoading(true);
		function PadLeft(value, length) {
			return (value.toString().length < length) ? PadLeft("0" + value, length) :
			value;
		}

		login({
			Username:`GT.${PadLeft(nit,12)}.${username}`,
			Password:password
		},(response)=>{
			if(response!=null){
				if(response.code == null){
					console.log(response);
					var user = {
						name:username,
						nit:nit,
						stringNit:response.otorgado_a,
						token:response.Token,

					}
					setUser(user,(userInfo)=>{
						setLoading(false);
						console.log('aqui el que necesito',userInfo);
						console.log(userInfo.contact_name);



						// if(userInfo.contact_name == null){
						// 	Actions.welcome();
						// }else if(userInfo.confirm_contract == null){
						// 	Actions.contract();
						// }else{
							Actions.home();
						// }
					});
				}else{
					setLoading(false);
					if(response.code == 2001){
						Alert.alert('Usuario o Clave invalida');
					}else{
						Alert.alert(response.message);
					}

				}
			}
		},(err)=>{
			setLoading(false);
			console.log(err);
			Alert.alert(`Error de la peticion -> ${err}`);
		});






	}


	return(
		<ScrollView style={{backgroundColor:'white',flex:1}}>
			<View style={loginStyles.primaryContainer}>
				<View style={loginStyles.headerContainer}>
				</View>
				<View style={loginStyles.imageContainer}>
					<Image source={require('../img/logo.png')} style={loginStyles.logo}/>
				</View>
				<View style={loginStyles.formContainer}>
					<View style={loginStyles.inputContainer}>
						<Icon
							name="fingerprint"
							color="#828B95"
							size={20}
						/>
						<TextInput
							placeholder='NIT'
							style={loginStyles.input}
							onChangeText={(e)=>{setNit(e)}}
						/>
					</View>
					<View style={loginStyles.inputContainer}>
						<Icon
							name="person-pin"
							color="#828B95"
							size={20}
						/>
						<TextInput
							placeholder='USUARIO'
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
							placeholder='CLAVE'
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
					<TouchableOpacity style={loginStyles.button} onPress={handlerSend}>
						<Text style={loginStyles.buttonText}>INICIAR SESION</Text>
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

export default Login;

import React, {Fragment,useState,useEffect} from 'react';

import {
	Text,
	View,
	Label,
	Switch,
	Button,
	TextInput,
	Modal,
	Picker,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
  ActivityIndicator,
	Alert,
	ButtonGroup,
	Linking,
	requireNativeComponent,
	NativeModules,
	NativeEventEmitter,


}	from 'react-native';


import AppLink from 'react-native-app-link';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Icon from "react-native-vector-icons/MaterialIcons";
import {Actions} from 'react-native-router-flux';
import Clients from './Clients';
import Client from './Client';
import Products from './Products'
import Product from './Product';
import ProductBox from '../components/ProductBox';
import PdfView from '../components/PdfView';
import useDte from '../utils/useDte';
import useApi from '../utils/useApi';
import useUser from '../utils/useUser';
import useLastDte from '../utils/useLastDte';
import useClientForm from '../utils/useClientForm';
import IosHeader from '../components/IosHeader';
import DB from '../utils/DB';
import SectionDivider from '../components/SectionDivider.component';
import { validateEmail } from '../utils/emailValidator';
const Sw = requireNativeComponent('Sw');
const activityStarter = NativeModules.ActivityStarter;
const eventEmitterModule = NativeModules.EventEmitter;
const printer = NativeModules.PrintModule;


const Dte = () =>{
	const [cf,setCf] = useState(false);
	const {inputs,setInputs, handleInputChange, handleSubmit} = useClientForm();
	const [clientModalVisible,setClientModalVisible] = useState(false);
	const [createClientModalVisible,setCreateClientModalVisible] = useState(false);
	const [productModalVisible,setProductModalVisible] = useState(false);
	const [createProductModalVisible,setCreateProductModalVisible] = useState(false);
	const [pdfModalVisible,setPdfModalVisible] = useState(false);
	const [email,setEmail] = useState('');
	const [nit,setNit] = useState(0);
	const [name,setName] = useState('');
	const [client,setClient] = useState({nit: '',name:'Seleccione un cliente'});
	const [iva,setIva] = useState(12);
	const [products,setProducts] = useState([]);
	const [total,setTotal] = useState(0);
	const [subTotal,setSubTotal] = useState(0);
	const [idpTotal,setIdpTotal] = useState(0);
	const {generateTotals,generateString,generateEmailString} = useDte();
	const {getUser} = useUser();
	const [user,setUser] = useState();
	const {findByNit} = useClientForm();
	const [isNit,setIsNit] = useState(false);
	const [pdfSource,setPdfSource] = useState(null);
	const [loading,setLoading] = useState(false);
	const [nombretemporal,setNombreTemporal] = useState('');
	const [nitTemporal,setNitTemporal] = useState('');
	const [visibleButton,setVisibleButton] = useState(false);
	const [userSend,setUserSend] = useState();
	const [productsSend,setProductsSend] = useState([]);
	const {select} = DB();
	const [documento,setDocumento] = useState([]);
	const {getBill, getInfo} = useApi();


	const [nn,setNn] = useState('');
	const [calle,setCalle] = useState('');
	const [direccion,setDireccion] = useState('');
	const [zona,setZona] = useState('');
	const [frases,setFrases] = useState('');
	const [afiliacion,setAfiliacion] = useState('');
	const [zipc,setZipc] = useState('');
	const [nombreComercial,setNombreComercial] = useState('');
	const [direccionComercial,setDireccionComercial] = useState('');
	const [numEstablecimiento,setNumEstablecimiento] = useState();
	const [autorizacion,setAutorizacion] = useState('');

	const [payment,setPayment] = useState(0);

	const [idpSuper,setIdpSuper] = useState(4.7);
	const [idpRegular,setIdpRegular] = useState(4.6);
	const [idpDiesel,setIdpDiesel] = useState(1.3);

	const [precioSuper,setPrecioSuper] = useState(0.0);
	const [precioRegular,setPrecioRegular] = useState(0.0);
	const [precioDiesel,setPrecioDiesel] = useState(0.0);

	const [bombas,setBombas] = useState([]);

	const [datosGas,setDatosGas] = useState([]);

	const [gasType, setGasType] = useState("");
	const [bombNumber, setBombNumber] = useState("");

	const [cantidadGalones,setCantidadGalones] = useState(0);

	const [gasPrice,setGasPrice] = useState(0);
	const [idpGas,setIdpGas] = useState(0);


	const radioProps = [
		{label: 'Nit  ', value: false },
		{label: 'Consumidor Final	', value: true }
	];

	const radioIVA = [
		{label:'12%  ',value:12},
		{label:'Exento',value:0}
	]

	const radioPaymentType = [
		{label: 'Efectivo', value: 0 },
		{label: 'Cheque', value: 1 },
		{label: 'Tarjeta', value: 2 }
	];

	useEffect(()=>{
		generateTotals(products,iva,setTotal,setSubTotal,setIdpTotal,idpSuper,idpRegular,idpDiesel)
	},[products,iva])

	useEffect(()=>{
		if(pdfSource != null){
			setLoading(false);
			setPdfModalVisible(true);
		}
	},[pdfSource])

	useEffect(()=>{
		getUser((userInfo)=>{
			setUser(userInfo);
		})


	},[])

	useEffect(()=>{
		console.log('Cambio de user:');
		setNumEstablecimiento(0);
	},[user])

	function addGas() {
		console.log("Cantidad de Galones")
		console.log(cantidadGalones)

		if (cantidadGalones <= 0.0 || !gasType || !bombNumber){
			Alert.alert('Verifica los datos!', 'Ingresar Datos De Venta de Combustible');
		} else {
			if (gasType == "Super"){
				var gasproduct = { price: precioSuper+idpSuper, code: gasType, name: gasType, id: 150, quantity: cantidadGalones };
			} else if (gasType == "Regular") {
				var gasproduct = { price: precioRegular+idpRegular, code: gasType, name: gasType, id: 150, quantity: cantidadGalones };
			} else {
				var gasproduct = { price: precioDiesel+idpDiesel, code: gasType, name: gasType, id: 150, quantity: cantidadGalones };
			}

			console.log("Precio DB");
			console.log(gasproduct);
			setProducts([...products,gasproduct]);
			var newnitfetch = user.string_nit.replace(/0+(?!$)/,'')
			getInfo(newnitfetch, (nom)=>{
				setNn(nom.toString())
			},(ca)=>{
				setCalle(ca.toString())
			},
			(dir)=>{
				setDireccion(dir.toString())
			},
			(zon)=>{
				setZona(zon.toString())
			},
			(fr)=>{
				setFrases(fr.toString())
			},
			(af)=>{
				setAfiliacion(af.toString())
			},
			(zpc)=>{
				setZipc(zpc.toString())
			},
			(nomc)=>{
				setNombreComercial(nomc.toString())
			},
			(dirc)=>{
				setDireccionComercial(dirc.toString())
			},
			(err)=>{
				if(err==200){
					Alert.alert('Error de conexion');
				}else{
					Alert.alert(err);
				}
			});


		}





	}

	useEffect(()=>{
			var querybombas = `select * from datosgas where id = 1`;
			select(querybombas,[],(dg)=>{
				console.log(dg);
				//setDatosGas(dtes);
				var numerobombas = dg[0].bombas;
				const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
				var nb = range(1,numerobombas,1);
				setBombas(nb);
				console.log("array de bombas");
				console.log(nb);
				setPrecioSuper(dg[0].preciosuper);
				setPrecioRegular(dg[0].precioregular);
				setPrecioDiesel(dg[0].preciodiesel);

			})
	},[])



	const onClientSelect = (client)=>{
		setTimeout(()=>{
			setClientModalVisible(false);
			setCreateClientModalVisible(false);
		},500)
		setEmail(client.email);
		setNit(client.nit);
		setClient(client);
		setNit(client.nit);
	}

	const findClient = (nit)=>{
		setNit(nit);
		findByNit(nit,(result)=>{
			if(result.length > 0){
				setClient(result[0]);
				setNit(result[0].nit);
				setEmail(result[0].email);
				setIsNit(true);
			}
			else{
				setEmail('');
				setIsNit(false);
				setClient({name:'Nit no se encuentra en su lista de clientes'});
			}
		})
	}

	const onProductSelect = (product)=>{
		console.log("producto")
		console.log(typeof product)
		console.log(product)
		console.warn('pasa el producto a la vista de dte');
		setTimeout(()=>{
			if(createProductModalVisible)setCreateProductModalVisible(false);
			if(productModalVisible) setProductModalVisible(false);
		},500)
		setProducts([...products,product]);



		 var newnitfetch = user.string_nit.replace(/0+(?!$)/,'')
		 getInfo(newnitfetch, (nom)=>{
		 	setNn(nom.toString())
		 },(ca)=>{
		 	setCalle(ca.toString())
		 },
		 (dir)=>{
		 	setDireccion(dir.toString())
		 },
		 (zon)=>{
		 	setZona(zon.toString())
		 },
		 (fr)=>{
		 	setFrases(fr.toString())
		 },
		 (af)=>{
		 	setAfiliacion(af.toString())
		 },
		 (zpc)=>{
		 	setZipc(zpc.toString())
		 },
		 (nomc)=>{
		 	setNombreComercial(nomc.toString())
		 },
		 (dirc)=>{
		 	setDireccionComercial(dirc.toString())
		 },
		 (err)=>{
		 	if(err==200){
		 		Alert.alert('Error de conexion');
		 	}else{
		 		Alert.alert(err);
		 	}
		 });
	}

	const onProductRemove = (productToRemove)=>{
		setProducts(products.filter(product=> (product.id != productToRemove.id && product.quantity != productToRemove.quantity)));
	}

	const createProduct = ()=>{
		setProductModalVisible(false);
		setCreateProductModalVisible(true);
	}

	const createClient = ()=>{
		setClientModalVisible(false);
		setCreateClientModalVisible(true);
	}

	const onGenerate = ()=>{
		setLoading(true);



		if (user) {
			if (email.trim().length > 0 ? validateEmail(email) : true){
				if (products.length > 0) {
					if((!cf && client.nit.trim().length > 0) || cf) {
						if(iva == 0 || iva == 12){
							generateString(products,client,cf,iva,email,user, nn, calle, direccion, zona, frases, afiliacion,zipc, nombreComercial, direccionComercial, numEstablecimiento,payment, (res)=>{
							//generateString(products,client,cf,iva,email,user, nn, calle, direccion, zona, frases, afiliacion,zipc, nombreComercial,direccionComercial, (res)=>{
								console.log("productos");
								console.log(typeof products)
								console.log(products);
								console.log('res ->',res)
								setPdfSource(res);
							},(err)=>{
								console.log('error',err);
								setLoading(false);
								Alert.alert(`Ocurrio un error generando el documento, por favor intete luego`);
							});
							setProductsSend(products);
							setUserSend(user);
						}else{
							setLoading(false);
							Alert.alert('Verifica los datos!', 'El iva debe ser 0 o 12%.');
						}
					} else {
						setLoading(false);
						Alert.alert('Verifica los datos!', 'Si no es consumidor final el nit es requerido.');
					}
				} else {
					setLoading(false);
					Alert.alert('Verifica los datos!', 'Se debe seleccionar al menos un producto.');
				}
			} else {
				setLoading(false);
				Alert.alert('Verifica los datos!', 'El correo ingresado no tiene una forma valida.');
			}
		}
		else {
			setLoading(false);
			Alert.alert('Error obteniendo los datos de la sesion', 'Por favor, inicie sesion de nuevo.');
			Actions.login();
		}
	}

	const onClosePdf = ()=>{
		setPdfModalVisible(false);
		var query = `select * from dte where id=(select max(id) from dte)`;
		select(query,[],(ldoc)=>{
				setDocumento(ldoc);
		})
		var query = `select auth_number from dte where id=(select max(id) from dte)`;
		select(query,[],(ldoc)=>{
				setAutorizacion(ldoc);
		})
		setVisibleButton(true);
	}

	const onPrint = () => {
		printer.print(JSON.stringify(documento),JSON.stringify(userSend),JSON.stringify(productsSend),nn.toString(),nombreComercial.toString(),direccionComercial.toString());
		// reprint
		setTimeout(()=>{
			printer.print(JSON.stringify(documento),JSON.stringify(userSend),JSON.stringify(productsSend),nn.toString(),nombreComercial.toString(),direccionComercial.toString());
		},5000);


		Actions.home();
	}

	const onGenerateE = ()=> {
		generateEmailString(userSend,autorizacion,email, (res)=>{
			console.log('res ->',res)
		},(err)=>{
			console.log('error',err);
			setLoading(false);
			Alert.alert(`Ocurrio un error enviando el documento por correo, por favor intete luego`);
		});
	}

	return(
		// <ImageBackground source={require('../img/Fondo.png')} style={{width: '100%', height: '100%'}} >
			<ScrollView style={{backgroundColor:'white'}}>
				<View style={styles.container}>
					<IosHeader textHeader={'DTE'}/>
					<Modal visible={clientModalVisible}>
						<TouchableOpacity  onPress={()=>setClientModalVisible(false)} style={styles.closeModalButton}>
							<Icon
								name="keyboard-arrow-left"
								color="black"
								size={50}
								style={styles.icon}
							/>
						</TouchableOpacity>
						<Clients action='select' onSelect={onClientSelect}></Clients>
						<TouchableOpacity  onPress={()=>createClient(false)} style={styles.createModalButton}>
							<Icon
								name="add-circle"
                color="rgb(119,211,83)"
                size={50}
                style={styles.icon}
							/>
						</TouchableOpacity>

					</Modal>
					<Modal visible={createClientModalVisible}>
						<TouchableOpacity  onPress={()=>setCreateClientModalVisible(false)} style={styles.actionButton}>
							<Icon
								name="arrow-back"
								color="#26A657"
								size={50}
								style={styles.icon}
							/>
							<Text >CERRAR</Text>
						</TouchableOpacity>
						<Client action='create' onSelect={onClientSelect}></Client>
					</Modal>
					<Modal visible={productModalVisible}>
						<TouchableOpacity  onPress={()=>setProductModalVisible(false)} style={styles.closeModalButton}>
							<Icon
                name="keyboard-arrow-left"
                color="black"
								size={50}
								style={styles.icon}
              />
						</TouchableOpacity>
						<Products action='select' onSelect={onProductSelect}></Products>
					</Modal>
					<Modal visible={createProductModalVisible}>
						<TouchableOpacity  onPress={()=>setCreateProductModalVisible(false)} style={styles.closeModalButton}>
							<Icon
                name="keyboard-arrow-left"
                color="black"
								size={50}
								style={styles.icon}
              />
						</TouchableOpacity>
						<Product action='create' onSelect={onProductSelect}></Product>
					</Modal>
					<Modal visible={pdfModalVisible}>
						<TouchableOpacity  onPress={()=>onClosePdf()} style={styles.closeModalButton}>
							<Icon
								name="keyboard-arrow-left"
								color="black"
								size={50}
								style={styles.icon}
							/>
						</TouchableOpacity>
						<PdfView source={pdfSource}/>
						{/* <Button title='Cerrar Modal' onPress={()=>setPdfModalVisible(false)}></Button> */}
					</Modal>
					<View style={{width:'100%',alignItems:'center'}}>
						<SectionDivider width={'50%'} sectionName={'DATOS DEL CLIENTE'} />
					</View>

					<View style={styles.contentContainer}>
						<View style={styles.cfContainer}>
							<RadioForm
								radio_props={radioProps}
								formHorizontal={true}
								initial={0}
								buttonColor={'#26A657'}
								onPress={(value) => {setCf(value)}}
								/>
						</View>

						<View style={{alignItems:'center'}}>
							<View style={styles.nitContainer}>
								{/* Fila 1: nit y boton */}
								{/* Dos columnas */}
								{(!cf) && (
										<TextInput
											placeholder="Nit"
											value={client.name}
											style={styles.nitInput}
											onChangeText={(e)=>{findClient(e)}}
										/>
								)}
								{(!cf) && (
									<TouchableOpacity
										onPress={()=>setClientModalVisible(true)}
										style={styles.clientListButton}
									>
										<Icon
											name="description"
											color="black"
											size={20}
											style={styles.listIcon}
										/>
										<Text fonSize={10} style={styles.fontSize}>Lista de clientes</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>

						{/* <View > */}
						<View style={{width:'100%',height:'30%',marginTop:'5%', alignItems:'center'}}>
							{/* Fila 3: email */}
							<TextInput
								placeholder="Email"
								placeholderTextColor="black"
								onChangeText={(e)=>{setEmail(e)}}
								value={email}
								style={styles.inputBorder}
							/>
						</View>
						{/* </View> */}
					</View>
					<View style={{width:'100%',alignItems:'center',marginBottom:10}}>
						<SectionDivider width={'80%'} sectionName={'IVA 12 %'}/>
					</View>


					{/* <View style={styles.ivaContainer}> */}
							{/* <RadioForm
								radio_props={radioIVA}
								formHorizontal={true}
								initial={0}
								buttonColor={'#26A657'}
								onPress={(value) => {setIva(value)}}
							/> */}
						{/* <TextInput
							// placeholder="IVA"
							onChangeText={(e)=>{setIva(e)}}
							value={String(iva)}
							style={styles.inputBorder}
							keyboardType = 'decimal-pad'
						/> */}
						{/* <Picker
							style={{width:'80%'}}
							selectedValue={iva}
							onValueChange={(value, i) =>
								setIva(value)
							}
						>
							<Picker.item label='Excento' value={0}/>
							<Picker.item label='12%' value={12}/>
						</Picker> */}
					{/* </View> */}
					<View style={{width:'100%',alignItems:'center'}}>
						<SectionDivider width={'80%'} sectionName={'TIPO DE PAGO'}/>
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.cfContainer}>
							<RadioForm
								radio_props={radioPaymentType}
								formHorizontal={true}
								initial={0}
								buttonColor={'#26A657'}
								onPress={(value) => {setPayment(value)}}
								/>
						</View>
					</View>



					<View style={{width:'100%',alignItems:'center'}}>
						<SectionDivider width={'80%'} sectionName={'Gasolina'}/>
					</View>

					<View style={styles.contentContainer}>


	            <View style={[styles.inputContainer, styles.input]}>
	              <Picker
	                style={styles.selectInput}
	                placeholder="Gasolina"
									selectedValue={gasType}
									onValueChange={(itemValue, itemIndex) => setGasType(itemValue)}
	              >
	                <Picker.Item label="Tipo de Gasolina" value={null} disabled={true} />
	                <Picker.Item label="Super" value="Super" />
	                <Picker.Item label="Regular" value="Regular" />
									<Picker.Item label="Diesel" value="Diesel" />
	              </Picker>
	            </View>

							<View style={[styles.inputContainer, styles.input]}>
								<Picker
									style={styles.selectInput}
									placeholder="Numero de Bomba"
									selectedValue={bombNumber}
									onValueChange={(itemValue, itemIndex) => setBombNumber(itemValue)}
								>
									<Picker.Item label="Numero de Bomba" value={null} disabled={true} />
									{bombas.map((usr,i)=>{
										var st = `Bomba Numero ${usr.toString()}`;
										var num = `${usr.toString()}`;
											return(
													<Picker.Item label= {st} value={num} />
											)
									})}
								</Picker>
							</View>





						<View style={{width:'100%',height:'30%',marginTop:'5%', alignItems:'center'}}>
							{/* Fila 3: email */}
							<TextInput
								onChangeText={(e)=>{setCantidadGalones(e)}}
								placeholder="Galones"
								placeholderTextColor="black"
								style={styles.inputBorder}
								keyboardType = 'numeric'
							/>
						</View>



						<TouchableOpacity
							onPress={()=>addGas()}
							style={styles.clientListButton}
						>
							<Icon
								name="description"
								color="black"
								size={20}
								style={styles.listIcon}
							/>
							<Text fonSize={10} style={styles.fontSize}>Agregar Gasolina</Text>
						</TouchableOpacity>






					</View>




					<View style={{width:'100%',alignItems:'center'}}>
						<SectionDivider width={'80%'} sectionName={'PRODUCTOS O SERVICIOS'}/>
					</View>

					<View style={styles.contentContainer}>
						<View style={{alignItems:'center'}}>
							<TouchableOpacity
								style={styles.addProductContainer}
								onPress={() => setProductModalVisible(true)}
							>
								<Text>Agregar producto</Text>
								<Icon
									name="add-circle"
									color="#26A657"
									size={30}
									style={styles.addButtoIcon}
								/>
							</TouchableOpacity>

						</View>
						<View>
							{/* Products */}
							{
								products.map((product)=>{
									return (<ProductBox product={product} action='item' onRemove={onProductRemove}></ProductBox>)
								})
							}
						</View>
						<View style={{width:'100%',alignItems:'center'}}>
							<View style={styles.totalContainers}>
								<Text>Sub Total: {subTotal}</Text>
							</View>


							<View style={styles.totalContainers}>
								<Text>IDP: {idpTotal}</Text>
							</View>


							<View style={styles.totalContainers}>
								<Text>Total: {total}</Text>
							</View>
						</View>
					{/* <Button title='Buscar Productos' onPress={()=>setProductModalVisible(true)}></Button> */}
					</View>

					{ (loading) && (
						<ActivityIndicator visible={false} size='large' color='#26A657'/>
					)}
					<View style={styles.generateBillButtonContainer}>
						<TouchableOpacity onPress={onGenerate} style={styles.actionButton}>
							<Icon
								name="add"
								color="#26A657"
								size={50}
								style={styles.icon}
							/>
							<Text >Generar Factura</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.generateBillButtonContainer}>
					{visibleButton &&
						<TouchableOpacity
							onPress={onPrint}
							style={styles.actionButton}>
							<Icon
								name="add"
								color="#26A657"
								size={50}
								style={styles.icon}
							/>
							<Text >Imprimir Factura</Text>
						</TouchableOpacity>
					}
					</View>
					<View style={styles.generateBillButtonContainer}>
					{visibleButton &&
						<TouchableOpacity
							onPress={onGenerateE}
							style={styles.actionButton}>
							<Icon
								name="add"
								color="#26A657"
								size={50}
								style={styles.icon}
							/>
							<Text >Mandar Factura por Correo</Text>
						</TouchableOpacity>
					}
					</View>
				</View>
			</ScrollView>
		// </ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	javaBtn: {
		height: 50,
		width: 100,
		backgroundColor: 'yellow'
	},
	createModalButton:{
		flexDirection:'row',
		justifyContent:'flex-end',
    alignItems:'center'
	},
	closeModalButton:{
		flexDirection:'row'
	},
	fontSize: {
		fontSize: 10
	},
	sectionHeader:{
		flex: 1,
		flexDirection:'row',
		height:'5%',
		width:'100%',
		backgroundColor:'#26A657',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cfContainer:{
		alignItems:'center'
	},
	contentContainer: {
		flex: 1,
		flexDirection:'column',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 20,
		paddingBottom: 20,
	},
	endConsumerSwitch: {
		marginBottom: 10
	},
	inputBorder: {
		width:"80%",
		borderBottomColor: '#DDDDDD',
		borderBottomWidth: 1,
		textAlign:'center'
	},
	nitContainer: {
		flexDirection: 'row',
		width:'80%'
	},
	nitInput: {
		flex: 3,
		marginRight: 20,
		borderBottomColor: '#DDDDDD',
		borderBottomWidth: 1,
	},
	clientListButton: {
		padding: 10,
		flex: 1.5,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	listIcon: {
		alignSelf: 'center'
	},
	addClientButtonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	},
	addClientButton: {
		width: '60%'
	},
	ivaContainer: {
		alignItems:'center',
		width:'100%',
		height:'10%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	addProductContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
		width:'80%',
		flex:2
	},
	totalContainers: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width:'80%'
	},
	addButtoIcon:{
		marginLeft: 10
	},
	generateBillButtonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 20
	},
	generateBillButton: {
		width: '60%'
	},
	actionButton:{
		marginTop:5,
    flexDirection:'row',
    backgroundColor:'white',
    borderBottomColor:'#26A657',
    borderTopColor:'#26A657',
    borderBottomWidth:1,
    borderTopWidth:1,
    justifyContent:'center',
    alignItems:'center'
  },
	formRow: {
		paddingLeft: 10,
		alignItems:'center',
		width: '60%',
		flexDirection: 'row',
		justifyContent: 'center',
		//justifyContent: 'space-between',
		marginBottom: 5
},
inputContainer:{
	justifyContent: 'center',
		width: '60%',
		flex: 1,
},
input: {

	//width: '60%',
	borderBottomColor:'#828B95',
	borderBottomWidth:1
},
selectInput: {
		fontSize: 10
},
});

export default Dte;

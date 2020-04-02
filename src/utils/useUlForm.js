import React,{useState} from 'react';

import {Alert} from 'react-native';
import DB from './DB';
import {Actions} from 'react-native-router-flux';
import { validateEmail } from './emailValidator';


const useUlForm = (callback) => {

	const [inputs, setInputs] = useState({
		nombre: '',
		apellido: '',
		codigo: '',
		password: '',
		numeroestablecimiento: '',
		permiso: ''
	});

	const {select,insert} = DB();

  const handleInputChange = (name,value) => {
	  setInputs(inputs => ({...inputs, [name]: value}));
	}

	const handleSubmit = ({action,onSelect}) =>{
		console.log("Datos Usuario Login");
		console.log(inputs.nombre);
		console.log(inputs.apellido);
		console.log(inputs.codigo);
		console.log(inputs.password);
		console.log(inputs.numeroestablecimiento);
		console.log(inputs.permiso);



		if (
			inputs.nombre.trim().length > 0 &&
			inputs.apellido.trim().length > 0 &&
			inputs.codigo.trim().length > 0 &&
			inputs.password.trim().length > 0 &&
			inputs.numeroestablecimiento.trim().length > 0 &&
			inputs.permiso.trim().length > 0
		) {
			var fields = [
				inputs.nombre,
				inputs.apellido,
				inputs.codigo,
				inputs.password,
				inputs.numeroestablecimiento,
				inputs.permiso
			]
			var query =``;
			var messageVerb='';
			if(action == 'create'){
				messageVerb='CREADO';
				query = `
				INSERT INTO loginusers(nombre,apellido,codigo_usuario,password,numero_establecimiento,permiso)
				VALUES(?,?,?,?,?,?)
				`;
			}else if (action == 'edit'){
				messageVerb='Actualizado';
				query =`
					UPDATE loginusers set nombre=?,apellido=?,codigo_usuario=?,password=?,numero_establecimiento=?,permiso=?
					WHERE id = ?;
				`;
				fields.push(inputs.id);
			}else if(action == 'delete'){
				messageVerb='ELIMINADO';
				query = `DELETE from receiver where id = ?`,
				fields = [inputs.id];
			}

			insert(query,fields,(result)=>{
				Alert.alert(`Usuario Login ${messageVerb} con exito`);
				if(onSelect == null){
					//Actions.clients({action:'manage'});
				}else{
					select(`select * from loginusers order by id desc limit 1`,[],(loginu)=>{
						console.log(loginu[0]);
						onSelect(loginu[0]);
					})
				}
			});
		} else {
			Alert.alert('Todos los campos son requeridos!');
		}
	}


	return {
	  handleSubmit,
	  handleInputChange,
		inputs,
		setInputs,
	};
}
export default useUlForm;

import React,{useState} from 'react';

import {Alert} from 'react-native';
import DB from './DB';
import {Actions} from 'react-native-router-flux';
import { validateEmail } from './emailValidator';


const useGDForm = (callback) => {

	const [inputs, setInputs] = useState({
		preciosuper: '',
		precioregular: '',
		preciodiesel: '',
		bombas: '',
	});

	const {select,insert} = DB();

  const handleInputChange = (name,value) => {
	  setInputs(inputs => ({...inputs, [name]: value}));
	}

	const handleSubmit = ({action,onSelect}) =>{
		console.log("Datos Gas");
		console.log(inputs.preciosuper);
		console.log(inputs.precioregular);
		console.log(inputs.preciodiesel);
		console.log(inputs.bombas);


		if (
			inputs.preciosuper.trim().length > 0 &&
			inputs.preciodiesel.trim().length > 0 &&
			inputs.precioregular.trim().length > 0 &&
			inputs.bombas.trim().length > 0
		) {
			var fields = [
				inputs.preciosuper,
				inputs.precioregular,
				inputs.preciodiesel,
				inputs.bombas,
			]
			var query =``;
			var messageVerb='';
			if(action == 'create'){
				messageVerb='CREADO';
				query = `
				INSERT INTO datosgas(preciosuper,precioregular,preciodiesel,bombas)
				VALUES(?,?,?,?)
				`;
			}else if (action == 'edit'){
				messageVerb='Actualizado';
				query =`
					UPDATE datosgas set preciosuper=?,precioregular=?,preciodiesel=?,bombas=?
					WHERE id = ?;
				`;
				fields.push(inputs.id);
			}else if(action == 'delete'){
				messageVerb='ELIMINADO';
				query = `DELETE from datosgas where id = ?`,
				fields = [inputs.id];
			}

			insert(query,fields,(result)=>{
				Alert.alert(`Datos Gas ${messageVerb} con exito`);
				if(onSelect == null){
					//Actions.clients({action:'manage'});
				}else{
					select(`select * from datosgas order by id desc limit 1`,[],(loginu)=>{
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
export default useGDForm;

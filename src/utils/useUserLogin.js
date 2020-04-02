import React,{useState} from 'react';

import DB from './DB';

const useUserLogin = (callback) => {

    const {select,insert} = DB();

    const setUserLoginInfo = ({name,lastName,userCode,password,establishmentNumber,permits})=>{
        var query = `
            UPDATE loginusers set nombre = ?,apellido = ?,
            codigo_usuario = ?,password = ?,numero_establecimiento=?,
            permiso = ?  where logged_in = ?;
        `;
        insert(query,[name,lastName,userCode,password,establishmentNumber,permits,1],(result)=>{
            console.log('result contract',result);
        })
    }
    const setUserLogin = (user,cb) =>{
        var {name,userCode,lastName} = user;
        var validate = `SELECT * FROM loginusers  where nombre = ? AND codigo_usuario = ?`;
        select(validate,[name,userCode],(exist)=>{
            if(exist.length > 0){
                var query = `update loginusers set logged_in = ? where name = ? AND codigo_usuario = ?;`;
                var fields = [1,name,userCode];
                insert(query,fields,(result)=>{
                    select('select * from loginusers where logged_in = ?',[1],(userInfo)=>{
                        cb(userInfo[0])
                    })
                });
            }else{
                var query = `INSERT INTO loginusers(nombre,apellido,codigo_usuario,logged_in) VALUES(?,?,?,?);`;
                var fields = [name,lastName,userCode,1];
                insert(query,fields,(result)=>{
                    select('select * from loginusers where logged_in = ?',[1],(userInfo)=>{
                        cb(userInfo[0])
                    })
                });
            }
        })

    }

    const removeUserLogin = () =>{
        var query = `DELETE FROM loginusers`;
        insert(query,[],(result)=>{
			console.log('result');
		});
    }

    const logoutUserLogin = ()=>{
        var query = `UPDATE loginusers SET logged_in = 0`;
        insert(query,[],(result)=>{
			console.log('result');
		});
    }

    getUserLogin = (cb)=>{
        var query = `SELECT * from loginusers where logged_in = ?`;
        select(query,[1],(users)=>{
            cb(users[0]);
        })
    }


    return {
        setUserLogin,
        setUserLoginInfo,
        getUserLogin,
        removeUserLogin,
        logoutUserLogin,

	};

}

export default useUserLogin;

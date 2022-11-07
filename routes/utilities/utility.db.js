const _ = require('lodash');
const async = require('async');


const getUserByUsernameAndEmail = function (username,email,cb){
    db.query("SELECT * FROM users WHERE username = '" + username + "' AND email = '" + email +"'",function (err,rows){
        if(!err){
            cb(null,rows);
        }else{
            cb(err,null);
        }
    })
}

const getUserById = function (user_id,cb){
    db.query("SELECT username,email,allow FROM users WHERE id = '" + user_id + "'",function (err,res){
        if(res.length > 0){
            cb(null,res[0]);
        }else{
            cb(err,null)
        }
    })
}

const editProfile = function (username,user_id,email,cb){
    db.query("UPDATE users SET username = '" + username + "', email = '" + email + "' WHERE id = '" + user_id + "' ",function (err,res){
        if(!err){
            cb(null,true);
        }else{
            cb(err,null);
        }
    })
}

const addCard = function (player_name, card_name, value,client_id,platform_id,printing,user_id, cb){
    db.query("INSERT INTO cards(player_name,card_name,printing,value,client_id,sell_platform_id,user_id) VALUES('"+player_name+"','"+card_name+"','"+printing+"','"+value+"','"+ parseInt(client_id) +"','"+ parseInt(platform_id) +"', '"+ parseInt(user_id) +"')",function (err,res){
        if(!err){
            cb(null,true);
        }else{
            cb(err,null);
        }
    })
}

const addClient = function (name,surname,email,cb){
    db.query("INSERT INTO clients(name,surname,email) VALUES('"+name+"','"+surname+"','"+email+"')",function (err,res){
        if(!err){
            cb(null,true);
        }else{
            cb(err,null);
        }
    })
}

const deleteCard = function (card_id,cb){
    db.query("DELETE FROM cards WHERE id = " + card_id,function (err,res){
        if(!err){
            cb(null,true);
        }else{
            cb(err,null);
        }
    })
}

const getClientByEmail = function (email,cb){
    db.query("SELECT * FROM clients WHERE email = '" + email + "' ",function (err,res){
        if(!err){
            if(res.length > 0){
               cb(null,true);
            }else{
                cb(null,false);
            }
        }else{
            cb(err,null);
        }
    })
}

const getClients = function (cb){
    db.query("SELECT * FROM clients",function (err,data){
        if(!err){
            cb(null,data);
        }else{
            cb(err,null)
        }
    })
}

const getCards = function (value,client_id,user_id,cb){
    if(value !== ''){
        db.query("SELECT c.*, sp.name as sell_platform_name, cl.name as client_name , cl.surname as client_surname, cl.email as client_email FROM cards as c JOIN sell_platforms sp ON c.sell_platform_id = sp.id JOIN clients cl ON cl.id = c.client_id WHERE user_id = '"+ user_id +"' AND cl.name LIKE '%"+ value + "%' OR cl.surname LIKE '%" + value+"%' OR cl.email  LIKE '%" + value+"%' OR c.player_name LIKE '%"+value+"%' OR c.card_name LIKE '%"+value+"%'" ,function (err,cards){
            if(!err){
                cb(null,cards);
            }else{
                cb(err,null)
            }
        })
    }else if (client_id !== ''){
        db.query("SELECT c.*, sp.name as sell_platform_name, cl.name as client_name , cl.surname as client_surname, cl.email as client_email FROM cards as c JOIN sell_platforms sp ON c.sell_platform_id = sp.id JOIN clients cl ON cl.id = c.client_id WHERE user_id = '"+ user_id +"' AND c.client_id = '" +client_id+"' " ,function (err,cards){
            if(!err){
                cb(null,cards);
            }else{
                cb(err,null)
            }
        })
    }else{
        db.query("SELECT c.*, sp.name as sell_platform_name, cl.name as client_name , cl.surname as client_surname, cl.email as client_email FROM cards as c JOIN sell_platforms sp ON c.sell_platform_id = sp.id JOIN clients cl ON cl.id = c.client_id WHERE user_id = '"+ user_id +"' " ,function (err,cards){
            if(!err){
                cb(null,cards);
            }else{
                cb(err,null)
            }
        })
    }

}

module.exports = {
    getUserByUsernameAndEmail,
    getUserById,
    editProfile,
    addCard,
    addClient,
    deleteCard,
    getClientByEmail,
    getClients,
    getCards
}
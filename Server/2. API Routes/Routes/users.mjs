import express from 'express';

const users = express();
let AllUsers = [
    {
        username: 'bilal',
        email: 'abc@xyz.com',
        id: 1,
        age: 30,
        depart: 'IT'
    },
    {
        username: 'anas',
        email: 'abc@xyz.com',
        id: 2,
        age: 20,
        depart: 'Medical'
    },
    {
        username: 'faiq',
        email: 'abc@xyz.com',
        id: 2,
        age: 20,
        depart: 'none'
    },
    {
        username: 'siraj',
        email: 'abc@xyz.com',
        id: 2,
        age: 25,
        depart: 'none'
    }
]




users.get('/', (req,res)=>{
    console.log('users api')
    let {username, id, age, depart} = req.query;
    let filteredUsers = AllUsers;

    if(age){
        filteredUsers = filteredUsers.filter((user)=> (age)==user.age)
    }
    if(depart){
        filteredUsers = filteredUsers.filter((user)=> depart==user.depart)
    }
    if(username){
        filteredUsers = filteredUsers.filter((user)=> username==user.username)
    }
    if(id){
        filteredUsers = filteredUsers.filter((user)=> (id)==user.id)
    }

    res.status(200).json({
        message: 'Users fetched successfully',
        data: filteredUsers
    });

        console.log("this user: ",filteredUsers)


    if(filteredUsers.length <1){
        res.status(404).json({
            message: 'No users found'
        });
    }

})



export default users; 
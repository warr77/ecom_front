const { Result } = require("express-validator");
const group=require("../models/group")
module.exports=function(io){
    const rooms=[];
    var group1={};
    var chatrooms=io.of('/roomlist').on('connection',(socket)=>{
        console.log("connections established on the server")
        socket.emit('roomupdate',JSON.stringify(rooms));

        socket.on('newroom',function(data){
            rooms.push(data);
            socket.broadcast.emit('roomupdate',JSON.stringify(rooms));
            socket.emit('roomupdate',JSON.stringify(rooms));
            
        })
    })
   var messages=io.of('/messages').on('connection',function(socket){
       console.log('connection to chatroom!');
       socket.on('joinroom',function(data){
           socket.username=data.user;
           socket.join(data.room);
           updateuserslist(data.room,true)
       })
       socket.on('newMessage',function(data){
           console.log(data.message)
          // console.log(JSON.stringify(data))
           group1={text:data.message,
            sender:data.user

        }
           group.findOneAndUpdate(
            { _id: data.room_number}, 
            { $push: { messages: group1  } },
           function (error, success) {
                 if (error) {
                     console.log(error);
                 } else {
                     //console.log(success);
                 }
             });
         
           socket.to(data.room_number).emit('messagefeed',JSON.stringify(data))

           
       })
       function updateuserslist(room,yes){
           var getUsers= io.of('/messages').sockets;
           //console.log(getUsers);
           var userlist=[];
           for (var i in getUsers){
               userlist.push({user:getUsers[i].username}
               )}
               socket.to(room).emit('updateUsersList',JSON.stringify(userlist))
               if(yes){
                socket.broadcast.to(room).emit('updateUsersList',JSON.stringify(userlist))
            }
       }
      
       socket.on('updateList', function(data){
        updateuserslist(data.room,false);
      })
   })

}
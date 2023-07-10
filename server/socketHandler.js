const socket = require('socket.io');

// All the online users
const onlineUsers = new Map();

const disconnect = (id) => {
	console.log(onlineUsers);
	onlineUsers.delete(id);
}

const initializeSocket = (server) => {
	const io = socket(server, {
		cors: {
			origin: 'http://localhost:3000',
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		socket.on('add-user', (userId) => {
			//   console.log('User connected:', userId, socket.id);
			onlineUsers.set(userId, socket.id);
		});

		socket.on('send-msg', (data) => {
			//   console.log('Message received:', data);
			const receiverSocket = onlineUsers.get(data.receiver);
			if (receiverSocket) {
				socket.to(receiverSocket).emit('msg-receive', data);
			}

		
		});

		socket.on('callUser', ({userToCall, signalData, from})=>{
			console.log('need to call');
			console.log(userToCall);
			// console.log(from._id);
			const sender = onlineUsers.get(from._id);
			const receiver = userToCall;
			console.log(from._id + ' is trying to call ' + userToCall);
			userToCall = onlineUsers.get(userToCall);
			if(userToCall === undefined){
				io.to(sender).emit('call-noti', 'user is not onlline');
			}
			else{
				console.log(userToCall);
				io.to(sender).emit('call-noti', 'online ... calling');
				io.to(userToCall).emit('msg-receive', {sender : from._id, receiver : userToCall, message : 'tap the video button above to join call'});
				io.to(userToCall).emit('callUser', {signal:signalData, sender});
			}
			// console.log('user to call', userToCall);
			
		});

		socket.on('answerCall', (data)=>{
			io.to(data.to).emit('callAccepted', data.signal);
		})

	});
};

module.exports = {
	initializeSocket,
	onlineUsers,
	disconnect
};

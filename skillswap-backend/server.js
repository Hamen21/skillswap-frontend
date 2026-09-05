const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/database');

const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// API ROUTES
// ==========================================

app.use(
    '/api/users',
    userRoutes
);

app.use(
    '/api/connections',
    connectionRoutes
);

app.use(
    '/api/messages',
    messageRoutes
);


// ==========================================
// HOME ROUTE
// ==========================================

app.get('/', (req, res) => {

    res.send(
        'SkillSwap Backend is running 🚀'
    );

});


// ==========================================
// HTTP SERVER
// ==========================================

const server =
    http.createServer(app);


// ==========================================
// SOCKET.IO
// ==========================================

const io =
    new Server(server, {

        cors: {
            origin: '*',

            methods: [
                'GET',
                'POST'
            ]
        }

    });


// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on(
    'connection',
    (socket) => {

        console.log(
            'Socket connected:',
            socket.id
        );


        // ======================================
        // JOIN USER ROOM
        // ======================================

        socket.on(
            'join',
            (userId) => {

                if (!userId) {
                    return;
                }

                socket.join(
                    userId
                );

                console.log(
                    `User ${userId} joined room`
                );

            }
        );


        // ======================================
        // RECEIVE MESSAGE
        // ======================================

        socket.on(
            'sendMessage',
            (message) => {

                console.log(
                    'Real-time message received:',
                    message
                );


                if (
                    !message ||
                    !message.receiver
                ) {

                    console.log(
                        'Invalid message received'
                    );

                    return;

                }


                // ==================================
                // GET RECEIVER ID
                // ==================================

                let receiverId;


                // If receiver is an object
                if (
                    typeof message.receiver ===
                    'object'
                ) {

                    receiverId =
                        message.receiver._id;

                }

                // If receiver is already a string
                else {

                    receiverId =
                        message.receiver;

                }


                if (!receiverId) {

                    console.log(
                        'Receiver ID not found'
                    );

                    return;

                }


                // ==================================
                // SEND TO RECEIVER ROOM
                // ==================================

                io.to(
                    receiverId
                ).emit(
                    'newMessage',
                    message
                );


                console.log(
                    `Message sent to room: ${receiverId}`
                );

            }
        );


        // ======================================
        // DISCONNECT
        // ======================================

        socket.on(
            'disconnect',
            () => {

                console.log(
                    'Socket disconnected:',
                    socket.id
                );

            }
        );

    }
);


// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;


server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);
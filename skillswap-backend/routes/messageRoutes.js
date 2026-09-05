const express = require('express');
const router = express.Router();

const Message = require('../models/Message');
const ConnectionRequest = require('../models/ConnectionRequest');


// ==========================================
// SEND MESSAGE
// ==========================================

router.post('/send', async (req, res) => {

    try {

        const {
            sender,
            receiver,
            text
        } = req.body;


        // Check required fields
        if (!sender || !receiver || !text) {

            return res.status(400).json({

                message:
                    'Sender, receiver and message are required'

            });

        }


        // Prevent sending message to yourself
        if (sender === receiver) {

            return res.status(400).json({

                message:
                    'You cannot send a message to yourself'

            });

        }


        // Check whether users are connected
        const connection =
            await ConnectionRequest.findOne({

                $or: [

                    {
                        sender: sender,
                        receiver: receiver,
                        status: 'accepted'
                    },

                    {
                        sender: receiver,
                        receiver: sender,
                        status: 'accepted'
                    }

                ]

            });


        if (!connection) {

            return res.status(403).json({

                message:
                    'You can only message connected users'

            });

        }


        // Create message
        const message =
            new Message({

                sender,
                receiver,
                text

            });


        await message.save();


        // Return message
        const savedMessage =
            await Message.findById(
                message._id
            )
            .populate(
                'sender',
                'name email'
            )
            .populate(
                'receiver',
                'name email'
            );


        res.status(201).json({

            message:
                'Message sent successfully',

            data:
                savedMessage

        });


    } catch (error) {

        console.error(
            'SEND MESSAGE ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to send message',

            error:
                error.message

        });

    }

});



// ==========================================
// GET CONVERSATION
// ==========================================

router.get(
    '/conversation/:userId/:connectionId',
    async (req, res) => {

        try {

            const {
                userId,
                connectionId
            } = req.params;


            // Check whether users are connected
            const connection =
                await ConnectionRequest.findOne({

                    $or: [

                        {
                            sender: userId,
                            receiver: connectionId,
                            status: 'accepted'
                        },

                        {
                            sender: connectionId,
                            receiver: userId,
                            status: 'accepted'
                        }

                    ]

                });


            if (!connection) {

                return res.status(403).json({

                    message:
                        'You can only view conversations with connected users'

                });

            }


            // Get messages between both users
            const messages =
                await Message.find({

                    $or: [

                        {
                            sender: userId,
                            receiver: connectionId
                        },

                        {
                            sender: connectionId,
                            receiver: userId
                        }

                    ]

                })

                .sort({
                    createdAt: 1
                })

                .populate(
                    'sender',
                    'name email'
                )

                .populate(
                    'receiver',
                    'name email'
                );


            res.json(messages);


        } catch (error) {

            console.error(
                'GET CONVERSATION ERROR:',
                error
            );


            res.status(500).json({

                message:
                    'Failed to load conversation',

                error:
                    error.message

            });

        }

    }
);


module.exports = router;
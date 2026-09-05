const express = require('express');
const router = express.Router();

const ConnectionRequest = require('../models/ConnectionRequest');


// ==========================================
// SEND CONNECTION REQUEST
// ==========================================

router.post('/send', async (req, res) => {

    try {

        const {
            sender,
            receiver,
            skill
        } = req.body;


        // Check required fields
        if (!sender || !receiver || !skill) {

            return res.status(400).json({
                message:
                    'Sender, receiver and skill are required'
            });

        }


        // Prevent self request
        if (sender === receiver) {

            return res.status(400).json({
                message:
                    'You cannot send a connection request to yourself'
            });

        }


        // Check if a request already exists
        const existingRequest =
            await ConnectionRequest.findOne({

                $or: [

                    {
                        sender: sender,
                        receiver: receiver
                    },

                    {
                        sender: receiver,
                        receiver: sender
                    }

                ]

            });


        // If an existing request is found
        if (existingRequest) {


            // Already connected
            if (
                existingRequest.status === 'accepted'
            ) {

                return res.status(400).json({
                    message:
                        'You are already connected with this user'
                });

            }


            // Pending request
            if (
                existingRequest.status === 'pending'
            ) {

                return res.status(400).json({
                    message:
                        'Connection request already exists'
                });

            }


            // Rejected request
            // Allow a new request
            if (
                existingRequest.status === 'rejected'
            ) {

                existingRequest.sender = sender;

                existingRequest.receiver = receiver;

                existingRequest.skill = skill;

                existingRequest.status = 'pending';

                await existingRequest.save();


                return res.status(201).json({

                    message:
                        'Connection request sent successfully',

                    request:
                        existingRequest

                });

            }

        }


        // Create new request
        const request =
            new ConnectionRequest({

                sender,

                receiver,

                skill,

                status: 'pending'

            });


        await request.save();


        res.status(201).json({

            message:
                'Connection request sent successfully',

            request

        });


    } catch (error) {

        console.error(
            'SEND REQUEST ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to send connection request',

            error:
                error.message

        });

    }

});



// ==========================================
// GET RECEIVED REQUESTS
// ==========================================

router.get('/received/:userId', async (req, res) => {

    try {

        const requests =
            await ConnectionRequest

                .find({
                    receiver:
                        req.params.userId
                })

                .populate(
                    'sender',
                    'name email teachSkills'
                );


        res.json(requests);


    } catch (error) {

        console.error(
            'GET REQUESTS ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to load requests',

            error:
                error.message

        });

    }

});



// ==========================================
// GET SENT REQUESTS
// ==========================================

router.get('/sent/:userId', async (req, res) => {

    try {

        const requests =
            await ConnectionRequest

                .find({
                    sender:
                        req.params.userId
                })

                .populate(
                    'receiver',
                    'name email teachSkills'
                );


        res.json(requests);


    } catch (error) {

        console.error(
            'GET SENT REQUESTS ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to load sent requests',

            error:
                error.message

        });

    }

});



// ==========================================
// ACCEPT REQUEST
// ==========================================

router.put('/accept/:id', async (req, res) => {

    try {

        const request =
            await ConnectionRequest.findByIdAndUpdate(

                req.params.id,

                {
                    status:
                        'accepted'
                },

                {
                    returnDocument:
                        'after'
                }

            );


        if (!request) {

            return res.status(404).json({

                message:
                    'Request not found'

            });

        }


        res.json({

            message:
                'Connection request accepted',

            request

        });


    } catch (error) {

        console.error(
            'ACCEPT REQUEST ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to accept request',

            error:
                error.message

        });

    }

});



// ==========================================
// REJECT REQUEST
// ==========================================

router.put('/reject/:id', async (req, res) => {

    try {

        const request =
            await ConnectionRequest.findByIdAndUpdate(

                req.params.id,

                {
                    status:
                        'rejected'
                },

                {
                    returnDocument:
                        'after'
                }

            );


        if (!request) {

            return res.status(404).json({

                message:
                    'Request not found'

            });

        }


        res.json({

            message:
                'Connection request rejected',

            request

        });


    } catch (error) {

        console.error(
            'REJECT REQUEST ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to reject request',

            error:
                error.message

        });

    }

});



// ==========================================
// GET ACCEPTED CONNECTIONS
// ==========================================

router.get('/accepted/:userId', async (req, res) => {

    try {

        const userId =
            req.params.userId;


        const requests =
            await ConnectionRequest

                .find({

                    $or: [

                        {
                            sender: userId,
                            status: 'accepted'
                        },

                        {
                            receiver: userId,
                            status: 'accepted'
                        }

                    ]

                })

                .populate(
                    'sender',
                    'name email teachSkills'
                )

                .populate(
                    'receiver',
                    'name email teachSkills'
                );


        const connections =
            requests.map(
                request => {

                    if (

                        request.sender._id.toString()
                        ===
                        userId

                    ) {

                        return request.receiver;

                    }


                    return request.sender;

                }
            );


        res.json(connections);


    } catch (error) {

        console.error(
            'GET CONNECTIONS ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to load connections',

            error:
                error.message

        });

    }

});



// ==========================================
// REMOVE CONNECTION
// ==========================================

router.delete('/remove', async (req, res) => {

    try {

        const {
            userId,
            connectionId
        } = req.body;


        const deleted =
            await ConnectionRequest.findOneAndDelete({

                status:
                    'accepted',

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

            });


        if (!deleted) {

            return res.status(404).json({

                message:
                    'Connection not found'

            });

        }


        res.json({

            message:
                'Connection removed successfully'

        });


    } catch (error) {

        console.error(
            'REMOVE CONNECTION ERROR:',
            error
        );


        res.status(500).json({

            message:
                'Failed to remove connection',

            error:
                error.message

        });

    }

});


module.exports = router;
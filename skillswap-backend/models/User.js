const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            default: ''
        },

        location: {
            type: String,
            default: ''
        },

        bio: {
            type: String,
            default: ''
        },

        education: {
            college: {
                type: String,
                default: ''
            },

            degree: {
                type: String,
                default: ''
            },

            year: {
                type: String,
                default: ''
            },

            specialization: {
                type: String,
                default: ''
            }
        },

        teachSkills: {
            type: [String],
            default: []
        },

        learnSkills: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose')


const PublicacionesSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        author: {
            type: mongoose.Types.ObjectId
        },
        categories: {
            type: Array,
            default: []
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

const Publicaciones = new mongoose.model('publicaciones', PublicacionesSchema)

module.exports = { Publicaciones }
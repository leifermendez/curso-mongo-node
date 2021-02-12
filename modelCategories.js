
const mongoose = require('mongoose')

const CategoriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)


const Categories = new mongoose.model('categories', CategoriesSchema)

module.exports = { Categories }
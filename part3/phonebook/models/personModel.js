const mongoose = require('mongoose')
require('dotenv').config({
	path: './.env'
})

mongoose.set('strictQuery', false)

async function connect () {
	try {
		await mongoose.connect(process.env.MONGODB_URI).then(() => {
			console.log('connected to MongoDB')
		})
	} catch (error) {
		console.log(error)
	}
}

connect()

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		validate: {
			validator: function (v) {
				return /^\d{2,3}-\d{7,}/.test(v)
			},
			message: props => `${props.value} is not a valid phone number!`
		},
		minLength: 8,
		required: true
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)

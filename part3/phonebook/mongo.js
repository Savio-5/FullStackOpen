const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 4) {
	mongoose.connect(`mongodb+srv://Savio:${process.argv[2]}@cluster0.zcmmhf7.mongodb.net/?retryWrites=true&w=majority`)

	const person = new Person({
		name: process.argv[3],
		number: process.argv[4]
	})

	try {
		person.save().then(result => {
			if (result) {
				console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
			}
			mongoose.connection.close()
		})
	} catch (error) {
		console.log(error)
	}
}

// eslint-disable-next-line eqeqeq
if (process.argv.length == 3) {
	mongoose.connect(`mongodb+srv://Savio:${process.argv[2]}@cluster0.zcmmhf7.mongodb.net/?retryWrites=true&w=majority`)

	try {
		Person.find({}).then(result => {
			console.log('phonebook:')
			result.forEach(person => {
				console.log(person.name + ' ' + person.number)
			})
			mongoose.connection.close()
		})
	} catch (error) {
		console.log(error)
	}
}

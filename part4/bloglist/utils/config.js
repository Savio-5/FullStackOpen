/* eslint-disable no-undef */
require('dotenv').config({
	path: '../.env'
})

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

module.exports = {
	PORT,
	MONGODB_URL
}
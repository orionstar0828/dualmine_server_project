const fastifyPlugin = require('fastify-plugin')
const fastifyMongodb = require('@fastify/mongodb')

const dbConnector = async (fastify, options) => {
    fastify.register(fastifyMongodb, {
        forceClose: true,
        url: "mongodb+srv://orion:orion123!@#@cluster0.gtyrzh5.mongodb.net/test_database"
    })    
}

module.exports = fastifyPlugin(dbConnector)
const fastifyPlugin = require('fastify-plugin')

const corsPlugin = async (fastify, opts, done) => {
    fastify.register(require("fastify-cors"), {
        origin: "*",
        methods: ["POST"]
    });
}

module.exports = fastifyPlugin(corsPlugin)
const Fastify = require("fastify");
const userRoute = require("./userRoute");
const dbConnector = require("./dbConnector");
const jwtPlugin = require("./jwtPlugin");
const corsPlugin = require("./corsPlugin");

const fastify = Fastify({
    logger: true,
});

fastify.get("/", async (request, reply) => {
    reply.send({ hello: "PDS" });
});
fastify.register(dbConnector);

fastify.register(corsPlugin);

fastify.register(jwtPlugin);

fastify.register(userRoute);

const start = async () => {
    try {
        await fastify.listen(process.env.PORT || 3000);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();

const moment = require('moment')
module.exports = routes = async (fastify, options) => {

    const collection = fastify.mongo.db.collection("users")
    const transcollection = fastify.mongo.db.collection("transactions")

    fastify.get('/user/all', async (request, reply) => {
        const result = await collection.find({}).toArray()
        if (result.length == 0) {
            throw new Error('No documents found')
        }
        return result
    })

    fastify.get('/user/:id', async (request, reply) => {
        const { id } = request.params;
        const result = await collection.findOne({ id: id })
        if (!result) {
            throw new Error('Invalid value')
        }
        return result
    })

    const userBodyJsonSchema = {
        type: "object",
        required: ['email', 'password'],
        properties: {
            firstname: { type: "string" },
            lastname: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" }
        },
    }

    const schema = {
        body: userBodyJsonSchema
    }

    fastify.post('/sign-up', { schema }, async (request, reply) => {

        const { firstname, lastname, username, email, password } = request.body

        const oldOne = await collection.findOne({ email: email })
        if (oldOne) {
            throw new Error('Signup-Error: account already exists')
        }

        const result = await collection.insertOne({ firstname, lastname, username, email, password })
        const token = fastify.jwt.sign({ "name": email })
        return reply.send({ token });
    })


    fastify.post('/sign-in', { schema }, async (request, reply) => {

        const { email, password } = request.body

        const result = await collection.findOne({ email: email })
        if (!result) {
            throw new Error("ERROR-Login: No user with that credential found!")

        }
        console.log(result);
        if (result.password != password) {
            throw new Error("ERROR-Login: Password not matched!")
        }
        const token = fastify.jwt.sign({ "email": email, "username": result.username })
        reply.send({ token })
    })

    fastify.post('/verify-token', async (request, reply) => {

        try {
            await request.jwtVerify()
            reply.send({ login: "success" })

        } catch (err) {
            throw new Error('Error: Invalid Authentication Token')
        }

    })

    fastify.post('/user/create-order', async (request, reply) => {

        const { email, payType, payAmount } = request.body;
   
        const user = await collection.findOne({ email: email })

        if (!user) {
            throw new Error('Invalid value')
        }

        const result = await transcollection.insertOne({user_id: user._id, payType, payAmount, confirmed: false, active: false, created_at: moment().format('YYYY-MM-D h:mm'), confirmed_at: null, status: true})

        if (!result) {
            throw new Error('Invalid value')
        }

        return reply.send({ ordered: "success", id: result.insertedId })
    })

    fastify.get('/transaction/:id', async (request, reply) => {
        const { id } = request.params;
        const result = await transcollection.findOne({ id: id })

        if (!result) {
            throw new Error('Invalid value')
        }
        return result
    })

}
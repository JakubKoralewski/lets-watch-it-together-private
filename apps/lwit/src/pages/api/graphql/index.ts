import "reflect-metadata"
import { ApolloServer } from 'apollo-server-micro'
import { resolvers } from '../../../../prisma/generated/typegraphql-prisma'
import { buildSchemaSync } from 'type-graphql'
import prisma from 'lib/prisma/prisma'

const schema = buildSchemaSync({
	resolvers,
	validate: false
})

const apolloServer = new ApolloServer({
	resolvers,
	schema,
	tracing: process.env.NODE_ENV === 'development',
	context: () => ({prisma})
})


export const config = {
	api: {
		bodyParser: false
	}
}

export default apolloServer.createHandler({ path: '/api/graphql' })

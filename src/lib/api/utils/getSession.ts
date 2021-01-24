import { Session } from 'next-auth'
import {getToken} from 'next-auth/jwt'
import { createLogger, LoggerTypes } from '../../logger'
import { NextApiRequest } from 'next'

/** NextAuth's client with the added user's id. */
export type SessionWithId = Session & { user: { id: number } }

const loggerWithoutCallsiteInfo = createLogger(
	LoggerTypes.GetSession,
	false
)
const loggerWithCallsiteInfo = createLogger(
	LoggerTypes.GetSession,
	true
)

/**
 * Server code.
 */
export async function getSession(
	// param?: Parameters<(typeof getSessionNextAuth)>[0]
	param?: { req: NextApiRequest }
): Promise<SessionWithId> {
	// const gotSession =
	// 	await getSessionNextAuth(param) as any as Promise<SessionWithId>
	const gotToken = await getToken(
		{
			req: param.req,
			secret: process.env.SECRET
		}
	)
	if (gotToken) {
		loggerWithoutCallsiteInfo.debug({
			msg: `got token`,
			gotToken
		})
	} else {
		loggerWithCallsiteInfo.debug({
			msg: `no token found`,
			param,
			gotToken
		})
	}
	return {user: gotToken} as SessionWithId
}

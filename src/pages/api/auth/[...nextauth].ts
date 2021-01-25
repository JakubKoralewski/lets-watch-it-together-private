import type { NextApiHandler } from 'next'
import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import prisma from 'lib/prisma/prisma'
import { createLogger, LoggerTypes } from '../../../lib/logger'
import { ErrorInLibWithLogging, LibErrorType } from '../../../lib/logger/libLogger'
import { users as seededUsers } from '../../../../prisma/seeding/initiateDb'
import { mapUserToKnownFriend } from '../../../lib/api/users/UserDetails'

const authHandler: NextApiHandler = (req, res) =>
	NextAuth(req, res, options)
export default authHandler

export enum NextAuthErrorType {
	NO_GITHUB_ID,
	NO_GITHUB_SECRET
}

export class NextAuthError extends ErrorInLibWithLogging<NextAuthErrorType> {
	constructor(
		public nextAuthErrorType: NextAuthErrorType,
		public mapMessage?: string,
		public parentError?: Error
	) {
		super(
			{
				libErrorType: LibErrorType.NextAuth,
				innerEnum: NextAuthErrorType,
				innerErrorEnumValue: nextAuthErrorType,
				libErrorMessage: mapMessage,
				parentError
			}
		)
	}
}

/* Set up loggers */
const loggerWithoutCallsiteInfo = createLogger(
	LoggerTypes.NextAuth,
	false
)
const loggerWithCallsiteInfo = createLogger(
	LoggerTypes.NextAuth,
	true
)
/** We only use GitHub login in prod and testing. */
const IS_A_REVIEW_APP = process.env.HEROKU_PR_NUMBER !== undefined

if (!IS_A_REVIEW_APP) {
	/* Throw errors when missing environment variables */
	if (!process.env.GITHUB_ID) {
		throw new NextAuthError(
			NextAuthErrorType.NO_GITHUB_ID
		)
	}
	if (!process.env.GITHUB_SECRET) {
		throw new NextAuthError(
			NextAuthErrorType.NO_GITHUB_SECRET
		)
	}
}
if (!process.env.SECRET) {
	loggerWithCallsiteInfo.warn({
		msg: '"SECRET" environment variable should be set'
	})
}
const providers = (!IS_A_REVIEW_APP ? [
	Providers.GitHub({
		clientId: process.env.GITHUB_ID,
		clientSecret: process.env.GITHUB_SECRET,
		scope: 'user:email read:user'
	})
] : []).concat(
	/*
	 *  We set up credentials for testing and review apps
	 *  NOTE: This is only OK, because
	 *  [`NODE_ENV` by default is set on Heroku to `production`](https://devcenter.heroku.com/changelog-items/688)
	 */
	(process.env.NODE_ENV === 'development' || IS_A_REVIEW_APP) ? [
		Providers.Credentials({
			name: 'Test users',
			credentials: {
				username: {
					label: 'Username',
					type: 'text',
					placeholder: 'Guest1'
				}
			},
			/** Checks credentials are OK.
			 *  We don't check for actual passwords for these test users
			 *  as they should only be available in testing and review
			 *  apps anyway.
			 */
			authorize: async credentials => {
				loggerWithoutCallsiteInfo.debug({
					msg: `callbacks/authorize`,
					credentials
				})
				if (credentials.username) {
					const findUser = async (email: string) => {
						const foundUser = await prisma.user.findUnique({
							where: {
								email
							}
						})
						if (!foundUser) {
							loggerWithCallsiteInfo.warn({
								msg: `callbacks/authorize user not found`,
								credentials,
								email,
								foundUser
							})
							return null
						} else {
							const rv = mapUserToKnownFriend(
								foundUser
							)
							loggerWithoutCallsiteInfo.debug({
								msg: `callbacks/authorize user found`,
								credentials,
								email,
								foundUser,
								rv
							})
							return rv
						}
					}
					switch (credentials.username.toLowerCase().trim()) {
						// my old friend
						case seededUsers[0].name.toLowerCase():
						case 'guest1': {
							return Promise.resolve(
								findUser(seededUsers[0].email)
							)
						}
						// my sweetest friend
						case seededUsers[1].name.toLowerCase():
						case 'guest2': {
							return Promise.resolve(
								findUser(seededUsers[1].email)
							)
						}
						default: {
							loggerWithCallsiteInfo.warn({
								msg: `callbacks/authorize bad username`,
								credentials
							})
							return Promise.resolve(null)
						}
					}
				} else {
					loggerWithCallsiteInfo.warn({
						msg: `callbacks/authorize no username`,
						credentials
					})
					return Promise.resolve(null)
				}
			}
		})
	] : [])

loggerWithoutCallsiteInfo.debug({
	msg: 'chosenProviders',
	providers
})


const options: InitOptions = {
	providers,
	/** JWTs need to be enabled for credentials to work. */
	session: {
		// https://stackoverflow.com/questions/64587059/how-to-implement-credentials-authorization-in-next-js-with-next-auth
		jwt: true,
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	callbacks: {
		/** We need to pass on the info from the token to the session. */
		session: async (session, token) => {
			loggerWithoutCallsiteInfo.debug({
				msg: 'callbacks/session',
				params: {
					session,
					token
				}
			})
			;(session.user as Record<string, unknown>) =
				{
					...session.user,
					id: (token as Record<string, unknown>)['id'],
					image: token.image
				}

			return Promise.resolve(session)
		},
		/** We need to explicitly store stuff in the token.
		 *  Then in the `session` callback do we actually
		 *  pass that onto the session.
		 *
		 *  NOTE: Whatever we pass here, the user will have access to!
		 *        I don't know why we need to explicitly pass it onto
		 *        the session because of this, but w/e.
		 *
		 *  NOTE: Giving the user their own OAuth etc. isn't unsafe.
		 *        But be careful about it anyway.
		 */
		jwt: async (
			token,
			user,
			account,
			profile,
			isNewUser
		) => {
			loggerWithoutCallsiteInfo.debug({
				msg: 'callbacks/jwt',
				params: {
					token,
					user,
					account,
					profile,
					isNewUser
				}
			})
			const isSignIn = !!user
			if (isSignIn || isNewUser) {
				token.id = (user as Record<string, unknown>)['id']
				token.name = profile.name || user.name
				token.image = profile.avatar_url || user.image
				token.email = profile.email || user.email
			}
			return Promise.resolve(token)
		},
		/**
		 * @param  {string} url      URL provided as callback URL by the client
		 * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
		 * @return {string}          URL the client will be redirect to
		 */
		redirect: async (url, baseUrl) => {
			const rv = url.startsWith(baseUrl)
				? Promise.resolve(url)
				: Promise.resolve(baseUrl + url)
			loggerWithoutCallsiteInfo.debug(
				{
					msg: 'callbacks/redirect',
					url,
					baseUrl,
					rv
				}
			)
			return rv
		}
	},
	events: {
		signIn: async (message) => {
			/* on successful sign in */
			loggerWithoutCallsiteInfo.debug({
				msg: 'events/signIn',
				m: message
			})
		},
		signOut: async (message) => {
			loggerWithoutCallsiteInfo.debug({
				msg: 'events/signOut',
				m: message
			})
			/* on signout */
		},
		createUser: async (message) => {
			/* user created */
			loggerWithoutCallsiteInfo.debug({
				msg: 'events/createUser',
				m: message
			})
		},
		linkAccount: async (message) => {
			/* account linked to a user */
			loggerWithoutCallsiteInfo.debug({
				msg: 'events/linkAccount',
				m: message
			})
		},
		session: async (message) => {
			/* session is active */
			loggerWithoutCallsiteInfo.trace({
				msg: 'events/session',
				m: message
			})
		},
		error: async (message) => {
			/* error in authentication flow */
			loggerWithCallsiteInfo.error({
				msg: 'events/error',
				m: message
			})
		}
	},
	pages: {
		newUser: '/app/welcome'
	},
	adapter: Adapters.Prisma.Adapter({ prisma }),
	secret: process.env.SECRET
}

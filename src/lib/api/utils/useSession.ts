import { useSession as useSessionNextAuth } from 'next-auth/client'
import { SessionWithId } from './getSession'

/**
 * Client code.
 * Had to be moved from `getSession.ts` because by importing `useSession`
 * from `getSession.ts` imports `next-auth/jwt` which throws an error,
 * because `next-auth/jwt` is server-only.
 */
export function useSession():
	[SessionWithId | null | undefined, boolean] {
	const [session, loading] =
		useSessionNextAuth() as any as [SessionWithId | null | undefined, boolean]
	return [session, loading]
}

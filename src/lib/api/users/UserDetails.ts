import {  UserPublicSearchResult } from './UserPublic'
import { User } from '@prisma/client'
import { MeetingFriendResult } from '../meetings/MeetingFriendResult'
import { StrippedShowDetails } from '../shows/[id]/StrippedShowDetails'

/**
 *  We omit status because we know they're a friend already
 *  from context.
 *
 *  @see UserPublicSearchResult
 */
export type Friend = Omit<UserPublicSearchResult, 'status'>

/**
 *  @see mapUserToKnownFriend
 *  @see Friend
 *  @see UserPublicSearchResult
 *  @see MeetingFriendResult
 *  @see StrippedShowDetails
 */
export type UserDetails = UserPublicSearchResult & {
	friends: Friend[],
	meetings: MeetingFriendResult[],
	liked: StrippedShowDetails[],
	/** iso date */
	registeredAt: string,
	/** iso date */
	friendsAt: string
}

/**
 *  Here we make the choice of what is exposed to a
 *  user's friend.
 *
 *  NOTE: Assuming we correctly use this function wherever
 *        we expose this information!
 *
 *  Example:
 *    - `/api/users/[id]`
 *
 *  @see UserDetails
 *  @see Friend
 */
export function mapUserToKnownFriend(user: User): Friend {
	return {
		id: user.id,
		name: user.name,
		image: user.image,
	}
}

import useSWR from "swr"
import type {User} from "@prisma/client"
import { getFetcher } from '../../utils/useSwrUtils'
import type { UseEntityReturnType } from '../../utils/useSwrUtils'
import type { UserDetails } from '../UserDetails'

export function useUser (id: User['id']):
	UseEntityReturnType<'user', UserDetails>
{
	const { data, error } = useSWR<UserDetails>(`/api/users/${id}`, getFetcher)
	return {
		user: data,
		isLoading: !error && !data,
		error: error
	}
}
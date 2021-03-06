import { privateIdToPrismaIdTypeMap, TmdbIdType } from 'lib/tmdb/api/id'
import type { TmdbId } from 'lib/tmdb/api/id'
import prisma from 'lib/prisma/prisma'
import type { MediaLike } from '@prisma/client'
import type { Movie } from '../../../tmdb/api/objects/movie'
import type { TvShow } from '../../../tmdb/api/objects/tv_show'
import type { TvShowDetails } from '../../../tmdb/api/objects/tv_show_details'
import type { StrippedShowDetails } from './StrippedShowDetails'
import { ErrorInLibWithLogging, LibErrorType } from '../../../logger/libLogger'
import { createLogger, LoggerTypes } from '../../../logger'


export enum IsShowLikedErrorType {
	Other,
	NotFound,
	NotAShowOrMovie,
	UserIdDoesntExist
}

export class IsShowLikedError extends
	ErrorInLibWithLogging<IsShowLikedErrorType>
{
	constructor(
		public errorType: IsShowLikedErrorType,
		public mapMessage?: string,
		public parentError?: Error
	) {
		super(
			{
				libErrorType: LibErrorType.IsShowLiked,
				libErrorMessage: mapMessage,
				innerErrorEnumValue: errorType,
				innerEnum: IsShowLikedErrorType,
				parentError
			}
		)
	}
}

export function isIsShowLikedError(err: unknown):
	err is IsShowLikedError {
	return err instanceof IsShowLikedError
}

// type ShowOrMovieTmdbId =
// 	(ObjectsWithTmdbIds & { id: { type: TmdbIdType.Show | TmdbIdType.Movie } })
type ShowOrMovieTmdbId =
	Omit<Movie, 'id'> & { id: TmdbId & { type: TmdbIdType.Movie } } |
	Omit<TvShow, 'id'> & { id: TmdbId & { type: TmdbIdType.Show } } |
	Omit<TvShowDetails, 'id'> & { id: TmdbId & { type: TmdbIdType.Show } } |
	Omit<Omit<StrippedShowDetails, 'liked'>, 'id'> & { id: TmdbId & { type: TmdbIdType.Show } }

// type testType = Collection & {id: {type: TmdbIdType.Collection, id: 0}} extends ShowOrMovieTmdbId ? true : never
// type testType = Movie & {id: {type: TmdbIdType.Movie, id: 0}} extends ShowOrMovieTmdbId ? true : never

export function mapShowLiked<
	T extends (ShowOrMovieTmdbId & Record<string, unknown>)
>(
	userId: number
): (media: T) => Promise<T & { liked: boolean }> {
	return (media) => mapShowLikedInner(media, userId)
}
const logger = createLogger(LoggerTypes.IsShowLiked)

async function mapShowLikedInner<T extends ShowOrMovieTmdbId>(
	media: T,
	userId: number
): Promise<T & { liked: boolean }> {
	// TODO: maybe use types in a better way
	(media as Record<string, unknown>)['liked'] = await isShowLiked(media.id, userId)
	return media as (T & { liked: boolean })
}

export async function isShowLiked(
	tmdbId: TmdbId & { type: TmdbIdType.Show | TmdbIdType.Movie },
	userId: number
): Promise<boolean> {
	if (
		tmdbId.type !== TmdbIdType.Show &&
		tmdbId.type !== TmdbIdType.Movie
	) {
		throw new IsShowLikedError(
			IsShowLikedErrorType.NotAShowOrMovie,
			`can only check if tv show or movie is liked` +
			`${JSON.stringify(tmdbId)}`
		)
	}
	const prismaMediaType = privateIdToPrismaIdTypeMap[tmdbId.type]
	let response: { liked: MediaLike[] } | null
	try {
		response = await prisma.user.findUnique(
			{
				where: {
					id: userId
				},
				select: {
					liked: {
						where: {
							tmdbId: tmdbId.id,
							type: prismaMediaType
						}
					}
				}
			}
		)
	} catch (e) {
		throw new IsShowLikedError(
			// eslint-disable-next-line no-mixed-spaces-and-tabs
			IsShowLikedErrorType.Other,
			'error getting liked show',
			e
		)
	}
	if (!response) {
		throw new IsShowLikedError(
			IsShowLikedErrorType.UserIdDoesntExist
		)
	}
	logger.info({
		isShowLiked: {
			response
		}
	})
	return response.liked.length > 0
}

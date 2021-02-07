/* eslint-disable camelcase */
import type { TmdbCollectionId } from '../id'

export interface Collection {
	id: TmdbCollectionId;
	backdrop_path: string;
	name: string;
	poster_path: string;
}

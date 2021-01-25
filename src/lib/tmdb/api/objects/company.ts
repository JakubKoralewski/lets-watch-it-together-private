/* eslint-disable camelcase */
import type { TmdbCompanyId } from '../id'

export interface Company {
	id: TmdbCompanyId;
	logo_path: string;
	name: string;
}

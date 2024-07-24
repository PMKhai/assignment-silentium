import Endpoints from '@/services/endpoint.api';
import { StoryType } from '@/types/schemas';
import { instance } from '@/services/instance';

export default async (types: StoryType) => {
	const response = await instance
		.get(`${Endpoints.STORIES.replace(':type', types)}`)
		.json();
	return response as number[];
};

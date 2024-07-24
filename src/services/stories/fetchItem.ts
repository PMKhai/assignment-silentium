import Endpoints from '@/services/endpoint.api';
import { instance } from '@/services/instance';
import { Post } from '@/types/schemas';

export default async (id: number) => {
	const response = await instance
		.get(`${Endpoints.ITEM.replace(':id', id.toString())}`)
		.json();
	return response as Post;
};

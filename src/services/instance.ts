import ky from 'ky';

const prefixUrl =
	process?.env && `${process.env.API_URL ? process.env.API_URL : ''}/`;

export const instance = ky.extend({
	prefixUrl,
	headers: {
		Accept: 'application/json',
	},
});

const year_in_millis = 1000 * 60 * 60 * 24 * 365;

export const UserHelper = {
	is18: (user) => ((Date.now() - (user.birthdate || 0)) / year_in_millis) >= 18
}


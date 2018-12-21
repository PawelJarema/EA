const name = (user) => `${user.firstname || ''} ${user.lastname || (user.firstname ? '' : 'Anonim')}`.trim();

const NameHelper = {
	name,
	covername: (user) => name(user).replace(/[a-zęółśążźćń]/g, '')
};

export default NameHelper;
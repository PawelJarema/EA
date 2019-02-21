const name = (user) => `${user.firstname || ''} ${user.lastname || (user.firstname ? '' : 'Anonim')}`.trim();

const NameHelper = {
	name,
	covername: (user) => ((user.firstname ? user.firstname.slice(0, 1) : '') + ' ' + (user.lastname ? user.lastname.slice(0, 1) : '').trim() || 'Anonim')
};

export default NameHelper;
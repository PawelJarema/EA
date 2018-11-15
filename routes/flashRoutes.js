module.exports = app => {
    app.get('/api/flash_message', (req, res) => {
        const session = req.session;
        
        const message = session.message;
        const error = session.error;
        
        req.session.message = null;
        req.session.error = null;
        
        if (typeof error === 'object' || typeof message === 'object') {
        	res.send({});
        }
        else {
        	const res_object = (error ? { type: 'error', message: error } : message ? { type: 'ok', message: message } : null);
        	res.send(res_object);
    	}
    });
};
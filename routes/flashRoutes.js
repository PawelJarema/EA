module.exports = app => {
    app.get('/api/flash_message', (req, res) => {
        const session = req.session;
        
        const message = session.message;
        const error = session.error;
        
        req.session.message = null;
        req.session.error = null;
        
        res.send((error ? { type: 'error', message: error } : message ? { type: 'ok', message: message } : null));
    });
};
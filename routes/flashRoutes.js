module.exports = app => {
    app.get('/api/flash_message', (req, res) => {
        const session = req.session;
        
        const message = session.message ? session.message.slice() : null;
        const error = session.error ? session.error.slice() : null;
        
        req.session.message = null;
        req.session.error = null;
        
        res.send((error ? { type: 'error', message: error } : message ? { type: 'ok', message: message } : null));
    });
};
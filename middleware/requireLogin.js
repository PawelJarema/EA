module.exports = (req, res, next) => {
    if (!req.user) {
        req.session.message = 'Użytkownik powinien być zalogowany aby wykonać tą akcję';
        res.redirect('/konto/zaloguj');
    }
    
    next();
};
module.exports = (req, res, next) => {
    if (!req.user) {
        req.session.message = 'Użytkownik powinien być zalogowany, aby wykonać tę akcję';
        res.status(401).redirect('/konto/zaloguj');
    } else {
      next();
    }
};

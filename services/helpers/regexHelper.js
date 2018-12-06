module.exports = {
    email: /.+@.+\.\w{2,}/i,
    phone: /\d{7,}/,
    pesel: /\d{11}/,
    password: /.{8,}/,
    account: /((\d{2}){1}(\s\d{4}){6})|(\d{26})/
};
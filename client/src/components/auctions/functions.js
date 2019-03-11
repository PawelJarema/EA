function userName(user) {
    return `${user.firstname} ${user.lastname}`.trim() || 'Anonim';
}

function applyToAuctions(funct) {
    const auctions = document.querySelectorAll('.AuctionList .auction');
    for (let i = 0; i < auctions.length; i++) {
        funct(auctions[i]);
    }
}

function auctionPath(auction) {
    if (!auction || !auction.title) return '/';

    const title = 
        auction.title.toLowerCase()
        .replace(/[żź]/g, 'z')
        .replace(/ć/g, 'c')
        .replace(/ń/g, 'n')
        .replace(/ę/g, 'e')
        .replace(/ą/g, 'a')
        .replace(/ś/g, 's')
        .replace(/ł/g, 'l')
        .replace(/ć/g, 'c')
        .replace(/ó/g, 'o')
        .replace(/[^a-zA-Z\d\s:]/g, '')
        .split(/\s/).join('-')
        .replace(/-{2,}/, '-');
        
    return `/aukcje/${title}/${auction._id}`;
}

function getUnits(name) {
    switch(name) {
        case 'Cena':
            return 'zł';
        case 'Moc':
        case 'Moc silnika':
            return 'KM';
        case 'Powierzchnia':
        case 'Powierzchnia działki':
            return 'm²';
        case 'Pojemność silnika':
            return 'cm³';
        case 'Przebieg':
            return 'km';
    }
}

function isSet(number) {
  if (typeof number === 'number' && number >= 0) return true;
  return false;
}

function isNotEmpty(object) {
  if (Object.prototype.toString.call(object) === '[object Array]') {
    return object.length > 0;
  }

  return Boolean(object);
}

function isEmpty(object) {
    return !isNotEmpty(object);
}

function isIn(value, array) {
    const arr = array.map(val => String(val));
    return arr.indexOf(String(value)) !== -1;
}

function isBidder(user, auction) {
    if (!user || !auction) return false;

    const id = user._id;

    return isIn(id, auction.buynowpayees) || isIn(id, auction.payees) || isIn(id, auction.bids.map(bid => bid._user));
}

function pluralize(num, arr) {
    if (num < 0) return '';
    if (num === 0) return `0 ${arr[2]}`;
    if (num === 1) return `${num} ${arr[0]}`;
    if (num > 1 && num < 5 || num > 21 && num % 10 > 1 && num % 10 < 5) return `${num} ${arr[1] }`;
    return `${num} ${arr[2] || arr[1]}`;
}

function concatUnique(arr1, arr2) {
    const 
        values = [],
        result = [],
        indexArrayValues = (item) => {
            let value = '';
            if (typeof item === 'object') {
                for (let key in item) {
                    if (!key.startsWith('_')) value += String(item[key]); // omijamy pola _id z unikatową wartością w rekordach Mongo
                }
            } else {
                value = String(item);
            }

            if (values.indexOf(value) === -1) {
                values.push(value);
                result.push(item);
            }
        };

    if (isNotEmpty(arr1)) arr1.map(indexArrayValues);
    if (isNotEmpty(arr2)) arr2.map(indexArrayValues);

    return result
}

export { userName, applyToAuctions, auctionPath, getUnits, isSet, isEmpty, isNotEmpty, isBidder, pluralize, concatUnique };
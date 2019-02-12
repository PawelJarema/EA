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

export { userName, applyToAuctions, auctionPath, getUnits };
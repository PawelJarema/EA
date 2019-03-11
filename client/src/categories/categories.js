const CarMakeToCarModelConditionalValues = {
    'Axiam': ['City', 'Crossline', 'Pozostałe'],
    'Alfa Romeo': ['33', '75', '145', '146', '147', '155', '156', '159', '164', '166', 'Brera', 'Crosswagon', 'Giulietta', 'GT', 'GTV', 'Mito', 'Spider', 'Sportwagon', 'Pozostałe Alfa Romeo'],
    'Audi': ['80', '90', '100', '200', 'A1', 'A2', 'A3', 'A4', 'A4 Allroad', 'A5', 'A6', 'A6 Allroad', 'A7', 'A8', 'Cabriolet', 'Coupe', 'Q5', 'Q7', 'Quattro', 'R8', 'Rs4', 'Rs6', 'S2', 'S3', 'S4', 'S5', 'S6', 'S8', 'TT', 'V8', 'Pozostałe Audi'],
    'BMW': ['M1', 'M3', 'M5', 'M6', 'Seria 1', 'Seria 2', 'Seria 3', 'Seria 4', 'Seria 5', 'Seria 6', 'Seria 7', 'X1', 'X3', 'X5', 'X5m', 'X6', 'X6m', 'Z3', 'Z4', 'Pozostałe BMW'],
    'Cadillac': ['Deville', 'Dts', 'Cts', 'Eldorado', 'Fleetwood', 'Pozostałe Cadillac'],
    'Chevrolet': ['Alero', 'Astro', 'Avalanche', 'Aveo', 'Blazer', 'Camaro', 'Captiva', 'Cavalier', 'Corvette', 'Cruze', 'Epica', 'Equinox', 'Evanda', 'Express', 'HHR', 'Kalos', 'Lacetti', 'Lumina', 'Malibu', 'Matiz', 'Nubira', 'Orlando', 'Rezzo', 'Silverado', 'Spark', 'Suburban', 'Tahoe', 'Trans Sport', 'Venture', 'Pozostałe Chevrolet'],
    'Chrysler': ['Concorde', 'Crossfire', 'Daytona', 'Grand Voyager', 'GS', 'Le Baron', 'Neon', 'New Yorker', 'Pacifica', 'PT Cruiser', 'Saratoga', 'Sebring', 'Stratus', 'Town & Country', 'Vision', 'Voyager', '300C', '300M', 'Aspen', 'Caravan', 'Pozostałe Chrysler'],
    'Citroen': ['AX', 'Berlingo', 'BX', 'C-Crosser', 'C1', 'C2', 'C3', 'C3 Picasso', 'C3 Pluriel', 'C4', 'C4 Picasso', 'C5', 'C6', 'C8', 'CX', 'DS', 'Evasion', 'GSA', 'Nemo', 'Saxo', 'Xantia', 'XM', 'Xsara', 'Xsara Picasso', 'ZX', 'Pozostałe Citroen'],
    'Dacia': ['Duster', 'Logan', 'Sandero', 'Sandero Stepway', 'Lodgy', 'Pozostałe Dacia'],
    'Daewoo': ['Espero', 'Kalos', 'Korando', 'Lanos', 'Leganza', 'Matiz', 'Musso', 'Nexia', 'Nubira', 'Rezzo', 'Tacuma', 'Tico', 'Pozostałe Daewoo'],
    'Daihatsu': ['Cuore', 'Sirion', 'Feroza', 'Terios', 'Pozostałe Daihatsu'],
    'Dodge': ['Caravan', 'Caliber', 'Grand Caravan', 'Ram', 'Durango', 'Nitro', 'Charger', 'Magnum', 'Stratus', 'Pozostałe Dodge'],
    'Fiat': ['126', '500', '600', '125p', 'Albea', 'Barchetta', 'Brava', 'Bravo', 'Cinquecento', 'Coupe', 'Courier', 'Croma', 'Doblo', 'Ducato', 'Fiorino', 'Freemont', 'Grande Punto', 'Idea', 'Linea', 'Marea', 'Multipla', 'Palio', 'Panda', 'Punto', 'Punto Evo', 'Qubo', 'Scudo', 'Sedici', 'Seicento', 'Siena', 'Spider Europa', 'Stilo', 'Strada', 'Tempra', 'Tipo', 'Ulysse', 'Uno', 'X 1/9', 'Pozostałe Fiat'],
    'Ford': ['Fiesta', 'Focus', 'Focus C-Max', 'Fusion', 'Galaxy', 'Granada', 'Gt', 'KA', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Orion', 'Probe', 'Puma', 'Ranger', 'S-Max', 'Scorpio', 'Sierra', 'Streetka', 'Taurus', 'Tourneo', 'Windstar', 'Aerostar', 'C-MAX', 'Capri', 'Contour', 'Cougar', 'Econoline', 'Escape', 'Escort', 'Explorer', 'F150', 'F250', 'F350', 'Pozostałe Ford'],
    'Honda': ['Accord', 'City', 'Civic', 'Concerto', 'CR-V', 'CRX', 'FR-V', 'HR-V', 'Insight', 'Integra', 'Jazz', 'Legend', 'Odyssey', 'Prelude', 'S 2000', 'Shuttle', 'Stream', 'Pozostałe Honda'],
    'Hyundai': ['Accent', 'Atos', 'Coupe', 'Elantra', 'Galloper', 'Getz', 'H200', 'I40', 'Lantra', 'Matrix', 'Pony', 'S-Coupe', 'Santa Fe', 'Santamo', 'Sonata', 'Sonica', 'Terracan', 'Trajet', 'Tucson', 'Veloster', 'Veracruz', 'XG', 'i10', 'i20', 'i30', 'ix20', 'ix35', 'ix55', 'Pozostałe Hyundai'],
    'Infiniti': ['FX', 'G', 'Q50', 'QX70', 'Pozostałe Infiniti'],
    'Jaguar': ['S-type', 'Xj', 'Xf', 'Xj6', 'Xj8', 'Xkr', 'Daimler', 'Xjr', 'Pozostałe Jaguar'],
    'Jeep': ['Cherokee', 'Commander', 'Grand Cherokee', 'Liberty', 'Wrangler', 'Pozostałe Jeep'],
    'Kia': ['Asia ', 'Rocsta', 'Carens', 'Carnival', 'Cee\'d', 'Cerato', 'Clarus', 'Joice', 'Magentis', 'Opirus', 'Optima', 'Picanto', 'Pregio', 'Pride', 'Pro Cee\'d', 'Retona', 'Rio', 'Sephia', 'Shuma', 'Sorento', 'Soul', 'Sportage', 'Venga', 'Pozostałe Kia'],
    'Lancia': ['Dedra', 'Delta', 'Kappa', 'Lybra', 'Musa', 'Phedra', 'Thema', 'Thesis', 'Ypsilon', 'Zeta', 'Pozostałe Lancia'],
    'Land Rover': ['Discovery', 'Freelander', 'Range Rover', 'Range Rover Sport', 'Pozostałe Land Rover'],
    'Lexus': ['gs300', 'rx400', 'is200', 'is250', 'gs450', 'rx350', 'is220', 'rx300', 'es300', 'Pozostałe Lexus'],
    'Mazda': ['2', '3', '5', '6', '121', '323', '626', '929', '323F', 'BT-50', 'CX-7', 'CX-9', 'Demio', 'Millenia', 'MPV', 'MX-3', 'MX-5', 'MX-6', 'Premacy', 'Protege', 'RX-7', 'RX-8', 'Seria B', 'Tribute', 'Xedos', 'Pozostałe Mazda'],
    'Mercedes-Benz': ['A Klasa', 'B Klasa', 'C Klasa', 'CL Klasa', 'CLK Klasa', 'CLS Klasa', 'Clc', 'E Klasa', 'G Klasa', 'GL Klasa', 'GLK Klasa', 'ML Klasa', 'R Klasa', 'S Klasa', 'SL Klasa', 'SLK Klasa', 'Seria 190', 'Seria 200', 'Seria 300', 'V klasa', 'Vaneo', 'Viano', 'Vito', 'W123', 'W124', 'Pozostałe Mercedes-Benz'],
    'Mini': ['Cooper', 'One', 'Cooper S', 'Pozostałe Mini'],
    'Mitsubishi': ['3000 GT', 'ASX', 'Carisma', 'Colt', 'Eclipse', 'Endeavor', 'Galant', 'Grandis', 'L200', 'L400', 'Lancer', 'Lancer Evolution IX', 'Lancer Evolution VII', 'Lancer Evolution VIII', 'Lancer Evolution X', 'Montero', 'Outlander', 'Pajero', 'Pajero Pinin', 'Sigma', 'Space Gear', 'Space Runner', 'Space Star', 'Space Wagon', 'Pozostałe Mitsubishi'],
    'Nissan': ['100 NX', '200 SX', '300 ZX', '350 Z', '370 Z', 'Almera', 'Almera Tino', 'Altima', 'Frontier', 'GT-R', 'Juke', 'King Cab', 'Maxima', 'Micra', 'Murano', 'NV200', 'Navara', 'New Micra', 'Note', 'Pathfinder', 'Patrol', 'Pickup', 'Pixo', 'Prairie', 'Primastar', 'Primera', 'Qashqai', 'Qashqai 2', 'Quest', 'Sentra', 'Serena', 'Skyline', 'Sunny', 'Terrano', 'Tiida', 'Trade', 'X-Trail', 'Pozostałe Nissan'],
    'Opel': ['Arena', 'Ascona', 'Astra', 'Calibra', 'Campo', 'Combo', 'Corsa', 'Frontera', 'GT', 'Insignia', 'Kadett', 'Manta', 'Meriva', 'Monterey', 'Movano', 'Omega', 'Rekord', 'Senator', 'Signum', 'Sintra', 'Tigra', 'Vectra', 'Vivaro', 'Zafira', 'Agila', 'Antara', 'Pozostałe Opel'],
    'Peugeot': ['106', '107', '205', '206', '207', '208', '301', '306', '307', '308', '309', '404', '405', '406', '407', '508', '605', '607', '806', '807', '1007', '3008', '4007', '5008', '206 CC', '206 plus', '207 CC', '307 CC', '307 SW', 'Bipper', 'Expert', 'Partner', 'Primastar', 'RCZ', 'Pozostałe Peugeot'],
    'Polonez': ['1.5', '1.6', 'Atu', 'Atu Plus', 'Caro', 'Caro Plus', 'Truck', 'Pozostałe Polonezy'],
    'Porsche': ['911', '944', 'Cayenne', 'Cayenne S', 'Panamera', 'Boxter', 'Cayenne Turbo', 'Pozostałe Porsche'],
    'Renault': ['4', '5', '11', '14', '19', '21', 'Avantime', 'Clio', 'Coupe', 'Espace', 'Fluence', 'Grand Espace', 'Grand Scenic', 'Kangoo', 'Koleos', 'Laguna', 'Latitude', 'Megane', 'Modus', 'Safrane', 'Scenic', 'Scenic Conquest', 'Scenic RX4', 'Thalia', 'Twingo', 'Vel Satis', 'Pozostałe Renault'],
    'Rover': ['25', '45', '75', '111', '200', '214', '216', '218', '220', '400', '414', '416', '418', '420', '600', '618', '620', '623', '820', '825', '827', 'MG', 'Pozostałe Rover'],
    'Saab': ['9-3', '9-5', '900', '9000', 'Pozostałe Saab'],
    'Seat': ['Alhambra', 'Altea', 'Altea XL', 'Arosa', 'Cordoba', 'Exeo', 'Ibiza', 'Inca', 'Leon', 'Malaga', 'Marbella', 'Terra', 'Toledo', 'Pozostałe Seat'],
    'Skoda': ['100', '105', '120', '135', 'Fabia', 'Favorit', 'Felicia', 'Octavia', 'RAPID', 'Roomster', 'Superb', 'Yeti', 'Pozostałe Skoda'],
    'Smart': ['Fortwo', 'Forfour', 'Pozostałe Smart'],
    'SsangYong': ['Korando', 'Kyron', 'Rexton', 'Tivoli', 'XLV', 'Pozostałe SsangYong'],
    'Subaru': ['B9 Tribeca', 'Forester', 'Impreza', 'Justy', 'Legacy', 'OUTBACK', 'Tribeca', 'Pozostałe Subaru'],
    'Suzuki': ['Alto', 'Baleno', 'Grand Vitara', 'Ignis', 'Jimny', 'Liana', 'Samurai', 'SJ', 'Splash', 'Swift', 'SX4', 'Vitara', 'Wagon R+', 'X-90', 'Pozostałe Suzuki'],
    'Toyota': ['4-Runner', 'Auris', 'Avalon', 'Avensis', 'Avensis Verso', 'Aygo', 'Camry', 'Camry Solara', 'Carina', 'Celica', 'Corolla', 'Corolla Verso', 'Dyna', 'FJ', 'Highlander', 'Hilux', 'iQ', 'Land Cruiser', 'Matrix', 'MR2', 'Paseo', 'Picnic', 'Previa', 'Prius', 'RAV-4', 'Sienna', 'Starlet', 'Supra', 'Tacoma', 'Verso', 'Yaris', 'Yaris Verso', 'Pozostałe Toyota'],
    'Volkswagen': ['Amarok', 'Beetle', 'Bora', 'Buggy', 'CC', 'Caddy', 'Caravelle', 'Corrado', 'Eos', 'Fox', 'Garbus', 'Golf', 'Golf Plus', 'Jetta', 'Lupo', 'Multivan', 'New Beetle', 'Passat', 'Passat CC', 'Phaeton', 'Polo', 'Scirocco', 'Sharan', 'Tiguan', 'Touareg', 'Touran', 'Transporter', 'Up!', 'Vento', 'Pozostałe Volkswagen'],
    'Volvo': ['240', '244', '440', '460', '480', '740', '760', '780', '850', '940', '945', '960', '965', 'Amazon', 'C30', 'C70', 'Polar', 'S40', 'S60', 'S70', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC 60', 'XC 70', 'XC 90', 'Pozostałe Volvo']
};

const years = ['1960', '1970', '1980', '1990', '1995', '2000', '2002', '2004', '2006', '2008', '2010', '2012', '2014', '2015', '2016', '2017', '2018', '2019'];

const priceProps = [{
    name: 'Cena',
    type: 'Range',
    unit: 'zł'
}];

const stateProps = [{
    name: 'Stan',
    type: 'Multiple',
    values: ['Używany', 'Nowy']
}];

const genderProps = [{
    name: 'Rodzaj',
    type: 'Multiple',
    values: ['Męska', 'Damska']
}];

const genderWithUnisexProps = [{
    name: 'Rodzaj',
    type: 'Multiple',
    values: ['Męska', 'Damska', 'Unisex']
}];

const childGenderProps = [{
    name: 'Rodzaj',
    type: 'Multiple',
    values: ['Chłopięce', 'Dziewczęce', 'Unisex']
}]

const shoeSizeProps = [{
    name: 'Rozmiar',
    type: 'Multiple',
    values: Array.from({length: 50}, (v, k) => k + 1)
}];

const childShoeSizeProps = [{
    name: 'Rozmiar',
    type: 'Multiple',
    values: Array.from({length: 26}, (v, k) => k + 16)
}];

const adultShoeSizeProps = [{
    name: 'Rozmiar',
    type: 'Multiple',
    values: Array.from({length: 16}, (v, k) => k + 35)
}]

const dressSizeProps = [{
    name: 'Rozmiar',
    type: 'Multiple',
    values: ['Mniejszy niż 34', ...Array.from({length: 11}, (v, k) => k + 34) ,'Większy niż 44']
}];

const childClothesSizeProps = [{
    name: 'Rozmiar',
    type: 'Multiple',
    values: Array.from({length: 115}, (v, k) => k + 50)
}];

const clothesSizeLettersProps = [{
    name: 'Rozmiar',
    type: 'Multiple',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
}];

const clothesKindProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Bluzki i koszulki', 'Bluzy i swetry', 'Kurtki i płaszcze', 'Marynarki i koszule', 'Spodnie', 'Spódnice', 'Sukienki', 'Pozostałe']
}];

const bookKindProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Literatura', 'Czasopisma', 'Dla dzieci', 'Komiksy', 'Książki naukowe', 'Podręczniki szkolne', 'Poradniki i Albumy', 'Pozostałe']
}];

const publishYearProps = [{
    name: 'Rok wydania',
    type: 'Range',
    values: years
}];

const dogRaceProps = [{
    name: 'Rasa',
    type: 'Singular',
    values: ['Bez rodowodu', 'Ze schroniska', 'Akita', 'Amstaff', 'Basset', 'Hound', 'Beagle', 'Bernardyn', 'Berneński Pies Pasterski', 'Bokser', 'Buldog', 'Cane Corso', 'Cavalier King Charles Spaniel', 'Chihuahua', 'Cocker Spaniel', 'Doberman', 'Dogo Canario', 'Golden Retriever', 'Grzywacz Chiński', 'Husky', 'Jack Russell Terrier', 'Jamnik', 'Labrador', 'Maltańczyk', 'Mops', 'Owczarek', 'Pekińczyk', 'Pit Bull', 'Rottweiler', 'Seter', 'Shih Tzu', 'Sznaucer', 'Szpic miniaturowy', 'West Highland White Terrier', 'York', 'Pozostałe rasy']
}];

const catRaceProps = [{
    name: 'Rasa',
    type: 'Singular',
    values: ['Koty bez rodowodu', 'Koty ze schronisk', 'Bengalski', 'Brytyjski', 'Burmański', 'Devon Rex', 'Maine Coon', 'Norweski', 'Perski', 'Ragdoll', 'Rosyjski', 'Sfinks', 'Syberyjski', 'Syjamski', 'Pozostałe rasy']
}];

const subnauticaProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Akcesoria akwariowe', 'Akwaria', 'Rośliny akwariowe', 'Zwierzęta akwariowe']
}];

const powerProps = [{
    name: 'Moc',
    type: 'Range',
    unit: 'KM',
    values: Array.from({ length: 10 }, (v, k) => 60 + (k * 30))
}];

const motorHoursProps = [{
    name: 'Motogodziny',
    type: 'Range',
    values: Array.from({ length: 10 }, (v, k) => (k + 1) * 1000)
}];

const productionYearProps = [{
    name: 'Rok produkcji',
    type: 'Range',
    values: years
}];

const ruralMachineKindProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Agregaty', 'Kombajny', 'Kosiarki', 'Ładowacze czołowe', 'Opryskiwacze', 'Prasy', 'Pługi', 'Rozsiewacze', 'Siewniki', 'Pozostałe maszyny rolnicze']
}];

const ruralAnimalProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Bydło', 'Drób', 'Kozy', 'Owce', 'Trzoda', 'Pozostałe zwierzęta']
}];

const workingOrderProps = [{
    name: 'Stan techniczny',
    type: 'Multiple',
    values: ['Sprawny', 'Uszkodzony']
}];

const phoneMakeProps = [{
    name: 'Marka',
    type: 'Singular',
    values: ['HTC', 'Huawei', 'iPhone', 'LG', 'Microsoft', 'Motorola', 'Nokia', 'Samsung', 'Sony', 'Sony Ericsson', 'Inne telefony gsm']
}];

const computerKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Drukarki i skanery', 'Komputery stacjonarne', 'Laptopy', 'Monitory', 'Myszki i klawiatury', 'Oprogramowanie', 'Routery i modemy', 'Akcesoria i części', 'Pozostałe']
}];

const indoorAccessoriesProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Akcesoria kuchenne', 'Dekoracje', 'Drzwi, Okna, Schody', 'Oświetlenie', 'Wyposażenie łazienki']
}];

const AGDKindProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Ekspresy do kawy', 'Kuchenki i piekarniki', 'Lodówki i zamrażarki', 'Maszyny do szycia', 'Miksery i blendery', 'Odkurzacze', 'Okapy kuchenne', 'Pralki', 'Stylizacja włosów', 'Zmywarki', 'Pozostałe']
}];

const furnitureKindProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Biurka', 'Fotele', 'Komplety mebli', 'Łóżka i materace', 'Regały', 'Sofy i kanapy', 'Stoły i krzesła', 'Szafy i komody', 'Pozostałe meble']
}];

const realEstateCatProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Wynajem', 'Sprzedaż']
}];

const realEstateAreaProps = [{
    name: 'Powierzchnia',
    type: 'Range',
    unit: 'm²',
    values: Array.from({ length: 10 }, (v, k) => 100 + (k * 200))
}];

const realEstatePlotAreaProps = [{
    name: 'Powierzchnia działki',
    type: 'Range',
    unit: 'm²',
    values: Array.from({ length: 10 }, (v, k) => 500 + (k * 500))
}];

const roomFurnitureProps = [{
    name: 'Umeblowanie',
    type: 'Multiple',
    values: ['Tak', 'Nie']
}];

const roomKindProps = [{
    name: 'Rodzaj pokoju',
    type: 'Multiple',
    values: ['Jednoosobowy', 'Dwuosobowy', 'Trzyosobowy i większe']
}];

const roomPrefProps = [{
    name: 'Umeblowanie',
    type: 'Multiple',
    values: ['Kobiety', 'Mężczyźni', 'Studenci', 'Osoby pracujące']
}];

const boardingTypeProps = [{
    name: 'Typ noclegu',
    type: 'Multiple',
    values: ['Pokój', 'Mieszkanie', 'Dom', 'Kemping', 'Hostel', 'Agroturystyka']
}];

const numberOfPersonsProps = [{
    name: 'Liczba osób',
    type: 'Multiple',
    values: ['Jedna', 'Dwie', 'Trzy lub więcej']
}];

const realEstateFlatRoomCountProps = [{
    name: 'Liczba pokoi',
    type: 'Multiple',
    values: ['1', '2', '3', '4 lub więcej']
}];

const realEstateUseCaseProps = [{
    name: 'Przeznaczenie lokalu',
    type: 'Multiple',
    values: ['Usługowe', 'Biurowe', 'Handlowe', 'Gastronomiczne', 'Przemysłowe', 'Hotelowe']
}];

const realEstateLevelProps = [{
    name: 'Piętro',
    type: 'Multiple',
    values: ['Parter', '1', '2', '3', '4', '5 lub wyżej']
}];

const realEstateFlatLevelProps = [{
    name: 'Piętro',
    type: 'Multiple',
    values: ['Suterena', 'Parter', ...Array.from({length: 10}, (v, k) => k + 1), 'Powyżej 10', 'Poddasze']
}];

const realEstateLevelCount = [{
    name: 'Liczba pięter',
    type: 'Multiple',
    values: ['Parterowy', 'Parterowy z poddaszem użytkowym', 'Jednopiętrowy', 'Dwupiętrowy i większy']
}];

const realEstatePlotKindProps = [{
    name: 'Rodzaj działki',
    type: 'Multiple',
    values: ['Działki rekreacyjne', 'Działki budowlane', 'Działki rolne', 'Działki leśne', 'Działki inwestycyjne', 'Działki rolno-budowlane', 'Działki siedliskowe', 'Ogródek działkowy']
}];

const realEstateBuildingTypeProps = [{
    name: 'Rodzaj zabudowy',
    type: 'Multiple',
    values: ['Wolnostojący', 'Bliźniak', 'Szeregowiec', 'Gospodarstwo', 'Letniskowy', 'Pozostałe']
}];

const realEstateFlatBuildingTypeProps = [{
    name: 'Rodzaj zabudowy',
    type: 'Multiple',
    values: ['Blok', 'Kamienica', 'Dom wolnostojący', 'Szeregowiec', 'Apartamentowiec', 'Loft', 'Pozostałe']
}];

const carWheelCatProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Opony', 'Felgi', 'Koła', 'Pozostałe Opony i Felgi']
}];

const vehicleProps = [{
    name: 'Pojazd',
    type: 'Multiple',
    values: ['Osobowe', 'Dostawcze', 'Motocykle', 'Terenowe', 'Ciężarowe', 'Samochody na części', 'Pozostałe']
}];

const motorcyclePartKindProps = [{
    name: 'Rodzaj',
    type: 'Multiple',
    values: ['Akcesoria', 'Filtry', 'Karoseria', 'Oświetlenie', 'Silniki', 'Tuning', 'Układ elektryczny', 'Układ hamulcowy', 'Układ kierowniczy', 'Układ napędowy', 'Odzież i Kaski', 'Układ paliwowy', 'Układ wydechowy', 'Zawieszenie', 'Pozostałe części motocyklowe']
}];

const carPartKindProps = [{
    name: 'Rodzaj',
    type: 'Multiple',
    values: ['Akcesoria', 'Filtry', 'Karoseria', 'Ogrzewanie, Wentylacja, Klimatyzacja', 'Oświetlenie', 'Silniki', 'Tuning', 'Układ elektryczny', 'Układ hamulcowy', 'Układ kierowniczy', 'Układ napędowy', 'Układ paliwowy', 'Układ wydechowy', 'Zawieszenie', 'Pozostałe części samochodowe']
}];

const trailerCatProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Kempingowe', 'Przyczepy towarowe', 'Wózki widłowe', 'Pozostałe Przyczepy i Pojazdy użytkowe']
}];

const truckCatProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Autobusy', 'Dostawcze', 'Ciężarowe', 'Naczepy', 'Pozostałe Dostawcze i Ciężarowe']
}];

const enginePowerProps = [{
    name: 'Moc silnika',
    type: 'Range',
    unit: 'KM',
    values: Array.from({length: 10}, (v, k) => 80 + (40 * k))
}];

const fuelProps = [{
    name: 'Paliwo',
    type: 'Multiple',
    values: ['Benzyna', 'Diesel', 'LPG', 'CNG i Hybryda', 'Elektryczny']
}];

const engineVolumeProps = [{
    name: 'Pojemność silnika',
    type: 'Range',
    unit: 'cm³',
    values: Array.from({length: 16}, (v, k) => 1000 + (200 * k))
}];

const motorbikeEngineVolumeProps = [{
    name: 'Pojemność silnika',
    type: 'Range',
    unit: 'cm³',
    values: ['50', '90', '125', '250', '500', '600', '1000']
}];

const gearBoxProps = [{
    name: 'Skrzynia biegów',
    type: 'Multiple',
    values: ['Manualna', 'Automatyczna']
}];

const makeCountryProps = [{
    name: 'Kraj pochodzenia',
    type: 'Multiple',
    values: ['Polska', 'Austria', 'Belgia', 'Białoruś', 'Bułgaria', 'Chorwacja', 'Czechy', 'Dania', 'Estonia', 'Finlandia', 'Francja', 'Grecja', 'Hiszpania', 'Holandia', 'Irlandia', 'Islandia', 'Kanada', 'Liechtenstein', 'Litwa', 'Luksemburg', 'Łotwa', 'Monako', 'Niemcy', 'Norwegia', 'Rosja', 'Rumunia', 'Słowacja', 'Słowenia', 'Stany ', 'Zjednoczone', 'Szwajcaria', 'Szwecja', 'Turcja', 'Ukraina', 'Węgry', 'Wielka Brytania', 'Włochy', 'Inny']
}];

const courseDistanceProps = [{
    name: 'Przebieg',
    type: 'Range',
    unit: 'km',
    values: ['5000', '10000', '25000', '50000', '100000', '150000', '200000', '300000']
}];

const motorbikeCatProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Chopper - Cruiser', 'Enduro - Funbike', 'Cross', 'Motorower', 'Quad - ATV', 'Skuter', 'Sportowy', 'Szosowo - Turystyczny', 'Pozostałe Motocykle i Skutery']
}];

const motorbikeMakeProps = [{
    name: 'Marka',
    type: 'Multiple',
    values: ['Aprilia', 'Baotian', 'Barton', 'Bashan', 'Benzer', 'Beta', 'Bmw', 'Cagiva', 'Cpi', 'Daelim', 'Derbi', 'Ducati', 'Gilera', 'Harley Davidson', 'Honda', 'Husqvarna', 'Jawa', 'Junak', 'Kawasaki', 'Keeway', 'Kinroad', 'Komar', 'Ktm', 'Kymco', 'Loncin', 'Malaguti', 'Mbk', 'Mz', 'Peugeot', 'Piaggio', 'Rex', 'Rieju', 'Romet', 'Shl', 'Simson', 'Suzuki', 'Sym', 'Tgb', 'Triumph', 'Vespa', 'Wfm', 'Wsk', 'Yamaha', 'Zipp', 'Zumico', 'Inna']
}];

const carMakeProps = [{
    name: 'Marka',
    type: 'Singular',
    values: ['Aixam', 'Alfa Romeo', 'Audi', 'BMW', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lancia', 'Land Rover', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Polonez', 'Porsche', 'Renault', 'Rover', 'Saab', 'Seat', 'Skoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo', 'Pozostałe osobowe']
}];

const carModelProps = [{
    name: 'Model',
    type: 'Multiple',
    values: ['Pozostałe osobowe'],
    conditional_values: CarMakeToCarModelConditionalValues
}];

const cabinTypeProps = [{
    name: 'Typ nadwozia',
    type: 'Multiple',
    values: ['Kabriolet', 'Sedan', 'Coupe', 'Pickup', 'Hatchback', 'Kombi', 'Terenowy', 'Minibus', 'Minivan', 'SUV']
}];

const colorProps = [{
    name: 'Kolor',
    type: 'Multiple',
    values: ['Biały', 'Szary', 'Czarny', 'Srebrny', 'Niebieski', 'Brązowy', 'Beżowy', 'Czerwony', 'Zielony', 'Żółty', 'Złoty', 'Inny']
}];

const steeringWheelProps = [{
    name: 'Kierownica',
    type: 'Multiple',
    values: ['Po prawej', 'Po lewej']
}];

const priceAndStateProps = [...priceProps, ...stateProps];

//
// NOWE:
//

const carPartAggregatedProps = [...vehicleProps, ...priceAndStateProps];


const carTireVehicleKinds = [{
    name: 'Pojazd',
    type: 'Singular',
    values: ['Osobowe', '4x4/SUV', 'Dostawcze', 'Ciężarowe', 'Do motocykli i skuterów', 'Do maszyn rolniczych', 'Do maszyn budowlanych', 'Do gokartów', 'Do quadów', 'Pozostałe']
}];

const carFelgiKinds = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Aluminiowe', 'Stalowe', 'Do motocykli i skuterów', 'Felgi pozostałe']
}];

 const carKolaKinds = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Do samochodów', 'Koła dojazdowe', 'Do motocykli i skuterów', 'Pozostałe']
}];

const carAkcesoriaDoOponIFelgKinds = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Kołpaki', 'Czujniki ciśnienia i programatory', 'Dekielki do felg', 'Dystanse do felg', 'Pierścienie centrujące do felg', 'Nakrętki do felg', 'Śruby do kół', 'Szpilki do kół', 'Dętki i ochraniacze', 'Wentyle', 'Pompki i kompresory 12V', 'Łańcuchy śniegowe', 'Pozostałe']
}];

const olejeSilnikoweKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Mineralne', 'Półsyntetyczne', 'Syntetyczne', 'Pozostałe']
}];

const mycieIPielegnacjaKindsProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Akcesoria do mycia i pielęgnacji', 'Chemia dla myjni', 'Środki do mycia felg i opon', 'Nadwozie', 'Wnętrze samochodu', 'Pozostałe']
}];

const plynyEksploatacyjneKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['AdBlue', 'Dodatki do olejów i paliw', 'Lubryfikatory LPG', 'Oleje do klimatyzacji', 'Oleje do zawieszenia', 'Oleje filtrów powietrza', 'Oleje hydrauliczne', 'Oleje przekładniowe', 'Oleje sprężarkowe', 'Płyny chłodnicze', 'Płyny do spryskiwaczy', 'Płyny do wspomagania', 'Płyny hamulcowe', 'Woda destylowana', 'Pozostałe']
}];

const chemiaBlacharskoLakierniczaProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Lakiery', 'Maty szklane', 'Mleczka i pasty polerskie', 'Odtłuszczacze', 'Podkłady i grunty', 'Rozcieńczalniki', 'Rozpuszczalniki', 'Szpachlówki', 'Usuwanie rys z lakieru', 'Utwardzacze', 'Środki antykorozyjne', 'Żywice', 'Pozostałe']
}];

const srodkiDoNaprawKindsProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Czyszczenie części', 'Kleje', 'Montaż i naprawa wydechu', 'Naprawa opon', 'Odrdzewiacze i penetratory', 'Odstraszacze zwierząt', 'Pasty do hamulców', 'Pasty do rąk', 'Pasty zaworowe', 'Płukanki silnika', 'Samostarty', 'Silikony, masy uszczelniające', 'Smary', 'Testery szczelności', 'Uszczelnianie i czyszczenie chłodnic', 'Środki do usuwania uszczelek', 'Pozostałe']
}];

const czesciMotocykloweKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Nadwozie', 'Filtry', 'Oświetlenie', 'Silniki', 'Tuning', 'Układ elektryczny, zapłon', 'Układ hamulcowy', 'Układ napędowy', 'Układ paliwowy', 'Układ wydechowy', 'Układ zawieszenia', 'Zabytkowe', 'Pozostałe']
}];

const odziezMotocyklowaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Kaski', 'Chusty', 'Czapki', 'Gogle', 'Kamizelki', 'Kombinezony', 'Kominiarki', 'Koszulki i bluzy', 'Kurtki', 'Obuwie', 'Ochraniacze', 'Pasy nerkowe', 'Rękawice', 'Skarpety', 'Slidery', 'Spodnie', 'Konserwacja odzieży', 'Pozostałe']
}];

const akcesoriaMotocykloweKindsProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Alarmy', 'Bagażniki', 'Blokady', 'Crash pady', 'Gmole', 'Gniazda zapalniczki', 'Interkomy', 'Kufry', 'Lokalizatory i nawigacje', 'Oparcia', 'Osłony chłodnicy', 'Plecaki', 'Pokrowce', 'Ramki tablic', 'Sakwy i torby motocyklowe', '﻿Saszetki', 'Siatki bagażowe', 'Stelaże', 'Stojaki, podnośniki', 'Torby na bak', 'Uchwyty', 'Pozostałe']
}];

const czesciDoQuadowKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Elementy nadwozia', 'Filtry', 'Koła, felgi', 'Oświetlenie', 'Silniki i osprzęt', 'Układ elektryczny, zapłon', 'Układ hamulcowy', 'Układ napędowy', 'Układ paliwowy', 'Układ wydechowy', 'Układ zawieszenia', 'Pozostałe']
}];

const akcesoriaDoQuadowProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['Kufry', 'Osłony', 'Pługi', 'Wyciągarki', 'Pozostałe']
}];

const meskaBieliznaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Kalesony', 'Majtki', 'Piżamy', 'Podkoszulki', 'Skarpetki', 'Stroje kąpielowe', 'Szlafroki', 'Pozostałe', 'Wszystkie produkty']
}];

const meskaOdziezKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Bluzy', 'Dresy', 'Garnitury i Marynarki', 'Kamizelki', 'Koszule', 'Koszulki', 'Kurtki i płaszcze', 'Spodenki', 'Spodnie', 'Swetry', 'Pozostałe', 'Wszystkie produkty']
}];

const meskieObuwieKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Domowe', 'Espadryle', 'Glany i trapery', 'Kalosze', 'Klapki', 'Kowbojki', 'Mokasyny', 'Półbuty', 'Sandały', 'Sportowe', 'Sztyblety', 'Śniegowce', 'Tenisówki', 'Trekkingowe', 'Akcesoria obuwnicze', 'Pozostałe', 'Wszystkie produkty']
}];

const meskaGalanteriaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Breloki', 'Chusty i apaszki', 'Czapki/Nakrycia głowy', 'Etui i pokrowce', 'Krawaty i muszki', 'Nesesery i aktówki', 'Okulary przeciwsłoneczne', 'Parasole', 'Paski', 'Plecaki', 'Portfele', 'Poszetki', 'Rękawiczki', 'Saszetki i nerki', 'Szaliki i szale', 'Szelki', 'Torby i torebki', 'Walizki', 'Pozostałe', 'Wszystkie produkty']
}];

const meskaBizuteriaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Akcesoria do biżuterii', 'Akcesoria do zegarków', 'Biżuteria męska', 'Dewocjonalia', 'Ozdoby do włosów', 'Piercing', 'Tatuaże zmywalne', 'Zegarki', 'Pozostałe', 'Wszystkie produkty']
}];

const meskiePrzebraniaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Akcesoria i gadżety', 'Kostiumy męskie', 'Maski', 'Peruki', 'Pozostałe']
}];

const meskiSlubKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Dekoracje ślubne', 'Dodatki męskie', 'Galanteria papiernicza', 'Pozostałe']
}];

const damskaBieliznaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Bielizna wyszczuplająca', 'Biustonosze', 'Body i Gorsety', 'Halki', 'Kombinezony', 'Komplety', 'Koszulki nocne i Piżamy', 'Podkoszulki', 'Pończochy i pasy do pończoch', 'Rajstopy', 'Skarpetki i kolanówki', 'Stroje kąpielowe', 'Szlafroki', 'Topy', 'Wszystkie produkty']
}];

const damskaOdziezKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Bluzki', 'Bluzy', 'Body', 'Bolerka', 'Dresy', 'Getry', 'Kamizelki', 'Kombinezony', 'Komplety', 'Koszule', 'Legginsy', 'Marynarki i żakiety', 'Okrycia wierzchnie', 'Spodnie', 'Spódnice i spódniczki', 'Sukienki', 'Suknie wieczorowe', 'Swetry', 'T-shirty', 'Topy', 'Tuniki', 'Wszystkie produkty']
}];

const damskieObuwieKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Akcesoria obuwnicze', 'Balerinki', 'Botki', 'Creepersy', 'Czółenka', 'Domowe', 'Espadryle', 'Glany', 'Kalosze', 'Klapki', 'Kozaki', 'Mokasyny', 'Półbuty', 'Sandały', 'Sportowe', 'Śniegowce', 'Tenisówki', 'Trekkingowe', 'Pozostałe', 'Wszystkie produkty']
}];

const damskaGalanteriaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Breloki', 'Chusty i apaszki', 'Etui i pokrowce', 'Krawaty', 'Muszki', 'Nakrycia głowy', 'Nesesery i aktówki', 'Okulary przeciwsłoneczne', 'Parasole', 'Paski', 'Plecaki', 'Portfele', 'Poszetki', 'Rękawiczki', 'Saszetki i nerki', 'Szaliki i szale', 'Szelki', 'Torby', 'Torebki', 'Walizki', 'Pozostałe', 'Wszystkie produkty']
}];

const damskaBizuteriaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Akcesoria do biżuterii', 'Akcesoria do zegarków', 'Biżuteria damska', 'Biżuteria ślubna', 'Dewocjonalia', 'Ozdoby do włosów', 'Piercing', 'Tatuaże zmywalne', 'Zegarki', 'Pozostałe', 'Wszystkie produkty']
}];

const ciazaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Biustonosze', 'Bluzki', 'Koszule nocne', 'Legginsy', 'Rajstopy', 'Spodnie', 'Sukienki', 'Pozostałe']
}];

const damskiSlubKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Dekoracje ślubne', 'Dodatki damskie', 'Galanteria papiernicza', 'Obuwie ślubne', 'Suknie ślubne', 'Pozostałe']
}];

const damskiePrzebraniaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Kostiumy damskie', 'Maski', 'Peruki', 'Pozostałe']
}];

const consoleKindsProps = [{
    name: 'Kategoria',
    type: 'Singular',
    values: ['PS4', 'PS3', 'XBox One', 'XBox 360', 'Nintendo', 'Pozostałe']
}];

const elektronikaTVkindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['4K UHD', 'OLED', 'Smart TV', 'Curved', 'QLED', 'Akcesoria', 'Nagrywarki DVD/HDD', 'Odtwarzacze Blu-ray', 'Odtwarzacze DVD', 'Odtwarzacze HDD i multimedialne', 'Projektory', 'Sprzęt naziemny', 'Telewizja przemysłowa', 'Kino domowe', 'Pozostałe']
}];

const elektronikaAudioKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Amplitunery', 'Części i podzespoły', 'DAC', 'DIY', 'Elementy wygłuszające', 'Gramofony i akcesoria', 'Głośniki', 'Kolumny głośnikowe', 'Korektory graficzne', 'Magnetofony i nośniki', 'Odtwarzacze CD i MD', 'Radia', 'Sprzęt estradowy, studyjny i DJ-ski', 'Tunery radiowe', 'Wieże i miniwieże', 'Wzmacniacze i pokrewne', 'Zestawy stereo', 'Literatura i instrukcje', 'Pozostałe', 'Dyktafony', 'Miniradio', 'MP3 i MP4', 'Odtwarzacze CD, MD i kasetowe', 'Radioodtwarzacze', 'Głośniki przenośne', 'Sprzęt do karaoke', 'Ładowarki', 'Pokrowce i etui', 'Pozostałe']
}];

const elektronikaCarAudioKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Akcesoria montażowe', 'Anteny', 'Elementy wygłuszające', 'Głośniki', 'Kondensatory, filtry', 'Panele i etui', 'Panele LCD/TV', 'Piloty i joysticki', 'Procesory dźwięku', 'Radioodtwarzacze', 'Transmitery', 'Wzmacniacze', 'Zmieniarki CD', 'Pozostałe']
}];

const elektronikaFotografiaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Aparaty cyfrowe', 'Aparaty analogowe', 'Akcesoria fotograficzne', 'Drony', 'Kamery sportowe', 'Kamery na karty pamięci', 'Lampy błyskowe i oświetlenie', 'Literatura i instrukcje', 'Obiektywy', 'Sprzęt optyczny', 'Wideorejestratory', 'Wyposażenie studia', 'Zasilanie aparatów', 'Pozostałe']
}];

const agdLodowkiKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Lodówki', 'Zamrażarki', 'Chłodziarki', 'Części i akcesoria', 'Pozostałe']
}];

const agdPralkiKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Pralki', 'Pralki wirnikowe', 'Pralko-suszarki', 'Suszarki do ubrań', 'Części i akcesoria', 'Pozostałe']
}];

const agdKuchnieKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Kuchnie', 'Kuchenki przenośne', 'Piekarniki', 'Okapy', 'Zmywarki', 'Kuchenki mikrofalowe', 'Sprzęt AGD', 'Części i akcesoria', 'Pozostałe']
}];

const agdDoKuchniKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Blendery', 'Czajniki elektryczne', 'Ekspresy do kawy', 'Filtry do wody', 'Frytkownice', 'Gofrownice', 'Grille elektryczne', 'Jajowary', 'Kawiarki', 'Kostkarki do lodu', 'Krajalnice', 'Maszynki do mielenia mięsa', 'Miksery ręczne', 'Mini piekarniki', 'Multicookery i garnki elektryczne', 'Młynki elektryczne', 'Opiekacze', 'Parowary i kombiwary', 'Prodiże', 'Roboty kuchenne', 'Sokowirówki', 'Spieniacze do mleka', 'Suszarki spożywcze', 'Szatkownice i rozdrabniacze', 'Tostery', 'Urządzenia do czekolady', 'Urządzenia do lodów i jogurtów', 'Urządzenia do popcornu', 'Urządzenia do waty cukrowej', 'Wagi kuchenne', 'Wypiekacze do chleba', 'Zgrzewarki', 'Części i akcesoria', 'Pozostałe']
}];

const agdDoDomuKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Golarki do ubrań', 'Grzejniki', 'Klimatyzacja', 'Maszyny do szycia', 'Nawilżacze i oczyszczacze powietrza', 'Odkurzacze', 'Osuszacze powietrza', 'Parownice i stacje parowe', 'Stacje parowe', 'Termowentylatory', 'Żelazka', 'Części i akcesoria', 'Pozostałe']
}];

const agdHigienaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Akcesoria fryzjerskie', 'Depilatory', 'Golarki', 'Lokówki', 'Maszynki do strzyżenia', 'Prostownice i karbownice', 'Suszarki do włosów', 'Szczoteczki do twarzy', 'Szczoteczki elektryczne', 'Trymery', 'Wagi łazienkowe', 'Pozostałe']
}];

const telAkcSmartfonyKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Apple', 'Huawei', 'Samsung', 'Xiaomi', 'LG', 'Sony', 'Nokia', 'Motorola', 'myPhone', 'Meizu', 'Flagowce', 'Pozostałe']
}];

const telAkcTabletyKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Apple', 'Huawei', 'Samsung', 'Lenovo', 'Akcesoria', 'Pozostałe']
}];

const telAkcCzytnikiKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['inkBook', 'Kindle', 'PocketBook', 'Akcesoria', 'Pozostałe']
}];

const telAkcSmartwatcheKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Apple', 'Samsung', 'Xiaomi', 'Sony', 'Overmax', 'Garett', 'Goclever', 'Paski i bransolety', 'Pozostałe']
}];

const telAkcAkcesoriaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Etui i pokrowce', 'Folie i szkła ochronne', 'Ładowarki', 'Baterie', 'Uchwyty', 'Przewody', 'Zestawy słuchawkowe', 'Karty pamięci', 'Powerbanki', 'Pozostałe']
}];

const telAkcMultimediaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Głośniki', 'Słuchawki', 'VR/AR', 'Zestawy głośnomówiące', 'Pozostałe']
}];

const telAkcTelefonyKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Telefony przewodowe', 'Telefony bezprzewodowe', 'Pozostałe']
}];

const telAkcRadiokomunikacjaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Krótkofalówki i Walkie Talkie', 'Sprzet CB', 'Sprzęt krótkofalarski', 'Sprzęt profesjonalny', 'Pozostałe']
}];

const laptopyKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Acer', 'Apple', 'Asus', 'Dell', 'HP', 'Lenovo', 'Microsoft', 'MSI', 'Torby i pokrowce', 'Podstawki chłodzące', 'Stacje dokujące', 'Pamięci RAM', 'Części do laptopów', 'Inne akcesoria', 'Pozostałe']
}];

const komputeryPCKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Zestawy', 'Kryptowaluty', 'Systemy operacyjne', 'Oprogramowanie biurowe', 'Antywirusy i bezpieczeństwo', 'Mikrokomputery', 'Serwery', 'Pozostałe']
}];

const gamingKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Laptopy', 'Komputery stacjonarne', 'Monitory', 'Myszki', 'Klawiatury', 'Słuchawki', 'Fotele Gamingowe', 'Kierownice', 'Kontrolery', 'Karty graficzne', 'Procesory', 'Płyty główne', 'Pamięci RAM', 'Pozostałe']
}];

const komponentyPCKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Karty graficzne', 'Procesory', 'Płyty główne', 'Pamięci RAM', 'Dyski SSD i M.2', 'Dyski HDD', 'Obudowy', 'Zasilacze', 'Napędy optyczne', 'Karty dźwiękowe', 'Chłodzenie i tuning', 'Karty sieciowe', 'Przewody i taśmy', 'Pozostałe']
}];

const peryferiaKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Monitory', 'Gogle VR', 'Głośniki', 'Słuchawki', 'Myszki', 'Klawiatury', 'Dyski zewnętrzne', 'Pendrivy', 'Dyski NAS', 'Routery WiFi', 'Zasilacze UPS', 'Listwy zasilające', 'Grabbery', 'Kamery internetowe', 'Pozostałe']
}];

const drukarkiKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Drukarki atramentowe', 'Drukarki laserowe', 'Urządzenia wielofunkcyjne', 'Druk 3D', 'Skanery', 'Plotery', 'Drukarki igłowe', 'Drukarki etykiet', 'Tonery', 'Tusze', 'Bębny', 'Taśmy barwiące', 'Części i akcesoria', 'Papiery i folie', 'Pozostałe']
}];

const sonyPlaystationKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Konsole Playstation 4', 'Konsole Playstation 3', 'Konsole Playstation 2', 'Konsole Playstation', 'Kontrolery', 'Playstation VR', 'Playstation Camera', 'Kody do PSN', 'Gry dla Playstation 4', 'Pozostałe akcesoria Playstation']
}];

const xboxKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Konsole Xbox One S', 'Konsole Xbox One X', 'Konsole Xbox One', 'Konsole Xbox 360', 'Kontrolery', 'Kinect', 'Kody do Xbox One', 'Gry do Xbox One', 'Pozostałe akcesoria Xbox One']
}];

const nintendoKindsProps = [{
    name: 'Rodzaj',
    type: 'Singular',
    values: ['Konsole Nintendo', 'Kontrolery', 'Akcesoria Nintendo', 'Gry do Nintendo', 'Pozostałe']
}];



const categoryTree = {
    // 'Moda': {
    //     'Ubrania': [...clothesKindProps, ...priceAndStateProps, ...genderWithUnisexProps, ...clothesSizeLettersProps ],

    //     'Buty': [...priceAndStateProps, ...genderWithUnisexProps, ...adultShoeSizeProps],

    //     'Bielizna': [...priceAndStateProps, ...genderProps],

    //     'Odzież ciążowa': [...priceAndStateProps, ...clothesSizeLettersProps],

    //     'Dodatki': [...priceAndStateProps, ...genderWithUnisexProps],

    //     'Biżuteria': [...priceAndStateProps, ...genderProps],

    //     'Torebki': priceAndStateProps,

    //     'Zegarki': [...priceAndStateProps, ...genderWithUnisexProps],

    //     'Kosmetyki i perfumy': [...priceAndStateProps, ...genderWithUnisexProps],

    //     'Pozostała moda': priceAndStateProps
    // },

    'Moda': {
        'Męska': {
            'Odzież': [...meskaOdziezKindsProps, ...priceAndStateProps, ...clothesSizeLettersProps],
            'Obuwie': [...meskieObuwieKindsProps, ...priceAndStateProps, ...adultShoeSizeProps],
            'Bielizna': [...meskaBieliznaKindsProps, ...priceAndStateProps, ...clothesSizeLettersProps],
            'Galanteria i Dodatki': [...meskaGalanteriaKindsProps, ...priceAndStateProps],
            'Biżuteria i Zegarki': [...meskaBizuteriaKindsProps, ...priceAndStateProps],
            'Przebrania, kostiumy': [...meskiePrzebraniaKindsProps, ...priceAndStateProps],
            'Ślub i wesele': [...meskiSlubKindsProps, ...priceAndStateProps]
        },

        'Damska': {
            'Odzież': [...damskaOdziezKindsProps, ...clothesKindProps, ...priceAndStateProps, ...clothesSizeLettersProps],
            'Obuwie': [...damskieObuwieKindsProps, ...priceAndStateProps, ...adultShoeSizeProps],
            'Bielizna': [...damskaBieliznaKindsProps, ...damskaBieliznaKindsProps, ...priceAndStateProps, ...clothesSizeLettersProps],
            'Galanteria i Dodatki': [...damskaGalanteriaKindsProps, ...priceAndStateProps],
            'Biżuteria i Zegarki': [...damskaBizuteriaKindsProps, ...priceAndStateProps],
            'Ciąża i macierzyństwo': [...ciazaKindsProps, ...priceAndStateProps, ...clothesSizeLettersProps],
            'Ślub i wesele': [...damskiSlubKindsProps, ...priceAndStateProps],
            'Przebrania, kostiumy': [...damskiePrzebraniaKindsProps, ...priceAndStateProps],
        },

        'Dziecięca': [...clothesKindProps, ...priceAndStateProps, ...childClothesSizeProps]
    },

    // 'Dom i ogród': {
    //     'Meble': [...furnitureKindProps, ...priceAndStateProps],

    //     'Zdrowie': priceAndStateProps,

    //     'Sprzęt AGD': [...AGDKindProps, ...priceAndStateProps],

    //     'Ogród': priceAndStateProps,

    //     'Narzędzia': priceAndStateProps,

    //     'Materiały budowlane': priceAndStateProps,

    //     'Ogrzewanie': priceAndStateProps,

    //     'Wyposażenie wnętrz': [...indoorAccessoriesProps, ...stateProps, ...priceProps],

    //     'Pozostałe dom i ogród': priceProps

    // },

    'Dom i ogród': {

        'Meble': {
            'Akcesoria meblowe': [...priceAndStateProps],
            'Biuro': [...priceAndStateProps],
            'Kuchnia': [...priceAndStateProps],
            'Łazienka i toaleta': [...priceAndStateProps],
            'Meble do sypialni': [...priceAndStateProps],
            'Piwnica i garaż': [...priceAndStateProps],
            'Pokoje': [...priceAndStateProps],
            'Pokój dziecęcy': [...priceAndStateProps],
            'Pracownia': [...priceAndStateProps],
            'Przedpokój': [...priceAndStateProps],
            'Salon': [...priceAndStateProps],
            'Pozostałe': [...priceAndStateProps]
        },

        'Wyposażenie': {
            'Akcesoria do łazienki': [...priceAndStateProps],
            'Dekoracje i ozdoby': [...priceAndStateProps],
            'Dywany i dywaniki': [...priceAndStateProps],
            'Koszyki': [...priceAndStateProps],
            'Lustra': [...priceAndStateProps],
            'Obrusy, serwetki, podkładki': [...priceAndStateProps],
            'Oświetlenie': [...priceAndStateProps],
            'Pościel i koce': [...priceAndStateProps],
            'Przybory kuchenne': [...priceAndStateProps],
            'Pudełka, Szkatułki i Kuferki': [...priceAndStateProps],
            'Ręczniki': [...priceAndStateProps],
            'Sauny i akcesoria': [...priceAndStateProps],
            'Wentylatory domowe': [...priceAndStateProps],
            'Wystrój okien': [...priceAndStateProps],
            'Zabawne gadżety': [...priceAndStateProps],
            'Zastawa stołowa': [...priceAndStateProps],
            'Zegary': [...priceAndStateProps],
            'Świeczki, woski, olejki i akcesoria': [...priceAndStateProps],
            'Inteligentny dom': [...priceAndStateProps],
            'Ozdoby świąteczne i okolicznościowe': [...priceAndStateProps],
            'Pozostałe': [...priceAndStateProps]
        },

        'Budownictwo i Akcesoria': {
            'Dachy': [...priceAndStateProps],
            'Drabiny': [...priceAndStateProps],
            'Drzwi i bramy': [...priceAndStateProps],
            'Elektryka i akcesoria': [...priceAndStateProps],
            'Garaże': [...priceAndStateProps],
            'Hydraulika i armatura': [...priceAndStateProps],
            'Klimatyzacja i wentylacja': [...priceAndStateProps],
            'Kominki i akcesoria': [...priceAndStateProps],
            'Odkurzacze centralne': [...priceAndStateProps],
            'Ogrodzenia i bramy': [...priceAndStateProps],
            'Ogrzewanie': [...priceAndStateProps],
            'Okna i parapety': [...priceAndStateProps],
            'Podłogi': [...priceAndStateProps],
            'Schody': [...priceAndStateProps],
            'Sprzęt budowlany': [...priceAndStateProps],
            'Ściany i elewacje': [...priceAndStateProps],
            'Pozostałe': [...priceAndStateProps]
        },
        
        'Narzędzia': {
            'Agregaty prądotwórcze': [...priceAndStateProps],
            'Akcesoria i osprzęt': [...priceAndStateProps],
            'Bruzdownice': [...priceAndStateProps],
            'Frezarki': [...priceAndStateProps],
            'Gwoździarki': [...priceAndStateProps],
            'Imadła': [...priceAndStateProps],
            'Klucze': [...priceAndStateProps],
            'Lutownice': [...priceAndStateProps],
            'Mieszarki': [...priceAndStateProps],
            'Myjki ciśnieniowe': [...priceAndStateProps],
            'Młotki, przecinaki i dłuta': [...priceAndStateProps],
            'Młoty udarowe i wyburzeniowe': [...priceAndStateProps],
            'Nożyce do blachy': [...priceAndStateProps],
            'Odkurzacze piorące': [...priceAndStateProps],
            'Odkurzacze przemysłowe': [...priceAndStateProps],
            'Opalarki': [...priceAndStateProps],
            'Ostrzałki': [...priceAndStateProps],
            'Pistolety do kleju': [...priceAndStateProps],
            'Pistolety do pianki': [...priceAndStateProps],
            'Pistolety do silikonu': [...priceAndStateProps],
            'Pistolety malarskie': [...priceAndStateProps],
            'Piły i pilarki': [...priceAndStateProps],
            'Przecinarki do glazury': [...priceAndStateProps],
            'Przyrządy miernicze': [...priceAndStateProps],
            'Radia budowlane': [...priceAndStateProps],
            'Spawarki': [...priceAndStateProps],
            'Sprężarki i kompresory': [...priceAndStateProps],
            'Strugi': [...priceAndStateProps],
            'Szczypce, nożyce, obcęgi': [...priceAndStateProps],
            'Szlifierki i polerki': [...priceAndStateProps],
            'Wciągarki': [...priceAndStateProps],
            'Wiertarki i młotowiertarki': [...priceAndStateProps],
            'Wiertnice': [...priceAndStateProps],
            'Wkrętaki': [...priceAndStateProps],
            'Wkrętarki': [...priceAndStateProps],
            'Wyrzynarki': [...priceAndStateProps],
            'Zakrętarki udarowe': [...priceAndStateProps],
            'Zgrzewarki': [...priceAndStateProps],
            'Zszywacze': [...priceAndStateProps],
            '﻿Ściski': [...priceAndStateProps],
            'Zestawy narzędzi': [...priceAndStateProps],
            'Odzież ochronna': [...priceAndStateProps],
            '﻿Pozostałe': [...priceAndStateProps]
        },

        'Ogród': {
            'Agrowłókniny i agrotkaniny': [...priceAndStateProps],
            'Akcesoria pszczelarskie': [...priceAndStateProps],
            'Architektura ogrodowa': [...priceAndStateProps],
            'Baseny i akcesoria': [...priceAndStateProps],
            'Doniczki i pojemniki': [...priceAndStateProps],
            'Grillowanie': [...priceAndStateProps],
            'Kompostowniki': [...priceAndStateProps],
            'Markizy, osłony, maty': [...priceAndStateProps],
            'Meble ogrodowe': [...priceAndStateProps],
            'Narzędzia ogrodnicze': [...priceAndStateProps],
            'Nawadnianie': [...priceAndStateProps],
            'Nawozy i preparaty': [...priceAndStateProps],
            'Oczka wodne': [...priceAndStateProps],
            'Odstraszacze owadów': [...priceAndStateProps],
            'Odstraszacze zwierząt': [...priceAndStateProps],
            'Oświetlenie': [...priceAndStateProps],
            'Podłoża': [...priceAndStateProps],
            'Przedmioty dekoracyjne': [...priceAndStateProps],
            'Rośliny': [...priceAndStateProps],
            'Szamba i oczyszczalnie': [...priceAndStateProps],
            'Literatura': [...priceAndStateProps],
            'Pozostałe': [...priceAndStateProps]
        }
    },

    'Uroda': {
        'Makijaż': {
            'Baza pod cienie': [ ...priceProps ],
            'Cienie do powiek': [ ...priceProps ],
            'Eyelinery i kredki do oczy': [ ...priceProps ],
            'Kredki i pomady do brwi': [ ...priceProps ],
            'Tusze do rzęs': [ ...priceProps ],
            'Sztuczne rzęsy': [ ...priceProps ],
            'Błyszczyki': [ ...priceProps ],
            'Balsamy i scruby do ust': [ ...priceProps ],
            'Konturówki': [ ...priceProps ],
            'Szminki i pomadki': [ ...priceProps ],
            'Baza pod makijaż': [ ...priceProps ],
            'Korektory': [ ...priceProps ],
            'Kremy BB i CC': [ ...priceProps ],
            'Kremy tonizujące': [ ...priceProps ],
            'Podkłady': [ ...priceProps ],
            'Pudry': [ ...priceProps ],
            'Rozświetlacze i bronzery': [ ...priceProps ],
            'Róże': [ ...priceProps ],
            'Spraye utrwalające makijaż': [ ...priceProps ],
            'Palety do makijażu': [ ...priceProps ],
            'Kuferki kosmetyczne': [ ...priceProps ],
            'Pędzle i akcesoria': [ ...priceProps ],
            'Samoopalacze': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Manicure i pedicure': {
            'Akcesoria i przybory': [ ...priceAndStateProps ],
            'Akryle i żele': [ ...priceProps ],
            'Lakiery do paznokci': [ ...priceProps ],
            'Lakiery hybrydowe': [ ...priceProps ],
            'Lampy UV i LED': [ ...priceProps ],
            'Frezarki do paznokci': [ ...priceProps ],
            'Manicure japoński': [ ...priceProps ],
            'Nabłyszczacze, utrwalacze': [ ...priceProps ],
            'Odżywki do paznokci i skórek': [ ...priceProps ],
            'Ozdoby i przyrządy do zdobień': [ ...priceProps ],
            'Podkłady, bazy': [ ...priceProps ],
            'Sztuczne paznokcie, tipsy': [ ...priceProps ],
            'Urządzenia': [ ...priceAndStateProps ],
            'Zmywacze, odtłuszczacze, kleje': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Perfumy': {
            'Perfumy damskie': [ ...priceProps ],
            'Perfumy męskie': [ ...priceProps ],
            'Testery': [ ...priceProps ],
            'Dezodoranty dla kobiet': [ ...priceProps ],
            'Dezodoranty dla mężczyzn': [ ...priceProps ],
            'Zestawy perfum': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Pielęgnacja ciała': {
            'Balsamy do ciała': [ ...priceProps ],
            'Kąpiel i prysznic': [ ...priceProps ],
            'Kosmetyki do opalania': [ ...priceProps ],
            'Kremy na rozstępy': [ ...priceProps ],
            'Dłonie i stopy': [ ...priceProps ],
            'Golenie i depilacja': [ ...priceProps ],
            'Zestawy kosmetyków': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Pielęgnacja twarzy': {
            'Kremy do twarzy': [ ...priceProps ],
            'Kremy pod oczy': [ ...priceProps ],
            'Serum do twarzy': [ ...priceProps ],
            'Maseczki do twarzy': [ ...priceProps ],
            'Oczyszczanie i demakijaż': [ ...priceProps ],
            'Kolagen': [ ...priceProps ],
            'Kwasy, peelingi chemiczne': [ ...priceProps ],
            'Olejki do twarzy': [ ...priceProps ],
            'Peelingi i scruby': [ ...priceProps ],
            'Toniki, hydrolaty, wody termalne': [ ...priceProps ],
            'Urządzenia kosmetyczne': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Pielęgnacja włosów': {
            'Szampony': [ ...priceProps ],
            'Odżywki i maski do włosów': [ ...priceProps ],
            'Koloryzacja': [ ...priceProps ],
            'Keratynowe prostowanie włosów': [ ...priceProps ],
            'Lakiery do włosów': [ ...priceProps ],
            'Modelowanie': [ ...priceProps ],
            'Olejki do włosów': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Dla mężczyzny': {
            'Perfumy męskie': [ ...priceProps ],
            'Dezodoranty dla mężczyzn': [ ...priceProps ],
            'Golenie': [ ...priceProps ],
            'Pielęgnacja zarostu': [ ...priceProps ],
            'Kosmetyki dla mężczyzn': [ ...priceProps ],
            'Kosmetyki do włosów': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        }
    },

    'Kultura i rozrywka': {
        'Gry': {
            'Gry na konsole': [ ...consoleKindsProps, ...priceAndStateProps ],
            'Komputerowe PC': [ ...priceAndStateProps ],
            'Gry online (MMO)': [ ...priceAndStateProps ],
            'Poradniki': [ ...priceAndStateProps ],
            'Gry planszowe': [ ...priceAndStateProps ],
            'Gry karciane': [ ...priceAndStateProps ],
            'Gadżety': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Instrumenty': {
            'Gitary i akcesoria': [ ...priceAndStateProps ],
            'Instrumenty dęte': [ ...priceAndStateProps ],
            'Instrumenty klawiszowe i MIDI': [ ...priceAndStateProps ],
            'Instrumenty perkusyjne': [ ...priceAndStateProps ],
            'Instrumenty smyczkowe': [ ...priceAndStateProps ],
            'Miksery i powermiksery': [ ...priceAndStateProps ],
            'Wzmacniacze i nagłośnienie': [ ...priceAndStateProps ],
            'Kursy gry, nuty, śpiewniki': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Książki i komiksy': {
            'Audiobooki - mp3': [ ...priceProps ],
            'Literatura piękna, popularna i faktu': [ ...priceAndStateProps ],
            'Książki naukowe i popularnonaukowe': [ ...priceAndStateProps ],
            'Książki dla dzieci i młodzieży': [ ...priceAndStateProps ],
            'Książki do nauki języka obcego': [ ...priceAndStateProps ],
            'Książki obcojęzyczne': [ ...priceAndStateProps ],
            'Mapy, przewodniki, książki podróżnicze': [ ...priceAndStateProps ],
            'Poradniki i albumy': [ ...priceAndStateProps ],
            'Czasopisma i gazety': [ ...priceAndStateProps ],
            'Komiksy': [ ...priceAndStateProps ],
            'Podręczniki do szkół podst. i średnich': [ ...priceAndStateProps ],
            'Audiobooki': [ ...priceProps ],
            'Ebooki': [ ...priceProps ],
            'Kalendarze, gadżety i akcesoria': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Filmy': {
            'Filmy 3D': [ ...priceAndStateProps ],
            'Płyty DVD': [ ...priceAndStateProps ],
            'Filmy na Blu-Ray': [ ...priceAndStateProps ],
            'Płyty VCD': [ ...priceAndStateProps ],
            'Kasety wideo': [ ...priceAndStateProps ],
            'Gadżety, akcesoria': [ ...priceAndStateProps ]
        },

        'Muzyka': {
            'Płyty CD': [ ...priceAndStateProps ],
            'Płyty winylowe': [ ...priceAndStateProps ],
            'Kasety audio': [ ...priceAndStateProps ],
            'Gadżety muzyczne': [ ...priceAndStateProps ],
            'Akcesoria': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Bilety': {
            'Bilety': [ ...priceProps ],
            'Kupony, vouchery': [ ...priceProps ],
            'Opaski': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        }
    },

    'Zdrowie': {
        'Dermokosmetyki': {
            'Makijaż': [ ...priceProps ],
            'Maseczki': [ ...priceProps ],
            'Kremy pod oczy': [ ...priceProps ],
            'Olejki do twarzy': [ ...priceProps ],
            'Serum': [ ...priceProps ],
            'Kąpiel i prysznic': [ ...priceProps ],
            'Balsamy, kremy i masła': [ ...priceProps ],
            'Kuracje do włosów': [ ...priceProps ],
            'Inne': [ ...priceProps ]
        },

        'Higiena jamy ustnej': {
            'Nici dentystyczne': [ ...priceProps ],
            'Szczoteczki do zębów ': [ ...priceProps ],
            'Czyściki i wykałaczki': [ ...priceProps ],
            'Pielęgnacja protez i aparatów ortodontycznych': [ ...priceProps ],
            'Końcówki do irygatorów': [ ...priceProps ],
            'Akcesoria': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Korekcja wzroku': {
            'Pojemniki na soczewki': [ ...priceAndStateProps ],
            'Soczewki i szkła do okularów': [ ...priceAndStateProps ],
            'Akcesoria i dodatki': [ ...priceAndStateProps ]
        },

        'Medycyna naturalna': {
            'Akcesoria naturalne': [ ...priceProps ],
            'Soki naturalne': [ ...priceProps ],
            'Inne produkty naturalne': [ ...priceProps ],
            'Spirulina': [ ...priceProps ],
            'Chlorella': [ ...priceProps ],
            'Bańki chińskie': [ ...priceAndStateProps ],
            'Świece do uszu': [ ...priceProps ],
            'Pozostałe': [ ...priceProps ]
        },

        'Sprzęt medyczny': {
            'Balkoniki i podpórki': [ ...priceAndStateProps ],
            'Masażery': [ ...priceAndStateProps ],
            'Obówie ortopedyczne': [ ...priceAndStateProps ],
            'Ochraniacze na buty': [ ...priceAndStateProps ],
            'Ortezy': [ ...priceAndStateProps ],
            'Sprzęt do ćwiczeń': [ ...priceAndStateProps ],
            'Sprzęt ortopedyczny': [ ...priceAndStateProps ],
            'Pozostały sprzęt medyczny': [ ...priceAndStateProps ]
        },

        'Suplementy diety': {
            'Pamięć i układ nerwowy': [ ...priceProps ],
            'Potencja i libido': [ ...priceProps ],
            'Stawy, kości i mięśnie': [ ...priceProps ],
            'Serce': [ ...priceProps ],
            'Układ moczowy': [ ...priceProps ],
            'Trawienie': [ ...priceProps ],
            'Oczy': [ ...priceProps ],
            'Pozostałe suplementy': [ ...priceProps ]
        },

        'Erotyka': {
            'Akcesoria i gadżety erotyczne': [ ...priceAndStateProps ],
            'Feromony i afrodyzjaki': [ ...priceProps ],
            'Filmy erotyczne': [ ...priceAndStateProps ],
            'Gry erotyczne': [ ...priceAndStateProps ],
            'Halki i koszulki erotyczne': [ ...priceAndStateProps ],
            'Literatura erotyczna': [ ...priceAndStateProps ],
            'Pozostałe produkty erotyczne': [ ...priceProps ]
        }
    },

    'Kolekcje i sztuka': {
        'Antyki i sztuka': {
            'Antyki': [ ...priceProps ],
            'Antykwariat': [ ...priceAndStateProps ],
            'Malarstwo': [ ...priceAndStateProps ],
            'Meble': [ ...priceAndStateProps ],
            'Porcelana': [ ...priceAndStateProps ],
            'Rysunek': [ ...priceAndStateProps ],
            'Sztuka współczesna': [ ...priceAndStateProps ],
            'Tkaniny': [ ...priceAndStateProps ],
            'Akcesoria plastyczne': [ ...priceAndStateProps ]
        },

        'Kolekcje': {
            'Filatelistyka': [ ...priceAndStateProps ],
            'Karty telefoniczne': [ ...priceAndStateProps ],
            'Medale i odznaczenia': [ ...priceAndStateProps ],
            'Militaria': [ ...priceAndStateProps ],
            'Modelarstwo': [ ...priceAndStateProps ],
            'Numizmatyka': [ ...priceAndStateProps ],
            'Pamiątki PRL-u': [ ...priceAndStateProps ],
            'Papiery wartościowe': [ ...priceAndStateProps ],
            'Pieniądz papierowy': [ ...priceAndStateProps ],
            'Pocztówki': [ ...priceAndStateProps ],
            'Trafika i birofilistyka': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Rękodzieło': {
            'Biżuteria - półprodukty': [ ...priceAndStateProps ],
            'Decoupage i scrapbooking': [ ...priceAndStateProps ],
            'Dziewiarstwo': [ ...priceAndStateProps ],
            'Filcowanie': [ ...priceAndStateProps ],
            'Masy do modelowania': [ ...priceAndStateProps ],
            'Quilling': [ ...priceAndStateProps ],
            'Szycie': [ ...priceAndStateProps ],
            'Literatura': [ ...priceAndStateProps ],
            'Przedmioty ręcznie wykonane': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Produkty inwestycyjne': {
            'Kamienie szlachetne': [ ...priceAndStateProps ],
            'Metale szlachetne': [ ...priceAndStateProps ],
            'Monety kolekcjonerskie': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        }
    },

    'Elektronika': {
        'RTV': {
            'TV': [ ...elektronikaTVkindsProps, ...priceAndStateProps ],
            'Audio': [ ...elektronikaAudioKindsProps, ...priceAndStateProps ],
            'Car audio': [ ...elektronikaCarAudioKindsProps, ...priceAndStateProps ],
            'Fotografia i kamery': [ ...elektronikaFotografiaKindsProps, ...priceAndStateProps ]
        },

        'AGD': {
            'Lodówki i zamrażarki': [ ...agdLodowkiKindsProps, ...priceAndStateProps ],
            'Pralki i suszarki': [ ...agdPralkiKindsProps, ...priceAndStateProps ],
            'Kuchnie': [ ...agdKuchnieKindsProps, ...priceAndStateProps ]
        },

        'AGD drobne': {
            'Do kuchni': [ ...agdDoKuchniKindsProps, ...priceAndStateProps ],
            'Do domu': [ ...agdDoDomuKindsProps, ...priceAndStateProps ],
            'Higiena i pielęgnacja': [ ...agdHigienaKindsProps, ...priceAndStateProps ]
        },

        'Telefony i akcesoria': {
            'Smartfony': [ ...telAkcSmartfonyKindsProps, ...priceAndStateProps ],
            'Tablety': [ ...telAkcTabletyKindsProps, ...priceAndStateProps ],
            'Czytniki e-booków': [ ...telAkcCzytnikiKindsProps, ...priceAndStateProps ],
            'Smartwatche': [ ...telAkcSmartwatcheKindsProps, ...priceAndStateProps ],
            'Akcesoria GSM': [ ...telAkcAkcesoriaKindsProps, ...priceAndStateProps ],
            'Multimedia': [ ...telAkcMultimediaKindsProps, ...priceAndStateProps ],
            'Telefony stacjonarne': [ ...telAkcTelefonyKindsProps, ...priceAndStateProps ],
            'Radiokomunikacja': [ ...telAkcRadiokomunikacjaKindsProps, ...priceAndStateProps ]
        },

        'Komputery i laptopy': {
            'Laptopy': [ ...laptopyKindsProps, ...priceAndStateProps ],
            'Komputery PC': [ ...komputeryPCKindsProps, ...priceAndStateProps ],
            'Gaming': [ ...gamingKindsProps, ...priceAndStateProps ],
            'Komponenty PC': [ ...komponentyPCKindsProps, ...priceAndStateProps ],
            'Peryferia': [ ...peryferiaKindsProps, ...priceAndStateProps ],
            'Drukarki skanery': [ ...drukarkiKindsProps, ...priceAndStateProps ]
        },

        'Konsole i automaty': {
            'Sony Playstation': [ ...sonyPlaystationKindsProps, ...priceAndStateProps ],
            'Microsoft Xbox': [ ...xboxKindsProps, ...priceAndStateProps ],
            'Nintendo': [ ...nintendoKindsProps, ...priceAndStateProps ],
            'Pozostałe konsole': [ ...priceAndStateProps ]
        }
    },

    'Motoryzacja': {
        'Samochody osobowe': [...carMakeProps, ...carModelProps, ...enginePowerProps, ...priceProps, ...fuelProps, ...gearBoxProps, ...productionYearProps, ...cabinTypeProps, ...makeCountryProps, ...engineVolumeProps, ...colorProps, ...steeringWheelProps, ...courseDistanceProps, ...workingOrderProps],

// 'Motocykle i Skutery': [...motorbikeCatProps, ...motorbikeMakeProps, ...priceProps, ...productionYearProps, ...motorbikeEngineVolumeProps, ...workingOrderProps, ...makeCountryProps],

// 'Dostawcze i Ciężarowe': [...truckCatProps, ...workingOrderProps, ...enginePowerProps, ...priceProps, ...fuelProps, ...engineVolumeProps, ...gearBoxProps, ...productionYearProps, ...makeCountryProps, ...courseDistanceProps],

// 'Przyczepy i Pojazdy Użytkowe': [...trailerCatProps, ...workingOrderProps, ...priceProps, ...productionYearProps],

// 'Części motocyklowe': [...motorcyclePartKindProps, ...stateProps, ...priceProps],

// 'Sprzęt car audio': priceAndStateProps,

// 'Pozostała motoryzacja': priceProps

        'Części samochodowe': {
            'Części karoserii': carPartAggregatedProps,
            'Filtry': carPartAggregatedProps,
            'Oświetlenie': carPartAggregatedProps,
            'Silniki i osprzęt': carPartAggregatedProps,
            'Układ chłodzenia silnika': carPartAggregatedProps,
            'Układ elektryczny, zapłon': carPartAggregatedProps,
            'Układ hamulcowy': carPartAggregatedProps,
            'Układ kierowniczy': carPartAggregatedProps,
            'Układ klimatyzacji': carPartAggregatedProps,
            'Układ napędowy': carPartAggregatedProps,
            'Układ paliwowy': carPartAggregatedProps,
            'Układ wentylacji': carPartAggregatedProps,
            'Układ wydechowy': carPartAggregatedProps,
            'Układ zawieszenia': carPartAggregatedProps,
            'Wycieraczki i spryskiwacze': carPartAggregatedProps,
            'Wyposażenie wnętrza': carPartAggregatedProps,
            'Ogrzewanie postojowe i chłodnictwo samochodowe': carPartAggregatedProps,
            'Tuning mechaniczny': carPartAggregatedProps,
            'Pozostałe': priceAndStateProps
        },

        'Opony i Felgi': {
            'Opony': [...carTireVehicleKinds, ...priceAndStateProps],
            'Felgi': [...carFelgiKinds, ...priceAndStateProps],
            'Koła (felgi z oponami)': [...carKolaKinds, ...priceAndStateProps],
            'Akcesoria do opon i felg': [...carAkcesoriaDoOponIFelgKinds, ...priceAndStateProps]
        },

        'Narzędzia i sprzęt warsztatowy': {
            'Blacharstwo i lakiernictwo': priceAndStateProps,
            'Diagnostyka i pomiary': priceAndStateProps,
            'Kompresory i akcesoria': priceAndStateProps,
            'Narzędzia do mycia i czyszczenia': priceAndStateProps,
            'Narzędzia elektryczne': priceAndStateProps,
            'Narzędzia pneumatyczne': priceAndStateProps,
            'Narzędzia ręczne': priceAndStateProps,
            'Normalia': priceAndStateProps,
            'Obsługa akumulatorów i układu elektrycznego': priceAndStateProps,
            'Obsługa klimatyzacji': priceProps,
            'Obsługa kół i ogumienia': priceProps,
            'Obsługa olejów, paliw i smarów': priceProps,
            'Obsługa silnika': priceProps,
            'Obsługa układu hamulcowego': priceProps,
            'Obsługa układu napędowego': priceProps,
            'Obsługa zawieszenia': priceProps,
            'Odzież i obuwie robocze': priceAndStateProps,
            'Wyposażenie warsztatu': priceAndStateProps,
            'Pozostałe': priceProps
        },

        'Akcesoria samochodowe': {
            'Akcesoria do tuningu': priceAndStateProps,
            'Apteczki, gaśnice, kamizelki, trójkąty': priceAndStateProps,
            'Bagażniki': priceAndStateProps,
            'Chlapacze': priceAndStateProps,
            'Czujniki i kamery cofania': priceAndStateProps,
            'Dywaniki': priceAndStateProps,
            'Elektronika samochodowa': priceAndStateProps,
            'Emblematy': priceAndStateProps,
            '﻿Foteliki samochodowe': priceAndStateProps,
            'Gadżety motoryzacyjne': priceAndStateProps,
            'Holowanie': priceAndStateProps,
            'Kanistry, lejki i pompki do paliwa': priceAndStateProps,
            'Literatura motoryzacyjna': priceAndStateProps,
            'Off-road': priceAndStateProps,
            'Organizery i siatki do bagażnika': priceAndStateProps,
            '﻿Osłony na szyby': priceAndStateProps,
            'Pióra wycieraczek': priceAndStateProps,
            'Pokrowce': priceAndStateProps,
            'Prostowniki i kable rozruchowe': priceAndStateProps,
            'Ramki do tablic rejestracyjnych': priceAndStateProps,
            'Skrobaczki do szyb': priceAndStateProps,
            'Tachografy i czytnini tachografów': priceAndStateProps,
            'Uchwyty, wieszaki': priceAndStateProps,
            'Zabezpieczenia': priceAndStateProps,
            'Żarówki': priceAndStateProps,
            'Pozostałe': priceProps
        },

        'Chemia': {
            'Oleje silnikowe': [...olejeSilnikoweKindsProps, ...priceProps],
            'Mycie i pielęgnacja': [...mycieIPielegnacjaKindsProps, ...priceProps],
            'Płyny eksploatacyjne': [...plynyEksploatacyjneKindsProps, ...priceProps],
            'Chemia blacharsko-lakiernicza': [...chemiaBlacharskoLakierniczaProps, ...priceProps],
            'Środki do napraw i zabezpieczania': [...srodkiDoNaprawKindsProps, ...priceProps]
        },

        'Części i akcesoria motocyklowe': {
            'Części motocyklowe': [...czesciMotocykloweKindsProps, ...priceAndStateProps],
            'Odzież motocyklowa': [...odziezMotocyklowaKindsProps, ...priceAndStateProps],
            'Akcesoria motocyklowe': [...akcesoriaMotocykloweKindsProps, ...priceAndStateProps],
            'Części do quadów': [...czesciDoQuadowKindsProps, ...priceAndStateProps],
            'Akcesoria do quadów': [...akcesoriaDoQuadowProps, ...priceAndStateProps]
        }
    },

    'Spożywcze': {
        'Owoce': [ ...priceProps ],
        'Warzywa': [ ...priceProps ],
        'Grzyby': [ ...priceProps ],
        'Przyprawy i zioła': [ ...priceProps ],
        'Owoce suszone, bakalie i orzechy': [ ...priceProps ],
        'Nabiał i jaja': [ ...priceProps ],
        'Pieczywo i cukiernia': [ ...priceProps ],
        'Mięso i produkty mięsne': [ ...priceProps ],
        'Ryby i produkty rybne': [ ...priceProps ],
        'Owoce morza': [ ...priceProps ],
        'Produkty sypkie': [ ...priceProps ],
        'Oliwa, olej, ocet i sosy': [ ...priceProps ],
        'Przetwory owocowe i warzywne': [ ...priceProps ],
        'Miód i pyłek pszczeli': [ ...priceProps ],
        'Słodycze i przekąski': [ ...priceProps ],
        'Mrożonki': [ ...priceProps ],
        'Kawa': [ ...priceProps ],
        'Herbata': [ ...priceProps ],
        'Napoje': [ ...priceProps ],
        'Dekoracje cukiernicze i dodatki spożywcze': [ ...priceProps ],
        'Akcesoria ': [ ...priceProps ],
        'Alkohole': [ ...priceProps ],
        'Dania gotowe': [ ...priceProps ],
        'Dietetyczne': [ ...priceProps ],
        'Wegetariańskie i wegańskie': [ ...priceProps ],
        'Zdrowa żywność ': [ ...priceProps ],
        'Superfood': [ ...priceProps ],
        'Zestawy prezentowe': [ ...priceProps ]
    },

    'Zwierzęta': {
        'Akcesoria i dodatki': [ ...priceAndStateProps ],
        'Kagańce': [ ...priceAndStateProps ],
        'Karma': [ ...priceProps ],
        'Kosmetyki i preparaty': [ ...priceProps ],
        'Legowiska': [ ...priceAndStateProps ],
        'Literatura i filmy': [ ...priceAndStateProps ],
        'Obroże, smycze, szelki ': [ ...priceAndStateProps ],
        'Przysmaki i witaminy': [ ...priceProps ],
        'Szczotki, trymery i grzebienie': [ ...priceAndStateProps ],
        'Transportery i torby': [ ...priceAndStateProps ],
        'Zabawki': [ ...priceAndStateProps ],
        'Żwirek': [ ...priceProps ],
        'Akwarystyka ': [ ...priceAndStateProps ],
        'Terrarystyka': [ ...priceAndStateProps ],
        'Pozostałe': [ ...priceProps ]
    },

    'Dzieci i młodzież': {
        'Zabawki i akcesoria': {
            'AGD': [ ...priceAndStateProps ],
            'Bujaki, skoczki': [ ...priceAndStateProps ],
            'Kąpiele': [ ...priceAndStateProps ],
            'Edukacyjne': [ ...priceAndStateProps ],
            'Figurki': [ ...priceAndStateProps ],
            'Kolejki i tory': [ ...priceAndStateProps ],
            'Majsterkowanie': [ ...priceAndStateProps ],
            'Maskotki': [ ...priceAndStateProps ],
            'Militarne': [ ...priceAndStateProps ],
            'Plastyczne': [ ...priceAndStateProps ],
            'Puzzle': [ ...priceAndStateProps ],
            'Samochody i pojazdy': [ ...priceAndStateProps ],
            'Samoloty i pokrewne': [ ...priceAndStateProps ],
            'Zdalnie sterowane': [ ...priceAndStateProps ],
            'Akcesoria ogrodnicze': [ ...priceAndStateProps ],
            'Baseny': [ ...priceAndStateProps ],
            'Do piaskownicy': [ ...priceAndStateProps ],
            'Do pływania': [ ...priceAndStateProps ],
            'Domki i namioty': [ ...priceAndStateProps ],
            'Gry i zabawy': [ ...priceAndStateProps ],
            'Huśtawki': [ ...priceAndStateProps ],
            'Meble ogrodowe': [ ...priceAndStateProps ],
            'Piaskownice': [ ...priceAndStateProps ],
            'Piłki': [ ...priceAndStateProps ],
            'Place zabaw': [ ...priceAndStateProps ],
            'Zjeżdżalnie': [ ...priceAndStateProps ],
            'Rowery tradycyjne': [ ...priceAndStateProps ],
            'Rowery trójkołowe': [ ...priceAndStateProps ],
            'Sanki': [ ...priceAndStateProps ],
            'Pojazdy elektryczne': [ ...priceAndStateProps ],
            'Deskorolki': [ ...priceAndStateProps ],
            'Gokarty': [ ...priceAndStateProps ],
            'Hulajnogi': [ ...priceAndStateProps ],
            'Jeździki': [ ...priceAndStateProps ],
            'Rolki i wrotki': [ ...priceAndStateProps ],
            'Samochody na pedaly': [ ...priceAndStateProps ],
            'Traktorki': [ ...priceAndStateProps ],
            'Łyżwy': [ ...priceAndStateProps ],
            'Akcesoria rowerowe': [ ...priceAndStateProps ],
            'Gry dla dzieci': [ ...priceAndStateProps ],
            'Trampoliny i akcesoria': [ ...priceAndStateProps ],
            'Zabawki ogrodowe': [ ...priceAndStateProps ],
            'Plecaki i torby': [ ...priceAndStateProps ],
            'Przybory szkolne': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Odzież dziecięca': {
            'Bielizna': [ ...priceAndStateProps ],
            'Odzież niemowlęca': [ ...priceAndStateProps ],
            'Bluzki': [ ...priceAndStateProps ],
            'Bluzy': [ ...priceAndStateProps ],
            'Bolerka': [ ...priceAndStateProps ],
            'Czapki i chustki': [ ...priceAndStateProps ],
            'Dresy': [ ...priceAndStateProps ],
            'Garnitury i Marynarki': [ ...priceAndStateProps ],
            'Golfy': [ ...priceAndStateProps ],
            'Kamizelki i bezrękawniki': [ ...priceAndStateProps ],
            'Kombinezony i śpiworki': [ ...priceAndStateProps ],
            'Koszule': [ ...priceAndStateProps ],
            'Krótkie spodenki': [ ...priceAndStateProps ],
            'Kurtki i płaszcze': [ ...priceAndStateProps ],
            'Kąpielówki': [ ...priceAndStateProps ],
            'Legginsy': [ ...priceAndStateProps ],
            'Rękawiczki': [ ...priceAndStateProps ],
            'Spodnie': [ ...priceAndStateProps ],
            'Spódniczki': [ ...priceAndStateProps ],
            'Stroje kąpielowe': [ ...priceAndStateProps ],
            'Sukienki': [ ...priceAndStateProps ],
            'Sweterki': [ ...priceAndStateProps ],
            'Szaliki': [ ...priceAndStateProps ],
            'Topy i koszulki': [ ...priceAndStateProps ],
            'Tuniki': [ ...priceAndStateProps ],
            'Komplety odzieży': [ ...priceAndStateProps ],
            'Piżamy i szlafroki': [ ...priceAndStateProps ],
            'Zestawy ubrań': [ ...priceAndStateProps ],
            'Akcesoria i ozdoby': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Obuwie': {
            'Baleriny': [ ...priceAndStateProps ],
            'Baletki': [ ...priceAndStateProps ],
            'Botki': [ ...priceAndStateProps ],
            'Obuwie dla niemowląt': [ ...priceAndStateProps ],
            'Kalosze': [ ...priceAndStateProps ],
            'Kapcie': [ ...priceAndStateProps ],
            'Klapki': [ ...priceAndStateProps ],
            'Kozaki': [ ...priceAndStateProps ],
            'Obuwie profilaktyczne': [ ...priceAndStateProps ],
            'Sandałki': [ ...priceAndStateProps ],
            'Sportowe': [ ...priceAndStateProps ],
            'Śniegowce': [ ...priceAndStateProps ],
            'Trampki': [ ...priceAndStateProps ],
            'Trzewiki i półbuty': [ ...priceAndStateProps ],
            'Wkładki do butów': [ ...priceAndStateProps ],
            'Pozostałe obuwie': [ ...priceAndStateProps ]
        },

        'Wyprawka niemowlaka': {
            'Body': [ ...priceAndStateProps ],
            'Artykuły higieniczne': [ ...priceAndStateProps ],
            'Kosmetyki': [ ...priceAndStateProps ],
            'Nocniki i nakładki': [ ...priceAndStateProps ],
            'Pieluszki i chusteczki': [ ...priceAndStateProps ],
            'Przewijaki': [ ...priceAndStateProps ],
            'Ręczniki i okrycia': [ ...priceAndStateProps ],
            'Wanienki i akcesoria do kąpieli': [ ...priceAndStateProps ],
            'Higiena pozostałe': [ ...priceAndStateProps ],
            'Butelki akcesoria do karmienia': [ ...priceAndStateProps ],
            'Krzesełka do karmienia': [ ...priceAndStateProps ],
            'Naczynia i sztućce dla dzieci': [ ...priceAndStateProps ],
            'Podgrzewacze do butelek': [ ...priceAndStateProps ],
            'Sterylizatory': [ ...priceAndStateProps ],
            'Śliniaki': [ ...priceAndStateProps ],
            'Żywność dla dzieci': [ ...priceAndStateProps ],
            'Pozostałe produkty do karmienia': [ ...priceAndStateProps ],
            'Akcesoria dla mamy': [ ...priceAndStateProps ],
            'Bezpieczeństwo dla dzieci': [ ...priceAndStateProps ],
            'Laktatory i akcesoria': [ ...priceAndStateProps ],
            'Leżaczki i huśtawki': [ ...priceAndStateProps ],
            'Nosidełka': [ ...priceAndStateProps ],
            'Smoczki i gryzaki': [ ...priceAndStateProps ],
            'Termomoetry': [ ...priceAndStateProps ],
            'Urządzenia medyczne': [ ...priceAndStateProps ],
            'Pozostałe akcesoria dla dzieci': [ ...priceAndStateProps ],
            'Odzież niemowlęca': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Pokój dziecięcy': {
            'Akcesoria': [ ...priceAndStateProps ],
            'Dekoracje i ozdoby': [ ...priceAndStateProps ],
            'Dywany i firaniki': [ ...priceAndStateProps ],
            'Meble dziecięce': [ ...priceAndStateProps ],
            'Oświetlenie': [ ...priceAndStateProps ],
            'Pozostałe wyposażenie': [ ...priceAndStateProps ]
        },

        'Wózki i foteliki': {
            'Akcesoria': [ ...priceAndStateProps ],
            'Wózki ': [ ...priceAndStateProps ],
            'Pozostałe wózki': [ ...priceAndStateProps ],
            'Podstawki, siedziska samochodowe': [ ...priceAndStateProps ],
            'Pozostałe foteliki i akcesoria': [ ...priceAndStateProps ]
        }
    },

    'Sport i turystyka': {
        'Bieganie': {
            'Obuwie': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Odżywki i suplementy': [ ...priceAndStateProps ],
            'Akcesoria': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Elektronika sportowa': {
            'Echosondy': [ ...priceAndStateProps ],
            'GPS': [ ...priceAndStateProps ],
            'Kamery sportowe i akcesoria': [ ...priceAndStateProps ],
            'Krokomierze (pedometry)': [ ...priceAndStateProps ],
            'Stopery': [ ...priceAndStateProps ],
            'Wagi': [ ...priceAndStateProps ],
            'Zegarki sportowe, smartbandy': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Militaria': {
            'Akcesoria ochronne': [ ...priceAndStateProps ],
            'ASG': [ ...priceAndStateProps ],
            'Myślistwo': [ ...priceAndStateProps ],
            'Noże, maczety': [ ...priceAndStateProps ],
            'Obuwie': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Optyka': [ ...priceAndStateProps ],
            'Paintball': [ ...priceAndStateProps ],
            'Proce i dmuchawki': [ ...priceAndStateProps ],
            'Samoobrona': [ ...priceAndStateProps ],
            'Wiatrówki': [ ...priceAndStateProps ],
            'Łucznictwo': [ ...priceAndStateProps ],
            'Akcesoria': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Rowery': {
            'Rowery': [ ...priceAndStateProps ],
            'Akcesoria': [ ...priceAndStateProps ],
            'Części': [ ...priceAndStateProps ],
            'Kaski': [ ...priceAndStateProps ],
            'Narzędzia i smary': [ ...priceAndStateProps ],
            'Obuwie': [ ...priceAndStateProps ],
            'Ochraniacze': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Okulary': [ ...priceAndStateProps ],
            'Literatura, instrukcje': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Siłownia i fitness': {
            'Trening fitness': [ ...priceAndStateProps ],
            'Trening siłowy': [ ...priceAndStateProps ],
            'Obuwie': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Suplementy i odżywki': [ ...priceAndStateProps ],
            'Ściągacze i stabilizatory': [ ...priceAndStateProps ],
            'Akcesoria treningowe': [ ...priceAndStateProps ],
            'Literatura i filmy': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Skating': {
            'Deskorolki elektryczne': [ ...priceAndStateProps ],
            'Deskorolki kompletne': [ ...priceAndStateProps ],
            'Fingerboard, fingerbike': [ ...priceAndStateProps ],
            'Hulajnogi': [ ...priceAndStateProps ],
            'Longboard': [ ...priceAndStateProps ],
            'Rolki': [ ...priceAndStateProps ],
            'Trickboard': [ ...priceAndStateProps ],
            'Waveboard': [ ...priceAndStateProps ],
            'Wrotki': [ ...priceAndStateProps ],
            'Części': [ ...priceAndStateProps ],
            'Obuwie': [ ...priceAndStateProps ],
            'Ochraniacze, kaski': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Akcesoria': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Sporty drużynowe': {
            'Baseball': [ ...priceAndStateProps ],
            'Futbol amerykański': [ ...priceAndStateProps ],
            'Hokej i unihokej': [ ...priceAndStateProps ],
            'Koszykówka': [ ...priceAndStateProps ],
            'Piłka nożna': [ ...priceAndStateProps ],
            'Piłka ręczna': [ ...priceAndStateProps ],
            'Rugby': [ ...priceAndStateProps ],
            'Siatkówka': [ ...priceAndStateProps ],
            'Waterpolo': [ ...priceAndStateProps ],
            'Dla kibiców': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Sporty ekstremalne': {
            'Lotnictwo': [ ...priceAndStateProps ],
            'Paralotniarstwo': [ ...priceAndStateProps ],
            'Spadochroniarstwo': [ ...priceAndStateProps ],
            'Szybownictwo': [ ...priceAndStateProps ],
            'Wspinaczka': [ ...priceAndStateProps ],
            'Kitesurfing': [ ...priceAndStateProps ],
            'Surfing': [ ...priceAndStateProps ],
            'Nurkowanie': [ ...priceAndStateProps ],
            'Akcesoria': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Sporty towarzyskie i rekreacja': {
            'Bilard': [ ...priceAndStateProps ],
            'Bowling i kręgle': [ ...priceAndStateProps ],
            'Bule': [ ...priceAndStateProps ],
            'Dart': [ ...priceAndStateProps ],
            'Golf': [ ...priceAndStateProps ],
            'Jeździectwo': [ ...priceAndStateProps ],
            'Nordic Walking': [ ...priceAndStateProps ],
            'Piłkarzyki': [ ...priceAndStateProps ],
            'Sporty z psami': [ ...priceAndStateProps ],
            'Slackline': [ ...priceAndStateProps ],
            'Taniec': [ ...priceAndStateProps ],
            'Żonglerka': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Sporty walki': {
            'Boks': [ ...priceAndStateProps ],
            'MMA': [ ...priceAndStateProps ],
            'Szermierka': [ ...priceAndStateProps ],
            'Walki wschodu': [ ...priceAndStateProps ],
            'Zapasy': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Sporty wodne': {
            'Kajakarstwo': [ ...priceAndStateProps ],
            'Kitesurfing': [ ...priceAndStateProps ],
            'Nurkowanie': [ ...priceAndStateProps ],
            'Pływanie': [ ...priceAndStateProps ],
            'Skimboard': [ ...priceAndStateProps ],
            'SUP': [ ...priceAndStateProps ],
            'Surfing': [ ...priceAndStateProps ],
            'Wakeboard i narty wodne': [ ...priceAndStateProps ],
            'Windsurfing': [ ...priceAndStateProps ],
            'Żeglarstwo': [ ...priceAndStateProps ],
            'Sprzęt ratunkowy i asekuracyjny': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Sporty zimowe': {
            'Akcesoria narciarskie i snowboardowe': [ ...priceAndStateProps ],
            'Buty narciarskie': [ ...priceAndStateProps ],
            'Buty snowboardowe': [ ...priceAndStateProps ],
            'Deski snowboardowe': [ ...priceAndStateProps ],
            'Gogle i okulary': [ ...priceAndStateProps ],
            'Kaski': [ ...priceAndStateProps ],
            'Kijki': [ ...priceAndStateProps ],
            'Narty': [ ...priceAndStateProps ],
            'Snowpark': [ ...priceAndStateProps ],
            'Wiązania narciarskie i snowboardowe': [ ...priceAndStateProps ],
            'Łyżwiarstwo': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Sanki': [ ...priceAndStateProps ],
            'Snowkiting': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Tenis i pokrewne': {
            'Badminton': [ ...priceAndStateProps ],
            'Squash': [ ...priceAndStateProps ],
            'Tenis stołowy': [ ...priceAndStateProps ],
            'Tenis ziemny': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Wędkarstwo': {
            'Akcesoria wędkarskie': [ ...priceAndStateProps ],
            'Kołowrotki': [ ...priceAndStateProps ],
            'Obuwie': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Sprzęt elektroniczny': [ ...priceAndStateProps ],
            'Torby, pojemniki, krzesełka': [ ...priceAndStateProps ],
            'Wędziska': [ ...priceAndStateProps ],
            'Przynęty': [ ...priceAndStateProps ],
            'Zanęty': [ ...priceAndStateProps ],
            'Literatura': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Turystyka': {
            'Apteczki i środki na owady': [ ...priceAndStateProps ],
            'Bagaż': [ ...priceAndStateProps ],
            'Higiena': [ ...priceAndStateProps ],
            'Kuchnia turystyczna': [ ...priceAndStateProps ],
            'Latarki i lampy': [ ...priceAndStateProps ],
            'Na plażę/Na piknik': [ ...priceAndStateProps ],
            'Noże, scyzoryki i multitoole': [ ...priceAndStateProps ],
            'Obuwie': [ ...priceAndStateProps ],
            'Odzież': [ ...priceAndStateProps ],
            'Ogień i ciepło': [ ...priceAndStateProps ],
            'Orientacja w terenie': [ ...priceAndStateProps ],
            'Meble turystyczne': [ ...priceAndStateProps ],
            'Namioty i akcesoria': [ ...priceAndStateProps ],
            'Plecaki': [ ...priceAndStateProps ],
            'Pontony i łodzie': [ ...priceAndStateProps ],
            'Śpiwory, materace i karimaty': [ ...priceAndStateProps ],
            'Akcesoria turystyczne': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        },

        'Kolekcje': {
            'Autografy': [ ...priceProps ],
            'Bilety kolekcjonerskie': [ ...priceProps ],
            'Gadżety kolekcjonerskie': [ ...priceAndStateProps ],
            'Karty sportowe': [ ...priceAndStateProps ],
            'Medale i plakiety': [ ...priceAndStateProps ],
            'Naklejki (vlepki)': [ ...priceAndStateProps ],
            'Odznaki': [ ...priceAndStateProps ],
            'Programy sportowe': [ ...priceAndStateProps ],
            'Proporczyki': [ ...priceAndStateProps ],
            'Puchary i statuetki': [ ...priceAndStateProps ],
            'Szaliki': [ ...priceAndStateProps ],
            'Zdjęcia i plakaty': [ ...priceAndStateProps ],
            'Pozostałe': [ ...priceAndStateProps ]
        }
    },

    'Nieruchomości': {
        'Mieszkania': [...realEstateCatProps, ...realEstateFlatBuildingTypeProps, ...priceProps, ...realEstateAreaProps, ...realEstateFlatLevelProps, ...roomFurnitureProps, ...realEstateFlatRoomCountProps],

        'Domy': [...realEstateCatProps, ...realEstateBuildingTypeProps, ...priceProps, ...realEstateAreaProps, ...realEstatePlotAreaProps, ...realEstateLevelCount],

        'Działki': [...realEstateCatProps, ...realEstatePlotKindProps, ...priceProps, ...realEstateAreaProps],

        'Biura i Lokale': [...realEstateCatProps, ...realEstateUseCaseProps, ...priceProps, ...realEstateAreaProps, ...realEstateLevelProps],

        'Garaże i Parkingi': [...realEstateCatProps, ...priceProps, ...realEstateAreaProps],

        'Noclegi': [...priceProps, ...boardingTypeProps, ...numberOfPersonsProps],

        'Stancje i Pokoje': [...priceProps, ...roomFurnitureProps, ...roomKindProps, ...roomPrefProps],

        'Hale i Magazyny': [...realEstateCatProps, ...priceProps, ...realEstateAreaProps],

        'Pozostałe nieruchomości': [...realEstateCatProps, ...priceProps]
    },

    // 'Elektronika': {
    //     'Telefony komórkowe': [...phoneMakeProps, ...priceAndStateProps, ...workingOrderProps],

    //     'Akcesoria telefoniczne': priceAndStateProps,

    //     'Komputery': [...computerKindsProps, ...stateProps, ...priceProps],

    //     'Tablety': priceAndStateProps,

    //     'Telewizory': priceAndStateProps,

    //     'Gry i Konsole': priceAndStateProps,

    //     'Fotografia': priceAndStateProps,

    //     'Sprzęt audio': priceAndStateProps,

    //     'Pozostała elektronika': priceAndStateProps
    // },

    // 'Rolnictwo': {
    //     'Ciągniki': [...priceProps, ...powerProps, ...motorHoursProps, productionYearProps],

    //     'Maszyny rolnicze': [...priceProps, ...ruralMachineKindProps , ...productionYearProps],

    //     'Przyczepy': [...priceProps, ...productionYearProps],

    //     'Części do maszyn rolniczych': priceProps,

    //     'Opony rolnicze': priceProps,

    //     'Produkty rolne': priceProps,

    //     'Giełda zwierząt': [...priceProps, ...ruralAnimalProps],

    //     'Ryneczek': priceProps,

    //     'Pozostałe rolnicze': priceProps
    // },

    // 'Zwierzęta': {
    //     'Psy': [...dogRaceProps, ...priceProps],

    //     'Koty': [...catRaceProps, ...priceProps],

    //     'Ptaki': priceProps,

    //     'Gryzonie i króliki': priceProps,

    //     'Konie': priceProps,

    //     'Akwarystyka': [...subnauticaProps, ...priceAndStateProps],

    //     'Akcesoria dla zwierząt': priceProps,

    //     'Pozostałe zwierzęta': priceProps
    // },

    // 'Dla dzieci': {
    //     'Zabawki': priceAndStateProps,

    //     'Wózki dziecięce': priceAndStateProps,

    //     'Foteliki - Nosidełka': priceAndStateProps,

    //     'Ubranka': [...priceAndStateProps, ...childGenderProps, ...childClothesSizeProps],

    //     'Buciki': [...priceAndStateProps, ...childGenderProps, ...childShoeSizeProps],

    //     'Meble dla dziecka': priceAndStateProps,

    //     'Pozostałe dla dzieci': priceProps
    // },

    // 'Sport i hobby': {
    //     'Kolekcje': priceProps,

    //     'Militaria': [...priceProps, ...stateProps],

    //     'Rowery': priceAndStateProps,

    //     'Fitness': priceAndStateProps,

    //     'Sporty zimowe': priceAndStateProps,

    //     'Odzież sportowa': [...priceAndStateProps, ...genderWithUnisexProps, ...clothesSizeLettersProps],

    //     'Obuwie sportowe': [...priceAndStateProps, ...genderWithUnisexProps, ...adultShoeSizeProps],

    //     'Pozostały sport i hobby': priceProps
    // },

    // 'Muzyka i edukacja': {
    //     'Ksiązki': [...bookKindProps, ...stateProps, ...priceProps, ...publishYearProps],

    //     'Muzyka': priceAndStateProps,

    //     'Filmy': priceAndStateProps,

    //     'Instrumenty': priceAndStateProps,

    //     'Sprzęt muzyczny': priceAndStateProps,

    //     'Materiały językowe': priceAndStateProps,

    //     'Pozostała muzyka i edukacja': priceProps
    // },

    // 'Ślub i Wesele': {
    //     'Moda ślubna' : {
    //         'Biżuteria ślubna': [...priceProps, ...stateProps, ...genderProps],

    //         'Buty ślubne': [...priceProps, ...stateProps, ...genderProps, ...shoeSizeProps],

    //         'Skunie ślubne': [...priceProps, ...stateProps, ...dressSizeProps],

    //         'Garnitury ślubne': priceAndStateProps,

    //         'Obrączki': priceAndStateProps,

    //         'Pozostałe': priceAndStateProps
    //     },

    //     'Usługi ślubne': {
    //         'Fotografia i filmowanie': null,

    //         'Dekorowanie': null,

    //         'Oprawa muzyczna': null,

    //         'Pojazdy do ślubu': null,

    //         'Torty i Catering': null,

    //         'Pozostałe': null
    //     },

    //     'Akcesoria ślubne': {
    //         'Zaproszenia ślubne': priceProps,

    //         'Dekoracje ślubne': priceAndStateProps,

    //         'Pozostałe': priceProps
    //     }
    // }
}

// LEGACY CAATEGORIES


// const categoryTree = {
//     'Motoryzacja': {
//         'Samochody osobowe': [...carMakeProps, ...carModelProps, ...enginePowerProps, ...priceProps, ...fuelProps, ...gearBoxProps, ...productionYearProps, ...cabinTypeProps, ...makeCountryProps, ...engineVolumeProps, ...colorProps, ...steeringWheelProps, ...courseDistanceProps, ...workingOrderProps],

//         'Motocykle i Skutery': [...motorbikeCatProps, ...motorbikeMakeProps, ...priceProps, ...productionYearProps, ...motorbikeEngineVolumeProps, ...workingOrderProps, ...makeCountryProps],

//         'Dostawcze i Ciężarowe': [...truckCatProps, ...workingOrderProps, ...enginePowerProps, ...priceProps, ...fuelProps, ...engineVolumeProps, ...gearBoxProps, ...productionYearProps, ...makeCountryProps, ...courseDistanceProps],

//         'Przyczepy i Pojazdy Użytkowe': [...trailerCatProps, ...workingOrderProps, ...priceProps, ...productionYearProps],

//         'Części samochodowe': [...vehicleProps, ...carPartKindProps, ...priceAndStateProps],

//         'Części motocyklowe': [...motorcyclePartKindProps, ...stateProps, ...priceProps],

//         'Opony i Felgi': [...carWheelCatProps, ...stateProps, ...priceProps, ...vehicleProps],

//         'Sprzęt car audio': priceAndStateProps,

//         'Pozostała motoryzacja': priceProps
//     },

//     'Nieruchomości': {
//         'Mieszkania': [...realEstateCatProps, ...realEstateFlatBuildingTypeProps, ...priceProps, ...realEstateAreaProps, ...realEstateFlatLevelProps, ...roomFurnitureProps, ...realEstateFlatRoomCountProps],

//         'Domy': [...realEstateCatProps, ...realEstateBuildingTypeProps, ...priceProps, ...realEstateAreaProps, ...realEstatePlotAreaProps, ...realEstateLevelCount],

//         'Działki': [...realEstateCatProps, ...realEstatePlotKindProps, ...priceProps, ...realEstateAreaProps],

//         'Biura i Lokale': [...realEstateCatProps, ...realEstateUseCaseProps, ...priceProps, ...realEstateAreaProps, ...realEstateLevelProps],

//         'Garaże i Parkingi': [...realEstateCatProps, ...priceProps, ...realEstateAreaProps],

//         'Noclegi': [...priceProps, ...boardingTypeProps, ...numberOfPersonsProps],

//         'Stancje i Pokoje': [...priceProps, ...roomFurnitureProps, ...roomKindProps, ...roomPrefProps],

//         'Hale i Magazyny': [...realEstateCatProps, ...priceProps, ...realEstateAreaProps],

//         'Pozostałe nieruchomości': [...realEstateCatProps, ...priceProps]
//     },

//     'Dom i ogród': {
//         'Meble': [...furnitureKindProps, ...priceAndStateProps],

//         'Zdrowie': priceAndStateProps,

//         'Sprzęt AGD': [...AGDKindProps, ...priceAndStateProps],

//         'Ogród': priceAndStateProps,

//         'Narzędzia': priceAndStateProps,

//         'Materiały budowlane': priceAndStateProps,

//         'Ogrzewanie': priceAndStateProps,

//         'Wyposażenie wnętrz': [...indoorAccessoriesProps, ...stateProps, ...priceProps],

//         'Pozostałe dom i ogród': priceProps

//     },

//     'Elektronika': {
//         'Telefony komórkowe': [...phoneMakeProps, ...priceAndStateProps, ...workingOrderProps],

//         'Akcesoria telefoniczne': priceAndStateProps,

//         'Komputery': [...computerKindsProps, ...stateProps, ...priceProps],

//         'Tablety': priceAndStateProps,

//         'Telewizory': priceAndStateProps,

//         'Gry i Konsole': priceAndStateProps,

//         'Fotografia': priceAndStateProps,

//         'Sprzęt audio': priceAndStateProps,

//         'Pozostała elektronika': priceAndStateProps
//     },

//     'Moda': {
//         'Ubrania': [...clothesKindProps, ...priceAndStateProps, ...genderWithUnisexProps, ...clothesSizeLettersProps ],

//         'Buty': [...priceAndStateProps, ...genderWithUnisexProps, ...adultShoeSizeProps],

//         'Bielizna': [...priceAndStateProps, ...genderProps],

//         'Odzież ciążowa': [...priceAndStateProps, ...clothesSizeLettersProps],

//         'Dodatki': [...priceAndStateProps, ...genderWithUnisexProps],

//         'Biżuteria': [...priceAndStateProps, ...genderProps],

//         'Torebki': priceAndStateProps,

//         'Zegarki': [...priceAndStateProps, ...genderWithUnisexProps],

//         'Kosmetyki i perfumy': [...priceAndStateProps, ...genderWithUnisexProps],

//         'Pozostała moda': priceAndStateProps
//     },

//     'Rolnictwo': {
//         'Ciągniki': [...priceProps, ...powerProps, ...motorHoursProps, productionYearProps],

//         'Maszyny rolnicze': [...priceProps, ...ruralMachineKindProps , ...productionYearProps],

//         'Przyczepy': [...priceProps, ...productionYearProps],

//         'Części do maszyn rolniczych': priceProps,

//         'Opony rolnicze': priceProps,

//         'Produkty rolne': priceProps,

//         'Giełda zwierząt': [...priceProps, ...ruralAnimalProps],

//         'Ryneczek': priceProps,

//         'Pozostałe rolnicze': priceProps
//     },

//     'Zwierzęta': {
//         'Psy': [...dogRaceProps, ...priceProps],

//         'Koty': [...catRaceProps, ...priceProps],

//         'Ptaki': priceProps,

//         'Gryzonie i króliki': priceProps,

//         'Konie': priceProps,

//         'Akwarystyka': [...subnauticaProps, ...priceAndStateProps],

//         'Akcesoria dla zwierząt': priceProps,

//         'Pozostałe zwierzęta': priceProps
//     },

//     'Dla dzieci': {
//         'Zabawki': priceAndStateProps,

//         'Wózki dziecięce': priceAndStateProps,

//         'Foteliki - Nosidełka': priceAndStateProps,

//         'Ubranka': [...priceAndStateProps, ...childGenderProps, ...childClothesSizeProps],

//         'Buciki': [...priceAndStateProps, ...childGenderProps, ...childShoeSizeProps],

//         'Meble dla dziecka': priceAndStateProps,

//         'Pozostałe dla dzieci': priceProps
//     },

//     'Sport i hobby': {
//         'Kolekcje': priceProps,

//         'Militaria': [...priceProps, ...stateProps],

//         'Rowery': priceAndStateProps,

//         'Fitness': priceAndStateProps,

//         'Sporty zimowe': priceAndStateProps,

//         'Odzież sportowa': [...priceAndStateProps, ...genderWithUnisexProps, ...clothesSizeLettersProps],

//         'Obuwie sportowe': [...priceAndStateProps, ...genderWithUnisexProps, ...adultShoeSizeProps],

//         'Pozostały sport i hobby': priceProps
//     },

//     'Muzyka i edukacja': {
//         'Ksiązki': [...bookKindProps, ...stateProps, ...priceProps, ...publishYearProps],

//         'Muzyka': priceAndStateProps,

//         'Filmy': priceAndStateProps,

//         'Instrumenty': priceAndStateProps,

//         'Sprzęt muzyczny': priceAndStateProps,

//         'Materiały językowe': priceAndStateProps,

//         'Pozostała muzyka i edukacja': priceProps
//     },

//     'Ślub i Wesele': {
//         'Moda ślubna' : {
//             'Biżuteria ślubna': [...priceProps, ...stateProps, ...genderProps],

//             'Buty ślubne': [...priceProps, ...stateProps, ...genderProps, ...shoeSizeProps],

//             'Skunie ślubne': [...priceProps, ...stateProps, ...dressSizeProps],

//             'Garnitury ślubne': priceAndStateProps,

//             'Obrączki': priceAndStateProps,

//             'Pozostałe': priceAndStateProps
//         },

//         'Usługi ślubne': {
//             'Fotografia i filmowanie': null,

//             'Dekorowanie': null,

//             'Oprawa muzyczna': null,

//             'Pojazdy do ślubu': null,

//             'Torty i Catering': null,

//             'Pozostałe': null
//         },

//         'Akcesoria ślubne': {
//             'Zaproszenia ślubne': priceProps,

//             'Dekoracje ślubne': priceAndStateProps,

//             'Pozostałe': priceProps
//         }
//     }
// }


//
//
// const seedData = {
//     'Eletkronika': ['RTV i AGD', 'Komputery', 'Mac', 'PC', 'Konsole', 'Telefony i akcesoria', 'Fotografia cyfrowa'],
//     'Moda': ['Obuwie', 'Odzież', 'Biżuteria', 'Zegarki'],
//     'Dom i ogród': ['Ogród', 'Kwiaty', 'Meble', 'Wyposażenie wnętrz', 'Zwierzęta'],
//     'Dziecko': ['Zabawki', 'Ubranka', 'Żywność', 'Artykuły szkolne'],
//     'Rozrywka i gry': ['Gry', 'Książka', 'Komiks', 'Muzyka', 'Film', 'Warhammer, gry bitewne', 'Gry planszowe'],
//     'Sport': ['Rower', 'Turystyka', 'Boks', 'Bieganie', 'Sztuki walki'],
//     'Motoryzacja': ['Samochód', 'Motocykl', 'Quad', 'Opony', 'Części samochodowe'],
//     'Sztuka': ['Malarstwo', 'Rysunek', 'Antyki', 'Rękodzieło', 'Wyroby WTZu', 'Artykuły kreatywne'],
//     'Firma': ['Oprogramowanie', 'Księgowość', 'Akcesoria przemysłowe', 'Nieruchomości', 'Akcesoria BHP'],
//     'Zdrowie': ['Zioła', 'Ubezpieczenie', 'Poradniki', 'Suplementy'],
//     'Uroda': ['Makijaż', 'Włosy', 'Kosmetyki', 'Twarz i ciało']
// };

module.exports = categoryTree;
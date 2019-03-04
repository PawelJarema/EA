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
    kind: 'Singular',
    values: ['Nadwozie', 'Filtry', 'Oświetlenie', 'Silniki', 'Tuning', 'Układ elektryczny, zapłon', 'Układ hamulcowy', 'Układ napędowy', 'Układ paliwowy', 'Układ wydechowy', 'Układ zawieszenia', 'Zabytkowe', 'Pozostałe']
}];

const odziezMotocyklowaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Kaski', 'Chusty', 'Czapki', 'Gogle', 'Kamizelki', 'Kombinezony', 'Kominiarki', 'Koszulki i bluzy', 'Kurtki', 'Obuwie', 'Ochraniacze', 'Pasy nerkowe', 'Rękawice', 'Skarpety', 'Slidery', 'Spodnie', 'Konserwacja odzieży', 'Pozostałe']
}];

const akcesoriaMotocykloweKindsProps = [{
    name: 'Kategoria',
    kind: 'Singular',
    values: ['Alarmy', 'Bagażniki', 'Blokady', 'Crash pady', 'Gmole', 'Gniazda zapalniczki', 'Interkomy', 'Kufry', 'Lokalizatory i nawigacje', 'Oparcia', 'Osłony chłodnicy', 'Plecaki', 'Pokrowce', 'Ramki tablic', 'Sakwy i torby motocyklowe', '﻿Saszetki', 'Siatki bagażowe', 'Stelaże', 'Stojaki, podnośniki', 'Torby na bak', 'Uchwyty', 'Pozostałe']
}];

const czesciDoQuadowKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Elementy nadwozia', 'Filtry', 'Koła, felgi', 'Oświetlenie', 'Silniki i osprzęt', 'Układ elektryczny, zapłon', 'Układ hamulcowy', 'Układ napędowy', 'Układ paliwowy', 'Układ wydechowy', 'Układ zawieszenia', 'Pozostałe']
}];

const akcesoriaDoQuadowProps = [{
    name: 'Kategoria',
    kind: 'Singular',
    values: ['Kufry', 'Osłony', 'Pługi', 'Wyciągarki', 'Pozostałe']
}];

const meskaBieliznaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Kalesony', 'Majtki', 'Piżamy', 'Podkoszulki', 'Skarpetki', 'Stroje kąpielowe', 'Szlafroki', 'Pozostałe', 'Wszystkie produkty']
}];

const meskaOdziezKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Bluzy', 'Dresy', 'Garnitury i Marynarki', 'Kamizelki', 'Koszule', 'Koszulki', 'Kurtki i płaszcze', 'Spodenki', 'Spodnie', 'Swetry', 'Pozostałe', 'Wszystkie produkty']
}];

const meskieObuwieKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Domowe', 'Espadryle', 'Glany i trapery', 'Kalosze', 'Klapki', 'Kowbojki', 'Mokasyny', 'Półbuty', 'Sandały', 'Sportowe', 'Sztyblety', 'Śniegowce', 'Tenisówki', 'Trekkingowe', 'Akcesoria obuwnicze', 'Pozostałe', 'Wszystkie produkty']
}];

const meskaGalanteriaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Breloki', 'Chusty i apaszki', 'Czapki/Nakrycia głowy', 'Etui i pokrowce', 'Krawaty i muszki', 'Nesesery i aktówki', 'Okulary przeciwsłoneczne', 'Parasole', 'Paski', 'Plecaki', 'Portfele', 'Poszetki', 'Rękawiczki', 'Saszetki i nerki', 'Szaliki i szale', 'Szelki', 'Torby i torebki', 'Walizki', 'Pozostałe', 'Wszystkie produkty']
}];

const meskaBizuteriaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Akcesoria do biżuterii', 'Akcesoria do zegarków', 'Biżuteria męska', 'Dewocjonalia', 'Ozdoby do włosów', 'Piercing', 'Tatuaże zmywalne', 'Zegarki', 'Pozostałe', 'Wszystkie produkty']
}];

const meskiePrzebraniaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Akcesoria i gadżety', 'Kostiumy męskie', 'Maski', 'Peruki', 'Pozostałe']
}];

const meskiSlubKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Dekoracje ślubne', 'Dodatki męskie', 'Galanteria papiernicza', 'Pozostałe']
}];

const damskaBieliznaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Bielizna wyszczuplająca', 'Biustonosze', 'Body i Gorsety', 'Halki', 'Kombinezony', 'Komplety', 'Koszulki nocne i Piżamy', 'Podkoszulki', 'Pończochy i pasy do pończoch', 'Rajstopy', 'Skarpetki i kolanówki', 'Stroje kąpielowe', 'Szlafroki', 'Topy', 'Wszystkie produkty']
}];

const damskaOdziezKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Bluzki', 'Bluzy', 'Body', 'Bolerka', 'Dresy', 'Getry', 'Kamizelki', 'Kombinezony', 'Komplety', 'Koszule', 'Legginsy', 'Marynarki i żakiety', 'Okrycia wierzchnie', 'Spodnie', 'Spódnice i spódniczki', 'Sukienki', 'Suknie wieczorowe', 'Swetry', 'T-shirty', 'Topy', 'Tuniki', 'Wszystkie produkty']
}];

const damskieObuwieKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Akcesoria obuwnicze', 'Balerinki', 'Botki', 'Creepersy', 'Czółenka', 'Domowe', 'Espadryle', 'Glany', 'Kalosze', 'Klapki', 'Kozaki', 'Mokasyny', 'Półbuty', 'Sandały', 'Sportowe', 'Śniegowce', 'Tenisówki', 'Trekkingowe', 'Pozostałe', 'Wszystkie produkty']
}];

const damskaGalanteriaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Breloki', 'Chusty i apaszki', 'Etui i pokrowce', 'Krawaty', 'Muszki', 'Nakrycia głowy', 'Nesesery i aktówki', 'Okulary przeciwsłoneczne', 'Parasole', 'Paski', 'Plecaki', 'Portfele', 'Poszetki', 'Rękawiczki', 'Saszetki i nerki', 'Szaliki i szale', 'Szelki', 'Torby', 'Torebki', 'Walizki', 'Pozostałe', 'Wszystkie produkty']
}];

const damskaBizuteriaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Akcesoria do biżuterii', 'Akcesoria do zegarków', 'Biżuteria damska', 'Biżuteria ślubna', 'Dewocjonalia', 'Ozdoby do włosów', 'Piercing', 'Tatuaże zmywalne', 'Zegarki', 'Pozostałe', 'Wszystkie produkty']
}];

const ciazaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Biustonosze', 'Bluzki', 'Koszule nocne', 'Legginsy', 'Rajstopy', 'Spodnie', 'Sukienki', 'Pozostałe']
}];

const damskiSlubKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Dekoracje ślubne', 'Dodatki damskie', 'Galanteria papiernicza', 'Obuwie ślubne', 'Suknie ślubne', 'Pozostałe']
}];

const damskiePrzebraniaKindsProps = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: ['Kostiumy damskie', 'Maski', 'Peruki', 'Pozostałe']
}];

const balblaNazwa = [{
    name: 'Rodzaj',
    kind: 'Singular',
    values: []
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
            'Obuwie': [...meskieObuwieKindsProps, ...adultShoeSizeProps],
            'Bielizna': [...meskaBieliznaKindsProps, ...clothesSizeLettersProps],
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

    'Motoryzacja': {
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

        // 'Samochody osobowe': [...carMakeProps, ...carModelProps, ...enginePowerProps, ...priceProps, ...fuelProps, ...gearBoxProps, ...productionYearProps, ...cabinTypeProps, ...makeCountryProps, ...engineVolumeProps, ...colorProps, ...steeringWheelProps, ...courseDistanceProps, ...workingOrderProps],

        // 'Motocykle i Skutery': [...motorbikeCatProps, ...motorbikeMakeProps, ...priceProps, ...productionYearProps, ...motorbikeEngineVolumeProps, ...workingOrderProps, ...makeCountryProps],

        // 'Dostawcze i Ciężarowe': [...truckCatProps, ...workingOrderProps, ...enginePowerProps, ...priceProps, ...fuelProps, ...engineVolumeProps, ...gearBoxProps, ...productionYearProps, ...makeCountryProps, ...courseDistanceProps],

        // 'Przyczepy i Pojazdy Użytkowe': [...trailerCatProps, ...workingOrderProps, ...priceProps, ...productionYearProps],

        // 'Części motocyklowe': [...motorcyclePartKindProps, ...stateProps, ...priceProps],

        // 'Sprzęt car audio': priceAndStateProps,

        // 'Pozostała motoryzacja': priceProps
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

    'Dom i ogród': {
        'Meble': [...furnitureKindProps, ...priceAndStateProps],

        'Zdrowie': priceAndStateProps,

        'Sprzęt AGD': [...AGDKindProps, ...priceAndStateProps],

        'Ogród': priceAndStateProps,

        'Narzędzia': priceAndStateProps,

        'Materiały budowlane': priceAndStateProps,

        'Ogrzewanie': priceAndStateProps,

        'Wyposażenie wnętrz': [...indoorAccessoriesProps, ...stateProps, ...priceProps],

        'Pozostałe dom i ogród': priceProps

    },

    'Elektronika': {
        'Telefony komórkowe': [...phoneMakeProps, ...priceAndStateProps, ...workingOrderProps],

        'Akcesoria telefoniczne': priceAndStateProps,

        'Komputery': [...computerKindsProps, ...stateProps, ...priceProps],

        'Tablety': priceAndStateProps,

        'Telewizory': priceAndStateProps,

        'Gry i Konsole': priceAndStateProps,

        'Fotografia': priceAndStateProps,

        'Sprzęt audio': priceAndStateProps,

        'Pozostała elektronika': priceAndStateProps
    },

    'Rolnictwo': {
        'Ciągniki': [...priceProps, ...powerProps, ...motorHoursProps, productionYearProps],

        'Maszyny rolnicze': [...priceProps, ...ruralMachineKindProps , ...productionYearProps],

        'Przyczepy': [...priceProps, ...productionYearProps],

        'Części do maszyn rolniczych': priceProps,

        'Opony rolnicze': priceProps,

        'Produkty rolne': priceProps,

        'Giełda zwierząt': [...priceProps, ...ruralAnimalProps],

        'Ryneczek': priceProps,

        'Pozostałe rolnicze': priceProps
    },

    'Zwierzęta': {
        'Psy': [...dogRaceProps, ...priceProps],

        'Koty': [...catRaceProps, ...priceProps],

        'Ptaki': priceProps,

        'Gryzonie i króliki': priceProps,

        'Konie': priceProps,

        'Akwarystyka': [...subnauticaProps, ...priceAndStateProps],

        'Akcesoria dla zwierząt': priceProps,

        'Pozostałe zwierzęta': priceProps
    },

    'Dla dzieci': {
        'Zabawki': priceAndStateProps,

        'Wózki dziecięce': priceAndStateProps,

        'Foteliki - Nosidełka': priceAndStateProps,

        'Ubranka': [...priceAndStateProps, ...childGenderProps, ...childClothesSizeProps],

        'Buciki': [...priceAndStateProps, ...childGenderProps, ...childShoeSizeProps],

        'Meble dla dziecka': priceAndStateProps,

        'Pozostałe dla dzieci': priceProps
    },

    'Sport i hobby': {
        'Kolekcje': priceProps,

        'Militaria': [...priceProps, ...stateProps],

        'Rowery': priceAndStateProps,

        'Fitness': priceAndStateProps,

        'Sporty zimowe': priceAndStateProps,

        'Odzież sportowa': [...priceAndStateProps, ...genderWithUnisexProps, ...clothesSizeLettersProps],

        'Obuwie sportowe': [...priceAndStateProps, ...genderWithUnisexProps, ...adultShoeSizeProps],

        'Pozostały sport i hobby': priceProps
    },

    'Muzyka i edukacja': {
        'Ksiązki': [...bookKindProps, ...stateProps, ...priceProps, ...publishYearProps],

        'Muzyka': priceAndStateProps,

        'Filmy': priceAndStateProps,

        'Instrumenty': priceAndStateProps,

        'Sprzęt muzyczny': priceAndStateProps,

        'Materiały językowe': priceAndStateProps,

        'Pozostała muzyka i edukacja': priceProps
    },

    'Ślub i Wesele': {
        'Moda ślubna' : {
            'Biżuteria ślubna': [...priceProps, ...stateProps, ...genderProps],

            'Buty ślubne': [...priceProps, ...stateProps, ...genderProps, ...shoeSizeProps],

            'Skunie ślubne': [...priceProps, ...stateProps, ...dressSizeProps],

            'Garnitury ślubne': priceAndStateProps,

            'Obrączki': priceAndStateProps,

            'Pozostałe': priceAndStateProps
        },

        'Usługi ślubne': {
            'Fotografia i filmowanie': null,

            'Dekorowanie': null,

            'Oprawa muzyczna': null,

            'Pojazdy do ślubu': null,

            'Torty i Catering': null,

            'Pozostałe': null
        },

        'Akcesoria ślubne': {
            'Zaproszenia ślubne': priceProps,

            'Dekoracje ślubne': priceAndStateProps,

            'Pozostałe': priceProps
        }
    }
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
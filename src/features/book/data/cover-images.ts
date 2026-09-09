// Goodreads originals verified against next-books.dev on 2026-09-09.
// Keys are this catalog's ISBNs; the final number in each URL is the reference
// edition's Goodreads ID (also its detail-page path on next-books.dev).
const nextBookCovers: Record<string, string> = {
  // Exact ISBN matches.
  "0060555661": "https://images.gr-assets.com/books/1409602421l/106835.jpg",
  "0060850523": "https://images.gr-assets.com/books/1298180450l/5485.jpg",
  "0061122416": "https://images.gr-assets.com/books/1483412266l/865.jpg",
  "0062316095": "https://images.gr-assets.com/books/1420788020l/20839196.jpg",
  "0062457713": "https://images.gr-assets.com/books/1465761873l/28259130.jpg",
  "0064404994": "https://images.gr-assets.com/books/1504696345l/170609.jpg",
  "0140283331": "https://images.gr-assets.com/books/1327869409l/7624.jpg",
  "0140449043": "https://images.gr-assets.com/books/1361355717l/1354.jpg",
  "0140449086": "https://images.gr-assets.com/books/1399225547l/1362.jpg",
  "0140449132": "https://images.gr-assets.com/books/1388706751l/181309.jpg",
  "0140449264": "https://images.gr-assets.com/books/1309203605l/7126.jpg",
  "0140449272": "https://images.gr-assets.com/books/1359922039l/81779.jpg",
  "0140449442": "https://images.gr-assets.com/books/1282318692l/110871.jpg",
  "0141182806": "https://images.gr-assets.com/books/1352563556l/10545.jpg",
  "0141439513": "https://images.gr-assets.com/books/1461620558l/1886.jpg",
  "0141439602": "https://images.gr-assets.com/books/1344922523l/1953.jpg",
  "0141442336": "https://images.gr-assets.com/books/1346974538l/6267715.jpg",
  "0141442468": "https://images.gr-assets.com/books/1389451534l/6411433.jpg",
  "0142437336": "https://images.gr-assets.com/books/1447764813l/17250.jpg",
  "0142437476": "https://images.gr-assets.com/books/1309202497l/97751.jpg",
  "0143039431": "https://images.gr-assets.com/books/1499929186l/4397.jpg",
  "0156012197": "https://images.gr-assets.com/books/1367545443l/157993.jpg",
  "0195374614": "https://images.gr-assets.com/books/1499958451l/5617966.jpg",
  "020161622X": "https://images.gr-assets.com/books/1401432508l/4099.jpg",
  "0316769487": "https://images.gr-assets.com/books/1378755464l/7178.jpg",
  "0345337662": "https://images.gr-assets.com/books/1444049180l/2924362.jpg",
  "0345339703": "https://images.gr-assets.com/books/1419127843l/18510.jpg",
  "0345349571": "https://images.gr-assets.com/books/1403200553l/568236.jpg",
  "0345370775": "https://images.gr-assets.com/books/1344371661l/6424171.jpg",
  "0345391802": "https://images.gr-assets.com/books/1327656754l/11.jpg",
  "0345453743": "https://images.gr-assets.com/books/1404613595l/13.jpg",
  "0345538374": "https://images.gr-assets.com/books/1346072396l/30.jpg",
  "0393316041": "https://images.gr-assets.com/books/1348445281l/5544.jpg",
  "0441007465": "https://images.gr-assets.com/books/1281419771l/888628.jpg",
  "0441172717": "https://images.gr-assets.com/books/1426192671l/53732.jpg",
  "0451191145": "https://images.gr-assets.com/books/1507050862l/13130873.jpg",
  "0451524934": "https://images.gr-assets.com/books/1348990566l/5470.jpg",
  "0451526929": "https://images.gr-assets.com/books/1362371027l/329519.jpg",
  "0486278077": "https://images.gr-assets.com/books/1436740876l/752815.jpg",
  "0486282112": "https://images.gr-assets.com/books/1328867280l/89476.jpg",
  "0486284735": "https://images.gr-assets.com/books/1280813012l/303481.jpg",
  "0486415864": "https://images.gr-assets.com/books/1410229761l/2621.jpg",
  "0553212419": "https://images.gr-assets.com/books/1320490450l/3581.jpg",
  "0553283685": "https://images.gr-assets.com/books/1405546838l/77566.jpg",
  "0553293370": "https://images.gr-assets.com/books/1429998142l/13554512.jpg",
  "0553380168": "https://images.gr-assets.com/books/1333578746l/3869.jpg",
  "055338256X": "https://images.gr-assets.com/books/1320402160l/3040953.jpg",
  "055357339X": "https://images.gr-assets.com/books/1464570795l/77197.jpg",
  "0553573403": "https://images.gr-assets.com/books/1502662698l/409207.jpg",
  "0671027034": "https://images.gr-assets.com/books/1179108396l/875983.jpg",
  "0671733354": "https://images.gr-assets.com/books/1417526735l/760788.jpg",
  "0679732268": "https://images.gr-assets.com/books/1355360091l/10979.jpg",
  "0679732764": "https://images.gr-assets.com/books/1352854247l/16981.jpg",
  "067973452X": "https://images.gr-assets.com/books/1327909683l/49455.jpg",
  "0679783261": "https://images.gr-assets.com/books/1320399351l/1885.jpg",
  "0679785892": "https://images.gr-assets.com/books/1394204569l/7745.jpg",
  "0743273567": "https://images.gr-assets.com/books/1490528560l/4671.jpg",
  "0812536355": "https://images.gr-assets.com/books/1217218691l/226004.jpg",
  "0812550706": "https://images.gr-assets.com/books/1408303130l/375802.jpg",
  "081298840X": "https://images.gr-assets.com/books/1463936399l/25614898.jpg",
  "1451648537": "https://images.gr-assets.com/books/1327861368l/11084145.jpg",
  "1455586692": "https://images.gr-assets.com/books/1447957962l/25744928.jpg",
  "2070360024": "https://images.gr-assets.com/books/1332596551l/15688.jpg",
  "2070612759": "https://images.gr-assets.com/books/1389446369l/832605.jpg",
  "8498381495": "https://images.gr-assets.com/books/1504210632l/8510968.jpg",
  "9793062797": "https://images.gr-assets.com/books/1489732961l/1362193.jpg",

  // Alternate editions of the same work, verified by title and author.
  "0140449108": "https://images.gr-assets.com/books/1315624683l/431786.jpg", // Utopia — Thomas More
  "0140449248": "https://images.gr-assets.com/books/1427728126l/4934.jpg", // The Brothers Karamazov — Dostoyevsky
  "0142437239": "https://images.gr-assets.com/books/1407710790l/3835.jpg", // Don Quixote — Cervantes
  "0199535566": "https://images.gr-assets.com/books/1320399351l/1885.jpg", // Pride and Prejudice — Austen
  "0345337581": "https://images.gr-assets.com/books/1384678464l/18810673.jpg", // The Memory Book — Lorayne & Lucas
  "0345337697": "https://images.gr-assets.com/books/1335782304l/76688.jpg", // Robots and Empire — Asimov
  "0345339681": "https://images.gr-assets.com/books/1372847500l/5907.jpg", // The Hobbit — Tolkien
  "0345341929": "https://images.gr-assets.com/books/1328820924l/603712.jpg", // The Summer Game — Angell
  "0451191153": "https://images.gr-assets.com/books/1403193610l/664.jpg", // The Fountainhead — Rand
  "0553293354": "https://images.gr-assets.com/books/1417900846l/29579.jpg", // Foundation — Asimov
  "055357342X": "https://images.gr-assets.com/books/1386089926l/535758.jpg", // A Storm of Swords — Martin
  "0679732233": "https://images.gr-assets.com/books/1327936136l/35220.jpg", // The Red Badge of Courage — Crane
  "8420471836": "https://images.gr-assets.com/books/1401999288l/325.jpg", // Cien años de soledad — García Márquez
};

export function getBookCoverUrl(isbn: string | null, fallback: string | null): string | null {
  return (isbn ? nextBookCovers[isbn] : undefined) ?? fallback;
}

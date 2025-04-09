// Przykładowe dane dokumentów
const documents = [
  {
    number: "PZ 0001/24",
    date: "28.12.2024",
    contractor: "Hacek S.R.O.",
    netValue: "27 000,00",
    grossValue: "33 210,00"
  },
  {
    number: "PZ 0007/24",
    date: "28.10.2024",
    contractor: "Handel obwoźny J. Kowalski",
    netValue: "6 360,00",
    grossValue: "7 360,00"
  },
  {
    number: "PZ 0006/24",
    date: "7.10.2024",
    contractor: "SAMSAM JP",
    netValue: "92 540,00",
    grossValue: "112 896,80"
  },
  {
    number: "PZ 0005/24",
    date: "7.10.2024",
    contractor: "SONLAB JP",
    netValue: "96 820,00",
    grossValue: "120 560,40"
  },
  {
    number: "PZ 0003/24",
    date: "7.10.2024",
    contractor: "NONAME USA",
    netValue: "83 594,80",
    grossValue: "101 985,66"
  }
];

// Przykładowe dane pozycji dla dokumentów
const documentItems = {
  "PZ 0001/24": [
    {
      id: "Tow000010",
      name: "Szafa trzydrzwiowa z lustrem - XR w.",
      quantity: "3.000",
      unit: "szt."
    },
    {
      id: "Tow000011",
      name: "Komoda XR w.",
      quantity: "2.000",
      unit: "szt."
    },
    {
      id: "Tow000012",
      name: "Stolik okrągły XR w.",
      quantity: "4.000",
      unit: "szt."
    },
    {
      id: "Tow000013",
      name: "Krzesło XR w.",
      quantity: "10.000",
      unit: "szt."
    }
  ],
  "PZ 0007/24": [
    {
      id: "Tow000020",
      name: "Biurko komputerowe",
      quantity: "5.000",
      unit: "szt."
    },
    {
      id: "Tow000021",
      name: "Fotel biurowy",
      quantity: "8.000",
      unit: "szt."
    },
    {
      id: "Tow000022",
      name: "Regał biurowy",
      quantity: "3.000",
      unit: "szt."
    }
  ],
  "PZ 0006/24": [
    {
      id: "Tow000030",
      name: "Lodówka Samsung",
      quantity: "10.000",
      unit: "szt."
    },
    {
      id: "Tow000031",
      name: "Pralka Samsung",
      quantity: "8.000",
      unit: "szt."
    },
    {
      id: "Tow000032",
      name: "Zmywarka Samsung",
      quantity: "5.000",
      unit: "szt."
    }
  ],
  "PZ 0005/24": [
    {
      id: "Tow000040",
      name: "Telewizor LED 50\"",
      quantity: "15.000",
      unit: "szt."
    },
    {
      id: "Tow000041",
      name: "Soundbar",
      quantity: "12.000",
      unit: "szt."
    }
  ],
  "PZ 0003/24": [
    {
      id: "Tow000050",
      name: "Laptop Dell",
      quantity: "20.000",
      unit: "szt."
    },
    {
      id: "Tow000051",
      name: "Monitor Dell",
      quantity: "25.000",
      unit: "szt."
    },
    {
      id: "Tow000052",
      name: "Klawiatura bezprzewodowa",
      quantity: "30.000",
      unit: "szt."
    },
    {
      id: "Tow000053",
      name: "Mysz bezprzewodowa",
      quantity: "30.000",
      unit: "szt."
    }
  ]
};

// Funkcja pobierająca dokumenty z "bazy danych" (w rzeczywistej aplikacji byłoby to API)
function getDocuments() {
  // Symulacja opóźnienia sieciowego
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(documents);
    }, 300);
  });
}

// Funkcja pobierająca pozycje dokumentu z "bazy danych"
function getDocumentItems(documentNumber) {
  // Symulacja opóźnienia sieciowego
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(documentItems[documentNumber] || []);
    }, 300);
  });
}

// Funkcja zapisująca log wydruku
function logPrint(documentNumber, itemId, itemName, labelType, quantity) {
  // Symulacja zapisu do bazy danych
  console.log(`Drukowanie etykiety ${labelType} dla ${itemName} (${itemId}), ilość: ${quantity}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 200);
  });
}
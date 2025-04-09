// Obsługa etykiet i szablonów

// Typy etykiet
const labelTypes = {
  mala: {
    name: "Mała",
    width: "50mm",
    height: "30mm",
    fontSize: "small"
  },
  duza: {
    name: "Duża",
    width: "100mm",
    height: "60mm",
    fontSize: "large"
  },
  kartonik: {
    name: "Kartonik",
    width: "70mm",
    height: "50mm",
    fontSize: "medium"
  },
  folia: {
    name: "Folia",
    width: "80mm",
    height: "40mm",
    fontSize: "medium"
  }
};

// Funkcja generująca zawartość etykiety HTML
function generateHTMLLabel(itemId, itemName, labelType) {
  const labelConfig = labelTypes[labelType] || labelTypes.mala;
  
  // Określenie rozmiaru czcionki w zależności od typu etykiety
  let titleSize, codeSize, dateSize;
  
  if (labelConfig.fontSize === "small") {
    titleSize = "12pt";
    codeSize = "8pt";
    dateSize = "7pt";
  } else if (labelConfig.fontSize === "large") {
    titleSize = "18pt";
    codeSize = "12pt";
    dateSize = "10pt";
  } else {
    titleSize = "14pt";
    codeSize = "10pt";
    dateSize = "8pt";
  }
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        width: ${labelConfig.width};
        height: ${labelConfig.height};
        border: 1px solid #ccc;
        box-sizing: border-box;
        padding: 5mm;
      }
      .label {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .product-code {
        font-size: ${codeSize};
        color: #666;
      }
      .product-name {
        font-size: ${titleSize};
        font-weight: bold;
        margin: 4mm 0;
      }
      .barcode {
        text-align: center;
        margin: 3mm 0;
        font-family: 'Libre Barcode 128', cursive;
        font-size: 36pt;
      }
      .date {
        font-size: ${dateSize};
        color: #666;
        margin-top: auto;
      }
      .label-type {
        position: absolute;
        top: 2mm;
        right: 2mm;
        font-size: 7pt;
        color: #999;
      }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
  </head>
  <body>
    <div class="label">
      <div class="label-type">Etykieta: ${labelConfig.name}</div>
      <div class="product-code">${itemId}</div>
      <div class="product-name">${itemName}</div>
      <div class="barcode">*${itemId}*</div>
      <div class="date">Data wydruku: ${new Date().toLocaleDateString('pl-PL')}</div>
    </div>
  </body>
  </html>
  `;
}

// Funkcja generująca kod ZPL dla etykiety
function generateZPLLabel(itemId, itemName, labelType) {
  const labelConfig = labelTypes[labelType] || labelTypes.mala;
  const date = new Date().toLocaleDateString('pl-PL');
  
  // Dostosowanie parametrów ZPL w zależności od typu etykiety
  let width, height, titleY, titleFontSize, codeFontSize, barcodeHeight;
  
  if (labelType === "mala") {
    width = 400;
    height = 240;
    titleY = 80;
    titleFontSize = 25;
    codeFontSize = 20;
    barcodeHeight = 60;
  } else if (labelType === "duza") {
    width = 800;
    height = 480;
    titleY = 120;
    titleFontSize = 40;
    codeFontSize = 30;
    barcodeHeight = 100;
  } else if (labelType === "kartonik") {
    width = 560;
    height = 400;
    titleY = 100;
    titleFontSize = 35;
    codeFontSize = 25;
    barcodeHeight = 80;
  } else { // folia
    width = 640;
    height = 320;
    titleY = 90;
    titleFontSize = 30;
    codeFontSize = 25;
    barcodeHeight = 70;
  }
  
  return `^XA

^FO20,30^A0N,${codeFontSize},${codeFontSize}^FD${itemId}^FS
^FO20,${titleY}^A0N,${titleFontSize},${titleFontSize}^FD${itemName}^FS
^FO20,${titleY + 60}^BY3
^BCN,${barcodeHeight},Y,N,N
^FD${itemId}^FS
^FO20,${height - 50}^A0N,20,20^FDData wydruku: ${date}^FS
^FO${width - 120},20^A0N,20,20^FD${labelConfig.name}^FS

^XZ`;
}

// Funkcja wysyłająca etykietę do druku (w prawdziwej aplikacji to będzie komunikacja z API)
function printLabel(itemId, itemName, labelType, quantity) {
  return new Promise((resolve, reject) => {
    // Symulacja drukowania
    console.log(`Drukowanie ${quantity} etykiet typu ${labelType} dla ${itemName} (${itemId})`);
    
    // W rzeczywistej aplikacji tutaj byłby kod do komunikacji z API serwera
    setTimeout(() => {
      // Symulacja sukcesu
      resolve({ success: true, printedCount: quantity });
    }, 1000);
  });
}

// Funkcja generująca podgląd etykiety w formacie HTML
function previewHTMLLabel(itemId, itemName, labelType) {
  return generateHTMLLabel(itemId, itemName, labelType);
}

// Funkcja generująca podgląd etykiety w formacie ZPL
function previewZPLLabel(itemId, itemName, labelType) {
  return generateZPLLabel(itemId, itemName, labelType);
}

// Funkcja pobierająca szablon etykiety do wydruku
function getLabelTemplate(itemId, itemName, labelType, format) {
  if (format === 'html') {
    return generateHTMLLabel(itemId, itemName, labelType);
  } else if (format === 'zpl') {
    return generateZPLLabel(itemId, itemName, labelType);
  }
  return null;
}
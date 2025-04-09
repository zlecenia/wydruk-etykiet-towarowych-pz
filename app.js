// Główny plik aplikacji

// Globalne zmienne
let currentDocumentNumber = null;
let currentItem = null;
let currentItemName = null;
let currentLabelType = null;

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', function() {
  // Załadowanie listy dokumentów
  loadDocuments();
  
  // Inicjalizacja zdarzeń
  initEventListeners();
});

// Załadowanie listy dokumentów
async function loadDocuments() {
  try {
    // Pokaż loading state (możesz dodać spinner)
    
    // Pobierz dokumenty
    const documents = await getDocuments();
    
    // Wypełnij tabelę dokumentów
    renderDocumentsTable(documents);
    
    // Ukryj loading state
  } catch (error) {
    console.error('Błąd podczas ładowania dokumentów:', error);
    alert('Wystąpił błąd podczas ładowania dokumentów.');
  }
}

// Renderowanie tabeli dokumentów
function renderDocumentsTable(documents) {
  const tbody = document.getElementById('documentsTableBody');
  tbody.innerHTML = '';
  
  documents.forEach(doc => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${doc.number}</td>
      <td>${doc.date}</td>
      <td>${doc.contractor}</td>
      <td>${doc.netValue}</td>
      <td>${doc.grossValue}</td>
      <td><button class="select-btn" data-document="${doc.number}">Wybierz</button></td>
    `;
    
    tbody.appendChild(row);
  });
  
  // Dodaj event listeners do przycisków "Wybierz"
  document.querySelectorAll('.select-btn').forEach(button => {
    button.addEventListener('click', function() {
      const documentNumber = this.getAttribute('data-document');
      selectDocument(documentNumber);
    });
  });
}

// Wybór dokumentu i załadowanie jego pozycji
async function selectDocument(documentNumber) {
  try {
    currentDocumentNumber = documentNumber;
    
    // Aktualizacja tytułu sekcji
    document.getElementById('documentTitle').textContent = `Pozycje dokumentu: ${documentNumber}`;
    
    // Pokaż sekcję pozycji
    document.getElementById('itemsSection').style.display = 'block';
    
    // Pobierz pozycje dokumentu
    const items = await getDocumentItems(documentNumber);
    
    // Renderuj pozycje dokumentu
    renderItemsTable(items);
    
    // Przewiń do sekcji pozycji
    document.getElementById('itemsSection').scrollIntoView({ behavior: 'smooth' });
    
  } catch (error) {
    console.error('Błąd podczas ładowania pozycji dokumentu:', error);
    alert('Wystąpił błąd podczas ładowania pozycji dokumentu.');
  }
}

// Renderowanie tabeli pozycji
function renderItemsTable(items) {
  const tbody = document.getElementById('itemsTableBody');
  tbody.innerHTML = '';
  
  items.forEach(item => {
    const row = document.createElement('tr');
    
    // W wersji mobilnej używamy innego układu
    if (window.innerWidth <= 768) {
      row.innerHTML = `
        <td class="checkbox-column">
          <input type="checkbox" name="selectedItems" value="${item.id}" class="item-checkbox">
        </td>
        <td colspan="4">
          <div class="item-info">
            <div class="item-title">${item.name}</div>
            <div class="item-details">Kod: ${item.id} | Ilość: ${item.quantity} ${item.unit}</div>
          </div>
        </td>
        <td>
          <div class="item-quantity">
            <label>Ilość do druku:</label>
            <input type="number" class="quantity-input" value="1" min="1" data-item-id="${item.id}">
          </div>
          <div class="label-buttons">
            <button class="label-btn small-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="mala">Mała</button>
            <button class="label-btn big-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="duza">Duża</button>
            <button class="label-btn carton-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="kartonik">Kartonik</button>
            <button class="label-btn foil-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="folia">Folia</button>
          </div>
        </td>
      `;
    } else {
      // Wersja dla większych ekranów
      row.innerHTML = `
        <td class="checkbox-column">
          <input type="checkbox" name="selectedItems" value="${item.id}">
        </td>
        <td>${item.name}</td>
        <td>${item.id}</td>
        <td>${item.quantity}</td>
        <td>${item.unit}</td>
        <td>
          <div class="item-quantity">
            <label>Ilość do druku:</label>
            <input type="number" class="quantity-input" value="1" min="1" data-item-id="${item.id}">
          </div>
          <div class="label-buttons">
            <button class="label-btn small-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="mala">Mała</button>
            <button class="label-btn big-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="duza">Duża</button>
            <button class="label-btn carton-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="kartonik">Kartonik</button>
            <button class="label-btn foil-label-btn" data-item-id="${item.id}" data-item-name="${item.name}" data-label-type="folia">Folia</button>
          </div>
        </td>
      `;
    }
    
    tbody.appendChild(row);
  });
  
  // Dodaj event listenery do przycisków etykiet
  addLabelButtonListeners();
}

// Dodaje listenery zdarzeń do przycisków etykiet
function addLabelButtonListeners() {
  document.querySelectorAll('.label-btn').forEach(button => {
    button.addEventListener('click', function() {
      const itemId = this.getAttribute('data-item-id');
      const itemName = this.getAttribute('data-item-name');
      const labelType = this.getAttribute('data-label-type');
      
      showPrintModal(itemId, itemName, labelType);
    });
  });
}

// Inicjalizacja wszystkich listenerów zdarzeń
function initEventListeners() {
  // Odświeżanie listy dokumentów
  document.querySelector('.refresh-btn').addEventListener('click', loadDocuments);
  
  // Wyszukiwanie dokumentów
  document.querySelector('.search-box').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#documentsTableBody tr');
    
    rows.forEach(row => {
      const documentNumber = row.cells[0].textContent.toLowerCase();
      const contractor = row.cells[2].textContent.toLowerCase();
      
      if (documentNumber.includes(searchTerm) || contractor.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
  
  // Obsługa zaznaczania wszystkich pozycji
  const selectAllCheckbox = document.querySelector('thead .checkbox-column input');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('input[name="selectedItems"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });
  }
  
  // Drukowanie zaznaczonych pozycji
  document.getElementById('printSelectedBtn').addEventListener('click', printSelected);
  
  // Obsługa modali
  document.getElementById('closePreviewBtn').addEventListener('click', closePreview);
  document.getElementById('closePrintModalBtn').addEventListener('click', closePrintModal);
  document.getElementById('printConfirmBtn').addEventListener('click', confirmPrint);
  document.getElementById('printFromPreviewBtn').addEventListener('click', function() {
    if (currentItem && currentItemName && currentLabelType) {
      showPrintModal(currentItem, currentItemName, currentLabelType);
    }
  });
  
  // Zamknięcie modali po kliknięciu poza nimi
  window.addEventListener('click', function(event) {
    const previewModal = document.getElementById('previewModal');
    const printModal = document.getElementById('printModal');
    
    if (event.target === previewModal) {
      closePreview();
    }
    
    if (event.target === printModal) {
      closePrintModal();
    }
  });
}

// Pokazuje modal z wyborem ilości etykiet do druku
function showPrintModal(itemId, itemName, labelType) {
  currentItem = itemId;
  currentItemName = itemName;
  currentLabelType = labelType;
  
  // Ustaw tytuł modalu
  document.getElementById('printModalTitle').textContent = `Ilość etykiet "${labelTypes[labelType].name}" do druku`;
  
  // Pobierz wartość z pola ilości do druku dla tego produktu
  const quantityInput = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
  if (quantityInput) {
    document.getElementById('printQuantity').value = quantityInput.value;
  } else {
    document.getElementById('printQuantity').value = 1;
  }
  
  // Wyświetl modal
  document.getElementById('printModal').style.display = 'block';
}

// Zamyka modal z wyborem ilości etykiet
function closePrintModal() {
  document.getElementById('printModal').style.display = 'none';
}

// Potwierdza druk etykiet
async function confirmPrint() {
  const quantity = parseInt(document.getElementById('printQuantity').value);
  
  if (quantity < 1) {
    alert('Ilość etykiet musi być większa od 0.');
    return;
  }
  
  try {
    // Aktualizacja ilości w tabeli
    const quantityInput = document.querySelector(`.quantity-input[data-item-id="${currentItem}"]`);
    if (quantityInput) {
      quantityInput.value = quantity;
    }
    
    // Wyślij żądanie druku do API
    const result = await printLabel(currentItem, currentItemName, currentLabelType, quantity);
    
    if (result.success) {
      // Zapisz log wydruku
      await logPrint(currentDocumentNumber, currentItem, currentItemName, currentLabelType, quantity);
      
      // Wyświetl potwierdzenie
      alert(`Wydrukowano ${quantity} etykiet typu "${labelTypes[currentLabelType].name}" dla "${currentItemName}"`);
    } else {
      alert('Wystąpił błąd podczas drukowania etykiet.');
    }
    
    // Zamknij modalne okna
    closePrintModal();
    closePreview();
    
  } catch (error) {
    console.error('Błąd podczas drukowania etykiet:', error);
    alert('Wystąpił błąd podczas drukowania etykiet.');
  }
}

// Pokazuje podgląd etykiety
function previewLabel(itemId, itemName, labelType, format) {
  const modal = document.getElementById('previewModal');
  const title = document.getElementById('previewTitle');
  const htmlPreview = document.getElementById('htmlPreview');
  const zplPreview = document.getElementById('zplPreview');
  
  currentItem = itemId;
  currentItemName = itemName;
  currentLabelType = labelType;
  
  // Ukryj wszystkie podglądy
  htmlPreview.style.display = 'none';
  zplPreview.style.display = 'none';
  
  // Ustaw tytuł modalu
  const labelName = labelTypes[labelType].name;
  title.textContent = `Podgląd etykiety "${labelName}" dla "${itemName}"`;
  
  // Wyświetl odpowiedni podgląd
  if (format === 'html') {
    htmlPreview.style.display = 'block';
    
    // Wygeneruj i pokaż etykietę HTML
    const htmlContent = previewHTMLLabel(itemId, itemName, labelType);
    
    const doc = htmlPreview.contentDocument;
    doc.open();
    doc.write(htmlContent);
    doc.close();
  } else if (format === 'zpl') {
    // Pokaż kod ZPL
    zplPreview.style.display = 'block';
    zplPreview.textContent = previewZPLLabel(itemId, itemName, labelType);
  }
  
  // Wyświetl modal
  modal.style.display = 'block';
}

// Zamyka modal z podglądem etykiety
function closePreview() {
  document.getElementById('previewModal').style.display = 'none';
}

// Drukowanie zaznaczonych pozycji
async function printSelected() {
  const selectedCheckboxes = document.querySelectorAll('input[name="selectedItems"]:checked');
  
  if (selectedCheckboxes.length === 0) {
    alert('Nie wybrano żadnych pozycji do druku!');
    return;
  }
  
  // Utwórz tablicę zadań drukowania
  const printJobs = [];
  
  selectedCheckboxes.forEach(checkbox => {
    const itemId = checkbox.value;
    const row = checkbox.closest('tr');
    const itemName = row.cells[1].textContent || row.querySelector('.item-title').textContent;
    const quantityInput = row.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);
    
    // Dodaj zadanie drukowania dla każdego zaznaczonego produktu
    // Domyślnie używamy etykiety typu "mala"
    printJobs.push({
      itemId,
      itemName,
      labelType: 'mala',
      quantity
    });
  });
  
  // Potwierdź z użytkownikiem
  const confirmMessage = `Czy chcesz wydrukować ${printJobs.length} różnych etykiet? \n\n` +
    printJobs.map(job => `- ${job.itemName}: ${job.quantity} szt. (${labelTypes[job.labelType].name})`).join('\n');
  
  if (confirm(confirmMessage)) {
    try {
      // Drukuj etykiety jedna po drugiej
      for (const job of printJobs) {
        const result = await printLabel(job.itemId, job.itemName, job.labelType, job.quantity);
        
        if (result.success) {
          // Zapisz log wydruku
          await logPrint(currentDocumentNumber, job.itemId, job.itemName, job.labelType, job.quantity);
        } else {
          alert(`Błąd podczas drukowania etykiety dla "${job.itemName}"`);
        }
      }
      
      alert('Wszystkie wybrane etykiety zostały wydrukowane.');
    } catch (error) {
      console.error('Błąd podczas drukowania zaznaczonych etykiet:', error);
      alert('Wystąpił błąd podczas drukowania zaznaczonych etykiet.');
    }
  }
}
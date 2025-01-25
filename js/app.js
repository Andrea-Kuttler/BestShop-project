class Calculator {
  constructor() {
    // DOM prvky (elementy HTML, se kterými budeme pracovat)
    this.productInput = document.getElementById('products'); // Pole pro zadání počtu produktů
    this.orderInput = document.getElementById('orders'); // Pole pro zadání počtu objednávek
    this.packageSelect = document.getElementById('package'); // Rozbalovací nabídka pro výběr balíčku
    this.packageDropdown = document.querySelector('.select__dropdown'); // Možnosti v rozbalovací nabídce
    this.accountingCheckbox = document.getElementById('accounting'); // Checkbox pro účetnictví
    this.terminalCheckbox = document.getElementById('terminal'); // Checkbox pro pronájem terminálu
    this.summaryItems = document.querySelectorAll('.list__item'); // Položky v sekci shrnutí
    this.totalPriceElement = document.querySelector('.total__price'); // Element pro zobrazení celkové ceny
    
    // Ceník jednotlivých služeb a produktů
    this.prices = {
      product: 0.5, // Cena za 1 produkt
      order: 0.5, // Cena za 1 objednávku
      packages: {
        basic: 10, // Cena základního balíčku
        professional: 20, // Cena profesionálního balíčku
        premium: 30, // Cena prémiového balíčku
      },
      accounting: 10, // Cena za účetnictví
      terminal: 10, // Cena za pronájem terminálu
    };

    // Výchozí stav kalkulačky
    this.state = {
      products: 0, // Počet produktů
      orders: 0, // Počet objednávek
      package: '', // Vybraný balíček
      accounting: false, // Zda je účetnictví vybráno
      terminal: false, // Zda je terminál vybrán
    };

    // Připojení metod a inicializace aplikace
    this.init();
  }

  // Inicializace kalkulačky
  init() {
    this.addEventListeners(); // Přidání naslouchání událostem
    this.updateSummary(); // Aktualizace sekce shrnutí
  }

  // Přidání naslouchání událostem
  addEventListeners() {
    // Ověření a aktualizace při zadání hodnot do polí
    this.productInput.addEventListener('input', () => 
      this.updateState('products', this.validateInput(this.productInput.value))
    );
    this.orderInput.addEventListener('input', () => 
      this.updateState('orders', this.validateInput(this.orderInput.value))
    );

    // Otevření nebo zavření rozbalovací nabídky
    this.packageSelect.addEventListener('click', () => this.toggleDropdown());
    this.packageDropdown.addEventListener('click', (event) => this.selectPackage(event));

    // Aktualizace při změně stavu checkboxů
    this.accountingCheckbox.addEventListener('change', () => 
      this.updateState('accounting', this.accountingCheckbox.checked)
    );
    this.terminalCheckbox.addEventListener('change', () => 
      this.updateState('terminal', this.terminalCheckbox.checked)
    );
  }

  // Ověření vstupu - pouze kladná čísla
  validateInput(value) {
    const parsedValue = parseInt(value, 10); // Převod na celé číslo
    return parsedValue > 0 ? parsedValue : 0; // Pokud je číslo kladné, vrátí ho, jinak 0
  }

  // Aktualizace stavu aplikace
  updateState(key, value) {
    this.state[key] = value; // Aktualizace příslušné hodnoty ve stavu
    this.updateSummary(); // Aktualizace sekce shrnutí
  }

  // Otevření/zavření rozbalovací nabídky
  toggleDropdown() {
    this.packageDropdown.classList.toggle('open'); // Přepíná třídu "open" pro zobrazení/skrývání
  }

  // Výběr balíčku z nabídky
  selectPackage(event) {
    const selectedValue = event.target.dataset.value; // Získání hodnoty z atributu data-value
    if (selectedValue) {
      this.updateState('package', selectedValue); // Aktualizace vybraného balíčku
      this.packageSelect.querySelector('.select__input').innerText = selectedValue; // Zobrazení vybraného balíčku
      this.packageDropdown.classList.remove('open'); // Zavření nabídky
    }
  }

  // Aktualizace sekce shrnutí
  updateSummary() {
    // Výpočet jednotlivých položek
    const productsPrice = this.state.products * this.prices.product;
    const ordersPrice = this.state.orders * this.prices.order;
    const packagePrice = this.prices.packages[this.state.package] || 0;
    const accountingPrice = this.state.accounting ? this.prices.accounting : 0;
    const terminalPrice = this.state.terminal ? this.prices.terminal : 0;

    // Aktualizace HTML pro každou položku
    this.updateSummaryItem('products', this.state.products, productsPrice);
    this.updateSummaryItem('orders', this.state.orders, ordersPrice);
    this.updateSummaryItem('package', this.state.package, packagePrice);
    this.updateSummaryItem('accounting', this.state.accounting ? 'Yes' : '', accountingPrice);
    this.updateSummaryItem('terminal', this.state.terminal ? 'Yes' : '', terminalPrice);

    // Výpočet celkové ceny
    const totalPrice = productsPrice + ordersPrice + packagePrice + accountingPrice + terminalPrice;

    // Zobrazení celkové ceny
    this.totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
  }

  // Aktualizace konkrétní položky v sekci shrnutí
  updateSummaryItem(id, value, price) {
    const item = document.querySelector(`.list__item[data-id="${id}"]`);
    if (value) {
      item.style.display = 'flex'; // Zobrazení položky
      item.querySelector('.item__calc').innerText = value;
      item.querySelector('.item__price').innerText = `$${price}`;
    } else {
      item.style.display = 'none'; // Skrytí položky, pokud není relevantní
    }
  }
}

// Inicializace kalkulačky po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});

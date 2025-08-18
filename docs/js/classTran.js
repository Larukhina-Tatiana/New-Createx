class TransparentHeader {
  constructor(scrollThreshold, initialColor = "transparent") {
    this.header = document.querySelector("header");
    this.scrollThreshold = scrollThreshold;
    this.initialColor = initialColor;
    this.isScrolled = false;

    if (!this.header) {
      console.error("Элемент <header> не найден.");
      return;
    }

    this.init();
  }

  init() {
    this.header.style.backgroundColor = this.initialColor;
    this.header.style.transition = "background-color 0.3s ease";

    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    if (window.scrollY > this.scrollThreshold && !this.isScrolled) {
      this.header.style.backgroundColor = "white";
      this.isScrolled = true;
    } else if (window.scrollY <= this.scrollThreshold && this.isScrolled) {
      this.header.style.backgroundColor = this.initialColor;
      this.isScrolled = false;
    }
  }
}

// Конфигурация: соответствие классов body и начального цвета header
const pageConfigs = {
  "page-home": "white",
  "page-about": "transparent",
  "page-positions": "white",
  "page-news": "transparent",
  "page-contacts": "transparent",
  "page-services": "transparent",
  // добавляй по мере необходимости
};

// Определение начального цвета из классов <body>
let initialColor = "transparent";
const bodyClasses = document.body.classList;

for (const className of bodyClasses) {
  if (pageConfigs[className]) {
    initialColor = pageConfigs[className];
    break;
  }
}

// Инициализация компонента
new TransparentHeader(100, initialColor);

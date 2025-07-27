class TransparentHeader {
  constructor(headerId, scrollThreshold) {
    this.header = document.getElementById(headerId);
    this.scrollThreshold = scrollThreshold; // Пороговое значение скролла
    this.isScrolled = false; // Флаг, указывающий, был ли скролл

    // Проверка, существует ли header
    if (!this.header) {
      console.error(`Header с ID "${headerId}" не найден.`);
      return; // Прерываем выполнение, если header не найден
    }

    this.init();
  }

  init() {
    // Устанавливаем прозрачный фон изначально
    this.header.style.backgroundColor = 'transparent';
    this.header.style.transition = 'background-color 0.3s ease'; // Добавляем плавный переход

    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    if (window.scrollY > this.scrollThreshold && !this.isScrolled) {
      this.header.style.backgroundColor = 'white';
      this.isScrolled = true;
    } else if (window.scrollY <= this.scrollThreshold && this.isScrolled) {
      this.header.style.backgroundColor = 'transparent';
      this.isScrolled = false;
    }
  }
}

// Пример использования:
const headerComponent = new TransparentHeader('myHeader', 100); // 'myHeader' - ID вашего header, 100 - порог скролла в пикселях

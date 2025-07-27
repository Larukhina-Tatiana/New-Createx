/**
 * Динамическое определение и обновление высоты header'а
 * Автоматически обновляет CSS переменную --header-height
 */

class DynamicHeaderHeight {
  constructor() {
    this.header = document.querySelector('.header');
    this.debounceTimeout = null;
    
    if (!this.header) {
      console.warn('Header не найден');
      return;
    }
    
    this.init();
  }
  
  init() {
    // Устанавливаем начальную высоту
    this.updateHeaderHeight();
    
    // Обновляем при изменении размеров окна
    window.addEventListener('resize', () => this.debounceUpdate());
    
    // Обновляем при повороте устройства
    window.addEventListener('orientationchange', () => {
      // Небольшая задержка для корректного определения новых размеров
      setTimeout(() => this.updateHeaderHeight(), 100);
    });
    
    // Обновляем при изменении DOM (если добавляется/убирается контент в header)
    if (window.MutationObserver) {
      const observer = new MutationObserver(() => this.debounceUpdate());
      observer.observe(this.header, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }
  }
  
  updateHeaderHeight() {
    if (!this.header) return;
    
    // Получаем реальную высоту header'а
    const headerHeight = this.header.offsetHeight;
    
    // Обновляем CSS переменную
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    
    // Также устанавливаем как data-атрибут для отладки
    document.documentElement.setAttribute('data-header-height', headerHeight);
    
    // Опционально: логируем для отладки
    console.log(`Header height updated: ${headerHeight}px`);
    
    // Триггерим кастомное событие для других скриптов
    window.dispatchEvent(new CustomEvent('headerHeightUpdated', {
      detail: { height: headerHeight }
    }));
  }
  
  debounceUpdate() {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.updateHeaderHeight();
    }, 150);
  }
  
  // Публичный метод для принудительного обновления
  forceUpdate() {
    this.updateHeaderHeight();
  }
}

// Инициализируем после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  window.dynamicHeaderHeight = new DynamicHeaderHeight();
});

// Также инициализируем сразу, если DOM уже загружен
if (document.readyState === 'loading') {
  // DOM еще загружается, ждем DOMContentLoaded
} else {
  // DOM уже загружен
  window.dynamicHeaderHeight = new DynamicHeaderHeight();
}

// Экспортируем класс для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DynamicHeaderHeight;
}

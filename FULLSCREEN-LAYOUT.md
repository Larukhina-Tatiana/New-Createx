# Fullscreen Layout Component

Компонент для создания полноэкранного layout'а с фиксированной шапкой и hero секцией, которые вместе занимают всю высоту экрана на любых устройствах.

## Особенности

- ✅ Адаптивная высота header'а для разных устройств
- ✅ Автоматическая адаптация под поворот устройства 
- ✅ Поддержка современных viewport единиц (dvh) с fallback
- ✅ Оптимизация для iOS Safari
- ✅ Корректная работа на очень маленьких экранах
- ✅ Фиксированная шапка всегда видна

## Структура HTML

```html
<div class="fullscreen-layout">
  <!-- Фиксированная шапка -->
  <header class="fullscreen-layout__header header">
    <!-- Содержимое header'а -->
  </header>

  <!-- Основной контент -->
  <main class="fullscreen-layout__content">
    <!-- Hero секция -->
    <section class="fullscreen-layout__hero hero">
      <!-- Фон (опционально) -->
      <img class="fullscreen-layout__hero-bg" src="bg.jpg" alt="">
      
      <!-- Оверлей (опционально) -->
      <div class="fullscreen-layout__hero-overlay"></div>
      
      <!-- Контент -->
      <div class="fullscreen-layout__hero-content">
        <!-- Ваш контент -->
      </div>
    </section>
    
    <!-- Дополнительные секции -->
    <section class="section">
      <!-- Остальной контент страницы -->
    </section>
  </main>
</div>
```

## CSS переменные

Компонент использует CSS переменную `--header-height`, которая автоматически адаптируется:

```scss
:root {
  --header-height: 82px; // Десктоп
}

@media screen and (max-width: 768px) {
  :root {
    --header-height: 70px; // Планшеты
  }
}

@media screen and (max-width: 480px) {
  :root {
    --header-height: 60px; // Мобильные
  }
}

@media screen and (orientation: landscape) and (max-height: 500px) {
  :root {
    --header-height: 50px; // Альбомная ориентация
  }
}
```

## Классы компонента

### `.fullscreen-layout`
Основной контейнер, устанавливает flexbox layout и минимальную высоту 100dvh

### `.fullscreen-layout__header`
Фиксированная шапка с адаптивной высотой

### `.fullscreen-layout__content`
Контейнер для основного контента

### `.fullscreen-layout__hero`
Hero секция, занимающая оставшуюся высоту экрана

### `.fullscreen-layout__hero-content`
Контейнер для содержимого hero

### `.fullscreen-layout__hero-bg`
Фоновое изображение или видео (cover, absolute positioning)

### `.fullscreen-layout__hero-overlay`
Полупрозрачный оверлей поверх фона

## Адаптивность

Компонент автоматически адаптируется под:

- **Десктоп** (> 1024px): Header 82px
- **Планшеты** (769-1024px): Header 70px  
- **Мобильные** (< 480px): Header 60px
- **Альбомная ориентация** (высота < 500px): Header 50px

## Поддержка браузеров

- Современные браузеры: используется `100dvh`
- Старые браузеры: fallback на `100vh`
- iOS Safari: специальные фиксы для viewport

## Примеры использования

### Простой hero с текстом

```html
<div class="fullscreen-layout">
  <header class="fullscreen-layout__header header">
    <!-- Header content -->
  </header>
  
  <main class="fullscreen-layout__content">
    <section class="fullscreen-layout__hero">
      <div class="fullscreen-layout__hero-content">
        <h1>Заголовок</h1>
        <p>Описание</p>
        <a href="#" class="button">CTA Button</a>
      </div>
    </section>
  </main>
</div>
```

### Hero с фоновым изображением

```html
<section class="fullscreen-layout__hero">
  <img class="fullscreen-layout__hero-bg" src="hero-bg.jpg" alt="">
  <div class="fullscreen-layout__hero-overlay"></div>
  <div class="fullscreen-layout__hero-content">
    <!-- Content -->
  </div>
</section>
```

### Hero с видео фоном

```html
<section class="fullscreen-layout__hero">
  <video class="fullscreen-layout__hero-bg" autoplay muted loop>
    <source src="hero-video.mp4" type="video/mp4">
  </video>
  <div class="fullscreen-layout__hero-overlay"></div>
  <div class="fullscreen-layout__hero-content">
    <!-- Content -->
  </div>
</section>
```

## Интеграция с существующими компонентами

Компонент совместим с существующими классами:
- `.header` - для стилизации шапки
- `.hero` - для стилизации hero секции  
- `.container` - для ограничения ширины контента
- `.button` - для кнопок в hero

## Файлы компонента

- `src/scss/components/_fullscreen-layout.scss` - основные стили
- `src/scss/utils/_vars.scss` - CSS переменные высоты header'а
- `fullscreen-layout-example.html` - пример использования

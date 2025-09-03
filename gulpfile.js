const { src, dest, watch, parallel, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const svgSprite = require("gulp-svg-sprite");
const browserSync = require("browser-sync").create();
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const nunjucksRender = require("gulp-nunjucks-render");
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const minimist = require("minimist");
const noop = require("gulp-noop");

const options = minimist(process.argv.slice(2));
const isProd = options.prod;

console.log(isProd ? "🚀 Production build" : "🔧 Development mode");

// 🧼 Очистка docs/
function cleanDocs() {
  return src("docs/**/*", { read: false, allowEmpty: true }).pipe(clean());
}

// 📄 Сжатие HTML
function html() {
  return src("docs/**/*.html")
    .pipe(
      isProd
        ? htmlmin({ collapseWhitespace: true, removeComments: true })
        : noop()
    )
    .pipe(dest("docs"));
}

// 🧠 Сборка Nunjucks
function nunjucks() {
  return src("src/html/pages/**/*.njk")
    .pipe(
      nunjucksRender({
        path: ["src/html/templates"],
      })
    )
    .pipe(dest("docs"))
    .pipe(browserSync.stream());
}

// 🎨 Стили
function styles() {
  return src("src/scss/**/*.scss")
    .pipe(!isProd ? sourcemaps.init() : noop())
    .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min" }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(!isProd ? sourcemaps.write(".") : noop())
    .pipe(dest("docs/css"))
    .pipe(browserSync.stream());
}

// 🧩 Скрипты
function scripts() {
  return src([
    // сторонние библиотеки
    "node_modules/jquery/dist/jquery.js",
    "node_modules/imask/dist/imask.min.js",
    "node_modules/scrollreveal/dist/scrollreveal.min.js",
    "node_modules/swiper/swiper-bundle.min.js",
    "libs/smoothscroll/smooth-scroll.min.js",
    "libs/TransferElements.js",
    "libs/slick/slick.min.js",
    "libs/mixitup-v3/mixitup.js",

    // твои скрипты
    // "src/js/**/*.js",
    "src/js/modals.js",
  ])
    .pipe(dest("docs/js"))
    .pipe(browserSync.stream());
}

// 🖼 Картинки
function images() {
  return src(["images/src/*.*", "!images/src/*.svg"])
    .pipe(newer("docs/images"))
    .pipe(avif({ quality: 50 }))
    .pipe(src("images/src/*.*"))
    .pipe(newer("docs/images"))
    .pipe(webp())
    .pipe(src("images/src/*.*"))
    .pipe(newer("docs/images"))
    .pipe(imagemin())
    .pipe(dest("docs/images"));
}

// 🧬 SVG-спрайт
function sprite() {
  return src("images/src/icons/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest("docs/images"));
}

// 🔤 Шрифты
function fonts() {
  return src("fonts/src/*.*")
    .pipe(fonter({ formats: ["woff", "ttf"] }))
    .pipe(src("fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("docs/fonts"));
}

// 📦 Копирование ассетов
function copyAssets() {
  return src([
    "src/images/**/*.{svg,png,jpg,jpeg,gif,avif,webp}",
    "!src/images/icons/**",
  ]).pipe(dest("docs/images"));
}

// 👀 Вотчер
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: "docs",
    },
  });

  watch("src/html/**/*.njk", nunjucks);
  watch("src/scss/**/*.scss", styles);
  watch("src/js/**/*.js").on("change", browserSync.reload);

  watch("src/js/**/*.js", scripts);
  watch("images/src/**/*.*", images);
  watch("fonts/src/**/*.*", fonts);
  watch("src/img/**/*.*", copyAssets);
}

// 🏗 Финальная сборка
exports.build = series(
  cleanDocs,
  parallel(nunjucks, styles, scripts, images, fonts, sprite, copyAssets),
  html
);

// 🚀 По умолчанию
exports.default = series(
  parallel(nunjucks, styles, scripts, images, fonts, sprite, copyAssets),
  watchFiles
);

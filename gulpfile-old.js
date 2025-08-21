const { src, dest, watch, parallel, series } = require("gulp");
// конвертация sass-css
// const scss = require("gulp-sass")(require("sass"));
const sass = require("gulp-sass")(require("sass"));
// const sass = require("gulp-sass");
//переименование и объединиение сжатие css
const concat = require("gulp-concat");
// сжатие js
const uglify = require("gulp-uglify-es").default;
// добавление префиксов в старіе версии браузеров
const autoprefixer = require("gulp-autoprefixer");
// очистка папок
const clean = require("gulp-clean");
//  сжатие и конвертация картинок
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const svgSprite = require("gulp-svg-sprite");
const fileinclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();

// Конвертер шрифтов
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");

const include = require("gulp-include");

function fonts() {
  return src("fonts/src/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"],
      })
    )
    .pipe(src("fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("fonts"));
}

// function htmlInclude() {
//   return src([
//     "./src/html/index.html",
//     "./src/html/about.html",
//     "./src/html/positions.html",
//     "./src/html/contacts.html",
//     "./src/html/services.html",
//     "./src/html/services-inside.html",
//     "./src/html/work.html",
//     "./src/html/work-inside.html",
//     "./src/html/news.html",
//     "./src/html/news1.html",
//   ])
//     .pipe(
//       fileinclude({
//         prefix: "@",
//         basepath: "@file",
//       })
//     )
//     .pipe(dest("./"))
//     .pipe(browserSync.stream());
// }
const nunjucksRender = require("gulp-nunjucks-render");

function nunjucks() {
  return src("src/html/pages/**/*.njk") // страницы
    .pipe(
      nunjucksRender({
        path: ["src/html/templates"], // путь к шаблонам
      })
    )
    .pipe(dest("docs")) // куда выводить
    .pipe(browserSync.stream());
}

const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");

function styles() {
  return src("./src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", notify.onError())
    )
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("./css/"))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "docs",
    },
  });

  watch("./src/scss/**/*.scss", styles);
  // watch("./src/html/*.html", htmlInclude);
  watch("src/html/**/*.html", nunjucks);

  // watch("./src/img/**.jpg", imgToApp);
  // watch("./src/img/**.png", imgToApp);
  // watch("./src/img/**.jpeg", imgToApp);
  // watch("./src/img/**.svg", svgSprites);
  // watch("./src/resources/**", resources);
  // watch("./src/fonts/**.ttf", fonts);
  // watch("./src/fonts/**.ttf", fontsStyle);
  watch("./src/js/**/*.js", scripts);
};

// function styles() {
//   // return src("app/scss/style.scss")
//   return src([
//     "node_modules/swiper/swiper-bundle.css",
//     "node_modules/animate.css/animate.css",
//     // "node_modules/simplelightbox/dist/simple-lightbox.css",
//     "node_modules/nouislider/dist/nouislider.css",
//     // "node_modules/aos/dist/aos.css",
//     "css/ion.rangeSlider.css",
//     "css/jquery.formstyler.css",
//     "css/jquery.formstyler.theme.css",
//     // "css/jquery.rateyo.css",
//     "scss/style.scss",
//     // "!/css/style.min.css",
//   ])
//     .pipe(concat("style.min.css"))
//     .pipe(scss({ outputStyle: "compressed" }))
//     .pipe(dest("css"))
//     .pipe(
//       autoprefixer({
//         overrideBrowsersList: ["last 10 version"],
//         grid: true,
//       })
//     );
// }

function scripts() {
  return (
    src([
      // "https://unpkg.com/aos@2.3.1/dist/aos.js",
      "node_modules/jquery/dist/jquery.js",
      // "node_modules/swiper/swiper-bundle.js",
      "node_modules/swiper/swiper-bundle.js",

      "node_modules/imask/dist/imask.min.js",
      "node_modules/scrollreveal/dist/scrollreveal.min.js",
      "libs/smoothscroll/smooth-scroll.min.js",
      // "libs/choices/choices.min.js",
      "libs/TransferElements.js",
      "libs/slick/slick.min.js",
      "libs/mixitup-v3/mixitup.js",
      "./src/js/initScrollReset.js",
      "./src/js/transfer.js",
      "./src/js/create-alertbox.js",
      // "libs/imask.js",
      // "libs/inputmask.min.js",
      // "node_modules/nouislider/dist/nouislider.js",
      // "node_modules/simplelightbox/dist/simple-lightbox.min.js",
      // "node_modules/siema/dist/siema.min.js",
      // "node_modules/aos/dist/aos.js",
      // "js/jquery.formstyler.min.js",
      // "js/ion.rangeSlider.min.js",
      // "js/jquery.rateyo.js",
      "./src/js/burger.js",
      "./src/js/sliders.js",
      "./src/js/progress.js",
      "./src/js/to-top.js",
      "./src/js/video.js",
      "./src/js/classTran.js",
      "./src/js/accordeon.js",
      "./src/js/graph-modal.min.js",
      "./src/js/mainmixitup.js",
      "./src/js/modals.js",
      // "./src/js/selects.js",
      "./src/js/tab-link-handler.js",
      "./src/js/tabs.js",
      "./src/js/animations.js",
      "./src/js/dynamic-header-height.js",
      // "./src/js/tabs.js",
      // "js/modal.js",
      // Для подключения многих (всех) файлов js? Обязательно исключать main.min.js
      // 'app/js/*.js',
      // '!app/js/main.min.js'
      "!js/main.min.js",
    ])
      .pipe(concat("main.min.js"))
      // .pipe(concat("main.js"))
      .pipe(uglify())
      .pipe(dest("js"))
  );
}

function images() {
  // return src(["app/images/**/*.*", "!app/images/**/*.svg"])
  return (
    src(["images/src/*.*", "!images/src/*.svg"])
      .pipe(newer("images"))
      .pipe(avif({ quality: 50 }))

      // .pipe(src("app/images/**/*.*"))
      .pipe(src("images/src/*.*"))
      .pipe(newer("images"))
      .pipe(webp())

      .pipe(src("images/src/*.*"))
      .pipe(newer("images"))
      .pipe(imagemin())

      .pipe(dest("images/contacts"))
  );
}

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
    .pipe(dest("images"));
}

// функция удаления папок
function cleanDist() {
  // return src("dist").pipe(clean("*.*"));
  return src("dist/**/*", { read: false, allowEmpty: true });
}

// функция переноса файлов в чистую папку для сдачи
function building() {
  // прописывать всё что есть - картинки, шрифты..
  return src(
    [
      "app/css/style.min.css",
      "app/js/main.min.js",
      "app/**/*.html",
      "app/fonts/*.*",
      "app/images/*.*",
      "app/resources/**/*.*",
      "!app/images/*.svg",
      "!app/images/stack",
      "app/images/sprite.svg",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

// слешение за обновлениями файлов

exports.fonts = fonts;
// exports.includeh = includeh;
// exports.htmlInclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.sprite = sprite;
exports.building = building;
exports.watchFiles = watchFiles;

exports.build = series(cleanDist, building);

// exports.default = parallel(styles, images, scripts, watching);

// exports.default = series(parallel(htmlInclude, styles, scripts), watchFiles);
exports.default = series(parallel(nunjucks, styles, scripts), watchFiles);

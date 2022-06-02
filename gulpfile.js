const {src, dest, series} = require('gulp');
const imageminJpegtran = require('imagemin-jpegtran')
const imageminAvif = require('imagemin-avif')
const rename = require('gulp-rename');
const del = require('del');

async function optimizeJPG(done) {
  const imagemin = (await import('imagemin')).default;
  await imagemin(['scr/images/**/*.{jpg,png}'], {
    destination: 'build/images',
    plugins: [ imageminJpegtran()]
  });
  
  done()
}
async function convertToWebp(done) {
  const imagemin = (await import('imagemin')).default;
  const imageminWebp = (await import('imagemin-webp')).default;
  
  const filesWebp = await imagemin(['scr/images/**/*.{jpg,png}'], {
    destination: 'build/images',
    plugins: [ imageminWebp({quality: 50})]
  })
  done()
}
async function convertToAvif() {
  const imagemin = (await import('imagemin')).default;
  await imagemin(['scr/images/**/*.{jpg,png}'], {
    destination: 'build/images/temp',
    plugins: [ imageminAvif({quality: 50})]
  })

  return src('build/images/temp/*.jpg')
    .pipe(rename({extname: '.avif'}))
    .pipe(dest('build/images'))

}

function deleteTempFile() {
  return del(['build/images/temp/**/*'])
  
}

exports.optimizeJPG = optimizeJPG
exports.convertToWebp = convertToWebp
exports.convertToAvif = convertToAvif
exports.deleteTempFile = deleteTempFile
exports.default = series(optimizeJPG, convertToWebp, convertToAvif, deleteTempFile)
const BitReader = require('./src/bit-reader');
const LargeImages = require('./src/large-images.json');

function generateArt(_hash = '') {
  // remove the leading 0x, if present
  const hash = _hash.indexOf('0x') === 0 ? _hash.slice(2) : _hash;
  // make sure it's hexadecimal
  if (!/[a-fA-F0-9]+/.test(hash)) {
    throw new Error('Non-hexadecimal character detected in hash');
  }
  const reader = new BitReader(hash);
  const gridSize = 8;
  // position using upper left corner with increasing y as moving downward
  //  echo -n ".,ȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲ " | wc -c
  // > 249

  const smallImages =
  // Greek Chars. example will not properly render
  // 𐆀𐆁𐆂𐆃𐆄𐆅𐆆𐆇𐆈𐆉𐆊𐆋𐆌𐆍𐆎𐅐𐅑𐅒𐅓𐅔𐅕𐅖𐅗𐅘𐅙𐅚𐅛𐅜𐅝𐅞𐅟𐅠𐅡𐅢𐅣𐅤𐅥𐅦𐅧𐅨𐅩𐅪𐅫𐅬𐅭𐅮𐅯
    ' .,ȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲ '.slice(
      0,
      60,
    );
  // value from 0-16
  const bigImageIndex = reader.getNum(LargeImages.length);
  const bigImage = LargeImages[bigImageIndex];
  const xPos = reader.getNum(gridSize - bigImage.width);
  const yPos = reader.getNum(gridSize - bigImage.height);
  // @notice this gives us verbose output; optional
  console.log(`x: ${xPos}, y: ${yPos}`)
  console.log(`Big image: ${bigImageIndex}`)

  // return a matrix
  const grid = Array.apply(null, Array(gridSize)).map(() => {
    return Array.apply(null, Array(gridSize)).map(() => {});
  });
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // for each tile determine what should be rendered
      if (
        x >= xPos &&
        x < xPos + bigImage.width &&
        y >= yPos &&
        y < yPos + bigImage.height
      ) {
        // we're in the big image
        const lines = bigImage.data.split('\n');
        grid[y][x] = lines[y - yPos][x - xPos];
        continue;
      }
      // otherwise calculate individual tile info
      const tileImage = reader.getNum(smallImages.length);
      grid[y][x] = smallImages[tileImage];
    }
  }

  let art = '';
  for (const line of grid) {
    art += line.join('') + '\n';
  }
  return {
    art,
    bitsConsumed: reader.bitsConsumed,
    bits: reader.binaryString.length,
  };
}

module.exports = generateArt;

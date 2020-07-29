import { rgb } from 'pdf-lib';

const WritePDF = ({
  text,
  page,
  height,
  positionX,
  positionY,
  helveticaFont,
  pngImage,
}) => {
  page.drawText(text, {
    x: positionX,
    y: height / 2 + positionY,
    size: 9,
    font: helveticaFont,
    color: rgb(0.0, 0.0, 0.0),
  });

  if (pngImage)
    page.drawImage(pngImage, {
      x: positionX + 60,
      y: height / 2 + positionY - 3,
      width: 50,
      height: 12,
    });
};

export default WritePDF;

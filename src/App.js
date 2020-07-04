import React, { useState } from 'react';
import './App.css';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function App() {
  const [hourState, setHourState] = useState('');
  const [allowanceState, setAllowanceState] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        Horas:{' '}
        <input
          type="text"
          name="hour"
          onChange={(e) => setHourState(e.target.value)}
          value={hourState}
        />
        (8,12,13,17) Abonos:{' '}
        <input
          type="text"
          name="allowance"
          onChange={(e) => setAllowanceState(e.target.value)}
        />
        (1,2,3,4,5)
        <input
          type="file"
          name="file"
          onChange={(e) => onChangeHandler(e.target.files[0])}
        />
      </header>
    </div>
  );

  async function onChangeHandler(event) {
    const existingPdfBytes = await event.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    const hour = hourState.split(',');
    const allowance = allowanceState.split(',');

    await ProcessPDF({
      page: pages[0],
      helveticaFont,
      weekend: false,
      hour,
      allowance,
    });

    const pdfBytes = await pdfDoc.save();

    Download(pdfBytes, event.type);
  }

  async function ProcessPDF({ page, helveticaFont, weekend, hour, allowance }) {
    const { height } = page.getSize();
    const date = new Date();

    const X = 111;
    const Y = 263;
    let positionX = X; //+118
    let positionY = Y; //-15
    let second = [];
    let secondOld = [];
    const amountDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    console.log(hour.length);

    for (let i = 0; i < hour.length; i++) {
      for (let u = 1; u <= amountDay; u++) {
        if (!allowance.includes(u)) {
          second[u] = Math.floor(Math.random() * 6);
          const hourFormated = hour[i] < 10 ? `0${hour[i]}` : hour[i];

          if (second[u] < secondOld[u]) second[u] = secondOld[u] + second[u];
          const secondFormated = second[u] < 10 ? `0${second[u]}` : second[u];
          secondOld[u] = second[u];

          if (!weekend) {
            const weekday = new Date(date.getFullYear(), date.getMonth(), u)
              .toString()
              .split(' ')[0];

            if (weekday !== 'Sat' && weekday !== 'Sun')
              modifyPDF({
                text: `${hourFormated}:${secondFormated}`,
                page,
                height,
                positionX,
                positionY,
                helveticaFont,
                u,
              });
          } else
            modifyPDF({
              text: `${hourFormated}:${secondFormated}`,
              page,
              height,
              positionX,
              positionY,
              helveticaFont,
              u,
            });
        } else
          modifyPDF({
            text: `Abono`,
            page,
            height,
            positionX,
            positionY,
            helveticaFont,
            u,
          });

        positionY -= 15;
      }
      positionX += 118;
      positionY = Y;
    }
  }

  function modifyPDF({
    text,
    page,
    height,
    positionX,
    positionY,
    helveticaFont,
    u,
  }) {
    page.drawText(text, {
      x: positionX,
      y: height / 2 + positionY,
      size: 10,
      font: helveticaFont,
      color: rgb(0.0, 0.0, 0.0),
    });
  }

  function Download(arrayBuffer, type) {
    var blob = new Blob([arrayBuffer], { type: type });
    var url = URL.createObjectURL(blob);
    window.open(url);
  }
}

export default App;

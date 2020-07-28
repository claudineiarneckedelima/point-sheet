import React, { useState } from 'react';
import logo from './logo.png';
import './App.scss';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature, faUpload } from '@fortawesome/free-solid-svg-icons';
import Signature from './Signature';

function App() {
  const [monthState, setMonthState] = useState('');
  const [hourState, setHourState] = useState('');
  const [allowanceState, setAllowanceState] = useState('');
  const [fileState, setFileState] = useState('');
  const [signatureState, setSignatureState] = useState('');
  const [holidayState, setHolidayState] = useState('');

  const getSecond = () => Math.floor(Math.random() * 6);

  const download = (arrayBuffer, type) => {
    var blob = new Blob([arrayBuffer], { type: type });
    var url = URL.createObjectURL(blob);
    window.location.href = url;
  };

  const writePDF = ({
    text,
    page,
    height,
    positionX,
    positionY,
    helveticaFont,
  }) =>
    page.drawText(text + 'oi', {
      x: positionX,
      y: height / 2 + positionY,
      size: 9,
      font: helveticaFont,
      color: rgb(0.0, 0.0, 0.0),
    });

  const amountDay = () => {
    const date = new Date();
    return new Date(date.getFullYear(), monthState, 0).getDate();
  };

  const weekday = (day) => {
    const date = new Date();
    return new Date(date.getFullYear(), monthState - 1, day)
      .toString()
      .split(' ')[0];
  };

  const processPDF = async ({ page, helveticaFont, weekend }) => {
    const hour = hourState.split(',');
    const allowance = allowanceState.split(',');
    const holiday = holidayState.split(',');
    const { height } = page.getSize();
    const positionInitialX = 96;
    const positionInitialY = 263;
    let positionX = positionInitialX;
    let positionY = positionInitialY;
    let second = [];
    let secondOld = [];
    let text = '';

    for (let i = 0; i < hour.length; i++) {
      if (!hour[i]) return;

      for (let u = 1; u <= amountDay(); u++) {
        if (holiday.includes(u.toString())) {
          writePDF({
            text: `        FRI`,
            page,
            height,
            positionX,
            positionY,
            helveticaFont,
          });
        } else if (allowance.includes(u.toString())) {
          writePDF({
            text: `       ABO`,
            page,
            height,
            positionX,
            positionY,
            helveticaFont,
          });
        } else {
          if (!Number(hour[i].trim())) {
            if (hour[i].trim().toLowerCase() !== 'h') return;
            text = ' Home Office';
          } else {
            second[u] = getSecond();
            const hourFormated = hour[i] < 10 ? `0${hour[i]}` : hour[i];

            if (second[u] < secondOld[u]) second[u] = secondOld[u] + second[u];

            const secondFormated = second[u] < 10 ? `0${second[u]}` : second[u];

            secondOld[u] = second[u];

            text = `      ${hourFormated}:${secondFormated}`;
          }

          if (!weekend) {
            const _weekday = weekday(u);

            if (_weekday !== 'Sat' && _weekday !== 'Sun')
              writePDF({
                text,
                page,
                height,
                positionX,
                positionY,
                helveticaFont,
              });
          } else
            writePDF({
              text,
              page,
              height,
              positionX,
              positionY,
              helveticaFont,
            });
        }
        positionY -= 15;
      }
      positionX += 118;
      positionY = positionInitialY;
    }
  };

  const onChangeFileHandler = async (event) => {
    if (!event) return;

    const existingPdfBytes = await event.arrayBuffer();

    setFileState('');

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    await processPDF({
      page: pages[0],
      helveticaFont,
      weekend: false,
    });

    const pdfBytes = await pdfDoc.save();

    download(pdfBytes, event.type);
  };

  const onChangeSignatureHandler = async (event) => {
    if (!event) return;

    const existingPngBytes = await event.arrayBuffer();
    console.log(existingPngBytes);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div className="grid">
          <div className="row">
            <label>Mês* :</label>
            <input
              type="number"
              name="month"
              onChange={(e) => {
                const month =
                  e.target.value <= 0 || e.target.value > 12
                    ? null
                    : e.target.value;
                setMonthState(month);
              }}
              value={monthState}
              required
              min={1}
              max={12}
            />
          </div>
          <div className="row">
            <label>Horas* :</label>
            <input
              type="text"
              name="hour"
              onChange={(e) => setHourState(e.target.value)}
              value={hourState}
              required
            />
          </div>
          <div className="row">
            <label>Feridos :</label>
            <input
              type="text"
              name="holiday"
              onChange={(e) => setHolidayState(e.target.value)}
            />
          </div>
          <div className="row">
            <label>Abonos :</label>
            <input
              type="text"
              name="allowance"
              onChange={(e) => setAllowanceState(e.target.value)}
            />
          </div>
          <div className="row">
            <label />
            <div className="upload">
              <label
                className={!monthState || !hourState ? 'disabled' : ''}
                htmlFor={monthState && hourState ? 'file' : ''}
              >
                <FontAwesomeIcon
                  className="upload-img"
                  icon={faFileSignature}
                />
              </label>
              <input
                type="file"
                className="file-signature"
                id="file"
                onChange={(e) => onChangeSignatureHandler(e.target.files[0])}
                accept="application/png"
                hidden
                value={signatureState}
              />

              <label
                className={!monthState || !hourState ? 'disabled' : ''}
                htmlFor={monthState && hourState ? 'file' : ''}
              >
                <FontAwesomeIcon className="upload-img" icon={faUpload} />
              </label>

              <input
                type="file"
                className="file"
                id="file"
                onChange={(e) => onChangeFileHandler(e.target.files[0])}
                accept="application/pdf"
                hidden
                value={fileState}
              />
            </div>
          </div>
          <div className="row">
            <label />
            <Signature />
          </div>
        </div>
        <ul className="example">
          <li>O campo de horários é obigatório</li>
          <li>Campo Mês - Mês (7)</li>
          <li>
            Campo Horas - Horários (8,12,13,17) | Home Office (h, h, h, h)
          </li>
          <li>Campo Feridos (FRI) - Dias (2,5)</li>
          <li>Campo Abonos (ABO) - Dias (1,4)</li>
          <li>
            Para Importar a folha ponto (.pdf) clique em{' '}
            <FontAwesomeIcon className="upload-img" icon={faUpload} />
          </li>
        </ul>
      </header>
    </div>
  );
}

export default App;

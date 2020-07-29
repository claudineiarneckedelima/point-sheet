import React, { useState } from 'react';
import logo from './logo.png';
import './App.scss';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature, faUpload } from '@fortawesome/free-solid-svg-icons';
import Signature from './Signature';
import { SelectHour, SelectMonth } from './components/Select';
import { Container, Grid } from '@material-ui/core';

function App() {
  const [monthState, setMonthState] = useState('');
  const [hourState, setHourState] = useState([]);
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

  const processPDF = async ({ page, helveticaFont, weekend, pngImage }) => {
    const hour = hourState;
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
            pngImage,
          });
        } else if (allowance.includes(u.toString())) {
          writePDF({
            text: `       ABO`,
            page,
            height,
            positionX,
            positionY,
            helveticaFont,
            pngImage,
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
                pngImage,
              });
          } else
            writePDF({
              text,
              page,
              height,
              positionX,
              positionY,
              helveticaFont,
              pngImage,
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

    const pngImage = signatureState
      ? await pdfDoc.embedPng(signatureState)
      : '';

    await processPDF({
      page: pages[0],
      helveticaFont,
      weekend: false,
      pngImage: pngImage,
    });

    const pdfBytes = await pdfDoc.save();

    download(pdfBytes, event.type);
  };

  const onChangeSignatureHandler = async (event) => {
    if (!event) return;
    const existingPngBytes = await event.arrayBuffer();
    setSignatureState(existingPngBytes);
  };

  const verifyHour = () =>
    !!hourState.filter((v) => v !== null && v !== '').length;

  return (
    <div className="App">
      <div className="container">
        <Container>
          <img src={logo} className="App-logo" alt="logo" />
          <Grid container direction="row">
            <label>Mês* :&nbsp;</label>
            <SelectMonth setMonthState={setMonthState} width="100%" />
          </Grid>
          <br />
          <label>Horas* :&nbsp;</label>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <SelectHour
              setHourState={(e) => {
                hourState[0] = e;
                if (!e) {
                  hourState[0] = null;
                  hourState[1] = null;
                }
                setHourState([...hourState]);
              }}
              width="120px"
            />
            <SelectHour
              setHourState={(e) => {
                hourState[1] = e;
                setHourState([...hourState]);

                console.log(hourState);
              }}
              width="120px"
            />
            <SelectHour
              setHourState={(e) => {
                hourState[2] = e;
                if (!e) {
                  hourState[2] = null;
                  hourState[3] = null;
                }
                setHourState([...hourState]);
              }}
              width="120px"
            />
            <SelectHour
              setHourState={(e) => {
                hourState[3] = e;
                setHourState([...hourState]);
              }}
              width="120px"
            />
          </Grid>
          <br />
          <Grid container direction="column">
            <label>Feridos :&nbsp;</label>
            <input
              type="text"
              name="holiday"
              className="ps-input"
              onChange={(e) => setHolidayState(e.target.value)}
            />
            <label>Abonos :&nbsp;</label>
            <input
              type="text"
              name="allowance"
              className="ps-input"
              onChange={(e) => setAllowanceState(e.target.value)}
            />

            <div>
              <label
                className={!monthState || !verifyHour() ? 'disabled' : ''}
                htmlFor={monthState && verifyHour() ? 'upload-signature' : ''}
              >
                <FontAwesomeIcon
                  className="upload-signature"
                  icon={faFileSignature}
                />
              </label>
              <input
                type="file"
                className="upload-signature"
                id="upload-signature"
                onChange={(e) => onChangeSignatureHandler(e.target.files[0])}
                accept="image/png"
                hidden
              />
            </div>
            <div>
              <label
                className={!monthState || !verifyHour() ? 'disabled' : ''}
                htmlFor={monthState && verifyHour() ? 'upload-pdf' : ''}
              >
                <FontAwesomeIcon className="upload-pdf" icon={faUpload} />
              </label>
              <input
                type="file"
                className="upload-pdf"
                id="upload-pdf"
                onChange={(e) => onChangeFileHandler(e.target.files[0])}
                accept="application/pdf"
                hidden
                value={fileState}
              />
            </div>
            <Signature />
          </Grid>
        </Container>
      </div>

      <header className="App-header">
        <ul className="example">
          <li>Os campos de mês e horas são obrigatórios</li>
          <li>Campo Feridos (FRI) - Dias (2,5)</li>
          <li>Campo Abonos (ABO) - Dias (1,4)</li>
          <li>
            Crie sua assinatura e depois clique com o botão direito do mouse em
            (salvar imagem como)
          </li>
          <li>
            Importe a assinatura já existente (.PNG) clique em{' '}
            <FontAwesomeIcon className="upload-img" icon={faFileSignature} />
          </li>
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

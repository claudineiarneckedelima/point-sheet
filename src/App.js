import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature, faUpload } from '@fortawesome/free-solid-svg-icons';
import { SelectHour, SelectMonth } from './components/Select';
import { Container, Grid } from '@material-ui/core';
import Signature from './utils/Signature';
import Download from './utils/Download';
import ProcessPDF from './utils/ProcessPDF';

function App() {
  const [monthState, setMonthState] = useState('');
  const [hourState, setHourState] = useState(['h','h','h','h']);
  const [allowanceState, setAllowanceState] = useState('');
  const [fileState, setFileState] = useState('');
  const [signatureState, setSignatureState] = useState('');
  const [holidayState, setHolidayState] = useState('');

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

    await ProcessPDF({
      page: pages[0],
      helveticaFont,
      weekend: false,
      pngImage: pngImage,
      monthState,
      hourState,
      allowanceState,
      holidayState,
    });

    const pdfBytes = await pdfDoc.save();

    Download(pdfBytes, event.type);
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
            <SelectMonth setMonthState={setMonthState} width="310px" />
          </Grid>
          <br />
          <Grid container direction="column">
            <Grid container>
              <label>Hora Entrada* :&nbsp;</label>
              <SelectHour
                setHourState={(e) => {
                  hourState[0] = e;
                  if (!e) {
                    hourState[0] = null;
                    hourState[1] = null;
                  }
                  setHourState([...hourState]);
                }}
                width="310px"
              />
            </Grid>
            <Grid container>
              <label>Hora Saída* :&nbsp;</label>
              <SelectHour
                setHourState={(e) => {
                  hourState[1] = e;
                  setHourState([...hourState]);

                  console.log(hourState);
                }}
                width="310px"
              />
            </Grid>
            <Grid container>
              <label>Hora Entrada* :&nbsp;</label>
              <SelectHour
                setHourState={(e) => {
                  hourState[2] = e;
                  if (!e) {
                    hourState[2] = null;
                    hourState[3] = null;
                  }
                  setHourState([...hourState]);
                }}
                width="310px"
              />
            </Grid>
            <Grid container>
              <label>Hora Saída* :&nbsp;</label>
              <SelectHour
                setHourState={(e) => {
                  hourState[3] = e;
                  setHourState([...hourState]);
                }}
                width="310px"
              />
            </Grid>
            <br />
            <Grid container>
              <label>Feridos :&nbsp;</label>
              <input
                type="text"
                name="holiday"
                className="ps-input"
                onChange={(e) => setHolidayState(e.target.value)}
              />
            </Grid>
            <Grid container>
              <label>Abonos :&nbsp;</label>
              <input
                type="text"
                name="allowance"
                className="ps-input"
                onChange={(e) => setAllowanceState(e.target.value)}
              />
            </Grid>
            <Grid container direction="column" className="buttons">
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
            </Grid>
            <Grid container>
              <Signature />
            </Grid>
          </Grid>
        </Container>
      </div>

      <header>
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

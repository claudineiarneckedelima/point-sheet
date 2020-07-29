import WritePDF from './WritePDF';

const getSecond = () => Math.floor(Math.random() * 6);

const amountDay = (monthState) => {
  const date = new Date();
  return new Date(date.getFullYear(), monthState, 0).getDate();
};

const weekday = (day, monthState) => {
  const date = new Date();
  return new Date(date.getFullYear(), monthState - 1, day)
    .toString()
    .split(' ')[0];
};

const ProcessPDF = async ({
  page,
  helveticaFont,
  weekend,
  pngImage,
  monthState,
  hourState,
  allowanceState,
  holidayState,
}) => {
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

    for (let u = 1; u <= amountDay(monthState); u++) {
      if (holiday.includes(u.toString())) {
        WritePDF({
          text: `        FRI`,
          page,
          height,
          positionX,
          positionY,
          helveticaFont,
          pngImage,
        });
      } else if (allowance.includes(u.toString())) {
        WritePDF({
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
          const _weekday = weekday(u, monthState);

          if (_weekday !== 'Sat' && _weekday !== 'Sun')
            WritePDF({
              text,
              page,
              height,
              positionX,
              positionY,
              helveticaFont,
              pngImage,
            });
        } else
          WritePDF({
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

export default ProcessPDF;

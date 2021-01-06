import React from 'react';
import './index.css';

const SelectHour = ({ setHourState, width }) => {
  const hour = [];
  for (let i = 1; i < 24; i++) {
    hour.push(i);
  }

  return (
    <select
      onChange={(e) => setHourState(e.target.value)}
      className="ps-select"
      style={{ width: width }}
    >
      <option key={0} value=""></option>
      <option key={1} value="h">
        Home Office
      </option>
      {hour.map((month, i) => (
        <option key={i + 2} value={i + 1}>
          {month}
        </option>
      ))}
    </select>
  );
};

const SelectMonth = ({ setMonthState, label, width }) => {
  const month = () => [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  return (
    <select
      className="ps-select"
      style={{ width: width }}
      onChange={(e) => {
        setMonthState(e.target.value);
      }}
    >
      <option key={0} value=""></option>
      {month().map((month, i) => (
        <option key={i + 1} value={i + 1}>
          {month}
        </option>
      ))}
    </select>
  );
};

export { SelectHour, SelectMonth };

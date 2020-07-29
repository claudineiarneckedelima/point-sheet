import React, { useRef } from 'react';

const Signature = (props) => {
  const canvasRef = useRef(null);
  let drawing = false;

  function onMouseMove(e) {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);

    const pos = getPos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  function onMouseDown(e) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    var pos = getPos(canvas, e);
    ctx.moveTo(pos.x, pos.y);
    drawing = true;
  }

  function onMouseUp(e) {
    drawing = false;
  }

  function getPos(canvas, mouseEvent) {
    var clientRect = canvas.getBoundingClientRect();

    return {
      x: mouseEvent.clientX - clientRect.x,
      y: mouseEvent.clientY - clientRect.y,
    };
  }

  return (
    <div className="signature-container">
      <canvas
        className="signature"
        width={475}
        height={99}
        onMouseDown={() => {
          drawing = true;
        }}
        onMouseUp={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        ref={canvasRef}
        style={{ background: '#fff' }} //, width: '100%'
      ></canvas>
    </div>
  );
};

export default Signature;

//https://demo.latromi.com.br/web/exemplos/assinatura-digital

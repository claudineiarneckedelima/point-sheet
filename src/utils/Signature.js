import React, { useRef } from 'react';

const Signature = () => {
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

  function eraseSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  }

  return (
    <div>
      <div className="signature-container">
        <canvas
          className="signature"
          width={475}
          height={99}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          ref={canvasRef}
          style={{ background: '#fff' }}
        ></canvas>
      </div>
      <input
        className="eraseSignature"
        type="button"
        onClick={() => eraseSignature()}
        value="Limpar Assinatura"
      />
    </div>
  );
};

export default Signature;

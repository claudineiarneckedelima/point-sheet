const UploadPDF = () => (
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
);

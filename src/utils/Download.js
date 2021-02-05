const Download = (arrayBuffer, type) => {
  var blob = new Blob([arrayBuffer], { type: type });
  var url = URL.createObjectURL(blob);
  window.open(url);
};

export default Download;

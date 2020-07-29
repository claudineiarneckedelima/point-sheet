const Download = (arrayBuffer, type) => {
  var blob = new Blob([arrayBuffer], { type: type });
  var url = URL.createObjectURL(blob);
  window.location.href = url;
};

export default Download;

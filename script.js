const video = document.getElementById("webcam");
const statusText = document.getElementById("status");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    setInterval(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');

      fetch('/process_frame', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ image: imageData })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          statusText.innerText = `Detections: ${data.detections}`;
        } else {
          statusText.innerText = `Error: ${data.message}`;
        }
      })
      .catch(err => {
        statusText.innerText = 'Error sending image';
        console.error(err);
      });
    }, 2000);
  })
  .catch(err => {
    console.error('Failed to access webcam:', err);
    statusText.innerText = 'Webcam access denied';
  });


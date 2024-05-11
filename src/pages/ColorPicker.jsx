import React, { useRef, useState, useEffect } from 'react';

const ColorPicker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const constraints = {
      video: {
        width: 300, // Set width of video stream
        height: 200, // Set height of video stream
        borderRadius: '10px',
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing the camera:', err);
      });

    const handleCapture = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const color = {
        r: data[0],
        g: data[1],
        b: data[2],
      };
      setSelectedColor(color);
    };

    const interval = setInterval(handleCapture, 1000); // Capture every second

    return () => {
      clearInterval(interval);
    };
  }, []);

  const copyColorValue = () => {
    const { r, g, b } = selectedColor;
    const rgbValue = `rgb(${r}, ${g}, ${b})`;
    navigator.clipboard
      .writeText(rgbValue)
      .then(() => {
        alert('Color value copied to clipboard: ' + rgbValue);
      })
      .catch((err) => {
        console.error('Error copying color value:', err);
      });
  };

  const rgbValuesStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#8644A2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const colorDisplayStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: selectedColor
      ? `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`
      : '#fff',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    zIndex: -1,
  };

  const borderStyle = {
    border: '20px solid #D8B4F8',
    borderRadius: '10px', // Adjust border properties as needed
    height: '94vh',
    width: '96vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  };

  const headerStyle = {
    width: '96vw',
    height: '10vh', // Adjust the height of the header
    backgroundColor: '#FBF0B2',
    position: 'absolute',
    top: 20,
    right: 5,
    left: 19,
    zIndex: 1, // Ensure the header is above other content
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const buttonStyle = {
    background: '#CAEDFF',
    color: "black",
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '12px',
    border: '10px #89CFF3',
  };

  return (
    <div>
      <div style={headerStyle}>
        <h1 className="text-center font-bold mb-4">Color Picker</h1>
      </div>
      <div style={borderStyle}>
        <div className="max-w-lg mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md relative">
          <div className="absolute bottom-0 right-0 aspect-w-1 aspect-h-1 ">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ borderRadius: '10px', bottom: 0, right: 0 }}
            ></video>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div
              className="w-24 h-24 rounded-lg shadow-md"
              style={colorDisplayStyle}
            ></div>

            {selectedColor && (
              <div className="mt-4 text-center">
                <p style={rgbValuesStyle}>
                  RGB: {selectedColor.r}, {selectedColor.g}, {selectedColor.b}
                </p>
                <button
                  onClick={copyColorValue}
                  className="mt-2 rounded-md shadow-sm"
                  style={buttonStyle}
                >
                  Copy Color Value
                </button>
              </div>
            )}
          </div>
          <canvas
            ref={canvasRef}
            width="100"
            height="150"
            className="rounded-lg"
            style={{ display: 'none' }}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;

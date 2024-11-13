import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw } from "lucide-react";

export const WebcamCapture = ({ onPhotoCapture }) => {
  const [isCapturing, setIsCapturing] = useState(true);
  const [photoData, setPhotoData] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 320,
    height: 320,
    facingMode: "user"
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotoData(imageSrc);
    setIsCapturing(false);
    if (onPhotoCapture) onPhotoCapture(imageSrc);
  };

  const retake = () => {
    setPhotoData(null);
    setIsCapturing(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
      {isCapturing ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg"
          />
          <Button
            onClick={capture}
            className="w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            Tomar foto
          </Button>
        </>
      ) : (
        <>
          <img
            src={photoData}
            alt="Captured"
            className="rounded-lg"
            style={{ width: 320, height: 320 }}
          />
          <Button
            onClick={retake}
            variant="outline"
            className="w-full"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Tomar otra foto
          </Button>
        </>
      )}
    </div>
  );
}; 
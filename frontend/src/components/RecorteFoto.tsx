import { useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../styles/Recortefoto.css";

interface RecorteFotoProps {
  onImageCropped: (imageUrl: string) => void;
  onImageUsedDirectly: (imageUrl: string) => void;
  onCancel: () => void;
  imageUrl: string;
}

const RecorteFoto = ({
  onImageCropped,
  onImageUsedDirectly,
  onCancel,
  imageUrl,
}: RecorteFotoProps) => {
  const [showCropTool, setShowCropTool] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleSaveCrop = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height)
      return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedImageUrl = URL.createObjectURL(blob);
        onImageCropped(croppedImageUrl);
      },
      "image/jpeg",
      0.95
    );
  };
  return (
    <div className="crop-container">
      {!showCropTool ? (
        <div className="image-preview-options">
          <img src={imageUrl} alt="Preview" className="preview-image" />
          <div className="preview-actions">
            <button
              type="button"
              className="crop-button use-direct"
              onClick={() => onImageUsedDirectly(imageUrl)}
              data-testid="btn-usar-assim"
            >
              ✅ Usar assim
            </button>
            <button
              type="button"
              className="crop-button start-crop"
              onClick={() => setShowCropTool(true)}
              data-testid="btn-recortar"
            >
              ✂️ Recortar
            </button>
            <button
              type="button"
              className="crop-button cancel"
              onClick={onCancel}
              data-testid="btn-cancelar"
            >
              ❌ Cancelar
            </button>
          </div>
          <p className="preview-instruction">
            Escolha se quer usar a imagem assim ou recortá-la
          </p>
        </div>
      ) : (
        // Ferramenta de recorte
        <div className="crop-tool">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
          >
            <img ref={imgRef} src={imageUrl} alt="Recorte" />
          </ReactCrop>
          <div className="crop-actions">
            <button
              type="button"
              className="crop-button save"
              onClick={handleSaveCrop}
              data-testid="btn-salvar-recorte"
            >
              ✅ Salvar recorte
            </button>
            <button
              type="button"
              className="crop-button back"
              onClick={() => setShowCropTool(false)}
              data-testid="btn-voltar"
            >
              ⬅️ Voltar
            </button>
            <button
              type="button"
              className="crop-button cancel"
              onClick={onCancel}
              data-testid="btn-cancelar-recorte"
            >
              ❌ Cancelar
            </button>
          </div>
          <p className="crop-instruction">
            Arraste para ajustar o recorte da imagem
          </p>
        </div>
      )}
    </div>
  );
};

export default RecorteFoto;

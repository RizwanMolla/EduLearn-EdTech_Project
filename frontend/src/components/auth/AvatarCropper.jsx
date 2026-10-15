import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut } from 'lucide-react';
import Button from '../ui/Button';

const AvatarCropper = ({ src, onCancel, onSave, saving }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [area, setArea] = useState(null);
  const onComplete = useCallback((_, pixels) => setArea(pixels), []);

  return (
    <div className="p-5 sm:p-6">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-coal">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onComplete}
        />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <ZoomOut size={16} className="text-ink-3" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-[var(--ink)]"
          aria-label="Zoom"
        />
        <ZoomIn size={16} className="text-ink-3" />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => area && onSave(area)} loading={saving}>
          Save photo
        </Button>
      </div>
    </div>
  );
};

export default AvatarCropper;

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, RotateCcw, Check, PenTool, Upload, Image as ImageIcon, RotateCw, Sparkles, Trash2 } from 'lucide-react';

export default function SignatureModal({ isOpen, onClose, onSave, title = '서명 입력' }) {
  const [mode, setMode] = useState('draw'); // 'draw' | 'upload'
  
  // 직접 그리기 관련 상태
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // 이미지 업로드 관련 상태
  const fileInputRef = useRef(null);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [removeBg, setRemoveBg] = useState(true);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setHasDrawn(false);
      setRawImageSrc(null);
      setProcessedImage(null);
      setRotation(0);
      setRemoveBg(true);

      if (mode === 'draw' && canvasRef.current) {
        initCanvas();
      }
    }
  }, [isOpen]);

  // 탭 변경 시 캔버스 초기화
  useEffect(() => {
    if (isOpen && mode === 'draw' && canvasRef.current) {
      initCanvas();
    }
  }, [mode, isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setHasDrawn(false);
  };

  // 클립보드 이미지 붙여넣기(Ctrl+V) 지원
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelect(file);
            setMode('upload');
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  // 서명 이미지 자동 처리 (배경 투명화 및 여백 트리밍)
  const processImage = useCallback((imgSrc, deg, autoRemoveBg) => {
    if (!imgSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const offscreen = document.createElement('canvas');
        const ctx = offscreen.getContext('2d', { willReadFrequently: true });

        // 회전에 따른 캔버스 크기 계산
        const isRotated90or270 = deg === 90 || deg === 270;
        const width = isRotated90or270 ? img.height : img.width;
        const height = isRotated90or270 ? img.width : img.height;

        // 적정 크기로 스케일 다운 (최대 폭 800px)
        const maxDim = 800;
        let scale = 1;
        if (Math.max(width, height) > maxDim) {
          scale = maxDim / Math.max(width, height);
        }

        const finalWidth = Math.round(width * scale);
        const finalHeight = Math.round(height * scale);

        offscreen.width = finalWidth;
        offscreen.height = finalHeight;

        ctx.save();
        ctx.translate(finalWidth / 2, finalHeight / 2);
        ctx.rotate((deg * Math.PI) / 180);
        if (isRotated90or270) {
          ctx.drawImage(img, -finalHeight / 2, -finalWidth / 2, finalHeight, finalWidth);
        } else {
          ctx.drawImage(img, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight);
        }
        ctx.restore();

        if (autoRemoveBg) {
          // 배경 투명화 및 서명 획 추출
          const imgData = ctx.getImageData(0, 0, finalWidth, finalHeight);
          const data = imgData.data;

          // 밝기 분포 계산
          let minX = finalWidth, minY = finalHeight, maxX = 0, maxY = 0;
          let hasInk = false;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 30) continue; // 이미 투명

            // 명도 (Grayscale)
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            const threshold = 210; // 종이 밝기 기준

            if (brightness > threshold) {
              // 흰 종이 배경 -> 투명하게
              data[i + 3] = 0;
            } else {
              // 잉크/글씨 영역
              const inkStrength = Math.min(1, Math.max(0, (threshold - brightness) / 75));
              // 선명한 짙은 잉크 색상(#0f172a)으로 보정
              data[i] = 15;
              data[i + 1] = 23;
              data[i + 2] = 42;
              data[i + 3] = Math.round(inkStrength * 255);

              // 서명 영역 바운딩 박스 추적
              const pixelIdx = i / 4;
              const px = pixelIdx % finalWidth;
              const py = Math.floor(pixelIdx / finalWidth);

              if (px < minX) minX = px;
              if (px > maxX) maxX = px;
              if (py < minY) minY = py;
              if (py > maxY) maxY = py;
              hasInk = true;
            }
          }

          ctx.putImageData(imgData, 0, 0);

          // 여백 자동 크롭 (서명이 식별되었을 때)
          if (hasInk && maxX > minX && maxY > minY) {
            const pad = 16;
            const cropX = Math.max(0, minX - pad);
            const cropY = Math.max(0, minY - pad);
            const cropW = Math.min(finalWidth - cropX, (maxX - minX) + pad * 2);
            const cropH = Math.min(finalHeight - cropY, (maxY - minY) + pad * 2);

            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = cropW;
            croppedCanvas.height = cropH;
            const croppedCtx = croppedCanvas.getContext('2d');
            croppedCtx.drawImage(offscreen, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

            setProcessedImage(croppedCanvas.toDataURL('image/png'));
            setIsProcessing(false);
            return;
          }
        }

        setProcessedImage(offscreen.toDataURL('image/png'));
      } catch (err) {
        console.error('이미지 처리 실패:', err);
        setProcessedImage(imgSrc);
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = imgSrc;
  }, []);

  // 파일 선택 처리
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('이미지 파일(PNG, JPG, WEBP 등)만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      setRawImageSrc(src);
      setRotation(0);
      processImage(src, 0, removeBg);
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360;
    setRotation(nextRot);
    processImage(rawImageSrc, nextRot, removeBg);
  };

  const handleToggleRemoveBg = (e) => {
    const checked = e.target.checked;
    setRemoveBg(checked);
    processImage(rawImageSrc, rotation, checked);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // 직접 그리기 터치/마우스 이벤트
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasDrawn(false);
    } else {
      setRawImageSrc(null);
      setProcessedImage(null);
      setRotation(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    if (mode === 'draw') {
      if (!hasDrawn) {
        alert('서명을 작성해 주세요.');
        return;
      }
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
      onClose();
    } else {
      if (!processedImage) {
        alert('업로드할 서명 이미지를 선택해 주세요.');
        return;
      }
      onSave(processedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card signature-modal">
        {/* 모달 헤더 */}
        <div className="modal-header">
          <div className="modal-title">
            <PenTool size={20} className="text-primary" />
            <h3>{title}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} title="닫기">
            <X size={20} />
          </button>
        </div>

        {/* 탭 전환 버튼 */}
        <div className="signature-tabs">
          <button
            type="button"
            className={`sig-tab-btn ${mode === 'draw' ? 'active' : ''}`}
            onClick={() => setMode('draw')}
          >
            <PenTool size={16} /> 직접 그리기 (마우스/터치)
          </button>
          <button
            type="button"
            className={`sig-tab-btn ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => setMode('upload')}
          >
            <Upload size={16} /> 손글씨 서명 사진/이미지 업로드
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="modal-body">
          {mode === 'draw' ? (
            <>
              <p className="signature-guide">마우스 또는 터치펜/손가락으로 아래 칸에 정자체 또는 서명을 해주세요.</p>
              <div className="canvas-wrapper">
                <canvas
                  ref={canvasRef}
                  className="signature-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="canvas-baseline">서명선</div>
              </div>
            </>
          ) : (
            <div className="signature-upload-container">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {!processedImage ? (
                <div
                  className={`sig-dropzone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dropzone-icon">
                    <Upload size={36} />
                  </div>
                  <h4>서명 사진 또는 이미지 파일을 선택하세요</h4>
                  <p className="dropzone-sub">
                    이곳을 클릭하거나 파일을 드래그하여 업로드할 수 있습니다.<br />
                    (스마트폰으로 종이에 쓴 서명을 찍은 사진, 투명 PNG, 캡처 이미지 등 지원)
                  </p>
                  <span className="dropzone-hint">
                    💡 클립보드에 복사된 서명 이미지가 있다면 <strong>Ctrl + V</strong> 로 바로 붙여넣기도 가능합니다.
                  </span>
                </div>
              ) : (
                <div className="sig-preview-wrapper">
                  <div className="sig-preview-card">
                    <div className="sig-preview-canvas-box">
                      <img
                        src={processedImage}
                        alt="서명 미리보기"
                        className="sig-preview-img"
                      />
                      <div className="canvas-baseline">서명선</div>
                      {isProcessing && (
                        <div className="processing-overlay">처리 중...</div>
                      )}
                    </div>
                  </div>

                  {/* 이미지 보정 및 회전 옵션 */}
                  <div className="sig-options-bar">
                    <label className="sig-option-checkbox">
                      <input
                        type="checkbox"
                        checked={removeBg}
                        onChange={handleToggleRemoveBg}
                      />
                      <Sparkles size={16} className="text-primary" />
                      <span><strong>종이 배경 자동 투명화</strong> (서명 선만 추출)</span>
                    </label>

                    <div className="sig-action-btns">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={handleRotate}
                        title="이미지 90도 회전"
                      >
                        <RotateCw size={14} /> 90° 회전
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline text-danger"
                        onClick={handleClear}
                        title="다른 이미지 선택"
                      >
                        <Trash2 size={14} /> 변경
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleClear}>
            <RotateCcw size={16} /> {mode === 'draw' ? '다시 작성' : '초기화'}
          </button>
          <div className="btn-group-right">
            <button className="btn btn-secondary" onClick={onClose}>취소</button>
            <button className="btn btn-primary" onClick={handleConfirm}>
              <Check size={16} /> 서명 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

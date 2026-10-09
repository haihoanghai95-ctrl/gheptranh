import { useState } from 'react';
import { Header } from './components/Header';
import { PuzzleGallery } from './components/PuzzleGallery';
import { PuzzleBoard } from './components/PuzzleBoard';
import { CreatePuzzleModal } from './components/CreatePuzzleModal';
import { GoogleImageSearchModal } from './components/GoogleImageSearchModal';
import { KidDrawingPad } from './components/KidDrawingPad';
import { PRESET_IMAGES } from './data/presetImages';
import { PieceCount, PuzzleImage, PuzzleSettings } from './types';
import { audioManager } from './utils/audio';

export default function App() {
  const [images, setImages] = useState<PuzzleImage[]>(PRESET_IMAGES);
  const [currentView, setCurrentView] = useState<'gallery' | 'playing' | 'drawing' | 'guide'>('gallery');
  const [activeImage, setActiveImage] = useState<PuzzleImage>(PRESET_IMAGES[0]);
  const [activeSettings, setActiveSettings] = useState<PuzzleSettings>({
    pieceCount: 2,
    cutStyle: 'classic',
    allowRotation: false,
    ghostOpacity: 0.5,
    smartAssist: true,
    soundEnabled: true,
    splitOrientation: 'horizontal',
  });

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showGoogleSearchModal, setShowGoogleSearchModal] = useState<boolean>(false);
  const [customizingImage, setCustomizingImage] = useState<PuzzleImage | undefined>(undefined);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioManager.setSoundEnabled(next);
  };

  const handleStartPuzzle = (image: PuzzleImage, settings: PuzzleSettings) => {
    setActiveImage(image);
    setActiveSettings(settings);
    setCurrentView('playing');
    setShowCreateModal(false);
    setShowGoogleSearchModal(false);
  };

  const handleCustomizePuzzle = (image: PuzzleImage) => {
    setCustomizingImage(image);
    setShowCreateModal(true);
  };

  const handleSelectGoogleImage = (image: PuzzleImage) => {
    setImages((prev) => [image, ...prev]);
    setShowGoogleSearchModal(false);
    // Open create puzzle modal with the chosen image
    setCustomizingImage(image);
    setShowCreateModal(true);
  };

  const handleUseDrawing = (dataUrl: string, title: string) => {
    const newImage: PuzzleImage = {
      id: `drawing-${Date.now()}`,
      title,
      titleEn: 'Kid Artwork',
      category: 'custom',
      src: dataUrl,
      isCustom: true,
    };
    setImages((prev) => [newImage, ...prev]);
    // Automatically start puzzle with this drawing
    handleStartPuzzle(newImage, {
      pieceCount: 2,
      cutStyle: 'classic',
      allowRotation: false,
      ghostOpacity: 0.5,
      smartAssist: true,
      soundEnabled,
      splitOrientation: 'horizontal',
    });
  };

  const handleNextDifficulty = () => {
    const progression: PieceCount[] = [2, 4, 6, 9, 12, 16];
    const currentIndex = progression.indexOf(activeSettings.pieceCount);
    if (currentIndex >= 0 && currentIndex < progression.length - 1) {
      const nextCount = progression[currentIndex + 1];
      setActiveSettings((prev) => ({
        ...prev,
        pieceCount: nextCount,
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800">
      {/* Top Bar Header */}
      <Header
        currentTab={
          showGoogleSearchModal
            ? 'search'
            : currentView === 'drawing'
            ? 'draw'
            : currentView === 'guide'
            ? 'guide'
            : 'gallery'
        }
        onSelectTab={(tab) => {
          if (tab === 'search') {
            setShowGoogleSearchModal(true);
          } else if (tab === 'create') {
            setCustomizingImage(undefined);
            setShowCreateModal(true);
          } else if (tab === 'draw') {
            setCurrentView('drawing');
          } else {
            setCurrentView(tab);
          }
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-4">
        {currentView === 'gallery' && (
          <PuzzleGallery
            images={images}
            onPlayPuzzle={handleStartPuzzle}
            onCustomizePuzzle={handleCustomizePuzzle}
            onOpenDrawingPad={() => setCurrentView('drawing')}
            onOpenUploadModal={() => {
              setCustomizingImage(undefined);
              setShowCreateModal(true);
            }}
            onOpenGoogleSearch={() => setShowGoogleSearchModal(true)}
          />
        )}

        {currentView === 'guide' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧩</span>
                <div>
                  <h1 className="text-2xl font-black text-slate-800">
                    Hướng Dẫn Bé Ghép Tranh & Phụ Huynh
                  </h1>
                  <p className="text-sm font-semibold text-slate-500">
                    Trò chơi rèn luyện sự khéo léo, tư duy hình học và khả năng tập trung cho trẻ mầm non
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <h2 className="font-black text-amber-950 mb-1 text-base">
                    1. Vì sao có từ 2 mảnh ghép?
                  </h2>
                  <p>
                    Đối với trẻ mầm non từ 2 đến 3 tuổi, việc ghép 2 nửa bức tranh (nửa trái - nửa phải) là bước phát triển vàng để bé học cách so khớp màu sắc, đường nét và cảm nhận thành công đầu tiên. Khi bé tự tin, bạn có thể tăng dần lên 4 mảnh, 6 mảnh và 9 mảnh!
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <h2 className="font-black text-amber-950 mb-1 text-base">
                    2. Bé có 2 cách ghép linh hoạt:
                  </h2>
                  <ul className="list-disc list-inside space-y-1 mt-1 font-medium">
                    <li>
                      <strong>Cách 1 - Chạm 1 chạm (Tap-to-place):</strong> Bé chạm vào mảnh ghép ở khay bên phải, ô trống cần ghép trên bảng sẽ phát sáng có ngôi sao chỉ dẫn. Bé chỉ cần chạm vào ô đó là mảnh ghép tự bay vào vị trí!
                    </li>
                    <li>
                      <strong>Cách 2 - Kéo thả (Drag & Drop):</strong> Bé đặt ngón tay lên mảnh ghép và kéo rê vào bảng, khi đến gần vị trí đúng thì mảnh ghép sẽ tự động hút vào kèm tiếng chuông reo vui tai.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <h2 className="font-black text-amber-950 mb-1 text-base">
                    3. Tìm kiếm hình ảnh trực tuyến & Bé tự vẽ:
                  </h2>
                  <p>
                    Bé và bố mẹ có thể tìm kiếm bất kỳ hình ảnh yêu thích nào trên Google & Web (ví dụ: siêu nhân, búp bê, chú cún, xe buýt), tải ảnh gia đình lên, chụp từ camera hoặc bé tự cầm bút màu sáp vẽ tranh trên bảng vẽ tích hợp để ghép!
                  </p>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  onClick={() => setCurrentView('gallery')}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer text-base"
                >
                  Bắt Đầu Chơi Ngay Nào!
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'drawing' && (
          <div className="px-3 sm:px-6">
            <KidDrawingPad
              onUseDrawing={handleUseDrawing}
              onCancel={() => setCurrentView('gallery')}
            />
          </div>
        )}

        {currentView === 'playing' && (
          <PuzzleBoard
            image={activeImage}
            settings={activeSettings}
            onBackToGallery={() => setCurrentView('gallery')}
            onNextDifficulty={handleNextDifficulty}
          />
        )}
      </main>

      {/* Google Image Search Modal */}
      {showGoogleSearchModal && (
        <GoogleImageSearchModal
          onSelectImage={handleSelectGoogleImage}
          onClose={() => setShowGoogleSearchModal(false)}
        />
      )}

      {/* Create / Customize Puzzle Modal */}
      {showCreateModal && (
        <CreatePuzzleModal
          initialImage={customizingImage}
          onStartPuzzle={handleStartPuzzle}
          onOpenDrawingPad={() => {
            setShowCreateModal(false);
            setCurrentView('drawing');
          }}
          onOpenGoogleSearch={() => {
            setShowCreateModal(false);
            setShowGoogleSearchModal(true);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

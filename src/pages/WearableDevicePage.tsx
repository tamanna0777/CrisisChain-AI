import React, { useState, useEffect, useRef } from 'react';
import { 
  Watch, 
  Camera, 
  QrCode, 
  BatteryCharging, 
  Battery, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Activity, 
  X, 
  Zap, 
  Sparkles, 
  Trash2, 
  ShieldCheck,
  Radio,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrisis } from '../context/CrisisContext';
import { WearableDeviceRecord, CatalogDevice } from '../types';

export const WearableDevicePage: React.FC = () => {
  const { userProfile } = useAuth();
  const { 
    devices, 
    registeredCatalog, 
    validateAndConnectDevice, 
    disconnectDevice, 
    pingWearableDevice 
  } = useCrisis();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualSerialInput, setManualSerialInput] = useState('');
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  // Validation state during pairing
  const [scannedCatalogItem, setScannedCatalogItem] = useState<CatalogDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectSuccessMessage, setConnectSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Start real Camera stream if user opens scanner
  const startCameraStream = async () => {
    setErrorMessage(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsStreaming(true);
          setCameraPermission('granted');
        }
      }
    } catch (err: any) {
      console.warn('Camera access prompt warning:', err.message);
      setCameraPermission('denied');
    }
  };

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (isScannerOpen) {
      startCameraStream();
    } else {
      stopCameraStream();
    }
    return () => stopCameraStream();
  }, [isScannerOpen]);

  // Handle scanned or entered barcode
  const handleValidateSerial = (serial: string) => {
    setErrorMessage(null);
    setConnectSuccessMessage(null);

    const found = registeredCatalog.find(
      (d) => d.serialNumber.toUpperCase() === serial.trim().toUpperCase()
    );

    if (!found) {
      setErrorMessage(
        `Serial "${serial}" is not found in the Government REACT Wearable Registry. Please select a valid official device.`
      );
      setScannedCatalogItem(null);
      return;
    }

    // Check if device already assigned
    const already = devices.find((d) => d.serialNumber.toUpperCase() === found.serialNumber.toUpperCase());
    if (already) {
      setErrorMessage(`Device ${found.deviceName} is already linked to your CrisisChain profile.`);
      setScannedCatalogItem(null);
      return;
    }

    setScannedCatalogItem(found);
  };

  const handleConfirmConnect = async () => {
    if (!scannedCatalogItem) return;
    setIsConnecting(true);
    try {
      const res = await validateAndConnectDevice(scannedCatalogItem.serialNumber);
      if (res.success) {
        setConnectSuccessMessage(res.message);
        setScannedCatalogItem(null);
        setManualSerialInput('');
        setTimeout(() => {
          setIsScannerOpen(false);
          setConnectSuccessMessage(null);
        }, 2200);
      } else {
        setErrorMessage(res.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="page-hero-banner bg-gradient-to-r from-[#0D2A4F] to-[#123868] border border-[#1E4370] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Biometric & Fall SAR Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#FFFFFF] hero-banner-title sm:text-3xl">
            Connect Your REACT Safety Device
          </h1>
          <p className="text-xs sm:text-sm text-[#E2E8F0] hero-banner-desc mt-1 max-w-2xl">
            Link your wearable emergency device to CrisisChain to broadcast automated fall detection, heart distress pulses, and hardware SOS triggers.
          </p>
        </div>

        <button
          id="btn-scan-qr-code-main"
          onClick={() => {
            setErrorMessage(null);
            setConnectSuccessMessage(null);
            setScannedCatalogItem(null);
            setIsScannerOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0 border border-blue-400/50 hover:scale-[1.02]"
        >
          <Camera className="w-4 h-4" />
          <span>Scan QR Code</span>
        </button>
      </div>

      {/* Connected Wearables Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Active Connected Devices
            <span className="text-xs font-normal text-slate-400">
              ({devices.length} linked hardware beacons)
            </span>
          </h2>
        </div>

        {devices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div
                key={device.id}
                id={`card-device-${device.id}`}
                className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-900/60 border border-blue-500/50 text-blue-400 flex items-center justify-center shadow">
                        <Watch className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{device.deviceName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono font-bold text-blue-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                            {device.serialNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Connected
                    </span>
                  </div>

                  {/* Device Metrics */}
                  <div className="mt-4 bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <BatteryCharging className="w-4 h-4 text-emerald-400" /> Battery Status:
                      </span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {device.batteryStatus}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-400" /> Fall Sensor:
                      </span>
                      <span className="text-blue-300 font-semibold">Active Monitoring</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> Last Sync:
                      </span>
                      <span className="text-slate-300">
                        {new Date(device.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Ping test & Disconnect */}
                <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => pingWearableDevice(device.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-blue-200 text-xs font-semibold border border-blue-700/60 transition flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ping & Sync</span>
                  </button>

                  <button
                    onClick={() => disconnectDevice(device.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/80 hover:text-red-400 text-slate-400 text-xs transition border border-slate-700"
                    title="Disconnect Device"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 text-center space-y-3">
            <Watch className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No REACT Device Linked</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Scan the QR code printed on your official REACT safety wristband or beacon to enable automatic emergency heart and fall telemetry.
            </p>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow"
            >
              Scan Device QR Code
            </button>
          </div>
        )}
      </div>

      {/* ================= QR SCANNER & REGISTRATION MODAL ================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsScannerOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-2 shadow">
                <QrCode className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Scan & Connect REACT Device</h2>
              <p className="text-xs text-slate-400">
                Point your camera at the QR code on your wearable packaging or select a certified model below.
              </p>
            </div>

            {/* Error and Success Feedback */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {connectSuccessMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{connectSuccessMessage}</span>
              </div>
            )}

            {/* Live Camera Viewfinder */}
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-dashed border-blue-500/50 h-56 flex items-center justify-center mb-4">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
                playsInline
                muted
              />

              {!isStreaming && (
                <div className="text-center p-4">
                  <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-slate-300 font-semibold">Camera Scanner Active</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Align official QR barcode within viewfinder frame
                  </p>
                </div>
              )}

              {/* Scanning Target Crosshair */}
              <div className="absolute inset-8 border border-emerald-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                </div>
                <div className="h-0.5 w-full bg-emerald-400/80 animate-pulse shadow-sm shadow-emerald-400"></div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                </div>
              </div>
            </div>

            {/* Quick Certified Sample Devices Selector (Allows Instant Test without physical QR print) */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Scan with Certified Device Serial:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {registeredCatalog.map((cat) => (
                  <button
                    key={cat.serialNumber}
                    type="button"
                    onClick={() => handleValidateSerial(cat.serialNumber)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-left transition text-xs flex flex-col justify-between"
                  >
                    <div className="font-semibold text-white truncate">{cat.deviceName}</div>
                    <div className="flex items-center justify-between text-[11px] text-blue-300 mt-1 font-mono">
                      <span>{cat.serialNumber}</span>
                      <span className="text-emerald-400 font-sans">{cat.defaultBattery}% Bat</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Serial Barcode Input */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Or Type Serial Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualSerialInput}
                  onChange={(e) => setManualSerialInput(e.target.value)}
                  placeholder="e.g. REACT-V3-98421"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleValidateSerial(manualSerialInput)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Scanned Device Confirmation Details */}
            {scannedCatalogItem && (
              <div className="bg-blue-950/80 border-2 border-emerald-500/80 rounded-2xl p-4 text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Device Validated
                  </span>
                  <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono">
                    Ready to Link
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-900 text-slate-200">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Device Name:</span>
                    <strong className="text-white">{scannedCatalogItem.deviceName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Serial Number:</span>
                    <strong className="text-blue-300 font-mono">{scannedCatalogItem.serialNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Battery Status:</span>
                    <strong className="text-emerald-400">{scannedCatalogItem.defaultBattery}% (Healthy)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Firmware / SAR:</span>
                    <strong className="text-slate-300 font-mono text-[11px]">{scannedCatalogItem.firmware}</strong>
                  </div>
                </div>

                <button
                  id="btn-confirm-connect-device"
                  onClick={handleConfirmConnect}
                  disabled={isConnecting}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {isConnecting ? 'Linking Device to Citizen Profile...' : 'Connect Device'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

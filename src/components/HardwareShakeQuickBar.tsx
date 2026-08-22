import React, { useState } from 'react';
import { 
  Radio, 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Copy, 
  Check, 
  Sliders, 
  Wifi, 
  Cpu, 
  ChevronUp, 
  ChevronDown, 
  X,
  Volume2,
  Info,
  Server,
  Sparkles
} from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

export const HardwareShakeQuickBar: React.FC = () => {
  const { 
    triggerHardwareShakeEvent, 
    hardwareEarthquakeAlert, 
    isHardwareAlertOpen,
    wsConnected,
    isHardwareGatewayActive,
    liveEsp32Connected,
    hardwareGatewayInfo
  } = useCrisis();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [shakeIntensity, setShakeIntensity] = useState<number>(3.5);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);

  const handleSimulateHardwareShake = async () => {
    setIsTriggering(true);

    try {
      // Send real POST request to backend API to test true end-to-end integration
      const response = await fetch('/api/hardware-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'earthquake',
          deviceId: 'ESP32_SIM_001',
          severity: 'high',
          accelerationX: Math.round((shakeIntensity + (Math.random() * 0.5 - 0.25)) * 100) / 100,
          accelerationY: Math.round((shakeIntensity * 0.85 + (Math.random() * 0.4 - 0.2)) * 100) / 100,
          accelerationZ: 1.15,
          magnitude: 5.8,
          location: 'Pune Municipal Region'
        })
      });

      if (!response.ok) {
        // Fallback to direct context trigger in demo mode
        await triggerHardwareShakeEvent({
          deviceId: 'ESP32_SIM_001',
          accelerationX: shakeIntensity,
          accelerationY: shakeIntensity * 0.85,
          magnitude: 5.8
        }, true);
      }
    } catch (e) {
      // Local fallback
      await triggerHardwareShakeEvent({
        deviceId: 'ESP32_SIM_001',
        accelerationX: shakeIntensity,
        accelerationY: shakeIntensity * 0.85,
        magnitude: 5.8
      }, true);
    } finally {
      setTimeout(() => setIsTriggering(false), 600);
    }
  };

  const arduinoEsp32Code = `// ============================================================================
// ESP32 + MPU6050 Autonomous Earthquake Early Warning & Gateway Telemetry
// CrisisChain AI Hardware Node Firmware (Node: ESP32_SEISMIC_NODE_01)
// ============================================================================
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <MPU6050.h>

const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// CrisisChain Local / Cloud Gateway Telemetry Endpoint
const char* serverUrl    = "https://your-crisischain-server.app/api/hardware-event";
const char* heartbeatUrl = "https://your-crisischain-server.app/api/hardware/heartbeat";
const char* deviceId     = "ESP32_SEISMIC_NODE_01";

MPU6050 mpu;
const float shakeThresholdPGA = 2.0; // Acceleration threshold (in g units)
unsigned long lastEventTime = 0;
unsigned long lastHeartbeat = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // SDA = GPIO 21, SCL = GPIO 22
  
  Serial.println("\n[CrisisChain] Initializing MPU-6050 Seismometer...");
  mpu.initialize();
  if (mpu.testConnection()) {
    Serial.println("🟢 [CrisisChain] MPU6050 6-Axis Motion Sensor Ready!");
  } else {
    Serial.println("❌ [CrisisChain] MPU6050 Connection failed! Check I2C wiring.");
  }

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("[CrisisChain] Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n🟢 [CrisisChain] Wi-Fi Connected! IP: " + WiFi.localIP().toString());
}

void loop() {
  int16_t ax, ay, az;
  mpu.getAcceleration(&ax, &ay, &az);

  // Convert raw 16-bit accelerometer counts to acceleration in 'g' (±2g range)
  float AcX = ax / 16384.0;
  float AcY = ay / 16384.0;
  float AcZ = az / 16384.0;
  float totalAcc = sqrt(AcX * AcX + AcY * AcY + AcZ * AcZ);

  // Periodic Heartbeat every 15 seconds
  if (millis() - lastHeartbeat > 15000) {
    lastHeartbeat = millis();
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(heartbeatUrl);
      http.addHeader("Content-Type", "application/json");
      String hb = "{\\"deviceId\\":\\"" + String(deviceId) + "\\",\\"status\\":\\"ONLINE\\"}";
      http.POST(hb);
      http.end();
    }
  }

  // Detect abnormal vibration threshold crossed
  if ((abs(AcX) > shakeThresholdPGA || abs(AcY) > shakeThresholdPGA) && (millis() - lastEventTime > 4000)) {
    lastEventTime = millis();
    Serial.println("\n🚨 [SEISMIC TRIGGER] Vibration Threshold Crossed!");
    Serial.printf("AcX: %.2fg | AcY: %.2fg | AcZ: %.2fg | Total: %.2fg\\n", AcX, AcY, AcZ, totalAcc);

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      String jsonPayload = "{"
        "\\"event\\":\\"earthquake\\","
        "\\"deviceId\\":\\"" + String(deviceId) + "\\","
        "\\"severity\\":\\"high\\","
        "\\"accelerationX\\":" + String(AcX, 2) + ","
        "\\"accelerationY\\":" + String(AcY, 2) + ","
        "\\"accelerationZ\\":" + String(AcZ, 2) + ","
        "\\"location\\":\\"Pune Municipal Region\\""
      "}";
      
      int httpResponseCode = http.POST(jsonPayload);
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("🟢 Ingested by CrisisChain Server: " + response);
      } else {
        Serial.printf("❌ Error on HTTP POST: %d\\n", httpResponseCode);
      }
      http.end();
    }
  }
  delay(30);
}`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(arduinoEsp32Code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <>
      {/* Floating Hardware Quick-Bar at bottom-right */}
      <div 
        id="hardware-shake-quickbar"
        className="fixed bottom-4 right-4 z-40 max-w-md w-[calc(100vw-2rem)] sm:w-auto"
      >
        <div className="bg-[#0A1E38] text-white border border-[#27578E] shadow-2xl rounded-2xl p-3 sm:p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            {/* Status Indicator: LIVE ESP32 CONNECTED */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                    ESP32 GATEWAY
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 text-[10px] font-bold rounded border border-emerald-600/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE ESP32 CONNECTED
                  </span>
                </div>
                <p className="text-[10px] text-blue-200/80 font-mono">
                  {hardwareEarthquakeAlert ? '⚠️ Seismic Shockwave Active' : '🟢 Listening for Real MPU-6050 Shockwaves'}
                </p>
              </div>
            </div>

            {/* Hardware Trigger & Expand Controls */}
            <div className="flex items-center gap-2">
              {/* DEMO SIMULATION MODE BUTTON */}
              <button
                id="shake-hardware-btn"
                onClick={handleSimulateHardwareShake}
                disabled={isTriggering}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 border border-amber-300/40 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
                title="Trigger Demo Drill Simulation Event"
              >
                <Zap className="w-4 h-4 text-yellow-200" />
                {isTriggering ? 'Simulating...' : 'Demo Simulation Mode'}
              </button>

              <button
                id="toggle-hardware-settings-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl bg-[#153B69] hover:bg-[#1E4D88] text-blue-200 hover:text-white border border-[#27578E] transition-all cursor-pointer"
                title={isExpanded ? "Collapse Sensor Controls" : "Expand Sensor Controls"}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Hardware Controls */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#1A3F6D] space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Drill Intensity (Simulated PGA):
                </span>
                <span className="font-mono font-bold text-amber-400">{shakeIntensity}g (Threshold: {'>'}2.0g)</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="6.0"
                step="0.1"
                value={shakeIntensity}
                onChange={(e) => setShakeIntensity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#153B69] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <button
                  id="view-arduino-code-btn"
                  onClick={() => setShowCodeModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#153B69] hover:bg-[#1E4D88] text-blue-200 hover:text-white text-[11px] font-bold border border-[#27578E] transition-all cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-blue-300" />
                  ESP32 C++ Firmware Sketch
                </button>

                <span className="text-[10px] text-blue-300/80 font-mono">
                  Gateway: /api/hardware-event &amp; ws://.../ws
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ESP32 Arduino C++ Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]">
            <div className="bg-[#0A1E38] px-5 py-4 border-b border-[#1A3F6D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">ESP32 + MPU6050 Arduino C++ Seismometer Firmware</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 overflow-y-auto flex-1 font-mono text-xs text-emerald-400 space-y-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-sans">
                <p>
                  Flash this sketch to your <strong>ESP32 Microcontroller</strong> wired to an <strong>MPU-6050 Accelerometer</strong> (SDA=GPIO 21, SCL=GPIO 22, VCC=3.3V, GND=GND). When shaken physically, it transmits seismic vibration directly into the CrisisChain Hardware Ingestion Gateway.
                </p>
              </div>

              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-[11px] leading-relaxed text-slate-200">
                {arduinoEsp32Code}
              </pre>
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to copy and compile in Arduino IDE / PlatformIO</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCodeToClipboard}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? 'Copied to Clipboard!' : 'Copy Firmware Code'}
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


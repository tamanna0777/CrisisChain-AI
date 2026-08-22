import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Smartphone, 
  Volume2, 
  Tv, 
  Share2,
  Copy,
  Clock,
  Sparkles,
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react';
import { CommanderActionPlan, GovernmentOfficer, PublicAdvisory } from '../../types';

interface PublicBroadcastCenterProps {
  plan: CommanderActionPlan;
  officer: GovernmentOfficer;
  onBroadcastAdvisory: (advisory: PublicAdvisory) => void;
  onNavigateToCitizenView?: () => void;
}

export const PublicBroadcastCenter: React.FC<PublicBroadcastCenterProps> = ({
  plan,
  officer,
  onBroadcastAdvisory,
  onNavigateToCitizenView,
}) => {
  const [broadcastSent, setBroadcastSent] = useState<boolean>(plan.broadcastDispatched || false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [selectedChannels, setSelectedChannels] = useState<{
    cellBroadcast: boolean;
    appPush: boolean;
    sirenBeacons: boolean;
    radioAlert: boolean;
  }>({
    cellBroadcast: true,
    appPush: true,
    sirenBeacons: true,
    radioAlert: true,
  });

  const languageTemplates = {
    en: {
      title: 'URGENT: Earthquake Magnitude 6.8 Detected - Sector B & C Evacuation Advisory',
      content: `OFFICIAL GOVERNMENT DISASTER ADVISORY\nNational Disaster Management Authority (NDMA) & District EOC\n\nAn Earthquake of Magnitude 6.8 has been detected in Pune Region.\n\n• EVACUATION NOTICE: All residents in Sector B and Sector C must evacuate immediately.\n• PROCEED TO: Pune Civil Defense Shelter & Sports Complex\n• DESIGNATED SAFE ROUTE: Route 7 (Outer Bypass) - Estimated travel time 14 minutes.\n• CRITICAL ROAD HAZARD: AVOID Highway Route 4 and NH-48 Flyover (Structural Damage / Debris).\n• EMERGENCY ACTION: 4 NDRF Battalions, 28 Ambulances, and Mobile Water Tankers are en route.\n\nStay calm, protect your head, avoid elevators, and follow Civil Defense Warden instructions.`,
    },
    hi: {
      title: 'अति आवश्यक: भूकंप तीव्रता 6.8 दर्ज - सेक्टर B और C के लिए तत्काल निकासी निर्देश',
      content: `आधिकारिक सरकारी आपदा चेतावनी\nराष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) एवं जिला EOC\n\nपुणे क्षेत्र में 6.8 तीव्रता का तीव्र भूकंप दर्ज किया गया है।\n\n• तत्काल निकासी: सेक्टर B और सेक्टर C के सभी नागरिक तुरंत सुरक्षित स्थानों की ओर प्रस्थान करें।\n• सुरक्षित आश्रय स्थल: पुणे नागरिक सुरक्षा केंद्र (Pune Civil Defense Center) पहुंचे।\n• सुरक्षित मार्ग: रूट 7 आउटर बाईपास (14 मिनट यात्रा समय)।\n• बंद मार्ग: हाईवे रूट 4 और NH-48 फ्लाईओवर पर बिल्कुल न जाएं (क्षतिग्रस्त स्थिति)।\n• राहत कार्य: 4 NDRF बटालियन और 28 एम्बुलेंस तैनात कर दी गई हैं।\n\nकृपया घबराएं नहीं, लिफ्ट का उपयोग न करें और नागरिक सुरक्षा अधिकारियों के निर्देशों का पालन करें।`,
    },
    mr: {
      title: 'अति तातडीचे: भूकंप तीव्रता ६.८ नोंद - सेक्टर B व C मधील नागरिकांसाठी स्थलांतर सूचना',
      content: `अधिकृत शासकीय आपत्ती व्यवस्थापन सूचना\nराष्ट्रीय आपत्ती व्यवस्थापन प्राधिकरण (NDMA) व जिल्हा EOC\n\nपुणे आणि लगतच्या परिसरात ६.८ तीव्रतेचा भूकंप नोंदवला गेला आहे.\n\n• सुरक्षित स्थलांतर: सेक्टर B व सेक्टर C मधील सर्व नागरिकांनी त्वरित सुरक्षित ठिकाणी प्रस्थान करावे.\n• सुरक्षित निवारा केंद्र: पुणे सिव्हिल डिफेन्स सेंटर व क्रीडा संकुल.\n• सुरक्षित मार्ग: रूट ७ आउटर बायपास (अंदाजे १४ मिनिटे).\n• धोकादायक मार्ग: हायवे रूट ४ आणि NH-48 उड्डाणपुलाचा वापर टाळा.\n• मदत पथके: ४ NDRF तुकड्या आणि २८ रुग्णवाहिका घटनास्थळी रवाना करण्यात आल्या आहेत.\n\nशांतता राखा, लिफ्ट वापरू नका आणि शासकीय सूचनांचे पालन करा.`,
    },
  };

  const [advisoryTitle, setAdvisoryTitle] = useState<string>(languageTemplates.en.title);
  const [advisoryContent, setAdvisoryContent] = useState<string>(languageTemplates.en.content);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLanguageChange = (lang: 'en' | 'hi' | 'mr') => {
    setSelectedLanguage(lang);
    setAdvisoryTitle(languageTemplates[lang].title);
    setAdvisoryContent(languageTemplates[lang].content);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(advisoryContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canPublish = officer.permissions.canPublishBroadcast;

  const handlePublish = () => {
    if (!canPublish) {
      alert(`Access Denied: Officer clearance (${officer.securityClearance}) is not authorized to publish public broadcasts.`);
      return;
    }

    const newAdvisory: PublicAdvisory = {
      id: 'adv-gov-' + Date.now().toString(36),
      title: advisoryTitle,
      category: 'Earthquake Alerts',
      severity: 'CRITICAL',
      source: `${officer.agency} • ${officer.name} (${officer.employeeId})`,
      time: 'Just now',
      description: advisoryContent,
      instructions: [
        'Evacuate Sector B and Sector C immediately.',
        'Proceed directly to Pune Civil Defense Center & Sports Complex.',
        'Use Route 7 Outer Bypass exclusively. Avoid Highway Route 4.',
        'Carry basic identification, medicines, and water bottle.',
        'Follow directions of on-ground NDRF and Civil Defense officers.',
      ],
      affectedZones: ['Sector B (Industrial)', 'Sector C (Dense Urban)', 'Pune Central Perimeter'],
    };

    onBroadcastAdvisory(newAdvisory);
    setBroadcastSent(true);
  };

  return (
    <div className="bg-white dark:bg-[#0C213D] border border-slate-200 dark:border-emerald-500/50 rounded-xl p-5 shadow-lg space-y-5 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#1A3D6B]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg border border-emerald-400/40">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-bold uppercase">
                PUBLIC BROADCAST CENTER
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">CAP Protocol v1.2</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Official Civil Protection Alert Dispatcher
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Authorized Dissemination to 23,410 Citizens & First Responders
            </p>
          </div>
        </div>

        {broadcastSent ? (
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-inner animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>BROADCAST ACTIVE & LIVE IN CITIZEN APP</span>
          </div>
        ) : (
          <div className="px-3.5 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-300 dark:border-blue-500/50 text-blue-900 dark:text-blue-300 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>READY FOR ONE-CLICK BROADCAST</span>
          </div>
        )}
      </div>

      {/* RBAC Warning if no permission */}
      {!canPublish && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-500 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Broadcast Clearance Required: </span>
            Your logged-in role ({officer.roleTitle}) does not possess public CAP broadcast authorization. Please sign in as Operations Commander or Public Information Officer to publish alerts.
          </div>
        </div>
      )}

      {/* Multi-Lingual Quick Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-[#081526] p-3 rounded-lg border border-slate-200 dark:border-[#18365D]">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Select Official Broadcast Language:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              selectedLanguage === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('hi')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              selectedLanguage === 'hi'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('mr')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              selectedLanguage === 'mr'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            मराठी (Marathi)
          </button>
        </div>
      </div>

      {/* Target Distribution Channels */}
      <div className="bg-slate-50 dark:bg-[#081526] p-3.5 rounded-lg border border-slate-200 dark:border-[#18365D]">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
          <span>Target Emergency Alert Channels</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">ALL CHANNELS SYNCHRONIZED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0E2442] border border-slate-200 dark:border-[#1E4575] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#14335A] shadow-sm">
            <input
              type="checkbox"
              checked={selectedChannels.cellBroadcast}
              onChange={(e) => setSelectedChannels((prev) => ({ ...prev, cellBroadcast: e.target.checked }))}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Cell SMS Alert
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">All local tower devices</div>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0E2442] border border-slate-200 dark:border-[#1E4575] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#14335A] shadow-sm">
            <input
              type="checkbox"
              checked={selectedChannels.appPush}
              onChange={(e) => setSelectedChannels((prev) => ({ ...prev, appPush: e.target.checked }))}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Citizen App Feed
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">CrisisChain AI users</div>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0E2442] border border-slate-200 dark:border-[#1E4575] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#14335A] shadow-sm">
            <input
              type="checkbox"
              checked={selectedChannels.sirenBeacons}
              onChange={(e) => setSelectedChannels((prev) => ({ ...prev, sirenBeacons: e.target.checked }))}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Audio Sirens
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Civil defense sirens</div>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0E2442] border border-slate-200 dark:border-[#1E4575] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#14335A] shadow-sm">
            <input
              type="checkbox"
              checked={selectedChannels.radioAlert}
              onChange={(e) => setSelectedChannels((prev) => ({ ...prev, radioAlert: e.target.checked }))}
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> FM Radio & TV
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">All India Radio / DD</div>
            </div>
          </label>
        </div>
      </div>

      {/* Advisory Message Editor / Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Advisory Title & Headline:
          </label>
          <button
            onClick={handleCopy}
            className="text-[11px] text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>
        </div>
        <input
          type="text"
          value={advisoryTitle}
          onChange={(e) => setAdvisoryTitle(e.target.value)}
          className="w-full bg-slate-50 dark:bg-[#081526] border border-slate-300 dark:border-[#1C3E6E] rounded-lg p-2.5 text-xs text-slate-900 dark:text-white font-bold mb-3 focus:outline-none focus:border-emerald-500"
        />

        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
          Official Broadcast Text (Auto-Synthesized from Multi-Agent Plan):
        </label>
        <textarea
          rows={8}
          value={advisoryContent}
          onChange={(e) => setAdvisoryContent(e.target.value)}
          className="w-full bg-slate-50 dark:bg-[#081526] border border-slate-300 dark:border-[#1C3E6E] rounded-lg p-3 text-xs text-slate-900 dark:text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Citizen View Simulation Box */}
      <div className="bg-slate-50 dark:bg-[#081729] border border-blue-200 dark:border-blue-500/30 rounded-lg p-3.5 text-xs">
        <div className="text-[10px] font-mono text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
          <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>WHAT CITIZENS SEE ON THEIR SCREEN:</span>
        </div>
        <div className="bg-white dark:bg-[#0B1E36] border border-blue-200 dark:border-blue-400/40 rounded-lg p-3 space-y-2 text-slate-800 dark:text-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> OFFICIAL GOVERNMENT ADVISORY
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">JUST NOW</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            🚨 Earthquake Detected in Pune Region (Magnitude 6.8)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-slate-50 dark:bg-[#071324] p-2 rounded border border-slate-200 dark:border-[#1B3B66]">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono font-semibold">SAFE SHELTER</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Pune Civil Defense Center</span>
            </div>
            <div className="bg-slate-50 dark:bg-[#071324] p-2 rounded border border-slate-200 dark:border-[#1B3B66]">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono font-semibold">SAFE CORRIDOR</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Sector B → Route 7 (14 mins)</span>
            </div>
          </div>
          <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
            ⚠️ Avoid Highway Route 4. Rescue teams are en route. Stay calm.
          </div>
        </div>
      </div>

      {/* Broadcast CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-[#1A3D6B]">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Dispatched under Section 38 of the Disaster Management Act, 2005 by <span className="text-slate-800 dark:text-slate-200 font-semibold">{officer.name}</span>.
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {broadcastSent && onNavigateToCitizenView && (
            <button
              onClick={onNavigateToCitizenView}
              className="px-4 py-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/80 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-600/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify in Citizen Portal</span>
            </button>
          )}

          <button
            onClick={handlePublish}
            disabled={!canPublish}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap border ${
              canPublish
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-emerald-950/60 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-400 border-slate-300 dark:border-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{broadcastSent ? 'Re-Broadcast Advisory' : 'Publish Advisory to Citizens'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};


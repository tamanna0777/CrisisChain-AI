<div align="center">

<h1>🌐 CrisisChain AI</h1>

<h3>AI-Powered Disaster Response & Family Safety Network</h3>

<p>
Real-time disaster monitoring, emergency coordination, family safety tracking, AI-powered decision support, and IoT-based seismic detection.
</p>

<p>
<img src="https://img.shields.io/badge/React-19-blue" />
<img src="https://img.shields.io/badge/TypeScript-5.8-blue" />
<img src="https://img.shields.io/badge/Vite-6-purple" />
<img src="https://img.shields.io/badge/Firebase-Cloud-orange" />
<img src="https://img.shields.io/badge/Google-Gemini-green" />
<img src="https://img.shields.io/badge/ESP32-IoT-red" />
<img src="https://img.shields.io/badge/License-MIT-success" />
</p>

</div>

<hr>

<h2> Problem Statement</h2>

<p>
During natural disasters and emergency situations, communication networks become unreliable, emergency information becomes fragmented, and families struggle to verify the safety of their loved ones.
</p>

<p>
CrisisChain AI provides a unified emergency response ecosystem that connects citizens, families, government agencies, and IoT disaster monitoring systems in real time.
</p>

<hr>

<h2>✨ Key Features</h2>

<h3> Citizen Safety Network</h3>

<ul>
<li>Family Safety Status Tracking</li>
<li>SOS Emergency Alerts</li>
<li>Emergency Contact Management</li>
<li>Disaster Notifications</li>
<li>Family Reunification Support</li>
</ul>

<h3> Emergency Command Center</h3>

<ul>
<li>Live Incident Monitoring</li>
<li>Emergency Broadcast System</li>
<li>Disaster Advisory Management</li>
<li>Resource Allocation Tracking</li>
<li>Shift Handover Dashboard</li>
</ul>

<h3> AI-Powered Intelligence</h3>

<ul>
<li>Google Gemini Integration</li>
<li>AI Crisis Analysis</li>
<li>Decision Support System</li>
<li>Emergency Response Recommendations</li>
<li>Advisory Generation</li>
</ul>

<h3>📡 IoT Integration</h3>

<ul>
<li>ESP32 Hardware Support</li>
<li>MPU6050 Seismic Detection</li>
<li>Real-Time Telemetry</li>
<li>WebSocket Broadcasting</li>
<li>Sensor Monitoring Dashboard</li>
</ul>

<hr>

<h2>🏗️ System Architecture</h2>

<pre>
ESP32 + MPU6050 Sensors
           │
           ▼
 Hardware Gateway APIs
           │
           ▼
 Node.js + Express Server
           │
 ┌─────────┼─────────┐
 ▼         ▼         ▼
REST      SSE      WebSocket
 APIs    Stream      Live
           │
           ▼
 React + TypeScript Frontend
           │
           ▼
 Citizens / Authorities
</pre>

<hr>

<h2>🛠️ Technology Stack</h2>

<table>
<tr>
<th>Category</th>
<th>Technology</th>
</tr>

<tr>
<td>Frontend</td>
<td>React, TypeScript, Vite, Tailwind CSS</td>
</tr>

<tr>
<td>Backend</td>
<td>Node.js, Express.js</td>
</tr>

<tr>
<td>Real-Time</td>
<td>WebSocket, SSE</td>
</tr>

<tr>
<td>AI</td>
<td>Google Gemini API</td>
</tr>

<tr>
<td>Database</td>
<td>Firebase Firestore</td>
</tr>

<tr>
<td>Hardware</td>
<td>ESP32, MPU6050</td>
</tr>

<tr>
<td>Maps</td>
<td>Leaflet.js</td>
</tr>

</table>

<hr>

<h2>📂 Project Structure</h2>

<pre>
CrisisChain-AI
│
├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── data
│   ├── hooks
│   └── services
│
├── public
├── dist
├── server.ts
├── package.json
└── README.md
</pre>

<hr>

<h2>⚙️ Local Setup Guide</h2>

<h3>1️⃣ Clone Repository</h3>

<pre>
git clone https://github.com/tamanna0777/CrisisChain-AI.git
</pre>

<h3>2️⃣ Open Project</h3>

<pre>
cd CrisisChain-AI
</pre>

<h3>3️⃣ Install Dependencies</h3>

<pre>
npm install
</pre>

<h3>4️⃣ Create Environment File</h3>

Create:

<pre>
.env
</pre>

Add:

<pre>
GEMINI_API_KEY=YOUR_API_KEY

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
</pre>

<h3>5️⃣ Start Development Server</h3>

<pre>
npm run dev
</pre>

Open:

<pre>
http://localhost:3000
</pre>

<hr>

<h2>🔨 Production Build</h2>

<pre>
npm run build
npm start
</pre>

<hr>

<h2>🌍 Deployment (Render)</h2>

<h3>Build Command</h3>

<pre>
npm install && npm run build
</pre>

<h3>Start Command</h3>

<pre>
npm start
</pre>

<hr>

<h2>📡 API Endpoints</h2>

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
</tr>

<tr>
<td>POST</td>
<td>/api/hardware-event</td>
<td>Hardware Sensor Event</td>
</tr>

<tr>
<td>POST</td>
<td>/api/hardware/telemetry</td>
<td>ESP32 Telemetry</td>
</tr>

<tr>
<td>POST</td>
<td>/api/hardware/heartbeat</td>
<td>Device Heartbeat</td>
</tr>

<tr>
<td>GET</td>
<td>/api/hardware/gateway-status</td>
<td>Gateway Status</td>
</tr>

<tr>
<td>GET</td>
<td>/api/health</td>
<td>Health Check</td>
</tr>

</table>

<hr>

<h2>📖 Documentation</h2>

<ul>
<li><a href="https://docs.google.com/document/d/1GPDWGyhbE24DtGxoCCK82zqefmT-SH5O/edit?usp=sharing&ouid=112917491559194404416&rtpof=true&sd=true">Project Documentation</a></li>
<li><a href="https://docs.google.com/presentation/d/1HbZ5gd4M--5Pg72C0X3l0AuCj0KdBnjr/edit?usp=sharing&ouid=112917491559194404416&rtpof=true&sd=true">Presentation Deck</a></li>
<li><a href="https://youtu.be/aq8r6CyKmmk">Demo Video</a></li>
</ul>

<hr>

<h2> Screenshots</h2>

<h3>Citizen Dashboard</h3>

<img src="images/citizen-dashboard.png" width="100%" />

<h3>Command Center</h3>

<img src="images/command-center.png" width="100%" />

<h3>Emergency Broadcast</h3>

<img src="images/broadcast-system.png" width="100%" />

<hr>

<h2>🏆 Hackathon Highlights</h2>

<ul>
<li>✅ AI-Powered Crisis Intelligence</li>
<li>✅ Real-Time Emergency Communication</li>
<li>✅ Government Command Center</li>
<li>✅ Family Safety Verification</li>
<li>✅ ESP32 + MPU6050 Integration</li>
<li>✅ Live WebSocket Broadcasting</li>
<li>✅ Firebase Cloud Infrastructure</li>
</ul>

<hr>

<h2>👩‍💻 Team</h2>

<p>
<b>Tamanna Shaikh & Saish Shinde </b><br>
B.Tech Computer Science & Engineering<br>

AI • IoT • Disaster Technology Enthusiast
</p>

<p>
<a href="https://github.com/tamanna0777">GitHub Profile</a>
</p>

<hr>

<div align="center">

<h3>⭐ If you found this project useful, consider starring the repository!</h3>

<p>
Made with ❤️ for Disaster Resilience & Public Safety
</p>

</div>

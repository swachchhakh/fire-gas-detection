# 🔥 Fire & Gas Detection Dashboard

This is a **React-based** real-time dashboard that visualizes fire and gas sensor data using **Firebase** and **Recharts**.

## 📊 Overview

This app retrieves sensor data from a Firebase Realtime Database and renders it into dynamic charts including:
- Line Chart (real-time trends)
- Pie Chart (proportions)
- Bar Chart (monthly analysis)
- A paginated, filterable alert log

---

## 🛠️ Key Technologies

- **React** + **TypeScript**
- **Firebase Realtime Database**
- **Recharts** (Charting library)
- **CSS** for UI styling

---

## 🧠 Code Structure & Explanation

### 1. **State Definitions**

```tsx
const [allAlerts, setAllAlerts] = useState<Alert[]>([]);
const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
const [chartData, setChartData] = useState<ChartData[]>([]);
const [fireCount, setFireCount] = useState(0);
const [gasCount, setGasCount] = useState(0);
const [dailyCount, setDailyCount] = useState<{ date: string; fire: number; gas: number }[]>([]);
Purpose:
These states manage different aspects of the app:

allAlerts: All alerts fetched from Firebase

filteredAlerts: Alerts after applying date/time filters

chartData: Data used in the real-time line chart

fireCount, gasCount: For pie chart visualization

dailyCount: Monthly aggregated data for bar chart

useEffect(() => {
  const alertsRef = query(ref(database, "alerts"), limitToLast(100));
  const unsubscribe = onValue(alertsRef, async (snapshot) => {
    const data = snapshot.val();
    ...
    setAllAlerts(alertList);
    applyFilter(alertList);
    updateStats(alertList);
  });

  return () => unsubscribe();
}, [sortOrder]);
Explanation:

Fetches the latest 100 entries from the alerts node.

Resolves alertIDs and then retrieves associated sensors/{alertID} values.

Cleans and transforms data into usable JavaScript objects.

Updates UI states accordingly.

const applyFilter = (alerts: Alert[]) => {
  const { date, time } = filter;

  const filtered = alerts.filter((alert) => {
    const alertDate = new Date(alert.timestamp);
    ...
    return matchesDate && matchesTime;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
  );

  setFilteredAlerts(sorted);
  updateChartData(sorted);
};
Purpose:
This function:

Applies filters based on selected date and time.

Sorts the results by "newest" or "oldest" first.

Updates filtered results and chart data accordingly.


<ul>
  {paginatedAlerts.map((alert, index) => {
    const date = new Date(alert.timestamp);
    ...
    return (
      <li key={index}>
        [{formattedDate}] Fire: {alert.fire} | Gas: {alert.gas}
      </li>
    );
  })}
</ul>
# 📧 Firebase Alert Email Notification Function

This Firebase Cloud Function automatically sends an **email alert** using Gmail when new fire or gas sensor data is created in your Firebase Realtime Database.

---

## 🔍 Overview

When a new entry is added to `/sensors/{sensorId}`, this function checks the sensor data and sends an email alert indicating whether fire or gas was detected.

---

## 🧰 Technologies Used

- **Firebase Cloud Functions**
- **Nodemailer** for sending emails
- **dotenv** for secure environment variables

---

## 🚀 How It Works

### 1. **Import Modules & Setup Environment**

```ts
import * as functions from "firebase-functions/v1";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: "bvshnzquwhxzdoxa", // Note: Use App Password, not regular password!
  },
});
export const sendEmailOnAlert = functions.database
  .ref("/sensors/{sensorId}")
  .onCreate(async (snapshot) => {
    const sensor = snapshot.val();
    ...
This Cloud Function triggers when a new sensor entry is added to /sensors/{sensorId} in the Realtime Database.
let detectionMessage = "💨 Gas detected";
if (sensor?.fire == 1) detectionMessage = "🔥 Fire detected";
else if (sensor?.gas == 1) detectionMessage = "💨 Gas detected";

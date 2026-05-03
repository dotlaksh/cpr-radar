# 📡 CPR Confluence Radar

A high-conviction structural analysis engine designed for identifying institutional-grade confluence zones using multi-timeframe **Central Pivot Range (CPR)**.

This is a specialized rule-based filtering tool that ignores market noise and lagging indicators to find stocks coiling within significant structural clusters.

---

## ⚡ The Confluence Core

This scanner identifies **A+ Setups** where price is interacting with a convergence of Monthly, Quarterly, and Yearly pivot levels.

### 🔍 Key Scanning Rules:
*   **Structural Cluster**: Identifies zones where multi-timeframe pivots converge within a **1% range**.
*   **Strict Proximity**: Filters results to show only stocks where the Current Market Price (CMP) is within **5%** of all three major pivots.
*   **Pure Structure**: Zero reliance on Moving Averages (EMAs). Analysis is driven entirely by price action and mathematical pivot confluence.
*   **Precision Calculation**: Monthly CPR is dynamically calculated from the previous month's HLC (e.g., May CPR uses April data).

---

## 🛠️ Advanced Analytics Dashboard

Every result is processed through a deep structural analysis pipeline:

### 1. Structure Classification
*   **Perfect Confluence**: Pivots converged within < 0.25%.
*   **Tight Cluster**: High-density zone within < 1.0%.
*   **Bullish/Bearish Stack**: Clear directional structural bias.

### 2. Relationship Matrix
Analyzes the physical interaction between timeframe pairs (Monthly/Quarterly, Quarterly/Yearly):
*   **Relation**: Above, Below, or Overlapping.
*   **Tightness**: Very Tight, Tight, Loose, or Far.

### 3. Price Positioning
Real-time tracking of price relative to the cluster:
*   **Inside**: Price is literally within the "sandwich" of pivots.
*   **Above/Below**: Potential breakout or breakdown from the structural floor/ceiling.

---

## 🚀 How to Use

1.  **Select a Universe**: Choose from Nifty 100, Midcap 150, Smallcap 250, or Microcap 250.
2.  **Live Scan**: The engine fetches fresh market data and evaluates structural integrity across all three timeframes.
3.  **Filter by Quality**: Use the **A+** or **HQ Cluster** filters to find the highest-probability zones.
4.  **Execute**: No setups found = No trade. Wait for structural alignment.

---

## 💻 Tech Stack

*   **Frontend**: React + Vite + Tailwind CSS
*   **UI Components**: Radix UI + Lucide Icons (Glassmorphic Design)
*   **Data Pipeline**: Supabase Edge Functions + Market Data API
*   **Performance**: Session-level caching for rapid multi-universe analysis.

---

## 📦 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Create a `.env` file with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_key
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

*Built for traders who prioritize structure over noise.*

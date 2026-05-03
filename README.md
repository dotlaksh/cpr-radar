Here’s a clean, professional **README.md** tailored to your app and workflow:

---

# 📊 CPR Positional Scanner

A minimal web-based scanner for identifying high-probability positional trades using **Central Pivot Range (CPR)** and higher timeframe trend alignment.

This tool focuses strictly on **Monthly, Quarterly, and Yearly CPR**, filtering only the strongest setups based on predefined rules.

---

## 🚀 Core Idea

This is not a trading dashboard.
This is a **rule-based filtering engine**.

The app scans a predefined universe of stocks and shows **only those that meet ALL trading conditions**.

If no stocks are shown → **no trade**.

---

## 🧭 Workflow

1. Select a stock universe:

   * NIFTY 100
   * NIFTY MIDCAP 150
   * NIFTY SMALLCAP 250

2. The app:

   * Loads symbols from JSON
   * Fetches real market data
   * Computes CPR and EMA
   * Applies strict validation rules

3. Output:

   * Only valid LONG or SHORT setups

---

## ⚙️ Strategy Logic

### 📌 Timeframes Used

* Monthly CPR
* Quarterly CPR
* Yearly CPR
* EMA (20 / 50 / 200)

No intraday or lower timeframe logic is used.

---

## 📐 CPR Calculation (CRITICAL)

CPR is calculated using **previous completed period data only**.

| Timeframe | Data Used            |
| --------- | -------------------- |
| Monthly   | Previous month HLC   |
| Quarterly | Previous quarter HLC |
| Yearly    | Previous year HLC    |

### ⚠️ Important Rules

* Do NOT use current/incomplete candles
* CPR values remain constant during the active period
* Incorrect CPR calculation invalidates the strategy

---

## 📈 Trade Conditions

### ✅ LONG Setup (All must be true)

* Price > Yearly TC
* Price > Quarterly TC
* EMA 20 > EMA 50 > EMA 200
* Monthly CPR width < 0.5%

---

### 🔻 SHORT Setup (All must be true)

* Price < Yearly BC
* Price < Quarterly BC
* EMA 20 < EMA 50 < EMA 200
* Monthly CPR width < 0.5%

---

## 📊 Output Behavior

* Only stocks meeting ALL conditions are shown
* No partial matches
* No ranking (yet)

---

## 📁 Data Sources

### Stock Universes

Provided via JSON files:

* `nifty100.json`
* `niftyMidcap150.json`
* `niftySmallcap250.json`

Each file contains a list of symbols.

---

### Market Data

Fetched from Yahoo Finance via backend API:

```
/api/market-data?symbol=XYZ
```

Includes:

* Daily OHLC data
* Latest price

---

## 🧮 Calculations

From daily data:

* Monthly candles → grouped by month
* Quarterly candles → grouped by 3 months
* Yearly candles → grouped by year

Then computed:

* CPR (Pivot, TC, BC)
* CPR Width (%)
* EMA 20 / 50 / 200

---

## 🖥️ UI Overview

### 1. Landing Page

* Select stock universe

### 2. Scanner Page

* Runs scan once
* Displays only valid setups
* Shows progress while scanning

---

## ⏳ Expected Behavior

* Low-frequency signals (positional trading)
* Some days → no trades
* Strict filtering → fewer but higher quality setups

---

## 🛑 Constraints

* No charts
* No alerts
* No trade journal
* No automation
* No authentication

---

## ⚠️ Known Limitations

* Dependent on Yahoo Finance data reliability
* API rate limits may slow large scans
* No caching (yet)

---

## 🔮 Future Improvements

* Parallel scanning (performance boost)
* Result ranking (setup quality score)
* Trade detail view
* Backtesting engine
* Caching layer

---

## 🎯 Philosophy

This system is built on one principle:

> **“No trade is a valid outcome.”**

The goal is not activity —
the goal is **precision and discipline**.

---

If you want, I can next:

* Convert this into a deployable project structure
* Add performance optimizations
* Or expand this into a full trading platform

Just tell me the direction.

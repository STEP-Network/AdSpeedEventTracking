# Event Tracking for GPT.js, HIJS, and Adnami Ads

## Overview

This script is designed to track and log events related to ad units rendered through **Google Publisher Tag (GPT.js)**, **High Impact JS (HIJS)**, and **Adnami**. It includes performance tracking using `performance.mark()` to monitor the rendering and behavior of ads, as well as providing detailed logs for debugging and analysis.

## Features

- Tracks events from **GPT.js**, **HIJS**, and **Adnami** ad platforms.
- Logs key events such as:
  - **GPT.js**: `Ad Slot Requested`, `Ad Impression Rendered`
  - **HIJS**: `AD_RENDERED`
  - **Adnami**: `ADSM_RMB_ADS_INIT`, `adnm-bridge-track`
- Uses `performance.mark()` for custom timing analysis.
- Logs event data to the browser console, allowing manual inspection of events.

## Script Flow

### Key Events Tracked

- **GPT.js Events**:
  - `Ad Slot Requested` (for slots such as `div-gpt-ad-topscroll`)
  - `Ad Impression Rendered` (for slots such as `div-gpt-ad-topscroll`)

- **HIJS Events**:
  - `AD_RENDERED` (tracks when an ad is rendered via High Impact JS)

- **Adnami Events**:
  - `ADSM_RMB_ADS_INIT` (tracks when an ad is initialized)
  - `adnm-bridge-track` (tracks events related to specific ad tracking like `wrapper_inview`)

### Performance Marking

The script uses the `performance.mark()` API to log timestamps for the following events:

- **GPT.js**:
  - Marks the time when an ad slot is requested or rendered for topscroll ad units.
  
- **HIJS**:
  - Marks when a `AD_RENDERED` event is triggered by High Impact JS.

- **Adnami**:
  - Marks when the `ADSM_RMB_ADS_INIT` event for `canvas` format occurs.
  - Marks when the `adnm-bridge-track` event for `wrapper_inview` occurs.

### Example Usage

- The script automatically tracks relevant events as ads are rendered on the page.
- Events are logged with their **source**, **event name**, and **performance timings** in the console.
  
You can manually view the logs by calling the `window.showEventLog()` function in the browser's console, which displays the event log as a table.

### Event Log Format

The logged data will include the following columns:

| Source  | Event                    | Event Info             | Elapsed Time (ms) | Time Since Last Event (ms) |
|---------|--------------------------|------------------------|-------------------|----------------------------|
| GPT.js  | Ad Slot Requested         | div-gpt-ad-topscroll   | 102               | 102                        |
| GPT.js  | Ad Impression Rendered    | div-gpt-ad-topscroll   | 305               | 203                        |
| Adnami  | ADSM_RMB_ADS_INIT         | canvas                 | 520               | 215                        |
| Adnami  | adnm-bridge-track         | wrapper_inview         | 789               | 269                        |
| HIJS    | AD_RENDERED               | Unknown                | 1045              | 256                        |

### Functions

- `window.showEventLog()`: Displays the event log table in the console.
  
### To Do's

- When updates from the HIJS team with format events are available, add format events to tracking.
- Set up custom tracking into **Assertive Yield (AY)**, so we can track Real User Metrics (RUM) data, not just DebugBear crawls.
- Create README docs and FAQ for AdOps, e.g., how to use the `window.showEventLog()` method.
- Expand to other **Adnami** and **HIJS** formats, and differentiate between **midscrolls** and **topscrolls**.

## Setup

1. Copy and paste the script into your web page or ad tracking environment.
2. Ensure the page includes `googletag` and **HIJS** scripts as expected for tracking.
3. Use `window.showEventLog()` in the browser console to view tracked events.
4. Monitor the console for performance marks and event data.
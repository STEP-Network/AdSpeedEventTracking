/* 
    Created by Jakob S. Peters @STEP Network
    Creation date: 05.12.2024 (dd/mm/yyyy)
    Last update: 05.12.2024 (dd/mm/yyyy)
    
    ## To do's ##
    - When update from HIJS team with format events is available, add format events to tracking
    - Setup custom tracking into AY, so we can do RUM data and not only DebugBear Crawls
    - Create readme docs and FAQ for AdOps, e.g. event window.showEventLog();
    - Expand to other Adnami and HIJS formats and being able to differenaite between midscrolls and topscrolls. 
*/

// Track events and their timings
let startTime = Date.now(); // Record when the script starts
let lastEventTime = startTime; // Track the last event time for relative differences
const eventLog = []; // Array to store all event details

// Flags to ensure marking only for the first instances of specific events
let hasMarkedAdnamiCanvas = false;
let hasMarkedAdnamiWrapper = false;

// Generalized function to log events with absolute and relative timings
const logEventWithTimeline = (eventName, eventInfo, source) => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime; // Absolute time since the script started
    const timeDiff = currentTime - lastEventTime; // Relative time since the last event
    lastEventTime = currentTime; // Update last event time

    // Add event details to log
    eventLog.push({
        Source: source,
        Event: eventName,
        "Event Info": eventInfo || "N/A",
        "Elapsed Time (ms)": elapsedTime,
        "Time Since Last Event (ms)": timeDiff,
    });

    // Add performance marks for specific events
    if (source === "GPT.js" && eventName === "Ad Slot Requested" && eventInfo.includes("interstitial")) {
        performance.mark("topscroll_gpt_ad_slot_requested");

    } else if (source === "GPT.js" && eventName === "Ad Impression Rendered" && eventInfo.includes("div-gpt-ad-topscroll")) {
        performance.mark("topscroll_gpt_ad_slot_rendered");
    } else if (source === "HIJS" && eventName === "AD_RENDERED") {
        performance.mark("hijs_ad_rendered");
    } else if (source === "Adnami" && eventName === "ADSM_RMB_ADS_INIT" && eventInfo === "canvas" && !hasMarkedAdnamiCanvas) {
        performance.mark("adnami_ads_init_canvas");
        hasMarkedAdnamiCanvas = true; // Ensure it's only marked once
    } else if (source === "Adnami" && eventName === "adnm-bridge-track" && eventInfo === "wrapper_inview" && !hasMarkedAdnamiWrapper) {
        performance.mark("adnami_wrapper_inview");
        hasMarkedAdnamiWrapper = true; // Ensure it's only marked once
    }
};

// Ensure googletag is defined
window.googletag = window.googletag || { cmd: [] };

// Add GPT.js event listeners
googletag.cmd.push(() => {
    googletag.pubads().addEventListener("slotRequested", (event) => {
        const slotId = event.slot.getSlotElementId();
        logEventWithTimeline("Ad Slot Requested", slotId, "GPT.js");
    });

    googletag.pubads().addEventListener("impressionViewable", (event) => {
        const slotId = event.slot.getSlotElementId();
        logEventWithTimeline("Ad Impression Viewable", slotId, "GPT.js");
    });

    googletag.pubads().addEventListener("slotRenderEnded", (event) => {
        const slotId = event.slot.getSlotElementId();
        logEventWithTimeline("Ad Impression Rendered", slotId, "GPT.js");
    });
});

// Tracking Adnami events
window.addEventListener('message', (event) => {
    let data;

    if (typeof event.data === 'string') {
        try {
            data = JSON.parse(event.data); // Attempt to parse JSON string data
        } catch (e) {
            // Ignore JSON parsing errors
            return;
        }
    } else if (typeof event.data === 'object') {
        data = event.data; // If event.data is already an object, use it directly
    }

    // Adnami Events
    if (data?.type === 'ADSM_RMB_ADS_INIT') {
        const formatType = data.payload?.formatType || "Unknown";
        logEventWithTimeline("ADSM_RMB_ADS_INIT", formatType, "Adnami");
    } else if (data?.type === 'adnm-bridge-track') {
        const eventType = data.event || "Unknown";
        logEventWithTimeline("adnm-bridge-track", eventType, "Adnami");
    }

    // HIJS Events
    if (data?.sender === 'high-impact-js' && data?.action === 'AD_RENDERED') {
        const adId = data.adId || "Unknown"; // Use `adId` if available for identification
        logEventWithTimeline("AD_RENDERED", adId, "HIJS");
    }
});

// Function to manually display the event log table
window.showEventLog = () => {
    console.table(eventLog);
    console.log('Event log table displayed manually.');
};



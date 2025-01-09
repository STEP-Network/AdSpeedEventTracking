// Function to handle TCF data and mark performance
function handleTCFData(tcData, success) {
  if (success) {
    const tcfString = tcData.tcString;
    performance.mark('TCFStringReadyv2');
    console.log('TCF string is present, setting TCFStringReady mark.');

    // Check for pbjs availability and set up auctionInit event listener
    waitForPbjs(function() {
      retryPbjsOnEvent('auctionInit', 'auctionInit_start');
    });

  } else {
    console.error('Error fetching TCF string');
  }
}

// Function to wait for pbjs to be available
function waitForPbjs(callback) {
  var attempts = 0;
  var maxAttempts = 100; //tries up for up to 5 seconds, 50*100=5.000ms 
  var interval = setInterval(function() {
    if (window.pbjs) {
      console.log('pbjs is now available');
      clearInterval(interval);
      callback();
    } else if (attempts >= maxAttempts) {
      console.error('pbjs did not load in time');
      clearInterval(interval);
    }
    attempts++;
  }, 50); // Check every 50ms a
}

// Function to retry pbjs.onEvent in case of error
function retryPbjsOnEvent(eventName, markName) {
  var maxRetries = 100; //tries up for up to 5 seconds, 50*100=5.000ms 
  var retries = 0;

  function attemptOnEvent() {
    try {
      pbjs.onEvent(eventName, function() {
        performance.mark(markName);
        console.log(eventName + ' has started, setting ' + markName + ' mark.');
      });
    } catch (error) {
      console.error('Error setting up ' + eventName + ' event:', error.message);
      if (retries < maxRetries) {
        retries++;
        setTimeout(attemptOnEvent, 50); // Retry after 50ms
      } else {
        console.error('Max retries reached for ' + eventName);
      }
    }
  }

  attemptOnEvent();
}

// Function to wait for the TCF API and fetch the TCF data
function waitForTCF() {
  var attempts = 0;
  var maxAttempts = 50;
  var interval = setInterval(function() {
    if (typeof window.__tcfapi === 'function') {
      console.log('TCF API is available');
      clearInterval(interval);
      window.__tcfapi('getTCData', 2, handleTCFData);
    } else if (attempts >= maxAttempts) {
      console.error('TCF API did not load in time');
      clearInterval(interval);
    }
    attempts++;
  }, 20); // Check every 20ms
}

// Initialize marking and event listening process after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
  waitForTCF();
});
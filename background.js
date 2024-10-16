// // Log to ensure the service worker is running
// console.log("Service worker started");

// // Function to send data to the server
// function sendDataToServer(data) {
//     fetch('http://localhost:3000/process-data', {  // Assuming your server is running on localhost:3000
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ data: data })  // The data could be text or base64 image
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok: ' + response.statusText);
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Response from server:', data);
//         // You can display the response or handle it further
//     })
//     .catch(error => {
//         console.error('Error:', error);  // Log detailed error info
//     });
// }

// // Listen for when the extension icon is clicked
// chrome.action.onClicked.addListener((tab) => {
//     console.log("Extension icon clicked");
    
//     // // Capture the visible tab as a screenshot
//     // chrome.tabs.captureVisibleTab(null, { format: 'png' }, (imageData) => {
//     //     if (chrome.runtime.lastError) {
//     //         console.error('Error capturing tab:', chrome.runtime.lastError.message);
//     //     } else {
//     //         console.log("Captured screenshot:", imageData);  // Lo
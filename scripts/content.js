console.log("Content script is running");

const observer = new MutationObserver(() => {
    var chatinput = "";

    const questionElement = document.querySelector(".prompt p");
    if (questionElement) {
        console.log("Question element found:", questionElement);
        var question =  "Question: " + questionElement.innerText;
        chatinput = question;
        chatinput += "\n";
    } else {
        console.log("Question element not found");
    }

    const options = document.querySelectorAll(".choiceText p");
    if (options && options.length > 0) {
        console.log("Options found:", options);
        let x = 1;
        options.forEach((option) => {
            chatinput += "Option " + x + " : ";
            chatinput += option.innerText + '\n';
            x++;
        });
    } else {
        console.log("Options not found");
    }

    console.log("Constructed input:", chatinput);

   // Disconnect observer once elements are found and processed
   if (questionElement && options.length > 0) {
    observer.disconnect();
    
    // Now that chatinput is constructed, send it to the server
    if(chatinput) {
        let dataToSend = { data: chatinput };
        sendDataToServer(dataToSend);
    } else {
        console.log("chatinput was incorrect");
    }
}
});

// Observe changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });

function sendDataToServer(data) {
fetch('http://localhost:3000/process-data', {  // Assuming your server is running on localhost:3000
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)  // Send the data as JSON
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    console.log('Response from server:', data);
    // You can display the response or handle it further
})
.catch(error => {
    console.error('Error:', error);  // Log detailed error info
});
}
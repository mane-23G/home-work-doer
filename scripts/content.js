console.log("Content script is running");
let lastquestiononly = ""; 

const observer = new MutationObserver(() => {
    var chatinput = "";

    const questionElement = document.querySelector(".prompt p");
    if (questionElement) {
        // console.log("Question element found:", questionElement);
        var question =  "Question: " + questionElement.innerText;
        var questiononly = question;
        chatinput = question;
        chatinput += "\n";
    } else {
        console.log("Question element not found");
    }

    const options = document.querySelectorAll(".choiceText p");
    const words = document.querySelectorAll(".match-prompt-label .content");
    if(words) {
        var defs = document.querySelectorAll(".draggableItem .content")
    }
    const tof = document.querySelector(".true-false-fieldset");
    const fill = document.querySelector(".input-container");
    if (options && options.length > 0) {
        // console.log("Options found:", options);
        let x = 1;
        options.forEach((option) => {
            chatinput += "Option " + x + " : ";
            chatinput += option.innerText + '\n';
            x++;
        });
    } 
    else if(words && words.length > 0) {
        // console.log("Words found:", words);
        let x = 1;
        chatinput += "Words: \n";
        words.forEach((word) => {
            chatinput += "Word " + x + " : ";
            chatinput += word.innerText + '\n';
            x++;
        });
        chatinput += "Defentions: \n";
        x = 1;
        defs.forEach((def) => {
            chatinput += "Defention " + x + " : ";
            chatinput += def.innerText + '\n';
            x++;
        });
    }
    else if(tof){
        chatinput += "True or False \n";
    }
    if(fill) {
        chatinput += "Fill in the blank";
    }
    else {
        console.log("Error no options found!!");
    }

    console.log("Constructed input:", chatinput);

   // Disconnect observer once elements are found and processed
   if (questionElement && (options.length > 0 || words.length > 0 || tof) || fill ) {
        observer.disconnect();
        if(lastquestiononly != questiononly) { // Only send if different from the last chatinput
            lastquestiononly = questiononly; // Update lastChatInput to the current one
            let dataToSend = { data: chatinput };
            sendDataToServer(dataToSend);
        } else {
            console.log("chatinput was identical to the last one, not sending again.");
        }

        setTimeout(() => {
            console.log("Waited for 1 seconds, reconnecting observer...");
            observer.observe(document.body, { childList: true, subtree: true });
        }, 1000);
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
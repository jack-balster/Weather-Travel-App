// Function to clear the chat card by removing all messages
function clearChatCard() {
  const messagesContainer = document.querySelector('.messages');
  messagesContainer.innerHTML = '';
}

// Function to clear the weather search textbox
function clearWeatherTextBox() {
  document.querySelector('.search-bar').value = '';
}

// Function to clear the question input textbox
function clearQuestionTextBox() {
  document.querySelector('.question-input').value = '';
}

// Add event listener for the search button click
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
  clearWeatherTextBox(); // Clear the weather search textbox
});

// Add event listener for the Enter key press in the search bar
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
    clearWeatherTextBox(); // Clear the weather search textbox
  }
});

// Add event listener for the question input button click
document.querySelector('.send-question').addEventListener('click', function () {
  const question = document.querySelector('.question-input').value;
  sendQuestionToChatGPT(question);
  clearQuestionTextBox(); // Clear the question input textbox
});

// Add event listener for the Enter key press in the question input textbox
document.querySelector('.question-input').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission or page refresh
    const question = this.value; // Use "this.value" to get the input value
    sendQuestionToChatGPT(question);
    clearQuestionTextBox(); // Clear the question input textbox
  }
});

var myOpenAIKey = config.openAIKey;

// Function to send a message to ChatGPT and receive a response
function sendMessageToChatGPT(location) {
  // Get the container for messages and the loading text element
  const messagesContainer = document.querySelector('.messages');
  const loadingText = document.querySelector('.loading-text');

  // Show loading text
  loadingText.style.display = 'block';

  // Remove previous user message if it exists
  const previousUserMessage = messagesContainer.querySelector('.user');
  if (previousUserMessage) {
    previousUserMessage.remove();
  }

  // Set the prompt message for the user
  const prompt = `Using up to 120 words, List 5 fun things to do in ${location}? Also make sure that there are two newlines after each fun thing to do`;

  // Create a new user message element and add it to the messages container
  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  messagesContainer.appendChild(userMessage);

  // Send the prompt to ChatGPT using an API call
  const apiKey = myOpenAIKey;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  // Make a POST request to the API
  return axios.post(apiUrl, {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are incredibly knowledgeable and very concise.' }, { role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.3,
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      // Create a new bot message element and add the response from ChatGPT to it
      const botMessage = document.createElement('div');
      botMessage.className = 'message bot';
      const botResponse = response.data.choices[0].message.content;
      botMessage.innerHTML = botResponse.replace(/\n/g, '<br>');
      messagesContainer.appendChild(botMessage);
      // Hide loading text
      loadingText.style.display = 'none';
    })
    .catch((error) => {
      // Handle any errors that occur during the API call
      console.error('Error:', error);
      // Hide loading text
      loadingText.style.display = 'none';
    });
}

// Function to send a question to ChatGPT
function sendQuestionToChatGPT(question) {
  const messagesContainer = document.querySelector('.messages');

  // Remove previous user message if it exists
  const previousUserMessage = messagesContainer.querySelector('.user');
  if (previousUserMessage) {
    previousUserMessage.remove();
  }

  // Create a new user message element and add it to the messages container
  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  messagesContainer.appendChild(userMessage);

  // Send the question to ChatGPT and handle the conversation
  handleChatConversation(question);
}

// Function to handle the chat conversation with ChatGPT
function handleChatConversation(prompt) {
  const messagesContainer = document.querySelector('.messages');
  const loadingText = document.querySelector('.loading-text');
  const apiKey = myOpenAIKey;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  // Show loading text
  loadingText.style.display = 'block';

  // Send the prompt to ChatGPT using an API call
  axios
    .post(apiUrl, {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an incredibly knowledgeable, all knowing person that gives clear / concise answers.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.2,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      // Create a new bot message element and add the response from ChatGPT to it
      const botMessage = document.createElement('div');
      botMessage.className = 'message bot';
      const botResponse = response.data.choices[0].message.content;
      botMessage.innerHTML = '<br>' + botResponse.replace(/\n/g, '<br>');
      messagesContainer.appendChild(botMessage);
      // Hide loading text
      loadingText.style.display = 'none';

      // If the conversation is not complete, continue with the next user prompt
      if (response.data.choices[0].role !== 'assistant' || response.data.choices[0].message.content === '') {
        return;
      }

      // Extract user prompt from bot response
      const userPrompt = response.data.choices[0].message.content;

      // Continue the conversation recursively
      handleChatConversation(userPrompt);
    })
    .catch((error) => {
      // Handle any errors that occur during the API call
      console.error('Error:', error);
      // Hide loading text
      loadingText.style.display = 'none';
    });
}

// Update the selector to use the new id
const chatSearchBar = document.getElementById('chat-search-bar');
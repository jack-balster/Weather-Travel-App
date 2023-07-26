var myOpenWeatherKey = config.openWeatherMapKey;
var myUnsplashKey = config.unsplashKey;

// Create weather object
let weather = {
  apiKey: myOpenWeatherKey,

  // Function to fetch weather data for a given city
  fetchWeather: function (city) {
    // Use fetch API to make a request to the OpenWeatherMap API
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },

  // Function to display the weather data
  displayWeather: function (data) {
    // Extract relevant data from the response object
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    // Update the HTML elements with the weather data
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°F";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");

    // Function to fetch an image from Unsplash based on name
    function fetchUnsplashImage() {
      fetch(
        "https://api.unsplash.com/photos/random?query=" + name + " city&fit=fill",
        {
          headers: {
            Authorization: myUnsplashKey
          }
        }
      )
        .then(response => {
          if (!response.ok) {
            alert("No photo found.");
            throw new Error("No photo found.");
          }
          return response.json();
        })
        .then(data => {
          document.body.style.backgroundImage =
            "url('" + data.urls.full + "')";
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }

    // Generate a random number between 1 and 5 (assuming 5 images per city)
    const randomNumber = Math.floor(Math.random() * 5) + 1;

    // Construct the image file name based on the 'name' variable and the random number
    const imageName = name.toLowerCase() + randomNumber + ".jpg";

    // Create an image element
    const localImage = new Image();

    // Set up a handler for the 'load' event
    localImage.onload = function() {
      document.body.style.backgroundImage = "url('" + localImage.src + "')";
    };

    // Set up a handler for the 'error' event
    localImage.onerror = function() {
      // If the local image fails to load, fetch from Unsplash
      fetchUnsplashImage();
    };

    // Set source of the image element to the local image
    localImage.src = "app-photos/" + imageName;

    // Send location to chatgpt
    sendMessageToChatGPT(name);
  },

  // Function to initiate the weather search
  search: function () {
    // Fetch weather data for the city entered in the search bar
    this.fetchWeather(document.querySelector(".search-bar").value);
    clearChatCard(); // Clear the chat card
    clearQuestionTextBox(); // Clear the question textbox
  },
};

// Call fetchWeather function to initiate the weather retrieval
weather.fetchWeather("Seattle");

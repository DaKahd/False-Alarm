document.addEventListener("DOMContentLoaded", function () {
  const divs = document.querySelectorAll(".grid-item");
  const occupancyStatus = Array.from(divs).map(() => false);
  let centerButtonData = {
    status: "cooldown",
    clicked: "cooldown",
    timeout: randomStatus(),
  }; //initialize the center button data
  let time = 0; //initialize the clock time
  const center_button = document.getElementById("center"); //stores the center button
  center_button.addEventListener("click", () => {});
  function randomStatus() {
    if (Math.random() > 0.5) {
      return "click-now";
    }
    if (Math.random() > 0.1) {
      return "cooldown";
    }
    return "false-alarm-warning";
  } //helper function to randomize status
  var gameover = false;
  function updateCenter() {
    if (centerButtonData.status == "click-now") {
      center_button.style.backgroundColor = "red";
      centerButtonData.clicked = "cooldown";
      centerButtonData.timeout = "game-over";
      center_button.innerHTML = "Click me now!";
      return;
    }
    if (centerButtonData.status == "cooldown") {
      center_button.style.backgroundColor = "green";
      centerButtonData.clicked = "cooldown";
      centerButtonData.timeout = randomStatus();
      center_button.innerHTML = "";
      return;
    }
    if (centerButtonData.status == "false-alarm-warning") {
      center_button.style.backgroundColor = "green";
      centerButtonData.clicked = "false-alarm-warning";
      centerButtonData.timeout = "false-alarm";
      center_button.innerHTML = "False alarm upcoming!";
      return;
    }
    if (centerButtonData.status == "false-alarm") {
      center_button.style.backgroundColor = "red";
      center_button.innerHTML = "Click me now!";
      centerButtonData.clicked = "game-over";
      centerButtonData.timeout = "cooldown";
      return;
    }
    if (centerButtonData.status == "game-over") {
      center_button.style.backgroundColor = "yellow";
      center_button.innerHTML =
        "Game Over! You survived for " +
        time / 10 +
        " seconds! Click or refresh to play again";
      centerButtonData.clicked = "cooldown";
      centerButtonData.timeout = "game-over";
      gameover = true;
      return;
    }
  } //adjusts the center button's appearance based on its status and whether it was clicked or timed out
  async function clock() {
    while (true) {
      if (gameover) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
      time += 1;
      if (centerButtonData.status !== "game-over" && Math.random() < 0.1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        centerButtonData.status = centerButtonData.timeout;
        updateCenter();
      }
    }
  } //keeps track of time and causes timeout changes to the center button
  updateCenter(); //initialize the center button
  clock(); //start the clock
  distract(); //setup the distractions
  center_button.addEventListener("click", () => {
    centerButtonData.status = centerButtonData.clicked;
    updateCenter();
    if (gameover) {
      gameover = false;
      time = 0;
      updateCenter();
      clock();
    }
  }); //when the center button is clicked, change its status and update its appearance
  async function distract() {
    let distractions = [];
    const maxAttempts = 20; // Maximum attempts to find a non-overlapping position
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjusts each 10th of a second
      if (Math.random() > 0.95) {
        // Add something 1% of the time
        if (Math.random() < (1 / maxAttempts) * distractions.length) {
          //
          const distraction = distractions.shift();
          distraction.parentNode.removeChild(distraction);
        } else {
          let distractionContainer = await randomDistraction();
          const leftPosition = Math.random() * (100 - 25); // Generate random left position
          const topPosition = Math.random() * (100 - 25); // Generate random top position
          distractionContainer.style.position = "absolute";
          distractionContainer.style.left = leftPosition + "%";
          distractionContainer.style.top = topPosition + "%";

          distractions.push(distractionContainer);
          document.body.appendChild(distractionContainer);
        }
      }
    }
  }

  async function randomDistraction() {
    const distractionContainer = document.createElement("div");

    const random = Math.random();
    var distraction;
    /*if (random > 0.8) distraction = await getRandomQuote();
    else if (random > 0.4) */distraction = await getRandomGif();
    //else distraction = await getMeme();

    distractionContainer.appendChild(distraction);
    distractionContainer.classList.add("distraction-container");

    return distractionContainer;
  }
  async function getRandomQuote() {
    //console.log("got quote")
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${data.content}" - ${data.author}`;
    quoteElement.style.fontFamily = await randomFont();
    const randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256,
    )}, ${Math.floor(Math.random() * 256)})`;
    quoteElement.style.color = randomColor;
    console.log("got quote");
    //console.log(quoteElement)
    return quoteElement;
  }
  async function randomFont() {
    const fontFamilies = [
      "Arial",
      "Helvetica",
      "Times New Roman",
      "Courier New",
      "Verdana",
      "Georgia",
      "Palatino",
      "Garamond",
      "Bookman",
      "Comic Sans MS",
      "Trebuchet MS",
      "Arial Black",
      "Impact",
    ];

    // Randomly select a font family
    return fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
  }
  async function getMeme() {
    console.log("got meme");
    const response = await fetch("https://meme-api.com/gimme/cleanmemes");
    const data = await response.json();
    const memeElement = document.createElement("img");
    memeElement.src = data.url;
    memeElement.style.maxHeight = "100%";
    memeElement.style.maxWidth = "100%";
    return memeElement;
  }

  async function getRandomGif() {
    console.log("getting gif");
    const apiKey = "vZVlUPBziF0UR81EDIZ24ohXVSm6IIpy";
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const imageUrl = data.data.images.original.url; // Accessing the correct property for the GIF URL
        const img = document.createElement("img");
        img.src = imageUrl;
        console.log(imageUrl);
        return img;
      } else {
        console.error("Failed to fetch random GIF:", data.meta.msg);
        return null;
      }
    } catch (error) {
      console.error("Error fetching random GIF:", error);
      return null;
    }
  }


});

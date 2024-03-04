document.addEventListener("DOMContentLoaded", function () {
  let centerButtonData = {
    status: "cooldown",
    clicked: "cooldown",
    timeout: randomStatus(),
  }; //initialize the center button data
  let time = 0; //initialize the clock time
  const center_button = document.getElementById("center"); //stores the center button
  center_button.addEventListener("click", () => {});
  function randomStatus() {
    if(Math.random()>0.6) return "cooldown";
    if (Math.random() > 0.4) return "click-now"
    return "false-alarm-warning";
  } //helper function to randomize status
  var gameover = false;
  function updateCenter() {
    var centerText= document.getElementById("center-text");
    if (centerButtonData.status == "click-now") {
      center_button.style.backgroundColor = "red";
      centerButtonData.clicked = "cooldown";
      centerButtonData.timeout = "game-over";
      centerText.textContent = "Click me now!";
    }
    else if (centerButtonData.status == "cooldown") {
      center_button.style.backgroundColor = "green";
      centerButtonData.clicked = "cooldown";
      centerButtonData.timeout = randomStatus();
      centerText.textContent = "";
    }
    else if (centerButtonData.status == "false-alarm-warning") {
      center_button.style.backgroundColor = "green";
      centerButtonData.clicked = "false-alarm-warning";
      centerButtonData.timeout = "false-alarm";
      centerText.textContent = "False alarm upcoming!";
    }
    else if (centerButtonData.status == "false-alarm") {
      center_button.style.backgroundColor = "red";
      centerText.textContent = "Click me now!";
      centerButtonData.clicked = "game-over";
      centerButtonData.timeout = "cooldown";
    }
    else if (centerButtonData.status == "game-over") {
      center_button.style.backgroundColor = "yellow";
      centerText.textContent = "Game Over! Click or refresh to play again";
      centerButtonData.clicked = "cooldown";
      centerButtonData.timeout = "game-over";
    }

  } //adjusts the center button's appearance based on its status and whether it was clicked or timed out
  async function clock() {
    let timer = document.getElementById("timer");
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if(gameover){
        time = 0;
        continue;
      }
      time += 1;
      timer.textContent = (time/10)+" seconds";

    }
  }
  async function buttonTimeoutCounter(){
    while(!gameover){
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("tick")
      if (centerButtonData.status !== "game-over" && Math.random() < 0.7) {
        if(centerButtonData.timeout === "game-over") gameover = true;
        centerButtonData.status = centerButtonData.timeout;
        updateCenter();
      }
    }
  }
   //keeps track of time and causes timeout changes to the center button
  function init(){
    gameover = false;
    time = 0;
    updateCenter(); //initialize the center button
    distract(); //setup the distractions
    buttonTimeoutCounter();
  }
  clock(); //start the clock

  init();
  center_button.addEventListener("click", () => {
    if(centerButtonData.clicked === "game-over") gameover = true;
    else if (gameover) {
      init();
      console.log("this line ran")
    }
    centerButtonData.status = centerButtonData.clicked;
    updateCenter();
  }); //when the center button is clicked, change its status and update its appearance
  async function distract() {
    let distractions = [];
    const maxDistractions = 20; // Maximum possible distractions. Will usually reach about half.
    while (!gameover) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjusts each 10th of a second
      if (Math.random() > 0.8) {
        // Add something 10% of the time; eg every second
        if (Math.random() < (1 / maxDistractions) * distractions.length) {
          //
          const distraction = distractions.shift();
          distraction.parentNode.removeChild(distraction);
          continue;
        } else {
          let distraction = await randomDistraction();
          const leftPosition = Math.random() * (100 - 25); // Generate random left position
          const topPosition = Math.random() * (100 - 25); // Generate random top position
          distraction.style.position = "absolute";
          distraction.style.left = leftPosition + "%";
          distraction.style.top = topPosition + "%";
          distractions.push(distraction);
          distraction.addEventListener("click", (event)=>{
              const index = distractions.indexOf(event.target);
              console.log("got here!")
              if (index!==-1){
                const killed = distractions.splice(index, 1)[0];
                killed.parentNode.removeChild(killed);
              }
          });
          document.body.appendChild(distraction);
        }
      }
    }
  }

  async function randomDistraction() {
    const distractionContainer = document.createElement("div");

    //const random = Math.random();
    var distraction;
    /*if (random > 0.8) distraction = await getRandomQuote();
    else if (random > 0.4) */distraction = await getRandomGif();
    //else distraction = await getMeme();


    return distraction;
  }
  async function getRandomQuote() { //currently unused
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
  async function randomFont() {//currently unused
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
  async function getMeme() { //currently unused
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

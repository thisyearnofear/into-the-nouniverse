class MusicPlayer {
  constructor() {
    this.isMinimized = false;
    this.playerElement = document.createElement("div");
    this.buttonElement = document.createElement("button");
    this.trackUrl =
      "https://app.spinamp.xyz/embed/player/afterlife-with-la-rochelle-and-papa-1681837223000";
    this.init();
  }

  init() {
    // Set up player element
    this.playerElement.id = "music-player";
    this.loadTrack();

    // Set up toggle button
    this.buttonElement.id = "toggle-music-player";
    this.buttonElement.innerHTML = "✖️";
    this.buttonElement.addEventListener("click", () => this.togglePlayer());

    // Add scroll listener for auto-hide
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        this.playerElement.style.opacity = "0.7";
      } else {
        this.playerElement.style.opacity = "1";
      }
    });

    // Append elements to the body
    document.body.appendChild(this.playerElement);
    document.body.appendChild(this.buttonElement);
  }

  loadTrack() {
    this.playerElement.innerHTML = `
        <iframe
          src="${this.trackUrl}"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allow="autoplay; fullscreen; web-share"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-presentation"
        ></iframe>
    `;
  }

  togglePlayer() {
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.playerElement.classList.add("minimized");
      this.buttonElement.classList.add("minimized");
      this.buttonElement.innerHTML = "🎵";
    } else {
      this.playerElement.classList.remove("minimized");
      this.buttonElement.classList.remove("minimized");
      this.buttonElement.innerHTML = "✖️";
    }
  }
}

export default MusicPlayer;

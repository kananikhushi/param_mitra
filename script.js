let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (e) => {
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (!this.rotating) {
        this.moveX = clientX;
        this.moveY = clientY;

        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;
      }

      const dirX = clientX - this.startX;
      const dirY = clientY - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevX = this.moveX;
        this.prevY = this.moveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const startHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.startX = e.touches ? e.touches[0].clientX : e.clientX;
      this.startY = e.touches ? e.touches[0].clientY : e.clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;
    };

    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Mobile and Desktop Events
    paper.addEventListener('touchmove', moveHandler);
    paper.addEventListener('mousemove', moveHandler);

    paper.addEventListener('touchstart', startHandler);
    paper.addEventListener('mousedown', startHandler);

    paper.addEventListener('touchend', endHandler);
    paper.addEventListener('mouseup', endHandler);
    paper.addEventListener('mouseleave', endHandler); // for desktop when mouse leaves the element

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

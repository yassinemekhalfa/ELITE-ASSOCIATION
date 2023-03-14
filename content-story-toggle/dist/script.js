// Get all story elements on current page
let contentStoryToggleElement = document.querySelectorAll(
  ".content-story-toggle--js"
);

// For each element =>
contentStoryToggleElement.forEach((wrapper) => {
  // Variables
  // --------------------------------------------------------------------------------
  let imgSequences = wrapper.querySelectorAll(".cs--graphics-sequence");
  let contentProgressBar = wrapper.querySelectorAll(
    ".cs--content-progress-indicator--bar"
  );
  let contentDesc = wrapper.querySelectorAll(".cs--content-desc");
  let contentArea = wrapper.querySelectorAll(".cs--content-area");
  let contentArray = Array.from(contentArea);
  var intervalId;

  // Events
  // --------------------------------------------------------------------------------

  // Give first element active class
  contentArray[0].classList.add("is--active");
  toggleSequences();

  // Autoplay
  autoplaySequence();

  // Activate manual navigation on click
  contentArea.forEach((item) => {
    item.addEventListener("click", (e) => {
      // Break autoplay function
      stopInterval();
      // Reset all opened accordion descriptions
      if (!e.currentTarget.classList.contains("is--active")) {
        gsap.to(contentDesc, { height: "0", duration: 0.25 });
        headerClicked(e);
      }
    });
  });

  // Functions
  // --------------------------------------------------------------------------------

  // Autoplay
  function autoplaySequence() {
    let slide = 1;

    // Get duration by inline style
    let duration = wrapper.style.getPropertyValue("--slideDuration");
    // Turn duration into js usable value
    const timeout = duration.replace("s", "000");

    intervalId = setInterval(() => {
      activeSlide(slide);
    }, timeout);

    // Slide behaviors
    function activeSlide(i) {
      let activeWrapper = contentArray[i];
      let expandableItem = activeWrapper.querySelector(".cs--content-desc");

      // Reset all opened accordion descriptions
      gsap.to(contentDesc, { height: "0", duration: 0.25 });
      // Expand accordion description
      gsap.to(expandableItem, { height: "auto", duration: 0.25 });
      // Toggle active class on active element
      activeWrapper.classList.add("is--active");
      // Remove active class from all elements except current active
      contentArea.forEach((header) => {
        if (header !== activeWrapper) {
          header.classList.remove("is--active");
        }
      });
      // Toggle fitting graphic based on active class of the content area
      toggleSequences();

      // Increase value of 'slide'
      if (slide >= contentArray.length - 1) {
        slide = 0;
      } else {
        slide++;
      }
    }
  }

  function stopInterval() {
    // Clear interval
    clearInterval(intervalId);
    // Disable all progress bar animations
    contentProgressBar.forEach((p) => {
      if (!p.classList.contains("paused")) {
        p.classList.add("paused");
      }
    });
  }

  // Toggle sequences
  function headerClicked(element) {
    let expandableItem = element.currentTarget.querySelector(
      ".cs--content-desc"
    );

    // Expand accordion description
    gsap.to(expandableItem, { height: "auto", duration: 0.25 });
    // Toggle active class on clicked element
    element.currentTarget.classList.add("is--active");
    // Remove active class from all elements except current clicked
    contentArea.forEach((header) => {
      if (header !== element.currentTarget) {
        header.classList.remove("is--active");
      }
    });
    // Toggle fitting graphic based on active class of the content area
    toggleSequences();
  }

  // Toggle graphics
  function toggleSequences() {
    let imgArray = Array.from(imgSequences);
    let active = 0;

    for (let i = 0; i < contentArray.length; i++) {
      imgArray[i].classList.remove("is--active");
      if (contentArray[i].classList.contains("is--active")) {
        active = i;
      }
    }
    imgArray[active].classList.add("is--active");
  }
});
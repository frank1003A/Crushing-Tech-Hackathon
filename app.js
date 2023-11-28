function app() {
  const guideContainer = document.getElementById("stepper");
  const guideBtn = document.getElementById("toggle-guide");
  const chevDownIcon = document.getElementById("chev-down");
  let trialCallBtn = document.querySelector("#close-trial-button");
  let trialCall = document.querySelector("#trial-callout");
  let completeCount = document.getElementById("complete-count");
  let progressBar = document.getElementById("progress-line");
  let menus = document.querySelectorAll(".dropdown");
  const steps = document.querySelectorAll(".step");
  const checkBoxButtons = document.querySelectorAll(".indicator");
  let dottedCircles = document.querySelectorAll(".dotted_circle");
  let loaderCircles = document.querySelectorAll(".loader-circle");
  let checkMarks = document.querySelectorAll(".checkmark");
  const contents = document.querySelectorAll(".info");
  const focusableElements = document.querySelectorAll('[tabindex="0"]');
  //
  let isActive = 0;
  let completed = [];
  const stepMax = 5;
  let resizeTimer;
  //
  const profileMenuTrigger = menus[1].querySelector("button");
  const profileMenu = menus[1].querySelector(".dropdown-container");
  const notificationMenuTrigger = menus[0].querySelector("button");
  const notificationMenu = menus[0].querySelector(".dropdown-container");

  // Add "step-active" class to the first step by default
  const firstStep = steps[isActive];
  expandStepRegion(firstStep, 0);

  /**
   *  TRIAL CARD
   */
  function closeTrialCallout() {
    trialCall.style.display = "none";
  }

  trialCallBtn.addEventListener("click", function () {
    closeTrialCallout();
  });

  /**
   * STEP EXPANSION AND MARKING
   */

  function rotateChevronIcon(btn) {
    if (chevDownIcon.classList.contains("rotate_180")) {
      chevDownIcon.classList.remove("rotate_180");
      chevDownIcon.classList.add("rotate_0");
      guideContainer.ariaExpanded = "false";
    } else {
      chevDownIcon.classList.remove("rotate_0");
      chevDownIcon.classList.add("rotate_180");
      guideContainer.ariaExpanded = "true";
    }
  }

  guideBtn.addEventListener("click", function () {
    if (!guideContainer) {
      console.error("Error: guide-container element not found.");
      return;
    }
    // Toggle the "display_none" class on the stepper element
    guideContainer.classList.toggle("display_none");

    /**const isExpanded =
      guideContainer.attributes["aria-expanded"].value === "true";

    if (isExpanded) {
      btn.ariaLabel = "collapse guide";
    } else {
      btn.ariaLabel = "expand guide";
    } */
    // Call the function to rotate the chevron icon
    rotateChevronIcon(this);
  });

  function expandStepRegion(step, index) {
    if (!step) {
      console.error("Error: Step element not found.");
      return;
    }

    // Remove "step-active" class and set aria-expanded to false for all steps
    for (let i = 0; i < steps.length; i++) {
      steps[i].classList.remove("step-active");
      steps[i].ariaExpanded = "false";
      steps[i].style.height = "45px";
    }

    // Add "step-active" class and set aria-expanded to true for the selected step
    step.classList.add("step-active");
    step.ariaExpanded = "true";
    step.style.height = contents[index].scrollHeight + 25 + "px";

    // Set the active step index
    isActive = index;
  }

  function markStepAsComplete(button, index) {
    let checkMarkStatus = steps[index].children[3];

    loaderCircles[index].style.display = "flex";
    checkMarkStatus.ariaLabel = "Loading, please wait...";

    // Show the check mark
    setTimeout(() => {
      loaderCircles[index].style.display = "none";
      checkMarkStatus.ariaLabel = "successfully marked as complete";
      checkMarks[index].classList.add("animate");
      // Add the index to the completed array
      completed.push(index);

      // Update the completed count and progress bar
      completeCount.innerHTML = `${completed.length}`;
      progressBar.style.width = `${20 * completed.length}%`;

      // Set aria-pressed attribute to true
      button.ariaPressed = "true";
      button.ariaLabel = button.ariaLabel.replace(
        "as complete",
        "as not complete"
      );
      moveToNextIncompleteStep();
    }, 1000);
  }

  function markStepAsIncomplete(button, index) {
    let checkMarkStatus = steps[index].children[3];

    // Hide the check mark and show the dotted circle
    checkMarks[index].classList.remove("animate");
    loaderCircles[index].style.display = "flex";

    checkMarkStatus.ariaLabel = "Loading, please wait...";

    setTimeout(() => {
      loaderCircles[index].style.display = "none";
      dottedCircles[index].style.display = "block";
      checkMarkStatus.ariaLabel = "successfully marked as incomplete";

      // Remove the index from the completed array
      completed = completed.filter((c) => c !== index);

      // Update the completed count and progress bar
      completeCount.innerHTML = `${completed.length}`;
      progressBar.style.width = `${20 * completed.length}%`;

      // Set aria-pressed attribute to false
      button.ariaPressed = "false";
      button.ariaLabel = button.ariaLabel.replace(
        "as not complete",
        "as complete"
      );
    }, 1000);
  }

  function handleStepCheck(button, index) {
    for (let i = 0; i < completed.length; i++) {
      if (completed[i] === index) {
        markStepAsIncomplete(button, index);
        return;
      }
    }
    markStepAsComplete(button, index);
  }

  function moveToNextIncompleteStep(index) {
    if (completed.length === stepMax) {
      return;
    }

    let incompleteSteps = Array.from(steps).filter(
      (s, i) => !completed.includes(i)
    );

    if (incompleteSteps.length > 0) {
      expandStepRegion(incompleteSteps[0], 1);
      incompleteSteps[0].focus();
    } else {
      return;
    }
  }

  steps.forEach((step, index) => {
    step.addEventListener("click", function () {
      expandStepRegion(step, index);
    });

    // handle keyup events.
    steps.forEach((step, index) => {
      // event listener to each step for keyboard interaction.
      step.addEventListener("keyup", function (event) {
        handleItemsArrowKeyPress(steps, event, index);
      });
    });
  });

  checkBoxButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      dottedCircles[index].style.display = "none";
      handleStepCheck(btn, index);
    });
  });

  const handleItemsArrowKeyPress = (items, event, index) => {
    const isLast = index === items.length - 1;
    const isFirst = index === 0;
    const next = items.item(index + 1);
    const prev = items.item(index - 1);
    const isStep = items[index].className.includes("step");
    items[0].ariaExpanded = "true";

    if (event.key === "Enter" || event.key === " ") {
      if (isStep) {
        expandStepRegion(items[index], index);
      }
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isLast) {
        items.item(0).focus();
        return;
      }
      next.focus();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirst) {
        items.item(items.length - 1).focus();
        return;
      }

      prev.focus();
    }
  };

  /**
   * KEYBOARD INTERACTIONS
   *
   * keyboard users are not only limited to accessing the checkbox
   * but they can also expand and collapse individual steps,
   * so they can see the extra action buttons and informations
   * before marking the step as complete.
   */

  // Handling the Escape key press to close associated menus.
  function handleMenuEscapeKeyPress(event) {
    // Checking if the pressed key is "Escape".
    if (event.key == "Escape") {
      // Closing profile and notification menus.
      closeMenu(profileMenu, profileMenuTrigger);
      closeMenu(notificationMenu, notificationMenuTrigger);
    }
  }

  // Closing the menu by removing the "menu-active" class and updating aria-expanded.
  function closeMenu(menu, button) {
    // Checking if the menu is currently active.
    if (menu.classList.contains("menu-active")) {
      // Removing the "menu-active" class to hide the menu.
      menu.classList.remove("menu-active");
      button.classList.remove("menu-focus");

      // Updating the aria-expanded attribute to indicate the menu is closed.
      button.ariaExpanded = "false";

      // Returning focus to the button that triggered the menu.
      button.focus();
    }
  }

  function toggleMenu(menu, button) {
    const isExpanded = button.attributes["aria-expanded"].value === "true";
    const allMenuItems = menu.querySelectorAll("a");
    const allButtons = menu.querySelectorAll("button");
    menu.classList.toggle("menu-active");
    button.classList.add("menu-focus");

    if (isExpanded) {
      button.ariaExpanded = "false";
      button.focus();
    } else {
      button.ariaExpanded = "true";
      allMenuItems.item(0)
        ? allMenuItems.item(0).focus()
        : allButtons.item(0).focus();

      menu.addEventListener("keyup", handleMenuEscapeKeyPress);
      allMenuItems.forEach((item, index) => {
        item.addEventListener("keyup", (event) => {
          // Handling key presses for navigation within a menu.
          handleItemsArrowKeyPress(allMenuItems, event, index);
        });
      });
    }
  }

  profileMenuTrigger.addEventListener("click", function () {
    toggleMenu(profileMenu, profileMenuTrigger);
  });

  notificationMenuTrigger.addEventListener("click", function () {
    toggleMenu(notificationMenu, notificationMenuTrigger);
  });

  window.addEventListener("mouseup", function (event) {
    if (event.target != profileMenu && event.target.parentNode != profileMenu) {
      closeMenu(profileMenu, profileMenuTrigger);
    }
    if (
      event.target != notificationMenu &&
      event.target.parentNode != notificationMenu
    ) {
      closeMenu(notificationMenu, notificationMenuTrigger);
    }
  });
}

app();

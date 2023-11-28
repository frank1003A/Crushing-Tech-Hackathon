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
  let checkMarks = document.querySelectorAll(".checkmark");
  const contents = document.querySelectorAll(".info");

  //
  let isActive = 0;
  let completed = [];
  const stepMax = 5;

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
      btn.ariaLabel.replace("collapse guide", "expand guide");
    } else {
      chevDownIcon.classList.remove("rotate_0");
      chevDownIcon.classList.add("rotate_180");
      guideContainer.ariaExpanded = "true";
      btn.ariaLabel.replace("expand guide", "collapse guide");
    }
  }

  guideBtn.addEventListener("click", function () {
    if (!guideContainer) {
      console.error("Error: guide-container element not found.");
      return;
    }
    // Toggle the "display_none" class on the stepper element
    guideContainer.classList.toggle("display_none");
    // Call the function to rotate the chevron icon
    rotateChevronIcon(this);
  });

  function calculatePaddingOrMargin(element) {
    const computedStyle = window.getComputedStyle(element);
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    const marginTop = parseFloat(computedStyle.marginTop);
    const marginBottom = parseFloat(computedStyle.marginBottom);

    return paddingTop + paddingBottom + marginTop + marginBottom;
  }

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
    //let checkMarkStatus = step.children[3];

    // Show the check mark
    checkMarks[index].style.display = "flex";

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
  }

  function markStepAsIncomplete(button, index) {
    if (!checkMarks || !dottedCircles || !completeCount || !progressBar) {
      console.log("Error: missing elements");
      return;
    }
    // Hide the check mark and show the dotted circle
    checkMarks[index].style.display = "none";
    dottedCircles[index].style.display = "block";

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

  function moveToNextIncompleteStep() {
    if (completed.length === stepMax) {
      return;
    }

    let incompleteSteps = Array.from(steps).filter(
      (s, i) => !completed.includes(i)
    );

    console.log(incompleteSteps[0]);

    /** if (incompleteSteps.length > 0) {
      expandStepRegion(incompleteSteps[0], 1);
    } else {
      return;
    } */
  }

  steps.forEach((step, index) => {
    step.addEventListener("click", function () {
      expandStepRegion(step, index);
    });
  });

  checkBoxButtons.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      dottedCircles[index].style.display = "none";
      handleStepCheck(btn, index);
    });
  });

  /**
   * KEYBOARD INTERACTIONS
   */
  function handleStepKeyPress(event, index) {
    // Determining if the current step is the last or first in the region.
    const isLastStep = index === steps.length - 1;
    const isFirstStep = index === 0;

    // Retrieving the next and previous steps.
    const nextStep = steps.item(index + 1);
    const prevStep = steps.item(index - 1);

    // Setting the aria-expanded attribute of the first step.
    steps[0].ariaExpanded = "true";

    // Checking for "Enter" or "Space" key press to trigger expansion.
    if (event.key === "Enter" || event.key === " ") {
      // Calling the function to expand the step region.
      expandStepRegion(steps[index], index);
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isLastStep) {
        // If last, focus on the first step in the region.
        steps.item(0).focus();
        return;
      }

      // Focusing on the next step.
      nextStep.focus();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirstStep) {
        // If first, focus on the last step.
        steps.item(steps.length - 1).focus();
        return;
      }

      // Focusing on the next step.
      prevStep.focus();
    }
  }

  // Iterating over focusable steps to handle keyup events for accessibility.
  steps.forEach((step, index) => {
    // Adding event listener to each step for keyboard interaction.
    step.addEventListener("keyup", function (event) {
      handleStepKeyPress(event, index);
    });
  });

  // Handling the Escape key press to close associated menus.
  function handleMenuEscapeKeyPress(event) {
    // Checking if the pressed key is "Escape".
    if (event.key == "Escape") {
      // Closing profile and notification menus.
      closeMenu(profileMenu, profileMenuTrigger);
      closeMenu(notificationMenu, notificationMenuTrigger);
    }
  }

  // Handling key presses for navigation within a menu.
  function handleMenuItemKeyPress(event, index) {
    // Retrieving all menu items for navigation.
    const allMenuItems = getAllMenuItem(profileMenu);

    // Determining if the current item is the last or first in the list.
    const isLastMenuItem = index === allMenuItems.length - 1;
    const isFirstMenuItem = index === 0;

    // Retrieving the next and previous menu items.
    const nextMenuItem = allMenuItems.item(index + 1);
    const prevMenuItem = allMenuItems.item(index - 1);

    // Navigating based on ArrowRight, ArrowDown, ArrowUp, and ArrowLeft keys.
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (isLastMenuItem) {
        // If last, focus on the first menu item.
        allMenuItems.item(0).focus();
        return;
      }

      // Focusing on the next menu item.
      nextMenuItem.focus();
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirstMenuItem) {
        // If first, focus on the last menu item.
        allMenuItems.item(allMenuItems.length - 1).focus();
        return;
      }

      // Focusing on the previous menu item.
      prevMenuItem.focus();
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

  /**Menu Handling */
  function getAllMenuItem(menu) {
    const allMenuItems = menu.querySelectorAll("a");
    return allMenuItems;
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
          handleMenuItemKeyPress(event, index);
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

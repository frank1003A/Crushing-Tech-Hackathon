# Crushing Tech Hackathon Submission 2023 - Web Accessibility and UI Design

## Overview

I had the incredible opportunity to participate in crushing tech hackathon that centered around enhancing web accessibility for keyboard users and screen readers. The primary focus was on creating a seamless user interface with an exceptional user experience. Below, I'll provide an overview of the key features and functionalities I implemented during the hackathon.

## Application Overview

I developed a shopify online store onboarding web application using HTML, CSS, and JavaScript, with a particular emphasis on improving accessibility and user interaction. The application featured a guided user journey, incorporating various UI elements and controls.

### Key Components and Features

#### Guided Stepper

I implemented a guided stepper that dynamically expands and collapses based on user interaction. The stepper allows users to navigate through different steps with ease, ensuring a smooth and accessible flow.

```javascript
// guided stepper
steps.forEach((step, index) => {
  step.addEventListener("click", function () {
    expandStepRegion(step, index);
  });
});
```

#### Interactive Checkboxes

To enhance user engagement, I incorporated interactive checkboxes with keyboard accessibility. Users could mark steps as complete or incomplete, triggering dynamic UI updates.

```javascript
// Interactive checkboxes
function handleStepCheck(button, index) {
  function handleStepCheck(button, index) {
    for (let i = 0; i < completed.length; i++) {
      if (completed[i] === index) {
        markStepAsIncomplete(button, index);
        return;
      }
    }
    markStepAsComplete(button, index);
  }
}
```

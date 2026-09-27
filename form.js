// State Management

let currentStep = 0;

const STORAGE_KEY = "multistep_form_data";



// DOM Node References

const form = document.getElementById("multiStepForm");

const steps = document.querySelectorAll(".form-step");

const indicators = document.querySelectorAll(".step-indicator");

const progressFill = document.getElementById("progressFill");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const summaryContainer = document.getElementById("summaryContainer");



// Initialize on page load

document.addEventListener("DOMContentLoaded", () => {

  loadSavedData();

  updateStepUI();

});



// Event Delegation for Autosave

form.addEventListener("input", saveFormData);

form.addEventListener("change", saveFormData);



// Next / Submit Handler

nextBtn.addEventListener("click", () => {

  if (currentStep < steps.length - 1) {

    if (validateStep(currentStep)) {

      currentStep++;

      updateStepUI();

    }

  } else {

    handleSubmit();

  }

});



// Previous Handler

prevBtn.addEventListener("click", () => {

  if (currentStep > 0) {

    currentStep--;

    updateStepUI();

  }

});



// Input Validation per Step

function validateStep(stepIndex) {

  const activeSection = steps[stepIndex];

  const inputs = activeSection.querySelectorAll("input, select");

  let isValid = true;



  inputs.forEach((input) => {

    const errorElement = document.getElementById(`${input.id}Error`);

    let fieldValid = true;



    // Presence check

    if (input.hasAttribute("required") && !input.value.trim()) {

      fieldValid = false;

    }

    // Email pattern check

    else if (input.type === "email" && input.value) {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(input.value)) {

        fieldValid = false;

      }

    }

    // Minlength check

    else if (input.hasAttribute("minlength") && input.value.length < parseInt(input.getAttribute("minlength"))) {

      fieldValid = false;

    }



    // Toggle error states

    if (!fieldValid) {

      input.classList.add("input-error");

      if (errorElement) errorElement.classList.add("visible");

      isValid = false;

    } else {

      input.classList.remove("input-error");

      if (errorElement) errorElement.classList.remove("visible");

    }

  });



  return isValid;

}



// UI State Synchronization

function updateStepUI() {

  // Toggle step visibility

  steps.forEach((step, index) => {

    if (index === currentStep) {

      step.classList.add("active");

    } else {

      step.classList.remove("active");

    }

  });



  // Update progress indicator circles

  indicators.forEach((indicator, index) => {

    if (index < currentStep) {

      indicator.className = "step-indicator completed";

    } else if (index === currentStep) {

      indicator.className = "step-indicator active";

    } else {

      indicator.className = "step-indicator";

    }

  });



  // Calculate and update progress line width

  const progressPercent = (currentStep / (steps.length - 1)) * 100;

  progressFill.style.width = `${progressPercent}%`;



  // Button adaptations

  prevBtn.disabled = currentStep === 0;



  if (currentStep === steps.length - 1) {

    nextBtn.textContent = "Submit";

    populateSummary();

  } else {

    nextBtn.textContent = "Next";

  }

}



// Populate Summary Screen

function populateSummary() {

  const formData = new FormData(form);

  const fieldLabels = {

    fullName: "Full Name",

    email: "Email Address",

    username: "Username",

    password: "Password",

    role: "Target Role",

    experience: "Experience Level"

  };



  summaryContainer.innerHTML = "";



  for (const [key, value] of formData.entries()) {

    const row = document.createElement("div");

    row.className = "summary-row";



    const labelSpan = document.createElement("span");

    labelSpan.className = "summary-label";

    labelSpan.textContent = fieldLabels[key] || key;



    const valueSpan = document.createElement("span");

    valueSpan.className = "summary-value";

    valueSpan.textContent = key === "password" ? "••••••••" : value;



    row.appendChild(labelSpan);

    row.appendChild(valueSpan);

    summaryContainer.appendChild(row);

  }

}



// Autosave: Form -> localStorage

function saveFormData() {

  const rawData = new FormData(form);

  const dataObj = {};

  rawData.forEach((value, key) => {

    dataObj[key] = value;

  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataObj));

}



// Autosave: localStorage -> Form

function loadSavedData() {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return;



  try {

    const dataObj = JSON.parse(saved);

    Object.keys(dataObj).forEach((key) => {

      const input = form.elements[key];

      if (input) {

        input.value = dataObj[key];

      }

    });

  } catch (e) {

    console.error("Failed to restore form data from storage", e);

  }

}



// Final Submit Handler

function handleSubmit() {

  alert("Form submitted successfully!");

  localStorage.removeItem(STORAGE_KEY);

  form.reset();

  currentStep = 0;

  updateStepUI();

} 


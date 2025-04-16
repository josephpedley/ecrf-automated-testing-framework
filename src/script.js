document.addEventListener("DOMContentLoaded", function () {
    // 1. Calculate average BP
    const bpFields = [
      "bp-systolic-1", "bp-systolic-2", "bp-systolic-3",
      "bp-diastolic-1", "bp-diastolic-2", "bp-diastolic-3"
    ];
  
    bpFields.forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener("input", updateAverageBP);
      }
    });
  
    function updateAverageBP() {
      const systolics = [1, 2, 3].map(i => parseFloat(document.getElementById(`bp-systolic-${i}`).value));
      const diastolics = [1, 2, 3].map(i => parseFloat(document.getElementById(`bp-diastolic-${i}`).value));
  
      const validSystolic = systolics.filter(n => !isNaN(n));
      const validDiastolic = diastolics.filter(n => !isNaN(n));
  
      if (validSystolic.length === 3) {
        const avgSys = Math.round(validSystolic.reduce((a, b) => a + b) / 3);
        document.getElementById("bp-systolic-avg").value = avgSys;
      }
  
      if (validDiastolic.length === 3) {
        const avgDia = Math.round(validDiastolic.reduce((a, b) => a + b) / 3);
        document.getElementById("bp-diastolic-avg").value = avgDia;
      }
    }
  
    // 2. Toggle Concomitant Medications section
    const conmedYes = document.getElementById("has-conmeds-yes");
    const conmedNo = document.getElementById("has-conmeds-no");
    const conmedSection = document.getElementById("conmeds-details-section");
  
    function toggleConmedsSection() {
      conmedSection.style.display = conmedYes.checked ? "block" : "none";
    }
  
    conmedYes?.addEventListener("change", toggleConmedsSection);
    conmedNo?.addEventListener("change", toggleConmedsSection);
    toggleConmedsSection(); // Initialize on load
  
    // 3. Add new Concomitant Medication
    document.getElementById("add-conmed")?.addEventListener("click", function () {
      const conmeds = document.querySelectorAll(".conmed-entry");
      const last = conmeds[conmeds.length - 1];
      const newEntry = last.cloneNode(true);
  
      // Reset values and update IDs
      const index = conmeds.length + 1;
      newEntry.querySelectorAll("input, select").forEach(input => {
        input.value = "";
        const id = input.id.replace(/\d+$/, index);
        input.id = id;
        input.setAttribute("data-cy", id);
        const label = newEntry.querySelector(`label[for="${input.name}"]`);
        if (label) label.setAttribute("for", id);
      });
  
      // Clear error messages
      newEntry.querySelectorAll(".error-message").forEach(err => err.textContent = "");
  
      last.parentNode.insertBefore(newEntry, last.nextSibling);
    });
  
    // 4. Simple Validation Handling
    const form = document.getElementById("drug-trial-form");
    const validateButton = document.getElementById("validate-form");
    const submitButton = document.getElementById("submit-form");
    const validationResults = document.getElementById("form-validation-results");
    const successMessage = document.getElementById("success-message");
    const messageList = document.getElementById("validation-message-list");
  
    function validateForm() {
      messageList.innerHTML = "";
      let isValid = true;
      const requiredFields = form.querySelectorAll("[required]");
  
      requiredFields.forEach(field => {
        const errorDiv = field.parentElement.querySelector(".error-message");
        if (!field.value || (field.type === "checkbox" && !field.checked)) {
          errorDiv.textContent = "This field is required.";
          field.classList.add("error");
          isValid = false;
  
          const label = form.querySelector(`label[for="${field.id}"]`);
          const labelText = label ? label.innerText : field.name;
          const message = `<li>${labelText} is required.</li>`;
          messageList.innerHTML += message;
        } else {
          errorDiv.textContent = "";
          field.classList.remove("error");
        }
      });
  
      validationResults.classList.toggle("hidden", isValid);
      return isValid;
    }
  
    validateButton?.addEventListener("click", () => {
      validateForm();
    });
  
    // 5. Simulate submission
    form?.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForm()) {
        form.classList.add("hidden");
        const now = new Date();
        document.getElementById("submission-datetime").textContent = now.toLocaleString();
        document.getElementById("reference-number").textContent = `ICTU-${Math.floor(Math.random() * 100000)}`;
        successMessage.classList.remove("hidden");
      }
    });
  
    document.getElementById("new-form")?.addEventListener("click", () => {
      location.reload();
    });
  
    document.getElementById("close-validation")?.addEventListener("click", () => {
      validationResults.classList.add("hidden");
    });
  });
  
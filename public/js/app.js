let checkBtnText = document.querySelector(".form-check-label");
let checkBtn = document.querySelector(".form-check-input");
let formSwicth = document.querySelector(".form-switch")
let taxConext = document.getElementsByClassName("taxation-context");

document.addEventListener("DOMContentLoaded",() => {
checkBtn.addEventListener("click", function () {
  for (let tax of taxConext) {
    tax.style.display != "inline"
      ? (tax.style.display = "inline")
      : (tax.style.display = "none");
  }
  if (checkBtnText.innerText === "Wihtout Taxes") {
      checkBtnText.innerHTML = "Including Taxes";   
  } else {
      checkBtnText.innerHTML = "Wihtout Taxes";
  }
});
});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {  
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

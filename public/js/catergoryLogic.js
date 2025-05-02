let dropDownItems = document.querySelectorAll(".dropdown-item");
let hiddenInput = document.getElementById("selectedCategory");
let categoryBtn  = document.querySelector(".dropdown-toggle")


/* CATERGORY-DROP-DOWN-LOGIC */
document.addEventListener('DOMContentLoaded', () => {      
      dropDownItems.forEach(item => {
        item.addEventListener("click",(e) => {
          e.preventDefault(); //To prevent <a> from navigate
          if (e.target && e.target.classList.contains('dropdown-item')) {
          const category = item.getAttribute('data-category');
          hiddenInput.value = category;//set the hideen input
          categoryBtn.textContent = category; // optional: show selected on button
          }
        });
      
      });
      });
    

let reason = document.getElementById("reason")

let Description = document.getElementById("Description")
let DescriptionLable = document.getElementById("DescriptionLbl")
let Choose = document.getElementById("Choose")
let ChooseLable = document.getElementById("ChooseLable")

let Form = document.getElementById("CreateEventForm")

Choose.style.display = "none"
ChooseLable.style.display = "none"
Description.style.display = "none"
DescriptionLable.style.display = "none"

reason.addEventListener("change", function() {

    Choose.style.display = "none"
    ChooseLable.style.display = "none"
    Description.style.display = "none"
    DescriptionLable.style.display = "none"

    Choose.removeAttribute("required")
    Description.removeAttribute("required")

    if (reason.value === "בקשה לצאת לקורס") {
        Choose.style.display = "block"
        ChooseLable.style.display = "block"

        Choose.setAttribute("required", "")
    }

    if (reason.value === "דיווח על תקלה") {
        Description.style.display = "block"
        DescriptionLable.style.display = "block"

        DescriptionLable.innerHTML = `פרט על התקלה <span class="ReqTxt">*</span>`

        Description.setAttribute("required", "")
    }

    if (reason.value === "אחר") {
        Description.style.display = "block"
        DescriptionLable.style.display = "block"

        DescriptionLable.innerHTML = `תיאור על השליחה <span class="ReqTxt">*</span>`

        Description.setAttribute("required", "")
    }
})

Form.onsubmit = async (event) => {
    event.preventDefault();

    let FormItemData = {
        Reason: document.getElementById("reason").value,
        Choose: document.getElementById("Choose").value,
        Description: document.getElementById("Description").value
    }

    console.log(FormItemData)
}
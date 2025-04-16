let ItemForm = document.getElementById("CreateEventForm")

if (!UserData2 || UserData2.Premission_Level < 1)
{
    window.location.href = "https://icf.xitsraz.me/Error"
}

let TypeQ = document.getElementById("Type")

let AtchLbl = document.getElementById("AtchLbl")
let AtchType = document.getElementById("AtchType")

let CaliberLbl = document.getElementById("CaliberLbl")
let CaliberType = document.getElementById("CaliberType")

let WeaponTypeLbl = document.getElementById("WeaponTypeLbl")
let WeaponType = document.getElementById("WeaponType")

TypeQ.addEventListener("change", function() {
    AtchLbl.style.display = "none"
    AtchType.style.display = "none"
    AtchType.value = ""
    AtchType.removeAttribute("required");

    CaliberLbl.style.display = "none"
    CaliberType.style.display = "none"
    CaliberType.value = ""
    CaliberType.removeAttribute("required");

    WeaponTypeLbl.style.display = "none"
    WeaponType.style.display = "none"
    WeaponType.value = ""
    WeaponType.removeAttribute("required");


    if (TypeQ.value === "Attachment") {
        AtchLbl.style.display = "block"
        AtchType.style.display = "block"
        
        AtchType.setAttribute("required", "");

        WeaponTypeLbl.style.display = "block"
        WeaponType.style.display = "block"
        
        AtchType.setAttribute("required", "");
    }

    if (TypeQ.value === "Primary") {
        WeaponTypeLbl.style.display = "block"
        WeaponType.style.display = "block"
        
        AtchType.setAttribute("required", "");
    }
})

AtchType.addEventListener("change", function() {
    if  (AtchType.value === "magazine") {
        CaliberLbl.style.display = "block"
        CaliberType.style.display = "block"

        CaliberType.setAttribute("required", "");
    }

    else {
        CaliberLbl.style.display = "none"
        CaliberType.style.display = "none"
        CaliberType.value = ""
        CaliberType.removeAttribute("required");
    }
})

ItemForm.onsubmit = async (event) => {
    event.preventDefault();

    let fileInput = document.getElementById("Image");
    let file = fileInput.files[0];

    let reader = new FileReader();

    
    let Rank = document.getElementById("Rank").value
    if (Rank === "") {
        Rank = null
    }
    else {
        Rank = Number(Rank)
    }

        reader.onload = function(e) {
            let base64String = e.target.result;

            let imageData = base64String.split(",")[1];

            let LimitValue = null
            let SpaceValue = null

            if (document.getElementById("Limit").value !== "")
            {
                LimitValue = document.getElementById("Limit").value
            }

            if (document.getElementById("Space").value !== "")
            {
                SpaceValue = document.getElementById("Space").value
            }

            let FormItemData = {
                Title: document.getElementById("Title").value,
                Description: document.getElementById("Description").value,
                ItemId: document.getElementById("ItemId").value,
                Weight: document.getElementById("Weight").value,
                Space: SpaceValue,
                Limit: LimitValue,
                Team: document.getElementById("Team").value,
                Category: document.getElementById("Category").value,
                Pakal: document.getElementById("Pakal").value,
                Type: document.getElementById("Type").value,
                Image: imageData,
                AtchType: AtchType.value,
                WeaponType: WeaponType.value,
                Caliber: CaliberType.value,
                Rank: Rank
            };

            console.log(FormItemData)

            fetch("https://icf-api-ten.vercel.app/ItemFormSend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(FormItemData)
            })
            .then(response => response.json())
            .then(data => {
                alert("החפץ נוסף בהצלחה")
                location.reload(false)
            })
            .catch(error => {
                console.error("Error:", error);
                console.log("Error submitting the form.");
            });
        };

        reader.readAsDataURL(file);
}
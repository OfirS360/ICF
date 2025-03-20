let ItemForm = document.getElementById("CreateEventForm")

if (!UserData2 || UserData2.Premission_Level < 1)
{
    alert("אין לך גישות למקום הזה")
    window.location.href = "https://icf.xitsraz.me/User_Area/equipment"
}

ItemForm.onsubmit = async (event) => {
    event.preventDefault();

    let fileInput = document.getElementById("Image");
    let file = fileInput.files[0];

    let reader = new FileReader();

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
            };

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
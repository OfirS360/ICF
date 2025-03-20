let ItemForm = document.getElementById("CreateEventForm")

if (UserData2.Premission_Level < 1)
{
    alert("החפץ נוסף בהצלחה")
    window.location.href = "https://icf.xitsraz.me/User_Area/equipment"
}

ItemForm.onsubmit = async (event) => {
    event.preventDefault();

    let fileInput = document.getElementById("Image");
    let file = fileInput.files[0];

    let reader = new FileReader();

        reader.onload = function(e) {
            let base64String = e.target.result;

            let FormItemData = {
                Title: document.getElementById("Title").value,
                Description: document.getElementById("Description").value,
                ItemId: document.getElementById("ItemId").value,
                Weight: document.getElementById("Weight").value,
                Space: document.getElementById("Space").value,
                Limit: document.getElementById("Limit").value,
                Team: document.getElementById("Team").value,
                Category: document.getElementById("Category").value,
                Pakal: document.getElementById("Pakal").value,
                Type: document.getElementById("Type").value,
                Image: base64String,
            };

            fetch("https://icf-api-ten.vercel.app/EventFormSend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(FormEventData)
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
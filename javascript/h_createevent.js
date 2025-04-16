const Form = document.getElementById("CreateEventForm")

if (UserData2.Premission_Level == 0)
{
    window.location.href = "https://icf.xitsraz.me/Error";
}

Form.onsubmit = async (event) => {
    event.preventDefault();

    let FormEventData = {
        Title: document.getElementById("Title").value,
        Description: document.getElementById("Description").value,
        Date: new Date(document.getElementById("Date").value).toISOString().split('T')[0],
        Creator: UserData2.Name,
        Time: document.getElementById("Time").value,
        Type: document.getElementById("type").value
    }

    if (FormEventData.Type === "אימון צוותי") {
        FormEventData.Team = UserData2.Team
    }

    if (FormEventData.Title && FormEventData.Description && FormEventData.Date && FormEventData.Time && FormEventData.Type)
    {
        fetch("https://icf-api-ten.vercel.app/EventFormSend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(FormEventData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            console.log("Form submitted successfully!");
            window.location.href = "h_events.html"
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Error submitting the form.");
        });
    }
}
const SubmitBtn = document.getElementById("submit")

if (UserData.Premission_Level == 0)
{
    window.location.href = "h_events.html";
}

SubmitBtn.onclick = () => {
    let FormEventDate = {
        Title: document.getElementById("Title").value,
        Description: document.getElementById("Description").value,
        Date: new Date(document.getElementById("Date").value).toISOString().split('T')[0],
        Creator: UserData.Name,
        Time: document.getElementById("Time").value,
        Type: document.getElementById("type").value
    }

    if (!(FormEventDate.Title == "" || FormEventDate.Description == "" || FormEventDate.Date == "" || FormEventDate.Time == "" || FormEventDate.Type == ""))
    {
        fetch("https://icf-api-ten.vercel.app/EventFormSend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(FormEventDate)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            console.log("Form submitted successfully!");
            alert("האירוע נוצר")
            window.location.href = "h_events.html";
        })
        .catch(error => {
            console.error("Error:", error);
            console.log("Error submitting the form.");
        });
    }
}
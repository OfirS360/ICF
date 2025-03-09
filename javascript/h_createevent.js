const E_Title = document.getElementById("Title")
const E_Description = document.getElementById("Description")
const E_Date = document.getElementById("Date")
const E_Time = document.getElementById("Time")
const E_Type = document.getElementById("type")

const SubmitBtn = document.getElementById("submit")

SubmitBtn.onclick = () => {
    let FormEventDate = {
        Title: document.getElementById("Title").value,
        Description: document.getElementById("Description").value,
        Date: document.getElementById("Date").value,
        Creator: UserData.Name,
        Time: document.getElementById("Time").value,
        Type: document.getElementById("type").value
    }

    if (!(FormEventDate.Title == "" || FormEventDate.Description == "" || FormEventDate.Date == "" || FormEventDate.Time == "" || FormEventDate.Type == ""))
    {
        console.log(FormEventDate)
        alert("בדיקה")
    }
    
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

        window.location.href = "h_events.html";
    })
    .catch(error => {
        console.error("Error:", error);
        console.log("Error submitting the form.");
    });
}
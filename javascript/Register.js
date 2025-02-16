let sumbit = document.getElementById("submit");

sumbit.onclick = () => {
    let formData = {
        FullName: document.getElementById("full_name").value,
        Age: document.getElementById("age").value,
        ArmaExperience: document.getElementById("arma_experience").checked,
        PreviousClans: document.getElementById("previous_clans").value,
        ClansIssues: document.getElementById("clan_issues").value,
        JoinReason: document.getElementById("join_reason").value,
        MilitaryExperience: document.getElementById("military_experience").checked,
        WeeklyHours: document.getElementById("weekly_hours").value,
        FridayAvilable: document.getElementById("friday_availability").checked
    };

    if (formData.FullName == "" || formData.Age == "" || JoinReason == "" || WeeklyHours == "")
    {
        alert("נא למלא את החסר בטופס.")
        return;
    }
        

    console.log(formData);

    fetch("http://localhost:3000/RegisterFormSend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        alert("Form submitted successfully!");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error submitting the form.");
    });
}
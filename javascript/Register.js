let sumbit = document.getElementById("submit");

sumbit.onclick = () => {
    let formData = {
        FullName: document.getElementById("full_name").value,
        Age: document.getElementById("age").value,
        ArmaExperience: document.getElementById("Yes_arma_experience").checked,
        ArmaHours: document.getElementById("arma_hours").value,
        PreviousClans: document.getElementById("previous_clans").value,
        ClansIssues: document.getElementById("clan_issues").value,
        JoinReason: document.getElementById("join_reason").value,
        MilitaryExperience: document.getElementById("Yes_military_experience").checked,
        WeeklyHours: document.getElementById("weekly_hours").value,
        FridayAvailable: document.getElementById("Yes_friday_availability").checked,
        Avilability: document.getElementById("Yes_availability").checked
    };

    if (formData.FullName == "" || formData.Age == "" || formData.JoinReason == "" || formData.WeeklyHours == "" || !getSelectedJoinValue())
    {
        alert("נא למלא את החסר בטופס.")
        return;
    }

    console.log(formData.FridayAvilable)

    fetch("https://icf-oq7aqqzmx-ofirs360s-projects.vercel.app/RegisterFormSend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        console.log("Form submitted successfully!");

        window.location.href = "index.html";
        alert("הטופס נשלח, את שאר הפרטים תקבל בקרוב")
    })
    .catch(error => {
        console.error("Error:", error);
        console.log("Error submitting the form.");
    });
}

function getSelectedJoinValue() {
    let Yes_ArmaExperience = document.getElementById("Yes_arma_experience");
    let No_ArmaExperience = document.getElementById("No_arma_experience");
    let Yes_MilitaryExperience = document.getElementById("Yes_military_experience");
    let No_MilitaryExperience = document.getElementById("No_military_experience");
    let Yes_FridayAvilable = document.getElementById("Yes_friday_availability"); 
    let No_FridayAvilable = document.getElementById("No_friday_availability"); 
    let Yes_Avilable = document.getElementById("Yes_availability");
    let No_Avilable = document.getElementById("No_availability");

    if (!(Yes_ArmaExperience.checked || No_ArmaExperience.checked)) return false;
    if (!(Yes_MilitaryExperience.checked || No_MilitaryExperience.checked)) return false;
    if (!(Yes_FridayAvilable.checked || No_FridayAvilable.checked)) return false;
    if (!(Yes_Avilable.checked || No_Avilable.checked)) return false;

    return true;
    
}
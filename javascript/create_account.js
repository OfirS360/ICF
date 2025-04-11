let ItemForm = document.getElementById("CreateAccountForm")
let Teams = ["Mechine", "Odin", "Akrav", "Lavie", "Drakon"]
let TeamsText = ["חפק מכונה", "צוות אודין", "צוות עקרב", "צוות לביא", "צוות דרקון"]


ItemForm.onsubmit = async (event) => {
    event.preventDefault();

    let Team = null;

    for (let i = 0; i < TeamsText.length; i++) {
        if(document.getElementById("Role").value === TeamsText[i]) {
            Team = Teams[i]
            break
        }
    }

    let FormItemData = {
        SteamId: document.getElementById("steamid").value,
        Name: document.getElementById("full_name").value,
        Rank: Number(document.getElementById("Rank").value),
        Age: Number(document.getElementById("age").value),
        Role: document.getElementById("Role").value,
        Position: document.getElementById("Position").value,
        Status: 1,
        Premission_Level: 0,
        Team: Team,
        xp: 0,
    };

    console.log(FormItemData)

    fetch("https://icf-api-ten.vercel.app/AccountFormSend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(FormItemData)
    })
    .then(response => response.json())
    .then(data => {
        alert("המשתמש נוצר בהצלחה!")
        window.location.href = "https://icf.xitsraz.me/Main_Pages/login"
    })
    .catch(error => {
        console.error("Error:", error);
        console.log("Error submitting the form.");
    });
}
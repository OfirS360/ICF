let TeamMembers = sessionStorage.getItem("Members")

let TeamLogo = document.getElementById("TeamImg")
let TeamTable = document.getElementById("TeamTable")

let UserDataKeys = ["Name", "SteamId", "Rank", "Age", "Role", "Position", "Status", "Premission_Level"]
let StatusText = ["לא פעיל", "פעיל"]
let PremissionText = ["ללא הרשאות", "פיקוד", "צוות הכשרה", "הרשאה כוללת", "הנהלה"]

initializePage()
async function initializePage() {

    if (UserData2.Premission_Level != 1 && UserData2.Premission_Level < 3)
    {
        window.location.href = "https://icf.xitsraz.me/Error";
    }

    TeamLogo.src = `../img/${UserData2.Team}.png`

    if (!TeamMembers) {
        await GetAllTeamMembers(UserData2.Team)
    }
    else {
        TeamMembers = JSON.parse(TeamMembers)
    }

    UpdateTable()

    await GetAllTeamMembers(UserData2.Team)

    UpdateTable()
}

/**
 * מעדכן את הטבלה
 */
function UpdateTable() {
    for (let i = 0; i < TeamMembers.length; i++) {
        for (let j = 0; j < 8; j++) {
            let DataBox = document.createElement("div")
            DataBox.classList.add("TableData")

            if (j == 2) {
                DataBox.innerHTML = `<img src="../img/Rank${TeamMembers[i][UserDataKeys[j]]}.png" class="RankImg">`
            }
            else if (j == 6) {
                DataBox.textContent = StatusText[TeamMembers[i][UserDataKeys[j]]]
            }
            else if (j == 7) {
                DataBox.textContent = PremissionText[TeamMembers[i][UserDataKeys[j]]]
            }
            else {
                DataBox.textContent = TeamMembers[i][UserDataKeys[j]]
            }

            TeamTable.appendChild(DataBox)
        }
    }
}

/**
 * מעדכן את המשתמשים
 */
async function GetAllTeamMembers(Team) {
    const response = await fetch(`https://icf-api-ten.vercel.app/GetAllTeamMembers/${Team}`)
    let data = await response.json();

    if (data.results) {
        sessionStorage.setItem("Members", JSON.stringify(data.results.sort((a, b) => b.Rank - a.Rank)))
        TeamMembers = data.results.sort((a, b) => b.Rank - a.Rank);
    }
}
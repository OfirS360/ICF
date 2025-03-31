let TeamMembers = getItem("Members")

let TeamTable = document.getElementById("TeamTable")

let UserDataKeys = ["Name", "SteamId", "Rank", "Age", "Role", "Position", "Status", "Premission_Level"]

initializePage()
async function initializePage() {
    if (!TeamMembers) {
        await GetAllTeamMembers(UserData2.Team)
    }
    else {
        TeamMembers = JSON.parse(TeamMembers)
    }

    for (let i = 0; i < TeamMembers.length; i++) {
        for (let j = 0; j < 8; j++) {
            let DataBox = document.createElement("div")
            DataBox.classList.add("TableData")
            DataBox.textContent = TeamMembers[i][UserDataKeys[j]]

            TeamTable.appendChild(DataBox)
        }
    }
}

async function GetAllTeamMembers(Team) {
    const response = await fetch(`https://icf-api-ten.vercel.app/GetAllTeamMembers/${Team}`)
    let data = await response.json();
    
    console.log(data)

    if (data.results) {
        sessionStorage.setItem("Members", JSON.stringify(data.results))
        TeamMembers = data.sort((a, b) => b.Rank - a.Rank);
    }
}
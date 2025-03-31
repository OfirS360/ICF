let TeamMembers

initializePage()
async function initializePage() {
    await GetAllTeamMembers(UserData2.Team)
}

async function GetAllTeamMembers(Team) {
    const response = await fetch(`https://icf-api-ten.vercel.app/GetAllTeamMembers/${Team}`)
    let data = await response.json();
    
    console.log(data)

    if (data.results) {
        sessionStorage.setItem("Members", JSON.stringify(data.results))
        TeamMembers = data.results
    }
}
let UserData2 = sessionStorage.getItem("userData")
UserData2 = JSON.parse(UserData2)
let SteamAvatar = sessionStorage.getItem("SteamAvatar")
SteamAvatar = JSON.parse(SteamAvatar)

initializePage()

async function initializePage() {

    let reloadbtn = document.getElementById("reload-profile")

    reloadbtn.onclick = async () => {
        await GetUserData();
        await GetUserImage();
        UpdateData();
        PopAlert("הטעינה הושלמה", 1, "הפרטים שלך כרגע עדכניים לרגע זה.")
    }

    UpdateData()
}

async function GetUserData() {
    const response = await fetch(`https://icf-api-ten.vercel.app/GetUserData/${UserData2.SteamId}`)
    const data = await response.json()

    if (data.results) {
        UserData2 = data.results
        sessionStorage.setItem("userData", JSON.stringify(data.results))
    }
}

async function GetUserImage() {
    const response = await fetch(`https://icf-api-ten.vercel.app/getSteamUser/${UserData2.SteamId}`);
    const data = await response.json();
    
    if (data.response.players.length > 0) {
        sessionStorage.setItem("SteamAvatar", data.response.players[0].avatarfull);
        SteamAvatar = data.response.players[0].avatarfull;
    }
}

function UpdateData() {
    let T_Username = document.getElementById("Username")
    let T_Avatar = document.getElementById("avatar")
    let T_Role = document.getElementById("Role")
    let T_Rank = document.getElementById("RankImg")
    let B_Disconnect = document.getElementById("Disconnect")
    let ProgressBar = document.getElementById("ProfileProgress")

    if (UserData2.Rank < 10) {
        ProgressBar.max = UserData2.Rank * 75
    }
    else {
        ProgressBar.max = UserData2.Rank * 55
    }
    ProgressBar.value = UserData2.xp

    T_Username.textContent = "שלום, " + UserData2.Name;
    T_Role.textContent = UserData2.Position
    T_Rank.src = `../img/Rank${UserData2.Rank}.png`

    if (UserData2.Premission_Level < 4) {
        let ManageElements = document.querySelectorAll(".Manage")

        ManageElements.forEach(element => {
            element.remove()
        });
    }

    if (UserData2.Premission_Level < 2) {
        let CourseElements = document.querySelectorAll(".Course")

        CourseElements.forEach(element => {
            element.remove()
        });
    }

    if (UserData2.Premission_Level < 1 || UserData2.Premission_Level == 2) {
        let CommandElements = document.querySelectorAll(".Command")

        CommandElements.forEach(element => {
            element.remove()
        });
    }

    if (SteamAvatar)
        T_Avatar.src = SteamAvatar
    else
        T_Avatar.src = "../img/def_img.png"

    if (UserData2.Rank > 4) {
        T_Rank.style.width = "22px"
        T_Rank.style.transform = `rotate(45deg)`;
    }
    else {
        T_Rank.style.width = "45px"
        T_Rank.style.transform = `rotate(-20deg)`;
    }

    B_Disconnect.onclick = () => {
        sessionStorage.clear()
        window.location.replace("https://icf.xitsraz.me/");
    }
}
let UserData2 = sessionStorage.getItem("userData")
UserData2 = JSON.parse(UserData2)
let SteamAvatar = sessionStorage.getItem("SteamAvatar")

let T_Username = document.getElementById("Username")
let T_Avatar = document.getElementById("avatar")
let T_Role = document.getElementById("Role")
let T_Rank = document.getElementById("RankImg")
let B_Disconnect = document.getElementById("Disconnect")

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
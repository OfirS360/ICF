let UserData = sessionStorage.getItem("userData")
UserData = JSON.parse(UserData)
let SteamAvatar = sessionStorage.getItem("SteamAvatar")

let T_Username = document.getElementById("Username")
let T_Avatar = document.getElementById("avatar")
let T_Role = document.getElementById("Role")
let T_Rank = document.getElementById("RankImg")
let B_Disconnect = document.getElementById("Disconnect")

T_Username.textContent = "שלום, " + UserData.Name;
T_Role.textContent = UserData.Position
T_Rank.src = `img/Rank${UserData.Rank}.png`

if (SteamAvatar)
    T_Avatar.src = SteamAvatar
else
    T_Avatar.src = "img/def_img.png"

if (UserData.Rank > 4) {
    T_Rank.style.width = "22px"
    T_Rank.style.transform = `rotate(45deg)`;
}
else {
    T_Rank.style.width = "45px"
    T_Rank.style.transform = `rotate(-20deg)`;
}

B_Disconnect.onclick = () => {
    sessionStorage.clear()
    window.location.replace("index.html");
}
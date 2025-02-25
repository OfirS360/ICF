let UserData = sessionStorage.getItem("userData")
UserData = JSON.parse(UserData)
let SteamAvatar = sessionStorage.getItem("SteamAvatar")

if (!UserData) {
    alert("נא לבצע התחברות לפני כניסה לאזור האישי!")
    window.location.replace("index.html");
}

let T_Username = document.getElementById("Username")
let T_Avatar = document.getElementById("avatar")
let T_Role = document.getElementById("Role")
let T_Rank = document.getElementById("RankImg")
let B_Disconnect = document.getElementById("Disconnect")

T_Username.textContent = "שלום, " + UserData.Name;
T_Role.textContent = UserData.Position
T_Rank.src = `img/Rank${UserData.Rank}.png`
T_Avatar.src = SteamAvatar

B_Disconnect.onclick = () => {
    sessionStorage.clear()
    window.location.replace("index.html");
}
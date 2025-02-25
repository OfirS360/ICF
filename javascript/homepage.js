const SteamApi = `3E37434837BF21352A799F672E4062F1`;

let UserData = sessionStorage.getItem("userData")
UserData = JSON.parse(UserData)
console.log(UserData)

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

fetch(`https://icf-api-ten.vercel.app/getSteamUser/${UserData.SteamId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.response.players.length > 0) {
            T_Avatar.src = data.response.players[0].avatarfull
            sessionStorage.setItem("SteamAvatar", JSON.stringify(data.response.players[0].avatarfull))
        }
        else {
            console.log("המתשמש steam לא נמצא")
        }
    }
    )
    .catch(error => {
        console.error("API:", error);
    });
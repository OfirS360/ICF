const SteamApi = `3E37434837BF21352A799F672E4062F1`;

let UserData = sessionStorage.getItem("userData")
UserData = JSON.parse(UserData)
console.log(UserData)

// if (!UserData) {
//     alert("נא לבצע התחברות לפני כניסה לאזור האישי!")
//     window.location.replace("index.html");
// }

let T_Username = document.getElementById("Username")
let T_Avatar = document.getElementById("avatar")
let T_Role = document.getElementById("Role")
let T_Rank = document.getElementById("RankImg")
let B_Disconnect = document.getElementById("Disconnect")

let I_Name = document.getElementById("InputName")
let I_SteamId = document.getElementById("InputSteamId")
let I_Age = document.getElementById("InputAge")
let I_Rank = document.getElementById("InputRank")
let I_Role = document.getElementById("InputRole")
let I_Position = document.getElementById("InputPosition")
let I_Status = document.getElementById("InputStatus")

const RankInText = [ "טוראי", "טוראי ראשון", "סמל", "סמל ראשון", "רב סמל", "רב סמל ראשון", "רב סמל מתקדם", "רב סמל בכיר", "רב נגד משנה", "רב נגד", "סגן משנה", "סגן", "סרן", "רב סרן", "סגן אלוף", "אלוף משנה"]

T_Username.textContent = "שלום, " + UserData.Name;
T_Role.textContent = UserData.Position
T_Rank.src = `img/Rank${UserData.Rank}.png`
T_Avatar.src = "img/def_img.png"

I_Name.value = UserData.Name;
I_SteamId.value = UserData.SteamId;
I_Age.value = UserData.Age;
I_Role.value = UserData.Role;
I_Position.value = UserData.Position;
I_Rank.value = RankInText[UserData.Rank - 1];
if (UserData.Status == 1)
    I_Status.value = "פעיל";
else
    I_Status.value = "לא פעיל";


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
            sessionStorage.setItem("SteamAvatar", data.response.players[0].avatarfull)
        }
        else {
            console.log("המתשמש steam לא נמצא")
        }
    }
    )
    .catch(error => {
        console.error("API:", error);
    });
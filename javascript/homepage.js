const SteamApi = `3E37434837BF21352A799F672E4062F1`;

let UserData = sessionStorage.getItem("userData")
UserData = JSON.parse(UserData)
console.log(UserData)

let T_Username = document.getElementById("Username")
let T_Avatar = document.getElementById("avatar")
let T_Role = document.getElementById("Role")
let T_Rank = document.getElementById("RankImg")

T_Username.textContent = "שלום, " + UserData.Name;
T_Role.textContent = UserData.Position
T_Rank.src = `img/Rank${UserData.Rank}.png`

if (UserData.Rank > 4) {
    T_Rank.style.width = "22px"
    T_Rank.style.transform = `rotate(45deg)`;
}
else {
    T_Rank.style.width = "45px"
    T_Rank.style.transform = `rotate(-20deg)`;
}

fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${SteamApi}&steamids=${UserData.SteamId}`)
.then(response => response.text())
.then(data => {
     try {
        const parsedData = JSON.parse(data);
        const avatarUrl = parsedData.response.players[0].avatarfull;
        T_Avatar.src = avatarUrl;
        console.log(parsedData);
    } catch (error) {
        console.log("Error")
        T_Avatar.src = `img/def_img.png`
    }
})
.catch(error => console.error('שגיאה בקשת ה-API:', error));

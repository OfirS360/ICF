async function initializePage() {
    const SteamApi = `3E37434837BF21352A799F672E4062F1`;

    let UserData = sessionStorage.getItem("userData");
    UserData = JSON.parse(UserData);

    if (!UserData) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let SteamId = urlParams.get('openid.claimed_id');
        SteamId = SteamId.split('/').pop();
        SteamId = {
            SteamId: SteamId
        };

        await CheckIfUserExist(SteamId);
        await getSteamUser(SteamId.SteamId);

        location.reload(true);
    }

    // def_hp
    let T_Username = document.getElementById("Username");
    let T_Avatar = document.getElementById("avatar");
    let T_Role = document.getElementById("Role");
    let T_Rank = document.getElementById("RankImg");
    let B_Disconnect = document.getElementById("Disconnect");

    let SteamAvatar = sessionStorage.getItem("SteamAvatar");

    T_Username.textContent = "שלום, " + UserData.Name;
    T_Role.textContent = UserData.Position;
    T_Rank.src = `../img/Rank${UserData.Rank}.png`;

    if (SteamAvatar)
        T_Avatar.src = SteamAvatar;
    else
        T_Avatar.src = "../img/def_img.png";

    if (UserData.Rank > 4) {
        T_Rank.style.width = "22px";
        T_Rank.style.transform = `rotate(45deg)`;
    }
    else {
        T_Rank.style.width = "45px";
        T_Rank.style.transform = `rotate(-20deg)`;
    }

    B_Disconnect.onclick = () => {
        sessionStorage.clear();
        window.location.replace("https://icf.xitsraz.me/");
    };

    // המשך
    let I_Name = document.getElementById("InputName");
    let I_SteamId = document.getElementById("InputSteamId");
    let I_Age = document.getElementById("InputAge");
    let I_Rank = document.getElementById("InputRank");
    let I_Role = document.getElementById("InputRole");
    let I_Position = document.getElementById("InputPosition");
    let I_Status = document.getElementById("InputStatus");

    const RankInText = ["טוראי", "טוראי ראשון", "סמל", "סמל ראשון", "רב סמל", "רב סמל ראשון", "רב סמל מתקדם", "רב סמל בכיר", "רב נגד משנה", "רב נגד", "סגן משנה", "סגן", "סרן", "רב סרן", "סגן אלוף", "אלוף משנה"];

    I_Name.value = UserData.Name;
    I_SteamId.value = UserData.SteamId;
    I_Age.value = UserData.Age;
    I_Role.value = UserData.Role;
    I_Position.value = UserData.Position;
    I_Rank.value = RankInText[UserData.Rank - 1];

    if (UserData.Status) {
        I_Status.value = "פעיל";
    } else {
        I_Status.value = "לא פעיל";
    }

    // Close Events
    fetch(`https://icf-api-ten.vercel.app/GetCloseEvents`)
        .then(response => response.json())
        .then(data => {

            if (data.results && data.results.length > 0) {
                const CloseEvents = document.getElementById("CloseEvents");
                for (let i = 0; i < data.results.length; i++) {
                    let FixedDate = new Date(data.results[i].Date);

                    let CE_DivBox = document.createElement('div');
                    CE_DivBox.classList.add('CloseEventBox');

                    CloseEvents.appendChild(CE_DivBox);

                    let CE_Title = document.createElement('p');
                    CE_Title.classList.add('CE_Contex');
                    CE_Title.classList.add('CE_Title');
                    CE_Title.textContent = data.results[i].Title;

                    let CE_Descrition = document.createElement('p');
                    CE_Descrition.classList.add('CE_Contex');
                    CE_Descrition.textContent = "תיאור - " + data.results[i].Description;

                    let CE_Date = document.createElement('p');
                    CE_Date.classList.add('CE_Contex');
                    CE_Date.textContent = "תאריך - " + FixedDate.toLocaleDateString();

                    let CE_Time = document.createElement('p');
                    CE_Time.classList.add('CE_Contex');
                    CE_Time.textContent = "שעה - " + data.results[i].Time;

                    CE_DivBox.appendChild(CE_Title);
                    CE_DivBox.appendChild(CE_Descrition);
                    CE_DivBox.appendChild(CE_Date);
                    CE_DivBox.appendChild(CE_Time);
                }
            }
        })
        .catch(error => {
            console.error("שגיאה ב-API:", error);
        });
}

initializePage();

async function CheckIfUserExist(SteamId) {
    try {
        const response = await fetch("https://icf-api-ten.vercel.app/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },  
            body: JSON.stringify(SteamId)
        });

        const data = await response.json();
        
        if (data.success) {
            sessionStorage.setItem("userData", JSON.stringify(data.results));
            UserData = sessionStorage.getItem("userData")
        } else {
            alert("המשתמש לא קיים במערכת");
            window.location.replace("index.html");
        }
    } catch (error) {
        console.error("שגיאה בביצוע הבקשה:", error);
    }
}

async function getSteamUser(SteamId) {
    try {
        const response = await fetch(`https://icf-api-ten.vercel.app/getSteamUser/${SteamId}`);
        
        const data = await response.json();
        
        console.log(data);
        if (data.response.players.length > 0) {
            sessionStorage.setItem("SteamAvatar", data.response.players[0].avatarfull);
        }

    } catch (error) {
        console.error("API:", error);
    }
}
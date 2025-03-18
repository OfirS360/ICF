let EventsData = sessionStorage.getItem("Events")
if (EventsData) {
    try {
        EventsData = JSON.parse(EventsData);
    } catch (error) {
        EventsData = [];
    }
} 
else {
    EventsData = [];
}

const today = new Date();
const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

const Teams = ["מברג", "מכונה", "עקרב", "תלתן", "לביא", "לא מגיע"]
const TeamsKey = ["Mavreg", "Mechine", "Akrav", "Tiltan", "Lavie", "NotComing"]

let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

let TC_Title = document.getElementById("TC_Title")
const Content = document.getElementById("content")
const EventBox = document.getElementById("EventsBox")
const Calender = document.getElementById("calendar")
const DetailsBox = document.getElementById("Details")

const ForwardBtn = document.getElementById("Back")
const BackBtn = document.getElementById("Forward")

const EventName = document.getElementById("EventName")
const EventDescription = document.getElementById("EventDescription")

fetch(`https://icf-api-ten.vercel.app/GetAllEvents`)
    .then(response => response.json())
    .then(data => {

        if (data.results && data.results.length > 0) {
            sessionStorage.setItem("Events", JSON.stringify(data.results));
            EventsData = JSON.parse(sessionStorage.getItem("Events"));

            UpdateCalender();
        }
    })
    .catch(error => {
        console.error("Error fetching events:", error);
    });



if (UserData2.Premission_Level > 0)
{
    let AddEventBtn = document.createElement("button")
    AddEventBtn.classList.add("PlusBtn")
    AddEventBtn.textContent = "+"
    Content.appendChild(AddEventBtn)

    AddEventBtn.onclick = () => {
        window.location.href = "h_createevent.html";
    }
}

BackBtn.onclick = () => {
    month--
    if (month < 1) {
        month = 12
        year--
    }
    UpdateCalender()
}

ForwardBtn.onclick = () => {
    month++
    if (month > 12) {
        month = 1
        year++
    }
    UpdateCalender()
}

// מעדכן את הלוח שנה
function UpdateCalender() {
    let divdays = document.querySelectorAll('.c_contact')
    divdays.forEach(day => {
        day.remove()
    }) 
    TC_Title.textContent = months[month - 1] + ", " + year

    let days = generateMonthDays(year, month);
    let startday = new Date(year, month - 1, 1).getDay()
    let lastDay = new Date(year, month -1, days[days.length -1]).getDay()
    
    let firstdays = getLastDaysOfMonth(year, month - 1, startday)

    for (let i = 0; i < firstdays.length; i++) 
    {
        let newDiv = document.createElement('div')
        newDiv.classList.add('c_contact')
        newDiv.classList.add('c_dark')
        newDiv.textContent = firstdays[i]
        
        Calender.appendChild(newDiv)
    }
        
    for (let i = 0; i < days.length; i++) 
    {
        let newDiv = document.createElement('div')
        newDiv.classList.add('c_contact')
        newDiv.classList.add('c_btn')
        newDiv.id = days[i]
        newDiv.textContent = days[i]
            
        Calender.appendChild(newDiv)
    }
        
    for (let i = 0; i < 6 - lastDay; i++) 
    {
        let newDiv = document.createElement('div')
        newDiv.classList.add('c_contact')
        newDiv.classList.add('c_dark')
        newDiv.textContent = days[i]
            
        Calender.appendChild(newDiv)
    }

    let daysbnt = document.querySelectorAll('#calendar .c_btn')

    daysbnt.forEach(day => {
        day.addEventListener('click', function() {

            let LastDivPressed = document.querySelector('.currect_div')
            if (LastDivPressed)
                LastDivPressed.classList.remove('currect_div')
            LastDivPressed = this
            LastDivPressed.classList.add('currect_div')

            let Details = document.querySelectorAll(".D_Contex, .DS_Title, .Space, .YN_Box, .YN_Btn, .ProgressBar, .TeamImg")
            for (let i = 0; i < Details.length; i++) {
                if (!(Details[i].id === "EventDescription"))
                    Details[i].remove()
            }
       
            let CountEvents = 0

            for (let i = 0; i < EventsData.length; i++)
            {
                let CurrectEventDate = new Date(EventsData[i].Date)
                let EventDay = CurrectEventDate.getDate()
                let EventMonth = CurrectEventDate.getMonth()

                if(EventMonth == month - 1 && EventDay == this.id)
                {
                    CountEvents++

                    if (CountEvents > 1) {
                        let NewEventTitle = document.createElement("h1")
                        NewEventTitle.classList.add("D_Title")
                        NewEventTitle.classList.add("DS_Title")
                        NewEventTitle.textContent = EventsData[i].Title

                        let NewEventDescription = document.createElement("p")
                        NewEventDescription.classList.add("D_Contex")
                        NewEventDescription.innerHTML = '<span style="color: #09bfca; font-weight: 600; margin-left: 5px;">תיאור - </span> ' + EventsData[i].Description;

                        DetailsBox.appendChild(NewEventTitle)
                        DetailsBox.appendChild(NewEventDescription)
                    }
                    else {
                        EventName.textContent = EventsData[i].Title
                        EventDescription.innerHTML = '<span style="color: #09bfca; font-weight: 600; margin-left: 5px;">תיאור - </span> ' + EventsData[i].Description
                    }

                    let EventType = document.createElement("p")
                    EventType.classList.add('D_Contex')
                    EventType.innerHTML = '<span style="color: #09bfca; font-weight: 600; margin-left: 5px;">סוג האירוע - </span> ' + EventsData[i].EventType

                    let Creator = document.createElement("p")
                    Creator.classList.add('D_Contex')
                    Creator.innerHTML = '<span style="color: #09bfca; font-weight: 600; margin-left: 5px;">יוצר האירוע - </span> ' + EventsData[i].Creator

                    let Time = document.createElement("p")
                    Time.classList.add('D_Contex')
                    Time.innerHTML = '<span style="color: #09bfca; font-weight: 600; margin-left: 5px;">שעה - </span> ' +  EventsData[i].Time.slice(0, -3)

                    DetailsBox.appendChild(EventType)
                    DetailsBox.appendChild(Creator)
                    DetailsBox.appendChild(Time)

                    // Hitpakdut
                    let CurrectHitpakdut = JSON.parse(EventsData[i].Hitpakdut)
                    let HitpakdutKeys = Object.keys(CurrectHitpakdut)

                    
                    for (let j = 0; j < HitpakdutKeys.length; j++) {
                        let TeamLabel = document.createElement("p")
                        TeamLabel.classList.add('D_Contex')
                        TeamLabel.id = `TeamLable${EventsData[i].Id}${j}`

                        let Progress = document.createElement("progress")
                        Progress.classList.add("ProgressBar")
                        Progress.id = `Progress${EventsData[i].Id}${j}`
                        Progress.max = 100

                        DetailsBox.appendChild(TeamLabel)
                        DetailsBox.appendChild(Progress)
                    }

                    if (today.getTime() < CurrectEventDate.getTime())
                    {
                        let FirstEventKey =  HitpakdutKeys[0]
                        if (!(EventsData[i].EventType === "אימון צוותי" && FirstEventKey !== UserData2.Team))
                        {
                            let YN_Box = document.createElement("span")
                            YN_Box.classList.add("YN_Box")
                            
                            DetailsBox.appendChild(YN_Box)
        
                            let Y_Btn = document.createElement("button")
                            Y_Btn.classList.add("YN_Btn")
                            Y_Btn.textContent = "מגיע"
                            Y_Btn.addEventListener('click', function() {
                                HitpakdutBtn(true, EventsData[i].Id)
                            });                    
        
                            let N_Btn = document.createElement("button")
                            N_Btn.classList.add("YN_Btn")
                            N_Btn.textContent = "לא מגיע"
                            N_Btn.addEventListener('click', function() {
                                HitpakdutBtn(false, EventsData[i].Id)
                            });
        
                            YN_Box.appendChild(Y_Btn)
                            YN_Box.appendChild(N_Btn)
                        }    
                    }

                    let TotalActive = 0;

                    for (let j = 0; j < HitpakdutKeys.length; j++) {
                        let teamkey = HitpakdutKeys[j]
                        if (CurrectHitpakdut[teamkey].length > TotalActive)
                            TotalActive = CurrectHitpakdut[HitpakdutKeys[j]].length
                    }

                    console.log(HitpakdutKeys)

                    for (let j = 0; j < HitpakdutKeys.length; j++) {
                        let Progress = document.querySelector(`#Progress${EventsData[i].Id}${j}`);
                        let TeamLabel = document.querySelector(`#TeamLable${EventsData[i].Id}${j}`);

                        if (!(HitpakdutKeys[j] === "Coming" || HitpakdutKeys[j] === "NotComing")){
                            if (HitpakdutKeys.length == 2)
                                TeamLabel.innerHTML = `<img src="../img/${HitpakdutKeys[j]}.png" class="TeamImg" alt="">` + "מגיע" + " - " + CurrectHitpakdut[HitpakdutKeys[j]].length
                            else
                                TeamLabel.innerHTML = `<img src="../img/${HitpakdutKeys[j]}.png" class="TeamImg" alt="">` + Teams[j] + " - " + CurrectHitpakdut[HitpakdutKeys[j]].length

                        }
                        else {
                            if (HitpakdutKeys[j] === "NotComing")
                            {
                                console.log("לא מגיע")
                                TeamLabel.innerHTML = "לא מגיע - " + CurrectHitpakdut[HitpakdutKeys[j]].length
                            }
                            else {
                                TeamLabel.innerHTML = "מגיע - " + CurrectHitpakdut[HitpakdutKeys[j]].length
                            }
                        }


                        if (Progress && CurrectHitpakdut[HitpakdutKeys[j]].length != 0) {
                            Progress.value = 100.0 / TotalActive * CurrectHitpakdut[HitpakdutKeys[j]].length;
                        } else {
                            Progress.value = 0;
                        }
                    }
                }
            }

            if (CountEvents > 0) {
                let Space = document.createElement("div")
                Space.classList.add('Space')
                DetailsBox.appendChild(Space)
            }
            else {
                EventName.textContent = "פרטים"
                EventDescription.textContent = "אין אירוע ביום זה."
            }
        })
    })

    for (let i = 0; i < EventsData.length; i++) {
                
        let EventDate = new Date(EventsData[i].Date)
        let eventDay = EventDate.getDate();

        if (EventDate.getMonth() == month - 1)
        {
            let EventParent = document.getElementById(eventDay)
            let newDiv = document.createElement('div')
            newDiv.classList.add('Event')
            newDiv.textContent = EventsData[i].Title

            EventParent.appendChild(newDiv)
        }
    }
}

// כל הימים בחודש
function generateMonthDays(year, month) {
    const days = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    return days;
}

// הימים הראשונים בלוח
function getLastDaysOfMonth(year, month, daysCount) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const lastDays = [];

    for (let i = daysInMonth - daysCount + 1; i <= daysInMonth; i++) {
        lastDays.push(i);
    }

    return lastDays;
}

// מעדכן נתוני התפקדות
async function UpdateHitpakdut(EventId, HitpakdutData) {
    if (HitpakdutData == null) {
        try {
            const response = await fetch(`https://icf-api-ten.vercel.app/GetEventHitpakdut?EventId=${EventId}`);
            const data = await response.json();
            
            if (data.results) {
                HitpakdutData = data.results[0].Hitpakdut;
            } else {
                console.error("לא נמצאו נתוני התפקדות עבור EventId:", EventId);
                return;
            }
        } catch (error) {
            return;
        }
    }

    if (typeof HitpakdutData === "string") {
        HitpakdutData = JSON.parse(HitpakdutData);
    }

    for (let i = 0; i < EventsData.length; i++) {
        if (EventsData[i].Id == EventId) {
            EventsData[i].Hitpakdut = JSON.stringify(HitpakdutData)
            sessionStorage.setItem("Events", JSON.stringify(EventsData[EventId]));
        }
        
    }

    let TotalActive = 0;
    let HitpakdutKeys = Object.keys(HitpakdutData)


    for (let i = 0; i < Object.keys(HitpakdutData).length; i++) {
        if (HitpakdutData[HitpakdutKeys[i]].length > TotalActive)
        TotalActive = HitpakdutData[HitpakdutKeys[i]].length
    }
    
    if (TotalActive > 0) {
        for (let i = 0; i < Object.keys(HitpakdutData).length; i++) {
            let Progress = document.querySelector(`#Progress${EventId}${i}`);
            let TeamLabel = document.querySelector(`#TeamLable${EventId}${i}`);

            if (!(Object.keys(HitpakdutData)[i] === "Coming" || Object.keys(HitpakdutData)[i] === "NotComing"))
                if (HitpakdutKeys.length == 2)
                    TeamLabel.innerHTML = `<img src="../img/${HitpakdutKeys[i]}.png" class="TeamImg" alt="">` + "מגיע" + " - " + HitpakdutData[HitpakdutKeys[i]].length
                else
                TeamLabel.innerHTML = `<img src="../img/${HitpakdutKeys[i]}.png" class="TeamImg" alt="">` + Teams[i] + " - " + HitpakdutData[HitpakdutKeys[i]].length

            else {
                if (HitpakdutKeys[i] === "NotComing")
                    TeamLabel.innerHTML = "לא מגיע - " + HitpakdutData[HitpakdutKeys[i]].length
                else
                    TeamLabel.innerHTML = "מגיע - " + HitpakdutData[HitpakdutKeys[i]].length
            }
                


            if (Progress) {
                Progress.value = 100.0 / TotalActive * HitpakdutData[HitpakdutKeys[i]].length;
            } else {
                console.warn(`לא נמצא #Progress${EventId}${i}`);
            }
        }
    }
}


// לחיצה על כפתור התפקדות
function HitpakdutBtn(IsComing, Id) {
    let HitpakdutData = {
        Team: UserData2.Team,
        IsComing: IsComing,
        Id: Id,
        SteamId: UserData2.SteamId
    }

    fetch("https://icf-api-ten.vercel.app/UpdateHitpakdut", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(HitpakdutData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.results) {
            UpdateHitpakdut(Id, data.results);
        } else {
            console.warn("No updated Hitpakdut data received");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        console.log("Error submitting the form.");
    });
}
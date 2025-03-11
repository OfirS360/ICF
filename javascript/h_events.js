let EventsData = sessionStorage.getItem("Events")
EventsData = JSON.parse(EventsData)

const today = new Date();
const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

let TC_Title = document.getElementById("TC_Title")
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



if (UserData.Premission_Level > 0)
{
    let AddEventBtn = document.createElement("button")
    AddEventBtn.classList.add("PlusBtn")
    AddEventBtn.textContent = "+"
    DetailsBox.appendChild(AddEventBtn)

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
    if (month > 11) {
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

            let Details = document.querySelectorAll(".D_Contex, .DS_Title, .Space")
            for (let i = 0; i < Details.length; i++) {
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

                        DetailsBox.appendChild(NewEventTitle)
                    }
                    else {
                        EventName.textContent = EventsData[i].Title
                        EventDescription.textContent = "תיאור - " + EventsData[i].Description
                    }

                    let EventType = document.createElement("p")
                    EventType.classList.add('D_Contex')
                    EventType.textContent = "סוג האירוע - " + EventsData[i].EventType

                    let Creator = document.createElement("p")
                    Creator.classList.add('D_Contex')
                    Creator.textContent = "יוצר האירוע - " + EventsData[i].Creator

                    let Time = document.createElement("p")
                    Time.classList.add('D_Contex')
                    Time.textContent = "שעה - " + EventsData[i].Time

                    DetailsBox.appendChild(EventType)
                    DetailsBox.appendChild(Creator)
                    DetailsBox.appendChild(Time)
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
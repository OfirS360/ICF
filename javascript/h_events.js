const today = new Date();
const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

let TC_Title = document.getElementById("TC_Title")
const EventBox = document.getElementById("EventsBox")
const Calender = document.getElementById("calendar")

const ForwardBtn = document.getElementById("Back")
const BackBtn = document.getElementById("Forward")

UpdateCalender()

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
    console.log(month, " ", year)   
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
        if (i == 0)
            newDiv.classList.add('currect_div')
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
        })
    })

    let CurrectMonth = {year, month}

    fetch("https://icf-api-ten.vercel.app/GetCurrentMonthEvents", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(CurrectMonth)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data)
        } 
    })
    .catch(error => {

    })
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
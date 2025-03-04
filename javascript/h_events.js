const today = new Date();

let year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

let days = generateMonthDays(year, month);
let startday = new Date(year, month - 1, 1).getDay()
let lastDay = new Date(year, month -1, days[days.length -1]).getDay()
console.log(lastDay)

let firstdays = getLastDaysOfMonth(year, month - 1, startday)

const EventBox = document.getElementById("EventsBox")
const Calender = document.getElementById("calendar")

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
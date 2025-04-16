const AlertBox = document.getElementById("AlertBox")
const AlertTitle = document.getElementById("AlertTitle")
const AlertImg = document.getElementById("AlertImg")
const AlertDescription = document.getElementById("AlertDescription")
const Pics = ["x_mark", "v_mark"]

let IsRunning = false

function PopAlert(Title, IsGoodNum, Description) {

    if (!IsRunning) {
        IsRunning = true

        AlertBox.style.opacity = 1;
        AlertBox.style.zIndex = 100;
        AlertTitle.innerHTML = `${Title} <img id="AlertImg" src="../img/${Pics[IsGoodNum]}.png">`;
        AlertDescription.textContent = Description

        setTimeout(() => {
            AlertBox.style.opacity = 0;
            IsRunning = false
            AlertBox.style.zIndex = -1;
        }, 3000);
    }
}

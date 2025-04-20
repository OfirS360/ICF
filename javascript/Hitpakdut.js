initializePage()

async function initializePage() {
    let Buttons = document.querySelectorAll(".HitpkdutButton")
    Buttons.forEach((btn) => {
        AddBtnEventLisener(btn)
    })
}

function AddBtnEventLisener(btn) {
    btn.addEventListener("click", async () => {
        let UserCourses = JSON.parse(UserData2.Courses).Array

        let Pakal = btn.dataset.pakal;
        let SecondPakal = btn.dataset.secondPakal;

        if (UserCourses.includes(Pakal)) {
            if (SecondPakal) {
                if (UserCourses.includes(SecondPakal)) {
                    await Hitpakdut()
                }
            }
            else {
                await Hitpakdut()
            }
        }
        else {
            PopAlert("אין לך הסמכה", 0, "שים לב שאתה מתפקד לפקל שאתה מוסמך אילו, אם אתה כן מוסמך אילו תיצור קשר עם המפקד שלך.")
        }
    });
}

async function Hitpakdut() {
    console.log("Can Hitpakdut")
}
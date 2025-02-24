let sumbit = document.getElementById("submit");

sumbit.onclick = () => {
    let formData = {
        SteamId: document.getElementById("SteamId").value,
        Password: document.getElementById("Password").value
    };

    if (formData.SteamId == "" || formData.Password == "")
    {
        alert("לא כל הפרטים הוזנו");
        return;
    }

    fetch("http://localhost:3000/Login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem("userData", JSON.stringify(data.results))
            window.location.replace("homepage.html");
        }
        else {
            alert("קוד משתמש או סיסמא לא נכונים")
        }
        
    })
    .catch(error => {

    })
}
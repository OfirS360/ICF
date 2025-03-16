let sumbit = document.getElementById("submit");

sumbit.onclick = () => {

    fetch("https://icf-api-ten.vercel.app/profile", {
        method: "GET",
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("User not authenticated");
        }
        return response.json();
    })
    .then(data => {
        console.log("User Data:", data);
    })
    .catch(error => {
        console.log("Error:", error);
    });
}
    // let formData = {
    //     SteamId: document.getElementById("SteamId").value,
    //     Password: document.getElementById("Password").value
    // };

    // if (formData.SteamId == "" || formData.Password == "")
    // {
    //     alert("לא כל הפרטים הוזנו");
    //     return;
    // }

    // fetch("https://icf-api-ten.vercel.app/Login", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         sessionStorage.setItem("userData", JSON.stringify(data.results))
    //         window.location.replace("homepage.html");
    //     }
    //     else {
    //         alert("קוד משתמש או סיסמא לא נכונים")
    //     }
        
    // })
    // .catch(error => {

    // })

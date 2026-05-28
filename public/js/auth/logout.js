const btnLogout = document.getElementById("btn-logout");

btnLogout.addEventListener('click',async () => {

    await fetch("/autentication/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("user");
    window.location.href = "/"; 
});
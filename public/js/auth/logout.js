const logout = async () => {
    await fetch("/autentication/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("user");
    window.location.href = "/"; 
};
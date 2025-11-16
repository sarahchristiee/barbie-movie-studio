export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isLogged() {
  const user = getUser();
  return !!(user && user.token);
}

export function isAdmin() {
  const user = getUser();
  return user?.role === "admin";
}

export function login(userData) {
  localStorage.setItem("user", JSON.stringify(userData)); // salva token e role corretamente
  window.dispatchEvent(new Event("login")); // notifica o Header
}

export function logout() {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("logout")); // notifica o Header
}

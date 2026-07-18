document.addEventListener("DOMContentLoaded", () => {

  // SIGNUP
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        alert("Account Created Successfully!");
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }
    });
  }

  // LOGIN
  const loginForm = document.querySelector("form");

  if (loginForm && !signupForm) {

    loginForm.addEventListener("submit", async (e) => {

      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "index.html";
      } else {
        alert(data.message);
      }

    });

  }

});
console.log("script working");
document.getElementById("uploadBtn").onclick = async () => {
  const file = document.getElementById("movie").files[0];
if (!file) return alert("Please select a video first.");
const formData = new FormData();
formData.append("movie", file);
const res = await fetch("/upload", { method: "POST", body: formData });
alert(await res.text());
};

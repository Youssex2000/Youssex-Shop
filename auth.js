
/* ===== Remember Me (demo) =====
   Stores a simple flag + email in localStorage.
   If remembered, user is auto-redirected to home.html next visit.
*/
const REMEMBER_KEY = "ys_remember";
const REMEMBER_EMAIL = "ys_email";

(function rememberInit(){
  try{
    const remembered = localStorage.getItem(REMEMBER_KEY) === "1";
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL) || "";
    const emailEl = document.getElementById("loginEmail");
    const rememberEl = document.getElementById("rememberMe");

    if (emailEl && savedEmail) emailEl.value = savedEmail;
    if (rememberEl) rememberEl.checked = remembered;

    // Auto-enter (demo): if remembered, go straight to home
    if (remembered) {
      try {
  const rememberEl = document.getElementById("rememberMe");
  if (rememberEl && rememberEl.checked) {
    localStorage.setItem(REMEMBER_KEY, "1");
    localStorage.setItem(REMEMBER_EMAIL, loginEmail.value.trim());
  } else {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(REMEMBER_EMAIL);
  }
} catch (_) {}
window.location.href = "home.html";
    }
  }catch(_){}
})();

/* Page entrance animation trigger */
(function(){
  // Wait a tick so CSS can apply the starting state
  requestAnimationFrame(() => {
    document.body.classList.remove("preload");
    document.body.classList.add("ready");
  });
})();

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const tabs = $$(".tab");
const indicator = $(".tab-indicator");
const loginForm = $("#loginForm");
const signupForm = $("#signupForm");
const switchers = $$("[data-switch]");
const toggles = $$("[data-toggle-password]");

function setMode(mode){
  tabs.forEach(t => {
    const active = t.dataset.mode === mode;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", String(active));
  });
  indicator.style.transform = mode === "signup" ? "translateX(100%)" : "translateX(0%)";
  loginForm.classList.toggle("is-active", mode === "login");
  signupForm.classList.toggle("is-active", mode === "signup");
}

function setHint(inputEl, msg="", type="neutral"){
  const hint = document.querySelector(`[data-hint-for="${inputEl.id}"]`);
  if(!hint) return;
  hint.textContent = msg;
  hint.classList.remove("is-error","is-ok");
  if(type==="error") hint.classList.add("is-error");
  if(type==="ok") hint.classList.add("is-ok");
}

function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email).trim());
}
function isStrongPassword(pw){ return String(pw||"").trim().length >= 8; }
function passwordScore(pw){
  const s = String(pw||"");
  let score = 0;
  if(s.length >= 8) score++;
  if(/[A-Z]/.test(s)) score++;
  if(/[0-9]/.test(s)) score++;
  if(/[^A-Za-z0-9]/.test(s)) score++;
  return score;
}
function updateMeter(score){
  const bars = $$(".meter .bar");
  bars.forEach((b,i) => {
    b.style.background = i < score ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.10)";
    b.style.borderColor = i < score ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.08)";
  });
}

// Tab switching
tabs.forEach(t => t.addEventListener("click", () => setMode(t.dataset.mode)));
switchers.forEach(b => b.addEventListener("click", () => setMode(b.dataset.switch)));

// Show/Hide password
toggles.forEach(btn => {
  btn.addEventListener("click", () => {
    const input = btn.closest(".input-wrap")?.querySelector("input");
    if(!input) return;
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.setAttribute("aria-pressed", String(hidden));
    btn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
  });
});

// Live validation
const loginEmail = $("#loginEmail");
const loginPassword = $("#loginPassword");
loginEmail.addEventListener("input", () => {
  if(!loginEmail.value) return setHint(loginEmail,"");
  setHint(loginEmail, isValidEmail(loginEmail.value) ? "Looks good." : "Enter a valid email.", isValidEmail(loginEmail.value) ? "ok":"error");
});
loginPassword.addEventListener("input", () => {
  if(!loginPassword.value) return setHint(loginPassword,"");
  setHint(loginPassword, isStrongPassword(loginPassword.value) ? "OK." : "Min 8 characters.", isStrongPassword(loginPassword.value) ? "ok":"error");
});

const signupName = $("#signupName");
const signupEmail = $("#signupEmail");
const signupPassword = $("#signupPassword");
const signupConfirm = $("#signupConfirm");

signupName.addEventListener("input", () => {
  const v = signupName.value.trim();
  if(!v) return setHint(signupName,"");
  setHint(signupName, v.length>=2 ? "Nice." : "Name too short.", v.length>=2 ? "ok":"error");
});
signupEmail.addEventListener("input", () => {
  if(!signupEmail.value) return setHint(signupEmail,"");
  setHint(signupEmail, isValidEmail(signupEmail.value) ? "Email valid." : "Enter a valid email.", isValidEmail(signupEmail.value) ? "ok":"error");
});
signupPassword.addEventListener("input", () => {
  const v = signupPassword.value;
  if(!v){ setHint(signupPassword,""); updateMeter(0); return; }
  updateMeter(passwordScore(v));
  setHint(signupPassword, isStrongPassword(v) ? "Strong enough." : "Min 8 characters.", isStrongPassword(v) ? "ok":"error");
  if(signupConfirm.value){
    const match = signupConfirm.value === v;
    setHint(signupConfirm, match ? "Passwords match." : "Passwords do not match.", match ? "ok":"error");
  }
});
signupConfirm.addEventListener("input", () => {
  if(!signupConfirm.value) return setHint(signupConfirm,"");
  const match = signupConfirm.value === signupPassword.value;
  setHint(signupConfirm, match ? "Passwords match." : "Passwords do not match.", match ? "ok":"error");
});

// Submits (demo)
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  if(!isValidEmail(loginEmail.value)){ setHint(loginEmail,"Enter a valid email.","error"); ok=false; }
  if(!isStrongPassword(loginPassword.value)){ setHint(loginPassword,"Min 8 characters.","error"); ok=false; }
  if(ok) try {
  const rememberEl = document.getElementById("rememberMe");
  if (rememberEl && rememberEl.checked) {
    localStorage.setItem(REMEMBER_KEY, "1");
    localStorage.setItem(REMEMBER_EMAIL, loginEmail.value.trim());
  } else {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(REMEMBER_EMAIL);
  }
} catch (_) {}
window.location.href = "home.html";
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  if(signupName.value.trim().length<2){ setHint(signupName,"Enter your name.","error"); ok=false; }
  if(!isValidEmail(signupEmail.value)){ setHint(signupEmail,"Enter a valid email.","error"); ok=false; }
  if(!isStrongPassword(signupPassword.value)){ setHint(signupPassword,"Min 8 characters.","error"); ok=false; }
  if(signupConfirm.value !== signupPassword.value){ setHint(signupConfirm,"Passwords must match.","error"); ok=false; }
  if(ok){ setMode("login"); }
});

setMode("login");


// Clear saved login when user unchecks
try {
  const rememberEl = document.getElementById('rememberMe');
  rememberEl?.addEventListener('change', () => {
    if (!rememberEl.checked) {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(REMEMBER_EMAIL);
    }
  });
} catch (_) {}

/* ══ REGISTER.JS — 3 STEPS ════════════════════════════ */

var TOTAL = 3;
var current = 1;

var btnNext     = document.getElementById('btnNext');
var btnPrev     = document.getElementById('btnPrev');
var stepCounter = document.getElementById('stepCounter');

/* ── Auto-calculate age from birthday ─────────────── */
document.getElementById('birthday').addEventListener('change', function() {
  var dob = new Date(this.value);
  var today = new Date();
  var age = today.getFullYear() - dob.getFullYear();
  var m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  document.getElementById('age').value = age > 0 ? age : '';
});

/* ── SHOW STEP ────────────────────────────────────── */
function showStep(n) {
  document.querySelectorAll('.form-step').forEach(function(s) {
    s.classList.toggle('active', s.id === 'step' + n);
  });

  for (var i = 1; i <= TOTAL; i++) {
    var item   = document.getElementById('si' + i);
    var circle = item.querySelector('.step-circle');

    item.classList.toggle('active', i === n);
    item.classList.toggle('done',   i < n);
    circle.innerHTML = i < n
      ? '<i class="bi bi-check-lg" style="font-size:0.75rem;"></i>'
      : String(i);

    if (i < TOTAL)
      document.getElementById('sc' + i).classList.toggle('done', i < n);
  }

  stepCounter.textContent  = 'Step ' + n + ' of ' + TOTAL;
  btnPrev.style.visibility = n === 1 ? 'hidden' : 'visible';
  btnNext.innerHTML        = n === TOTAL
    ? '<i class="bi bi-check-lg"></i> Create Account'
    : 'Continue <i class="bi bi-arrow-right"></i>';
}

/* ── VALIDATION ───────────────────────────────────── */
var RULES = {
  email:           function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
  mobile:          function(v) { return /^09\d{9}$/.test(v); },
  username:        function(v) { return v.length >= 4; },
  password:        function(v) { return v.length >= 8; },
  confirmPassword: function(v) { return v === document.getElementById('password').value; }
};

function validateStep(n) {
  var valid  = true;
  var fields = document.getElementById('step' + n).querySelectorAll('[required]');

  fields.forEach(function(el) {
    el.classList.remove('is-invalid');
    var v = el.value.trim();

    if (!v) {
      el.classList.add('is-invalid');
      valid = false;
      return;
    }

    if (RULES[el.id] && !RULES[el.id](v)) {
      el.classList.add('is-invalid');
      if (el.id === 'confirmPassword')
        document.getElementById('confirmFeedback').textContent = 'Passwords do not match.';
      valid = false;
    }
  });

  return valid;
}

/* ── NAV BUTTONS ──────────────────────────────────── */
btnNext.addEventListener('click', function() {
  if (!validateStep(current)) return;
  if (current < TOTAL) {
    current++;
    showStep(current);
  } else {
    submitForm();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

btnPrev.addEventListener('click', function() {
  if (current > 1) {
    current--;
    showStep(current);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/* ── CLEAR INVALID ON INPUT ───────────────────────── */
document.querySelectorAll('.form-control, .form-select').forEach(function(el) {
  el.addEventListener('input',  function() { el.classList.remove('is-invalid'); });
  el.addEventListener('change', function() { el.classList.remove('is-invalid'); });
});

/* ── PASSWORD TOGGLE ──────────────────────────────── */
document.querySelectorAll('.pass-toggle').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var input = document.getElementById(btn.getAttribute('data-target'));
    var show  = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.querySelector('i').className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
  });
});

/* ── PASSWORD STRENGTH ────────────────────────────── */
var LEVELS = [
  { pct: '0%',   color: '#c8ddd2', label: 'Enter a password' },
  { pct: '25%',  color: '#e74c3c', label: 'Weak'   },
  { pct: '50%',  color: '#f39c12', label: 'Fair'   },
  { pct: '75%',  color: '#27ae60', label: 'Good'   },
  { pct: '100%', color: '#006647', label: 'Strong'  }
];

document.getElementById('password').addEventListener('input', function() {
  var v = this.value;
  var score = 0;
  if (v.length >= 8)          score++;
  if (/[A-Z]/.test(v))        score++;
  if (/[0-9]/.test(v))        score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;

  var lvl  = v ? (LEVELS[score] || LEVELS[1]) : LEVELS[0];
  var fill = document.getElementById('strengthFill');
  var text = document.getElementById('strengthText');

  fill.style.width      = lvl.pct;
  fill.style.background = lvl.color;
  text.textContent      = lvl.label;
  text.style.color      = score === 0 ? 'var(--muted)' : lvl.color;
});

/* ── SUBMIT ───────────────────────────────────────── */
function submitForm() {
  document.getElementById('step3').style.display        = 'none';
  document.getElementById('formNav').style.display      = 'none';
  document.getElementById('successPanel').style.display = 'block';

  for (var i = 1; i <= TOTAL; i++) {
    var item = document.getElementById('si' + i);
    item.classList.remove('active');
    item.classList.add('done');
    item.querySelector('.step-circle').innerHTML =
      '<i class="bi bi-check-lg" style="font-size:0.75rem;"></i>';
    if (i < TOTAL) document.getElementById('sc' + i).classList.add('done');
  }
}
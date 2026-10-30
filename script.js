// Shared site interactions
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    // Close menu when a link is clicked (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  // Contact form: save submissions to Supabase (contacts table)
  var form = document.querySelector('#contact-form');
  if (form) {
    var SUPA_URL = 'https://dtltpteynbpgiihmvrld.supabase.co';
    var SUPA_KEY = 'sb_publishable_21VzmgaKBixyJbyKyIdZ0g_rixXkwrX';

    // Web3Forms access key — paste the key from https://web3forms.com here.
    // Emails are sent to the address that key is registered with.
    var WEB3FORMS_KEY = '';

    // Email a notification about a new message (no-op until a key is set)
    function emailNotification(name, email, message) {
      if (!WEB3FORMS_KEY) return Promise.resolve();
      return fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New message from your website',
          from_name: 'Website contact form',
          name: name,
          email: email,
          message: message
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
        })
        .catch(function (err) {
          // The message is already saved; a failed email must not block the user
          console.error('Email notification failed:', err);
        });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl = form.querySelector('#name');
      var emailEl = form.querySelector('#email');
      var messageEl = form.querySelector('#message');
      var note = form.querySelector('.form-note');
      var submitBtn = form.querySelector('button[type="submit"]');

      var name = nameEl ? nameEl.value.trim() : '';
      var email = emailEl ? emailEl.value.trim() : '';
      var message = messageEl ? messageEl.value.trim() : '';

      // Basic validation (the form uses novalidate)
      if (!name || !email || !message) {
        if (note) {
          note.textContent = 'Please fill in your name, email, and message.';
          note.style.color = '#b71c1c';
        }
        return;
      }

      if (note) {
        note.textContent = 'Sending your message…';
        note.style.color = 'var(--ink-soft)';
      }
      if (submitBtn) submitBtn.disabled = true;

      fetch(SUPA_URL + '/rest/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + SUPA_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify([{ name: name, email: email, message: message }])
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          emailNotification(name, email, message);
          if (note) {
            note.textContent = "Thanks for reaching out! I'll get back to you soon. \u{1F337}";
            note.style.color = 'var(--coral-dark)';
          }
          form.reset();
        })
        .catch(function (err) {
          console.error('Contact form save failed:', err);
          if (note) {
            note.textContent = 'Sorry, your message could not be sent. Please try again.';
            note.style.color = '#b71c1c';
          }
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();

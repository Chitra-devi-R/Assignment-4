document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     LIVE DATE & TIME DISPLAY
     ========================================================= */
  function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    const timeStr = now.toLocaleTimeString('en-US');
    document.getElementById('dateTimeDisplay').textContent = dateStr + '  |  ' + timeStr;
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);

  /* =========================================================
     THEME SWITCHER — Light / Dark mode toggle
     Uses localStorage so the chosen theme is remembered
     the next time this page is opened.
     ========================================================= */

  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  const savedThemePref = localStorage.getItem('shopease_theme');
  if (savedThemePref === 'dark') {
    htmlRoot.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️ Light Mode';
  }

  themeToggle.addEventListener('click', () => {
    const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
    if (isDark) {
      htmlRoot.removeAttribute('data-theme');
      themeToggle.textContent = '🌙 Dark Mode';
      localStorage.setItem('shopease_theme', 'light');
    } else {
      htmlRoot.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️ Light Mode';
      localStorage.setItem('shopease_theme', 'dark');
    }
  });

  /* =========================================================
     REQUIREMENT 7: DRAG EVENTS — dragstart, dragover, drop
     ========================================================= */

  const productBoxes = document.querySelectorAll('.product-box');
  const cartDropArea = document.getElementById('cartDropArea');
  const cartCount = document.getElementById('cartCount');
  const cartMenuList = document.getElementById('cartMenuList');

  // Tracks how many of each product have been dropped, e.g. { "Shoes": 2 }
  const cartItems = {};

  function totalItemCount() {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  }

  // Re-renders both the drop area badges and the Cart Menu list from cartItems
  function renderCart() {
    const total = totalItemCount();
    cartCount.textContent = total;

    // ---- Drop area badges ----
    cartDropArea.innerHTML = '';
    if (total === 0) {
      cartDropArea.innerHTML = '<p id="cartPlaceholder">🛒 Drop items here</p>';
    } else {
      Object.keys(cartItems).forEach(name => {
        const badge = document.createElement('div');
        badge.className = 'dropped-item';
        badge.textContent = cartItems[name] > 1 ? `${name} x${cartItems[name]}` : name;
        cartDropArea.appendChild(badge);
      });
    }

    // ---- Cart Menu list ----
    cartMenuList.innerHTML = '';
    if (total === 0) {
      cartMenuList.innerHTML = '<li id="cartMenuEmpty" class="cart-menu-empty">No items yet</li>';
      return;
    }
    Object.keys(cartItems).forEach(name => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${name}</span><span class="cart-menu-qty">x${cartItems[name]}</span>`;
      cartMenuList.appendChild(li);
    });
  }

  // dragstart — fired on the DRAG SOURCE when the user starts dragging it
  productBoxes.forEach(box => {
    box.addEventListener('dragstart', (e) => {
      // Store which product is being dragged so the drop handler can read it
      e.dataTransfer.setData('text/plain', box.id);
      e.dataTransfer.effectAllowed = 'move';
      box.classList.add('dragging');
    });

    box.addEventListener('dragend', () => {
      box.classList.remove('dragging');
    });
  });

  // dragover — fired continuously while a dragged item is over the DROP TARGET.
  // preventDefault() is required here, otherwise the browser blocks the drop.
  cartDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    cartDropArea.classList.add('drag-over');
  });

  cartDropArea.addEventListener('dragleave', () => {
    cartDropArea.classList.remove('drag-over');
  });

  // drop — fired when the user releases the dragged item over the DROP TARGET
  cartDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    cartDropArea.classList.remove('drag-over');

    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedBox = document.getElementById(draggedId);
    if (!draggedBox) return;

    const itemName = draggedBox.textContent.trim();
    cartItems[itemName] = (cartItems[itemName] || 0) + 1;

    renderCart();
  });

  // Clear Cart — empties both the drop area and the Cart Menu list
  document.getElementById('clearCartBtn').addEventListener('click', () => {
    Object.keys(cartItems).forEach(key => delete cartItems[key]);
    renderCart();
  });

  // Render once on load so the empty state shows correctly
  renderCart();

  /* =========================================================
     REQUIREMENT 8 & 10: LOCAL STORAGE — save + retrieve (permanent)
     ========================================================= */

  const localNameInput = document.getElementById('localName');
  const localOutput = document.getElementById('localOutput');

  document.getElementById('saveLocalBtn').addEventListener('click', () => {
    const name = localNameInput.value.trim();
    if (!name) {
      localOutput.style.color = 'var(--danger)';
      localOutput.textContent = 'Please type a name before saving.';
      return;
    }
    localStorage.setItem('shopease_username', name);
    localOutput.style.color = 'var(--success)';
    localOutput.textContent = `Saved "${name}" to Local Storage.`;
    localNameInput.value = '';
  });

  document.getElementById('loadLocalBtn').addEventListener('click', () => {
    const saved = localStorage.getItem('shopease_username');
    localOutput.style.color = saved ? 'var(--success)' : 'var(--danger)';
    localOutput.textContent = saved
      ? `Retrieved from Local Storage: ${saved}`
      : 'No data found in Local Storage.';
  });

  /* =========================================================
     REQUIREMENT 11: CLEAR DATA — Local Storage
     ========================================================= */
  document.getElementById('clearLocalBtn').addEventListener('click', () => {
    localStorage.removeItem('shopease_username');
    localOutput.style.color = 'var(--danger)';
    localOutput.textContent = 'Local Storage cleared.';
  });

  /* =========================================================
     REQUIREMENT 9 & 10: SESSION STORAGE — save + retrieve (temporary)
     ========================================================= */

  const sessionNoteInput = document.getElementById('sessionNote');
  const sessionOutput = document.getElementById('sessionOutput');

  document.getElementById('saveSessionBtn').addEventListener('click', () => {
    const note = sessionNoteInput.value.trim();
    if (!note) {
      sessionOutput.style.color = 'var(--danger)';
      sessionOutput.textContent = 'Please type a note before saving.';
      return;
    }
    sessionStorage.setItem('shopease_session_note', note);
    sessionOutput.style.color = 'var(--success)';
    sessionOutput.textContent = `Saved "${note}" to Session Storage.`;
    sessionNoteInput.value = '';
  });

  document.getElementById('loadSessionBtn').addEventListener('click', () => {
    const saved = sessionStorage.getItem('shopease_session_note');
    sessionOutput.style.color = saved ? 'var(--success)' : 'var(--danger)';
    sessionOutput.textContent = saved
      ? `Retrieved from Session Storage: ${saved}`
      : 'No data found in Session Storage (or the tab was closed).';
  });

  /* =========================================================
     REQUIREMENT 11: CLEAR DATA — Session Storage
     ========================================================= */
  document.getElementById('clearSessionBtn').addEventListener('click', () => {
    sessionStorage.removeItem('shopease_session_note');
    sessionOutput.style.color = 'var(--danger)';
    sessionOutput.textContent = 'Session Storage cleared.';
  });

});

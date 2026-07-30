document.addEventListener('DOMContentLoaded', () => {

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
  const cartPlaceholder = document.getElementById('cartPlaceholder');
  const cartCount = document.getElementById('cartCount');
  let itemsInCart = 0;

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

    if (cartPlaceholder) cartPlaceholder.remove();

    const droppedItem = document.createElement('div');
    droppedItem.className = 'dropped-item';
    droppedItem.textContent = draggedBox.textContent;
    cartDropArea.appendChild(droppedItem);

    itemsInCart++;
    cartCount.textContent = itemsInCart;
  });

  document.getElementById('clearCartBtn').addEventListener('click', () => {
    cartDropArea.innerHTML = '<p id="cartPlaceholder">🛒 Drop items here</p>';
    itemsInCart = 0;
    cartCount.textContent = itemsInCart;
  });

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

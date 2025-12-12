// Quick Search Extension - v2.1
(function() {
  'use strict';
  
  const CSS = `
    #quick-search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      z-index: 999999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 20vh;
      animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .search-container {
      background: rgba(15, 15, 20, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 rgba(0, 0, 0, 0.5);
      width: 90%;
      max-width: 600px;
      overflow: hidden;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(60px) saturate(200%);
      -webkit-backdrop-filter: blur(60px) saturate(200%);
    }
    
    @keyframes slideIn {
      from { transform: translateY(-20px) scale(0.96); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    .search-input {
      width: 100%;
      padding: 22px 24px;
      border: none;
      outline: none;
      font-size: 17px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      box-sizing: border-box;
      color: #ffffff;
      transition: all 0.2s ease;
      backdrop-filter: blur(20px);
    }
    
    .search-input:focus {
      background: rgba(255, 255, 255, 0.12);
      border-bottom-color: rgba(255, 255, 255, 0.3);
    }
    
    .search-input::placeholder { color: rgba(255, 255, 255, 0.5); }
    
    .search-results {
      max-height: 420px;
      overflow-y: auto;
      background: rgba(255, 255, 255, 0.03);
    }
    
    .search-hint, .no-results {
      padding: 48px 24px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
    }
    
    .result-item {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      cursor: pointer;
      transition: all 0.15s ease;
      gap: 14px;
      border-left: 2px solid transparent;
    }
    
    .result-item:hover, .result-item.selected {
      background: rgba(255, 255, 255, 0.12);
      border-left-color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
    }
    
    .result-icon { font-size: 20px; opacity: 0.9; }
    .result-text { flex: 1; overflow: hidden; }
    .result-title {
      font-weight: 500;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 15px;
    }
    
    .search-results::-webkit-scrollbar { width: 6px; }
    .search-results::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    
    .highlight-match { font-weight: 600; }
  `;
  
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  
  let shiftPressed = false;
  let currentItems = [];
  
  function findElements() {
    const els = [];
    document.querySelectorAll('a[href]').forEach(link => {
      const text = link.innerText.trim();
      if (text && link.href && !link.href.startsWith('javascript:')) {
        els.push({ element: link, text: text, type: 'link', icon: '🔗' });
      }
    });
    document.querySelectorAll('button').forEach(btn => {
      const text = btn.innerText.trim() || btn.getAttribute('aria-label') || btn.title;
      if (text) {
        els.push({ element: btn, text: text, type: 'button', icon: '⚡' });
      }
    });
    document.querySelectorAll('input, textarea').forEach(inp => {
      const text = inp.placeholder || inp.name || inp.id || inp.getAttribute('aria-label');
      if (text) {
        els.push({ element: inp, text: text, type: 'input', icon: '✏️' });
      }
    });
    return els;
  }
  
  function navigateToElement(item) {
    hide();
    if (item.type === 'link') {
      item.element.click();
    } else if (item.type === 'button') {
      item.element.click();
    } else if (item.type === 'input') {
      item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => item.element.focus(), 300);
    }
  }
  
  function show() {
    if (document.getElementById('quick-search-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'quick-search-overlay';
    overlay.innerHTML = `
      <div class="search-container">
        <input type="text" class="search-input" placeholder="Search on this page...">
        <div class="search-results"><div class="search-hint">Type to search</div></div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    const input = overlay.querySelector('.search-input');
    const results = overlay.querySelector('.search-results');
    const allItems = findElements();
    
    setTimeout(() => input.focus(), 10);
    
    input.oninput = (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        results.innerHTML = '<div class="search-hint">Type to search</div>';
        currentItems = [];
        return;
      }
      
      const filtered = allItems.filter(i => i.text.toLowerCase().includes(query)).slice(0, 8);
      currentItems = filtered;
      
      if (!filtered.length) {
        results.innerHTML = '<div class="no-results">No results found</div>';
        return;
      }
      
      results.innerHTML = '';
      filtered.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.dataset.index = index;
        
        const highlightedText = item.text.replace(
          new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
          '<span class="highlight-match">$1</span>'
        );
        
        div.innerHTML = `
          <span class="result-icon">${item.icon}</span>
          <div class="result-text">
            <div class="result-title">${highlightedText}</div>
          </div>
        `;
        
        div.onclick = () => navigateToElement(item);
        div.onmouseenter = () => {
          results.querySelectorAll('.result-item').forEach(el => el.classList.remove('selected'));
          div.classList.add('selected');
        };
        
        results.appendChild(div);
      });
      
      const firstResult = results.querySelector('.result-item');
      if (firstResult) firstResult.classList.add('selected');
    };
    
    input.onkeydown = (e) => {
      const resultItems = results.querySelectorAll('.result-item');
      const selected = results.querySelector('.result-item.selected');
      
      if (e.key === 'Escape') {
        hide();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selected && currentItems.length > 0) {
          const index = parseInt(selected.dataset.index);
          navigateToElement(currentItems[index]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!selected && resultItems.length > 0) {
          resultItems[0].classList.add('selected');
        } else if (selected) {
          const currentIndex = Array.from(resultItems).indexOf(selected);
          selected.classList.remove('selected');
          const nextIndex = (currentIndex + 1) % resultItems.length;
          resultItems[nextIndex].classList.add('selected');
          resultItems[nextIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!selected && resultItems.length > 0) {
          resultItems[resultItems.length - 1].classList.add('selected');
        } else if (selected) {
          const currentIndex = Array.from(resultItems).indexOf(selected);
          selected.classList.remove('selected');
          const prevIndex = (currentIndex - 1 + resultItems.length) % resultItems.length;
          resultItems[prevIndex].classList.add('selected');
          resultItems[prevIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    };
    
    overlay.onclick = (e) => {
      if (!e.target.closest('.search-container')) hide();
    };
  }
  
  function hide() {
    const overlay = document.getElementById('quick-search-overlay');
    if (overlay) overlay.remove();
    currentItems = [];
  }
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Shift') shiftPressed = true;
    if (shiftPressed && e.key === ':') {
      e.preventDefault();
      show();
    }
  });
  
  document.addEventListener('keyup', e => {
    if (e.key === 'Shift') shiftPressed = false;
  });
})();

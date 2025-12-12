// Inject CSS styles
const style = document.createElement('style');
style.textContent = `
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
  background: rgba(20, 20, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
  overflow: hidden;
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
}

@keyframes slideIn {
  from { 
    transform: translateY(-20px) scale(0.96); 
    opacity: 0;
  }
  to { 
    transform: translateY(0) scale(1); 
    opacity: 1;
  }
}

.search-input {
  width: 100%;
  padding: 22px 24px;
  border: none;
  outline: none;
  font-size: 17px;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  color: #ffffff;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-bottom-color: rgba(255, 255, 255, 0.25);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-results {
  max-height: 420px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.02);
}

.search-hint {
  padding: 48px 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  gap: 14px;
  border-left: 2px solid transparent;
  background: transparent;
}

.result-item:hover,
.result-item.selected {
  background: rgba(255, 255, 255, 0.08);
  border-left-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
}

.result-icon {
  font-size: 20px;
  flex-shrink: 0;
  opacity: 0.9;
}

.result-text {
  flex: 1;
  overflow: hidden;
}

.result-title {
  font-weight: 500;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  letter-spacing: -0.01em;
}

.no-results {
  padding: 48px 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.highlight-match {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}
`;
document.head.appendChild(style);

// Track state
let shiftPressed = false;
let searchOverlay = null;
let searchInput = null;
let resultsContainer = null;
let searchableElements = [];
let filteredResults = [];

// Find all clickable elements on the page
function findClickableElements() {
  const elements = [];
  
  // Links
  document.querySelectorAll('a[href]').forEach(link => {
    const text = link.innerText.trim();
    const href = link.href;
    if (text && href && !href.startsWith('javascript:')) {
      elements.push({
        element: link,
        text: text,
        type: 'link',
        icon: '🔗'
      });
    }
  });
  
  // Buttons
  document.querySelectorAll('button').forEach(button => {
    const text = button.innerText.trim() || button.getAttribute('aria-label') || button.title;
    if (text) {
      elements.push({
        element: button,
        text: text,
        type: 'button',
        icon: '⚡'
      });
    }
  });
  
  // Inputs
  document.querySelectorAll('input, textarea').forEach(input => {
    const text = input.placeholder || input.name || input.id || input.getAttribute('aria-label');
    if (text) {
      elements.push({
        element: input,
        text: text,
        type: 'input',
        icon: '✏️'
      });
    }
  });
  
  return elements;
}

// Create the search overlay
function createSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'quick-search-overlay';
  
  const container = document.createElement('div');
  container.className = 'search-container';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.placeholder = 'Search on this page...';
  
  const results = document.createElement('div');
  results.className = 'search-results';
  results.innerHTML = '<div class="search-hint">Type to search</div>';
  
  container.appendChild(input);
  container.appendChild(results);
  overlay.appendChild(container);
  
  document.body.appendChild(overlay);
  
  searchOverlay = overlay;
  searchInput = input;
  resultsContainer = results;
  
  // Get all clickable elements
  searchableElements = findClickableElements();
  
  // Focus the input
  setTimeout(() => input.focus(), 10);
  
  // Add event listeners
  input.addEventListener('input', handleSearchInput);
  input.addEventListener('keydown', handleKeyNavigation);
}

// Highlight matching text
function highlightText(text, query) {
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="highlight-match">$1</span>');
}

// Handle search input
function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  
  if (!query) {
    resultsContainer.innerHTML = '<div class="search-hint">Type to search</div>';
    filteredResults = [];
    return;
  }
  
  // Filter elements based on query
  filteredResults = searchableElements.filter(item => 
    item.text.toLowerCase().includes(query)
  );
  
  if (filteredResults.length === 0) {
    resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
    return;
  }
  
  // Display results
  resultsContainer.innerHTML = '';
  
  filteredResults.slice(0, 8).forEach((item, index) => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.dataset.index = index;
    
    const highlightedText = highlightText(item.text, query);
    
    resultItem.innerHTML = `
      <span class="result-icon">${item.icon}</span>
      <div class="result-text">
        <div class="result-title">${highlightedText}</div>
      </div>
    `;
    
    resultItem.addEventListener('click', () => navigateToElement(item));
    resultItem.addEventListener('mouseenter', () => {
      document.querySelectorAll('.result-item').forEach(el => el.classList.remove('selected'));
      resultItem.classList.add('selected');
    });
    
    resultsContainer.appendChild(resultItem);
  });
  
  // Select first result
  const firstResult = resultsContainer.querySelector('.result-item');
  if (firstResult) firstResult.classList.add('selected');
}

// Handle keyboard navigation
function handleKeyNavigation(e) {
  const results = resultsContainer.querySelectorAll('.result-item');
  const selected = resultsContainer.querySelector('.result-item.selected');
  
  if (e.key === 'Enter') {
    e.preventDefault();
    if (selected && filteredResults.length > 0) {
      const index = parseInt(selected.dataset.index);
      navigateToElement(filteredResults[index]);
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!selected && results.length > 0) {
      results[0].classList.add('selected');
    } else if (selected) {
      const currentIndex = Array.from(results).indexOf(selected);
      selected.classList.remove('selected');
      const nextIndex = (currentIndex + 1) % results.length;
      results[nextIndex].classList.add('selected');
      results[nextIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!selected && results.length > 0) {
      results[results.length - 1].classList.add('selected');
    } else if (selected) {
      const currentIndex = Array.from(results).indexOf(selected);
      selected.classList.remove('selected');
      const prevIndex = (currentIndex - 1 + results.length) % results.length;
      results[prevIndex].classList.add('selected');
      results[prevIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  } else if (e.key === 'Escape') {
    closeSearchOverlay();
  }
}

// Navigate to selected element
function navigateToElement(item) {
  closeSearchOverlay();
  
  if (item.type === 'link') {
    item.element.click();
  } else if (item.type === 'button') {
    item.element.click();
  } else if (item.type === 'input') {
    item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => item.element.focus(), 300);
  }
}

// Close overlay
function closeSearchOverlay() {
  if (searchOverlay) {
    searchOverlay.style.animation = 'fadeOut 0.15s ease';
    setTimeout(() => {
      searchOverlay.remove();
      searchOverlay = null;
      searchInput = null;
      resultsContainer = null;
      searchableElements = [];
      filteredResults = [];
    }, 150);
  }
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
`;
document.head.appendChild(fadeOutStyle);

// Keyboard event listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') {
    shiftPressed = true;
  }
  
  // Shift + :
  if (shiftPressed && e.key === ':') {
    e.preventDefault();
    
    if (!searchOverlay) {
      createSearchOverlay();
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') {
    shiftPressed = false;
  }
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (searchOverlay && !e.target.closest('.search-container')) {
    closeSearchOverlay();
  }
});

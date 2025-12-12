# QuickNav - Lightning-Fast Page Navigation ⚡

> Navigate any webpage with keyboard shortcuts. Search and jump to links, buttons, and inputs instantly without touching your mouse.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

- 🔍 **Instant Search** - Find any clickable element on the page in milliseconds
- ⌨️ **Keyboard Navigation** - Navigate with arrow keys and Enter
- 🎨 **Beautiful UI** - Clean, glassmorphic design that looks amazing
- 🚀 **Lightning Fast** - No lag, no delays, just instant results
- 🌐 **Works Everywhere** - YouTube, GitHub, Reddit, Twitter, and any website
- 💡 **Smart Detection** - Finds links, buttons, inputs, and more

## 🎬 Demo

Press `Shift + :` on any webpage → Type to search → Press `Enter` to navigate

Perfect for:
- Navigating YouTube videos without clicking
- Finding buttons on complex web apps
- Jumping to links quickly
- Accessing form inputs instantly

## 🚀 Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quicknav.git
   cd quicknav
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer Mode** (toggle in top-right)
   - Click **Load unpacked**
   - Select the `quicknav` folder

3. **Start using it!**
   - Go to any website
   - Press `Shift + :`
   - Start searching!

## 📖 Usage

### Basic Usage

1. **Open Search**: Press `Shift + :` (Shift + Colon)
2. **Type**: Start typing to filter results
3. **Navigate**: Use `↑` `↓` arrow keys or hover with mouse
4. **Select**: Press `Enter` or click to navigate
5. **Close**: Press `Escape` or click outside

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift + :` | Open search overlay |
| `↓` | Move to next result |
| `↑` | Move to previous result |
| `Enter` | Navigate to selected item |
| `Escape` | Close search overlay |

### What Can You Search?

- 🔗 **Links** - All clickable links on the page
- ⚡ **Buttons** - Submit buttons, navigation buttons, icon buttons
- ✏️ **Inputs** - Text fields, search boxes, textareas

## 🎨 Customization

### Change the Shortcut

Edit `content.js` line 306:

```javascript
// Change from Shift + : to your preferred shortcut
if (shiftPressed && e.key === ':') {
  // Replace ':' with any key like '/', 'k', etc.
```

### Customize Appearance

All styles are in the `CSS` constant at the top of `content.js`. You can modify:
- Colors
- Blur effects
- Border radius
- Animations
- And more!



## 🐛 Troubleshooting

### Extension Not Working?

1. **Refresh the page** - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. **Reload extension** - Go to `chrome://extensions/` and click the refresh icon
3. **Check permissions** - Make sure the extension has permission for the site

### Shortcut Not Working?

- Make sure you're pressing `Shift` first, then `:`
- Check if another extension is using the same shortcut
- Try on a different website to rule out site-specific issues

### Not Finding Elements?

Some websites use shadow DOM or custom elements. The extension works best on standard HTML elements.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contribution

- [ ] Add fuzzy search
- [ ] Custom keyboard shortcuts
- [ ] Dark/light theme toggle
- [ ] Search history
- [ ] Exclude certain websites
- [ ] i18n support

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- Inspired by Vim's command palette and macOS Spotlight
- Built with modern web technologies
- Icons generated with custom HTML5 Canvas

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/quicknav?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/quicknav?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/quicknav)

---

⭐ **Star this repo if you find it useful!** ⭐

Made with ❤️ by developers, for developers

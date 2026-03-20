# Project Rules: doggy_friend (校园小情书)

## Tech Stack
- **Framework:** Native WeChat Mini Program (WXML, WXSS, JS, JSON).
- **Backend API:** Custom RESTful API configured in `config.js` (e.g., `love.qiuhuiyi.cn/api/wechat`).
- **Storage/Images:** Qiniu Cloud (七牛云) for image uploads and hosting (`utils/qiniuUploader.js`).
- **Map/Location:** Tencent Maps SDK (`utils/qqmap-wx-jssdk.js`).

## Architecture & Directory Structure
- `/pages`: Contains all page-level components. Organized by feature (e.g., `/home`, `/sale`, `/travel`, `/personal`). Each page must have `.wxml`, `.wxss`, `.js`, and `.json` files.
- `/components`: Contains reusable custom components (e.g., `upload`, `star`, `get-more-loading`).
- `/image`: Static image assets (icons, placeholders).
- `/utils`: Utility scripts for API requests, uploads, maps, and common functions.
- `app.js` / `app.json` / `app.wxss`: Global application entry point, configuration, and styles.
- `config.js`: Environment-specific variables (API domain, Qiniu domain, keys).

## Coding Standards

### JavaScript
- **Syntax:** Use ES6+ syntax (`let`, `const`, arrow functions).
- **State Management:** 
  - Local state: Always use `this.setData()` to mutate page data to trigger view updates.
  - Global state: Store application-wide variables in `app.globalData` (e.g., user authentication status). Access via `const app = getApp();`.
- **Network Requests:** 
  - **MANDATORY:** ALWAYS use the custom wrapper from `utils/http.js` (e.g., `http.get()`, `http.post()`).
  - Do not use `wx.request` directly in pages. The wrapper handles injecting the `Authorization` header (`Bearer + token`) and app codes.
- **Authentication:** The token is stored in `wx.getStorageSync('token')`. If a request fails with error code `5000`, the user will be redirected to the auth/personal page.

### WXML & WXSS
- **Classes:** Use semantic and readable class names. Avoid deeply nested WXSS selectors.
- **Layout:** Prefer flexbox (`display: flex`) for layout.
- **Rendering:** Keep WXML clean. Use `<block wx:if="...">` or `wx:elif` for conditional rendering to avoid unnecessary DOM nodes. Use `wx:for` for lists and always provide a `wx:key`.

### Adding New Pages or Components
1. Create the folder under `/pages/` or `/components/`.
2. Generate the 4 standard files (`.js`, `.json`, `.wxml`, `.wxss`).
3. For pages, register the path in the `pages` array of `app.json`.
4. For components, set `"component": true` in the `.json` file, and declare it in the `usingComponents` object of any page that uses it.

### Asset Management
- Small UI icons should be stored locally in the `/image/v2/` directory.
- User-generated content (e.g., photos for the confession wall or sale posts) must be uploaded to Qiniu Cloud using `utils/uploadImage.js` or `utils/qiniuUploader.js`.

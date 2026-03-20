# Project Architecture & Setup Guide

## Overview
"doggy_friend" (校园小情书) is a WeChat Mini Program built with the native WeChat framework. It functions as a campus social platform.

## Core Features
1. **表白墙 (Confession Wall):** Users can post anonymous or public messages, comments, and likes.
2. **卖舍友 (Sell Roommates):** A humorous feature to introduce single friends to the community.
3. **步数旅行 (Step Count Travel):** Integrates with WeChat run data to simulate travel.
4. **情侣脸 (Couple Face):** Uses facial recognition/comparison APIs.
5. **我的 (Personal Center):** Manages user profile, follow lists, incoming letters, and system messages.

## Data Flow
- **State Management:** Data is managed at the Page level using `this.setData()`. Global data (like login status, user info) is cached in `wx.getStorageSync` and memory via `app.globalData`.
- **API Calls:** 
  - All external requests route through `utils/http.js`.
  - The wrapper automatically appends the `Authorization` token and the `app_code` from `config.js`.
  - Typical response structure involves `error_code`, `error_message`, and `data`. `error_code == '5000'` triggers a token refresh/re-login flow.

## External Services
- **Backend Service:** A PHP/Laravel backend hosted on `love.qiuhuiyi.cn`.
- **Qiniu Cloud:** Handles user uploads. Tokens are fetched from the backend (`utils/qiniuToken.js`), and images are uploaded directly to Qiniu via `utils/qiniuUploader.js`.
- **Tencent Maps:** Used for location-based features and distance calculation (configured with `TX_MAP_KEY`).

## Setup & Compilation
1. Import the project folder into **WeChat Developer Tools**.
2. Configure your specific backend endpoint and `alianceKey` in `config.js`.
3. Set your Tencent Maps Developer ID in `config.js`.
4. Run "Clear Cache" -> "Compile" to start the development server.

## Troubleshooting Common Issues
- **Token Errors (`5000`):** Ensure `config.alianceKey` matches your backend setup. The system will automatically attempt to redirect to the personal page for re-authorization.
- **Image Upload Failures:** Check if the Qiniu domain in `config.js` is correct and ensure the upload domains are added to the WeChat Mini Program's "uploadFile合法域名" list.

# RSS Reader

[![.github/workflows/ci.yml](https://github.com/olgarozmetova/frontend-project-11/actions/workflows/ci.yml/badge.svg)](https://github.com/olgarozmetova/frontend-project-11/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=olgarozmetova_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=olgarozmetova_frontend-project-11)

### Hexlet tests and linter status:

[![Actions Status](https://github.com/olgarozmetova/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/olgarozmetova/frontend-project-11/actions)

## Description

A web application that accepts a link to RSS feeds, loads them, displays a list of feeds and posts, and allows you to read them through a modal window.

### 🚀 Features

✨ Users can add any valid RSS feed URL

⏱️ Every 5 seconds, the application checks all added feeds

🆕 New posts are detected and added automatically

📖 When a post is opened (previewed), it becomes read

💾 Read posts are stored in application state

👁️ Modal Preview opens a modal displaying title, description, link

🌍 Internationalization: Interface localized with i18next

⚠️ Validation: displays messages for invalid url, network errors, non-RSS formats

### ⚙️ Technologies

JavaScript (project was developed using the Model—View—Controller pattern)

Vite - build tool

i18next - localization

Yup - validation

On-change - watcher for changes (view)

Axios — HTTP requests

Bootstrap — UI styles & modal component

DOMParser — XML parsing

## 🔧 Installation and Setup

```bash
git clone https://github.com/olgarozmetova/frontend-project-11.git
cd frontend-project-11

make install
```

### Link to app:

https://frontend-project-11-pi-seven.vercel.app

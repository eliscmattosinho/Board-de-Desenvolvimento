# Development Hub

![Banner 1](src/assets/readme/first-banner.png)

## Project Description

**Development Hub** is a flexible, front-end task management tool for organizing project workflows. Users can create custom boards and manage tasks using **Scrum** or **Kanban** methodologies.

### Features

- Create boards with multiple columns and cards
- Switch between Scrum and Kanban views
- Session-based persistence using browser cache (data cleared on reload)
- Intuitive interface for visualizing project progress
- Quick setup without a backend

⚠️ **Note:** This project is currently under development. Some features may not be fully implemented yet.

### References

- Notion case (base): [Development Hub | Notion](https://eliscmattosinho.notion.site/Ecossistema-de-leitura-digital-15432edc5fc5805a8ecfe3447f2d3d0b)

## Screenshots & Demos

- Project showcase on Behance: [Development Hub | Behance](https://www.behance.net/gallery/231328777/Development-Hub)
- Live demo: [Access Here](https://eliscmattosinho.github.io/development-hub/)

<br />

## Technologies Used

- **React** 19
- **React Router Dom** 7
- **React Icons**
- **React Toastify**
- **React Transition Group**
- **JavaScript (ES6+)**
- **CSS3**
- **GitHub Pages** (deployment)
- **Vite** (build tool)

## Deployment

The project is deployed via GitHub Pages. To deploy manually:

```bash
# Build the project
npm run build

# Copy index.html to 404.html for GitHub Pages
cp dist/index.html dist/404.html

# Deploy using gh-pages
npm run deploy
```

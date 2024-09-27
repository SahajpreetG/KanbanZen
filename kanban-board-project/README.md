## KanbanZen
KanbanZen is a sleek, intuitive, and modern Kanban-style task management application designed to streamline your workflow and enhance productivity. Inspired by industry-leading tools like Trello, KanbanZen offers a feature-rich platform where users can create, organize, and prioritize tasks with ease. With real-time updates, drag-and-drop functionality, and a focus on user experience, KanbanZen is the perfect tool for individuals and teams looking to optimize their task management process.

## Table of Contents
- Features
- Screenshots
- Tech Stack
- Getting Started
- Project Structure
- Contributing
- License
- Contact


## Features
- User Authentication: Secure OAuth2 authentication using Google accounts via Appwrite.
- Personalized Boards: Each user has their own Kanban board with columns for To Do, In Progress, and Done.
- Drag-and-Drop Interface: Intuitive drag-and-drop functionality to move tasks between columns.
- Task Management:
    1. Create, Edit, and Delete Tasks: Full CRUD operations for managing tasks.
    2. Due Dates: Assign due dates to tasks with automatic overdue detection.
    3. Priority Levels: Set task priority to Low, Medium, or High.
    4. 0Auth authentication: User authentication powered by Google.
- Image Attachments: Upload and attach images to tasks.
- Real-time Updates: Instantaneous UI updates without the need to refresh the page.
- Responsive Design: Mobile-first design approach ensuring optimal user experience across devices.
- Search Functionality: Quickly search tasks by title.
- Alerts and Notifications: Visual alerts for successful operations and overdue tasks.
- Screenshots
Note: Screenshots are not included in this text-based format. Please refer to the repository or the live demo for visuals showcasing the application's interface and features.

## Tech Stack
- Frontend:
    Next.js (React Framework)
    TypeScript
    Tailwind CSS
    React DnD for drag-and-drop functionality
- State Management:
    Zustand for efficient and scalable state management
- Backend:
    Appwrite for authentication, database, and storage
- Cloud Services:
    AWS S3 for image hosting
    Getting Started
    To get a local copy up and running, follow these simple steps.

## Prerequisites
1. Node.js (v14.x or newer)
2. npm or Yarn
3. Appwrite instance (self-hosted or managed)
4. AWS Account (for hosting)

## Installation
Clone the repository:

```bash
git clone https://github.com/yourusername/KanbanZen.git
cd KanbanZen
```
## Install dependencies

```bash
npm install
# or
yarn install
```
## Set up environment variables

Create a .env.local file in the root directory and add the following environment variables:

- NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
- NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
- NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
- NEXT_PUBLIC_TODOS_COLLECTION_ID=your_todos_collection_id
- NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_appwrite_bucket_id
- OPENAI_API_KEY=your_openai_api_key
Replace the placeholders with your actual Appwrite configuration details.

Run the development server:

```bash
npm run dev
# or
yarn dev
```
## Open http://localhost:3000 to view it in the browser.

## Project Structure

```
kanbanzen/
├─ .eslintrc.json
├─ .gitignore
├─ .vscode
│  └─ extensions.json
├─ app
│  ├─ (authenticated)
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ api
│  │  └─ generateSummary
│  │     └─ route.ts
│  ├─ callback
│  │  └─ page.tsx
│  ├─ fail
│  │  └─ page.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ login
│     └─ page.tsx
├─ appwrite.ts
├─ components          
│  ├─ Alert.tsx
│  ├─ Board.tsx
│  ├─ Column.tsx
│  ├─ dynamicLayout.tsx
│  ├─ editModal.tsx
│  ├─ Header.tsx
│  ├─ Login.tsx
│  ├─ LogoutButton.tsx
│  ├─ Modal.tsx
│  ├─ TaskTypeRadioGroup.tsx
│  └─ TodoCard.tsx
├─ lib                
│  ├─ fetchSuggestion.ts
│  ├─ formatTodosForAI.ts
│  ├─ getTodosGroupedByColumn.ts
│  ├─ getURL.ts
│  └─ uploadImage.ts
├─ next.config.mjs
├─ openai.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ store
│  ├─ AlertStore.ts
│  ├─ BoardStore.ts
│  ├─ EditModalStore.ts
│  └─ ModalStore.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ typings.d.ts

```
## Contributing
Contributions are what make the open-source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

## Fork the Project.
Create your Feature Branch: 
```bash
 git checkout -b feature/AmazingFeature.
```
Commit your Changes: 
```bash
git commit -m 'Add some AmazingFeature'
```
Push to the Branch: 
```bash 
git push origin feature/AmazingFeature
```
Open a Pull Request.

## License
Distributed under the MIT License. See LICENSE for more information.

## Contact me
Author: Sahajpreet Gulati
Email: sahaj.preet@outlook.com
LinkedIn: [linkedin.com/in/y](https://www.linkedin.com/in/sahajpreet-gulati/)
GitHub: [github.com/yourusername](https://github.com/SahajpreetG)
Thank you for checking out KanbanZen! If you have any questions, suggestions, or feedback, please feel free to reach out. Your contributions and insights are highly valued.







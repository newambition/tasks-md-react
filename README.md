<div align="center">

<img src="https://raw.githubusercontent.com/newambition/tasks-md-react/main/public/TaskMDProIcon.png" alt="TaskMD Pro Logo" width="150"/>

# 🎨 TaskMD Pro 🖍️

**Transform Your Markdown. Master Your Tasks.**

<br />

A fun, cartoon-styled Kanban board that brings your Markdown task lists to life!

<br />

<p>
  <a href="https://github.com/newambition/tasks-md-react/issues"><strong>Report a Bug »</strong></a>
  ·
  <a href="https://github.com/newambition/tasks-md-react/issues"><strong>Request a Feature »</strong></a>
</p>

<p>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/React-19.1.0-blue.svg?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/tailwindcss-3.4.17-blue.svg?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>
</div>

---

## ✨ About The Project

**TaskMD Pro** is for everyone who loves the simplicity of Markdown but craves the visual power of a Kanban board. Ditch the boring text files and watch your tasks pop into an interactive, drag-and-drop world with a playful cartoon theme.

Simply write your tasks in a `.md` file, load it up, and get organizing! Export back into a `.md` file at any time, giving you full control.

<br>

<div align="center">
  <img src="https://raw.githubusercontent.com/newambition/tasks-md-react/main/public/app-screenshot.png" alt="TaskMD Pro Screenshot" width="700"/>
</div>

### Built With

This project is built with a modern, front-end stack that you already know and love:

- [![React][React.js]][React-url]
- [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]
- Framer Motion
- dnd-kit

---

## 🚀 Getting Started

Ready to get your own local copy running? Just follow these simple steps.

### Prerequisites

Make sure you have `npm` installed on your machine.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/newambition/tasks-md-react.git](https://github.com/newambition/tasks-md-react.git)
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Start the magic!**
    ```sh
    npm start
    ```

---

## Usage

TaskMD Pro understands a special flavor of Markdown to build your boards.

### The Magic Words (Markdown Format)

- `# Space Name` become the titles of your Spaces.
- `## Phase Name` become the names of boards within spaces
- `- [ ] Your task here` is a new task.
- `- [x] Your completed task` is a finished task.
- Add a due date with `(DD-MM-YY)`.
- Add colorful labels with `[labelName]` or `[labelName(#hexcolor)]`.

**For example:**

```markdown
# My Awesome Project

## ✏️ To Do

- [ ] Design the new logo [design]
- [ ] Write the documentation (28-06-25)

## 🚧 In Progress

- [ ] Develop the main feature [coding(#ff6b6b)]

## ✅ Done

- [x] Plan the project structure (25-06-25)
```

---

## 🗺️ Roadmap

Here's what's on the drawing board for TaskMD Pro:

- [ ] **Advanced Filtering:** Filter by due date range and more.
- [ ] **Customizable Columns:** Add, rename, and reorder your columns.
- [ ] **WIP Limits:** Set work-in-progress limits for your columns.
- [x] **Export to Markdown:** Save your board state back to a `.md` file.
- [ ] **File System Access API** Save directly to a chosen folder without the need for export.

See the open [issues](https://github.com/newambition/tasks-md-react/issues) for a full list of proposed features (and known issues).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## 🙏 Acknowledgments

A huge thank you to the creators of these amazing tools that made TaskMD Pro possible:

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [dnd-kit](https://dndkit.com/)
- [Shields.io](https://shields.io) for the cool badges!

<!-- MARKDOWN LINKS & IMAGES -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/

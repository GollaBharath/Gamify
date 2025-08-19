# 🤝 Contributing to Gamify

Thank you for considering contributing to **Gamify**! 🎉  
Your interest in making this platform better means the world to us. Whether you're here to squash a bug, suggest a new feature, or add code to our monorepo — you're welcome and appreciated.

**Gamify** is an open-source gamification platform that empowers teams, communities, and individuals to build achievement-based ecosystems through events, tasks, rewards, and a sleek dashboard — all integrated with a Discord bot.

---

## 📜 Code of Conduct

We are committed to fostering a welcoming, inclusive, and respectful environment for everyone. By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please take a moment to review it before contributing.

---

## 🌟 How Can I Contribute?

There are many ways to get involved with Gamify:

### 🐛 Reporting Bugs

Found something not working as expected? Here’s how you can help:

- First, **search the existing issues** to avoid duplicates.
- If it’s new, open an issue with:
  - A clear and descriptive title
  - Steps to reproduce the issue
  - What you expected to happen vs what happened
  - Environment details (browser, OS, Node version, etc.)

### 💡 Suggesting Enhancements

Got an idea to make Gamify even better?

- Start by opening a new issue with your proposal.
- Explain your idea clearly: What problem does it solve? Who benefits?
- We encourage discussion before you start coding — we love collaborative thinking!

### 📥 Submitting Pull Requests

Pull Requests (PRs) are always welcome! 🙌  
If you're fixing a bug or adding a feature, check out the sections below to get started.

---

## 🚀 Your First Code Contribution

Ready to dive into the code? Here's a quick guide to get you going:

1. **Fork the repository**

   Click the **Fork** button at the top-right of [this repo](https://github.com/gollabharath/gamify).

2. **Clone your fork locally**

   ```bash
   git clone https://github.com/<your-username>/gamify.git
   cd gamify
   ```

3. **Understand the monorepo structure**

   ```
   gamify/
   ├── .github/             # GitHub configs like issue templates and workflows
   ├── bot/                 # Discord companion bot built with Discord.js
   ├── client/              # Frontend app built with React and Tailwind CSS
   ├── server/              # REST API backend built with Node.js and Express
   ├── .gitignore           # Ignore rules for Git
   ├── CODE_OF_CONDUCT.md   # Code of Conduct for contributors
   ├── CONTRIBUTING.md      # This guide you're reading
   ├── Concept_Note.md      # High-level concept and idea behind the project
   ├── LICENSE              # MIT License info
   ├── README.md            # Main project documentation

   ```

4. **Create a new branch**

   Use a meaningful name:

   ```bash
   git checkout -b feature/AddLeaderboard
   # or
   git checkout -b fix/RewardRedemptionBug
   ```

5. **Set up the project**

   Follow the setup instructions in [`README.md`](./README.md) to install dependencies and run each part locally.

---

## 📦 Pull Request Process

To help us review your PR quickly, please follow these steps:

1. Remove any install or build-related artifacts (like `node_modules`).
2. If you modified any user-facing behavior, **update the README** where necessary.
3. Use a **clear and conventional PR title**, such as:
   - `feat: Add dark mode toggle`
   - `fix: Prevent duplicate task submissions`
4. Reference any related issue using keywords:
   - _"Closes #42"_ or _"Fixes #101"_
5. Submit the PR — a maintainer will review it and provide feedback as needed.

---

## 🧭 Styleguides & Conventions

To keep our codebase clean and easy to read:

- **Git Commit Messages**  
  Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:

  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting (no logic change)
  - `refactor:`, `test:`, `chore:`, etc.

- **JavaScript / TypeScript Style**  
  We use **ESLint** and **Prettier** to enforce consistent code quality and formatting.
  - Run the linter before submitting:
    ```bash
    npm run lint
    ```
  - Use Prettier to format your code:
    ```bash
    npm run format
    ```

---

## 💖 Final Encouragement

Thank you so much for considering a contribution to Gamify.  
Every bit of effort — from a single typo fix to major features — helps make this project stronger.

We can’t wait to see what you’ll build with us! 🚀  
Happy contributing!

—  
**The Gamify Team**

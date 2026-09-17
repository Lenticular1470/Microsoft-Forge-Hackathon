# AI Code Review & Rewrite Agent

A full-stack application that helps developers review, debug, improve, and rewrite source code using AI. The project combines a FastAPI backend with a browser-based frontend so you can paste or import code, ask for an AI review, generate a rewrite, inspect quick fixes, and run code in a sandboxed execution environment.

## What the application does

The app allows you to:

- Paste code in multiple languages
- Run AI-powered code review analysis
- See issue summaries, explanations, and suggested fixes
- Review runtime-aware findings
- Generate an improved rewrite of the same code
- Apply quick fixes for specific issues
- Run code through the JDoodle execution API
- Use a simple browser interface for everyday development workflows

## Project structure

- backend/ - FastAPI API and AI services
- frontend/ - static web UI
- docs/ - architecture and product documentation
- tests/ - backend and feature validation tests
- docker-compose.yml - container setup for backend and frontend
- Dockerfile - backend container build

## Prerequisites

Before starting the app, make sure you have:

- Python 3.11+
- pip
- Node.js or npm (recommended for frontend tooling, though the frontend is mostly static HTML/JS)
- A Groq API key for LLM access
- Optional: Docker Desktop or Docker Compose if you want to run the project in containers

## 1. Configure the backend environment

From the project root, create a backend/.env file with your AI credentials and app settings.

Example:

```env
GROQ_API_KEY=your_groq_api_key_here
MODEL_NAME=llama-3.3-70b-versatile
TEMPERATURE=0.3
MAX_TOKENS=4096
HOST=0.0.0.0
PORT=8000
REQUEST_TIMEOUT=30
DEBUG=true
APP_ENV=development
```

Important:

- The backend will not be able to review code unless GROQ_API_KEY is present.
- The app uses the Groq SDK for LLM calls and JDoodle for code execution.

## 2. Install backend dependencies

Open a terminal in the project root and run:

```bash
cd backend
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

On macOS/Linux:

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

## 3. Start the backend API

From the backend folder:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API should be available at:

- http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/v1/health

If you prefer Docker, run this from the project root:

```bash
docker compose up --build
```

This starts:

- Backend at http://localhost:8000
- Frontend at http://localhost

## 4. Open the frontend application

The frontend is a static web application stored in the frontend folder. You can either:

1. Open the HTML file directly in a browser, or
2. Serve the folder through a local web server, or
3. Use the Dockerized frontend at http://localhost

For local development, a simple way is:

```bash
cd frontend
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## 5. How to use the application

### Step 1: Choose a language and paste code

In the editor area, select the programming language for your code. Common choices include Python, JavaScript, Java, or C++.

Then paste code into the editor. You can also use the built-in sample programs if you want to test the app quickly.

### Step 2: Run a code review

Click the Review button.

The backend sends your code to the AI code review service, which checks for:

- logic issues
- performance bottlenecks
- readability problems
- security concerns
- maintainability issues
- edge cases or runtime risks

The review is displayed in the review panel with sections such as:

- summary of findings
- severity levels
- detailed explanations
- code references
- suggested fixes

### Step 3: Inspect findings and quick fixes

The review panel may include:

- issue titles
- descriptions of the bug or weakness
- severity indicators
- quick fix mini-suggestions

Use the quick fix feature to generate a targeted fix for a specific review item. This is useful when you want help altering one section without rewriting the whole file.

### Step 4: Generate a rewrite

After reviewing the code, click Generate Rewrite.

The app sends the original code to the rewrite engine, which produces a more polished version. The rewritten code typically aims to:

- improve readability
- keep behavior consistent
- reduce complexity
- fix risky patterns
- follow cleaner style conventions

The rewritten output appears in the rewrite panel, where you can compare the original and improved versions side by side.

### Step 5: Run the code

If your code is executable, use the Run Code button to send it to the JDoodle execution engine.

This is useful for:

- validating behavior
- checking runtime output
- testing fixes and rewrites
- debugging execution errors

The run result typically includes:

- stdout/stderr output
- execution status
- runtime or compile information
- any errors returned by the sandbox

### Step 6: Copy or replace code

Once you have a review, quick fix, or rewrite, you can:

- copy the suggested code
- compare it against your original version
- overwrite the editor with the improved result if needed
- continue iterating with additional review cycles

This workflow is ideal for iterative improvement when working on a function, class, or full program.

## 6. Typical workflow example

A common development loop looks like this:

1. Paste a Python script into the editor.
2. Click Review.
3. Read the AI findings and severity labels.
4. Click a quick fix to resolve a targeted issue.
5. Click Generate Rewrite for a cleaner version.
6. Run the rewritten code to confirm output.
7. Repeat until the result is correct and clear.

## 7. API overview

The backend exposes these main routes:

- POST /api/v1/review - analyze and review code
- POST /api/v1/rewrite - generate an improved rewritten version
- POST /api/v1/quick-fix - create a focused fix for a specific issue
- POST /api/v1/run - execute code via JDoodle
- GET /api/v1/health - checks if the service is running

You can test the API directly through Swagger at:

```text
http://localhost:8000/docs
```

## 8. Troubleshooting

### Backend startup fails

Check that:

- Python dependencies are installed
- the .env file exists in backend/
- GROQ_API_KEY has been set correctly
- no port conflict is using 8000

### Frontend cannot reach backend

Ensure the app is running on the expected URL. The frontend defaults to the local backend at http://localhost:8000 if no override is supplied.

### AI reviews are not returning results

Usually this means one of the following:

- GROQ_API_KEY is missing or invalid
- the model name is unsupported
- the backend is not running
- the request payload is malformed

### Code execution fails

Make sure the selected language matches the code and that the JDoodle service is reachable. If execution fails, review the runtime output in the console/logs.

## 9. Recommended development flow

For local development, use:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In another terminal:

```bash
cd frontend
python -m http.server 8080
```

Then open http://localhost:8080 and begin reviewing code.

## 10. Notes

This app is designed to support experimentation and iterative software improvement. It is best used as a coding assistant for reviewing and stabilizing code, not as a replacement for an engineer’s judgment. Always inspect AI suggestions carefully before applying them to production code.

## 11. License and project context

This project is part of the Microsoft Forge Hackathon and was created to demonstrate how AI can support code review, remediation, and rework in a modern web-based workflow.


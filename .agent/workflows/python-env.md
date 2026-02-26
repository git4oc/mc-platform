---
description: Python environment setup - use miniforge py312, never create venvs
---

## Python Environment Preferences

**IMPORTANT:**
1. Do **NOT** create virtual environments (venv) for this project.
2. Always use the user's existing **miniforge py312** conda environment.
3. **ALWAYS activate the py312 environment first** before running ANY Python-related commands (pip install, python scripts, etc.).

- Python path: `D:\miniforge3\envs\py312\python.exe`
- Pip path: `D:\miniforge3\envs\py312\Scripts\pip.exe`
- Python version: 3.12.8

### Step 1: Activate the environment (ALWAYS do this first)

```powershell
conda activate py312
```

### Step 2: Then run your Python commands

```powershell
# Installing packages
pip install <package>
pip install -r requirements.txt

# Running scripts
python <script.py>
```

### IDE Configuration

When the IDE reports "Could not find import" errors, the fix is usually:
1. Ensure the package is installed in the py312 environment (commands above)
2. Set the IDE's Python interpreter to `D:\miniforge3\envs\py312\python.exe`

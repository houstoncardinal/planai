# GitHub SSH Setup Guide for houstoncardinal

## Step-by-Step Instructions

### 1. Generate SSH Key
Run this command in your terminal:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519_houstoncardinal
```

When prompted:
- Press Enter to accept the default file location
- Enter a passphrase (optional but recommended)
- Confirm the passphrase

### 2. Start SSH Agent
```bash
eval "$(ssh-agent -s)"
```

### 3. Add SSH Key to Agent
```bash
ssh-add ~/.ssh/id_ed25519_houstoncardinal
```

### 4. Copy Public Key
```bash
cat ~/.ssh/id_ed25519_houstoncardinal.pub
```

Copy the entire output (starts with `ssh-ed25519`)

### 5. Add Key to GitHub
1. Go to https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "Plan.AI Development"
4. Paste the public key
5. Click "Add SSH key"

### 6. Test Connection
```bash
ssh -T git@github.com
```

You should see: "Hi houstoncardinal! You've successfully authenticated..."

### 7. Configure Git for This Repo
```bash
cd /Users/hunainqureshi/Desktop/planai-1
git config user.name "houstoncardinal"
git config user.email "your_email@example.com"
```

### 8. Update Remote to SSH
```bash
git remote set-url origin git@github.com:houstoncardinal/planai.git
```

### 9. Verify Remote
```bash
git remote -v
```

Should show:
```
origin  git@github.com:houstoncardinal/planai.git (fetch)
origin  git@github.com:houstoncardinal/planai.git (push)
```

### 10. Push to GitHub
```bash
git add .
git commit -m "Initial commit: Complete Plan.AI application"
git push -u origin main
```

If the branch is named differently:
```bash
git branch -M main
git push -u origin main
```

## Troubleshooting

### If you get "Permission denied"
1. Make sure the SSH key is added to GitHub
2. Test connection: `ssh -T git@github.com`
3. Check SSH agent: `ssh-add -l`

### If you get "Repository not found"
1. Verify you're authenticated as houstoncardinal
2. Check repository exists: https://github.com/houstoncardinal/planai
3. Verify remote URL: `git remote -v`

### If branch doesn't exist
```bash
git checkout -b main
git push -u origin main
```

## Quick Commands Reference

```bash
# Check current user
git config user.name
git config user.email

# Check remote
git remote -v

# Check SSH keys
ssh-add -l

# Test GitHub connection
ssh -T git@github.com

# Push changes
git add .
git commit -m "Your message"
git push

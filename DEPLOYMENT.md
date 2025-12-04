# Deployment Guide

## Option 1: Railway (Recommended - Free Tier Available)

1. Create account at https://railway.app
2. Install Railway CLI:
```bash
npm install -g @railway/cli
```

3. Login:
```bash
railway login
```

4. Initialize project:
```bash
railway init
```

5. Add MongoDB plugin:
```bash
railway add
# Select MongoDB
```

6. Deploy:
```bash
railway up
```

7. Set environment variables in Railway dashboard:
- `JWT_SECRET`
- `JWT_EXPIRE=7d`
- `NODE_ENV=production`
- `FRONTEND_URL=your-frontend-url`

## Option 2: Heroku

1. Install Heroku CLI
2. Login:
```bash
heroku login
```

3. Create app:
```bash
heroku create maximal-gym-api
```

4. Add MongoDB:
```bash
heroku addons:create mongolab:sandbox
```

5. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_EXPIRE=7d
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=your-frontend-url
```

6. Deploy:
```bash
git push heroku main
```

## Option 3: DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean App Platform
3. Create new app from GitHub repo
4. Add MongoDB database component
5. Set environment variables
6. Deploy

## Environment Variables for Production

```env
PORT=5000
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=<your-production-frontend-url>
```

## Important Notes

1. **Change JWT_SECRET** to a strong random string
2. **Whitelist IP addresses** in MongoDB Atlas
3. **Enable CORS** for your production frontend URL
4. **Change default admin password** after deployment
5. **Set up MongoDB backups**

## Testing Production API

```bash
curl https://your-api-url.com/api/health
```

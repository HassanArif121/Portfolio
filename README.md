# Muhammad Hassan Portfolio

## Contact form email setup

The contact form sends messages through Gmail SMTP using Render environment variables.

Add these variables in Render:

```env
CONTACT_TO_EMAIL=hassan7663arif@gmail.com
EMAIL_USER=hassan7663arif@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

Use a Gmail App Password, not your normal Gmail password. In Google Account settings, enable 2-Step Verification, then create an App Password for this portfolio app. After adding the variables in Render, redeploy the service.

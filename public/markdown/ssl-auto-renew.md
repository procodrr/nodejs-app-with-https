## Let's Encrypt SSL

This command will help you renew your certificate automatically:

```bash
sudo systemctl enable --now certbot.timer
```

**Note:** Ensure port 80 is available for the renewal process.

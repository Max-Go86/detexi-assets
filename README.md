# detexi-assets

Public assets for [detexi.be](https://detexi.be)

## chat-widget.js

Secured floating chat widget for Webflow. Features:
- Bilingual NL/FR (auto-detect)
- Rate limiting (10 msg/min per session)
- Input sanitisation & anti prompt-injection
- Browser fingerprinting (anti-bot)
- Session isolation via sessionStorage
- Typing delay humanisation
- Fallback to phone on error

**Loaded via Webflow footer script loader.**

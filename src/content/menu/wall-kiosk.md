---
title: The wall kiosk
tagline: A vendor calendar gadget that now boots straight into our own dashboard, and nothing else.
order: 1
status: fresh
bakers: both
ingredients:
  - One 15.6 inch touchscreen that used to be a calendar gadget
  - A small Android app of ours, fullscreen and in portrait
  - A command line helper that reaches the display over WiFi
  - Notes on what the hardware and its browser can and cannot do
---

## Method

Take a wall display that shipped as somebody else's calendar product. Open it up, and teach it to
boot into one small Android app that shows our dashboard fullscreen, in portrait, and nothing else.

The display loads the live site, so changing the dashboard needs no work on the device. Deploy the
site, then ask the kiosk to reload. A helper script does the rest from a laptop: take a screenshot
of what it is showing right now, open the live page in browser dev tools, tail the page's console,
restart the app.

The device has no Back or Home buttons at all. Tap the top left corner five times and a hidden
service menu opens, which is how you fix WiFi with no laptop. If another app ends up in front, a
small round home button floats in the corner, and the dashboard comes back by itself after two minutes.

## Baker's notes

The one thing to know before writing code for it: the kiosk's browser is Chrome 83, from mid 2020,
and it cannot be updated. A lot of modern CSS and JavaScript does not exist there. We keep a list,
and we set the build tools to catch it for us.

The home button cannot appear over Android Settings, because Android forbids it. There you wait the
two minutes.

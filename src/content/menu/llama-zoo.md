---
title: The llama zoo
tagline: The polite little goblin that manages our local AI zoo.
order: 3
status: proving
bakers: both
ingredients:
  - 1x RTX 3090
  - 2x RTX 3060
  - 64 GB of system RAM
  - llama.cpp, for inference
  - llama-swap, for model switching
  - A drawer of shell launchers, one per preset
---

## Method

One machine, a few different jobs, and nobody has to remember 900 command line flags. It serves fast
local chat. It serves better coding models when accuracy matters. It swaps between models cleanly,
and it keeps both upstream projects easy to update.

The 3090 does the heavy lifting and the 3060s help with offload. A tensor split of 2,1,1 is the
default starting point. In plain English: the 3090 is the lead singer, the 3060s are backup vocals,
and together they scream tokens into the void.

There are two ways to run it. Direct, when you want the simplest path, raw benchmarking, and full
control over flags. Or through the swapper, when you want one stable OpenAI-compatible endpoint and
want chat users and coding users to coexist peacefully. The second is the day to day mode.

## Baker's notes

Normal context is 131072 tokens. The long-context preset is 163840.

The whole thing exists to be understandable to Future Us. That is a real design goal and it is
written down as one.

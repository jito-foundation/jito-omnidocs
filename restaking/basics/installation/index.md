---
title: "Installation"
subtitle: "How to install the Jito Restaking CLI."
section_type: "page"
order: 4
---

## Install CLI

Clone the Jito Restaking Repo:

```bash
git clone git@github.com:jito-foundation/restaking.git
cd restaking
```

Build:

```bash
cargo build --release
```

Install the CLI:

```bash
cargo install --path ./cli --bin jito-restaking-cli
```

Check CLI has been installed:

```bash
jito-restaking-cli --help
```

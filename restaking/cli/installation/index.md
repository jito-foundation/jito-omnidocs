---
title: "Installation"
subtitle: "How to install the Jito Restaking CLI."
section_type: "page"
order: 0
---

## Install CLI

### Option 1: Install from crates.io (Recommended)

The easiest way to install the Jito Restaking CLI is directly from [crates.io](https://crates.io/crates/jito-restaking-cli):

```bash
cargo install jito-restaking-cli
```

Check CLI has benn installed:

```
jito-restaking-cli --help
```

### Option 2: Build from source

If you prefer to build from source or need the latest development version:

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

# Architecture Notes

This document provides a brief overview of the architectural decisions and directory structure of the `wg-easy-port-manager` fork, specifically regarding the separation of backend code.

## Directory Structure: `lib/` vs `services/`

At first glance, having both `src/lib/` and `src/services/` might seem redundant, as they contain files with similar names (e.g., `Server.js` and `WireGuard.js` in both directories). However, this is a deliberate design pattern inherited from the original `wg-easy` project:

### 1. `src/lib/` (Class Definitions)
This directory contains the actual business logic and class definitions. The files here export uninstantiated Classes.
- Example: `src/lib/WireGuard.js` defines the `WireGuard` class, which includes all the methods for interacting with the wg interfaces, iptables, and nftables.

### 2. `src/services/` (Singleton Instances)
This directory acts as an initializer and registry for singletons. The files here import the classes from `lib/`, instantiate them using the `new` keyword, and export that single instance.
- Example: `src/services/WireGuard.js` looks like this:
  ```javascript
  const WireGuard = require('../lib/WireGuard');
  module.exports = new WireGuard();
  ```

### Why this pattern?
By requiring the modules from `src/services/*` throughout the rest of the application (like in API routes or the main `server.js` entry point), we guarantee that all parts of the app are interacting with the exact same instance in memory. This is critical for maintaining a single, consistent state representing the WireGuard configuration and active peer connections.

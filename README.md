# WG-Easy (Advanced Fork)

<p align="center">
  <img src="https://github.com/wg-easy/wg-easy/raw/master/Hero.png" alt="WG-Easy Hero" />
</p>

> **Disclaimer**: This project is a specialized fork of the original [wg-easy](https://github.com/wg-easy/wg-easy) by Weejewel. This fork introduces advanced networking features and interface enhancements not present in the upstream repository, specifically tailored for power users requiring advanced port forwarding management.

---

## 🚀 Key Features & Enhancements

This fork maintains the simplicity of the original WireGuard UI while injecting powerful new capabilities:

*   **Peer Port Manager (DNAT/Port Forwarding)**: A fully integrated UI to manage port forwarding per WireGuard peer. You can dynamically map external server ports to internal peer IPs.
*   **Automated `nftables` Integration**: The backend automatically provisions, syncs, and flushes `nftables` DNAT rules based on the UI configuration. No manual firewall configuration required.
*   **Enhanced Stability**: Fixed underlying race conditions during WireGuard initialization, ensuring a smoother startup sequence.
*   **Robust Session Management**: Resolved silent hanging issues during login and authentication token drops in reverse-proxy or high-latency environments.
*   **Host Network Mode Support**: Optimized to run with `network_mode: "host"` for maximum performance and reduced overhead in specific deployment architectures.

---

## 🛠 Installation & Deployment

Deploying this fork is as simple as running a `docker-compose.yml` file. 

### Prerequisites

Ensure your host system meets the following requirements:
* Docker & Docker Compose installed.
* `nftables` and `iptables` available on the host system.
* WireGuard kernel module loaded.

### Example `docker-compose.yml`

Create a `docker-compose.yml` file with the following configuration. Be sure to replace `WG_HOST` and `PASSWORD_HASH` with your own values.

```yaml
volumes:
  etc_wireguard:

services:
  wg-easy:
    image: ghcr.io/ydtoloza/wg-easy:latest
    container_name: wg-easy
    environment:
      - LANG=es # Set UI Language (es, en, etc.)
      - WG_HOST=YOUR_SERVER_IP # Change to your server's public IP
      - PASSWORD_HASH=$$2y$$10$$hBCoykrB95WSzuV4fafBzOHWKu9sbyVa34GJr8VV5R/pIelfEMYyG # Replace with your bcrypt hash
      - WG_PERSISTENT_KEEPALIVE=25
      - WG_DEVICE=eth0 # Change if your main interface is not eth0
      # Required rules to allow internet access to connected peers
      - WG_POST_UP=iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE; iptables -I INPUT -p udp -m udp --dport 51820 -j ACCEPT; iptables -I FORWARD -i wg0 -j ACCEPT; iptables -I FORWARD -o wg0 -j ACCEPT;
      - WG_POST_DOWN=iptables -t nat -D POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE; iptables -D INPUT -p udp -m udp --dport 51820 -j ACCEPT; iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT;
    volumes:
      - etc_wireguard:/etc/wireguard
    restart: unless-stopped
    network_mode: "host" # High performance network mode
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
      - NET_RAW
```

> **Note on `PASSWORD_HASH`**: Do not use plain text passwords. You must generate a bcrypt hash. In docker-compose, escape the `$` symbols with double `$$`.

### Starting the Server

Run the following command in the directory containing your `docker-compose.yml`:

```bash
docker compose up -d
```

The Web UI will be available on your server's IP at port `51821` (e.g., `http://YOUR_SERVER_IP:51821`).

---

## ⚙️ How Port Forwarding (DNAT) Works

In the dashboard, you will find a new section for each client. You can assign external ports (TCP/UDP) to be forwarded directly to the client's internal VPN IP. 

Behind the scenes, the application uses `nftables` to route the traffic:
```bash
nft add rule ip wgeasy_dnat prerouting tcp dport <EXTERNAL_PORT> dnat to <CLIENT_IP>:<INTERNAL_PORT>
```
These rules are dynamically applied and removed as you configure them in the UI.

---

## 🤝 Upstream Project

All credit for the original design and core application architecture goes to [Weejewel](https://github.com/weejewel/wg-easy). 

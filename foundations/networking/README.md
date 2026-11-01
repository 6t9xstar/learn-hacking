# Networking foundations

[Home](../../README.md) / Foundations / Networking

Every security incident, every web request, and every cloud workload moves through a network. If you cannot explain how a packet gets from a browser to a server and back, then firewalls, proxies, VPNs, and intrusions remain folklore. Networking is the physical and logical layer that gives every other security topic its context.

This guide teaches the mental models a defender or tester needs: how data is encapsulated, addressed, routed, and named, and how to prove what happened with packet captures and logs. It is written for beginners, but it does not skip the details that matter when traffic does not behave as expected.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Beginner to intermediate. Subnetting and packet analysis require practice. |
| Realistic time | 6–8 weeks at 6 hours per week, including capture analysis. |
| Cost | Free. All core tools and references are open source or free to read. |
| Prerequisites | Comfort with a command line; basic algebra helps with subnetting. |
| Lab requirement | Two local virtual machines and Wireshark; no public targets. |
| Evidence of learning | An annotated capture, a subnet and firewall plan, and a troubleshooting runbook. |

## Why this field matters

Most security controls are network controls in disguise. A firewall enforces a policy about flows; a proxy inspects HTTP; segmentation limits lateral movement; DNS filtering blocks command-and-control domains. Without a packet-level model, you can configure these tools but cannot reason about whether they actually do anything.

Networking also has unusual career leverage. The ability to read a capture and say "the TLS handshake never completed because the client trusted a different certificate" is rare and immediately useful, whether you end up in operations, incident response, or penetration testing. It is also one of the most common gaps in candidates who have only used guided labs.

## What you will learn

- Explain encapsulation and map OSI layers to the TCP/IP model and to real headers.
- Subnet IPv4 networks, read CIDR notation, and explain NAT, gateways, and private addressing.
- Trace a full web request through DNS, ARP, TCP, TLS, and HTTP, including where it can fail.
- Read DNS records, HTTP messages, and TLS certificate details without guessing.
- Capture traffic and explain a connection using only evidence from the capture.
- Describe how switching, VLANs, routing, and stateful firewalls create or fail to create segmentation.
- Recognise common network attack patterns conceptually and name the control that reduces each one.

## Prerequisites and honest expectations

You should be comfortable installing software and running a few commands. You do not need Cisco hardware: everything here can be practised with virtual machines, containers, and packet captures.

- Subnetting feels unnatural for a week and then becomes routine. Do ten small exercises rather than reading ten explanations.
- Memorising port numbers is less useful than learning to look them up in the IANA registry.
- Packet analysis is slow at first. Start with one connection, not a gigabyte of capture.
- You will not become a network engineer from one guide, but you will stop treating the network as magic.

## Core concepts

### Layered models and encapsulation

Networks are described in layers so that each layer can solve one problem and hand the result to the next. The OSI model has seven layers; the TCP/IP model collapses them into four. Both are teaching tools, not laws of physics, but they give you a shared language for troubleshooting and attacks.

| OSI layer | TCP/IP layer | Data unit | Examples | Security relevance |
| --- | --- | --- | --- | --- |
| 1–2 Physical, Data Link | Link | Frame | Ethernet, Wi-Fi, ARP | Local interception, MAC spoofing, VLAN attacks |
| 3 Network | Internet | Packet | IP, ICMP, routing | Spoofing, fragmentation, segmentation bypass |
| 4 Transport | Transport | Segment or datagram | TCP, UDP, QUIC | Port scanning, session hijacking, floods |
| 5–7 Session, Presentation, Application | Application | Message | DNS, TLS, HTTP, SMB | Injection, authentication flaws, data exposure |

Encapsulation is the key idea: each layer wraps the payload from the layer above with its own header. An HTTP request becomes a TCP segment, then an IP packet, then an Ethernet frame, and is unwrapped in reverse at the destination. When you read a capture, you are reading those nested headers.

### Frames, packets, segments, and MTU

A frame carries data across one local link; a packet is routed between networks; a segment is TCP's unit of reliable delivery. The maximum transmission unit (MTU) of Ethernet is normally 1500 bytes, so TCP advertises a maximum segment size that fits after IP and TCP headers. Tunnels and VPNs add overhead, which is why large downloads sometimes stall while small requests work: path MTU discovery is failing somewhere. Fragmentation and broken ICMP handling produce failures that look like application bugs, so learn to test with different packet sizes and read ICMP "fragmentation needed" messages.

### IP addressing, subnetting, and NAT

IPv4 addresses are 32 bits, written as four octets. A subnet mask, or CIDR prefix, divides the address into a network portion and a host portion: in 192.168.10.0/24, the first 24 bits identify the network and 8 bits identify hosts, giving 254 usable addresses after the network and broadcast addresses. Private ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16; they are not routable on the public internet and are translated by NAT at the edge.

NAT rewrites addresses and ports so many internal hosts can share one public address. It is a workaround for address exhaustion, not a security control: outbound connections still work, and inbound access can be published deliberately. IPv6 uses 128-bit addresses, usually written in hexadecimal, with link-local addresses in fe80::/10, unique local addresses in fc00::/7, and global addresses allocated from 2000::/3. IPv6 normally has no NAT, so firewall policy and host firewalls matter more, not less.

### ARP, NDP, and the local segment

A host can only send a frame to a MAC address on its local segment. ARP resolves an IPv4 address to a MAC address by broadcasting a question and caching the answer; IPv6 uses neighbour discovery instead. The cache is trusted by default, which is why ARP spoofing exists conceptually: an attacker on the same segment can claim to be the gateway and intercept traffic.

The defensive lessons are architectural. Segment networks so that user devices cannot talk to each other unnecessarily. Use dynamic ARP inspection and port security on managed switches where available. Monitor for duplicate address claims and sudden gateway MAC changes. And remember that any shared local segment, including conference Wi-Fi, is a trust boundary.

### TCP, UDP, and ports

TCP provides a connection-oriented, ordered byte stream. It starts with a three-way handshake (SYN, SYN-ACK, ACK), tracks sequence numbers, acknowledges received data, retransmits loss, and ends with FIN or RST. UDP is connectionless and does not guarantee delivery; DNS, DHCP, QUIC, and many real-time protocols use it because speed or simplicity matters more than reliability at that layer.

Ports identify services on a host. The IANA registry divides them into well-known (0–1023), registered (1024–49151), and dynamic or ephemeral ranges. A listening socket is a service waiting for connections; `ss -tulpn` on Linux shows them. Port numbers are conventions, not guarantees: a service can run anywhere, and attackers can tunnel over common ports. Scan results tell you what answered, not what is safe.

### The full packet flow

The fastest way to consolidate the models is to trace one HTTPS request end to end. The diagram below assumes a home network with a router performing NAT and a local DNS resolver.

```text
Browser wants https://example.com
  1. DNS: query A/AAAA for example.com -> recursive resolver -> authoritative server
  2. ARP: which MAC owns the default gateway IP? (local segment only)
  3. TCP: SYN to 203.0.113.10:443, SYN-ACK, ACK (three-way handshake)
  4. TLS: ClientHello (SNI, versions, ciphers) -> ServerHello, certificate, keys
  5. HTTP: GET / HTTP/2 with headers, cookies, and host
  6. Server response: status, headers, body; TCP ACKs and retransmits as needed
  7. Teardown or keep-alive reuse for the next request
```

At each step something can fail, and the failure has a signature: a DNS timeout looks different from a TCP RST, which looks different from a TLS certificate error, which looks different from an HTTP 403. Being able to place a symptom at the right layer is the core troubleshooting skill.

### DNS

DNS is a distributed, hierarchical database. A recursive resolver walks from the root, through the top-level domain, to the authoritative name server for the zone, then caches the answer for the record's time to live. Common records are A and AAAA (addresses), CNAME (alias), MX (mail), TXT (verification and policy), NS (delegation), SOA (zone authority), and SRV (service location). DNSSEC adds cryptographic signatures so a resolver can detect tampering; it does not encrypt queries.

DNS is also security telemetry. Queries reveal which services users and malware contact, and unusual query patterns often expose beaconing or data exfiltration. Encrypted DNS (DoH and DoT) improves privacy but reduces visibility at the network edge, so organisations often combine endpoint logging with network monitoring. Internal DNS is an attack surface too: stale records, dangling CNAMEs to unclaimed cloud resources, and zone transfer misconfiguration all cause real incidents.

### HTTP

HTTP is a request-response protocol carried over TCP or, in HTTP/3, over QUIC. A request has a method, a target, headers, and optionally a body; a response has a status code, headers, and a body. Methods carry semantics (GET should be safe, PUT and DELETE are not), status classes indicate outcome (2xx success, 3xx redirect, 4xx client error, 5xx server error), and headers control caching, content types, cookies, and security policy.

HTTP/1.1 keeps connections alive and sends requests sequentially per connection. HTTP/2 multiplexes streams over one connection, and HTTP/3 moves to QUIC to reduce head-of-line blocking. Proxies, load balancers, and CDNs sit between clients and servers and add headers such as Forwarded or X-Forwarded-For; those headers are untrusted input unless the edge overwrites them. Cookies are the main session mechanism, and their flags (Secure, HttpOnly, SameSite) are security controls, not decoration.

### TLS and public-key infrastructure

TLS provides confidentiality, integrity, and authentication for data in transit. The client and server negotiate a protocol version and cipher suite, authenticate the server with a certificate, and derive shared session keys. TLS 1.3 reduced the handshake to one round trip and removed legacy algorithms; session resumption and 0-RTT improve latency but have replay considerations.

Certificates bind a public key to names and are signed by certificate authorities that the client trusts. The client checks the chain, validity dates, revocation information, and the name. Server Name Indication tells the server which certificate to present, and it is normally visible on the wire even when the content is encrypted. Intercepting TLS for inspection is possible with a trusted internal CA, but it weakens end-to-end security and creates a high-value key to protect, so it should be a deliberate, scoped decision.

### Routing, switching, and segmentation

Switches learn which MAC addresses live on which ports and forward frames accordingly; VLANs divide one physical switch into separate broadcast domains. Routers move packets between IP networks using a routing table populated by connected routes, static routes, or dynamic protocols such as OSPF inside an organisation and BGP between organisations.

Segmentation is the security payoff. A flat network lets any compromised laptop reach every server; a segmented network forces traffic through policy points. Demilitarised zones isolate internet-facing services, access control lists restrict flows, and stateful firewalls track connection state so return traffic is allowed without opening everything. Modern designs add microsegmentation and identity-aware proxies, but the principle is old: do not let a single foothold become a network-wide position.

### Monitoring and traffic analysis

Packet capture gives ground truth; flow records summarise who talked to whom, how much, and when. Wireshark and tshark analyse captures, Zeek turns traffic into structured logs, and Suricata or Snort match signatures and protocol anomalies. Useful signals include repeated connections to rare destinations, DNS queries with high entropy, SMB traffic between workstations, and large outbound transfers at unusual hours.

Baselines make anomalies meaningful. A capture with no context is a pile of packets; a capture compared with a known-good day is evidence. Always record the time, interface, filter, and environment when you capture, and store captures securely because they can contain credentials and personal data.

### Wireless and remote access at a glance

Wi-Fi is a shared medium, so anyone in range can hear frames, and encryption is what keeps them private. WPA2 and WPA3 protect the link, with WPA3 adding a resistant handshake; enterprise networks add 802.1X authentication. Rogue access points and evil twins abuse the trust users place in network names. Remote access adds VPN concentrators, zero-trust network access, and exposed remote desktop, all of which are frequent initial-access paths.

Wireless deserves its own depth. This curriculum covers it in the separate [wireless security guide](../../wireless-security/README.md); treat this section as a pointer, not a substitute.

## Legal and safe practice

Capture only traffic on networks you own or administer, and tell people before you capture on a shared lab. Packet captures routinely contain credentials, tokens, and personal data, so treat them as sensitive evidence.

- Never scan or probe public IP ranges, your ISP, or your employer without written authorisation. Port scanning is logged and can be illegal.
- Use host-only or internal virtual networks for experiments, and keep deliberately vulnerable services off bridged adapters.
- Sanitise captures before sharing them: strip payloads, redact addresses, and remove credentials.
- Respect privacy law when monitoring a network used by other people, even a family network.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Vocabulary and models | Learn the layers, data units, and common protocols. | One-page map from HTTP to Ethernet |
| 1 | Addressing | Subnet ten /24 and /27 networks by hand, then verify with a calculator. | Worked subnetting sheet with answers |
| 2 | Capture | Install Wireshark and capture your own DNS and HTTPS traffic. | Capture filtered to one connection |
| 3 | Protocols | Follow a TCP handshake and a TLS handshake in the capture. | Annotated timeline of both handshakes |
| 4 | Segmentation | Build two VM networks with a firewall between them. | Reachability matrix before and after rules |
| 5 | Evidence | Explain three induced failures from captures and logs. | Troubleshooting runbook with screenshots |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Learning Center](https://www.cloudflare.com/learning/) | Cloudflare | Beginner | Free, no account | No | Clear explanations of DNS, TLS, HTTP, and DDoS |
| [MDN Web Docs: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) | Mozilla | Beginner | Free | No | Precise reference for methods, headers, and status codes |
| [The Bits and Bytes of Computer Networking](https://www.coursera.org/learn/computer-networking) | Google via Coursera | Beginner | Free to audit; certificate paid | Labs in the paid track | Structured networking course with quizzes |
| [Networking Basics](https://www.netacad.com/courses/networking-basics) | Cisco Networking Academy | Beginner | Free account | Interactive labs | Vendor-neutral fundamentals with Packet Tracer practice |
| [Network+ video course](https://www.professormesser.com/) | Professor Messer | Beginner | Free videos; paid notes and exams | No | Exam-oriented coverage that doubles as a reference |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [RFC Editor](https://www.rfc-editor.org/) | IETF | Primary specifications for IP, TCP, DNS, HTTP, and TLS |
| [IANA protocol registries](https://www.iana.org/) | IANA | Authoritative port, protocol, and parameter assignments |
| [MDN HTTP documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP) | Mozilla | Practical, current HTTP reference for developers |
| [Wireshark documentation](https://www.wireshark.org/docs/) | Wireshark Foundation | Display filters, protocol dissectors, and capture guidance |
| [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html) | IETF | The TLS 1.3 specification and handshake design |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| [Sample captures](https://wiki.wireshark.org/SampleCaptures) | Wireshark | Free | Analyse real protocol traces without generating traffic |
| [GNS3](https://www.gns3.com/) | GNS3 | Free, open source | Build routed and switched topologies with virtual devices |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium; several rooms free | Guided networking and traffic-analysis rooms |
| Your own VM pair | You | Free | Generate, capture, and break traffic you control |

Keep lab topologies isolated. If you use a virtual router, verify that its management interface is not exposed to your physical network.

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| Wireshark | Graphical packet capture and protocol analysis | [wireshark.org](https://www.wireshark.org/) |
| tcpdump | Command-line capture for servers and quick filters | [tcpdump.org](https://www.tcpdump.org/) |
| Nmap | Host discovery and port scanning in authorised labs | [nmap.org](https://nmap.org/) |
| dig | Query and troubleshoot DNS records | [ISC BIND](https://www.isc.org/bind/) |
| curl | Inspect HTTP requests and responses from the terminal | [curl.se](https://curl.se/) |
| nftables | Configure packet filtering and NAT on Linux | [netfilter.org](https://netfilter.org/) |

Tools do not replace methodology. A scan without a defined scope and a capture without a hypothesis will both produce noise. Learn the protocol first, then use the tool to confirm what you already suspect.

## Practical projects and exercises

**Project 1: Annotated connection capture.**
Objective: prove you can explain a real connection from evidence. Setup: capture a single HTTPS request from your lab VM, filter to that connection, and annotate the DNS query, ARP exchange, TCP handshake, TLS ClientHello, and HTTP exchange. Deliverable: a one-page timeline with packet numbers and a paragraph on where each layer could fail.

**Project 2: Small network design.**
Objective: practise addressing and segmentation. Setup: design a three-zone lab (user, server, management) using private ranges, assign VLANs, and write the allowed flow matrix and firewall rules that enforce it. Deliverable: addressing table, topology diagram, and a ruleset with justification for each allow.

**Project 3: Failure-mode runbook (portfolio-worthy).**
Objective: turn protocol knowledge into an operational asset. Setup: reproduce three failures in your lab: wrong default gateway, DNS resolution failure, and a TLS certificate name mismatch. For each, record the symptom, the commands that confirmed the cause, and the fix. Deliverable: a runbook with command output and a short explanation of the evidence.

## Common mistakes and misconceptions

- **NAT is a firewall.** NAT translates addresses; it does not enforce policy on outbound traffic.
- **HTTPS means a site is trustworthy.** It proves the connection is encrypted and the certificate matches the name, not that the operator is honest.
- **No ping response means the host is down.** ICMP is often blocked; check TCP ports and ARP before concluding anything.
- **DNS is just name resolution.** It is a major source of telemetry and a common exfiltration channel.
- **A port scan is harmless.** It is unauthorised access in many jurisdictions and is logged by defenders.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Network administrator | Help desk or NOC | Clean designs, change records, and troubleshooting evidence |
| NOC analyst | Certifications or home lab | Fast fault isolation and accurate escalation notes |
| Network security engineer | Network administration | Segmentation policy, firewall review, and capture analysis |
| SOC analyst | Networking plus operating systems | Ability to explain alerts in terms of traffic and identity |

Networking is a prerequisite more than a destination. It feeds into [network penetration testing](../../network-penetration-testing/README.md), [web application security](../../web-application-security/README.md), and almost every defensive role.

## Next steps

1. Complete the subnetting sheet without a calculator, then verify every answer.
2. Capture your own DNS and HTTPS traffic and annotate one connection end to end.
3. Build the three-zone lab and document the reachability matrix before and after firewall rules.
4. Read [Linux foundations](../linux/README.md) to connect network services to the processes that run them.
5. Follow the [beginner roadmap](../../roadmaps/beginner-to-ethical-hacker.md) and use [training grounds](../../resources/training-grounds/beginner.md) for guided practice.

## References

- IETF, *RFC 791: Internet Protocol*, <https://www.rfc-editor.org/rfc/rfc791.html>
- IETF, *RFC 9293: Transmission Control Protocol*, <https://www.rfc-editor.org/rfc/rfc9293.html>
- IETF, *RFC 1035: Domain Names*, <https://www.rfc-editor.org/rfc/rfc1035.html>
- IETF, *RFC 9110: HTTP Semantics*, <https://www.rfc-editor.org/rfc/rfc9110.html>
- IETF, *RFC 8446: TLS 1.3*, <https://www.rfc-editor.org/rfc/rfc8446.html>
- Wireshark Foundation, *Documentation*, <https://www.wireshark.org/docs/>

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) · [Learning paths](../../roadmaps/README.md) · [Free courses](../../resources/free-courses/README.md) · [Contributing](../../CONTRIBUTING.md)

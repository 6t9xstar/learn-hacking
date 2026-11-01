# Networking Drills: Addressing, DNS, HTTP/TLS, Capture, and Segmentation

[Home](../README.md) / [Exercises](README.md) / Networking drills

These 24 drills teach you to reason about packets and policy instead of memorizing commands. You will build small networks inside Linux network namespaces, capture your own traffic, break a lab network on purpose, and explain what the evidence does and does not prove.

**Environment.** A disposable Linux VM with `iproute2`, `python3`, `curl`, `dig` (from `dnsutils` or `bind9-dnsutils`), `tcpdump`, and optionally `tshark`, `nmap`, `traceroute`, and `conntrack`. Network namespaces need root; all namespace names in this file start with a drill prefix so they are easy to find and remove.

**Scope rule.** Every target in these drills is either `127.0.0.1`, a documentation range (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`, `2001:db8::/32`), or a namespace you created. Do not point `nmap`, `tcpdump`, or `curl` at public hosts. The only external requests are ordinary DNS lookups used to study resolution, and even those can be replaced with a local resolver.

> **Lab-only changes.** `ip netns del` and `nft flush` remove lab state. They are marked where they appear. Confirm the namespace name before deleting it; never run these commands against a production host.

## Evidence setup

```bash
mkdir -p ~/cyberlab-evidence/network ~/lab-data
chmod 700 ~/cyberlab-evidence
ip -brief address > ~/cyberlab-evidence/network/interfaces-baseline.txt
ip route > ~/cyberlab-evidence/network/routes-baseline.txt
```

For capture drills, record the interface, filter, snapshot length, packet count, and capture start time. A pcap without that metadata is hard to defend later.

## NET-01 — Inventory interfaces, addresses, and routes

**Goal.** Read the host's network identity and forwarding table before troubleshooting anything.

**Prerequisites.** A lab VM. No sudo required.

**Steps.** Run these in order and record the output.

1. List interfaces with addresses and state.

   ```bash
   ip -brief address
   ip -details link show
   ```

2. Print the IPv4 and IPv6 routing tables.

   ```bash
   ip route
   ip -6 route
   ```

3. Ask the kernel which route it would use for a documentation address.

   ```bash
   ip route get 192.0.2.10
   ip route get 2001:db8::10
   ```

**Expected observation.** You should see a loopback interface, one or more lab interfaces, and a default route. `ip route get` prints the selected route and source address without sending a packet. If the answer is `unreachable`, there is no matching route, which is different from a firewall drop.

**Prove it.** Save the interface and route output. Annotate the default gateway and the interface that would carry traffic to `192.0.2.10`.

**Reflect.** What is the difference between "no route" and "packet filtered"? Which command would you use next to distinguish them?

## NET-02 — Calculate subnets and host ranges

**Goal.** Convert CIDR notation into network, broadcast, and usable host ranges without guessing.

**Prerequisites.** NET-01. `python3` (standard library is enough) or `ipcalc`.

**Steps.** Run these in order and record the output.

1. Use Python's `ipaddress` module for three documentation prefixes.

   ```bash
   python3 - <<'PY'
   import ipaddress
   for cidr in ("192.0.2.0/24", "198.51.100.0/25", "203.0.113.128/26"):
       net = ipaddress.ip_network(cidr)
       print(cidr, "network", net.network_address, "broadcast", net.broadcast_address,
             "hosts", net.num_addresses - 2)
       print("  first", next(net.hosts()), "last", list(net.hosts())[-1])
   PY
   ```

2. Compare with `ipcalc` if installed.

   ```bash
   ipcalc 198.51.100.0/25 2>/dev/null || echo "ipcalc not installed"
   ```

3. Test whether two addresses share a subnet.

   ```bash
   python3 - <<'PY'
   import ipaddress
   a = ipaddress.ip_interface("192.0.2.10/25")
   b = ipaddress.ip_interface("192.0.2.129/25")
   print("same subnet:", a.network == b.network)
   print("a network:", a.network, "b network:", b.network)
   PY
   ```

**Expected observation.** A `/25` has 128 addresses, 126 usable hosts, and two `/25` networks inside a `/24`. `192.0.2.10/25` and `192.0.2.129/25` are in different subnets even though they look close. Broadcast addresses are not usable host addresses in IPv4.

**Prove it.** Save the calculation output and a one-paragraph explanation of why a wrong prefix length causes "destination unreachable" rather than a firewall block.

**Reflect.** How many `/26` networks fit in a `/24`? Why is the "usable hosts minus two" rule not universal for point-to-point links?

## NET-03 — Read the neighbor table

**Goal.** Observe ARP or IPv6 neighbor discovery on a lab link and interpret incomplete entries.

**Prerequisites.** NET-01. A reachable lab gateway.

**Steps.** Run these in order and record the output.

1. Ping the lab gateway a few times. Replace the address with your VM's actual gateway.

   ```bash
   gw=$(ip route | awk '/^default/ {print $3; exit}')
   echo "$gw"
   ping -c 3 "$gw"
   ```

2. Inspect the neighbor table for IPv4 and IPv6.

   ```bash
   ip neigh show
   ip -6 neigh show
   ```

3. Flush one entry and watch it resolve again.

   ```bash
   sudo ip neigh del "$gw" dev "$(ip route | awk '/^default/ {print $5; exit}')" 2>/dev/null || true
   ip neigh show | grep -F "$gw" || echo "entry absent"
   ping -c 1 "$gw" >/dev/null
   ip neigh show | grep -F "$gw"
   ```

**Expected observation.** A resolved IPv4 neighbor is `REACHABLE` or `STALE` and has a MAC address. `INCOMPLETE` means the host is trying to resolve the address. IPv6 uses neighbor solicitation and advertisement rather than ARP.

**Prove it.** Save the before-and-after neighbor output. Note the state transitions.

**Reflect.** Why can a `REACHABLE` ARP entry be stale even when the host is down? What does an `INCOMPLETE` state tell you that a failed ping does not?

## NET-04 — Trace the DNS resolution path

**Goal.** Identify which resolver your system uses and whether the answer came from cache or the network.

**Prerequisites.** NET-01. `dig` installed.

**Steps.** Run these in order and record the output.

1. Inspect resolver configuration and name-service order.

   ```bash
   cat /etc/resolv.conf
   cat /etc/nsswitch.conf | grep '^hosts'
   resolvectl status 2>/dev/null || echo "systemd-resolved status unavailable"
   ```

2. Resolve a documentation domain through the system path.

   ```bash
   getent ahosts example.com
   dig example.com A +noall +answer +stats
   ```

3. Query the local stub directly and compare timing.

   ```bash
   dig @127.0.0.53 example.com A +noall +answer +stats 2>/dev/null || true
   ```

**Expected observation.** `/etc/resolv.conf` may point at `127.0.0.53`, a local stub resolver, rather than an external server. `dig` reports `Query time` and `SERVER`; a very low query time may indicate a cache. `getent` follows `nsswitch.conf` and may consult `/etc/hosts` before DNS.

**Prove it.** Save the resolver configuration and one query with its `SERVER` and `Query time` fields. State whether the answer was cached.

**Reflect.** Why is "DNS is broken" often actually an `/etc/hosts`, search-domain, or routing problem? What changes when `nsswitch.conf` lists `files` before `dns`?

## NET-05 — Reason about DNS record types

**Goal.** Read common DNS records and infer what each one is used for.

**Prerequisites.** NET-04. Network access for ordinary DNS queries, or a local lab resolver.

**Steps.** Run these in order and record the output.

1. Query address, mail, name-server, and text records.

   ```bash
   dig example.com A +noall +answer
   dig example.com AAAA +noall +answer
   dig example.com MX +noall +answer
   dig example.com NS +noall +answer
   dig example.com TXT +noall +answer
   ```

2. Inspect the authority and additional sections for one query.

   ```bash
   dig example.com NS +noall +authority +additional
   ```

3. Query a deliberately nonexistent name and read the status.

   ```bash
   dig "no-such-name-$(date +%s).example.com" A +noall +comments +stats
   ```

**Expected observation.** `A` and `AAAA` map names to addresses, `MX` identifies mail exchangers with priorities, `NS` delegates a zone, and `TXT` carries arbitrary text such as policy records. `NXDOMAIN` means the name does not exist; `SERVFAIL` means the resolver could not complete the query, which is a different failure.

**Prove it.** Save one example of each record type and a one-line explanation of what each proves.

**Reflect.** Why is `TXT` both useful for policy and risky for data exfiltration? What is the difference between an authoritative answer and a cached answer?

## NET-06 — Demonstrate resolution order with `/etc/hosts`

**Goal.** Show that name resolution is a policy decision, not only a DNS query.

**Prerequisites.** NET-04. Sudo.

**Steps.** Run these in order and record the output.

1. Add a temporary mapping for a documentation hostname.

   ```bash
   echo "192.0.2.50 lab-web.example.test" | sudo tee -a /etc/hosts
   getent hosts lab-web.example.test
   ```

2. Query DNS for the same name and compare.

   ```bash
   dig lab-web.example.test A +noall +answer +comments
   ```

3. Remove only the line you added. Keep a backup first.

   ```bash
   sudo cp /etc/hosts ~/lab-data/hosts.backup
   sudo sed -i '/lab-web\.example\.test/d' /etc/hosts
   getent hosts lab-web.example.test || echo "mapping removed"
   ```

**Expected observation.** `getent` returns `192.0.2.50` from the hosts file, while `dig` asks DNS and likely returns `NXDOMAIN`. `getent` follows `nsswitch.conf`; `dig` bypasses the hosts file. The `.test` suffix is reserved for testing.

**Prove it.** Save the `getent` result, the DNS result, and the post-cleanup check. Diff the hosts file against the backup.

**Reflect.** How could a malicious hosts-file entry redirect a user without changing DNS? Why should endpoint integrity monitoring include `/etc/hosts`?

## NET-07 — Read an HTTP exchange

**Goal.** Inspect request and response headers for a local server and explain status codes.

**Prerequisites.** NET-01. `python3` and `curl`.

**Steps.** Run these in order and record the output.

1. Start a loopback HTTP server.

   ```bash
   mkdir -p ~/lab-data/http-root
   printf 'hello from the lab\n' > ~/lab-data/http-root/index.html
   (cd ~/lab-data/http-root && python3 -m http.server 8000 --bind 127.0.0.1) &
   http_pid=$!
   sleep 1
   ```

2. Request the page and show headers.

   ```bash
   curl -v --max-time 5 http://127.0.0.1:8000/ 2>&1 | sed -n '1,40p'
   ```

3. Request a missing path and inspect the status.

   ```bash
   curl -s -o /dev/null -w 'status=%{http_code}\n' http://127.0.0.1:8000/missing
   ```

4. Stop the server.

   ```bash
   kill "$http_pid"
   ```

**Expected observation.** The request line includes the method, path, and HTTP version. The response includes a status line, `Content-Type`, `Content-Length`, and `Server`. `200` means success; `404` means the path was not found. `curl -v` also shows connection establishment and TLS details if HTTPS is used.

**Prove it.** Save the full request and response headers, plus the status code for the missing path.

**Reflect.** Which response header could leak software versions, and why does that matter? Why is a `404` not automatically a security finding?

## NET-08 — Inspect a TLS handshake and certificate

**Goal.** Observe certificate identity, protocol version, cipher, and verification failure for a self-signed local certificate.

**Prerequisites.** NET-07. `openssl`.

**Steps.** Run these in order and record the output.

1. Create a one-day self-signed certificate for a local name.

   ```bash
   mkdir -p ~/lab-data/tls && cd ~/lab-data/tls
   openssl req -x509 -newkey rsa:2048 -nodes -days 1 \
     -keyout key.pem -out cert.pem \
     -subj "/CN=lab.local" \
     -addext "subjectAltName=DNS:lab.local,IP:127.0.0.1"
   ```

2. Start a local TLS server.

   ```bash
   openssl s_server -accept 8443 -cert cert.pem -key key.pem -www &
   tls_pid=$!
   sleep 1
   ```

3. Connect and inspect the negotiated session and certificate.

   ```bash
   openssl s_client -connect 127.0.0.1:8443 -servername lab.local -showcerts </dev/null 2>&1 | sed -n '1,60p'
   ```

4. Confirm that curl rejects the untrusted certificate unless you opt out.

   ```bash
   curl -sS https://127.0.0.1:8443/ -o /dev/null || echo "verification failed as expected"
   curl -ksS https://127.0.0.1:8443/ -o /dev/null -w 'with -k: %{http_code}\n'
   ```

5. Stop the server.

   ```bash
   kill "$tls_pid"
   ```

**Expected observation.** The certificate has `CN=lab.local` and a subject alternative name for `lab.local` and `127.0.0.1`. `openssl s_client` prints the protocol, cipher, and verification result. Curl fails with a certificate verification error because the certificate is self-signed; `-k` bypasses verification and must never be used to make a production problem disappear.

**Prove it.** Save the certificate subject, SAN, protocol, cipher, and the curl error. Explain what a trusted chain would add.

**Reflect.** Why is a matching common name not enough without a trusted chain? What does `-k` disable, and when is it acceptable in a lab?

## NET-09 — Read security-relevant response headers

**Goal.** Evaluate browser security headers on a local response.

**Prerequisites.** NET-07.

**Steps.** Run these in order and record the output.

1. Reuse the loopback server, or start it again.

   ```bash
   (cd ~/lab-data/http-root && python3 -m http.server 8000 --bind 127.0.0.1) &
   http_pid=$!
   sleep 1
   curl -sI http://127.0.0.1:8000/
   ```

2. List which common protections are absent.

   ```bash
   curl -sI http://127.0.0.1:8000/ | grep -Ei 'content-security-policy|strict-transport-security|x-content-type-options|referrer-policy|x-frame-options' || echo "none of the common security headers are present"
   ```

3. Stop the server.

   ```bash
   kill "$http_pid"
   ```

**Expected observation.** Python's simple HTTP server typically sends `Server`, `Date`, `Content-Type`, and `Content-Length` but no security headers. Absence is expected in this lab; the exercise is to explain the protection each header would add. HSTS only applies over HTTPS and should not be sent on plain HTTP.

**Prove it.** Save the headers and a five-row table: header, missing or present, protection it adds, and whether it fits this app.

**Reflect.** Why is a header not a substitute for fixing an injection flaw? Which header would reduce the impact of a cross-site scripting bug, and which would not?

## NET-10 — Capture a TCP handshake and teardown

**Goal.** Capture a complete local HTTP connection and identify SYN, SYN-ACK, ACK, and FIN flags.

**Prerequisites.** NET-07. Sudo and `tcpdump`.

**Steps.** Run these in order and record the output.

1. Start a loopback HTTP server.

   ```bash
   (cd ~/lab-data/http-root && python3 -m http.server 8000 --bind 127.0.0.1) &
   http_pid=$!
   ```

2. Start a bounded capture, generate one request, and wait for the capture to exit.

   ```bash
   sudo timeout 12 tcpdump -i lo -n -c 12 -w ~/lab-data/tcp-handshake.pcap 'tcp port 8000' &
   cap_pid=$!
   sleep 1
   curl -s http://127.0.0.1:8000/ -o /dev/null
   wait "$cap_pid" || true
   ```

3. Read the capture with flags and sequence numbers.

   ```bash
   sudo tcpdump -nr ~/lab-data/tcp-handshake.pcap 'tcp' | head -n 20
   ```

4. Stop the server.

   ```bash
   kill "$http_pid"
   ```

**Expected observation.** You should see `[S]`, `[S.]`, `[.]`, then the HTTP payload, then `[F.]` and `[.]`. Sequence and acknowledgment numbers show the three-way handshake and orderly close. A reset (`[R]`) would indicate an abortive close or a port with no listener.

**Prove it.** Save the decoded packet list and annotate each flag. Record the filter and packet count in your notes.

**Reflect.** What can you infer from a SYN followed by a RST? What can you not infer without seeing the response?

## NET-11 — Capture DNS queries and responses

**Goal.** Observe a DNS transaction on the wire and read the query, response, and rcode.

**Prerequisites.** NET-04. Sudo, `dig`, `tcpdump`.

**Steps.** Run these in order and record the output.

1. Start a capture for port 53 on all interfaces.

   ```bash
   sudo timeout 12 tcpdump -i any -n -c 10 -w ~/lab-data/dns-query.pcap 'port 53' &
   cap_pid=$!
   sleep 1
   ```

2. Force an uncached query with a random name under the reserved `.example.com` domain.

   ```bash
   dig "probe-$(date +%s).example.com" A +noall +comments +stats
   wait "$cap_pid" || true
   ```

3. Read the query and response.

   ```bash
   sudo tcpdump -nr ~/lab-data/dns-query.pcap 'udp port 53' | head -n 12
   ```

**Expected observation.** The capture shows a standard query for the random name and a response with `NXDOMAIN` or `NOERROR`. The transaction ID in the query and response should match. If the local stub answers from cache, the capture may show no packet; use `+tries=1` and a random name or query a lab resolver directly.

**Prove it.** Save the pcap and a two-line summary: query name, response code, resolver address.

**Reflect.** Why can DNS metadata be valuable to an investigator even when payloads are encrypted? What does a high volume of unique subdomains under one parent suggest, and what benign explanation could exist?

## NET-12 — Summarize a capture with protocol statistics

**Goal.** Use capture statistics to move from thousands of packets to a small set of questions.

**Prerequisites.** NET-10. `tshark` and `capinfos` (install `tshark` in the lab if needed).

**Steps.** Run these in order and record the output.

1. Read capture metadata.

   ```bash
   capinfos ~/lab-data/tcp-handshake.pcap
   ```

2. Show protocol hierarchy and TCP conversations.

   ```bash
   tshark -r ~/lab-data/tcp-handshake.pcap -q -z io,phs
   tshark -r ~/lab-data/tcp-handshake.pcap -q -z conv,tcp
   ```

3. Extract HTTP requests.

   ```bash
   tshark -r ~/lab-data/tcp-handshake.pcap -Y 'http.request' -T fields -e ip.src -e ip.dst -e http.request.method -e http.request.uri
   ```

**Expected observation.** `capinfos` reports packet count, duration, and file size. The protocol hierarchy shows TCP and HTTP. The conversation table shows bytes and packets per direction. `tshark` display filters use a different syntax from `tcpdump` capture filters; mixing them up is a common source of empty output.

**Prove it.** Save the three summaries. Write one question that each summary can answer.

**Reflect.** Why is a conversation table more useful than a raw packet list for triage? What privacy risk exists in a pcap that contains payloads?

## NET-13 — Follow a TCP stream and reconstruct HTTP

**Goal.** Reassemble an application-layer request from a capture.

**Prerequisites.** NET-10 and NET-12. `tshark`.

**Steps.** Run these in order and record the output.

1. List TCP streams.

   ```bash
   tshark -r ~/lab-data/tcp-handshake.pcap -q -z conv,tcp
   ```

2. Follow the first stream as ASCII.

   ```bash
   tshark -r ~/lab-data/tcp-handshake.pcap -q -z follow,tcp,ascii,0
   ```

3. Extract the HTTP host and user agent fields directly.

   ```bash
   tshark -r ~/lab-data/tcp-handshake.pcap -Y 'http.request' -T fields -e http.host -e http.user_agent
   ```

**Expected observation.** The stream shows the request line `GET / HTTP/1.1`, a `Host` header, and the response body `hello from the lab`. Following a stream reassembles segments in sequence order; it does not prove the application processed the request.

**Prove it.** Save the reconstructed stream and the extracted fields. Explain the difference between "the packet arrived" and "the server acted on it".

**Reflect.** How would you reconstruct a conversation that used multiple TCP connections? Why is stream reassembly important for incident evidence?

## NET-14 — Test MTU and fragmentation behavior

**Goal.** Show why a 1500-byte Ethernet MTU limits ICMP payload size and how `-M do` exposes the limit.

**Prerequisites.** NET-01. Sudo for network namespaces.

**Steps.** Run these in order and record the output.

1. Create two namespaces connected by a veth pair with MTU 1500.

   ```bash
   sudo ip netns add mtu-a && sudo ip netns add mtu-b
   sudo ip link add mtu-a0 type veth peer name mtu-b0
   sudo ip link set mtu-a0 netns mtu-a
   sudo ip link set mtu-b0 netns mtu-b
   sudo ip netns exec mtu-a ip addr add 192.0.2.1/24 dev mtu-a0
   sudo ip netns exec mtu-b ip addr add 192.0.2.2/24 dev mtu-b0
   sudo ip netns exec mtu-a ip link set mtu-a0 mtu 1500 up
   sudo ip netns exec mtu-b ip link set mtu-b0 mtu 1500 up
   ```

2. Ping with a payload that exactly fills the MTU, then one byte more.

   ```bash
   sudo ip netns exec mtu-a ping -c 2 -M do -s 1472 192.0.2.2
   sudo ip netns exec mtu-a ping -c 2 -M do -s 1473 192.0.2.2
   ```

3. Remove only these lab namespaces.

   > **Destructive — lab only.** These commands delete the two namespaces you just created.

   ```bash
   sudo ip netns del mtu-a
   sudo ip netns del mtu-b
   ```

**Expected observation.** `1472` bytes of ICMP payload plus 8 bytes of ICMP header plus 20 bytes of IPv4 header equals 1500. The larger packet fails with a local "message too long" or fragmentation-needed error because `-M do` sets the Don't Fragment bit. Without DF, the packet might fragment instead, which changes the failure mode.

**Prove it.** Save both ping outputs and the arithmetic. Explain the difference between a local MTU error and a remote black hole.

**Reflect.** Why does a VPN or tunnel reduce the usable MTU? How would you distinguish an MTU problem from packet loss?

## NET-15 — Read a traceroute without overclaiming

**Goal.** Interpret hops, timeouts, and asymmetry honestly.

**Prerequisites.** NET-01. `traceroute` or `tracepath` installed.

**Steps.** Run these in order and record the output.

1. Run a one-hop trace to your lab gateway.

   ```bash
   gw=$(ip route | awk '/^default/ {print $3; exit}')
   traceroute -n -m 3 "$gw" 2>/dev/null || tracepath -n "$gw"
   ```

2. Examine this synthetic trace to a documentation host. It is illustrative, not a live target.

   ```text
   traceroute to 203.0.113.20 (203.0.113.20), 30 hops max, 60 byte packets
    1  192.0.2.1       1.123 ms  1.087 ms  1.041 ms
    2  * * *
    3  198.51.100.9    8.442 ms  8.391 ms  8.377 ms
    4  203.0.113.20   12.004 ms 11.982 ms 11.955 ms
   ```

3. Write down three explanations for the silent second hop.

**Expected observation.** A `* * *` row means no ICMP Time Exceeded message arrived within the timeout; it does not prove the router is malicious or that a firewall is blocking the destination. The path may be asymmetric, and return traffic can take a different route. Hop addresses are router interfaces, not necessarily the final host.

**Prove it.** Save the live one-hop output and your three explanations for the silent hop, ranked by likelihood.

**Reflect.** Why is traceroute evidence weaker than it appears? What other data would confirm where packets are dropped?

## NET-16 — Inventory local ports with two tools

**Goal.** Compare `ss` and `nmap` results for the loopback interface and explain differences.

**Prerequisites.** NET-01. `ss`, and `nmap` installed in the lab.

**Steps.** Run these in order and record the output.

1. List listeners with process ownership.

   ```bash
   sudo ss -tulpn
   ```

2. Scan only loopback, using a TCP connect scan that does not need raw sockets.

   ```bash
   nmap -sT --top-ports 100 127.0.0.1
   ```

3. Compare one open port in both outputs.

   ```bash
   sudo ss -tlnp | grep ':8000' || echo "no listener on 8000"
   ```

**Expected observation.** `ss` reports sockets the kernel knows about, including bind address and process. `nmap` reports what responded to a connection attempt. A service bound only to `127.0.0.1` appears in a loopback scan but not in a scan of another interface. `nmap` may miss a filtered or non-TCP service that `ss` shows.

**Prove it.** Save both outputs and a reconciliation table: port, protocol, bind address, process, `ss` result, `nmap` result.

**Reflect.** Why is scanning `127.0.0.1` acceptable in this drill while scanning a public address is not? What does a port state of `filtered` mean in `nmap` terms?

## NET-17 — Build a default-deny firewall in a namespace

**Goal.** Prove that a default-drop input policy blocks new traffic except an explicitly allowed port.

**Prerequisites.** NET-01 and NET-07. Sudo, `nftables`, `curl`.

**Steps.** Run these in order and record the output.

1. Create a client and server namespace with a veth link.

   ```bash
   sudo ip netns add fw-srv && sudo ip netns add fw-cli
   sudo ip link add fw-srv0 type veth peer name fw-cli0
   sudo ip link set fw-srv0 netns fw-srv
   sudo ip link set fw-cli0 netns fw-cli
   sudo ip netns exec fw-srv ip addr add 192.0.2.1/24 dev fw-srv0
   sudo ip netns exec fw-cli ip addr add 192.0.2.2/24 dev fw-cli0
   sudo ip netns exec fw-srv ip link set fw-srv0 up
   sudo ip netns exec fw-cli ip link set fw-cli0 up
   ```

2. Start a server inside the server namespace and confirm it is reachable before filtering.

   ```bash
   sudo ip netns exec fw-srv timeout 600 python3 -m http.server 8000 --bind 192.0.2.1 &
   sleep 2
   sudo ip netns exec fw-cli curl -s -o /dev/null -w 'before: %{http_code}\n' --max-time 5 http://192.0.2.1:8000/
   ```

3. Apply a default-drop input chain and allow only established traffic and TCP 8000.

   ```bash
   sudo ip netns exec fw-srv nft add table inet filter
   sudo ip netns exec fw-srv nft 'add chain inet filter input { type filter hook input priority 0; policy drop; }'
   sudo ip netns exec fw-srv nft add rule inet filter input ct state established,related accept
   sudo ip netns exec fw-srv nft add rule inet filter input tcp dport 8000 accept
   ```

4. Test the allowed port and a port that is not allowed.

   ```bash
   sudo ip netns exec fw-cli curl -s -o /dev/null -w 'after 8000: %{http_code}\n' --max-time 5 http://192.0.2.1:8000/
   sudo ip netns exec fw-cli curl -s -o /dev/null -w 'after 8001: %{http_code}\n' --max-time 5 http://192.0.2.1:8001/ || echo "8001 blocked as expected"
   ```

5. Clean up the lab namespaces.

   > **Destructive — lab only.** This deletes the namespaces and their virtual interfaces.

   ```bash
   sudo ip netns del fw-srv
   sudo ip netns del fw-cli
   ```

**Expected observation.** The first request returns `200`; after the policy, port 8000 still returns `200` while port 8001 times out. The established/related rule is what allows return traffic for connections that the server initiated or that were already accepted. Order matters: an accept rule before a drop rule changes the outcome.

**Prove it.** Save `nft list ruleset` and both curl results. Draw the packet path from client to server.

**Reflect.** Why is `ct state established,related accept` usually placed before service rules? What would happen to DNS if you applied this policy to a real host without allowing port 53?

## NET-18 — Segment two networks with a router

**Goal.** Show that reachability between segments depends on routing and forwarding, and that routing alone is not a security policy.

**Prerequisites.** NET-17. Sudo.

**Steps.** Run these in order and record the output.

1. Create two client segments and a router namespace.

   ```bash
   sudo ip netns add seg-a && sudo ip netns add seg-b && sudo ip netns add seg-r
   sudo ip link add a0 type veth peer name r-a
   sudo ip link add b0 type veth peer name r-b
   sudo ip link set a0 netns seg-a && sudo ip link set r-a netns seg-r
   sudo ip link set b0 netns seg-b && sudo ip link set r-b netns seg-r
   sudo ip netns exec seg-a ip addr add 192.0.2.10/24 dev a0
   sudo ip netns exec seg-b ip addr add 198.51.100.10/24 dev b0
   sudo ip netns exec seg-r ip addr add 192.0.2.1/24 dev r-a
   sudo ip netns exec seg-r ip addr add 198.51.100.1/24 dev r-b
   sudo ip netns exec seg-a ip link set a0 up
   sudo ip netns exec seg-b ip link set b0 up
   sudo ip netns exec seg-r ip link set r-a up
   sudo ip netns exec seg-r ip link set r-b up
   sudo ip netns exec seg-a ip route add default via 192.0.2.1
   sudo ip netns exec seg-b ip route add default via 198.51.100.1
   ```

2. Enable forwarding and test reachability.

   ```bash
   sudo ip netns exec seg-r sysctl -w net.ipv4.ip_forward=1
   sudo ip netns exec seg-a ping -c 2 198.51.100.10
   ```

3. Disable forwarding and test again.

   ```bash
   sudo ip netns exec seg-r sysctl -w net.ipv4.ip_forward=0
   sudo ip netns exec seg-a ping -c 2 -W 2 198.51.100.10 || echo "blocked when forwarding is off"
   ```

4. Clean up.

   > **Destructive — lab only.** This deletes the three namespaces.

   ```bash
   sudo ip netns del seg-a
   sudo ip netns del seg-b
   sudo ip netns del seg-r
   ```

**Expected observation.** With forwarding enabled, A reaches B through the router. With forwarding disabled, the router drops transit packets. However, with forwarding enabled, all ports between segments are reachable; segmentation becomes a security control only when paired with firewall policy and least-privilege flows.

**Prove it.** Save both ping results and `ip netns exec seg-r nft list ruleset` (likely empty). Explain why an empty ruleset means "routing, not policy".

**Reflect.** What flows would you allow between a web tier and a database tier? Why is "same VLAN" a weak security boundary?

## NET-19 — Observe NAT translation

**Goal.** See source NAT change a client address and correlate the translation with a conntrack entry.

**Prerequisites.** NET-17 and NET-18. Sudo, `nftables`, `tcpdump`, `curl`.

**Steps.** Run these in order and record the output.

1. Build client, router, and server namespaces with two veth links.

   ```bash
   sudo ip netns add nat-c && sudo ip netns add nat-r && sudo ip netns add nat-s
   sudo ip link add c0 type veth peer name r-c
   sudo ip link add s0 type veth peer name r-s
   sudo ip link set c0 netns nat-c && sudo ip link set r-c netns nat-r
   sudo ip link set s0 netns nat-s && sudo ip link set r-s netns nat-r
   sudo ip netns exec nat-c ip addr add 192.0.2.10/24 dev c0
   sudo ip netns exec nat-r ip addr add 192.0.2.1/24 dev r-c
   sudo ip netns exec nat-r ip addr add 198.51.100.1/24 dev r-s
   sudo ip netns exec nat-s ip addr add 198.51.100.2/24 dev s0
   sudo ip netns exec nat-c ip link set c0 up
   sudo ip netns exec nat-s ip link set s0 up
   sudo ip netns exec nat-r ip link set r-c up
   sudo ip netns exec nat-r ip link set r-s up
   sudo ip netns exec nat-c ip route add default via 192.0.2.1
   sudo ip netns exec nat-s ip route add default via 198.51.100.1
   sudo ip netns exec nat-r sysctl -w net.ipv4.ip_forward=1
   ```

2. Add a masquerade rule on the router's server-facing interface.

   ```bash
   sudo ip netns exec nat-r nft add table ip nat
   sudo ip netns exec nat-r nft 'add chain ip nat postrouting { type nat hook postrouting priority 100; }'
   sudo ip netns exec nat-r nft add rule ip nat postrouting oifname "r-s" masquerade
   ```

3. Start a server, capture on the router's server link, and request the page from the client.

   ```bash
   sudo ip netns exec nat-s timeout 600 python3 -m http.server 8000 --bind 198.51.100.2 &
   sleep 2
   sudo ip netns exec nat-r timeout 10 tcpdump -i r-s -n -c 6 'tcp port 8000' &
   cap_pid=$!
   sleep 1
   sudo ip netns exec nat-c curl -s -o /dev/null -w 'status: %{http_code}\n' --max-time 5 http://198.51.100.2:8000/
   wait "$cap_pid" || true
   ```

4. Inspect the translation state, then clean up.

   ```bash
   sudo ip netns exec nat-r cat /proc/net/nf_conntrack 2>/dev/null | grep 8000 || echo "conntrack table not readable"
   ```

   > **Destructive — lab only.** This deletes the three namespaces.

   ```bash
   sudo ip netns del nat-c
   sudo ip netns del nat-r
   sudo ip netns del nat-s
   ```

**Expected observation.** The capture on `r-s` shows the source as `198.51.100.1`, not `192.0.2.10`; the conntrack entry maps the original client socket to the translated router socket for the return path. NAT hides the client address from the server, which complicates attribution and logging.

**Prove it.** Save the capture summary and conntrack line. Explain why the server's access log records the router, not the client.

**Reflect.** What breaks when a firewall performs NAT but logs only post-translation addresses? How would you preserve client identity for an investigation?

## NET-20 — Read a DHCP lease and the DORA exchange

**Goal.** Identify whether an address is static or leased, and explain the four-step DHCP exchange.

**Prerequisites.** NET-01. `ip`, and `NetworkManager` or `systemd-networkd` on the VM.

**Steps.** Run these in order and record the output.

1. Show the current address and lease metadata.

   ```bash
   ip -4 addr show
   networkctl status 2>/dev/null | head -n 40 || true
   nmcli -f IP4.ADDRESS,IP4.GATEWAY,IP4.DNS device show 2>/dev/null | head -n 30 || true
   ```

2. Search client logs for DHCP events.

   ```bash
   journalctl -u NetworkManager --since "7 days ago" --no-pager 2>/dev/null | grep -iE 'dhcp|lease' | tail -n 20
   journalctl -u systemd-networkd --since "7 days ago" --no-pager 2>/dev/null | grep -iE 'dhcp|lease' | tail -n 20
   ```

3. Read a lease file if one exists.

   ```bash
   sudo find /var/lib/NetworkManager /var/lib/systemd -maxdepth 2 -type f -iname '*lease*' 2>/dev/null | head
   ```

**Expected observation.** A DHCP-client address usually has a finite `valid_lft` and a lease file with server identifier, lease time, and DNS servers. The DORA exchange is Discover, Offer, Request, Acknowledge. A static address has no lease or server identifier. Seeing a lease does not prove the server is trustworthy.

**Prove it.** Save the address with lifetime and one log line showing the lease event. Sketch the DORA exchange with source and destination addresses.

**Reflect.** Why is an unauthorized DHCP server a serious network threat? What would you monitor to detect one?

## NET-21 — Inspect IPv6 addressing and dual stack

**Goal.** Identify link-local, global, and privacy addresses, and check whether services listen on IPv6.

**Prerequisites.** NET-01.

**Steps.** Run these in order and record the output.

1. Show IPv6 addresses, routes, and the disable flag.

   ```bash
   ip -6 addr show
   ip -6 route
   sysctl net.ipv6.conf.all.disable_ipv6
   ```

2. Test loopback and inspect listeners.

   ```bash
   ping -6 -c 2 ::1
   sudo ss -6 -tulpn
   ```

3. Check whether a local HTTP server binds IPv4 only or both families.

   ```bash
   python3 -m http.server 8000 --bind 127.0.0.1 &
   http_pid=$!
   sleep 1
   sudo ss -tlnp | grep 8000
   kill "$http_pid"
   ```

**Expected observation.** Every IPv6 interface normally has a link-local `fe80::/10` address; global addresses may come from router advertisements (SLAAC) or DHCPv6. Privacy extensions create temporary addresses. A server bound to `127.0.0.1` is not reachable over IPv6; `::1` is the IPv6 loopback. Dual-stack hosts need firewall rules for both families.

**Prove it.** Save the address and listener output. Note one service that is IPv4-only and one that listens on both.

**Reflect.** Why can an IPv6 host be reachable even when its IPv4 firewall is strict? What does a link-local address require in a URL?

## NET-22 — Troubleshoot a wrong prefix length

**Goal.** Diagnose a connectivity failure caused by a subnet mask mismatch, then fix it without guessing.

**Prerequisites.** NET-01. Sudo.

**Steps.** Run these in order and record the output.

1. Build two namespaces with intentionally mismatched prefixes.

   ```bash
   sudo ip netns add mask-a && sudo ip netns add mask-b
   sudo ip link add ma0 type veth peer name mb0
   sudo ip link set ma0 netns mask-a
   sudo ip link set mb0 netns mask-b
   sudo ip netns exec mask-a ip addr add 192.0.2.10/25 dev ma0
   sudo ip netns exec mask-b ip addr add 192.0.2.129/25 dev mb0
   sudo ip netns exec mask-a ip link set ma0 up
   sudo ip netns exec mask-b ip link set mb0 up
   ```

2. Test and gather routing and neighbor evidence.

   ```bash
   sudo ip netns exec mask-a ping -c 2 -W 2 192.0.2.129 || echo "ping failed"
   sudo ip netns exec mask-a ip route get 192.0.2.129
   sudo ip netns exec mask-a ip neigh show
   ```

3. Fix only the prefix on the first namespace and retest.

   ```bash
   sudo ip netns exec mask-a ip addr replace 192.0.2.10/24 dev ma0
   sudo ip netns exec mask-a ping -c 2 192.0.2.129
   ```

4. Clean up.

   > **Destructive — lab only.** This deletes the two namespaces.

   ```bash
   sudo ip netns del mask-a
   sudo ip netns del mask-b
   ```

**Expected observation.** With `/25`, `192.0.2.129` is outside A's subnet, so A tries a default route (absent) and fails; `ip route get` reports unreachable or a missing gateway. After changing to `/24`, the destination is on-link, ARP resolves, and ping succeeds. The fix is a prefix correction, not a firewall change.

**Prove it.** Save the failed ping, `ip route get`, and the successful ping after the fix. Write a three-step diagnostic sequence.

**Reflect.** Why is "ping failed" not a diagnosis? Which layer would you test first: link, address, route, or application?

## NET-23 — Capture with metadata and handle it responsibly

**Goal.** Produce a minimal, documented capture and a hash manifest suitable for evidence.

**Prerequisites.** NET-10. Sudo, `tcpdump`, `sha256sum`.

**Steps.** Run these in order and record the output.

1. Capture only loopback HTTP with a bounded snap length and packet count.

   ```bash
   (cd ~/lab-data/http-root && python3 -m http.server 8000 --bind 127.0.0.1) &
   http_pid=$!
   sudo timeout 15 tcpdump -i lo -n -s 96 -c 20 -w ~/lab-data/http-snaplen.pcap 'tcp port 8000' &
   cap_pid=$!
   sleep 1
   curl -s http://127.0.0.1:8000/ -o /dev/null
   wait "$cap_pid" || true
   kill "$http_pid"
   ```

2. Record metadata and hash the file.

   ```bash
   capinfos ~/lab-data/http-snaplen.pcap 2>/dev/null || tcpdump -nr ~/lab-data/http-snaplen.pcap | wc -l
   sha256sum ~/lab-data/http-snaplen.pcap | tee ~/lab-data/http-snaplen.pcap.sha256
   ```

3. Note what the snap length omitted.

   ```bash
   sudo tcpdump -nr ~/lab-data/http-snaplen.pcap -A 'tcp port 8000' | sed -n '1,30p'
   ```

**Expected observation.** A 96-byte snap length captures headers and only a small part of the payload, reducing size and privacy exposure but potentially truncating the evidence you need. The hash proves the file is unchanged after capture. The metadata should include interface, filter, snap length, count, start time, and collector.

**Prove it.** Save the pcap, `.sha256`, and a metadata note. State one question this capture cannot answer because of truncation.

**Reflect.** Why is capturing full payloads sometimes legally risky? What is the minimum metadata you would require from someone else's capture?

## NET-24 — Review a segmented lab architecture

**Goal.** Apply trust boundaries and least-privilege flow reasoning to a documented network design.

**Prerequisites.** NET-01 through NET-23. No commands required.

**Steps.** Run these in order and record the output.

1. Review this synthetic topology. All addresses are documentation ranges.

   | Zone | Prefix | Assets | Inbound from internet | Outbound |
   | --- | --- | --- | --- | --- |
   | Edge | `198.51.100.0/24` | Reverse proxy, WAF | TCP 443 | App tier TCP 8080 |
   | App | `192.0.2.0/24` | Three app servers | Edge only, TCP 8080 | Data tier TCP 5432; DNS |
   | Data | `203.0.113.0/24` | Primary and replica database | App only, TCP 5432 | None |
   | Admin | `203.0.113.128/25` | Jump host, monitoring | VPN only, TCP 22/443 | All zones, logged |

2. Build a data-flow matrix with columns: source zone, destination zone, port, purpose, encryption, authentication, logging location.

3. Identify three trust-boundary weaknesses and propose one control for each.

4. Write a gap list for logging: which flows cross a boundary without a sensor?

**Expected observation.** A strong answer notes that the admin prefix sits inside the data `/24`, that the reverse proxy has broad outbound access, that database replication traffic may not be logged, and that "VPN only" is not a control unless the VPN itself is monitored and segmented. A data-flow matrix exposes flows that a zone diagram hides.

**Prove it.** Save the matrix, three weaknesses with controls, and a one-page summary. Do not change any real network.

**Reflect.** Which single flow would you restrict first, and what would break? How does least privilege apply to network flows, not just user accounts?

## Set review

You should now be able to:

- Read addresses, routes, and neighbor state without guessing.
- Calculate a subnet and explain why a wrong mask breaks connectivity.
- Capture and decode DNS, TCP, HTTP, and TLS traffic you generated.
- Explain what a firewall rule allows, not just that it exists.
- Distinguish routing, NAT, and policy as separate controls.
- Document a capture with provenance and privacy limits.

## References

- [Wireshark User's Guide](https://www.wireshark.org/docs/) — protocol dissection and capture analysis.
- [OpenSSL documentation](https://www.openssl.org/docs/) — TLS and certificate commands.
- [Linux man-pages project](https://man7.org/linux/man-pages/) — `ip`, `tcpdump`, `ss`, and socket documentation.
- [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737) — IPv4 documentation address blocks.
- [RFC 3849](https://www.rfc-editor.org/rfc/rfc3849) — IPv6 documentation prefix.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — risk-management context for segmentation and monitoring.

---

**Related:** [Exercise index](README.md) · [Linux drills](linux-drills.md) · [Web security drills](web-security-drills.md) · [Home lab checklist](../checklists/home-lab.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md) · [Contributing](../CONTRIBUTING.md)

Last reviewed: 2026-10-31

# Networking for Node Programmers

## Aria Stewart
### @aredridel

----

My first real job was doing tech support at an Internet service provider.

We had 8 modems, 8 phone lines, and a 56 Kbps frame-relay leased line.

----

# A little UNIX history

^ The early Internet was a handful of nodes. Minicomputers, merely the size of a refrigerator were becoming available. A university might have one, maybe two machines, shared among staff and students.

^ PDP 10s and PDP 11s were being brought online. Batch processing was the norm, and quickly terminals to remotely access the machine were being introduced. There were early time sharing systems, allowing multiple users concurrent access to the computer, but the one we now know best is UNIX.

----

# Networking in the Age of Terminals

RS-422 serial connections to a computer elsewhere in the building.

100, 150, 300 bps modems, transmitting over standard phone lines.

^ If you wanted data to move between sites faster than that, you purchased access to raw copper from the phone company, a complete circuit. Or you bought tape and put it in a hatchback and drove it across the city.

^ Telephone systems were built to carry human voice. The audio for the human voice to be intelligible is actually a pretty narrow band, about 400-4000 hz. That's three and a half octaves on a piano. Phones commonly filtered frequencies outside that band, and the phone companies could limit those bands too to improve a signal over distance.

-----

# Leased lines and wide area wired networks

^ Eventually, voice was digitized at 64 kbps, 8 khz sampling, 8 bits per sample. This became the standard digital channel size, 32 channels per E1 line, the channel size of ISDN networks. X.25 came and went, and we started putting Frame Relay and ATM over digital lines. Cheaper, easier to to deploy networks like DSL were created. They can largely be treated as, in the case of Internet traffic, packets you put in one side come out the other in the same order. Expensive lines run at fixed rates and are very reliable; cheaper lines end up adapting to conditions and bandwidth guarantees are harder to make.

----

# Local networks

^ Local network designs have settled on the Ethernet family -- the 80s were full of new designs, token rings and bit-synchronous connections and serial busses, but now we use Ethernet-like networks for all but the most special tasks.

^ Local networks are defined by a lack of heirarchy: If nodes can talk to each other at all, they can talk to all the other nodes on the network. Nodes generally don't handle data for each other, and equipment is relatively simple. Addresses are hard coded, MAC addresses, since without heirarchy there is no need to categorize hosts by their address. It makes bootstrapping a network much easier if you don't have to key in addresses on every device, user interface or no.

^ In the OSI model, layer 0 is wires and layer 1 is electrical signals, layer 2 is the local area network protocols, governing which nodes can access any shared medium at the same time, and building this simple, relatively peer to peer network.

-----

## In the future, all networking technologies will be called Ethernet

## — Jon Postel

^ Local networks are also fairly stateless: The most memory routers have is whether a node has authenticated or not, and that's mostly been added in the form of 802.1x and WPA authentication. There are few if any retries if there is a failure sending. Jon wasn't wrong when he said this, because despite how different and stateful wireless Ethernet is, it's still called Ethernet. The name is too good.

----

# Moving Upward

## Layer 3

^ On top of Ethernet we put IP and IPv6. This is layer 3 of the OSI model: routing.  Each has a protocol for associating an IP address with a local MAC address if it is run on top of Ethernet, rather than one of those simple 'put packet in, packet comes out the other side' pipes. IP uses ARP: a simple broadcast.

^ If an IP that your computer is trying to contact shares the 'network' portion of the bits with its own IP, it sends out a simple broadcast asking "Does any host on this local network handle this IP?" If it gets a reply, it caches that and sends the IP packet addressed to the host that answered.

^ Most of the time, though, the IP is not similar, so a host will look up the MAC address of the router or gateway it is configured with (often with DHCP, also broadcast enough to get moving), and send the IP packet to that MAC address. The router can pass it on or discard it at its will.

----

# IP Addresses

One IP address maps to exactly one physical interface, a port on a computer or router somewhere. It _should_ be a globally unique identifier.

They are just 4 bytes. They have a 'network part' and a 'host part', the boundary is chosen when allocating a network out of the IP address space.

----

## IP Address examples

A simple case: `/24` — network part `5.6.7` host ID `8`

Complicated case: `/30` — network part `5.6.7` and 6 bits of `8`, host ID just 2 bits.

^ Network sizes are totally handled by hand. There's no way to tell how big a network is just by looking at a single IP.

^ Could be that a single interface has multiple IPs, but the same IP should not be on two interfaces, short of some Very Clever Tricks for redundancy... Or network address translation.

^ Since by definition a network shares an interface, we can now refer to that route with just the network bits, just use the host part as a wildcard.

^ Since a table of which globally unique address is on which port in every router is just too much information, IP networks can be grouped if they share a route and a prefix within a router. It might be that in Europe, it can be aggregated so that any IP starting with `4` can be routed to the United States -- a single entry in a table handling 16 million hosts.

^ The point here is to get the routing table to fit in memory. It's just now become feasible to just store the twhole table in RAM -- a decade ago, that was prohibitively expensive. And being more efficient now is still faster since we're pumping gigabits per second through even Tier 2 routers.

-----

# IPv6 Addresses

128-bit address, standardized the size of the network and host field: 64 bits each.

Network part `2001:0470:1f07:1247`

Host part `0218:51ff:fec8:2476`

^ Networks can still be aggregated, but the fixed size makes host addressing into a cut and paste job. You can tuck a whole MAC address in there (and the simplest address assignment protocols do just that) or even generate a random number.

----

# Routing

^ Each host looks in its routing table for which interface to put a packet on, drops it into the network, and the next hop picks it up and does the same. It's a very simple process. For the simple case of the host with a router that acts as a gateway, there are two entries: IPs on the local network do an ARP lookup, and send directly, IPs off the local network send to the router.

^ Things get interesting when we get to routers with multiple connections to the Internet. ISP routers sometimes have a couple configured routes -- whoever's cheapest to send traffic through -- but more often they talk to their neighbor routers over those expensive leased lines (or locally over Ethernet if they are in a peering facility together.)

----

# A routing example

```
:; traceroute -an 24.75.24.253
traceroute to 24.75.24.253 (24.75.24.253), 64 hops max, 52 byte packets
 1  [AS0] 172.16.12.1  2.165 ms  1.443 ms  3.788 ms
 2  [AS0] 172.16.6.1  11.284 ms  7.145 ms  1.912 ms
 3  [AS55158] 172.16.10.2  2.489 ms  1.467 ms  1.940 ms
 4  [AS12956] 193.152.56.217  2.528 ms  4.930 ms  3.260 ms
 5  [AS12956] 213.0.255.101  13.511 ms  5.696 ms  2.775 ms
 6  [AS3352] 81.46.7.45  13.681 ms  5.128 ms  10.136 ms
 7  [AS3352] 80.58.81.50  20.892 ms  5.581 ms  5.560 ms
 8  [AS0] 94.142.103.193  4.526 ms  2.966 ms  3.026 ms
```

^ So your computer has an address like `1.2.3.4` and is trying to talk to my server at `24.75.24.253`, The two IP addresses have different network parts, so your computer sends the packet to its router. Your router sends it to the connected router at the Internet provider. They probably pass it to a couple others inside the ISP, but then it gets to a place where it could say, send it on toward France, or toward Germany, or toward one of the trans-Atlantic cables. The shortest path to that system is transatlantic, so it passes the packet that way. Each decision is a simple lookup table, then passing the packet on. Routing looks at nothing else.

^ This goes from the private networks inside this room, to the building I'm guessing -- AS0 in this cases shows networks that aren't associated with backbone routing protocols.

^ Next we go to a network by Airnetworks with AS 55158, then to Telefonica Backbone, with AS 12956, then to another part of Telefonica at AS 3352 -- it looks like two companies merged, likely, but are separately maintained networks. Then on to another IP that's not known to BGP, the backbone routing protocol.

---

```
 9  [AS0] 94.142.120.158  44.286 ms
    [AS0] 94.142.117.66  36.946 ms
    [AS0] 176.52.250.238  29.169 ms
10  [AS12956] 84.16.12.30  107.763 ms
    [AS0] 94.142.116.205  107.449 ms  116.521 ms
11  [AS0] 94.142.127.97  151.301 ms
    [AS0] 176.52.251.45  137.797 ms
    [AS0] 94.142.122.206  117.940 ms
12  [AS0] 94.142.120.89  147.499 ms
    [AS0] 94.142.120.93  160.729 ms
```

^ Then our packets run through several routers with, then back to one known by the backbone, then more internal routes. This actually looks like it's all in Telefonica, this is regional routing, getting us out of Spain.

---

```
    [AS3356] 4.59.36.25  142.818 ms
13  [AS3356] 4.69.141.142  148.753 ms  146.815 ms
    [AS0] 94.142.125.73  165.002 ms
14  [AS3356] 4.69.141.142  152.096 ms
    [AS3356] 4.59.212.138  152.148 ms  145.159 ms
15  [AS19548] 24.75.24.134  149.514 ms  150.276 ms
    [AS3356] 4.59.212.138  153.591 ms
16  [AS19548] 24.75.24.230  148.211 ms  143.646 ms
    [AS19548] 24.75.24.134  160.627 ms
17  [AS19548] 24.75.24.253  144.855 ms
    [AS19548] 24.75.24.230  151.023 ms
    [AS19548] 24.75.24.253  148.004 ms
```

^ And here we jump into AS 3356 -- that one is registered to Level 3 Networks, which is actually based out of my home state of Colorado in the United States, and they run one of the large national backbone networks in the United States. Somewhere in here we made the transatlantic transit, but the latency numbers aren't revealing it, interestingly. The time across the Atlantic is about 50 ms, so we spent more time in switching locally within Spain than we did crossing the Atlantic.

^ Finally we end up at AS 19548, the Adelphia/Time Warner Cable network local to the upstate New York region where my server lives, about 200 miles from New York City.

----

# Routing gone wrong

^ One day in 2013, someone in Russia configured their router to say that they had a particularly short path to the rest of the Internet, and it would be most efficient to go that way. It might have been an accident, it might have been a state level attack on the Internet. For about four hours, about 1% of the Internet went through this relatively small Internet connection in Russia. Connections from California to other parts of California would be routed through it. Entire parts of the Internet went down briefly while the bogus route was filtered out. Lots of traffic was dropped because the connection was completely insufficient to pass as much as it received.

----

# Routing gone wrong
## A more recent example

On edge-router:

```
4.69.146.130/30 via fiberlink
4.69.146.128/26 via other-interior-router
```

On other-interior-router:

```
4.69.146.128/30 via edge-router
```

A packet destined for `4.69.146.132` comes in.

^ Generally routers match from most specific to most general if multiple routes match. In this example, the route ending in `/30` is the most specific -- it has the longest network part. The packet gets sent out the fiber link.

^ When the fiber link vanishes -- someone cuts a cable, trips on the router, reboots the other end -- that most specific route vanishes, the packets match the second. Since other-interior-router has a specific route for 4.69.146.128/30 back to router-with-deadlink, a loop that appears with a link dropping.

----

## What that looks like when it happens

```
PING ec2-52-10-227-158.us-west-2.compute.amazonaws.com (52.10.227.158) 56(84) bytes of data.
From ae-2-52.edge3.Berlin1.Level3.net (4.69.146.132) icmp_seq=1 Time to live exceeded
From ae-2-52.edge3.Berlin1.Level3.net (4.69.146.132) icmp_seq=2 Time to live exceeded
```

Oh-oh.

^ every IP packet is given a time to live. Every router decrements it when it passes it on. If it reaches zero in tansit, it drops it. sometimes it's even kind enough to send back a Time to live exceeded ICMP packet

----

## Traceroute

```
traceroute to validatestore-1-west.internal.npmjs.com (52.10.227.158), 30 hops max, 60 byte packets
 1  gateway (192.168.0.1)  5.578 ms
 2  10.22.0.1 (10.22.0.1)  11.979 ms
 3  rt1-przybyszewskiego-vlan503.core.icpnet.pl (62.21.99.162)  12.099 ms
 4  rt1-owsiana-vlan503.core.icpnet.pl (62.21.99.161)  16.891 ms
 5  e123-21.icpnet.pl (46.238.123.21)  18.925 ms
 6  e91-118.icpnet.pl (46.238.91.118)  16.603 ms
 7  e91-109.icpnet.pl (46.238.91.109)  21.524 ms
 8  212.162.43.49 (212.162.43.49)  26.788 ms
 ...
19  ae-34-52.ebr2.Berlin1.Level3.net (4.69.146.153)  23.436 ms
20  ae-2-52.edge3.Berlin1.Level3.net (4.69.146.132)  20.764 ms
21  ae-34-52.ebr2.Berlin1.Level3.net (4.69.146.153)  21.025 ms
22  ae-2-52.edge3.Berlin1.Level3.net (4.69.146.132)  21.003 ms
23  ae-34-52.ebr2.Berlin1.Level3.net (4.69.146.153)  13.704 ms
24  ae-2-52.edge3.Berlin1.Level3.net (4.69.146.132)  16.496 ms
25  ae-34-52.ebr2.Berlin1.Level3.net (4.69.146.153)  17.237 ms
26  ae-2-52.edge4.Berlin1.Level3.net (4.69.146.133)  13.848 ms
```

------


# Naming

^ In the beginning of the Internet, connecting a new system to the network was so rare that naming was not an interesting problem. Someone kept a text file table of what host names went to what IP addresses. Since computers were multi-million dollar investments, sending an email or making a phone call to get its host name into the hosts file that got passed around wasn't such a big deal. That file just got copied to `/etc/hosts` on Unix systems regularly.

^ Computers got cheaper, though, and hosts were added to the Internet faster than the editor could keep up with them, so a distributed, eventually-consistent database was created.

-----

# DNS

^ You need the IP for a hostname. Your computer asks its configured resolver, the resolver asks the roots, who return the top level domain servers, who the resolver queries for the next record, who gets a referral down until a server either has the answer or definitively does not. Each step is cacheable with a time to live, so it forms a global eventually consistent database. DNS can carry other information, too. MIT had a system called Hesiod as part of Project Athena that used DNS protocol for human and account information directory lookups, before LDAP was invented.

^ The delegation model for DNS is pretty clever and actually matches up with how organizations are structured. Trademark law and the perils of globlly unique naming aside, it's worked very well.

-----

# TCP

^ The TCP protocol is a large portion of why the Internet has been successful. By moving the complexity out of the network, it has made replacing networks with faster pipes very, very easy.

----

# TCP forms connections

Each connection is identified by a source and destination IP address and port:

`1.2.3.4 port 65211 to 5.6.7.8 port 80`

^ The source port is chosen randomly almost always in modern systems. The destination port is hard-coded, usually representing which service is being connected to. In this case, port 80 is HTTP.

^ A listening socket hasn't had its connected peer's side filled in yet, so you can think of it as all zeros -- which is why you get "EADDRINUSE" when you try to listen to a port that's already being listened on. That connection identifier is in use.

----

## TCP is for sharing.

^ TCP works by reporting back how much buffer space the each system has with each acknowledgement. A sending system can subtract what it has sent but is not acknowledged from that, and know how much it can send without having to wait.

^ There was a lot of debate during the creation of web browsers over how many connections and how many connections they could make to each site before it was hostile to others on the network, since each connection increased the relative number of chances there were to get through.

^ Each connection tracks how much space it expects each receiver has left in its buffers.  This is why when we write to sockets in node, we may get different size blocks back on the other end: we put data into our outgoing buffer, a slice that fills the smaller of a packet or the remaining buffer space at the receiver is sent -- it might be the 1400 or so bytes that fill an IP packet over Ethernet, or it might be only a few bytes because that is all we had to send, or it might be only some bytes because the receiver has only acknowledged that it has a few bytes of space to receive.

----

# Lost packets means slow down

There can only be a known number of packets in flight — one packet is easily recovered.

^ TCP follows a whole formula to control how fast it sends data, called the 'bandwidth delay product estimate'. Based on how long it takes to get an ACK of data in transit and whether packets get dropped or not.

^ Dropped packets are actually rare on backbones now. Buffers are large enough that there are delays instead -- which feed into the TCP rate control formula too.

-----

## Some effects of TCP

^ TCP starts slow, because it was designed for computers that by today's standards are very constrained. It assumes that there's only a tiny buffer to receive data on a remote host until they communicate for a bit, and it's not a very big field anyway, so a system can only send about 14 k of data without waiting for an ACK that tells it the buffer is bigger. This plays out in web requests, making a page smaller than 14k _significantly_ faster to send than one that's larger. Google in particular has been working on specs to modernize the startup time of TCP to account for our very fast links. Bandwidth keeps growing, but latency has been limited by the speed of light for some time now. The formula is a bit off, and the assumptions of reasonable places to start are a bit small.

------

# New Constraints

-----

# Mobile phones

## Sometimes high bandwidth.

## Very high latency.

^ Not to mention intermittent connectivity.

----

# Very high bandwidth

^ Now we don't have to worry about slow starting TCP very much, because computers have plenty of memory and buffer space is plentiful. But we can't ramp our speed up fast enough much of the time, because the initial values in TCP are very low for modern networks.

-----

# Convergence

^ IPv6 has finally become somewhat viable. Cellular carriers have started carrying voice traffic over IPv6.

-----

# Unevenly distributed future

^ The future is here. It's not evenly distributed. In many places in the world, cellular networks are the only internet connection, and in some places, 2G service is the norm. Data is a trickle. In other parts of the world, we have more bandwidth available to us in our pockets than we can easily use, and ten times the size of pipe that would have served an entire small ISP twenty years ago. We measure backbone capacity in gigabits, not megabits, nor like kilobits per second as we did in the 80s.

----

# Network Scale Limits

^ We're out of IPv4 addresses. There are no more available. ISPs have some left unassigned, Amazon has a nice stock for AWS. Allocations can be transferred, but they are now a precious resource. RIPE here in Europe ran out first, then ARIN in North America shortly after that. APNIC I think gave out their last blocks a few months ago. NAT, not just at the home router, but at the carrier or ISP will be completely normal next year. We will share IP addresses with entire cities or networks. Our approach to security policies can and must change.

-----

## Network Disintermediation

^ IPv6 started hitting its stride this year. AWS still doesn't support it, but Google does, Facebook does. Comcast, the largest consumer ISP in the US is now doing carrier-grade NAT across many many customers for IPv4. We are at a turning point, now, in networking, whether we'll continue intermediating in networks and running all data through central service providers or start using these extremely capable devices to their fullest and start designing hybrid peer-to-peer systems with servers as resources for connection and collaboration rather than as intermediaries.

-----

# Excitement

^ WebRTC covertly added peer to peer features to browsers in the guise of media channels for video and voice. There are some really interesting things happening in that space, with node. @mafintosh and @dominictarr and @pfrazee are all doing some really interesting things.

-----

# Old mistakes

^ We see a lot of system design that mirrors some of the early debates of circuit-switched vs packet-switched networks. The way that websockets fail in the face of intermittent connectivity is very similar to how circuit-switched networks fail when network equipment reboots. HTTP is message oriented, WebSockets are connetion oriented. Statelessness gives resilience, at the expense of control.

^ A great truth here is that all network connections are transient. Some more reliable than others, but it is a matter of when, not if they change, fail or overload.

-----

# Final Remarks (and a plug)

more than just the npm registry - npm is a company with products

npm, Inc. was created in 2014 to:

> * run the open source registry as a free service
> * Build tools & services for the JavaScript developer community
> * **Private packages** for individuals and **organizations**
> * Private, on-premises npm registry for enterprises - npm On-Site

^ We have a lot of opportunity to take advantage of and build out new network designs with node. The runtime fits in some fun places, even ones with relative resource constraints. We can build new protocols on top of the Internet, and we can use existing ones better.

^ Come talk to me about networks, node, and npm

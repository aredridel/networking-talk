# Networking for Noders

## Aria Stewart

----

My first real job was doing tech support at an Internet service provider.

We had 8 modems, 8 phone lines, and a 56 Kbps frame-relay leased line.

<iframe src='http://127.0.0.1:3333/i/tcpdump/port/80'></iframe>

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

^ In the US, operator-assisted dialing was still in use, and there were tolls to call even the other side of a large city.

----

# Meanwhile at the phone company...

### Carriers need more trunk lines

^ Carriers realized they could transmit data about 2 Mbps, if they used two pairs of wires and differential signalling. Suddenly a trunk of 32 phone lines between cities can be run on just 4 wires. Existing trunks got replaced with digital switching, controlled at either end by special tones.

^ You've probably heard of the Captain Crunch Weenie Whistle? Early digital switches would listen for tones from the operator to control channels and route a call onward. Well, since the signalling was in-band, someone could blow a whistle with a 2600 hz tone and get the switch to change into trunk control mode. The golden age of phone phreaking was born.

----

# Digitze audio and time-slice the trunk

64kbps per channel, 8000 hz sampling, as a-law or µ-law 8 bit PCM.

^ Claude Shannon's research on this was in the late 40s. How much bandwidth do you need to carry voice? To accurately reproduce sound, you need about double the sampling rate of the pitches you want to reproduce -- this is why we use 44.1 and 48 Khz sample rates for digital audio when the human ear can perceive up to about 22 Khz. Phone systems are trying for efficiency, so they use lower sampling rates good enough for voice but that mangle music.

^ In Europe the ITU came out with the specifications for the E1 line, a trunk, and the E2, E3, E4 -- multiplexed E1 channels at increasingly high bit rates. The US has a similar set of standards.

^ For thirty-five years, connections are billed by how many channels they are allocated.

----

# Back in UNIX...

Email starts getting popular. Computers connect to each other when tolls are low.

^ If you're on the PDP11 at MIT, and you want to send a message to Stanford, you can get your message there overnight if you route it right.

----

# UUCP

Unix-to-Unix Copy Protocol.

`aredridel!mit!rutgers!byu!stanford`

^ You actually had to figure out a path of systems that would connect to each other to route your message, and you'd specify the route.

-----

## Then For the first time, the network is always on

### Leased lines between sites become the norm

^ Those bang-path routes for email can now get a message across the continent in minutes, not hours or days

^ Here's the thing about leased lines. They're very expensive. Phone companies are now committing to providing five and six nines service. That's 30 seconds of downtime per year. The complexity of switching systems 

-----

# Two approaches to networking

^ Here things get interesting

----

# Connections vs Packets

^ European Informatics Network, INRIA & NPL, are big on making connections between systems over digital lines, building a circuit and being able to stream data from site to site, much like making a phone call. ITU standards X.25 are created.

^ On the other hand, the CYCLADES project in Europe and then ARPAnet in the US are being built for unreliable networks, agnostic of the carrier, and routed packet at a time and best effort.

-----

## Philosophies differ

Complexity in the network, or complexity at the ends?

----

# ARPAnet -> Internet

European networks were added to the ARPAnet and formed the beginnings of the Internet.

Internet protocol was conceived as a protocol used between networks, not within local networks.

-----

# Hosts directly on the Internet

A few hosts were directly on the internet, often acting as gateways for an on-campus network.

A file was copied around with the names of these computers, and their associated IP addresses.

It was installed as `/etc/hosts`

-----

# Through the 80s...

^ X.25 networks dominated. Systems like Compuserve came online on top of X.25 circuits, each segment of the network you would 'dial into' virtually. The Internet grew, quietly. X.25 networks had gateways into the Internet in places.

-----

# Protocols get switched

The first session protocol on the Internet, NCP, had flaws.

One day in 1984, everyone switches from NCP to TCP. It was coordinated by email and general agreement.

-----

# The Internet Grows

hosts files are unmaintainable.

A distributed, eventually consistent key-value database with delegated namespaces is created to solve this problem.

-----

# DNS

^ You need the IP for a hostname. Your computer asks its configured resolver, the resolver asks the roots, who return the top level domain servers, who the resolver queries for the next record, who gets a referral down until a server either has the answer or definitively does not. Each step is cacheable with a time to live, so it forms a global eventually consistent database. DNS can carry other information, too. MIT had a system called Hesiod as part of Project Athena that used DNS protocol for human and account information directory lookups, before LDAP was invented.

^ The delegation model for DNS is pretty clever and actually matches up with how organizations are structured.

-----

# Routing

^ Each host looks in its routing table for which interface to put a packet on, drops it into the network, and the next hop picks it up and does the same. It's a very simple process.

-----

## Simple sites just send anything not addressed to a local IP to their router

^ A simple router then can send it to the router at the ISP it's connected to. We call it a 'default route' or, in old fashioned terms, 'a gateway address'

-----

# Core routers

At the Tier 2 ISPs and the Tier 1 backbones of the Internet are core routers.

They keep a complete view of what systems are connected to the internet, as groups.

^ These groups of independent systems -- not individual hosts, but whole autonomous networks -- are numbered and called Autotnomous Systems. A table of which systems are out which interfaces are kept at each router, with duplicate specifics left out, or "aggregated".

-----

# A demo

## Let's trace a route

-----

<iframe src='http://127.0.0.1:3333/i/traceroute/8.8.8.8'></iframe>

^ Each packet is routed separately.

------

## The core operates on a lot of trust

^ One day in 2013, someone in Russia configured their router to say that they had a particularly short path to the rest of the Internet, and it would be most efficient to go that way. It might have been an accident, it might have been a state level attack on the Internet. For about four hours, about 1% of the Internet went through this relatively small Internet connection in Russia. Connections from California to other parts of California would be routed through it. Entire parts of the Internet went down briefly while the bogus route was filtered out. Lots of traffic was dropped because the connection was completely insufficient to pass as much as it received.

----

# TCP and full links

^ The TCP protocol is a large portion of why the Internet has been successful. By moving the complexity out of the network, it has made replacing networks with faster pipes much more easily than if connection switching equipment with 99.9999% uptime requirements. What this ends up meaning thoush is that hosts have to deal with error handling themselves.

----

# Lost packets means slow down

There can only be a known number of packets in flight — one packet is easily recovered.

^ TCP follows a whole formula to control how fast it sends data, called the 'bandwidth delay product estimate'. Based on how long it takes to get an ACK of data in transit and whether packets get dropped or not.

^ Dropped packets are actually rare on backbones now. Buffers are large enough that there are delayes instead -- which feed into the TCP rate control formula too.

-----

## TCP is for sharing.

^ Each connection has some probability of losing packets if a link fills up, so a connection will slow down to accomodate others.

^ There was a lot of debate during the creation of web browsers over how many connections and how many connections they could make to each site before it was hostile to others on the network, since each connection increased the relative number of chances there were to get through.

^ Now we don't have to worry about that because we can't ramp our speed up fast enough much of the time. Still wortk considering on narrow links though.

----

## Some effects of TCP

^ TCP starts slow, because it was designed for computers that by today's standards are very constrained. It assumes that there's only a tiny buffer to receive data on a remote host until they communicate for a bit, and it's not a very big field anyway, so a system can only send about 14 k of data without waiting for an ACK that tells it the buffer is bigger. This plays out in web requests, making a page smaller than 14k _significantly_ faster to send than one that's larger.

------

# New Constraints

-----

## Mobile phones use data

^ Carriers and phone companies are super scared they'll lose control and so data service is restricted and the web is walled off behind WAP. Pay to play is per-carrier often, and rarely works well.

-----

# WiFi

Wireless completely changes how we use computers and devices in our homes, and wrest control from the phone companies, back toward ISPs and consumers.

^ Wireless data also has some new problems. High and variable latency, roaming between access points sometimes changes IP, sessions are no longer always durable. NAT is now the norm, so a consumer device can make a connection outward, but a host on the internet cannot reach back to a consumer device. Peer to peer systems are weakened significantly, and intermediation by service providers increases.

----

# The iPhone

^ Apple's genius was not touchscreens, or even iOS 1.0. iOS was terrible. No apps, no copy and paste. Apple did do was make a data-connected pocket computer that was not under the carrier's control. Internet and web access, from anywhere, on terms that serve end users pretty well.

-----

## Internet traffic surpasses voice

^ At this point in history, about 2004 FIXME, there was no going back. This Internet thing got really big. We spend more of our lives connected to others now than at any point in human history, and not just phone calls.

^ Backbones and metropolitan networks designed for internet style data emerge, using Ethernet-like protocols rather than framing protocols on voice trunks. New backbone providers emerge, and some of the largest ISPs create their own. Packet switched networks have won definitively, and the flexibility they allow should be a lesson in designing systems: simplicity will win out as system capacity and complexity increase.

----

# Convergence

^ IPv6 has finally become somewhat viable. Cellular carriers start carrying voice traffic over IPv6. Voice over IP providers start disrupting long distance carriers, and voice communication is now completely commoditized. In the US, we have very few cellular plans that actually count minutes of voice.

-----

# Unevenly distributed future

^ The future is here. It's not evenly distributed. In many places in the world, cellular networks are the only internet connection, and in some places, 2G service is the norm. Data is a trickle. In other parts of the world, we have more bandwidth available to us in our pockets than we can easily use, and ten times the size of pipe that would have served an entire small ISP twenty years ago. We measure backbone capacity in gigabits, not megabits, nor like kilobits per second as we did in the 80s.

----

## Network Disintermediation

^ We're out of IPv4 addresses. There are no more available. Allocations can be transferred, but they are now a precious resource. RIPE here in Europe ran out first, then ARIN in North America shortly after that. APNIC I think gave out their last blocks a few months ago. NAT, not just at the home router, but at the carrier or ISP will be completely normal next year. We will share IP addresses with entire cities or networks. Our approach to security policies can and must change.

^ IPv6 started hitting its stride this year. AWS still doesn't support it, but Google does, Facebook does. Comcast, the largest consumer ISP in the US is now doing carrier-grade NAT across many many customers for IPv4. We are at a turning point, now, in networking, whether we'll continue intermediating in networks and running all data through central service providers or start using these extremely capable devices to their fullest and start designing hybrid peer-to-peer systems with servers as resources for connection and collaboration rather than as intermediaries.

-----

# Excitement

^ WebRTC covertly added peer to peer features to browsers in the guise of media channels for video and voice. There are some really interesting things happening in that space, with node. @mafintosh and @dominictarr and @pfrazee are all doing some really interesting things.

-----

# Old mistakes

^ We see a lot of system design that mirrors some of the early debates of circuit-switched vs packet-switched networks. The way that websockets fail in the face of intermittent connectivity is very similar to how circuit-switched networks fail when network equipment reboots. HTTP is message oriented, WebSockets are connetion oriented. Statelessness gives resilience, at the expense of control.

^ A great truth here is that all network connections are transient. Some more reliable than others, but it is a matter of when, not if they change, fail or overload.

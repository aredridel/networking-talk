[13:08:50] Aria So you've worked with HTTP as an API before.
[13:09:00] Aria And you've poked at routers to make them go.
[13:09:07] Aria What other networking stuff have you done?
[13:09:22] uber_hulk so I have used request module a lot
[13:09:30] uber_hulk I know a bit about content type
[13:09:55] uber_hulk but I go stupidly insane when I think about how server sends data?
[13:10:01] uber_hulk how packets are made
[13:10:06] uber_hulk how browser gets it
[13:11:13] uber_hulk I am going to be a very big contributor of http module
[13:11:20] uber_hulk I need to understand how it works in core
[13:11:50] Aria So have you ever run into the OSI model?
[13:11:55] Aria The 7 layer model?
[13:12:26] uber_hulk yes, I know about it
[13:12:32] Aria Alright.
[13:12:43] Aria Ever run into how the internet follows it only about as far as layer 4?
[13:13:02] uber_hulk yes, ip => tcp => http
[13:13:17] uber_hulk tcp makes sure to delever package
[13:13:21] Aria Kinda!
[13:13:23] Aria Not quite :)
[13:13:41] Aria So IP is solidly layer 3 in the OSI model -- packet-shaped, routed statelessly.
[13:13:51] Aria The addresses identify interfaces.
[13:14:15] Aria Like 1 IP = A port on a piece of hardware somewhere.
[13:14:22] uber_hulk right
[13:14:39] Aria (might be multiple IPs on a port. But each IP should only be on one, unless there's Very Clever Tricks going on.)
[13:15:17] uber_hulk how multiple heh
[13:15:26] uber_hulk the nat has mapping table to ports
[13:15:31] uber_hulk so one port, 1 IP
[13:15:34] uber_hulk NAT*
[13:15:36] Aria That's a different kind of port.
[13:15:41] Aria That's a TCP thing.
[13:15:53] Aria when I say ports about this, I mean "an actual piece of networking hardware"
[13:16:14] Aria Like, a thing you plug into. Or that has an antenna.
[13:16:15] uber_hulk so mac addr => ip addr conversion
[13:16:30] Aria Yeah. Interfaces are locally given mac addresses, but those aren't routable.
[13:16:36] Aria Because they're assigned randomly.
[13:16:54] Aria (the routing table on the internet would have to have 4 billion plus entries to handle that)
[13:17:20] uber_hulk going over my head Aria
[13:17:23] Aria Hehe.
[13:17:35] Aria So each port or device has a mac address.
[13:17:43] Aria Each IP can map to a mac address.
[13:17:58] Aria But a mac address can't have a packet sent to it from afar, because that would be way too complicated to manage.
[13:18:11] uber_hulk i see
[13:18:37] Aria So mac addresses are only useful over a local area network. We need a more structured address to deal with wide area networks like the internet.
[13:18:56] uber_hulk hmm okay
[13:19:03] Aria Because the internet is _huge_ and it'd be far too much trouble to have a list of every user's mac address and which ISP to send their packets to.
[13:19:15] Aria So instead we break IPs up into groups.
[13:19:38] Aria You may get 33.44.55.66, and I may get 24.75.24.253
[13:19:40] uber_hulk gotcha
[13:19:56] Aria But that's still too many to make a list of individually, so we chop off some bits.
[13:20:19] uber_hulk like?
[13:20:20] Aria 24.75.24.248 through 24.75.24.255 are assigned to my network cabinet.
[13:20:40] uber_hulk hmm
[13:20:46] Aria (Actually, I think 24.75.24.192 through)
[13:21:03] Aria So that's actually only 26 bits required to get it to the right cabinet.
[13:21:24] Aria (8, 8, 8, 2)
[13:21:42] Aria (each part of an IP address is a byte)
[13:21:45] uber_hulk so when it reaches your cabinet how it finds which device it needs to send data to
[13:21:55] Aria Yeah, the router in the cabinet has the full list for my network
[13:22:02] Aria But nobody outside of that network needs to know or care.
[13:22:25] uber_hulk but if my network has two people, and my cousin gets the message i was supposed to get
[13:22:29] uber_hulk that would be so bad
[13:22:41] Aria Yep. Which is why your router needs to know how to tell you apart.
[13:23:12] Aria But outside my router, all someone needs to know is that "anything starting with 24.75.24 and the matching first two bits of the next byte, send it to my router"
[13:23:21] uber_hulk but the sender from far end needs to send some header that says its for ashok
[13:23:35] Aria Not so explicitly.
[13:23:46] Aria We'll get to that when we do TCP. Because you have to know TCP to get how NAT works.
[13:24:07] uber_hulk oho
[13:24:10] uber_hulk loving it aria
[13:24:28] uber_hulk loving the way you say "we will learn TCP"
[13:24:38] Aria So! too many routes, even to list every /26 network. That's a LOT of networks. Millions.
[13:24:48] Aria So the ISP that hosts my server cabinet actually has a 22.
[13:25:33] Aria 24.75.24, 25, 26, 27 are all theirs.
[13:25:34] uber_hulk oho
[13:26:07] Aria So that means that the people THEY connect to only need to know 22 bits to get a message to the right router, and that means that instead of 4096 routes to get to those, you only need 1.
[13:26:17] Aria So the routing table is shrinking the more we aggregate.
[13:26:25] Aria So if nearby devices share nearby addresses, we can compress.
[13:26:52] Aria So instead of 24.75.25.253 goes to Buffalo, NY, and 24.75.25.99 goes to Amsterdam, that never happens
[13:27:02] Aria instead we say "24.75.anything goes to Buffalo, NY"
[13:27:24] Aria (and in fact, a /22 is the smallest network that can have an entry in the public internet's routing table.)
[13:27:37] Aria (There's exceptions, but they're super special like Google's 8.8.8.8 and 8.8.4.4)
[13:27:41] uber_hulk oho gotcha
[13:27:59] uber_hulk hmm
[13:28:00] Aria So the Internet routing table has a few million records in it.
[13:28:05] uber_hulk why we do dns 8.8.8.8
[13:28:32] Aria We use 8.8.8.8 because Google has done some very clever tricks that make it able to use the data center nearest you.
[13:28:46] Aria That is, in your part of the world, the nearest route to 8.8.8.8 goes to somewhere probably in Blore.
[13:28:56] Aria In my part of the world, it goes to somewhere in New York.
[13:29:01] uber_hulk i see
[13:29:10] Aria They call that 'anycast' routing.
[13:29:24] Aria Usually all the entries for a route should get the packets to the same place, and the shortest path should be chosen.
[13:29:33] Aria But in this case they go different places.
[13:29:38] Aria This is fine for UDP
[13:29:42] Aria Not so much for TCP.
[13:29:51] Aria So it works for DNS, but lousy for HTTP.
[13:30:04] Aria (so google's servers don't run on 8.8.x.x themselves. Just DNS.)
[13:30:15] uber_hulk oho, i will say okay, regardless of not getting few things
[13:30:38] Aria Hehe. Now's a good time to clear stuff up. Or maybe trace through how a packet gets tfrom here to there.
[13:30:59] uber_hulk dns is doman name server
[13:31:02] Aria Yep.
[13:31:07] uber_hulk 8.8.8.8 is ip of google.com
[13:31:12] uber_hulk hiddle behind google.com
[13:31:26] uber_hulk so when i put dns in my laptop's resolv.conf what happens
[13:31:27] Aria You can ask it questions like "What's the IP of google.com" and it will answer "google.com's IP is 72.55.66.77 for the next 30 seconds"
[13:31:28] uber_hulk why i do that
[13:31:45] Aria Okay! So! this is a higher level protocol but one that's great to understand.
[13:31:47] uber_hulk oho nice
[13:31:54] Aria Memorizing IPs is super hard.
[13:31:59] Aria And they change when you change networks.
[13:32:06] Aria So it's a lousy way to connect to things.
[13:32:24] Aria To do a search, http://72.56.66.77/ one day, and http://199.55.66.122/ the next would suck.
[13:32:33] Aria And imagine the emails about keeping the list up to date.
[13:32:47] Aria Which is in fact what happened. The /etc/hosts files back in the early 80s, was emailed around.
[13:33:31] Aria "Hey, I'm the network admin for KGB. We just got a new VAX Minicomputer, its name is kremvax.kgb.se, and its IP address is 32.4.5.1"
[13:33:41] Aria So everyone would add it to the hosts file.
[13:33:52] Aria Not so bad when computers are millions of dollars and getting a new one or moving it is a Big Deal.
[13:34:09] Aria ... now computers cost like $10 and we move them with us in our pockets.
[13:34:24] Aria So we needed a new system. That became DNS.
[13:34:38] uber_hulk hmm, so how dns does it
[13:34:56] Aria So! Your computer has 8.8.8.8 in resolv.conf. Most people use what their ISP tells them,, but Google's DNS is usually better.
[13:35:22] Aria So when you type in http://google.com/, your computer sends UDP packet asking "What is the IP of google.com?" to 8.8.8.8 port 53.
[13:35:40] uber_hulk lets say banglore that is
[13:35:41] Aria That gets routed to the nearest data center that advertises a route to 8.8.8.x.
[13:36:10] Aria So your router passes it to your ISP, your ISP to another ISP, to another ISP, to the datacenter in B'lore and then they accept the packet and look and see if they already have the answer.
[13:36:12] Aria The DNS cache.
[13:36:25] Aria The answer is 'no'. Turns out nobody's asked about google.com recently.
[13:36:32] Aria So it then goes and recursively resolves it.
[13:36:59] Aria It asks the root nameservers "hey! Who do I talk to to get an answer about google.com?" and they say "We dunno, but the .com nameservers might. Here's a list."
[13:37:26] uber_hulk hmm
[13:37:37] uber_hulk interesting
[13:37:40] Aria (actually, let's pretend this is www.google.com, not just google.com)
[13:37:51] Aria So then it sends a packet to a nameserver from that list and asks "Hey! do you know what www.google.com's IP is?"
[13:37:51] uber_hulk ok
[13:38:28] Aria And it sends back "No! But the nameservers for google.com are 12.34.56.78 and 23.34.45.56. Ask one of them! Have a nice day!"
[13:38:39] Aria So then 8.8.8.8 sends off _another_ packet.
[13:38:56] Aria "Hey! 12.34.45.67! Do you know the IP for www.google.com?"
[13:39:18] Aria And it says "Yes! The IP is 72.55.66.77, and that answer is good for 60 seconds"
[13:39:42] Aria So then 8.8.8.8 adds an entry "www.google.com is 72.55.66.77, and that information is good for 30 seconds. Er. 29 now. Okay."
[13:39:56] uber_hulk aha
[13:39:57] Aria So then 8.8.8.8 sends back an answer to your computer.
[13:39:59] uber_hulk gotcha
[13:40:11] Aria "www.google.com is 72.55.66.77. And this is good for 29 seconds."
[13:40:30] Aria "www.google.com 29 IN A 72.55.66.77"
[13:40:45] Aria In zone file format, which is the usual way DNS records are printed out
[13:40:59] Aria The actual DNS protocol is tightly compressed binary, because it has to fit significant answers in UDP packets.
[13:41:14] uber_hulk nice explaination ever
[13:41:22] Aria You can see this by querying yourself with the 'dig' tool.
[13:41:26] uber_hulk udacity should explain like this
[13:41:28] Aria type `dig +trace www.google.com`
[13:41:30] Aria Yes they should!
[13:41:36] Aria ... and this is going to be my talk in Barcelona.
[13:41:39] uber_hulk yeah, i hve that tool
[13:41:57] Aria So dig in trace mode tells your computer to tell 8.8.8.8 not to answer, but just give the referral.
[13:42:01] uber_hulk .            8596 IN    NS a.root-servers.net.
[13:42:08] Aria So _your_ computer will contact the root, then .com, then google.com, then get www.google.com
[13:42:14] Aria Yep. The root name server.
[13:42:30] Aria root-servers.net is the servers for the '.' domain. The one that has .com and .org and .net and .in in it.
[13:42:37] Aria It's about 2000 entries.
[13:42:44] uber_hulk ;; Received 397 bytes from 10.0.0.1#53(10.0.0.1) in 86 ms
[13:43:04] uber_hulk aha
[13:43:50] uber_hulk okay, so i get the dns now
[13:44:07] uber_hulk we were understanding ip
[13:44:20] Aria So DNS can answer other queries -- "What computer handles mail?" (MX records) and a few others, but they're not super important to this discussion.
[13:44:41] uber_hulk aha okay
[13:44:52] Aria (dig mx google.com)
[13:44:57] Aria (dig txt google.com)
[13:45:02] Aria (you can see other records)
[13:45:35] uber_hulk hmm
[13:45:43] uber_hulk ;; Warning, extra type option
[13:45:43] uber_hulk google.com.        3599 IN    TXT "v=spf1 include:_spf.google.com ~all"
[13:46:01] Aria Yep. "here's our SPF anti-forgery record for mail"
[13:46:09] Aria txt records can have all kinds of crap in them.
[13:46:21] Aria But anyway.
[13:46:38] uber_hulk hmm, gotcha
[13:46:52] Aria So IP -- I just queried one of the core routers and there are 2849539 routes used there to route the whole internet.
[13:46:59] Aria So there are that many separate networks.
[13:47:08] Aria ISPs, data centers, phone carriers, etc.
[13:47:32] Aria And because IPs are a 32-bit number, we can have 3-billion some (accounting for the stupidly reserved space) devices with unique IPs.
[13:47:48] Aria In reality, it's more like 1.5 billion because allocating them efficiently is hard.
[13:48:00] uber_hulk hmm
[13:48:02] uber_hulk right
[13:48:13] Aria (... there are 8 billion people on the planet or more, and each could have a mobile phone and several computers. This is in fact a problem. We're out of IPs.)
[13:48:34] uber_hulk so we are going towards ipv6
[13:48:37] Aria Yup. And NAT.
[13:48:44] uber_hulk right
[13:48:50] Aria So the IP space is divided up in a few buckets -- APNIC (asia/pacific), ARIN (north america), AFRINIC, RIPE (europe)
[13:49:12] Aria Some ancient customers have way more IPs than they need. Companies and universities that ran the early networks.
[13:49:19] Aria MIT has an entire /8
[13:49:30] Aria (that is, 24 bits to assign to computers -- 16 million IPs.)
[13:49:39] Aria The US DoD also does, as does IBM.
[13:49:44] uber_hulk oho wow
[13:49:46] Aria Any IP starting with "7." is IBM.
[13:49:50] Aria 4. is DoD.
[13:50:01] uber_hulk DoD?
[13:50:06] Aria Department of Defense.
[13:50:11] Aria Army. Navy. Marines. CIA.
[13:50:12] uber_hulk oh
[13:50:26] uber_hulk interestng
[13:50:33] Aria Some of those networks have been broken up. Raytheon's broken up theirs.
[13:50:46] Aria But .. as of two months ago, ARIN has no IPs to hand out.
[13:50:50] Aria They're exhausted. Done.
[13:50:54] Aria RIPE ran out three months ago.
[13:50:58] uber_hulk wow
[13:51:01] Aria APNIC, I think, runs out next month.
[13:51:17] uber_hulk oho wowow
[13:51:21] Aria YUP
[13:51:24] uber_hulk so i won't reach you :p
[13:51:33] Aria Or you will. but network admins have to get clever.
[13:51:37] uber_hulk well i will steal some
[13:51:48] Aria use more complex routers. Share IPs between devices.
[13:51:52] Aria ... or move to IPv6.
[13:52:02] uber_hulk hmm
[13:52:04] Aria (where there is 64 bits of network address and 64 bits of device space.)
[13:52:28] Aria (Like, the average data center will get a /48 or more. That's like 4 billion networks inside the data center allowed.
[13:52:29] uber_hulk gotcha
[13:52:30] Aria )
[13:52:48] Aria (And then each customer gets a /64 -- so each _customer_ can have trillions of devices addressed with a unique IP.)
[13:53:04] Aria It's a very big number.
[13:53:11] uber_hulk yes it
[13:53:14] uber_hulk is
[13:53:21] Aria (Basically, "So big we won't have to deal with this again, until we escape our solar system.")
[13:53:38] uber_hulk hahaha
[13:54:25] Aria Anyway, if you go to http://lg.he.net you can actually poke a core router on the internet and inspect the routing table.
[13:54:28] uber_hulk so how will you put ip in one liner?
[13:54:41] Aria One liner?
[13:54:48] uber_hulk in one statement
[13:54:55] Aria Oof.
[13:55:59] Aria "IP is the protocol and system of addresses that allowed each physical location to have a unique routing address to get packets across the Internet to them. But we ran out in 2015, RIP Internet, Long live the Internet"
[13:56:58] Aria So basically, aside from firewalls (which there are few of in the big internet, mostly they're on-site at each location), if you hand-craft an IP packet with your IP in the source and someone else's public IP in the destination address, the internet will route it.
[13:57:04] Aria Without looking any deeper at what's inside.
[13:57:22] Aria It can be TCP, UDP, IGMP, SCTP, GRE.
[13:57:28] Aria All kinds of packets. The internet doesn't care.
[13:57:46] Aria It just looks at as much of the destination address as it needs to to get it where it is going, and sends it along to the next router.
[13:58:03] Aria Be it over fiber optic cables or an ethernet port or whatever.
[13:58:17] Aria Internet routers have to be fast, so they're really really stupid.
[13:58:53] uber_hulk i see
[13:59:09] uber_hulk gotcha
[13:59:17] Aria So like http://bgp.he.net/AS12871#_prefixes -- these IPs all go the same place, and any packet matching one of those patterns will go to the same next hop to get where they're going.
[14:00:18] Aria And http://bgp.he.net/AS3549#_asinfo is the page for the data center I use in Buffalo, NY
[14:01:36] Aria You can look up all the IPs that go to them. all kinds of cleverness.
[14:03:43]  uber_hulk left the query by disconnecting from IRC

uber_hulk__ Hi
[14:03:22] uber_hulk__ my irssi has stopped responding
[14:03:26] uber_hulk__ it has stuck
[14:03:34] uber_hulk__ 11:57              Aria|Internet routers have to be fast, so they're really really stupid.  11:58         uber_hulk| i see  11:58         uber_hulk| gotcha   1   2   3   4   5   Aria   7   8   9      
[14:03:41] Aria Aww
[14:03:45] uber_hulk__ that's the last I saw
[14:03:50] uber_hulk__ why it got stuc
[14:03:52] Aria uber_hulk i see
[14:03:52] Aria [13:59:09] uber_hulk gotcha
[14:03:52] Aria [13:59:17] Aria So like http://bgp.he.net/AS12871#_prefixes -- these IPs all go the same place, and any packet matching one of those patterns will go to the same next hop to get where they're going.
[14:03:52] Aria [14:00:18] Aria And http://bgp.he.net/AS3549#_asinfo is the page for the data center I use in Buffalo, NY
[14:03:52] Aria [14:01:36] Aria You can look up all the IPs that go to them. all kinds of cleverness.
[14:03:53] uber_hulk__ +k
[14:04:44] uber_hulk__ oho i see
[14:04:58] uber_hulk__ so do you keep logs of chattings?
[14:05:01] Aria I do.
[14:05:09] uber_hulk__ that you would be able to ship me later of this discussion?
[14:05:12] Aria Well, I think I do. I haven't looked since I reconfigured.
[14:05:13] Aria I will
[14:05:23] Aria Because I'm keeping _this_ conversation for reference to write my talk.
[14:05:35] uber_hulk__ awesome, so i am all eyes here
[14:06:12] Aria So. That's about how packets get across the internet. Source address. Destination address. And a bunch of stupid routers each looking at juuuust enough of the destination address to pass it on to the right next hop.
[14:06:38] uber_hulk__ gotcha
[14:06:40] Aria Like "We're connected to a fiber cable to Delhi, one to B'lore, one to Singapore. Looks like the Singapore hop is closest, on it goes"
[14:06:56] uber_hulk__ aha
[14:07:14] Aria Singapore sees it and "Okay, next closest route is to our peer network here in Singapore. Level 3? You take it!"
[14:07:45] Aria Level 3 says "Oh, hey, I can get this all the way to the US" and passes it to their fiber router, which passes it through a transpacific cable to a router in, say, San Francisco.
[14:07:54] Aria "Oh, hey. This should go cross country. To Denver!"
[14:08:03] Aria L3 Denver sees that and passes it to L3 New York
[14:08:13] Aria (Level 3 owns _tons_ of fiber in the US)
[14:08:49] uber_hulk__ aha
[14:08:53] uber_hulk__ what is level 3
[14:09:45] uber_hulk__ am i here?
[14:09:50] Aria You're here
[14:09:54] Aria Level 3 is a huuuuuge ISP
[14:10:00] uber_hulk__ thought so
[14:10:05] Aria The kind that only sells to other ISPs. They own fiber across the US, and internationally.
[14:10:25] Aria A "Tier 1" ISP we call them.
[14:10:31] Aria (I ran a tier 3 ISP :))
[14:10:54] uber_hulk__ aha i see
[14:11:02] uber_hulk__ that sounds awesome
[14:11:44] uber_hulk__ okay, so what's next
[14:11:50] Aria So! TCP.
[14:11:59] Aria When you want to connect to google, you can get its IP by DNS.
[14:12:17] Aria Theirs change constantly, so you might get a different IP when you ask, but it goes to one of the nearer datacenters, usually.
[14:12:30] uber_hulk__ right
[14:12:41] Aria But to connect, your computer has to have a way to associate the "I'd like to connect" packet with the "Okay, that's fine, I'd like to connect too!" packet that comes back.
[14:12:58] Aria So your computer makes a list and numbers them.
[14:13:25] uber_hulk__ hmm
[14:13:40] Aria We call them port numbers. The field for this in a TCP packet is a 16 bit integer.
[14:14:23] uber_hulk__ for *a* port number?
[14:14:37] uber_hulk__ i m confused
[14:14:39] uber_hulk__ list of what?
[14:14:47] uber_hulk__ list of packets to send?
[14:14:59] Aria Nope. A list of connections.
[14:15:32] uber_hulk__ can you please explain that agian?
[14:15:37] Aria Working on it!
[14:16:01] Aria "I'm connecting to 7.8.9.0, port 80. I'll call that connection 61346. I'm 1.2.3,4" -- so the identification number for that connection is "7.8.9.0:80:1.2.3.4:61346"
[14:16:51] Aria It sends out a TCP packet (an IP packet with TCP inside) that says "source 1.2.3.4 destination 7.8.9.0" for the IP part and "source port 61345 destination port 80" with a flag that says "I'd like to start a connection"
[14:16:55] Aria (The SYN flag.)
[14:16:56] uber_hulk__ okay, got it
[14:17:18] Aria Then the packet gets routed using the IP part.
[14:17:39] Aria Google's computer(s) get it and see port 80, and pass the packet to the web server.
[14:17:40] uber_hulk__ got it
[14:17:54] Aria (because 80 is the standard port for http)
[14:18:07] uber_hulk__ hmm
[14:18:09] Aria the 61345 was chosen to be random.
[14:18:38] uber_hulk__ so the data comes back does a 1.2.3.4:61346:7.8.9.0:80
[14:18:52] Aria Yes!
[14:18:52] uber_hulk__ and we have that on our router's table what 61346 is
[14:19:04] uber_hulk__ got it
[14:19:06] Aria Yeah. But pretend it's just your computer talking to your ISP. Your router complicates things with NAT.
[14:19:16] Aria So your computer gets back that packet with TWO flags set. SYN and ACK
[14:19:26] Aria That is "I hear you" (ACK) and "I want to talk too" (SYN)
[14:19:38] uber_hulk__ right
[14:20:09] Aria (fun fact: SYN-only packets aren't supposed to carry any data.)
[14:20:24] Aria (So the server is the first one that should actually speak. HTTP wastes this though and sends back nothing.)
[14:20:27] uber_hulk__ oho i see
[14:20:42] uber_hulk__ hmm
[14:20:49] uber_hulk__ why you say http wastes it
[14:20:53] uber_hulk__ it's all ip and tcp
[14:21:02] Aria Yup. The tCP length field is 0
[14:21:31] uber_hulk__ exactly
[14:21:42] uber_hulk__ okay, so tcp does all the things like payload, and stuff
[14:21:43] uber_hulk__ padding
[14:21:46] uber_hulk__ and bla bla
[14:22:37] Aria No padding. but payload.
[14:22:52] Aria (Most Internet protocols have no padding.)
[14:23:03] uber_hulk__ okay
[14:23:19] uber_hulk__ so now is the time to dive into tpc implementation?
[14:23:22] Aria (That tends to be a thing only on LANs, so the physical devices can have a packet big enough to be sure it wasn't just noise)
[14:23:28] Aria Yep! TCP!
[14:23:55] uber_hulk__ aha
[14:24:24] Aria So your computer sends back another packet to Google. Same addressing, same ports. With the ACK flag it got from Google, it knows how much space it has to send. Its data has to be smaller than that,.
[14:24:44] Aria So your computer sends back its packet this time with just the ACK flag, and however much data from the HTTP parts that will fit.
[14:25:30] uber_hulk__ and what if packet is too big for this?
[14:25:34] uber_hulk__ the photo file
[14:25:41] uber_hulk__ to upload
[14:28:09] uber_hulk__ there?
[14:28:13] uber_hulk__ or am i here
[14:30:45] Aria It's divided up.
[14:30:53] Aria TCP has a concept called a 'sequence number'
[14:31:11] uber_hulk__ so ack flag with each packet?
[14:31:27] Aria So the first packet will be sent with an annotation saying "this is the first 1200 bytes" and the next might be "this is 1201-1500"
[14:31:49] Aria When an ACK comes back, it can actually ack all previous: the ACK should include the highest contiguous sequence received.
[14:31:58] Aria So you may see several sent packets with only one ACK
[14:32:13] Aria (depending on the speed of the network, and how much processing the remote did on the packets)
[14:32:39] uber_hulk__ i see
[14:32:43] Aria So until an ACK comes back with a high enough sequence, your computer remembers what it sent.
[14:32:53] Aria So you need 'sending buffer' space.
[14:33:21] Aria And what programs can do with TCP is send a stream of bytes.
[14:33:31] Aria Programs don't usually do their own dividing things into packets.
[14:33:37] Aria They just write and let the operating system do that.
[14:33:46] uber_hulk__ i see
[14:34:07] Aria So your program sends "GET / HTTP/1.1\nHeader1: value1\r\nHeader2: Value2\r\n\r\nBody here" to the kernel
[14:34:58] uber_hulk__ hmm and then kernel does the dividing?
[14:35:03] Aria Yep
[14:35:34] Aria And it might break that up as {port 61345->port 80, sequence 0, data: "GET / HTTP/1.1\nHeader1: value1\r\n"} and {port 61345->port 80, sequence 32, data: "Header2: Value2\r\n\r\nBody here"}
[14:35:35] uber_hulk__ okay, so what node's tcp module does then
[14:35:51] Aria Not quite! Node's TCP module actually just gives node a way to write to the OS efficiently.
[14:35:55] uber_hulk__ hmm nice
[14:35:56] Aria The OS still does the packetizing.
[14:36:18] uber_hulk__ okay so can we write that small node's tcp library?
[14:36:25] uber_hulk__ just touching few places :p
[14:36:37] Aria Hehe. It's still complex because it's interfacing with c++
[14:36:43] Aria memory allocation, buffers, etc.
[14:36:54] Aria (there's a system call called "writev" that is "write several chunks into the kernel send buffer")
[14:37:05] Aria (node's TCP wrappers are wrapped around libuv, which wrap around those)
[14:37:20] uber_hulk__ yeah, i always don't understand difference b/w buffers and streams and sockets
[14:37:21] Aria Also, it's complicated because if the buffers are full, you have to handle re-sending from where it ran out of space.
[14:37:30] Aria Mmm. I can get to that later on!
[14:38:05] Aria So anyway. TCP. You'd get  {port 80->port 61345, sequence 32, flags: ACK} back.
[14:38:10] uber_hulk__ hmm, but if I want to contri, i need to know all that ;p
[14:38:14] Aria Saying "I got both those packets"
[14:38:26] uber_hulk__ right
[14:38:48] Aria Hehe, yeah. Though frankly: C++ is not my strong place. I'm good with C, so libuv isn't too bad to me, but Node's API I find baffling and frustrating thanks to V8 being crazy clever C++ sometimes.
[14:39:14] Aria So then google forms its response and starts sending packets back  {port 80->port 61345, sequence 0, data: ........}
[14:39:20] Aria And your computer will fire back ACK periodically.
[14:39:36] Aria (there's a whole calculation to figure out the optimal time to send ACKs that depends on how long the packets take to send.
[14:40:06] uber_hulk__ aha i see
[14:40:49] uber_hulk__ so if i work on http module i need not to worry about tcp right?
[14:41:00] uber_hulk__ the knowledge would be suffice, this knowledge^
[14:41:16] Aria Yeah.
[14:41:24] Aria HTTP gets to pretend that TCP is just a byte-stream.
[14:41:48] Aria You can't assume you will always get complete things. You can sometimes tell the difference between 'closed with errror' and 'closed correctly'
[14:42:08] uber_hulk__ hmm, so how http works
[14:42:08] Aria But TCP is "stuff stuff stuff stuff stuff DONE NOW" in both directions.
[14:42:13] uber_hulk__ tcp broken up the packets
[14:42:21] uber_hulk__ what does http does
[14:42:31] uber_hulk__ if that has to do with OS as well? and libuv?
[14:42:36] Aria Yeah. You can't really predict where the packet boundaries will be. So TCP will hand your process what it gets, and you have to buffer it long enough to get whole things, and parse.
[14:43:12] uber_hulk__ here your process = 'http'?
[14:45:04] Aria Your process = node.
[14:45:47] Aria Node will get the data via libuv, and feed it into the http parser (which receives the headers), and then into your program (which gets the headers all at once in the res object, and the body as a stream, to get it as it comes in)
[14:46:20] uber_hulk__ let me re-read this line again
[14:47:16] uber_hulk__ libuv --> http parser --> program
[14:47:28] uber_hulk__ or libuv --> http parser; libuv --> program?
[14:47:30] uber_hulk__ the headers
[14:47:44] uber_hulk__ i know the body will be streamed by libuv to program
[14:47:45] Aria I'd have to go read the source!
[14:47:58] uber_hulk__ bwahaha
[14:48:03] Aria There's some division, and I think it keeps getting reworked to improve performance
[14:48:11] Aria ... but also it might be getting harder to understand :(
[14:48:25] uber_hulk__ we should create a small http library to get the sense with mock headers from a node's process
[14:48:28] uber_hulk__ and not from libuv
[14:48:35] uber_hulk__ s/node's process/node program
[14:48:59] uber_hulk__ and mock stream body
[14:49:09] uber_hulk__ we can use streams, and it will clear everything for me
[14:49:42] uber_hulk__ I will read the http modules tomorrow all day and tomorrow I ccan ask you more questions. So it will help you withh your speach, and me with everything :P
[14:49:54] Aria Hehe. Indeed.
[14:50:03] Aria I'm out of steam here though, so maybe more later?

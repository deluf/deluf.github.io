---
title: Digital signature server
date: "2025-06-09T00:00:00+01:00"
draft: false

description: "**C11** secure **digital signature server** implemented using the **OpenSSL** and **libsodium** crypto libraries"

cover:
  alt: Preview of Digital signature server
  image: 2025/digital-signature-server/preview.png

tags:
- C
- OpenSSL
- Linux
---

---

> **Resources**

- [Code](https://github.com/deluf/digital-signature-server)
- [Documentation](/2025/digital-signature-server/documentation.pdf)

---

## Highlights

> **Summary**

{{< space 20 >}}

This project involved the design and implementation of a secure digital signature server, a trusted third party that creates private-public key pairs, stores them and generates digital signatures on the behalf of the users - a common requirement in organizational settings where centralized key management is crucial.

The core of the project was to build a robust authentication protocol and secure communication channel without relying on existing high-level libraries like TLS:
* **Handshake:** A secure channel is established using Elliptic-Curve Diffie-Hellman Ephemeral key exchange (X25519 curve) to ensure Perfect Forward Secrecy. The channel also provides confidentiality, integrity and no-replay through authenticated encryption (AES-128-GCM)
* **Authentication:** The server authenticates to the client using a digital signature (ECDSA). Clients authenticate to the server using a username and a securely hashed password (Argon2id)

Finally, a sample conversation between a client and the server was captured and analyzed using **Wireshark**, verifying that each exchanged byte conformed to the designed protocol and confirming that an eavesdropper could observe only the ciphertext.

{{< space 40 >}}

> **Pictures**

{{< figure src="/2025/digital-signature-server/handshake.png" caption="Sequence diagram of the handshake (server authentication) protocol" >}}

{{< space 50 >}}

{{< figure src="/2025/digital-signature-server/psw.png" caption="Sequence diagram of the client authentication protocol" >}}

{{< space 50 >}}

{{< figure src="/2025/digital-signature-server/response-wireshark.png" caption="Server’s response to a SignDocument operation, captured by wireshark (grey bytes are TCP headers)" >}}

{{< space 50 >}}

{{< figure src="/2025/digital-signature-server/response.png" caption="Interpretation of the server’s response above" >}}

{{< space 50 >}}

> **See it in action**

{{< video "/2025/digital-signature-server/action.mp4" >}}

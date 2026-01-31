import socket
try:
    hostname = socket.gethostname()
    ips = socket.gethostbyname_ex(hostname)[2]
    print("Detected IPs:", [ip for ip in ips if not ip.startswith("127.")])
except Exception as e:
    print("Error:", e)

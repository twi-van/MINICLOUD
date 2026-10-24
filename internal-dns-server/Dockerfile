FROM ubuntu/bind9:latest

# Copy cấu hình Bind9
COPY named.conf        /etc/bind/named.conf
COPY named.conf.local  /etc/bind/named.conf.local
COPY named.conf.options /etc/bind/named.conf.options
COPY zones/            /etc/bind/zones/

EXPOSE 53/udp
EXPOSE 53/tcp

CMD ["/usr/sbin/named", "-g", "-c", "/etc/bind/named.conf", "-u", "bind"]

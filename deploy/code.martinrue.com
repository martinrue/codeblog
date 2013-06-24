upstream code.martinrue.com {
  server 127.0.0.1:9111;
}

server {
  listen 80;
  client_max_body_size 4G;
  server_name code.martinrue.com;

  keepalive_timeout 5;

  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_pass http://code.martinrue.com;
  }
}

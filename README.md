piidos-compartidos-codetails
=======================

Application written in Sinatra + WebSockets to share "piidos" between "cocktailers".

If you want to test it make the next steps:

  1. bundle install
  2. bundle exec ruby app.rb
  3. test it in http://localhost:3000

It jumps to lacoctuitera.es for external storage, whose code is at this repository: https://github.com/nando/rstat.us

To decrypt our small-people images run the following:

  openssl des3 -d -k secretpassword < public_images.des3 | tar zxf -

With the most common of our passwords.

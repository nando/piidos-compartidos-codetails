require 'thin'
require 'em-websocket'
require 'sinatra/base'
require 'pry'
require 'json'

EM.run do
  class App < Sinatra::Base
    TUITS_FILE = 'tuits'

    get "/" do
      @tuits_submitted = if File.file?(TUITS_FILE)
        JSON.parse(File.read(TUITS_FILE))
      else
        {}
      end.to_json
      erb :index
    end

    post "/tuits" do
      file = File.read(TUITS_FILE) rescue "{}"
      current_tuits = JSON.parse(file)
      current_tuits[params[:piido]] = Time.now.to_i
      File.open(TUITS_FILE,"w") do |f|
        f.write(current_tuits.to_json)
      end
      redirect to('/')
    end
  end

  @clients = []
  EM::WebSocket.start(:host => '0.0.0.0', :port => '3001') do |ws|
    ws.onopen do |handshake|
      @clients << ws
    end

    ws.onclose do
      ws.send "Closed."
      @clients.delete ws
    end

    ws.onmessage do |msg|
      puts "Received Message: #{msg}"
      @clients.each do |socket|
        socket.send(msg)
      end
    end
  end

  App.run! :port => 3000
end

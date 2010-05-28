require 'net/http'

class Checkpoint
  ALL_CATS = ['run-light', 'run-pro', 'rider-light', 'rider-pro']
  attr_accessor :number, :address, :task, :x, :y
  attr_reader :cats
  
  def initialize(number, address, task)
    @number, @address, @task = number, address, task
  end
  
  def cats=(c)
    if (c == 'run') 
      @cats = ['run-light', 'run-pro'] 
    elsif (c == 'rider') 
        @cats = ['rider-light', 'rider-pro'] 
    else
      @cats = ALL_CATS
    end
  end
end

=begin
# Save results from web-pages
File.open("checkpoints_cp1251.html", 'w') do |output|
  output.puts Net::HTTP.get('www.runcity.ru', "/events/nightinpushkin2009/routes/all/")
end
# Fix encoding
system("iconv --from-code=CP1251 --to-code=UTF-8 checkpoints_cp1251.html > checkpoints.html")
system("rm checkpoints_cp1251.html")
=end
  
# Parse checkpoints information
checkpoints = {}
File.new('checkpoints.html').read.gsub(/<br>[\n\r]+/, "<br>").each_line do |line|
  all, number, address, task = \
    *(/<li><strong>(\d\d)<\/strong>&nbsp;<address> (.+)<\/address><br>\s*(.+)<\/li>/.match(line))
  next unless $~
  checkpoints[number] = Checkpoint.new(number, address, task)
end

# Parse GPS
File.new('gps.txt').read.each_line do |line|
  all, num, x, y, cat = *(/^(\d\d) N(\d{2}\.\d{5})-E0(\d{2}\.\d{5})[\d ]*(run|rider)?/.match(line))
  next unless $~
  next unless checkpoints[num]
  checkpoints[num].x = x
  checkpoints[num].y = y
  checkpoints[num].cats = cat
end

# Form json
checkpoints = checkpoints.values.sort { |a, b| a.number <=> b.number }
File.open('checkpoints.js', 'w') do |out|
  out.puts "["
  checkpoints.each_with_index do |cp, i|
    out.puts "{ 'id': #{cp.number},"
    out.puts "  'name': '#{cp.address}',"
    out.puts "  'task': '#{cp.task}',"
    out.puts "  'categories': #{cp.cats.inspect},"
    out.print "  'coordinates': [#{cp.x},#{cp.y}] }"
    out.puts "," unless i == checkpoints.length-1
  end
  out.print "]"
end
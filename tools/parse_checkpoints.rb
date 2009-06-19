require 'net/http'

class Checkpoint
  attr_accessor :number, :address, :task, :x, :y
  def initialize(number, address, task)
    @number, @address, @task = number, address, task
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
File.new('checkpoints.html').read.gsub("<br>\n", "<br>").each_line do |line|
  all, number, address, task = \
    *(/<li><strong>(\d\d)<\/strong>&nbsp;<address> (.+)<\/address><br>\s*(.+)<\/li>/.match(line))
  next unless $~
  checkpoints[number] = Checkpoint.new(number, address, task)
end

# Parse GPS
File.new('gps.txt').read.each_line do |line|
  all, num, x, y = *(/^(\d\d) N(\d{2}\.\d{5})-E0(\d{2}\.\d{5})/.match(line))
  next unless $~
  next unless checkpoints[num]
  checkpoints[num].x = x
  checkpoints[num].y = y
end

# Form json
checkpoints = checkpoints.values.sort { |a, b| a.number <=> b.number }
File.open('checkpoints.js', 'w') do |out|
  out.puts "(["
  checkpoints.each_with_index do |cp, i|
    out.puts "{ 'id': #{cp.number},"
    out.puts "  'name': '#{cp.address}',"
    out.puts "  'task': '#{cp.task}',"
    out.print "  'coordinates': [#{cp.x},#{cp.y}] }"
    out.puts "," unless i == checkpoints.length-1
  end
  out.print "]}"
end



    # Parse and fill results.js
  #   resfile.puts "{ 'category': '#{cat_names[index]}',"
  #   resfile.puts "'teams' : ["
  #   records = []
  #   page.each_line do |line| 
  #     line = line.gsub('<nobr>', '').gsub('</td><td>', '@').gsub("</td><td class = 'cr'>", '@').gsub(']|[', '][')
  #     line = line.gsub("<tr style='background: #FFFFFF;'>", '').gsub("<tr  class = 'yl'>", '')
  #     all, place, number, member1, member2, title, count, time, checkpoints = \
  #       *(/^<td>(\d+)@(\d+)@(.+)@(.*)@(.+)@(\d+)@(\d\d:\d\d:\d\d)@\[([@\[\]\d]+)\]@/.match(line))
  #     next unless $~
  #     title = title.gsub("'", "\\\\'")
  #     checkpoints = checkpoints.split(']@[').map{ |el| el.to_i }
  #     records << { :place => place, :number => number, :member1 => member1, :title => title, :count => count, :time => time, :checkpoints => checkpoints }
  #   end
  #   
  #   records.each_with_index do |record, j|
  #     resfile.puts "{ "
  #     resfile.puts "'number': #{record[:number]},", "'member1': '#{record[:member1]}',", "'member2': '#{record[:member2]}',", \
  #                  "'title': '#{record[:title]}',", "'count': #{record[:count]},", "'time': '#{record[:time]}',"
  #     resfile.puts "'checkpoints': #{record[:checkpoints].inspect}"
  #     resfile.print "}"
  #     resfile.puts "," unless j == records.length-1
  #   end
  #   resfile.print "] }"
  #   resfile.puts "," unless index == cat_keys.length-1
  # end  
  # resfile.puts "])"


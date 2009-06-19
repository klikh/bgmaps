require 'net/http'

cat_keys = [ 'b-l', 'b-p', 'v-l' , 'v-p' ]
cat_names = [ 'Бег Лайт', 'Бег Про', 'Вело Лайт', 'Вело Про' ]

File.open('results.js', 'w') do |resfile|
  resfile.puts "(["
  
  cat_keys.each_with_index do |page_key, index|
    # Save results from web-pages
    File.open("#{page_key}_cp1251.html", 'w') do |output|
      output.puts Net::HTTP.get('www.runcity.ru', "/events/nightinpushkin2009/result/#{page_key}/")
    end
    # Fix encoding
    system("iconv --from-code=CP1251 --to-code=UTF-8 #{page_key}_cp1251.html > #{page_key}.html")
    system("rm #{page_key}_cp1251.html")
  
    # Read from saved file
    page = ""
    File.open("#{page_key}.html", 'r') do |file|
      page = file.read
    end
  
    # Parse and fill results.js
    resfile.puts "{ 'category': '#{cat_names[index]}',"
    resfile.puts "'teams' : ["
    records = []
    page.each_line do |line| 
      line = line.gsub('<nobr>', '').gsub('</td><td>', '@').gsub("</td><td class = 'cr'>", '@').gsub(']|[', '][')
      line = line.gsub("<tr style='background: #FFFFFF;'>", '').gsub("<tr  class = 'yl'>", '')
      all, place, number, member1, member2, title, count, time, checkpoints = \
        *(/^<td>(\d+)@(\d+)@(.+)@(.*)@(.+)@(\d+)@(\d\d:\d\d:\d\d)@\[([@\[\]\d]+)\]@/.match(line))
      next unless $~
      title = title.gsub("'", "\\\\'")
      checkpoints = checkpoints.split(']@[').map{ |el| el.to_i }
      records << { :place => place, :number => number, :member1 => member1, :title => title, :count => count, :time => time, :checkpoints => checkpoints }
    end
    
    records.each_with_index do |record, j|
      resfile.puts "{ "
      resfile.puts "'number': #{record[:number]},", "'member1': '#{record[:member1]}',", "'member2': '#{record[:member2]}',", \
                   "'title': '#{record[:title]}',", "'count': #{record[:count]},", "'time': '#{record[:time]}',"
      resfile.puts "'checkpoints': #{record[:checkpoints].inspect}"
      resfile.print "}"
      resfile.puts "," unless j == records.length-1
    end
    resfile.print "] }"
    resfile.puts "," unless index == cat_keys.length-1
  end  
  resfile.puts "])"
end



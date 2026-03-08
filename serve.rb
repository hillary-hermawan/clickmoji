require 'webrick'
server = WEBrick::HTTPServer.new(
  Port: 8765,
  DocumentRoot: '/Users/hillaryhermawan/Documents/GitHub/experiments/.claude/worktrees/angry-lehmann'
)
trap('INT') { server.shutdown }
server.start

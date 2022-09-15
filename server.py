from http.server import BaseHTTPRequestHandler, HTTPServer
import os, sys

#system adaptations
#currently pyxfiles is windows - only
system, drives = sys.platform, ''
windows, linux = ['win32', 'cygwin'], ['linux']
launch_cmd = ''
localhost = 'http://127.0.0.1:8000'

if system in windows: 
    import ctypes
    
    launch_cmd = 'start ' + localhost
    drvmask = ctypes.windll.kernel32.GetLogicalDrives()
    
    for drive in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        if drvmask & 1: drives += drive+':/|'
        drvmask >>= 1
        
else:
    print('WARNING: UNKNOWN SYSTEM')
    

#host code
home = open('index.html').read().format(open('style.css').read(), open('client.js').read())

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        route = self.path
        print('ROUTE: ', route);
        
        if route == '/':
            self.default_response()
            self.wfile.write(home.encode())
            
        elif route == '/root/':
            self.default_response()
            self.wfile.write(drives.encode())
            
        else: 
            route = route[6:] #cuts off '/root/' in route 
            self.default_response()
            response = ''
            for path in os.listdir(route): response += path+'|'
            self.wfile.write(response.encode());
            
    def default_response(self, mime = 'text/plain'):
        self.send_response(200)
        #self.send_header('Content-type', mime)
        self.end_headers()

#launching
os.system(launch_cmd)

server = HTTPServer(('127.0.0.1', 8000), handler)
try: server.serve_forever()
except KeyboardInterrupt: server.server_close()

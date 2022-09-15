//dom syntax sugar
var make = e => document.createElement(e);
var add = (parent, child) => parent.appendChild(child);
var del = (parent, child) => parent.removeChild(child);
var addset = (parent, child) => child.forEach(el => {add(parent, el)});
var delset = (parent, child) => child.forEach(el => {del(parent, el)});

//important vars
var currdir = '/root/', dirsrc = [], host = 'http://127.0.0.1:8000';
var files = [];

//view
var divmain = make('div');
divmain.className = 'main';

var linedir = make('p');

add(divmain, linedir);

var divfiles = make('div');
divfiles.className = 'allfiles';

add(divmain, divfiles);

//some funcs
async function update_dir(){
	let request = await fetch(host + currdir), response = await request.text();
	dirsrc = response.split('|').slice(0, -1);
	
	if(currdir == '/root/'){
		linedir.innerHTML = 'pyxFiles v0.0.1 beta 1';
		listroot(dirsrc);
	}
	else {
		linedir.innerHTML = currdir.slice(1);
		listdir(dirsrc);
	}
}

function listroot(drives){
	delset(divfiles, files);
	files = [];
	drives.forEach(drive => {
		let root = make('div');
		files.push(root);
		root.className = 'file', root.id = drive;
		root.onclick = () => {currdir += root.id; update_dir();};
		
		let name = make('p');
		name.innerHTML = drive;
		add(root, name);
		
		add(divfiles, root);
	});
}

function listdir(paths){
	delset(divfiles, files);
	files = [];
	
	let away = make('div');
	files.push(away);
	away.className = 'file';
	away.onclick = () => {
		dirs = currdir.split('/').slice(0, -2), currdir = '';
		dirs.forEach(folder => {
			currdir += folder+'/';
		});
		console.log(currdir);
		update_dir();
	}
	
	let name = make('p');
	name.innerHTML = '< back';
	add(away, name);
	
	add(divfiles, away);
	
	paths.forEach(path => {
		let root = make('div');
		files.push(root);
		root.className = 'file', root.id = path+'/';
		root.onclick = () => {currdir += root.id; update_dir();};
		
		let name = make('p');
		name.innerHTML = path;
		add(root, name);
		
		add(divfiles, root);
	});
}

//launch
update_dir();

add(document.body, divmain);

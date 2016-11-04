// X, Y -> number of rows & number of columns in the maze
// start, end -> coordinates in the maze
var X, Y;
var start, end;
var maze = new Array();
for (var i = 0; i < X; i++) {
	maze[i] = new Array();
	for (var j = 0; j < Y; j++) {
		// maze[i][j] has path - 0 = top, 1 = right, 2 = bottom, 3 = left. 
		// Eg: maze[i][j] = [0, 1, 1, 0] = wall on the top and left edges
		maze[i][j] = [0, 0, 0, 0];				
	}
}

function initMaze(x, y) {
	X = x;
	Y = y;
	maze = new Array();
	for (var i = 0; i < X; i++) {
		maze[i] = new Array();
		for (var j = 0; j < Y; j++) {
			maze[i][j] = [0, 0, 0, 0];				
		}	
	}	
	start = [Math.floor(Math.random() * X), Math.floor(Math.random() * Y)];
	end = [Math.floor(Math.random() * X), Math.floor(Math.random() * Y)];
}

function bfs() {
	var vis = new Array();
	var route = new Array();
	for (var i = 0; i < X; i++) {
		vis[i] = new Array();
		route[i] = new Array();
		for (var j = 0; j < Y; j++) {
			vis[i][j] = false;	
			route[i][j] = 0;
		}	
	}

	var queue = []
	var s = start

	queue.push(s);
	vis[s[0]][s[1]] = true;
	route[s[0]][s[1]] = -100;

	while (queue.length > 0) {
		s = queue.shift();

		if (s[0] == end[0] && s[1] == end[1]) {
			route[s[0]][s[1]] = 100;
			break;	
		}

		var neighbors = getValidPathNeighbors(maze, vis, s);	

        while (neighbors.length) {
            // Choose the next neighbor
            next = neighbors.shift();
            
            // Mark the neighbor as visited and add it to the queue
            vis[next[0]][next[1]] = true;
			route[next[0]][next[1]] = 1;
			//printRoute(route, 'maze-bfs');
			//delay();
			queue.push(next);
        }
	}
	if (!vis[end[0]][end[1]]) {
		alert('Path not found');	
	}
	return route;
}

function dfs() {
	var vis = new Array();
	var route = new Array();
	for (var i = 0; i < X; i++) {
		vis[i] = new Array();
		route[i] = new Array();
		for (var j = 0; j < Y; j++) {
			vis[i][j] = false;
			route[i][j] = 0;	
		}	
	}
	
	dfsHelper(start, vis, route);
	return route;
}

function dfsHelper(s, vis, route) {
	if (s[0] == end[0] && s[1] == end[1]) {
		route[s[0]][s[1]] = 100;
		return true;	
	}
	if (s[0] == start[0] && s[1] == start[1]) {
		route[s[0]][s[1]] = -100;
	}
	else {
		route[s[0]][s[1]] = 2;
	}
	vis[s[0]][s[1]] = true;

    var neighbors = getValidPathNeighbors(maze, vis, s);	

	// If at least one valid neighboring cell has been found
	while (neighbors.length) {
		// Choose the first neighbor
		next = neighbors.shift();
		if (dfsHelper(next, vis, route))
			return true;
	}
	return false;
}

function getValidPathNeighbors(maze, vis, cell) {
	var pot = [];
	if (maze[cell[0]][cell[1]][0] == 1) {
		pot.push([cell[0]-1, cell[1]]);
	}
	if (maze[cell[0]][cell[1]][1] == 1) {
		pot.push([cell[0], cell[1]+1]);
	}
	if (maze[cell[0]][cell[1]][2] == 1) {
		pot.push([cell[0]+1, cell[1]]);
	}
	if (maze[cell[0]][cell[1]][3] == 1) {
		pot.push([cell[0], cell[1]-1]);
	}

	var neighbors = new Array(); 
	// Determine if each neighboring cell is in maze, and whether it has already been checked
	for (var l = 0; l < pot.length; l++) {
		if (pot[l][0] > -1 && pot[l][0] < X && pot[l][1] > -1 && pot[l][1] < Y && !vis[pot[l][0]][pot[l][1]]) { 
			neighbors.push(pot[l]); }
	}
	return neighbors; 
}

/* Start - Debugging functions

function printCellWall(i, j) {
	var op = ("Walls for cell (" + i + ", " + j + ") is { " + maze[i][j] + " }");
	document.body.innerHTML += op;
}

function printMazeWall() {
	var op = "";
	for (var i = 0; i < X; i++) {
		for (var j = 0; j < Y; j++) {
			op += ("{ " + maze[i][j] + " }");	
		}	
		op += " * ";
	}
	document.body.innerHTML += op;
}

function printRouteVal(route) {
	var op = "";
	for (var i = 0; i < X; i++) {
		for (var j = 0; j < Y; j++) {
			if (route[i][j] != 0) {
				op += ("[" + route[i][j] + "]");
			}
		}	
		op += " ~ ";
	}
	document.body.innerHTML += op;
}

function delay() {
	//console.log('delay start');
	for (var i = 0; ; i++) {
		if (i > 2 * 1000000000) {
			break;	
		}	
	}
	//console.log('delay end');
}

End - Debugging functions */

function printRoute(route, mazeId) {
	for (var i = 0; i < X; i++) {
        for (var j = 0; j < Y; j++) {
            var selector = mazeId + "-" + i + "-" + j;

			$('#'+selector).css('background', '#f2f2f2');
			
			// 1 -> bfs & 2 -> dfs
		    if (route[i][j] == 1) { $('#'+selector).css('background', '#acd1e9'); }
            if (route[i][j] == 2) { $('#'+selector).css('background', '#f9c5dc'); }
			// start -> -100 & end -> 100
            if (route[i][j] == -100) { $('#'+selector).css('background', '#51a39d'); }
            if (route[i][j] == 100) { $('#'+selector).css('background', '#b7695c'); }
        }
    }
}

function printMaze(mazeId) {
	for (var i = 0; i < X; i++) {
        $('#' + mazeId + ' > tbody').append("<tr>");
        for (var j = 0; j < Y; j++) {
            var selector = mazeId + "-" + i + "-" + j;
            //var selector = i + "-" + j;
            $('#' + mazeId + ' > tbody').append("<td id='"+selector+"'>&nbsp;</td>");
			$('#'+selector).css('background', '#f2f2f2');

			if (maze[i][j][0] == 0) { $('#'+selector).css('border-top', '2px solid black'); }
            if (maze[i][j][1] == 0) { $('#'+selector).css('border-right', '2px solid black'); }
            if (maze[i][j][2] == 0) { $('#'+selector).css('border-bottom', '2px solid black'); }
            if (maze[i][j][3] == 0) { $('#'+selector).css('border-left', '2px solid black'); }
			if (start[0] === i && start[1] === j) { $('#'+selector).css('background', 'blue'); }
            if (end[0] === i && end[1] === j) { $('#'+selector).css('background', 'red'); } 
        }
        $('#' + mazeId + ' > tbody').append("</tr>");
    }
}

function getAllValidNeighbors(maze, vis, cell) {
   // Determine neighboring cells
        var pot = [[cell[0]-1, cell[1], 0, 2],
                [cell[0], cell[1]+1, 1, 3],
                [cell[0]+1, cell[1], 2, 0],
                [cell[0], cell[1]-1, 3, 1]];
        var neighbors = new Array();
        
        // Determine if each neighboring cell is in maze, and whether it has already been checked
        for (var l = 0; l < 4; l++) {
            if (pot[l][0] > -1 && pot[l][0] < X && pot[l][1] > -1 && pot[l][1] < Y && !vis[pot[l][0]][pot[l][1]]) { 
				neighbors.push(pot[l]); }
        }
	return neighbors;
}

function newMaze(mazeId) {
    // Establish variables and starting grid
    var totalCells = X * Y;
    var vis = new Array();
    for (var i = 0; i < X; i++) {
        vis[i] = new Array();
        for (var j = 0; j < Y; j++) {
            vis[i][j] = false;
        }
    } 
    // Set a random position to start from
    var currentCell = [Math.floor(Math.random() * X), Math.floor(Math.random() * X)];
    var path = [currentCell];
    vis[currentCell[0]][currentCell[1]] = true;
    var visited = 1;
    
    // Loop through all available cell positions
    while (visited < totalCells) {

		var neighbors = getAllValidNeighbors(maze, vis, currentCell); 
        // If at least one active neighboring cell has been found
        if (neighbors.length) {
            // Choose one of the neighbors at random
            next = neighbors[Math.floor(Math.random()*neighbors.length)];
            
            // Remove the wall between the current cell and the chosen neighboring cell
            maze[currentCell[0]][currentCell[1]][next[2]] = 1;
            maze[next[0]][next[1]][next[3]] = 1;
            
            // Mark the neighbor as visited, and set it as the current cell
            vis[next[0]][next[1]] = true;
            visited++;
            currentCell = [next[0], next[1]];
            path.push(currentCell);
        }
        // Otherwise go back up a step and keep going
        else {
            currentCell = path.pop();
        }
    }
} 

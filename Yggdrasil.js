/*
File: Yggdrasil.js
Description: Object constructors and methods that run text based adventure, "Yggdrasil".
Team mates: Nathan Fahrner
			Ty Nakama
*/

// ### ----------------------------- Game Engine Object Constructor ---------------------------- ### //

/*
*/
function yggdrasil()
{
	//Set properties
	this.player = '';
	this.curWorld = '';
	this.worldMidgard = '';
	this.worldTest = '';
	
	//Set methods
	this.startGame = startGame;
	this.processCommand = processCommand;

	/*
	Description: Creates and sets world objects, then displays first room.
	Pre-conditions: Player object is created already, as well as the world objects.
	Post-Conditions: Starts game with fresh world object.
	*/
	function startGame()
	{
    //Create player
    player = createPlayer();
	
		//Create worlds
		worldTest = createTestWorld();
		worldMidgard = createMidgardWorld();
		
		//Set current world.
		curWorld = worldTest;
		
		alert(curWorld.name);
		
		//Display room
		displayRoom();
		
		//Process enter events
		processStartEvents();
	}
	
	/*
	Description: Processes command string.
	Pre-conditions: Command is a string, and room objects set up properly.
	Post-Conditions: Process command, or message user of invalid command.
	*/
	function processCommand(command)
	{
		//Change command to upper case and pad with spaces
		var cmd = fixString(command);

		//Process command specific events
		var found = processEvents(cmd);
		
		//If event was not fired, check standard commands.
		if( !found )
		{			
			//Check for move verb
			if( cmd.search(' MOVE ') != -1 )
			{
				var validMove = moveRoom(cmd);
			}
			//Else check for pick up verb (same as get)
			else if( cmd.search(' PICK UP ') != -1)
			{
				pickUpItem(cmd);
			}
			//Else check for get verb (same as pick up)
			else if( cmd.search(' GET ') != -1)
			{
				pickUpItem(cmd);
			}
			//Else check for drop verb 
			else if( cmd.search(' DROP ') != -1)
			{
				dropItem(cmd);
			}
			//Else check for view verb
			else if( cmd.search(' VIEW ') != -1)
			{
				//Check for inventory target noun (same as items)
				if( cmd.search(' INVENTORY ') != -1)
				{
					viewItems();
				}
				//Check for items target noun (same as inventory)
				else if( cmd.search(' ITEMS ') != -1)
				{
					viewIems();
				}
			}
			//Else check warp verb, only for Midgard
			else if( cmd.search(' WARP ') != -1)
			{
				//Verify in midgard
				if( curWorld.name == "Midgard" )
				{
					//Check if test world target
					if( cmd.search( ' TEST WORLD ') != -1)
					{
						//Move current world
						curWorld = worldTest;
						
						//Change start room
						curWorld.curRoom = worldTest.startRoom;
						
						//Set valid move flag, to process enter events
						validMove = true;
					}
				}
				//Else not in Midgard message user
				else
				{
					message("You can only warp in Midgard.");
				}
			}
			//Else check for reset verb
			else if( cmd.search(' RESET ') != -1)
			{
				resetGame();
			}		
			//Else message user of unknown command
			else
			{
				message('Unknown command.');
			}
		}
		
		//Clear command text box
		clearCommandText();
		
		//Display room
		displayRoom();
		
		//If valid move check for enter events
		if( validMove )
		{
			processStartEvents();
		}
	}
	
	/*
	Description: Displays room description and items contained.
	Pre-Conditions: Room object set up properly.
	Post-Conditions: Displays room info.
	*/
	function displayRoom()
	{
		//Display room description
		outputText(curWorld.curRoom.description);
		
		//Display items in room
		var len = curWorld.curRoom.items.length;
		for( var n = 0; n < len; n++ )
		{
			appendOutputText(curWorld.curRoom.items[n].description);
		}
	}
	
	/*
	Description: Moves current room based on NSEW directions. If no room in that direction, messages user.
	             If invalid direction, the user is also messaged. If direction is exit, moves to midgard level hub.
	Pre-Conditions: Command object has been fixed with white space padding, and world object constructed properly.
	Post-Conditions: Moves player to another room , moves player to midgard, or message user of invalid command. 
	                 Returns true if valid move.
	*/
	function moveRoom(cmd)
	{
		//Valid move flag
		var validMove = true;
		
		//Get direction from command, then 
		//change current room if valid direction. If direction contains
		//string 'EXIT', load midgard level hub.
		//If room not changed or not exited, validMove flag is set to false.
		if( cmd.search(' NORTH ') != -1)
		{
			if( curWorld.curRoom.north == 'EXIT' )
			{
				moveToMidgard();
			}
			else if( curWorld.curRoom.north != '' )
			{
				curWorld.curRoom = curWorld.curRoom.north;
			}
			else
				validMove = false;
		}
		else if( cmd.search(' SOUTH ') != -1)
		{
			if( curWorld.curRoom.south == 'EXIT' )
			{
				moveToMidgard();
			}
			else if( curWorld.curRoom.south != '' )
			{
				curWorld.curRoom = curWorld.curRoom.south;
			}
			else
				validMove = false;
		}
		else if( cmd.search(' WEST ') != -1)
		{
			if( curWorld.curRoom.west == 'EXIT' )
			{
				moveToMidgard();
			}
			else if( curWorld.curRoom.west != '' )
			{
				curWorld.curRoom = curWorld.curRoom.west;
			}
			else
				validMove = false;
		}
		else if( cmd.search(' EAST ') != -1)
		{
			if( curWorld.curRoom.east == 'EXIT' )
			{
				moveToMidgard();
			}
			else if( curWorld.curRoom.east != '' )
			{
				curWorld.curRoom = curWorld.curRoom.east;
			}
			else
				validMove = false;
		}
		//Else message user invalid direction
		else
		{
			message('Command is missing a direction, such as north, south, east, and west.');
		}
		
		//If validMove flag false message user that they cannot move in that direction
		if( !validMove )
		{
			message('Cannot move that direction.');
		}
		
		//Returns if true if move was valid.
		return validMove;
	}
	
	/*
	Description: Picks up item from room. Adds item to inventory, and removes it from room. 
	             If item is not found messages user.
	Pre-Conditions: Command object has been fixed with white space padding, and world object constructed properly.
	Post-Conditions: Picks up item from room.
	*/
	function pickUpItem(cmd)
	{
		//Cycle through items
		var found = false;
		var len = curWorld.curRoom.items.length;
		var item;
		
		
	
		for( var n = 0; ((n < len) && !found); n++ )
		{
			//Get item
			item = curWorld.curRoom.items[n];
			
			//Check if item is in command
			if( cmd.search(fixString(item.name)) != -1 )
			{
				found = true;
			}
		}
		
		//Verify found item in room
		if( found )
		{

			//Add to player items
			player.items.push(item);
			
			//Remove item from room
			var index = curWorld.curRoom.items.indexOf(item);
	    if( index != -1)
			{
				curWorld.curRoom.items.splice(index,1);
			}
		}
		//Else item not found, message user
		else
		{
			message('Item is not in current room.');
		}
	}
	
	/*
	Description: Drops item into current room, and removes from inventory.
	Pre-Conditions: Command object has been fixed with white space padding, and world object constructed properly.
	Post-Conditions: Drops item into room.
	*/
	function dropItem(cmd)
	{
		//Cycle through items
		var found = false;
		var len = player.items.length;
		var item;
	
		for( var n = 0; ((n < len) && !found); n++ )
		{
			//Get item
			item = player.items[n];
			
			//Check if item is in command
			if( cmd.search(fixString(item.name)) != -1 )
			{
				found = true;
			}
		}
		
		//Verify found item in inventory
		if( found )
		{
			//Add item to current room
			curWorld.curRoom.items.push(item);
			
			//Remove item from inventory
			var index = player.items.indexOf(item);
	    	if( index != -1)
			{
				player.items.splice(index,1);
			}
    	}
		//Else item not found, message user
		else
		{
			message('Item is not in inventory.');
		}
	}
	
	/*
	Description: Lists all items to user in a message.
	Pre-Conditions: Player object set up properly.
	Post-Conditions: Messages user an item list.
	*/
	function viewItems()
	{
		//Create message string
		var msg = ' ';
		
		//Cycle through items
		var len = player.items.length;
		for( var n = 0; n < len; n++ )
		{
			//Add item to message string
			msg += player.items[n].name + '\n';
		}
		
		//Message user item list
		message(msg);
	}
	
	/*
	Description: Resets game.
	Pre-Conditions: Game objects set up properly.
	Post-Conditions: Resets game, starts in first room.
	*/
	function resetGame()
	{
		message('Reseting game...');
		startGame();
	}

	/*
	Description: Pads the beginning and end of string with a white space, and makes it upper case.
	Pre-Conditions: str is a string.
	Post-Conditions: Returns updated string.
	*/
	function fixString(str)
	{
		return " " + str.toUpperCase() + " ";
	}
	
	/*
	Description: Changes current world to Midgard level hub.
	Pre-Conditions: World objects are set up properly
	Post-Conditions: Changes current world object, and starts in start room.
	*/
	function moveToMidgard()
	{
		//Change current world to midgard, and start at start room
		curWorld = worldMidgard;
		curWorld.curRoom = worldMidgard.startRoom;
	}
	
	/*
	Description: Process command triggered events, then deletes them if
               auto delete is on.
	Pre-Conditions: World objects are set up properly, and cmd has been fixed.
	Post-Conditions: Event action triggered, and maybe the event will be deleted.
	                 Returns true if event was triggered.
	*/
	function processEvents(cmd)
	{
    //Check commands specific to room
		var len = curWorld.curRoom.events.length;
		var found = false;
		var rCmd, event;

		for( var n = 0;((n < len) && !found); n++ )
		{
			//Get event and trigger command
			event = curWorld.curRoom.events[n];
			rCmd = event.triggerCmd;
	
			//Check for verb and object
			if( (cmd.search(fixString(rCmd.verb)) != -1) &&
                (cmd.search(fixString(rCmd.obj)) != -1) )
			{
			
								
				//Check if noun is needed, if not its '' and the command is found
				if( rCmd.noun == '' )
				{
					found = true;

				}
				//Else check if noun is present
				else
				{
					//Get item name
					var itemName = fixString(rCmd.noun);

					//If noun present mark found
					if( cmd.search(itemName) != -1 )
					{
						 //Check if item is in inventory
						 var len2 = player.items.length;
						 for( var i = 0; ((i < len2) && !found); i++ )
						 {
							if( player.items[i].name == rCmd.noun )
							{
							  found = true;
							 }

						 }
						 
						 //If not message player that item is not in inventory
						 if( !found )
						 {
							message('You do not have ' + itemName + ' in your inventory.');
						 }
					}
				}
			}
		}
		
		//Check if found trigger command
		if( found )
		{
			//Trigger event
			event.action();
			
			//Verify if auto delete is on
			if( event.autoDelete == true )
			{
	      //Remove event from room
        var index = curWorld.curRoom.events.indexOf(event);
        if( index != -1 )
        {
          curWorld.curRoom.events.splice(index,1);
        }
			}
		}
		
		//Return true if processed an event
		return found;
	}

  /*
	Description: Trigger events that start when entering a room.
	Pre-Conditions: World objects are set up properly.
	Post-Conditions: Trigger event, and deletes event if 
	                 auto delete property is true.
	*/
  function processStartEvents()
  {
      //Cycle through enter events
			var len = curWorld.curRoom.enterEvents.length;
			for( var c = 0; c < len; c++ )
			{
				//Trigger event code
				curWorld.curRoom.enterEvents[c].action();
			}
			
			//Remove all enter events with auto delete on
			var event;
			for( c = len - 1; c >= 0; c-- )
			{
          event = curWorld.curRoom.enterEvents[c];
          
          if( event.autoDelete == true )
          {
            curWorld.curRoom.enterEvents.splice(c,1);
          }
			}
  }
  
  /*
  Description: Asks user for player data.
  Pre-Conditions: None.
  Post-Conditions: Creates and returns player object.
  */
  function createPlayer()
  {
      //Ask user their name
      var name = prompt('What is your name?','');
      
      //Create initial items
      var items = [];
      
      //Create player
      return new player(name,items);
  }

// ### -------------------------------- Data Object Constructors ------------------------------- ### //

  /*
  Description: Player object constructor.
  Properties:
    name (string) - name of player
    items (array of item(s)) - items in inventory
  */
  function player(name,items)
  {
    this.name = name;
    this.items = items;
  }

  /*
  Description: Room object constructor.
  Properties:	
    description (string) - level description text
    north (room or string) - north room, '' if none, or 'EXIT' if exit
    south (room or string) - south room, '' if none, or 'EXIT' if exit
    east (room or string) - east room, '' if none, or 'EXIT' if exit
    west (room or string) - west room, '' if none, or 'EXIT' if exit
    items (array of item(s)) - array of available items in the room, or empty array if none
    events (array of events) - array of events in room that are triggered by commands
    enterEvents (array of events) array of events in room that are triggered when entering
  */
  function room(description, north, south, east, west, items, events, enterEvents)
  {
    this.description = description;
    this.north = north;
    this.south = south;
    this.east = east;
    this.west = west;
    this.items = items;
    this.enterEvents = enterEvents;
    this.events = events;
  }

  /*
  Description: World object constructor.
  Properties:
    name (string) - name of world
    startRoom (room) - starting room in world
    curRoom(room) - current room
  */
  function world(name,startRoom,curRoom)
  {
    this.name = name;
    this.startRoom = startRoom;
    this.curRoom = curRoom;
  }

  /*
  Description: Item object constructor.
  Properties:
    name (string) - name of object
    description (string) - description of object
  */
  function item(name,description)
  {
    this.name = name;
    this.description = description;
  }

  /*
  Description: Command object constructor. All stored in upper case.
  Properties:
    verb (string) - verb of command
    noun (string) - noun name used in command, if any, or '' if not used
    obj (string) - target of command
  */
  function command(verb,noun,obj)
  {
    this.verb = verb.toUpperCase();
    this.noun = noun.toUpperCase();
    this.obj = obj.toUpperCase();
  }

  /*
  Description: Event object constructor.
  Properties:
    name (string) - name of event, for reference purposes
    triggerCmd (command or string) - command that triggers event to be called, or '' if not used
    action ( code object ) - code to run during event
    autoDelete (boolean) - flag that indicates if event is deleted after completion
  */
  function event(name,triggerCmd,action,autoDelete)
  {
    this.name = name;
    this.triggerCmd = triggerCmd;
    this.action = action;
    this.autoDelete = autoDelete;
  }

 // ### ------------------------------------- Output Methods ------------------------------------ ### //

  /*
  Description: Outputs text into output area.
  Parameters:
    text (string) - text to output
  Pre-conditions: Text area with id 'roomDescription' exists.
  Post-conditions: Outputs text in the room description area.
  */
  function outputText(text)
  {
    document.getElementById('roomDescription').innerHTML = text;
  }

  /*
  Description: Adds text to current text in output area.
  Parameters:
    text (string) - text to append to output
  Pre-conditions: Text area with id 'roomDescription' exists.
  Post-conditions: Adds text to current text in output area.
  */
  function appendOutputText(text)
  {
    document.getElementById('roomDescription').innerHTML +=  ' ' + text;
  }

  /*
  Description: Clears command text box.
  Pre-conditions: Text area with id 'inputBox' exists.
  Post-conditions: Clears command text box.
  */
  function clearCommandText()
  {
    document.getElementById('inputBox').value = '';
  }

  /*
  Description: Message user, and places in a text box.
  Pre-conditions: Text area with id 'mainDisplay' exists.
  Post-Conditions: Appends message in message text area.
  */
  function message(msg)
  {
    document.getElementById('messageDisplay').innerHTML +=  msg + '<br>';
  }
    

 // ### ------------------------------------- World Creation ------------------------------------ ### //

  function test()
  {
    alert('event trigger');
  }

  function test2()
  {
    alert('event start');
  }

  function createMidgardWorld()
  {
    room1 = new room("Migard world...",'','','','',[],[],[]);
    return new world("Midgard",room1,room1);
  }

  function createTestWorld()
  {
    //Create items
    item1 = new item("BALL","A red ball.");
    item2 = new item("KEY","Key to castle door.");
    item3 = new item("KNIFE","A sharp knife.");
    
    
    //Create commands
    com3 = new command('RUN', 'ALL', 'TREE');
    eventT = new event("Event 1",com3,test,true);
    eventS = new event("Event 2",'',test2,true);

    
    //Create rooms
    room1 = new room("You are at the entrance of a dark castle. There is a locked door.",'',"EXIT",'','',[item1,item2],[eventT],[]);
    room2 = new room("You are in the foyer of an evil place...","","","","",[item3],[],[eventS]);
    
    //Link rooms
    room1.north = room2;
    room2.south = room1;
    
    //Create world object
    worldtest = new world("Test World",room1,room1);
    
    //Return world object
    return worldtest;
  }
}

/*
Description: Check if enter key was pressed in command string 
             text, then process command.
Pre-conditions: Text box with id 'inputBox' exists.
Post-Conditions: Enters command to game engine.
*/
function enterCheck(eventPress,game)
{
  var value = document.getElementById('inputBox').value;
  
  if( value != '' )
  {
    if( eventPress.keyCode == 13 )
    {
        game.processCommand(value);
    }
  }
}
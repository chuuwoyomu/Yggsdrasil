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
	this.worldVanaheim = '';
	this.worldJontunheim = '';
	this.worldMuspells = '';
	this.worldNiflheim = '';
	
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
		worldMidgard = createMidgardWorld();
		worldVanaheim = createVanaheimWorld();
		worldJotunheim = createJotunheimWorld();
		worldMuspells = createMuspellsWorld();
		worldNiflheim = createNiflheimWorld();
			
		//Set current world to Midgard
		curWorld = worldMidgard;
		
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
			//Else check for help verb
			else if( cmd.search(' HELP ') != -1 )
			{
				displayHelp(cmd);
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
					//Check if vanaheim world target
					else if( cmd.search( ' VANAHEIM ') != -1)
					{
						//Move current world
						curWorld = worldVanaheim;
						
						//Change start room
						curWorld.curRoom = worldVanaheim.startRoom;
						
						//Set valid move flag, to process enter events
						validMove = true;
					}
					//Check if vanaheim world target
					else if( cmd.search( ' JOTUNHEIM ') != -1)
					{
						//Move current world
						curWorld = worldJotunheim;
						
						//Change start room
						curWorld.curRoom = worldJotunheim.startRoom;
						
						//Set valid move flag, to process enter events
						validMove = true;
					}
					//Check if vanaheim world target
					
					else if( cmd.search( ' MUSPELLS ') != -1)
					{
						//Move current world
						curWorld = worldMuspells;
						
						//Change start room
						curWorld.curRoom = worldMuspells.startRoom;
						
						//Set valid move flag, to process enter events
						validMove = true;
					}
					else if( cmd.search( ' NIFLHEIM ') != -1)
					{
						//Move current world
						curWorld = worldNiflheim;
						
						//Change start room
						curWorld.curRoom = worldNiflheim.startRoom;
						
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
	
		//Process start events
		processStartEvents();
		
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
	Description: Displays help.
	Pre-Conditions: None.
	Post-Conditions: Displays help in messages box.
	*/
	function displayHelp(cmd)
	{
		message('*** HELP ***');
		message('Move <direction> - moves to another room, based on direction. Allows north, south, east, west.');
		message('Pick up <item> - picks up target item. Item must exist in room.');
		message('Get <item> - same as Pick Up, see above.');
		message('Drop <item> - drops item in room. Item must be inventory.');
		message('View inventory - displays items in inventory.');
		message('View items - same as View Inventory, see above.');
		message('Warp <world> - warps to target world. Can only use command in Midgard.');
		message('Reset - resets game.');
		message('*** END HELP ***');
	}
	
	/*
	Description: Lists all items to user in a message.
	Pre-Conditions: Player object set up properly.
	Post-Conditions: Messages user an item list.
	*/
	function viewItems()
	{
		//Display header
		message('*** INVENTORY ***');
		
		//Cycle through items
		var len = player.items.length;
		for( var n = 0; n < len; n++ )
		{
			//Display item name
			message( player.items[n].name );
		}
		
		//Display closer
		message('*** END INVENTORY ***');
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
			if( event.autoDelete )
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
		if( curWorld.curRoom.enterEvents[c].name == 'Guess Number Enter' )
			alert('here');
		curWorld.curRoom.enterEvents[c].action();
	}
			
	//Remove all enter events with auto delete on
	var event;
	for( c = len - 1; c >= 0; c-- )
	{
	  event = curWorld.curRoom.enterEvents[c];
			  
	  if( event.autoDelete )
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
    document.getElementById('messageDisplay').innerHTML =  msg + '<br><br>' 
        + document.getElementById('messageDisplay').innerHTML;
  }
    

 // ### ------------------------------------- World Creation ------------------------------------ ### //

	function createMidgardWorld()
	{
		//Create events
		g_startEvent = new event('Start Event','',
			function()
			{
				message('Welcome ' + player.name + '. I am Me\'mir. The world of Yggdrasil is in chaos. The twin jotun Glap and Greip are terrorizing the land of Asgard. The souls of the ' +
						'warriors who died in battle cannot rest in Asgard. They are ' + 
				        'so hard to defeat as one can revive the other, so they both must be defeated in one blow. The only weapon capable of doing this is ' + 
						'the legendary sword, Fragarach. It was shattered long ago, but the shards are scattered around Yggdrasil. Find the shards and bring them ' + 
						'to Volundr the blacksmith in Hel. With the sword you must travel to Asgard and defeat Glap and Greip.');
			},true);
			
		//Creates rooms
		g_room1 = new room("You are in Midgard. Me\'mir stands before you. He tells you that he can warp you to the different worlds in Yggdrasil.(Warp) You can go to " +
			"Vanaheim, " +
			"Jotunheim, Muspells, Niflheim",'','','','',[],[],[g_startEvent]);
			
		//Return new world object
		return new world("Midgard",g_room1,g_room1);
	}
  
	/*
	Description: Creates Vanaheim world objects. 
	Map:		4
          |
			6 - 3 -	5
          |
          1 -	2
	Items: 2 - Jewel to skip trickster riddle.
	       5 - Vault key to unlock door in room 3.
		   6 - Sword shard.
	Enter Events:	4 - Drauger appears and sends you back to Midgard.
					5 - Trickster appears and must be given a jewel or answered his riddle to leave vault key.
	Trigger Events: 5 - 'Give' 'Jewel' 'Trickster' makes trickster leave.
					5 - 'A' 'Stamp' makes trickster leave.
	Preconditions: None.
	Postconditions: Returns vanaheim world object.
	*/
	function createVanaheimWorld()
	{
		//Create items
		v_doorKey = new item('VAULT KEY',"Key to vault door was left by the trickster.(Vault Key)");
		v_jewel = new item('JEWEL',"A shiny jewel sparkles through the dirt.(Jewel)");
		v_swordShard = new item('SWORD SHARD','The sword shard lies on a pedistal.(Sword Shard)');
		
		//Create commands
		v_openDoor = new command('USE','VAULT KEY','DOOR');
		v_giveJewel = new command('GIVE','JEWEL','TRICKSTER');
		v_answerRiddle = new command('A','','STAMP');
		
		//Create events
		v_openDoorEvent = new event('Open vault door',v_openDoor,
			function()
			{
				v_room3.description = "You are in a deralict foyer. The vault door to the west is now open. (Door) The door on the east is open. A dark entryway lies to the north.";
				v_room3.west = v_room6;
			},true);
		v_tricksterEvent = new event('Trickster enter','',
			function()
			{
				appendOutputText('A trickster appears! (Trickster) It asks you for something shiny, or you must answer a riddle: What travels the world but stays in a corner?');
			},false);
		v_tricksterEventGive = new event('Trickster Give',v_giveJewel,v_removeTrickster,true);
		v_tricksterEventAnswer = new event('Trickster answer',v_answerRiddle,v_removeTrickster,true);
		v_drauger = new event('Drauger','',
			function()
			{
        message('A drauger jumps out of the darkness and knocks you unconious. You wake up in Midgard.');
				alert('A drauger jumps out of the darkness and knocks you unconious. You wake up in Midgard.');
				moveToMidgard();
				displayRoom();
			},false);
		
		//Event functions
		function v_removeTrickster()
		{
			message('The trickster ran away.');
			v_room5.description = "You are in a strange smelling room.";
			v_room5.items = [v_doorKey];
			v_room5.enterEvents = [];
			v_room5.events = [];
		}
		
		//Create rooms
		v_room1 = new room("You are in a dark forest. There is an overgrown stone archway to the north. A small break in the dense foilage is to the east. The portal to Midgard is to your south.",'','EXIT','','',[],[],[]);
		v_room2 = new room("You are in a small clearing surrounded by dense trees.",'','','','',[v_jewel],[],[]);
		v_room3 = new room("You are in a deralict foyer. There is a locked vault door to the west. The door on the east is open. An ominous dark entryway lies to the north.",'','','','',[],[v_openDoorEvent],[]);
		v_room4 = new room("You are in an empty storage room.",'','','','',[],[],[v_drauger]);
		v_room5 = new room("You are in a strange smelling room.",'','','','',[],[v_tricksterEventGive,v_tricksterEventAnswer],[v_tricksterEvent]);
		v_room6 = new room('You are in an ornate room.','','','','',[v_swordShard],[],[]);
		
		//Link rooms
		v_room1.east = v_room2;
		v_room1.north = v_room3;
		v_room2.west = v_room1;
		v_room3.south = v_room1;
		v_room3.north = v_room4;
		v_room3.east = v_room5;
		v_room4.south = v_room3;
		v_room5.west = v_room3;
		v_room6.east = v_room3;
		
		//Create and return new world
		return new world('Vanaheim',v_room1,v_room1);
	}
	
	/*
	Description: Creates Jotunheim world objects. 
	Map:		5
				|
			4 - 3 	8
				|	|
			1 -	2 -	6
					|
					7
	Items: 4 - Sling shot after winning rock paper sissors.
	       7 - Stone on ground.
		   8 - Sword shard.
	Enter Events:	4 - Rock paper sissor game with jotun, when you win leaves sling shot.
					5 - Gaint throws you to Midgard.
					6 - A giant blocks the bridge north. You must user sling shot and have a stone to beat him. If you move north while he is there he throws you to Midgard.
	Trigger Events: 4 - 'Play' 'Rock' plays rock in RPS
					4 - 'Play' 'Paper' plays paper in RPS
					4 - 'Play' 'Sissors' plays sissors in RPS
					6 - 'USe' 'sling shot' 'jotun' kills jotun on bridge.
					8 - sword shard
	Preconditions: None.
	Postconditions: Returns Jotunheim world object.
	*/
	function createJotunheimWorld()
	{
		//Create items
		j_sling = new item('SLING SHOT','The jotun left a sling shot for you.(Sling Shot)');
		j_stone = new item('STONE','A perfectly round stone lies on the ground.(Stone)');
		j_swordShard = new item('SWORD SHARD','A sword shard is held out in the statues hand.(Sword Shard)');
		
		//Create commands
		j_useSling = new command('USE','SLING SHOT','jotun');
		j_playRock = new command('PLAY','','ROCK');
		j_playPaper = new command('PLAY','','PAPER');
		j_playSissors = new command('PLAY','','SISSORS');
		j_moveBridge = new command('MOVE','','NORTH');
		
		//Create rock paper sissors text array
		rpsText = ['rock','paper','sissors'];
		
		//Create events
		j_playRPSEvent = new event('Rock paper sissors','',
			function()
			{
				appendOutputText('A jotun sits in the chair watching you. He tells you he will give you an item if you win a game of rock paper sissors.(PLAY)');
			},false);
		j_playRockEvent = new event('Play rock',j_playRock,
			function()
			{
				var play = Math.floor( Math.random() * 3);
				
				message('The jotun plays ' + rpsText[play] + '.');
				
				if( play == 2 )
				{
					message('Rock beats sissors. You win!');
					
					j_room4.enterEvents = [];
					j_room4.events = [];
					j_room4.items = [j_sling];
				}
				else if( play == 1 )
				{
					message('Paper beats rock. The jotun wins.');
				}
				else
				{
					message('Rock ties rock. No winner.');
				}
			},false);
		j_playPaperEvent = new event('Play paper',j_playPaper,
			function()
			{
				var play = Math.floor( Math.random() * 3);
				
				message('The jotun plays ' + rpsText[play] + '.');
				
				if( play == 0 )
				{
					message('Paper beats rock. You win!');
					
					j_room4.enterEvents = [];
					j_room4.events = [];
					j_room4.items = [j_sling];
				}
				else if( play == 2 )
				{
					message('Sissors beats paper. The jotun wins.');
				}
				else
				{
					message('Paper ties paper. No winner.');
				}
			},false);
		j_playSissorsEvent = new event('Play sissors',j_playSissors,
			function()
			{
				var play = Math.floor( Math.random() * 3);
				
				message('The jotun plays ' + rpsText[play] + '.');
				
				if( play == 1 )
				{
					message('Sissors beats paper. You win!');
					
					j_room4.enterEvents = [];
					j_room4.events = [];
					j_room4.items = [j_sling];
				}
				else if( play == 0 )
				{
					message('Rock beats sissors. The jotun wins.');
				}
				else
				{
					message('Sissors ties sissors. No winner.');
				}
			},false);
		j_jotunThrow = new event('jotun throw','',
			function()
			{
				alert('The jotun is angry with you. He picks you up and throws you to Midgard.');
				moveToMidgard();
				displayRoom();
			},false);
		j_jotunThrow2 = new event('jotun throw bridge',j_moveBridge,
			function()
			{
        message('The jotun throws you off the bridge. You wake up in Midgard.');
				alert('The jotun throws you off the bridge. You wake up in Midgard.');
				moveToMidgard();
				displayRoom();
			},false);
		j_jotunBarrier = new event('jotun barrier','',
			function()
			{
				appendOutputText('A jotun stands guard on the bridge.(Jotun)');
			},false);
		j_useSlingShot = new event('Use sling shot',j_useSling,
			function()
			{
				if( player.items.indexOf(j_stone) != - 1)
				{
					message('The stone hits the jotun in the forehead and kills him.');
					
					j_room6.enterEvents = [];
					j_room6.events = [];
					
					var index = player.items.indexOf(j_stone);
					if( index != -1)
					{
						player.items.splice(index,1);
					}
				}
				else
				{
					message('You need a stone to use in your sling shot.');
				}
			},false);
			
		//Create room objects
		j_room1 = new room('An archway stands before you on the east, that no man could have built. The portal to Midgard lies to the west.','','','','EXIT',[],[],[]);
		j_room2 = new room('A giant hallway runs north. Large archways built by jotun lie to your west and east.','','','','',[],[],[]);
		j_room3 = new room('The hallway continues north and south. A large door lies to the west.','','','','',[],[],[]);
		j_room4 = new room('Your in a room with a giant chair in the middle.','','','','',[],[j_playRockEvent,j_playPaperEvent,j_playSissorsEvent],[j_playRPSEvent]);
		j_room5 = new room('The hallway continues north seemingly endless.','','','','',[],[],[j_jotunThrow]);
		j_room6 = new room('Your in a room with a vaulted ceiling, so large it has its own weather. There are doors to the south and west. A large bridge runs to the north.','','','','',[],[j_jotunThrow2,j_useSlingShot],[j_jotunBarrier]);
		j_room7 = new room('Your in a room still under construction. There is a door to the north.','','','','',[j_stone],[],[]);
		j_room8 = new room('Your in some sort of shrine. A large stone jotun statue is before you.','','','','',[j_swordShard],[],[]);
		
		//Line rooms
		j_room1.east = j_room2;
		j_room2.west = j_room1;
		j_room2.north = j_room3;
		j_room2.east = j_room6;
		j_room3.north = j_room5;
		j_room3.west = j_room4;
		j_room3.south = j_room2;
		j_room4.east = j_room3;
		j_room5.south = j_room3;
		j_room6.west = j_room2;
		j_room6.south = j_room7;
		j_room6.north = j_room8;
		j_room7.north = j_room6;
		j_room8.south = j_room6;
		
		//Create and return world
		return new world('jotunheim',j_room1,j_room1);
	}
	
	/*
	Description: Creates muspells world.
	Map:          6
                |
            3   5 - 7
            |   |
        8 - 2 - 4
            |
            1
  Events: 2 - Dice Game: 'ROLL DICE' opens path to west room on win, sends back to Midgard on loss.
          5 - 'USE' <BLUE LAMP, GREEN LAMP, RED LAMP' <LEFT TORCH, MIDDLE TORCH, RIGHT TORCH>
                Lights torches with corisponding color
          5 - 'PULL LEVER' Tests combinations. If lit in order Blue, Red Green, opens east door.
               Else sends back to Midgard.
  Items:  3 - Green Lamp
          4 - Blue Lamp
          6 - Red Lamp
  Pre-conditions: None.
  Post-conditions: Creates muspells world object, and returns it.
	*/
  function createMuspellsWorld()
	{
    //Global helper variables
    m_torches = [0,0,0];
   	
    //Create items
    m_blueLamp = new item('BLUE LAMP','There is a lamp with a blue flame on a pedistal.(Blue Lamp)');
    m_greenLamp = new item('GREEN LAMP','There is a lamp with a green flame on a pedistal.(Green Lamp)');
    m_redLamp = new item('RED LAMP','There is a lamp with a red flame on a pedistal.(Red Lamp)');
    m_swordShard = new item('SWORD SHARD','In one of its claws it clutches a sword shard.(Sword Shard)');
    m_leftTorch = new item('LEFT TORCH','');
    m_middleTorch = new item('MIDDLE TORCH','');
    m_rightTorch = new item('RIGHT TORCH','');
    
    //Create commands
    m_placeRedLampLeft = new command('USE','RED LAMP','LEFT TORCH');
    m_placeRedLampMiddle = new command('USE','RED LAMP','MIDDLE TORCH');
    m_placeRedLampRight = new command('USE','RED LAMP','RIGHT TORCH');
    m_placeBlueLampLeft = new command('USE','BLUE LAMP','LEFT TORCH');
    m_placeBlueLampMiddle = new command('USE','BLUE LAMP','MIDDLE TORCH');
    m_placeBlueLampRight = new command('USE','BLUE LAMP','RIGHT TORCH');
    m_placeGreenLampLeft = new command('USE','GREEN LAMP','LEFT TORCH');
    m_placeGreenLampMiddle = new command('USE','GREEN LAMP','MIDDLE TORCH');
    m_placeGreenLampRight = new command('USE','GREEN LAMP','RIGHT TORCH');
    m_pullLever = new command('PULL','','LEVER');
    m_rollDice = new command('ROLL','','DICE');
    
    //Create events
    m_placeRedLeftEvent = new event('Ligth left torch red',m_placeRedLampLeft,
      function()
      {
          m_leftTorch.description = 'The left lamp is lit with a red flame.';
          m_torches[0] = 1;
      },false);
    m_placeRedMiddleEvent = new event('Ligth middle torch red',m_placeRedLampMiddle,
      function()
      {
          m_middleTorch.description = 'The middle lamp is lit with a red flame.';
          m_torches[1] = 1;
      },false);
    m_placeRedRightEvent = new event('Ligth right torch red',m_placeRedLampRight,
      function()
      {
          m_rightTorch.description = 'The right lamp is lit with a red flame.';
          m_torches[2] = 1;
      },false);
      
    m_placeBlueLeftEvent = new event('Ligth left torch blue',m_placeBlueLampLeft,
      function()
      {
          m_leftTorch.description = 'The left lamp is lit with a blue flame.';
          m_torches[0] = 3;
      },false);
    m_placeBlueMiddleEvent = new event('Ligth middle torch blue',m_placeBlueLampMiddle,
      function()
      {
          m_middleTorch.description = 'The middle lamp is lit with a blue flame.';
          m_torches[1] = 3;
      },false);
    m_placeBlueRightEvent = new event('Ligth right torch blue',m_placeBlueLampRight,
      function()
      {
          m_rightTorch.description = 'The right lamp is lit with a blue flame.';
          m_torches[2] = 3;
      },false);
      
    m_placeGreenLeftEvent = new event('Ligth left torch green',m_placeGreenLampLeft,
      function()
      {
          m_leftTorch.description = 'The left lamp is lit with a green flame.';
          m_torches[0] = 2;
      },false);
    m_placeGreenMiddleEvent = new event('Ligth middle torch green',m_placeGreenLampMiddle,
      function()
      {
          m_middleTorch.description = 'The middle lamp is lit with a green flame.';
          m_torches[1] = 2;
      },false);
    m_placeGreenRightEvent = new event('Ligth right torch green',m_placeGreenLampRight,
      function()
      {
          m_rightTorch.description = 'The right lamp is lit with a green flame.';
          m_torches[2] = 2;
      },false); 
      
    m_pullLeverEvent = new event('Pull Lever',m_pullLever,
          function()
          {

              if( (m_torches[0] == 3) && (m_torches[1] == 1) && (m_torches[2] == 2) )
              {
                  message('The door has opened.');
                  m_room5.description = 'Your on a bute surrounded by lava. There is a stone circle on the ground with three '
                        + 'torches and a lever on it. The door to the east is now open. There is a '
                        + 'rope bridge to the north and south.';
                  m_room5.events = [];
                  m_room5.east = m_room7;
                  
              }
              else
              {
                  message('A pillar of lava pushes the floor into the sky. You wake up in Midgard.');
                  alert('A pillar of lava pushes the floor into the sky. You wake up in Midgard.');
                  m_torches[0] = 0;
                  m_torches[1] = 0;
                  m_torches[2] = 0;
                  m_leftTorch.description = '';
                  m_middleTorch.description = '';
                  m_rightTorch.description = '';
                  moveToMidgard();
                  displayRoom();
              }
          },false);
          
    m_diceGameEvent = new event('Dice Game',m_rollDice,
          function()
          {
              var proll1 = Math.floor((Math.random() * 6) + 1);
              var proll2 = Math.floor((Math.random() * 6) + 1);
              var proll3 = Math.floor((Math.random() * 6) + 1);
              var eroll1 = Math.floor((Math.random() * 6) + 1);
              var eroll2 = Math.floor((Math.random() * 6) + 1);
              var eroll3 = Math.floor((Math.random() * 6) + 1);
              var psum = proll1 + proll2 + proll3;
              var esum = eroll1 + eroll2 + eroll3;
              
              message('You roll ' + proll1 + ', ' + proll2 + ', ' + proll3 + '. Your total is ' + psum + '.');
              message('The imp rolls ' + eroll1 + ', ' + eroll2 + ', ' + eroll3 + '. Its total is ' + esum + '.');
              
              if( psum > esum )
              {
                message('You win! The imp reconnects the rope bridge.');
                m_room2.description = 'You are in a dark cave lit only by the surrounding lava. The are rope ' +
                'bridges to the north and south. The rope bridge leading west is now connected.';
                m_room2.events = [];
                m_room2.west = m_room8;
              }
              else if( psum == esum )
              {
                message('Its a tie. Play again.');
              }
              else
              {
                message('You lose. The imp sends you back to Midgard.');
                alert('You lose. The imp sends you back to Midgard.');
                moveToMidgard();
                displayRoom();
              }
              
              
          },false);
    
    //Create rooms
    m_room1 = new room('You are on a cliff surrounded by lava. A rope bridge leads north.','','EXIT','','',[],[],[]);
     m_room2 = new room(
      'You are in a dark cave lit only by the surrounding lava. The are rope bridges to the north and south. ' +
      'There is a broken rope bridge hanging, leading to the west. An Imp stands on the west edge. He tells ' +
      'you he will repair the bridge if you win a dice game.(ROLL DICE) He tells you if you lose he will ' +
      'send you back to Midgard.' ,'','','','',[],[m_diceGameEvent],[]);
    m_room3 = new room('Your on a large rock, surrounded by lava. Lava pours from the ceiling. There is a pedistal ' +
                        'sticking out of the rock.','','','','',[m_greenLamp],[],[]);
    m_room4 = new room(
      'You are on a platform jutting out of a sea of lava. There is a rope bridge leading north, and west.',
      '','','','',[m_redLamp],[],[]);
    m_room5 = new room('Your on a bute surrounded by lava. There is a stone circle on the ground with three '
                        + 'torches and a lever on it. (Left Torch, Middle Torch, Right Torch, Lever) There is a sealed stone door to the east. There is a '
                        + 'rope bridge to the north and south.','','','','',[m_leftTorch,m_middleTorch,m_rightTorch],
                        [m_placeRedLeftEvent,m_placeRedMiddleEvent,m_placeRedRightEvent,
                        m_placeBlueLeftEvent,m_placeBlueMiddleEvent,m_placeBlueRightEvent,
                        m_placeGreenLeftEvent,m_placeGreenMiddleEvent,m_placeGreenRightEvent,m_pullLeverEvent],
                        []);
    m_room6 = new room(
      'You are in a small cave, lit by the glow of the lava behind you. A pedistal lies in the room.','','','','',
      [m_blueLamp],[],[]);
    m_room7 = new room(
      'There is a giant statue of phenix before you. ','','','','',[m_swordShard],[],[]);
    m_room8 = new room(
      'Your on a small platform. On the floor an inscriptions reads: Blue Red Green, then pull lever.','','','','',[],[],[]);
      
    //Link rooms
    m_room1.north = m_room2;
    //m_room2.west = m_room8;
    m_room2.south = m_room1;
    m_room2.north = m_room3;
    m_room2.east = m_room4;
    m_room3.south = m_room2;
    m_room4.west = m_room2;
    m_room4.north = m_room5;
    m_room5.south = m_room4;
    m_room5.north = m_room6;
    //m_room5.east = m_room7;
    m_room6.south = m_room5;
    m_room7.west = m_room5;
    m_room8.east = m_room2;
    
    //Create world 
    return new world('Muspells',m_room1,m_room1);

	}
	
	/*
	Description: Creates muspells world.
	Map:    8      	
			|		
			7 - 5 - 6 
				|   
			1 - 2 - 4
				|
				3
	  Events: 3 - Coin game, drops large token on completion.
			  3 - 'FLIP' 'COINS' to play
			  7 - Guess number game. The more tokens the less digits to remember.
			  7 - 'VIEW' 'NUMBER' views randomly generated number with varying digits
			  7 - 'GUESS' 'NUMBER' guess a number.
	  Items:  3 - Large token after wolf event
			  4 - token
			  6 - token
			  8 - sword shard
	  Pre-conditions: None.
	  Post-conditions: Creates Niflheim world object, and returns it.
	*/
	function createNiflheimWorld()
	{
		//create items
		n_token1 = new item('LARGE TOKEN','A token lies on the ice.(Large Token)');
		n_token2 = new item('TOKEN','A token is embeded on the ice.(Token)');
		n_token3 = new item('TOKEN','A shiny token catches your eye.(Token)');
		n_swordShard = new item('SWORD SHARD','A sword shard is stuck in an ice stelagtite.(Sword Shard)');
		
		//Create commands
		n_flipCoin = new command('FLIP','','COINS');
		n_guessNumber = new command('GUESS','','NUMBER');
		n_viewNumber = new command('VIEW','','NUMBER');
		
		//Create events
		n_flipCoinEnterEvent = new event('Flip Coin Enter','',
			function()
			{
				appendOutputText('A wolf made of ice jeers at you. It asks you to flip three coins. If you get three heads it will give you a token.(Flip Coins)');
			},false);
		n_flipCoinEvent = new event('Flip Coin Game',n_flipCoin,
			function()
			{
				var coin1 = (Math.floor( Math.random() * 2 ) == 1) ? 'H' : 'T';
				var coin2 = (Math.floor( Math.random() * 2 ) == 1) ? 'H' : 'T';
				var coin3 = (Math.floor( Math.random() * 2 ) == 1) ? 'H' : 'T';
				var total = 0;
				
				message( 'You flipped ' + coin1 + ', ' + coin2 + ', ' + coin3 + '.');
				
				if( coin1 == 'H' )
					total++;
				if( coin2 == 'H' )
					total++;
				if( coin3 == 'H' )
					total++;
					
				if( total > 1 )
				{
					message('You win! The ice wolf drops a token.');
					n_room3.items = [n_token1];
					n_room3.events = [];
					n_room3.enterEvents = [];
					
				}
				else
				{
					message('You lose. The wolf just grins at you.');
				}
				
				
			}
			,false);
		n_guessNumberEnterEvent = new event('Guess Number Enter','',
			function()
			{
				appendOutputText('Its hand blocks the north path. He tells you he will let you pass if you can remeber his number.(VIEW NUMBER,GUESS NUMBER) He tells you the number ' +
					'will be smaller if you have tokens.');
				
			}
			,false);
		n_guessNumberInitNumEvent = new event('Init num','',
			function()
			{
				num = -1;
			},true);
		n_viewNumberEvent = new event('View Number',n_viewNumber,
			function()
			{
				var len = player.items.length;
				var tokens = 0;
				var bigToken = 0;
				for( var n = 0; n < len; n++ )
				{
					if( player.items[n].name === 'TOKEN' )
						tokens++;
						
					if( player.items[n].name === 'LARGE TOKEN')
						bigToken++;
				}
				
				var digits = 10 - ( tokens) - ( 2 * bigToken );
				num = Math.floor( Math.random() * ( Math.pow(10,digits) - Math.pow(10,digits - 1) ) ) + Math.pow(10,digits - 1);
				
				myWindow = window.open("","Number","width=200,height=100, titlebar=no, top=300, left=500");
				myWindow.document.write(num);
				setTimeout(function(){myWindow.close();},1000);
			},false);
		n_guessNumberEvent = new event('Guess Number Game',n_guessNumber,
			function()
			{
				if( num == -1 )
				{
					message('First VIEW a NUMBER.');
				}
				else
				{
					var guess = parseFloat( prompt('Enter Number:','') );
					if( guess == num )
					{
						message('You win! The ice jotun moves his hand.');
						
						n_room7.events = [];
						n_room7.startEvents = [];
						n_guessNumberEnterEvent.action = new function(){ };
						n_room7.north = n_room8;
						displayRoom();
					}
					else
					{
						message('Wrong guess. View another number.');
					}
				}
			}
			,false);
			
		//Create rooms
		n_room1 = new room('Your in a forest covered in ice. A slick passage lies to the east. A path way to the Ash Tree lies to the west.','','','','EXIT',[],[],[]);
		n_room2 = new room('Your in a open clearing, with paths in all four directions.','','','','',[],[],[]);
		n_room3 = new room('Your in a dead end, the cold forest is thick around you.','','','','',[],[n_flipCoinEvent],[n_flipCoinEnterEvent]);
		n_room4 = new room('Snow drifts block your way, your in a dead end.','','','','',[n_token3],[],[]);
		n_room5 = new room('The icey path splits east and west.','','','','',[],[],[]);
		n_room6 = new room('A large frozen lake streches before you for miles.','','','','',[n_token2],[],[]);
		n_room7 = new room('A snow covered stone building emerges in your sight. A ice jotun\'s head pops over the side of the building and stares at you.','','','',''
							,[],[n_guessNumberEvent,n_viewNumberEvent],[n_guessNumberEnterEvent,n_guessNumberInitNumEvent]);
		n_room8 = new room('Water leaked inside the building and froze over. Icy stallegtites hang from the ceiling.','','','','',[n_swordShard],[],[]);
		
		//Link rooms
		n_room1.east = n_room2;
		n_room2.south = n_room3;
		n_room2.west = n_room1;
		n_room2.east = n_room4;
		n_room2.north = n_room5;
		n_room3.north = n_room2;
		n_room4.west = n_room2;
		n_room5.south = n_room2;
		n_room5.east = n_room6;
		n_room5.west = n_room7;
		n_room6.west = n_room5;
		n_room7.east = n_room5;
		n_room8.south = n_room7;
		
		//Return new world object
		return new world('NIFLHEIM',n_room1,n_room1);
	}
	
	function createSvartWorld()
	{
	}
	
	// END OF YGGDRASIL OBJECT //
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
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
    document.getElementById('messageDisplay').innerHTML +=  msg + '<br>';
  }
    

 // ### ------------------------------------- World Creation ------------------------------------ ### //

	function createMidgardWorld()
	{
		//Create events
		m_startEvent = new event('Start Event','',
			function()
			{
				message('Welcome ' + player.name + '. I am Me\'mir. The world of Yggdrasil is in chaos. The twin jotun Glap and Greip are terrorizing the land of Asgard. The souls of the ' +
						'warriors who died in battle cannot rest in Asgard. They are ' + 
				        'so hard to defeat as one can revive the other, so they both must be defeated in one blow. The only weapon capable of doing this is ' + 
						'the legendary sword, Fragarach. It was shattered long ago, but the shards are scattered around Yggdrasil. Find the shards and bring them ' + 
						'to Volundr the blacksmith in Hel. With the sword you must travel to Asgard and defeat Glap and Greip.');
			},true);
			
		//Creates rooms
		m_room1 = new room("You are in Midgard. Me\'mir stands before you. He tells you that he can warp you to the different worlds in Yggdrasil.(Warp) You can go to " +
			"Vanaheim, " +
			"Jotunheim, ",'','','','',[],[],[m_startEvent]);
			
		//Return new world object
		return new world("Midgard",m_room1,m_room1);
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
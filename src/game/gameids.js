'use strict';

/* Provide game-specific values for the gamedat_ids global object.
   These functions are called from gamedat.js at script-load time.

   This is the only hand-written file in the src/games directory.
*/

/* Set up values that apply to the Z-machine generally.
 */
function gamedat_ids_general(gamedat_ids)
{
    gamedat_ids.GAMEID = 'zork1-r88-s840726';
    gamedat_ids.MAX_OBJECTS = 250;         // "Object count"
    gamedat_ids.MAX_GLOBALS = 158;         // 1+LastGlobal
    gamedat_ids.DICT_START = 15137;        // header word $08
    gamedat_ids.DICT_WORD_SIZE = 7;
    gamedat_ids.PROP_TABLE_START = 0x0BB8; // prop address for first obj
    gamedat_ids.PROP_TABLE_END = 0x2270;   // just before globals, header $0C-1
}

/* Set up values defined in the ZIL code. This must be called after
   gamedat.js sets up all the data maps.
 */
function gamedat_ids_specific(gamedat_ids)
{
    gamedat_ids.C_TABLE_LEN = gamedat_constant_names.get('C-TABLELEN').value;
    
    gamedat_ids.ROOMS = gamedat_object_names.get('ROOMS').onum;
    gamedat_ids.GLOBAL_OBJECTS = gamedat_object_names.get('GLOBAL-OBJECTS').onum;
    gamedat_ids.LOCAL_GLOBALS = gamedat_object_names.get('LOCAL-GLOBALS').onum;
    gamedat_ids.ADVENTURER = gamedat_object_names.get('ADVENTURER').onum;
    gamedat_ids.THIEF = gamedat_object_names.get('THIEF').onum;
    gamedat_ids.TROLL = gamedat_object_names.get('TROLL').onum;
    gamedat_ids.STARTROOM = gamedat_object_names.get('WEST-OF-HOUSE').onum;
    gamedat_ids.PSEUDO_OBJECT = gamedat_object_names.get('PSEUDO-OBJECT').onum;

    /* Ordering of objects in the World pane. This doesn't change much between
       games, but we handle it as game-specific code just in case.
    */
    for (let obj of window.gamedat_objects) {
        /* The global container itself counts as a global for our purposes. */
        if (obj.origparent == gamedat_ids.GLOBAL_OBJECTS || obj.onum == gamedat_ids.GLOBAL_OBJECTS)
            gamedat_object_global_ids.add(obj.onum);
        
        if (obj.isroom)
            gamedat_object_treesort.set(obj.onum, 1);
        else if (obj.name == 'PSEUDO-OBJECT')
            gamedat_object_treesort.set(obj.onum, 3);
        else if (gamedat_object_global_ids.has(obj.onum))
            gamedat_object_treesort.set(obj.onum, 4);
        else
            gamedat_object_treesort.set(obj.onum, 2);
    }
}

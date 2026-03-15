
/* Parse the JSON data files into a variety of useful maps and lists.

   We do this as soon as the .js files load. There's no DOM work here.
   But note that gamedat.js must be loaded after all the other JSON-data
   .js files!
 */

window.gamedat_global_nums = new Map();
window.gamedat_global_names = new Map();
window.gamedat_globals_sort_index = [];
window.gamedat_globals_sort_alpha = [];
window.gamedat_constant_names = new Map();
window.gamedat_object_ids = new Map();
window.gamedat_object_names = new Map();
window.gamedat_object_room_ids = new Set();
window.gamedat_object_global_ids = new Set();
window.gamedat_object_treesort = new Map();
window.gamedat_string_map = new Map();
window.gamedat_dictword_addrs = new Map();
window.gamedat_dictword_adjs = new Map();
window.gamedat_preposition_nums = new Map();
window.gamedat_grammar_verbnums = new Map();
window.gamedat_grammar_lines = [];
window.gamedat_grammar_line_addrs = new Map();
window.gamedat_routine_addrs = new Map();
window.gamedat_routine_names = new Map();
window.gamedat_table_addrs = new Map();
window.gamedat_property_nums = new Map();
window.gamedat_property_names = new Map();
window.gamedat_attribute_nums = new Map();
window.gamedat_attribute_names = new Map();
window.gamedat_roominfo_names = new Map();

window.gamedat_ids = {};

(function() {
    gamedat_ids_general(gamedat_ids);

    for (let obj of window.gamedat_properties) {
        gamedat_property_nums.set(obj.num, obj);
        gamedat_property_names.set(obj.name, obj);
    }
    
    for (let obj of window.gamedat_attributes) {
        gamedat_attribute_nums.set(obj.num, obj);
        gamedat_attribute_names.set(obj.name, obj);
    }
    
    for (let obj of window.gamedat_constants) {
        gamedat_constant_names.set(obj.name, obj);
    }

    for (let obj of window.gamedat_globals) {
        if (gamedat_global_names.has(obj.name))
            continue;
        gamedat_global_nums.set(obj.num, obj);
        gamedat_global_names.set(obj.name, obj);
        gamedat_globals_sort_index.push(obj);
        gamedat_globals_sort_alpha.push(obj);
    }
    gamedat_globals_sort_index.sort((g1, g2) => {
        return g1.num - g2.num;
    });
    gamedat_globals_sort_alpha.sort((g1, g2) => {
        if (g1.name < g2.name) return -1;
        if (g1.name > g2.name) return 1;
        return 0;
    });
    
    for (let obj of window.gamedat_objects) {
        gamedat_object_ids.set(obj.onum, obj);
        gamedat_object_names.set(obj.name, obj);
        if (obj.isroom)
            gamedat_object_room_ids.add(obj.onum);

    }
    
    for (let tup of window.gamedat_strings) {
        gamedat_string_map.set(tup[0], { text:tup[1], sourceloc:tup[2] });
    }

    for (let obj of window.gamedat_dictwords) {
        gamedat_dictword_addrs.set(gamedat_ids.DICT_START + obj.num * gamedat_ids.DICT_WORD_SIZE, obj);
        if (obj.flags.includes('A'))
            gamedat_dictword_adjs.set(obj.adjnum, obj);
    }

    for (let obj of window.gamedat_grammar) {
        gamedat_grammar_verbnums.set(obj.num, obj);
        for (let ln of obj.lines) {
            gamedat_grammar_lines.push(ln);
            gamedat_grammar_line_addrs.set(ln.addr, ln);
        }
    }

    for (let obj of window.gamedat_prepositions) {
        gamedat_preposition_nums.set(obj.num, obj);
    }
    
    for (let obj of window.gamedat_routines) {
        gamedat_routine_addrs.set(obj.addr, obj);
        gamedat_routine_names.set(obj.name, obj);
    }

    for (let obj of window.gamedat_tables) {
        gamedat_table_addrs.set(obj.addr, obj);
    }

    gamedat_ids_specific(gamedat_ids);

    gamedat_ids.MAP_DOCSIZE = window.gamedat_mapinfo.docsize;
    gamedat_ids.MAP_VIEWSIZE = window.gamedat_mapinfo.viewsize;
    for (let obj of window.gamedat_mapinfo.rooms) {
        obj.center = { x: obj.x + 0.5*obj.width, y: obj.y + 0.5*obj.height };
        obj.bottom = { x: obj.x + obj.width, y: obj.y + obj.height };
        gamedat_roominfo_names.set(obj.name, obj);
    }
  
})();

